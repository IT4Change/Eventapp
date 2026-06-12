# Plan: Web-Tool zur Event-Datenerfassung („Soul and Bliss")

Stand: 12.06.2026 · Grundlage: `Referenzen/datenstruktur.xlsx` (21 Felder)
und `Referenzen/kategorien.xlsx` (5 Kategorien mit Subkategorien)

## 1. Ziel

Ein lokales Web-Tool, mit dem aggregierte Event-Daten aus unterschiedlichen Quellen
**gesichtet, bearbeitet, geprüft und für den Upload freigegeben** werden können.
Es ist das Redaktions-Werkzeug vor der eigentlichen Event-App.

## 2. Datenmodell

Alle 21 Felder aus der Datenstruktur werden übernommen. Ergänzt um drei
Verwaltungsfelder, die nur das Tool betreffen (nicht die Event-App):

| Feld | Typ | Zweck |
|---|---|---|
| Geprüft | Checkbox | Datensatz wurde redaktionell geprüft |
| Hochgeladen | Checkbox | Datensatz wurde in die Event-App übernommen |
| Geändert am | Zeitstempel (automatisch) | Nachvollziehbarkeit bei Bearbeitung |

Die fünf Hauptkategorien mit ihren Subkategorien (aus `kategorien.xlsx`):

| Kategorie | Subkategorien |
|---|---|
| Inspiration & Lernen | Workshops, Vorträge, Coachings |
| Tanz | Ecstatic Dance, Contact Dance |
| Heilsame Angebote | Zeremonien, Körperarbeit, Massagen, Breathwork, Bewegung, Natur |
| Singen & Musik | Singkreis, Konzert |
| Mehrtägige Events | Festivals, Retreats |

Im Tool werden Kategorie **und** Subkategorie als verkettete Auswahllisten
umgesetzt: Die Subkategorien-Liste passt sich der gewählten Kategorie an.

## 3. UI-Konzept

**Eine Seite, zwei Bereiche: Tabelle links, Bearbeitungspanel rechts.**

- **Kopfzeile mit Status-Übersicht**: Zähler für Gesamt / Geprüft / Hochgeladen /
  Offen — auf einen Blick sichtbar, wie viel Arbeit noch ansteht.
- **Werkzeugleiste**: Freitextsuche (Name, Ort, Beschreibung), Filter nach
  Kategorie, Ort und Status (alle / ungeprüft / geprüft / hochgeladen),
  Sortierung nach Datum.
- **Tabellenansicht** (kompakte Spalten: Datum, Name, Kategorie, Ort, Quelle,
  Geprüft ✓, Hochgeladen ✓):
  - Checkboxen **direkt in der Zeile** umschaltbar — Prüfen ohne Öffnen des Panels.
  - **Löschen-Button je Zeile** mit Bestätigungsdialog.
  - **Duplikat-Erkennung**: Zeilen mit gleichem/sehr ähnlichem Namen + gleichem
    Datum + gleichem Ort werden farblich markiert, damit Doubletten sofort
    auffallen (in den Beispieldaten sind absichtlich 2 Duplikate enthalten).
- **Bearbeitungspanel** (öffnet bei Klick auf eine Zeile): alle 21 Felder als
  Formular — verkettete Auswahllisten für Kategorie/Subkategorie, Auswahl für
  Anmeldung, Datums-/Zeitfelder, große Textfelder für die Beschreibungen,
  **Bild-Upload** (Vorschau + Datei ersetzen). Speichern / Verwerfen / Löschen.
- **Neues Event anlegen**: Button „+ Neues Event" öffnet das gleiche Formular
  leer. Die **Event ID wird automatisch vergeben** (Format
  `YYYY-MM-DD-NNNN` aus dem Startdatum plus nächster freier laufender Nummer).
  So ist auch die komplette manuelle Erfassung eines Events möglich.
- **Logik-Regel**: „Hochgeladen" lässt sich nur setzen, wenn „Geprüft" gesetzt
  ist. Bearbeitung eines hochgeladenen Datensatzes setzt optional einen
  „erneut prüfen"-Hinweis.

## 4. Technik-Vorschlag

Für den Mockup-/Arbeitsstand bewusst einfach:

- **Frontend**: eine einzelne HTML-Datei (Vanilla JS, kein Build-Schritt) —
  startet im Browser, keine Installation.
- **Test-Datenbank**: `Daten/soulandbliss.db` (SQLite) — bereits angelegt,
  mit Tabellen `events` (24 Spalten inkl. Status- und Zeitstempel-Feldern)
  und `kategorien` (die 5 Kategorien samt Subkategorien als Quelle für die
  Auswahllisten). Die 54 Beispieldatensätze sind importiert.
- **Bilder**: liegen als Dateien in `Daten/images/`, in der DB steht nur der
  Pfad. Upload im Tool speichert die Datei dorthin und aktualisiert den Pfad.
  (Aktuell: farbige Platzhalter-PNGs je Kategorie für alle 54 Events.)
- **Speichern**: ein Mini-Server (Python, eine Datei, nur Standardbibliothek)
  liefert die App aus und liest/schreibt die SQLite-DB über eine kleine
  JSON-API (`GET/POST/PUT/DELETE /api/events`, `POST /api/events/:id/bild`).
- **CSV-Import**: Button „CSV-Import" liest neue Events aus einer CSV-Datei ein
  (Semikolon oder Komma, deutsche oder technische Spaltennamen, Datumsformate
  `JJJJ-MM-TT` und `TT.MM.JJJJ`). Importierte Datensätze bekommen automatisch
  neue IDs und sind **immer ungeprüft**. Beispieldatei: `Daten/import_beispiel.csv`.
- **Export**: Button „CSV-Export" für den Austausch; später ersetzbar durch
  echten Upload an die Event-App (API — Ziel wird noch geklärt).
- **Start per Doppelklick**: `Event-Datentool starten.command` im Projektordner
  startet den Server und öffnet den Browser.

Ausbaustufe 2 (wenn das Tool sich bewährt): Mehrbenutzer, Änderungshistorie,
direkter API-Upload in die Event-App.

## 5. Umsetzung in Schritten

1. ✅ Beispieldaten: 54 fiktive Events (Rhein-Main-Neckar, spiritueller Kontext)
   in `Daten/events_beispieldaten.xlsx` + `.json`, Kategorien gemäß
   `kategorien.xlsx`
2. ✅ Test-Datenbank `Daten/soulandbliss.db` (SQLite) mit Events, Kategorien
   und Platzhalter-Bildern in `Daten/images/`
3. ✅ Tool-MVP: Mini-Server + Tabelle + Suche/Filter + Checkboxen + Löschen mit
   Bestätigung
4. ✅ Bearbeitungspanel mit allen Feldern + Neuanlage mit automatischer ID +
   Bild-Upload
5. ✅ Duplikat-Markierung + CSV-Export + CSV-Import (importiert = ungeprüft)
6. Feinschliff nach erstem Praxistest

## 6. Offene Fragen

- Wohin geht der „Upload" final — gibt es schon eine API/Datenbank der
  Event-App? (Klärung später; bis dahin ist „Hochgeladen" nur ein Status)
- Arbeitet nur eine Person mit dem Tool oder mehrere gleichzeitig?
