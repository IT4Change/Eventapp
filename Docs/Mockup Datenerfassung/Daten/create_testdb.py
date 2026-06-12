# -*- coding: utf-8 -*-
"""Legt die Test-Datenbank Daten/soulandbliss.db an (SQLite),
importiert die Beispieldaten und erzeugt Platzhalter-Bilder je Event."""
import json, sqlite3, struct, zlib
from datetime import datetime
from pathlib import Path

BASE = Path(__file__).parent
DB = BASE / "soulandbliss.db"
IMAGES = BASE / "images"
IMAGES.mkdir(exist_ok=True)

KATEGORIEN = [
    ("Inspiration & Lernen", "Workshops, Vorträge, Coachings",
     "Wissens- und Reflexionsformate wie Achtsamkeitsworkshops, Coaching-Abende, Vorträge zu Bewusstsein, Beziehung, Nervensystem, Selbstführung, Spiritualität und persönlicher Entwicklung.",
     "Impulsabend, Praxisworkshop, Tagesseminar, Coaching-Kreis, Lernlabor, Vortrag mit Austausch"),
    ("Tanz", "Ecstatic Dance, Contact Dance",
     "Körper- und bewegungsorientierte Tanzformate mit Fokus auf Präsenz, Embodiment, nonverbale Begegnung, freiem Ausdruck und achtsamer Gruppenenergie.",
     "Ecstatic Dance, Contact Improvisation, Somatic Movement, Tanzreise, Movement Lab, Barfuß-Dancefloor"),
    ("Heilsame Angebote", "Zeremonien, Körperarbeit, Massagen, Breathwork, Bewegung, Natur",
     "Formate zur Regeneration, Selbstheilung und inneren Integration, darunter Breathwork, Klangreisen, Körperarbeit, Rituale, Naturerfahrung, Energiearbeit und achtsame Berührung.",
     "Kakaozeremonie, Atemkreis, Klangbad, Reiki-Abend, Massage-Workshop, Naturritual, somatische Körperarbeit"),
    ("Singen & Musik", "Singkreis, Konzert",
     "Musikalische Gemeinschaftsformate mit Stimme, Klang und Resonanz, von offenen Singkreisen bis zu intimen Medicine-Music- oder Mantra-Konzerten.",
     "Singkreis, Mantra-Abend, Circle Singing, Klangkonzert, Medicine-Music-Konzert, Sound Journey"),
    ("Mehrtägige Events", "Festivals, Retreats",
     "Mehrere Tage umfassende Veranstaltungen mit Übernachtung oder dichter Programmstruktur, etwa Conscious Festivals, Yoga- und Healing-Retreats, Natur-Retreats oder Wochenendseminare.",
     "Festival, Retreat, Intensivwochenende, Seminarreise, Conscious Gathering, mehrtägige Tempel- oder Naturzeit"),
]

FARBEN = {  # Platzhalterfarbe je Kategorie (RGB)
    "Inspiration & Lernen": (122, 110, 200),
    "Tanz": (216, 90, 48),
    "Heilsame Angebote": (29, 158, 117),
    "Singen & Musik": (212, 83, 126),
    "Mehrtägige Events": (186, 117, 23),
}

def png_solid(path, rgb, w=320, h=200):
    raw = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))
    def chunk(typ, data):
        c = typ + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c))
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    path.write_bytes(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr)
                     + chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b""))

DB.unlink(missing_ok=True)
con = sqlite3.connect(DB)
con.executescript("""
CREATE TABLE kategorien (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT UNIQUE NOT NULL,
  subkategorien TEXT NOT NULL,
  einordnung    TEXT,
  eventformen   TEXT
);
CREATE TABLE events (
  event_id            TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  beschreibung_kurz   TEXT,
  kategorie           TEXT REFERENCES kategorien(name),
  subkategorie        TEXT,
  datum_start         TEXT,
  datum_ende          TEXT,
  startzeit           TEXT,
  endzeit             TEXT,
  ort                 TEXT,
  location            TEXT,
  maps_link           TEXT,
  website             TEXT,
  email               TEXT,
  telefon             TEXT,
  anmeldung           TEXT CHECK (anmeldung IN ('ja','nein','empfohlen')),
  bild                TEXT,
  beschreibung_detail TEXT,
  quelle              TEXT,
  hinweis             TEXT,
  geprueft            INTEGER NOT NULL DEFAULT 0,
  hochgeladen         INTEGER NOT NULL DEFAULT 0,
  erstellt_am         TEXT,
  geaendert_am        TEXT
);
CREATE INDEX idx_events_datum ON events(datum_start);
CREATE INDEX idx_events_kategorie ON events(kategorie);
""")
con.executemany("INSERT INTO kategorien (name, subkategorien, einordnung, eventformen) VALUES (?,?,?,?)", KATEGORIEN)

data = json.loads((BASE / "events_beispieldaten.json").read_text(encoding="utf-8"))
now = datetime.now().isoformat(timespec="seconds")
rows = []
for r in data:
    png_solid(IMAGES / f"{r['Event ID']}.png", FARBEN[r["Kategorie"]])
    rows.append((
        r["Event ID"], r["Name Event"], r["Beschreibung (Zusammenfassung)"],
        r["Kategorie"], r["Subkategorie"], r["Datum Start"], r["Datum Ende"],
        r["Startzeit"], r["Endzeit"], r["Ort"], r["Location"],
        r["Location Google Maps Link"], r["Website Anbieter"], r["Email Anbieter"],
        r["Telefonnummer Anbieter"], r["Anmeldung erfoderlich?"],
        r["Bild / Flyer vom Anbieter"], r["Beschreibung detailliert"],
        r["Quelle"], r["Eventhinweis vom Aggregator"],
        int(r["Geprüft"]), int(r["Hochgeladen"]), now, now,
    ))
con.executemany(f"INSERT INTO events VALUES ({','.join('?' * 24)})", rows)
con.commit()

n_ev = con.execute("SELECT COUNT(*) FROM events").fetchone()[0]
n_kat = con.execute("SELECT COUNT(*) FROM kategorien").fetchone()[0]
print(f"DB angelegt: {DB.name} – {n_ev} Events, {n_kat} Kategorien, {len(rows)} Bilder in images/")
con.close()
