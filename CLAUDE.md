# Soul & Bliss Eventapp — Claude-Anleitung

Dieses Projekt ist eine Event-Aggregator-Plattform für die Conscious Szene in der Rhein-Main-Neckar-Region. Tech-Stack: Nuxt 3, Vue 3, Tailwind CSS, TypeScript. Mehrsprachig DE/EN über `@nuxtjs/i18n` (vue-i18n Message-Store, `$t`), Default `de`, EN unter `/en/...`; Sprachschalter in der Nav ist funktional. **Event-Backend: Baikal (CalDAV)** als Teil des docker-compose-Stacks; gelesen server-seitig via Nitro (`/api/events` → `tsdav`/`ical.js`).

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
├── i18n/
│   └── locales/
│       ├── de.ts            # Alle deutschen Texte (vue-i18n Message-Store)
│       └── en.ts            # Englische Übersetzung (strukturgleich)
│
├── data/                    # Datenmodell für späteres Backend
│   ├── types.ts             # Event, Location, Category (struktur) + LocalizedCategory
│   ├── categories.ts        # 5 Kategorien — nur Struktur (gradient/image/accent)
│   ├── locations.ts         # Demo-Orte Rhein-Main-Neckar (bleiben DE)
│   └── events.ts            # Demo-Events (bleiben DE)
│
├── composables/
│   ├── useCategories.ts     # Struktur (categories.ts) + i18n-Texte → LocalizedCategory
│   ├── useLegal.ts          # Löst Rechtstext-Sektionen via tm()+rt() auf
│   ├── useEvents.ts         # Filter, Wochengruppierung, Navigation
│   └── useFormat.ts         # Locale-abhängige Datums-/Zeitformatierung (DE/EN)
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

## Mobile-First-Pflicht (WICHTIG)

**Jede Änderung an Layout, Komponenten oder Seiten muss für Mobilgeräte — insbesondere iPhone/iOS (Viewports 375–430px) — optimiert sein.** Das gilt für neue Features genauso wie für Refinements. Mobile ist nicht optional und nicht „später" — es ist Teil der Definition von „fertig".

**Verbindliche Konventionen** (Details & Historie in [05_mobile-optimierung.md](05_mobile-optimierung.md)):

- **Mobile-first denken**: Basiswerte (ohne Präfix) = iPhone; via `sm:`/`md:`/`lg:` bzw. `min-width`-Queries nach oben skalieren. **Niemals** Desktop-Werte als Basis mit `max-width`-Queries nach unten.
- **Einheitliche Breakpoints**: nur Tailwind-Standard `sm` 640 / `md` 768 / `lg` 1024. Keine Sonder-Breakpoints (z.B. 900px) einführen.
- **Übergroße Headlines** bekommen das Muster `base → md: → lg:`, wobei der `lg:`-Wert der Desktop-Größe entspricht (Desktop ≥1024px soll stabil bleiben).
- **Keine hartcodierten px-Schriftgrößen/Höhen ohne responsive Stufung** und keine festen `px`-Spaltenraster ohne mobilen Einspalt-Fallback.
- **Touch-Targets ≥ 44×44px** (Buttons, Burger, Filter-Pills, Links, Inputs).
- **Container-Ränder** über `.container-w` (`px-5 sm:px-6 lg:px-8`); Section-Vertikal-Padding gestuft (Muster `py-16 sm:py-24 lg:py-[100px]`).
- **Kein horizontaler Overflow** bei 375px; lange Wörter/Wordmarks nicht ungeschützt mit `nowrap`.
- **Inline-Styles mit festen Größen vermeiden** — stattdessen responsive Tailwind-Klassen oder gestufte scoped-CSS-Regeln.

**Verifikation (zusätzlich zur normalen Routen-Prüfung):** betroffene Seiten bei **375 / 390 / 430px** prüfen (kein Overflow, saubere Umbrüche, Tap-Flächen) und bei **≥1280px** gegen den vorherigen Desktop-Stand gegenchecken (Regression vermeiden).

---

## Content-Konventionen

- **Alle UI-Texte** liegen im vue-i18n Message-Store: `i18n/locales/de.ts` + `i18n/locales/en.ts`. Zugriff in Komponenten/Seiten via `$t('pfad')` (Einzelstrings) bzw. `tm('pfad')` + `rt()` für verschachtelte Arrays/Objekte (`paragraphs`, `pillars.items`, Legal-`sections`, `footer.columns`). Keine hartcodierten nutzersichtbaren Texte in Komponenten.
- **Beide Locale-Dateien strukturgleich halten**: jeder Key muss in `de.ts` UND `en.ts` existieren (fehlende Keys → Konsolen-Warnung + Key-Fallback im UI).
- **Sonderzeichen escapen**: literale `@` (E-Mails/mailto), `|` und `{`/`}` sind vue-i18n-Syntax — als `{'@'}` etc. schreiben (in den `.ts`-Strings als `{\'@\'}`), sonst bricht der Message-Compiler die ganze Datei.
- **Brand-Name**: "Soul & Bliss" (als `brand.name`)
- **Bei neuen Texten**: in die passende Sektion beider Dateien einsortieren (`home`, `vision`, `categories`, `postEvent`, `contact`, `newsletter`, `event`, `filter`, `datenschutz`, `nutzungsbedingungen`, `impressum`, `footer`, `nav`, `cta`)
- **Interne Links**: `<NuxtLinkLocale :to="…">` statt `<NuxtLink>` (hält die aktive Sprache); externe Links (mailto/http) bleiben `<a>`
- **Datum/Zeit** immer über `useFormat()` (locale-abhängig), nicht selbst formatieren

---

## Datenkonventionen

- **Events kommen aus Baikal (CalDAV)** über die Nitro-Route `server/api/events.get.ts` (`useEvents()` lädt via `useFetch('/api/events')`). Kein direkter Browser→DAV-Zugriff; Credentials nur server-seitig (`runtimeConfig.dav`, Env `DAV_URL`/`DAV_USERNAME`/`DAV_PASSWORD`, Default `localhost:8088` + `admin`). Details/Plan: [07_baikal-caldav-backend.md](07_baikal-caldav-backend.md).
- **`data/events.ts` ist die Seed-Fixture** (nicht die Laufzeitquelle): `npm run cli:seed` schreibt sie nach Baikal (vorher einmal `docker compose up -d baikal` + `npm run cli:baikal:bootstrap`). Ein Kalender je Kategorie (URI = CategoryKey).
- **Event⇄VEVENT-Mapping** liegt zentral in `server/utils/ical.ts` (Build & Parse). Nativ: `UID/SUMMARY/DTSTART/DTEND/DESCRIPTION/URL/IMAGE/ORGANIZER/CATEGORIES/LOCATION`. Domänenfelder ohne iCal-Pendant als **`X-SB-*`** (`teaser`, `subcategory`, `registration`, `price`, `source`, `note`, `location-id`, `maps-url`, `phone`). Zeiten **floating-local** (kein TZ-Mathe). Kategorie = Quell-Kalender.
- Neue Event-Felder: zuerst `data/types.ts` erweitern, dann das Mapping in `server/utils/ical.ts` (Build **und** Parse) ergänzen, dann Seed-Fixture + Komponenten. Beim Mapping `@`/`,`/`;` in Werten beachtet ical.js automatisch (Escaping/Folding).
- Kategorien sind eine geschlossene Liste mit 5 Werten — **Struktur** (gradient/image/accent) in `data/categories.ts`, **Texte** (label/shortLabel/description/includes) lokalisiert unter `categories.items.<key>` in den Locale-Dateien; `useCategories()` führt beides zu `LocalizedCategory` zusammen. Neue Kategorien erfordern Absprache.

---

## Komponenten-Konventionen

- **Generische Komponenten** (`RichTextSection`, `TriCardSection`, `HeroSection`, `LegalPage`): props-driven, mehrfach verwendbar — bei Erweiterung props ergänzen statt zu duplizieren
- **Page-Komponenten** in `pages/` halten den Content kurz: sie holen Texte via `$t`/`tm`+`rt` und verschalten sie auf die generischen Komponenten
- **Bestehende Komponenten erweitern** statt neue parallele anzulegen — wenn eine Komponente nicht passt, lieber die props ergänzen oder die Komponente verallgemeinern
- **Style-Scope**: möglichst `scoped` halten; CSS-Variablen aus `main.css` nutzen statt Werte zu hardcoden
- **Mobile-first**: jede Komponente muss responsiv und auf iPhone optimiert sein — siehe [Mobile-First-Pflicht](#mobile-first-pflicht-wichtig)

---

## Workflow-Erwartungen

- **Bei Unklarheiten immer zuerst nachfragen** (WICHTIG): Wenn eine Anweisung mehrdeutig ist, mehrere sinnvolle Interpretationen zulässt oder wichtige Details fehlen, **erst Rückfrage stellen — dann erst Änderungen vornehmen**. Keine Annahmen über die Intention treffen und einfach drauflos ändern. Lieber einmal kurz klären als eine falsche Umsetzung, die wieder rückgängig gemacht werden muss.
- **Plan vor Implementierung** bei nicht-trivialen Vorhaben (3+ Dateien oder neue Architektur)
- **TypeScript-Strict**: Interfaces aus `data/types.ts` verwenden, keine `any` ohne Begründung
- **Keine Backwards-Compat-Reste**: gelöschte Komponenten/Routen vollständig entfernen, nicht als Leichen behalten
- **Verifikation**: nach Änderungen `npm run dev` laufen lassen und betroffene Routen prüfen (HTTP 200, Konsole sauber, sichtbar im Browser) — **inkl. Mobile-Check bei 375/390/430px**, siehe [Mobile-First-Pflicht](#mobile-first-pflicht-wichtig)
- **Commits**: nur auf explizite Aufforderung; commit-Nachrichten in derselben Sprache wie die User-Kommunikation (deutsch)

---

## Aktuelle offene Punkte

Siehe Abschnitt "Offene Punkte / nächste Schritte" im jüngsten Eintrag von [04_projektfortschritt.md](04_projektfortschritt.md).
