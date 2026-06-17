# 08 — Event-Listenansicht: Neuformatierung + schmalere Heroes

Status: **Umgesetzt + verifiziert** (2026-06-17) — Desktop sauber; Mobile bei 375/390/430px ohne Overflow (CDP-Emulation gemessen). Wortmarke in `BrandWordmark.vue` auf User-Wunsch responsiv gehärtet.

## Ziel
Die Event-Übersicht (Startseite `index.vue` → `EventList`) ist die wichtigste Ansicht der Seite. Sie soll maximal übersichtlich werden, analog dem vom User angefügten Beispiel-Screenshot. Zusätzlich sollen die Hero-Bereiche auf **allen** Seiten schmaler werden (oben und unten).

## Abgestimmte Entscheidungen (User, via Rückfrage)
1. **Kurzbeschreibung:** ja, als kleine, gedämpfte **3. Zeile** (Name bleibt im Fokus).
2. **Tag-Pille:** **Hauptkategorie in Akzentfarbe** (wie bisher, nur kleiner platziert) — nicht die Unterkategorie/Grau aus dem Beispiel.
3. **Tages-Gruppierung:** entfällt — **flache Liste**, jede Zeile trägt links ihr eigenes Datum (Datum darf an Folgetagen mehrfach erscheinen).

## Ziel-Layout je Event-Zeile
```
┌─────────┬──────────────────────────────────────────────────────────┐
│ Mi      │ FreedomDance mit Martin Timpe · martin-timpe.de   (Zeile1)│
│ 17.06.26│ [Tanz]  Mainz  ◍ zeit:sinn, Gonsenheimer Str. 56 (Zeile2)│
│ 19:00   │ Kurzbeschreibung, klein & gedämpft …              (Zeile3)│
└─────────┴──────────────────────────────────────────────────────────┘
```
- **Links (schmal):** Wochentag-Kürzel (klein, fett), Datum `TT.MM.JJ` (fett), darunter **nur Startzeit** (gedämpft). Keine Endzeit.
- **Zeile 1:** Event-Titel **groß/prominent** (sans, mittlere Stärke) + `·` + externer Domain-Link (`event.url` → Hostname ohne `www.`), öffnet in neuem Tab.
- **Zeile 2:** Kategorie-Pille (Akzentfarbe, kleiner als Titel) + Stadt + Pin-Icon + Veranstaltungsort (`location.name`).
- **Zeile 3:** `event.description` (Teaser), klein/gedämpft, auf 2 Zeilen begrenzt.
- **Ganze Zeile** verlinkt auf die Detailseite (Stretched-Link via `::after`); der Domain-Link liegt mit `z-index` darüber und bleibt eigenständig klickbar (kein verschachteltes `<a>`).

## Betroffene Dateien
- `composables/useFormat.ts` — neue Funktion `dayMonthYearShort` → `TT.MM.JJ`. (`weekdayShort`, `time` existieren bereits.)
- `composables/useEvents.ts` — `visibleEvents` (flache, sortierte, paginierte Liste) exportieren.
- `components/EventListItem.vue` — komplett neu gemäß Ziel-Layout (Datums-Spalte, Titel+Link, Pille+Ort, Teaser).
- `components/EventList.vue` — `DayBlock`-Schleife durch flache `EventListItem`-Liste ersetzen.
- `components/DayBlock.vue` — **löschen** (nur in `EventList` verwendet; keine Leichen).
- `components/HeroSection.vue` — Paddings/Min-Höhen aller Varianten (slim/medium/large) moderat reduzieren, oben + unten.

## Mobile (Pflicht)
- Datums-Spalte ~84px @375px, Hauptspalte `1fr`; Titelzeile `flex-wrap`, damit Domain-Link bei langen Titeln umbricht.
- Teaser auf 2 Zeilen begrenzt; kein horizontaler Overflow bei 375/390/430px.
- Tap-Fläche: ganze Zeile (Detailseite) + Domain-Link.

## Verifikation
- `npm run dev`: Startseite DE + `/en` — Liste rendert flach mit Datum je Zeile, Titel groß, Pille farbig, Ort + Teaser korrekt, Domain-Link extern.
- Detail-Navigation der Zeile + externer Link funktionieren unabhängig.
- Mobile 375/390/430px ohne Overflow; Desktop ≥1280px gegengecheckt. Konsole sauber.
