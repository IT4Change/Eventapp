# -*- coding: utf-8 -*-
"""Mini-Server für das Event-Datentool (nur Python-Standardbibliothek).

Start:  python3 Tool/server.py   →  http://localhost:8765
Liest/schreibt Daten/soulandbliss.db, Bilder in Daten/images/.
"""
import base64, csv, io, json, re, sqlite3
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE = Path(__file__).resolve().parent
DATEN = BASE.parent / "Daten"
DB = DATEN / "soulandbliss.db"
IMAGES = DATEN / "images"
PORT = 8765

EDITABLE = [
    "name", "beschreibung_kurz", "kategorie", "subkategorie",
    "datum_start", "datum_ende", "startzeit", "endzeit", "ort", "location",
    "maps_link", "website", "email", "telefon", "anmeldung", "bild",
    "beschreibung_detail", "quelle", "hinweis", "geprueft", "hochgeladen",
]
IMG_TYPES = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
             ".webp": "image/webp", ".gif": "image/gif"}

# CSV-Import: akzeptierte Spaltenüberschriften (normalisiert) -> DB-Feld.
# Deckt sowohl die Original-Feldnamen aus der Datenstruktur als auch die
# technischen Namen des CSV-Exports ab.
IMPORT_ALIASES = {
    "name": "name", "nameevent": "name",
    "beschreibungzusammenfassung": "beschreibung_kurz", "beschreibungkurz": "beschreibung_kurz",
    "kategorie": "kategorie",
    "subkategorie": "subkategorie", "subkategorieeventtyp": "subkategorie",
    "datumstart": "datum_start", "datumende": "datum_ende",
    "startzeit": "startzeit", "endzeit": "endzeit",
    "ort": "ort", "location": "location",
    "locationgooglemapslink": "maps_link", "mapslink": "maps_link",
    "websiteanbieter": "website", "website": "website",
    "emailanbieter": "email", "email": "email",
    "telefonnummeranbieter": "telefon", "telefon": "telefon",
    "anmeldungerfoderlich": "anmeldung", "anmeldungerforderlich": "anmeldung", "anmeldung": "anmeldung",
    "bildflyervomanbieter": "bild", "bild": "bild",
    "beschreibungdetailliert": "beschreibung_detail", "beschreibungdetail": "beschreibung_detail",
    "quelle": "quelle",
    "eventhinweisvomaggregator": "hinweis", "hinweis": "hinweis",
}


def norm_header(h):
    return re.sub(r"[^a-z0-9]", "", (h or "").lower())


def norm_datum(s):
    s = (s or "").strip()
    m = re.fullmatch(r"(\d{1,2})\.(\d{1,2})\.(\d{4})\.?", s)
    if m:
        return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    return s


def db():
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


def next_event_id(con, datum_start):
    mx = 0
    for (eid,) in con.execute("SELECT event_id FROM events"):
        m = re.search(r"-(\d{4})$", eid)
        if m:
            mx = max(mx, int(m.group(1)))
    return f"{datum_start}-{mx + 1:04d}"


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    # ---- Helfer ------------------------------------------------------------
    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path, ctype):
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(length).decode("utf-8")) if length else {}

    def event_id_from_path(self, suffix=""):
        m = re.fullmatch(r"/api/events/([0-9-]+)" + suffix, self.path)
        return m.group(1) if m else None

    # ---- Routen ------------------------------------------------------------
    def do_GET(self):
        self.path = self.path.split("?")[0]
        if self.path in ("/", "/index.html"):
            return self.send_file(BASE / "index.html", "text/html; charset=utf-8")
        if self.path == "/api/events":
            with db() as con:
                rows = [dict(r) for r in con.execute(
                    "SELECT * FROM events ORDER BY datum_start, startzeit")]
            return self.send_json(rows)
        if self.path == "/api/kategorien":
            with db() as con:
                rows = [dict(r) for r in con.execute(
                    "SELECT name, subkategorien FROM kategorien ORDER BY id")]
            return self.send_json(rows)
        if self.path.startswith("/images/"):
            p = (IMAGES / Path(self.path).name).resolve()
            if p.is_file() and p.parent == IMAGES.resolve() and p.suffix.lower() in IMG_TYPES:
                return self.send_file(p, IMG_TYPES[p.suffix.lower()])
        self.send_json({"error": "nicht gefunden"}, 404)

    def do_POST(self):
        if self.path == "/api/import":
            return self.import_csv()
        eid = self.event_id_from_path("/bild")
        if eid:
            return self.upload_bild(eid)
        if self.path == "/api/events":
            data = self.read_body()
            if not data.get("name") or not data.get("datum_start"):
                return self.send_json({"error": "Name und Startdatum sind Pflichtfelder"}, 400)
            now = datetime.now().isoformat(timespec="seconds")
            with db() as con:
                eid = next_event_id(con, data["datum_start"])
                rec = {f: data.get(f, "") for f in EDITABLE}
                if rec["anmeldung"] not in ("ja", "nein", "empfohlen"):
                    rec["anmeldung"] = None
                rec["geprueft"] = int(bool(rec["geprueft"]))
                rec["hochgeladen"] = int(bool(rec["hochgeladen"])) * rec["geprueft"]
                cols = ["event_id"] + EDITABLE + ["erstellt_am", "geaendert_am"]
                vals = [eid] + [rec[f] for f in EDITABLE] + [now, now]
                con.execute(f"INSERT INTO events ({','.join(cols)}) VALUES ({','.join('?' * len(cols))})", vals)
            return self.send_json({"ok": True, "event_id": eid}, 201)
        self.send_json({"error": "nicht gefunden"}, 404)

    def do_PUT(self):
        eid = self.event_id_from_path()
        if not eid:
            return self.send_json({"error": "nicht gefunden"}, 404)
        data = self.read_body()
        fields = {f: data[f] for f in EDITABLE if f in data}
        if not fields:
            return self.send_json({"error": "keine Felder"}, 400)
        with db() as con:
            row = con.execute("SELECT * FROM events WHERE event_id = ?", (eid,)).fetchone()
            if not row:
                return self.send_json({"error": "Event nicht gefunden"}, 404)
            if "geprueft" in fields:
                fields["geprueft"] = int(bool(fields["geprueft"]))
            geprueft = fields.get("geprueft", row["geprueft"])
            if "hochgeladen" in fields:
                fields["hochgeladen"] = int(bool(fields["hochgeladen"]))
            if not geprueft:
                fields["hochgeladen"] = 0
            fields["geaendert_am"] = datetime.now().isoformat(timespec="seconds")
            sets = ", ".join(f"{k} = ?" for k in fields)
            con.execute(f"UPDATE events SET {sets} WHERE event_id = ?", list(fields.values()) + [eid])
            updated = dict(con.execute("SELECT * FROM events WHERE event_id = ?", (eid,)).fetchone())
        self.send_json(updated)

    def do_DELETE(self):
        eid = self.event_id_from_path()
        if not eid:
            return self.send_json({"error": "nicht gefunden"}, 404)
        with db() as con:
            cur = con.execute("DELETE FROM events WHERE event_id = ?", (eid,))
        if cur.rowcount:
            for p in IMAGES.glob(eid + ".*"):
                p.unlink()
            return self.send_json({"ok": True})
        self.send_json({"error": "Event nicht gefunden"}, 404)

    def import_csv(self):
        text = self.read_body().get("csv", "").lstrip("﻿")
        if not text.strip():
            return self.send_json({"error": "Die CSV-Datei ist leer"}, 400)
        kopf = text.splitlines()[0]
        delim = ";" if kopf.count(";") >= kopf.count(",") else ","
        reader = csv.DictReader(io.StringIO(text), delimiter=delim)
        feldmap = {h: IMPORT_ALIASES[norm_header(h)]
                   for h in (reader.fieldnames or []) if norm_header(h) in IMPORT_ALIASES}
        if "name" not in feldmap.values() or "datum_start" not in feldmap.values():
            return self.send_json(
                {"error": "Spalten für 'Name Event' und 'Datum Start' wurden nicht gefunden"}, 400)
        now = datetime.now().isoformat(timespec="seconds")
        importiert, uebersprungen, neue_ids = 0, 0, []
        with db() as con:
            for row in reader:
                rec = {f: "" for f in EDITABLE}
                for h, f in feldmap.items():
                    rec[f] = (row.get(h) or "").strip()
                rec["datum_start"] = norm_datum(rec["datum_start"])
                rec["datum_ende"] = norm_datum(rec["datum_ende"]) or rec["datum_start"]
                if not rec["name"] or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", rec["datum_start"]):
                    uebersprungen += 1
                    continue
                anm = rec["anmeldung"].lower()
                rec["anmeldung"] = anm if anm in ("ja", "nein", "empfohlen") else None
                rec["geprueft"] = 0      # importierte Datensätze sind immer ungeprüft
                rec["hochgeladen"] = 0
                eid = next_event_id(con, rec["datum_start"])
                cols = ["event_id"] + EDITABLE + ["erstellt_am", "geaendert_am"]
                vals = [eid] + [rec[f] for f in EDITABLE] + [now, now]
                con.execute(f"INSERT INTO events ({','.join(cols)}) VALUES ({','.join('?' * len(cols))})", vals)
                importiert += 1
                neue_ids.append(eid)
        self.send_json({"ok": True, "importiert": importiert,
                        "uebersprungen": uebersprungen, "event_ids": neue_ids})

    def upload_bild(self, eid):
        data = self.read_body()
        ext = Path(data.get("filename", "")).suffix.lower()
        if ext not in IMG_TYPES:
            return self.send_json({"error": f"Dateityp {ext or '(leer)'} nicht erlaubt"}, 400)
        raw = base64.b64decode(data.get("data", ""))
        if not raw or len(raw) > 10 * 1024 * 1024:
            return self.send_json({"error": "Bild fehlt oder ist größer als 10 MB"}, 400)
        with db() as con:
            row = con.execute("SELECT event_id FROM events WHERE event_id = ?", (eid,)).fetchone()
            if not row:
                return self.send_json({"error": "Event nicht gefunden"}, 404)
            for p in IMAGES.glob(eid + ".*"):
                p.unlink()
            (IMAGES / (eid + ext)).write_bytes(raw)
            pfad = f"images/{eid}{ext}"
            con.execute("UPDATE events SET bild = ?, geaendert_am = ? WHERE event_id = ?",
                        (pfad, datetime.now().isoformat(timespec="seconds"), eid))
        self.send_json({"ok": True, "bild": pfad})


if __name__ == "__main__":
    print(f"Event-Datentool läuft auf http://localhost:{PORT}  (Strg+C zum Beenden)")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
