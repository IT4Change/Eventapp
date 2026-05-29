# Projektfortschritt — Soul & Bliss Eventapp

Dieses Dokument wird bei jeder Arbeitssession aktualisiert. Neueste Einträge oben.

---

## 2026-05-29 — Webhook-Deployment auf master umgestellt

### Ausgangslage
Der Ordner `.github/` wurde aus dem Schwester-Projekt `kooperative.de` ins Eventapp-Repo kopiert. Die enthaltene Webhook-Deployment-Konfiguration war auf das andere Projekt zugeschnitten:
- Frontend lag dort in einem `app/`-Unterordner mit eigenem `start.sh`
- Trigger war ein GitHub-**Release** (`action == "published"`), Tag wurde an `deploy.sh` übergeben
- pm2-App-Name `kooperative-frontend`

### Ziel
Webhook auf dieses Repo anpassen, sodass jeder **Push auf `master`** ein vollständiges Deployment auf einem Alpine-Host auslöst (kein Tag-/Release-Schritt nötig).

### Was umgesetzt wurde

**[.github/webhooks/deploy.sh](.github/webhooks/deploy.sh)**
- `app/`-Unterordner-Logik entfernt — Build läuft direkt im `PROJECT_ROOT`
- Tag-Argument entfernt, immer `git fetch + reset --hard origin/master` (idempotent, überlebt lokale Änderungen am Checkout)
- `npm ci --omit=dev` → `npm ci`, weil Nuxt-Build die `devDependencies` (Tailwind, Nuxt-CLI) braucht
- Service-Restart: `pm2 reload --update-env` statt `stop + delete + start` → zero-downtime
- `set -e` für sauberen Abbruch bei Buildfehlern
- `pm2 save` nach Reload, damit der Stand nach Reboot wiederhergestellt wird

**[.github/webhooks/ecosystem.config.js](.github/webhooks/ecosystem.config.js)**
- App-Name auf `soulevents-frontend` umbenannt
- Kein externes `start.sh` mehr — `script: ".output/server/index.mjs"` mit `interpreter: "node"` (Nuxt-3-Server-Output ist self-contained)
- `cwd: __dirname + "/../.."` sorgt dafür, dass pm2 das Script relativ zum Repo-Root findet, unabhängig davon, von wo aus pm2 aufgerufen wird
- `env` setzt `NODE_ENV=production`, `HOST=127.0.0.1`, `PORT=3000`, `TZ=UTC`

**[.github/webhooks/hooks.json.template](.github/webhooks/hooks.json.template)**
- Signatur von SHA1 (`X-Hub-Signature` / `payload-hash-sha1`) auf **SHA256** (`X-Hub-Signature-256` / `payload-hash-sha256`) hochgezogen
- Trigger-Rule prüft jetzt `ref == "refs/heads/master"` statt `action == "published"`
- `pass-arguments-to-command` entfernt, weil `deploy.sh` kein Argument mehr braucht

**[.github/webhooks/README.md](.github/webhooks/README.md)**
- Komplette Beschreibung auf den Push-basierten Flow umgeschrieben
- Nginx-Snippet ergänzt: Reverse-Proxy für `/` → `127.0.0.1:3000` (Nuxt) + `/hooks/` → `127.0.0.1:9000` (webhook)
- GitHub-Setup-Tabelle: `Releases` → `Just the push event`
- Hinweis ergänzt, dass `deploy.sh` auch manuell auf dem Server aufgerufen werden kann

### Verifikation
- Statische Konsistenz: pm2-Script-Pfad `.output/server/index.mjs` matcht den Nuxt-3-Build-Output
- Webhook-Trigger-Rule getestet gegen GitHub-Push-Payload-Schema (`ref`-Feld existiert, `action` gibt es bei Push nicht — alte Rule hätte ohnehin nie gegriffen)
- Tatsächlicher Server-Test steht aus: erfordert Alpine-Host mit `apk add webhook git nodejs npm` + `npm i -g pm2`, dann `sh .github/webhooks/deploy.sh` als erstes manuelles Deployment

### Offene Punkte / nächste Schritte
- Auf dem Alpine-Host das initiale Setup nach Anleitung in `.github/webhooks/README.md` durchführen
- GitHub-Repo: Webhook für **Push**-Event mit Shared-Secret eintragen
- Optional: Healthcheck-Endpunkt im Nuxt-Server ergänzen, gegen den der Webhook-Daemon nach `pm2 reload` einen Test absetzen könnte (aktuell scheitert ein Fehler nur am pm2-Exit-Code)
- Optional: Build-Schritt in eine GitHub-Action ziehen und nur das fertige `.output/`-Artefakt deployen — spart Build-Last auf dem Server

---

## 2026-05-29 — Content-Integration: Events, Vision, Kategorien aus Templates

### Ausgangslage
Drei Seiten-Templates lagen vor (`04_seiten-template-01/02/03.txt` im externen Projektordner) mit konkreten Headlines, Subheadlines, Fließtexten und Bereichsstruktur für Startseite, Vision und Kategorien. Die Seiten hatten bisher Demo-Texte und einen großen Bild-Hero auf jeder Seite. Die Events-Startseite war eine reine 7-Tages-Wochenansicht (Mo–So) ohne Datumsfilter und ohne Pagination.

### Ziel
Templates inhaltlich vollständig einarbeiten, dabei strukturelle Änderungen:
- Heros werden zu **schlanken Intro-Bands** (ohne Vollbild, mit Gradient-Trenner)
- Wochenansicht wird zur **flachen 30er-Liste** chronologisch, leere Tage ausgeblendet, "weitere 30 laden"-Pagination
- **Datumsbereich-Filter** (Von/Bis) ergänzt — neben Kategorie- und Orts-Filter
- Kategorien-Cards bekommen **"beinhaltet"-Zeile** mit Beispielen

### Was umgesetzt wurde

**Datenschicht**
- [data/types.ts](data/types.ts) — `Category` Interface um `includes: string[]` ergänzt
- [data/categories.ts](data/categories.ts) — Reihenfolge entsprechend Template umgestellt: Tanz → Singen & Musik → Heilsame Angebote → Inspiration & Lernen → Mehrtägige Events. Jede Kategorie hat jetzt ein `includes`-Array mit den Beispielen aus dem Template

**Content** ([content/de.ts](content/de.ts))
- `home.hero` — Headline aus Template: "Eine kuratierte Wochenübersicht …"
- `home.intro` (alter Nietzsche-Vorgeschmack) — **entfernt**
- `home.week` — Titel "Aktuelle Events im Überblick", Subheadline "Filter nach Kategorien, Datum und Ort", neuer Key `loadMore`
- `vision.hero` — "Bewusste Räume gemeinsam finden", Untertitel-Zitat aus Template
- `vision.about` — "Unsere Motivation für diese Seite" / "Menschen verbinden" + 3 Template-Absätze
- `vision.pillars` — "Unsere Leitlinien" mit drei Säulen (Achtsamkeit / Verbindung / Offenheit) — Texte aus Template, "Verbindung" mit bestehendem Text (Template-Eintrag war Copy-Paste-Fehler)
- `vision.quote` (Nietzsche) — **entfernt** (nicht im Template)
- `categories.hero` — "Was du bei uns findest" / Template-Body
- Neuer Key `categories.includesLabel: 'beinhaltet'`

**Composable** ([composables/useEvents.ts](composables/useEvents.ts))
- Reactive State ergänzt: `dateFrom`, `dateTo`, `visibleCount` (default 30)
- `filtered`-Computed filtert jetzt:
  - Events vor dem heutigen Tag werden ausgeblendet (chronologische Vorwärts-Ansicht)
  - Kategorien-Filter, Orts-Filter, Datumsbereichs-Filter
  - Sortierung chronologisch aufsteigend
- Neue Computed `visibleByDay` — gruppiert die ersten `visibleCount` Events nach Tag (nur Tage mit Events)
- Neue Funktion `loadMore()` — erhöht `visibleCount` um 30
- Filter-Änderungen setzen `visibleCount` auf 30 zurück
- Alte Wochennavigations-Funktionen bleiben im Composable, werden aber nicht mehr genutzt

**Komponenten**
- [HeroSection.vue](components/HeroSection.vue) — neue Variante `slim` (kein Bild, kleinere Titel, Gradient-Bottom-Strich als Trenner, minimal vertikales Padding)
- [EventFilter.vue](components/EventFilter.vue) — neue Zeile "Zeitraum" mit zwei `<input type="date">` für Von/Bis, in Label-Spalten-Layout neu strukturiert (Kategorien / Zeitraum / Ort)
- [DayBlock.vue](components/DayBlock.vue) — "Keine Events"-Empty pro Tag entfernt (wird nicht mehr aufgerufen, da leere Tage gefiltert sind)
- **Neu** [EventList.vue](components/EventList.vue) — ersetzt WeekView: Filter + DayBlocks aus `visibleByDay` + "Weitere 30 Events laden"-Button mit Counter
- [CategoryCard.vue](components/CategoryCard.vue) — neue Zeile "BEINHALTET: …" zwischen Titel und Beschreibung, ausgegeben als ` · `-separierte Liste

**Pages**
- [pages/index.vue](pages/index.vue) — schlanker Hero, `<EventList />` statt `<WeekView />`, IntroBand entfernt
- [pages/vision.vue](pages/vision.vue) — schlanker Hero mit Zitat als Untertitel, `<QuoteBand>` (Nietzsche) entfernt
- [pages/kategorien.vue](pages/kategorien.vue) — schlanker Hero, Cards zeigen automatisch neue "beinhaltet"-Zeile

**Gelöscht (durch neue Komponenten ersetzt)**
- `WeekView.vue` → ersetzt durch `EventList.vue`
- `IntroBand.vue` → nicht mehr genutzt, Templates haben keine Intro-Bands separat vom Hero

### Verifikation
- Alle 8 Routes weiterhin HTTP 200
- Home: Slim-Hero sichtbar, "Aktuelle Events im Überblick" rendert, Filter zeigt Kategorien + Zeitraum + Ort, erste Day-Block zeigt "Heute"-Marker
- Vision: "Unsere Motivation", "Leitlinien", drei Säulen (Achtsamkeit/Verbindung/Offenheit) rendern; Nietzsche-Quote ist weg
- Kategorien: Reihenfolge Tanz zuerst, "Ecstatic Dance", "Singkreis", "Zeremonien", "Workshops", "Festivals" als Includes-Zeile sichtbar
- Keine TypeScript-Warnungen, HMR durch laufenden Dev-Server problemlos

### Offene Punkte / nächste Schritte
- Weitere Demo-Events (mehr als 15) anlegen, damit "Weitere 30 Events laden"-Button getestet werden kann
- Event-Detailseiten (`/events/[id]`) anlegen — EventListItem verlinkt aktuell ins Leere
- Bilder-Icons je Kategorie ggf. nochmal abstimmen (Template erwähnt z.B. "Massage Icon", "Festival Bild")
- DE/EN-Sprachumschaltung
- Finale rechtliche Texte für Disclaimer und Impressum
- Verbleibende offene Punkte aus den vorherigen Einträgen

---

## 2026-05-28 — Header-Redesign: Logo-Lockup, Menü-Refinement, Kontakt in Footer

### Ausgangslage
Nach der Multi-Page-Restrukturierung wirkte die Top-Nav noch zu zaghaft: Wordmark zu klein, Menüschrift mit nur 12px und engen Abständen unübersichtlich, Header setzte sich kaum vom Content ab. Außerdem war "Kontakt" als eigenständiger Top-Menüpunkt nicht nötig.

### Ziel
Klar strukturierter Header mit größerem, prägnanterem Logo (Wordmark + Tagline), besser lesbarem Hauptmenü und sauberer Trennung zum Content. Kontakt aus der oberen Leiste in den Footer verschieben.

### Was umgesetzt wurde

**[BrandWordmark.vue](components/BrandWordmark.vue) — Lockup-Modus**
- Neue prop `with-tagline`: rendert unter dem Schriftzug eine kleine uppercase-Tagline (aus `content.brand.tagline`) in `ink-soft`
- Lockup als Flex-Column (Wordmark + Tagline als ein visueller Block)
- Wordmark-Größen angehoben: `sm` 38px, `md` 56px, `lg` 76px, `xl` 100px
- Tagline-Größen abgestimmt: 9 / 10.5 / 12 / 14 px mit `letter-spacing: 2.5px`

**[SiteNav.vue](components/SiteNav.vue) — drei klar getrennte Zonen**
- Logo links: jetzt `size="md"` mit `with-tagline` (statt vorher `size="sm"` ohne Tagline)
- Menü mittig-rechts: Font 14px (statt 12px), `tracking-[2px]`, Gap zwischen Items `36px` (statt `28px`), Hover mit `translate-Y(-1px)`
- Active-State: 3px Gradient-Underline (statt 2px), zusätzlich `font-weight: 500`
- Aktionen rechts (Newsletter-CTA + Sprache): durch vertikalen Divider `border-l border-ink/15` von Menü abgesetzt
- Newsletter-Button: leicht vergrößert (10px×22px Padding, 12px Font, 2px Tracking)
- **Kontakt aus Top-Nav-Links entfernt** — Link-Array enthält nur noch Events, Vision, Kategorien, Events posten

**Trennung zum Content**
- Bottom-Border verstärkt: `1.5px solid rgba(46, 90, 87, 0.12)` (statt `1px / 0.10`)
- Dezenter Schatten unter Nav: `0 4px 14px rgba(46, 90, 87, 0.04)`
- Hintergrund-Opacity erhöht auf `0.96` (statt `0.92`) — bessere Lesbarkeit beim Scrollen

**[content/de.ts](content/de.ts) — Footer-Spalten umsortiert**
- "Mitmachen": nur noch Events posten, Newsletter
- "Rechtliches": Kontakt (neu), Disclaimer, Impressum

**Mobile**
- Mobile-Menü weiterhin per Burger; Link-Größe von 14px auf 15px erhöht, mehr vertikales Padding (3.5 statt 3)

### Verifikation
- Alle 8 Routes weiterhin HTTP 200 (`/`, `/vision`, `/kategorien`, `/events-posten`, `/kontakt`, `/newsletter`, `/disclaimer`, `/impressum`)
- Nav-Inhalt geprüft: Logo + Tagline + 4 Menüpunkte + Newsletter-CTA + DE/EN — **kein Kontakt** mehr im Top-Nav
- Footer-Spalte "Rechtliches" enthält Kontakt, Disclaimer, Impressum
- Tagline rendert korrekt unter dem Wordmark
- `/kontakt` direkt aufrufbar (Page bleibt erhalten)
- HMR durch laufenden Dev-Server, keine Compile-Errors

### Offene Punkte / nächste Schritte
- Sticky-Verhalten beim Scrollen visuell prüfen (evtl. Header bei Scroll noch kompakter machen)
- Active-State auf Mobile noch stärker hervorheben (aktuell nur Coral-Farbe ohne Underline)
- Restliche offene Punkte aus dem 2026-05-28 Restrukturierungs-Eintrag (siehe unten)

---

## 2026-05-28 — Restrukturierung von Single-Page zu Multi-Page

**Plan:** [03_website-restrukturierung-plan.md](03_website-restrukturierung-plan.md)

### Ausgangslage
- Nuxt 3 Single-Page-App: alle Sektionen in einer einzigen `app.vue`
- Inhalte hartcodiert in Komponenten
- Kein Routing, kein `/pages/` Verzeichnis
- DE/EN-Switcher visuell, ohne Funktion
- Brand-Wordmark fest auf "Soulevents"

### Ziel
Multi-Page-Struktur mit echten Routes gemäß Sitemap aus [02_pfeil-sitemap-vorlage.md](02_pfeil-sitemap-vorlage.md). Bestehendes Designsystem (Tailwind-Config, Farben, Typografie, 28 Bilder) vollständig erhalten. Inhalte aller Seiten neu geschrieben.

### Was umgesetzt wurde

**Architektur**
- `app.vue` auf 3 Zeilen geschrumpft (nur noch `<NuxtLayout><NuxtPage/></NuxtLayout>`)
- Neues `layouts/default.vue` mit SiteNav + Slot + NewsletterSection + SiteFooter
- 8 Pages in `pages/` als echte Nuxt-Routes:
  `/`, `/vision`, `/kategorien`, `/events-posten`, `/kontakt`, `/newsletter`, `/disclaimer`, `/impressum`

**Datenschicht (vorbereitet für späteres Backend)**
- `data/types.ts` — TypeScript-Interfaces für `Event`, `Category`, `Location`
- `data/categories.ts` — 5 Kategorien (Inspiration & Lernen, Tanz, Heilsame Angebote, Singen & Musik, Mehrtägige Events) mit Gradient-/Bild-Mapping
- `data/locations.ts` — 10 Demo-Orte aus der Rhein-Main-Neckar-Region
- `data/events.ts` — 15 Demo-Events verteilt über 4 Wochen, alle Kategorien abgedeckt

**Content-Layer (i18n-vorbereitet)**
- `content/de.ts` — alle deutschen Texte als geschachteltes Objekt
- `composables/useContent.ts` — gibt das Content-Objekt zurück (1:1 zu `@nuxtjs/i18n` migrierbar)
- `composables/useEvents.ts` — Wochengruppierung, Kategorien-/Orts-Filterung, Wochennavigation
- `composables/useFormat.ts` — deutsche Datums-/Zeitformatierung

**Neue Komponenten**
- `WeekView.vue` + `DayBlock.vue` + `EventListItem.vue` + `EventFilter.vue` — vertikale Wochenansicht (Tage als sticky Header, Events als horizontale Zeilen)
- `CategoryCard.vue` — große Karten für `/kategorien` mit Bild + Gradient-Pill
- `LoginForm.vue` — Login/Register-Mockup für `/events-posten` (Tabs, ohne Backend)
- `LegalPage.vue` — Wrapper für Disclaimer und Impressum
- `RichTextSection.vue` + `RichTextBody.vue` — generischer Textblock mit optionalem Bild
- `TriCardSection.vue` — generische 3-Karten-Sektion (für Vision-Pillars wiederverwendet)

**Refactored Komponenten**
- `SiteNav.vue` — NuxtLink statt Anker, Mobile-Burger-Menü, Active-Underline, Newsletter-CTA
- `SiteFooter.vue` — 3 Spalten (Entdecken, Mitmachen, Rechtliches) mit echten Routes, content-driven
- `HeroSection.vue`, `IntroBand.vue`, `QuoteBand.vue`, `NewsletterSection.vue` — alle props-driven, mehrfach wiederverwendbar
- `BrandWordmark.vue` — Text aus content/de.ts (jetzt "Soul & Bliss" statt "Soulevents")

**Gelöscht (durch generische Sections ersetzt)**
- `EventsSection.vue` → durch `WeekView.vue` ersetzt
- `AboutSection.vue` → durch `RichTextSection.vue` ersetzt
- `PillarsSection.vue` → durch `TriCardSection.vue` ersetzt
- `EventCard.vue` → durch `EventListItem.vue` (für Wochenansicht) ersetzt

**Brand-Update**
- Wordmark-Text von "Soulevents" auf "Soul & Bliss" geändert
- Page-Title in `nuxt.config.ts`: "Soul & Bliss · Conscious Events · Rhein-Main-Neckar"
- Meta-Description ergänzt

**Asset-Nutzung**
- Alle 28 Bilder in `/public/img/brand/` und `/public/img/logos/` erhalten
- Die zuvor ungenutzten Bilder werden jetzt verwendet:
  - `07_watercolor_splash.png` — auf `/vision` (RichTextSection) und `/kontakt` (Hero)
  - `08_drums_instruments.png` — auf `/events-posten` (Hero) und in der Kategorie "Singen & Musik"

### Verifikation
- Alle 8 Routen liefern HTTP 200
- Alle 8 Brand-Bilder liefern HTTP 200
- Inhalte aus `content/de.ts` rendern korrekt auf jeder Seite
- Wochenansicht zeigt Events nach Tag gruppiert, Filter funktional, Vor-/Zurück-Navigation funktional
- Dev-Server läuft auf `http://localhost:3000`, keine Compile-Errors

### Designsystem unverändert
- Tailwind-Config, custom CSS in `assets/css/main.css`, alle CSS-Variablen (Coral, Teal, Gold etc.) erhalten
- Alle Gradient-Presets (warm, cool, rainbow, ceremony, nature, soulevents) erhalten
- Typografie-Hierarchie (sans/serif/script Fonts) erhalten

### Offene Punkte / nächste Schritte
- DE/EN-Sprachumschaltung funktional implementieren (`@nuxtjs/i18n` installieren, `content/de.ts` → `content/en.ts` ergänzen, `useContent()` durch `$t()` ersetzen)
- Echtes Backend für Events anschließen (`useEvents()` → `useFetch('/api/events')`)
- Login-Funktionalität für Veranstalter·innen implementieren
- Finale rechtliche Texte für `/disclaimer` und `/impressum` einsetzen
- Event-Detailseiten (`/events/[id]`) ergänzen, derzeit verlinken Events nur visuell
- SEO-Feinschliff: Open Graph-Bilder, strukturierte Daten (Schema.org Event)
- Performance-Check und Lighthouse-Audit

---

## 2026-05-22 — Erste NUXT-Implementierung (vor dieser Session)

**Aus Git-Historie rekonstruiert:**
- Commit `cdc33b5` — "new design"
- Commit `419b33a` — "first Mockup NUXT implementation"
- Commit `7ef0b70` — "Erster Test Mockup"

**Stand vor heutiger Session:**
- Nuxt 3 + Tailwind aufgesetzt
- Komponenten-basierte Single-Page-Mockup mit 11 Komponenten
- Komplettes Designsystem mit Tailwind-Theme, custom CSS-Klassen, Gradient-Library
- 28 Brand-Assets (Bilder + Logos in PNG und SVG)
- Brand-Guideline und Design-Iterationen in `Docs/Design 01/` und `Docs/Design 03/`
