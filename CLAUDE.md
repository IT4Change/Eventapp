# Soul & Bliss Eventapp — Claude-Anleitung

Dieses Projekt ist eine Event-Aggregator-Plattform für die Conscious Szene in der Rhein-Main-Neckar-Region. Tech-Stack: Nuxt 3, Vue 3, Tailwind CSS, TypeScript. Sprache: Deutsch (DE/EN-Switcher ist vorbereitet, aber noch nicht funktional).

---

## Dokumentationspflicht (WICHTIG)

**Jede Arbeitssession muss dokumentiert werden.** Das Projekt führt eine fortlaufende Fortschritts-Datei und nummerierte Planungs-Dokumente. Bitte halte dich an folgende Regeln:

### 1. Fortschritts-Datei pflegen
- Die Datei [04_projektfortschritt.md](04_projektfortschritt.md) ist das zentrale Logbuch des Projekts
- **Jede Session, in der Code geändert wird, fügt einen neuen Eintrag oben hinzu** (umgekehrte chronologische Reihenfolge — neuester Eintrag zuerst)
- Format pro Eintrag:
  ```markdown
  ## YYYY-MM-DD — Kurztitel der Session

  ### Ausgangslage
  (kurz: was war vorher der Stand)

  ### Ziel
  (was sollte erreicht werden, ggf. mit Link zum Plan)

  ### Was umgesetzt wurde
  (Aufzählung der konkreten Änderungen, gegliedert nach Architektur/Komponenten/Content/etc.)

  ### Verifikation
  (wie wurde geprüft, dass es funktioniert)

  ### Offene Punkte / nächste Schritte
  (was bleibt für später)
  ```
- Aktuelle Datums-Bezugnahme: nutze das absolute Datum aus dem System-Kontext, nicht "heute" oder "gestern"

### 2. Nummerierte Plandokumente bei größeren Vorhaben
- Plandokumente folgen dem Schema `NN_kurztitel.md` im Projekt-Root (z.B. `05_event-detail-seiten.md`)
- Aktuelle Nummern:
  - `01_website-struktur-grundlage.md` — Grundkonzept (User-Input)
  - `02_pfeil-sitemap-vorlage.md` — Sitemap (User-Input)
  - `03_website-restrukturierung-plan.md` — Multi-Page-Restrukturierung (Plan)
  - `04_projektfortschritt.md` — Fortschritts-Logbuch
- **Vor größeren Implementierungen** (mehrere Dateien, neue Architektur, neue Features): erstelle einen Plan mit nächster freier Nummer und diskutiere ihn mit dem User bevor implementiert wird
- Kleine Fixes/Refinements brauchen keinen eigenen Plan — nur einen Eintrag in `04_projektfortschritt.md`

### 3. Wann dokumentieren?
- **Nach jeder größeren Änderung** (neue Komponente, neue Route, neuer Datenfluss): Fortschrittseintrag
- **Vor größeren Implementierungen**: Plan-Dokument
- **Bei Architekturentscheidungen**: in den Fortschrittseintrag aufnehmen mit kurzer Begründung (Warum-Spalte)
- **Beim Löschen von Code**: dokumentieren, was wodurch ersetzt wurde

---

## Projektstruktur

```
Eventapp/
├── app.vue                  # Schlanker Entry: <NuxtLayout><NuxtPage/></NuxtLayout>
├── nuxt.config.ts           # Default-Lang: de, Title, Meta
├── tailwind.config.ts       # Brand-Farben, Gradients, Typografie
│
├── layouts/
│   └── default.vue          # Nav + Slot + Newsletter + Footer
│
├── pages/                   # 8 Routes (multi-page)
│   ├── index.vue            # Home mit Wochenansicht
│   ├── vision.vue
│   ├── kategorien.vue
│   ├── events-posten.vue    # Login UI-Mockup
│   ├── kontakt.vue
│   ├── newsletter.vue
│   ├── disclaimer.vue
│   └── impressum.vue
│
├── content/
│   └── de.ts                # Alle deutschen Texte (i18n-Vorstufe)
│
├── data/                    # Datenmodell für späteres Backend
│   ├── types.ts             # Event, Category, Location Interfaces
│   ├── categories.ts        # 5 Event-Kategorien + Gradient-Mapping
│   ├── locations.ts         # Demo-Orte Rhein-Main-Neckar
│   └── events.ts            # Demo-Events
│
├── composables/
│   ├── useContent.ts        # Liefert content/de.ts (→ später $t())
│   ├── useEvents.ts         # Filter, Wochengruppierung, Navigation
│   └── useFormat.ts         # Deutsche Datums-/Zeitformatierung
│
├── components/
│   ├── SiteNav.vue, SiteFooter.vue, BrandWordmark.vue
│   ├── HeroSection.vue      # Props-driven, mehrfach genutzt
│   ├── IntroBand.vue, QuoteBand.vue, NewsletterSection.vue
│   ├── WeekView.vue, DayBlock.vue, EventListItem.vue, EventFilter.vue
│   ├── CategoryCard.vue, LoginForm.vue, LegalPage.vue
│   └── RichTextSection.vue, RichTextBody.vue, TriCardSection.vue
│
├── assets/css/main.css      # Tailwind-Direktiven + custom Komponenten-Klassen
└── public/img/              # 28 Bilder (brand/ + logos/, jeweils PNG+SVG)
```

---

## Designsystem (NICHT ändern ohne Absprache)

**Farbpalette** (in `tailwind.config.ts` und `assets/css/main.css` als CSS-Variablen):
- `coral` #E87A5D · `orange` #F2994A · `gold` #F4C95D
- `teal` #54C0B4 · `blue` #6BA8D8 · `green` #9CCC65
- `ink` #2E5A57 · `ink-soft` #4A7672
- `off` #FBF9F5 · `mist` #F4F1EB

**Gradients**: warm, cool, rainbow, ceremony, nature, soulevents

**Typografie**: Helvetica Neue (sans), Georgia (serif), Brush Script MT (script — für Wordmark und Akzente)

**Custom Classes** (in `main.css`): `.container-w`, `.grad-text`, `.btn`, `.btn-outline`, `.section-eyebrow`, `.section-title`, `.section-intro`

---

## Content-Konventionen

- **Alle UI-Texte** kommen aus `content/de.ts` (zugriff via `useContent()`) — keine hartcodierten Texte in Komponenten
- **Brand-Name**: "Soul & Bliss" (in `content/de.ts` als `brand.name`)
- **Bei neuen Texten**: in die passende Sektion in `content/de.ts` einsortieren (`home`, `vision`, `categories`, `postEvent`, `contact`, `newsletter`, `disclaimer`, `impressum`, `footer`, `nav`, `cta`)
- Neue Sprache (EN): NICHT in `content/de.ts` hinzufügen — stattdessen `content/en.ts` anlegen und `@nuxtjs/i18n` einbauen (siehe offene Punkte in 04_projektfortschritt.md)

---

## Datenkonventionen

- Events werden aktuell als statische Demo-Daten in `data/events.ts` gehalten
- Beim Anschluss eines echten Backends: `useEvents()` Composable so anpassen, dass es `useFetch('/api/events')` verwendet — die Komponenten ändern sich nicht
- Neue Event-Felder: zuerst in `data/types.ts` das Interface erweitern, dann Demo-Daten ergänzen, dann Komponenten anpassen
- Kategorien sind eine geschlossene Liste mit 5 Werten (siehe `data/categories.ts`) — neue Kategorien erfordern Absprache

---

## Komponenten-Konventionen

- **Generische Komponenten** (`RichTextSection`, `TriCardSection`, `HeroSection`, `LegalPage`): props-driven, mehrfach verwendbar — bei Erweiterung props ergänzen statt zu duplizieren
- **Page-Komponenten** in `pages/` halten den Content kurz: sie holen Texte via `useContent()` und verschalten sie auf die generischen Komponenten
- **Bestehende Komponenten erweitern** statt neue parallele anzulegen — wenn eine Komponente nicht passt, lieber die props ergänzen oder die Komponente verallgemeinern
- **Style-Scope**: möglichst `scoped` halten; CSS-Variablen aus `main.css` nutzen statt Werte zu hardcoden

---

## Workflow-Erwartungen

- **Plan vor Implementierung** bei nicht-trivialen Vorhaben (3+ Dateien oder neue Architektur)
- **TypeScript-Strict**: Interfaces aus `data/types.ts` verwenden, keine `any` ohne Begründung
- **Keine Backwards-Compat-Reste**: gelöschte Komponenten/Routen vollständig entfernen, nicht als Leichen behalten
- **Verifikation**: nach Änderungen `npm run dev` laufen lassen und betroffene Routen prüfen (HTTP 200, Konsole sauber, sichtbar im Browser)
- **Commits**: nur auf explizite Aufforderung; commit-Nachrichten in derselben Sprache wie die User-Kommunikation (deutsch)

---

## Aktuelle offene Punkte

Siehe Abschnitt "Offene Punkte / nächste Schritte" im jüngsten Eintrag von [04_projektfortschritt.md](04_projektfortschritt.md).
