# -*- coding: utf-8 -*-
"""Erzeugt flyer-artige Beispielbilder für alle Events in der Datenbank
(Farbverlauf je Kategorie, Eventname, Datum, Ort). Überschreibt Daten/images/."""
import sqlite3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).parent
IMAGES = BASE / "images"
IMAGES.mkdir(exist_ok=True)
W, H = 640, 400

# (dunkel, hell) je Kategorie
FARBEN = {
    "Inspiration & Lernen": ((60, 50, 140), (175, 169, 236)),
    "Tanz": ((130, 50, 25), (240, 153, 123)),
    "Heilsame Angebote": ((8, 80, 65), (93, 202, 165)),
    "Singen & Musik": ((114, 36, 62), (237, 147, 177)),
    "Mehrtägige Events": ((99, 56, 6), (250, 199, 117)),
}


def font(size, bold=False):
    for name in (["/System/Library/Fonts/Supplemental/Arial Bold.ttf"] if bold else
                 ["/System/Library/Fonts/Supplemental/Arial.ttf"]):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    try:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size,
                                  index=1 if bold else 0)
    except OSError:
        return ImageFont.load_default(size)


def umbrechen(draw, text, f, max_w, max_zeilen=3):
    zeilen, aktuelle = [], ""
    for wort in text.split():
        test = (aktuelle + " " + wort).strip()
        if draw.textlength(test, font=f) <= max_w:
            aktuelle = test
        else:
            if aktuelle:
                zeilen.append(aktuelle)
            aktuelle = wort
        if len(zeilen) == max_zeilen:
            break
    if aktuelle and len(zeilen) < max_zeilen:
        zeilen.append(aktuelle)
    return zeilen


def male_bild(pfad, name, kategorie, datum, ort):
    dunkel, hell = FARBEN.get(kategorie, ((68, 68, 65), (180, 178, 169)))
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img, "RGBA")
    for y in range(H):  # diagonal wirkender Verlauf dunkel -> hell
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(dk + (hl - dk) * t) for dk, hl in zip(dunkel, hell)))
    # dekorative Kreise (Sonne/Klangwellen-Anmutung)
    cx, cy = W - 130, 110
    for r in (150, 110, 75, 45):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 255, 255, 60), width=3)
    d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=(255, 255, 255, 150))
    # Kategorie-Pille oben links
    f_kat = font(18, bold=True)
    pb = d.textlength(kategorie.upper(), font=f_kat)
    d.rounded_rectangle([28, 28, 28 + pb + 28, 66], radius=19, fill=(255, 255, 255, 55))
    d.text((42, 37), kategorie.upper(), font=f_kat, fill=(255, 255, 255, 235))
    # Eventname
    f_name = font(40, bold=True)
    zeilen = umbrechen(d, name, f_name, W - 70, max_zeilen=3)
    y = H - 96 - 46 * len(zeilen)
    for z in zeilen:
        d.text((32, y), z, font=f_name, fill=(255, 255, 255, 245))
        y += 46
    # Datum + Ort unten
    f_meta = font(22)
    tag = ".".join(reversed(datum.split("-"))) if datum else ""
    d.text((32, H - 64), f"{tag}   ·   {ort}", font=f_meta, fill=(255, 255, 255, 215))
    img.save(pfad, "PNG")


con = sqlite3.connect(BASE / "soulandbliss.db")
con.row_factory = sqlite3.Row
events = con.execute("SELECT event_id, name, kategorie, datum_start, ort, bild FROM events").fetchall()
for e in events:
    pfad = IMAGES / f"{e['event_id']}.png"
    male_bild(pfad, e["name"], e["kategorie"], e["datum_start"], e["ort"] or "")
    if e["bild"] != f"images/{e['event_id']}.png":
        con.execute("UPDATE events SET bild = ? WHERE event_id = ?",
                    (f"images/{e['event_id']}.png", e["event_id"]))
con.commit()
con.close()
print(f"{len(events)} Eventbilder erzeugt in {IMAGES}")
