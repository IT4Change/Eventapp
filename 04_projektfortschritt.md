# Projektfortschritt — Soul & Bliss Eventapp

Dieses Dokument wird bei jeder Arbeitssession aktualisiert. Neueste Einträge oben.

---

## 2026-06-24 — Neues Icon-Logo in der Nav + warmer Marken-Recolor

### Ausgangslage
Die Marke nutzte einen „Regenbogen"-Verlauf (Coral→Gold→Teal→Blau) für die Wortmarke „Soul & Bliss" und alle Überschriften/Eyebrows (`.grad-text` → `--grad-rainbow`). Der User hat in `Docs/Logo neu/` ein neues Icon-Logo (Sonne + zwei Menschen, warm-erdig) abgelegt.

### Ziel
Logo links vom Schriftzug oben links integrieren; den Schriftzug-Verlauf und die Überschriften auf eine warme, vom Logo abgeleitete Palette (Amber→Terrakotta→Braun) umstellen; auch die türkis/blauen Verlaufs-Akzente warm ziehen. Schriftzug verkleinern, sodass Logo + Schriftzug zusammen denselben Platz einnehmen. Plan: `~/.claude/plans/ich-habe-im-unterordner-bright-acorn.md` (mit User abgestimmt).

### Was umgesetzt wurde
- **Asset:** `Docs/Logo neu/logo-final-icon dunkel.png` (transparent) → `public/img/logos/icon-logo.png` kopiert (Docs/ wird nicht ausgeliefert; sauberer Dateiname ohne Leerzeichen).
- **`components/BrandWordmark.vue`:** neue Prop `withIcon`; Lockup in horizontale `.brand-row` mit `<img class="brand-icon">` links gepackt (nur `md`/Nav opted-in, `alt=""` da Link `aria-label` trägt). Icon `clamp()`-skaliert (mobil 40–64px, ≥640 78px, ≥1024 96px) → skaliert mit der Wortmarke mit. Wortmarke um ~18 % verkleinert (md: clamp 32→26/8.6vw/42; ≥640 64→52; ≥1024 78→64), Tagline proportional. Wortmarken-Gradient → `linear-gradient(to right, #F0A85A, #D9722E, #C05020, #6B3410, #5A2D0E)` (hält dunkelbraun für Lesbarkeit).
- **`components/SiteNav.vue`:** `<BrandWordmark size="md" with-tagline with-icon />`.
- **Recolor (Quellen synchron):** `--grad-rainbow` in `assets/css/main.css` **und** `tailwind.config.ts` → `linear-gradient(120deg, #E8902E 0%, #C05020 50%, #6B3410 100%)` (treibt via `.grad-text` alle Eyebrows/Script-Titel + `.hero-slim::after`). `--grad-cool` → Terrakotta→Braun (`#C05020`→`#6B3410`); ebenso `QuoteBand.vue` (Inline-Gradient) und `NewsletterSection.vue` (blaues Overlay-Ende → Terrakotta). `.btn-outline` Rahmen/Hover-Schatten von Teal → Terrakotta (letzte türkise Restspur). `grad-soulevents` (toter Token) auf den neuen Wortmarken-Gradient aktualisiert.
- **Bewusst NICHT geändert:** Kategorie-Akzentfarben (Pills/Filter) und die Tokens `--teal`/`--blue` (funktionales Farbkodierungssystem); `--grad-warm` (Buttons, bereits warm); Footer-Ink (`#2E5A57`, dunkle Markenbasis, kein Verlauf).

### Verifikation (CDP, echter Viewport)
- DE (Standard `/`) Desktop 1280: Icon links vom Schriftzug, „Soul & Bliss" warm Amber→Braun, Eyebrows/Script („AKTUELLE EVENTS", „Wochenübersicht") warm, Hero-Linie warm. `/vision`: QuoteBand + Newsletter Terrakotta/Braun, weißer Text gut lesbar.
- **Kein horizontaler Overflow** bei 375/390/430px (`scrollWidth === innerWidth`); Icon skaliert mit (49/51/56px), brand-row 261/275/307px.
- DE-Tagline mobil sauber zweizeilig (kein Umbruch). Hinweis: in **EN** bricht die längere Tagline-Zeile 2 bei sehr schmalen Screens um (kürzeres EN-Zeile-1 → schmaleres Lockup) — kosmetisch, kein Overflow.

### Refinement (gleiche Session) — Logo größer/ausgerichtet, Verlauf umgekehrt, Kategorie-Farben
- **Logo zugeschnitten:** `public/img/logos/icon-logo.png` hatte ~16 % transparenten Rand pro Seite (der „verschenkte Platz") → per PIL auf Inhalt beschnitten (856×928, +3 % Sicherheitsrand → 910×982). Motiv dadurch deutlich größer im selben Rahmen.
- **Logo-Größe/Ausrichtung** (`BrandWordmark.vue`): höhenbasiert (`height` clamp 52–74 mobil, 86 ≥640, 98 ≥1024; `width:auto` via `aspect-ratio: 910/982`), `align-items: center` → Icon-Höhe ≈ Lockup-Höhe, oben/unten bündig mit Schriftzug-Oberkante bis Tagline-Unterkante (gemessen: Icon 98 vs. Lockup 100px Desktop, 62 vs. 64 mobil). **Wichtig:** erster Versuch mit `align-items: stretch` + `height:auto` ließ das `<img>` auf seine native 982px-Höhe ausweichen → definite Höhe nötig.
- **Verlauf umgekehrt (dunkel → hell)** überall: Wortmarken-Gradient (`#5A2D0E→…→#EFA24E`), `--grad-rainbow` (`#6B3410→#C05020→#E8902E`, Überschriften/Eyebrows), `--grad-cool`, `QuoteBand`, `NewsletterSection`, `grad-soulevents` (main.css + tailwind.config.ts synchron).
- **Kategorie-Farben aus dem Logo** (`data/categories.ts` accents + Pill/Pin-Klassen in `EventListItem`, `EventFilter`, `CategoryCard`): Tanz=Rot `#C24A22`, Singen&Musik=Gold `#DDA02A`, Inspiration=helles Gold `#EFC868`, Heilsame=Grün `#5E7D36`, Mehrtägige=helles Grün `#9DBA64`. Alte Akzent-Klassen (coral/orange/teal/blue/green/gold via `var(--*)`) vollständig entfernt. Textfarbe je Pille passend (weiß auf Rot/Grün, Dunkelbraun auf den hellen Gold-/Grüntönen) für Kontrast; Filter-Ruhepille = farbiger Rahmen + lesbarer farbiger Text, aktiv = gefüllt.

### Verifikation (Refinement, CDP)
- DE Desktop 1280 + Mobile 390/375/430: **kein Overflow**; Logo bündig zum Textblock; Wortmarke & Überschriften links dunkel → rechts hell; Filter-/Tag-/CategoryCard-Pillen in den 5 Logo-Farben, alle lesbar. `/kategorien` geprüft.

### Refinement 2 (gleiche Session) — Volltöne statt Verlauf, „&" orange, helle Kategorie-Buttons (Farben.md)
Grundlage: `Docs/Design 03/Farben.md` (autoritative Palette: Creme `#F7EDDD`, Sonnen-Gold `#E3B576`, Terrakotta `#C0542E`, Espresso `#632E17`; erweitert u. a. Sonnen-Orange `#F48F4A`, Moos-Grün `#6E8047`, Lehm-Sienna `#A0714D`, Türkis `#39B7AB`).
- **Kein Verlauf mehr in Schriftzügen:** `.grad-text` auf erdige Volltöne umgestellt — Script-Wörter (Wortmarke-Stil, z. B. „Wochenübersicht") = **Espresso `#632E17`** (Logo-Figuren-Ton), Eyebrows/Labels = **Terrakotta `#C0542E`**. Wortmarke „Soul & Bliss" jetzt Espresso-Vollton; das **„&" im Sonnen-Orange `#F48F4A`** (eigener `.brand-amp`-Span, `brand.name` per `split('&')`). Wortmarken-Verlauf entfernt.
- **Kategorie-Buttons hell & erdig, nie weißer Text:** neue CSS-Variablen `--cat-*` (+ `-deep`) in `main.css`; Pill/Pin-Klassen in `EventListItem`/`EventFilter`/`CategoryCard` auf helle Tints mit **Espresso-Text** (`--cat-text`). Filter: Ruhe = heller gefüllter Chip + kräftigerer Rahmen, aktiv = `-deep`-Füllung + Espresso-Rahmen. Zuordnung: Tanz=Terrakotta-Clay `#E4A98E`, Singen&Musik=Gold `#F0D6A4`, **Inspiration=Sienna `#D8B58D`** (distinkt), **Heilsame=Türkis `#A2D8D0`**, Mehrtägige=Moos `#B9C58E`. Alte gesättigte Accent-Keys (red/gold/goldlight/green/greenlight) → clay/gold/sienna/teal/moss.
- **Verifikation (CDP, DE):** Wortmarke Espresso (`rgb(99,46,23)`) + „&" `rgb(244,143,74)`; Überschriften Volltöne; Buttons hell mit dunklem Text, 5 Farben klar unterscheidbar; Desktop 1280 + Mobile 390 kein Overflow; `/kategorien` geprüft.

### Refinement 3 (gleiche Session) — „&" gelb, Wortmarke kompakter, Header sauber, Kategorie-Farben zurückgesetzt
- **„&" im Sonnen-Gelb `#F0C24F`** (statt Orange); `.brand-amp`.
- **Wortmarke kompakter:** `&`-Teile getrimmt + `margin: 0 0.1em` am `.brand-amp`, `letter-spacing: -0.012em`, `padding-right` 0.25→0.1em (Lockup-Breite ~397→348px).
- **Header-Übergang zu „Events" gefixt:** Ursache war ein **scoped-Spezifitäts-Bug** — `.burger { display:flex }` überstimmte Tailwinds `lg:hidden`, sodass der Burger **auch auf Desktop** sichtbar war und die Nav verstopfte. Fix: `@media (min-width:1024px){ .burger{ display:none !important } }`. Danach greift `flex-1 justify-end` → Abstand Logo→„Events" jetzt **71px** (vorher 32). Zusätzlich Nav enger gestuft (lg-Link-Gap 22px/xl 36px, Newsletter-Button/`nav-actions` bei lg kleiner) → **kein horizontaler Overflow mehr bei 1024 und 1280** (vorher 94px Overflow bei 1024).
- **Kategorie-Farben auf Original zurückgesetzt** (User: alte Farben hoben sich besser ab): `categories.ts` accents → orange/teal/blue/green/coral; Pill/Pin-Klassen in `EventListItem`/`EventFilter`/`CategoryCard` wieder `var(--coral/orange/gold/teal/blue/green)` mit weißer Schrift (gefüllt) bzw. farbigem Outline (Filter-Ruhe). Die `--cat-*`-Variablen wieder entfernt.
- **Verifikation (CDP, DE):** Header 1280 sauber (kein Burger, 71px Abstand, gelbes „&"); 1024+1280 ohne Overflow; Filter-Tags in den 5 Originalfarben.

### Refinement 4 (gleiche Session) — Wortmarke Terrakotta + Tagline-bündig, „&"-Verlauf, Nav näher
- **Wortmarke heller = Terrakotta `#C0542E`** (identisch zur Hero-Eyebrow „Aktuelle Events · Rhein · Main · Neckar"); zuvor Espresso. Lockerer gesetzt (`letter-spacing 0.012em`, `&`-`margin 0.18em`, `padding-right 0.16em`) → **Wortmarke ~278px = Tagline-Zeile-1 ~277px**, richtet sich exakt auf die Tagline aus.
- **„&" mit Sonnen-Verlauf** Orange→helles Gelb (`linear-gradient(135deg, #ED8C3C, #F8DD93)`, background-clip:text) — nur das `&`.
- **Hero-Script-Wörter** („Wochenübersicht" etc., `.grad-text.script`) ebenfalls Terrakotta `#C0542E` (= Wortmarke/Eyebrow). Jetzt sind Wortmarke, Eyebrows und Script-Titel einheitlich Terrakotta.
- **Nav-Leiste näher an den Schriftzug:** `ul` ohne `flex-1 justify-end`, stattdessen `ml-3 xl:ml-6` + `nav-actions ml-auto` → Abstand Logo→„Events" **56px** (1280) / 44px (1024) statt 71px, Aktionen rechts. Kein Overflow bei 1024/1280.

### Refinement 5 (gleiche Session) — Schriftzug minimal dunkler, „&"-Beschnitt behoben, Verlauf stärker
- **„Soul & Bliss" + Hero-Script („Wochenübersicht" etc.)** minimal dunkler: Terrakotta `#C0542E` → **`#AC4824`** (Wortmarke-Farbe + `.grad-text.script`). Eyebrow bleibt `#C0542E`.
- **„&"-Beschnitt behoben:** `.brand-amp` auf `display:inline-block` + Padding (background-clip:text beschnitt zuvor den kursiven Glyph). **Nachbesserung:** das erste, nur horizontale Padding reichte nicht — der Beschnitt war **oben** (Glyph ragt über die Zeilenbox). Lösung: Padding auch vertikal erweitert, `margin` neutralisiert es für die Zeilenhöhe. **2. Nachbesserung:** obere rechte Spitze wirkte weiter „abgeschnitten" — Ursache war v. a. **geringer Kontrast** (fast-cremefarbenes helles Verlaufsende `#FBE6A6` auf Creme-Hintergrund) + minimal Clipping. Final: `padding: 0.3em 0.16em` / `margin: -0.3em 0.03em` (mehr Malfläche, Lockup bleibt 100px) und helles Verlaufsende auf **sichtbares Gold `#F3C95E`** (Gradient `#A8500D → #ED8E22 → #F3C95E`). „&" jetzt vollständig und kontrastreich.
- **„&"-Verlauf kräftiger, dunkel → hell:** `linear-gradient(135deg, #B0540F 0%, #EE9026 42%, #FBE6A6 100%)` (dunkles Orange → Sonnen-Orange → helles Gelb).
- Verifikation (CDP, DE): Wortmarke `rgb(172,72,36)`, „&" vollständig + sichtbar stärkerer Verlauf, kein Overflow, weiter Tagline-bündig.

### Offene Punkte / nächste Schritte
- Optional: `hell.png` (App-Icon) als Favicon/PWA-Icon.
- `--grad-rainbow` (warmer Verlauf) nur noch für die dekorative `.hero-slim`-Linie aktiv.

---

## 2026-06-17 — Event-Listenansicht neu formatiert + Heroes schmaler

### Ausgangslage
Events lagen auf der Startseite (`index.vue` → `EventList`) gruppiert unter großen Tages-Überschriften (`DayBlock`). Jede Zeile (`EventListItem`) zeigte links die Zeitspanne (Start–Ende), oben Kategorie-Pille + Ort, darunter Titel, Beschreibung, Pfeil. Heroes waren dem User noch zu hoch.

### Ziel
Event-Übersicht analog dem User-Beispiel komplett neu formatieren; Heroes auf allen Seiten schmaler (oben + unten). Plan & abgestimmte Entscheidungen: [08_event-listenansicht.md](08_event-listenansicht.md).

### Was umgesetzt wurde
- **`components/EventListItem.vue` komplett neu:** flache Zeile mit Datums-Spalte links (Wochentag-Kürzel + `TT.MM.JJ` fett, **nur Startzeit** darunter); Zeile 1 = Titel groß (sans, 21/24px) + externer Domain-Link (`url`→Hostname ohne `www.`); Zeile 2 = Kategorie-Pille (Akzentfarbe) + Stadt + Pin-Icon + Veranstaltungsort; Zeile 3 = Kurzbeschreibung (Teaser, gedämpft, 2 Zeilen). Ganze Zeile = Stretched-Link zur Detailseite, Domain-Link liegt per `z-index` darüber.
- **`components/EventList.vue`:** Tages-Gruppierung entfernt → flache Liste über `visibleEvents`.
- **`components/DayBlock.vue` gelöscht** (nur dort verwendet); `visibleByDay`/`dayKey` aus `useEvents.ts` entfernt (keine Leichen).
- **`composables/useFormat.ts`:** `dayMonthYearShort` (`TT.MM.JJ`) ergänzt.
- **`composables/useEvents.ts`:** `visibleEvents` exportiert.
- **`components/HeroSection.vue`:** Paddings + Min-Höhen aller Varianten moderat reduziert (z. B. slim-inner 22/15→15/11 mobil, 32/22→22/15 desktop; medium 360/420/480→300/340/380; large 480/600/720→400/500/560; generisches inner 48/80→34/56).

### Architekturentscheidungen (Warum)
- **Stretched-Link statt verschachteltem `<a>`:** ganze Zeile klickbar (Detailseite) + eigenständiger externer Domain-Link ohne ungültiges HTML-Nesting.
- **Tag = Hauptkategorie in Akzentfarbe** (nicht Unterkategorie/grau wie im Beispiel) — vom User so entschieden, hält Kategorie-Farbsystem konsistent.

### Wortmarke mobil gehärtet (auf User-Wunsch)
- `components/BrandWordmark.vue` (Größe `md`, Nav-Logo): Wortmarke und nowrap-Tagline-Zeile 1 skalieren auf schmalen Screens per `clamp(... , vw, ...)` herunter (Wortmarke `clamp(32px, 10.5vw, 52px)`, Tagline-Zeilen analog). **Desktop ≥1024px unverändert** (feste 78px greifen weiter; clamp erreicht bei ~495px die bisherigen 52px, ab 640px die festen Werte). Schutz gegen Mobile-Overflow gemäß Mobile-First-Regel.

### Verifikation
- Startseite DE + `/en`: HTTP 200, Konsole sauber. Desktop (1280px): neue flache Liste korrekt — Datums-Spalte, großer Titel + Domain-Link, farbige Pille, Ort + Teaser; Hero schmaler. Entspricht dem User-Beispiel.
- **Mobile via CDP-Emulation (echter Viewport) gemessen:** bei 375 / 390 / 430px **kein horizontaler Overflow** (`document.documentElement.scrollWidth === innerWidth`, 0 überlaufende Elemente). 390px-Screenshot: Titel brechen sauber um, Wortmarke + Burger passen, Pille/Ort/Teaser korrekt.
- **Lektion (Tooling):** Headless-Chrome `--window-size` erzwingt eine Mindest-Layoutbreite (~500px) und schneidet den Screenshot nur zu → täuscht „Overflow"/Beschnitt vor. Für echte Mobile-Prüfung `Emulation.setDeviceMetricsOverride` (CDP) statt `--window-size` nutzen.

### Refinement (gleiche Session) — Platznutzung & Lesbarkeit
- **Heroes/Abstände enger:** slim-Hero-Padding weiter reduziert (mobil 10/8px, Desktop 14/10px); `EventList`-Section `py-9 sm:py-12` → `py-4 sm:py-6`; Abstand Filter→erstes Event (`.event-list` margin-top 20→8px).
- **Event-Zeilen kompakter:** Zeilen-Padding 20→12px (mobil) bzw. 24→14px (Desktop) — deutlich engere Trennlinien-Abstände.
- **Kurzbeschreibung einzeilig:** `white-space: nowrap` + `text-overflow: ellipsis` statt 2-Zeilen-Clamp.
- **Tag-Pille viel kleiner:** font 11→9px, Padding 4/12→2/8px, letter-spacing 1.2→0.6px.
- **Wochentag + Datum größer und ausgeschrieben:** `weekdayShort` → `weekday` (Freitag, Samstag …); Wochentag 16px (mobil)/18px (Desktop), Datum 17/19px. Datums-Spalte 84/104 → 108/132px.
- **Verwaisten „·" behoben:** Trenn-Punkt + Domain in `.ev-linkwrap` (inline-flex) gebündelt → brechen gemeinsam um.
- **Verifikation (CDP, echter Viewport):** 375/390/430 kein Overflow; gemessen passt „Donnerstag" (längster dt. Wochentag) in die Datums-Spalte — 90px in 108px (mobil, 18px Reserve), 101px in 132px (Desktop, 31px Reserve); kein Umbruch. Desktop 1280px deutlich kompakter, Platz hinter Hero/zwischen Events spürbar reduziert.

### Offene Punkte / nächste Schritte
- Keine. (Der zunächst vermutete „Mobile-Overflow" war ein Headless-Crop-Artefakt; Wortmarke auf Wunsch dennoch responsiv gehärtet.)

---

## 2026-06-17 — Kategorien: Figuren im Retreat-Bild an Markenstil angeglichen

### Ausgangslage
Die Kategorien-Karte „Mehrtägige Events" nutzt die Illustration [05_nature_scene.svg](public/img/brand/kategorien/05_nature_scene.svg) (Wald + Zelt + Lagerfeuer). Die drei Personen am Feuer waren einfarbig braune „Klötzchen" (Kopf-Kreis + glockenförmiger Block, ohne Arme/Beine/Kleidungsfarbe) und passten dadurch stilistisch nicht zu den Figuren der anderen Kategorie-Bilder (Tanz `04_dance_silhouettes.svg`, Singen & Musik `08_music_scene.svg`).

### Ziel
Die Menschen im Retreat-Bild so neu zeichnen, dass sie demselben Figuren-Stil und derselben Farbpalette folgen wie Tanz/Musik.

### Was umgesetzt wurde
- Die drei Block-Figuren in `05_nature_scene.svg` durch **ausgearbeitete, am Feuer sitzende Figuren** ersetzt (passend zum Lagerfeuer-Kontext, analog zum sitzenden Gitarristen der Musik-Szene): brauner Kopf, sitzender Körper, **Arme als geschwungene Strichlinien** (stroke-linecap round), gekreuzte Beine als brauner Sitzsockel.
- **Kleidung in Markenfarben** wie in den Referenzbildern: Oliv `#7A8B4A` (vorne links), Terrakotta `#C25E2A` (vorne rechts), Gold `#D4A047` (hinten, kleiner skaliert für Tiefe). Köpfe/Arme/Sockel in `#6B3410` wie die anderen Figuren.
- Komposition als Halbkreis um das Feuer; hintere Figur wird vom (später gezeichneten) Feuer leicht verdeckt → korrekte Tiefenstaffelung.
- **Refinement (gleiche Session):** Personen insgesamt verkleinert (Front ~0.85, hinten 0.64) und die ganze Gruppe + Feuer + Rauch nach oben Richtung vertikale Bildmitte verschoben (Karten-Crop ist `cover`, vertikal zentriert). Feuer höher positioniert mit **längeren/vertikaleren Flammen**. Front-links von Oliv `#7A8B4A` auf **Dunkelgrün `#3F4C29`** geändert — Oliv war fast identisch mit dem Bodengrün (`#83904D`), wodurch der Körper „verschwand"; Dunkelgrün hebt sich klar ab. Oberteile jetzt Dunkelgrün / Gold / Terrakotta.
- **Refinement 2 (gleiche Session):** Rauch als **aufsteigender Kegel** neu gestaltet — 7 Blasen, am Feuer klein/dichter, nach oben wachsend (r 14→38) und höher reichend; Deckkraft deutlich erhöht (0.45→0.16 statt vorher 0.30→0.09), damit die Rauchfahne klar erkennbar ist.
- **Refinement 3 (gleiche Session):** Die drei hellen „Sonnenstrahlen"-Polygone (`#F7EFE0`, opacity 0.30) entfernt. Rauch weiter ausgebaut: größere Blasen und mehr davon (jetzt 13), die oben zu einer breiteren Wolke auffächern (seitliche Blasen im oberen Bereich, r bis 46).

### Verifikation
- `xmllint --noout` → XML valide.
- SVG via `qlmanage` zu PNG gerendert und gegen `04_dance_silhouettes.svg` / `08_music_scene.svg` gegengeprüft: Figuren-Sprache und Farbpalette stimmen jetzt überein.
- Reine statische Asset-Änderung; `categories.ts` referenziert die Datei unverändert, keine Code-/Layout-Anpassung nötig (Mobile unberührt).

### Offene Punkte / nächste Schritte
- Keine. Bei Bedarf könnten die übrigen Kategorie-Illustrationen auf konsistente Figuren-Anzahl/-Posen geprüft werden.

---

## 2026-06-09 — Baikal/CalDAV als Event-Backend

### Ausgangslage
Events lagen statisch in `data/events.ts` (Import in `useEvents()`). Kein Backend, kein Docker-Stack.

### Ziel
Events aus einem **Baikal (CalDAV)**-Server laden, Baikal als Teil eines **docker-compose**-Stacks, Credentials per Config (Default = lokale Instanz + admin-Account), die bestehenden Demo-Events nach Baikal seeden (1 Kalender je Kategorie), Anzeige wie bisher gemeinsam. Plan & Evaluierung: [07_baikal-caldav-backend.md](07_baikal-caldav-backend.md). Blueprint: Schwesterprojekt `webcraftmedia/jahrweiser`.

### Was umgesetzt wurde
- **Architektur:** `Browser → Nitro /api/events → tsdav/ical.js → Baikal`. Kein direkter Browser→DAV-Zugriff; Credentials nur server-seitig. Entspricht der in CLAUDE.md vorgesehenen `useFetch('/api/events')`-Umstellung.
- **Docker-Stack:** [docker-compose.yml](docker-compose.yml) (Baikal `ckulka/baikal:0.10.1-nginx` + App) + [docker-compose.override.yml](docker-compose.override.yml) (Dev), [Dockerfile](Dockerfile) (dev/prod-Targets), [.dockerignore](.dockerignore). **Kein MariaDB** (read-only, keine User-Accounts). Baikal-Port via `BAIKAL_PORT` (Default 8088).
- **Baikal-Bootstrap:** [infra/baikal/init-bootstrap.sh](infra/baikal/init-bootstrap.sh) (überspringt Web-Installer, SQLite, Europe/Berlin) + [infra/baikal/provision-dav-user.php](infra/baikal/provision-dav-user.php) (legt admin-DAV-User an). Adaptiert aus jahrweiser.
- **Config:** `runtimeConfig.dav` (server-only) aus `DAV_URL`/`DAV_USERNAME`/`DAV_PASSWORD` (+ `DAV_WINDOW_MONTHS`), Default `localhost:8088` + `admin/admin`. [.env.example](.env.example).
- **Nitro-API:** [server/helpers/dav.ts](server/helpers/dav.ts) (CalDAV via tsdav), [server/utils/ical.ts](server/utils/ical.ts) (Event⇄VEVENT-Mapping mit ical.js — Build & Parse, X-SB-Props, floating Zeiten), [server/api/events.get.ts](server/api/events.get.ts) (5 Kategorie-Kalender, heute→+12 Monate, sortiert), [server/api/event.get.ts](server/api/event.get.ts) (Einzel-Event per uuid).
- **Feld-Mapping:** nativ `UID/SUMMARY/DTSTART/DTEND/DESCRIPTION/URL/IMAGE/ORGANIZER/CATEGORIES/LOCATION`; Sonderfelder als `X-SB-*` (`teaser`, `subcategory`, `registration`, `price`, `source`, `note`, `location-id`, `maps-url`, `phone`, ggf. `organizer`). Kategorie = Quell-Kalender. **Zeiten floating-local** (verlustfreier Round-Trip, identische Semantik zum bisherigen `new Date("…")`).
- **Locations:** `data/locations.ts` bleibt statische Frontend-Referenz; im VEVENT `LOCATION`-Text + `X-SB-LOCATION-ID`. `region` ungenutzt.
- **Seeding:** [cli/seed-baikal.ts](cli/seed-baikal.ts) (MKCALENDAR der 5 Kategorie-Kalender + ICS-`PUT` der Events via `buildEventIcs`), [cli/baikal-bootstrap.ts](cli/baikal-bootstrap.ts), [cli/tools/config.ts](cli/tools/config.ts) (mit Local-Guard). npm: `cli:baikal:bootstrap`, `cli:seed`. `data/events.ts` ist jetzt **Seed-Fixture** (nicht gelöscht).
- **Frontend (minimal):** `useEvents()` lädt `allEvents` via `useFetch('/api/events')` (key `events`); Event-Detailseite via `useFetch('/api/event?uuid=')`. Filter/Wochengruppierung/Pagination/Komponenten unverändert.

### Architekturentscheidungen (Warum)
- **jahrweiser-Pattern übernommen** statt neu erfinden: in-house erprobt, gleiche Org/Stack, entschärft Baikal-Installer-/Seeding-Friktion.
- **Kein MariaDB:** jahrweiser nutzt es nur für User-Login/Sync; wir sind read-only.
- **Zeiten floating-local:** kein TZ-Mathe, exakter Round-Trip, deckt sich mit dem bestehenden Modell.
- **`X-SB-*` statt nur LOCATION/Notes:** unser Datenmodell ist reicher als jahrweisers; round-trippt verlustfrei in sabre/dav.

### Verifikation
- `docker compose up baikal` (Test-Port 8089, da jahrweisers Baikal 8088 belegte) → healthy.
- `cli:baikal:bootstrap` + `cli:seed` → 5 Kalender, **65/65 Events** in Baikal.
- iCal-Build/Parse-Round-Trip vorab via tsx getestet: Escaping (`\,`), Line-Folding, X-Props, Organizer-Split, lange `detailedDescription` — verlustfrei.
- `/api/events` → HTTP 200, **55 Events** (10 vergangene korrekt durchs Zeitfenster gefiltert); volle Events mappen alle `X-SB`-Felder.
- Frontend DE + `/en`: `/`, `/vision`, `/kategorien`, Event-Detail → 200; Home zeigt aus Baikal geladenen Titel; Detailseite rendert. **Konsole/Server-Log sauber.**

### Offene Punkte / nächste Schritte
- **Caching** für `/api/events` (Nitro-Cache / `sync-collection`-Token) bei wachsender Eventzahl.
- **Recurrence** (`RRULE`) wird aktuell nicht expandiert (Seed hat keine wiederkehrenden Events) — Hook im Mapper vorgesehen.
- **App-Image-Build** (`docker compose up app`) in dieser Session nicht ausgeführt (Verifikation lief gegen Host-`npm run dev`); Compose/Dockerfile liegen bereit.
- **Posting/Moderation** (Schreibpfad) weiterhin Mockup — eigenes Paket.
- **Bild-Hosting** für echte Uploads (Demo-Bilder liegen in `public/img/`).

---

## 2026-06-09 — Internationalisierung (DE/EN) mit @nuxtjs/i18n

### Ausgangslage
Alle Texte lagen statisch in `content/de.ts`, ausgelesen über `useContent()`. Der DE·EN-Schalter in der Nav war ein Stub (nur `console.log`). Daneben hartcodierte Strings (EventFilter, DayBlock-Monate, LoginForm, aria-labels), deutsche Display-Felder in `data/` (Kategorien) und deutsche Datums-Arrays in `useFormat`.

### Ziel
Echte DE/EN-Mehrsprachigkeit produktiv schalten — Texte in Locale-Quellen extrahieren, funktionierender Sprachschalter, vollständige englische Übersetzung inkl. Rechtstexte. Plan: [06_i18n-internationalisierung.md](06_i18n-internationalisierung.md).

### Was umgesetzt wurde
- **Architektur:** `@nuxtjs/i18n` v10 (Vollmodul). Kanonischer **vue-i18n Message-Store + `$t`** (User-Entscheidung gegen den Hybrid-Ansatz). Einzelstrings via `$t('pfad')`, verschachtelte Arrays/Objekte via `tm()` + `rt()`.
- **Config** ([nuxt.config.ts](nuxt.config.ts)): `locales` de/en, `defaultLocale: 'de'`, `strategy: 'prefix_except_default'` (DE behält URLs, EN unter `/en/...`), `lazy` + `langDir: 'locales'`, `detectBrowserLanguage` mit Funktions-Cookie `i18n_locale`, `baseUrl` für SEO.
- **Locale-Dateien:** [i18n/locales/de.ts](i18n/locales/de.ts) (aus altem `content/de.ts` + neue Keys) und [i18n/locales/en.ts](i18n/locales/en.ts) (vollständige Übersetzung **inkl.** Datenschutz/Nutzungsbedingungen/Impressum in GDPR/TMG-Terminologie). `content/de.ts` und `composables/useContent.ts` **gelöscht**.
- **Neue Keys** für vormals hartcodierte Strings: `filter.*`, `home.week.eyebrow/count`, `postEvent.form.successMock`, `event.notFound/sourceLabel/fromTime/registrationValues`, `nav.a11y.*` sowie `categories.items.<key>.*`.
- **Kategorien lokalisiert:** `data/categories.ts` enthält nur noch strukturelle Felder (`gradient/image/accent`); Texte liegen im Store. Neues Composable [composables/useCategories.ts](composables/useCategories.ts) führt beides reaktiv zusammen (`LocalizedCategory`-Typ in `data/types.ts`).
- **Rechtstext-Auflösung:** [composables/useLegal.ts](composables/useLegal.ts) (`useLegalSections`) löst die verschachtelten `sections[].blocks[]` via `tm`+`rt` zu Plain-Objekten auf — `LegalPage.vue` blieb unverändert.
- **Datum/Zeit lokalisiert:** [composables/useFormat.ts](composables/useFormat.ts) mit DE/EN-Arrays (Wochentage, Monate, Kurzmonate) je `locale`; `DayBlock` nutzt `monthShort` aus useFormat (eigenes Array entfernt).
- **Sprachschalter** ([components/SiteNav.vue](components/SiteNav.vue)): Stub ersetzt durch `useSwitchLocalePath()`, aktive Sprache hervorgehoben, Desktop + Mobile.
- **Lokale Links:** interne `<NuxtLink>` → `<NuxtLinkLocale>` (Nav, Footer, Hero-CTAs, Event-Liste, Event-Detail) — bleiben beim Sprachwechsel in der Locale.
- **SEO:** `useLocaleHead()` im [layouts/default.vue](layouts/default.vue) setzt `<html lang>`, `hreflang`-Alternates und canonical; Seiten-Titel/Description je Locale via `$t`.

### Architekturentscheidung (Warum)
- **`$t`-Store statt Hybrid:** kanonisch/erwartbar, lazy-loadbar, native Pluralisierung/Interpolation. Preis: Umbau aller ~18 Komponenten/Seiten + `tm`/`rt` für die strukturierten Legal-Arrays.
- **Kategorie-Split (Struktur vs. Text):** Backend-Daten bleiben sprachneutral; nur Texte i18n-fähig — saubere Trennung, kein doppeltes Pflegen.

### Verifikation
- `npm run dev`: alle Routen **DE und `/en`** → HTTP 200 (Home, Vision, Kategorien, Teilen, Newsletter, Kontakt, Datenschutz, Nutzungsbedingungen, Impressum, Event-Detail).
- Inhalt geprüft: echte Übersetzungen statt Key-Fallback (keine `home.hero`/`nav.*`-Leaks), Brand/Tagline DE+EN, EN-Datenschutz mit GDPR-Terminologie.
- Schalter hin (DE→`/en`) und zurück (EN→`/`), `hreflang`-Alternates korrekt, `<html lang>` = `de-DE`/`en-US`, Interpolation (`30 von 55 Events`), lokalisierte Wochentage (Dienstag/Tuesday).
- **Konsole sauber** (keine Fehler/Warnungen mehr nach Fixes).
- **Bugfix während der Umsetzung:** literale `@` in E-Mail-Adressen brachen den vue-i18n-Compiler (`Invalid linked format`) → alle als `{'@'}` escaped. Außerdem `baseUrl` ergänzt.

### Offene Punkte / nächste Schritte
- **Übersetzte Slugs** (z. B. `/en/categories` statt `/en/kategorien`) bewusst nicht umgesetzt — eigenes Paket via `pages:`-Route-Mapping.
- **Demo-Events/Locations** (`data/events.ts`, `data/locations.ts`) bleiben deutsch (Platzhalter bis Backend) — erscheinen so auch in der EN-Ansicht.
- **Rechtstext-EN juristisch prüfen** (sinngemäße Übersetzung; V01-Hinweis gilt weiter).
- **Mobile-Visualcheck** bei 375/390/430px für die EN-Strings (Nav/Switcher-Tap-Flächen) empfohlen — Layout strukturell unverändert, EN-Längen vergleichbar.
- TypeScript-Typecheck nicht ausgeführt (kein `vue-tsc`/`typecheck`-Script im Projekt); Verifikation über Dev-Build.

---

## 2026-06-07 — Zweite Vision-Grafik (Sternengucker im Nachthimmel)

### Ausgangslage / Ziel
Auf der Vision-Seite eine **zweite Grafik** über dem „Was uns leitet"-Bereich (oberhalb von „Unsere Leitlinien"). Vorgabe: bekannte Brand-Farben mit **starken Gelb- und Rottönen**, ein **Nachthimmel** mit **Stern** und **Mond** sowie **Menschen, die zum Stern / in den Nachthimmel schauen**.

### Was umgesetzt wurde
- **Neu: [public/img/brand/kategorien/10_vision_stargazers.svg](public/img/brand/kategorien/10_vision_stargazers.svg)** (viewBox 1280×720, 16:9 wie das Meditations-Banner): warmer **Nachthimmel** (linearer Verlauf dunkel-warm `#1E1310` → tiefes Rot `#C9461E`) mit kräftigem **Horizont-Afterglow** (radial Gelb `#FDEFA8` → Orange → Rot) hinter den Figuren; **Mond** (warmes Gold, weicher Halo, dezente Krater) oben links; **leuchtender Stern** (4-zackig mit Glow) oben rechts; verstreute kleine Sterne; **vier Menschen-Silhouetten** auf einem dunklen Hügel, die hochschauen — die vordere zeigt mit erhobenem Arm zum Stern. Gefüllte Flächen, Brand-Palette
- **[components/TriCardSection.vue](components/TriCardSection.vue)** um optionale **`image`**-Prop erweitert (analog zum `top`-Banner der RichTextSection): rendert ein **Banner über dem Section-Header** (`.tri-banner`, `aspect-ratio` 3/2 mobil → 16/9 ab `md`, `cover`, Radius 24px, ohne Rahmen), linksbündig `max-w-[480px]` — gleiche Größe/Stil wie das Meditations-Banner
- **[pages/vision.vue](pages/vision.vue)**: `image="/img/brand/kategorien/10_vision_stargazers.svg"` an die `TriCardSection` übergeben

### Verifikation
- SVG nativ (1280×720) gerendert → Nachthimmel mit Mond, leuchtendem Stern, kleinen Sternen, kräftigem Gelb-Rot-Afterglow und hochschauenden, zeigenden Figuren
- `/vision` → 200; **Desktop**-Screenshot: Banner sitzt über „Was uns leitet/Unsere Leitlinien", konsistent mit dem oberen Meditations-Banner; **CDP-Messung** echte Viewports 375/390/430 → **`overflow = 0`** überall, beide Banner gleich breit & linksbündig (`left=20`); CDP-390-Screenshot bestätigt sauberes Mobil-Layout (3:2-Crop zeigt Mond/Stern/Menschen zentriert)

### Iteration nach Feedback (heller, erdig-warm, Mond raus, grüner Boden)
User: zu dunkel → Farben **wie die Meditationsgrafik** (erdig-warm), **kein Nachthimmel** sondern heller **Sonnenuntergang**, **Mond entfernen**, **Stern präsenter**, **Boden grünlich** statt schwarz, **weniger Rottöne**.
- [10_vision_stargazers.svg](public/img/brand/kategorien/10_vision_stargazers.svg) neu gefasst: heller, warmer **Sonnenuntergangs-Himmel** (Verlauf `#FDF1DB` → `#EDA258`, kein Dunkel mehr); Horizont-Afterglow jetzt **gelb-gold-orange** (`#FFF6D6`/`#F9D277`/`#F4A94E`, deutlich weniger Rot); **Mond entfernt**, ebenso die kleinen Nacht-Sterne; **Stern größer & präsenter** (8-zackiges Funkeln mit großem Glow); **grüner Hügel** (Oliv `#7A8B4A`/`#9CB060`/`#5E6B38`) statt schwarzem Boden, ein paar gedämpfte Oliv-Bäume zur Rahmung; **Figuren in Brand-Braun `#6B3410`** (wie die Meditationsfigur) statt fast-schwarz, eine zeigt weiter zum Stern
- Layout/CSS unverändert (nur SVG-Inhalt) → bestehender Banner-Check gilt weiter (Banner gleich groß/linksbündig, `overflow = 0`); Inhalt für den 3:2-Mobil-Crop zentriert (Stern + Gruppe mittig)
- Verifikation: SVG nativ + `/vision`-Desktop-Screenshot → hell, erdig-warm, stimmig zum oberen Meditations-Banner; Mond weg, Stern prominent, grüner Boden, weniger Rot

### Offene Punkte / nächste Schritte
- Bei Bedarf Feinschliff (Anzahl/Pose der Figuren, Stern-Position/-Größe, Intensität des Sonnenuntergang-Glühens) — iterativ

---

## 2026-06-07 — Vision-Grafik neu gezeichnet (Meditation im Wald)

### Ausgangslage / Ziel
Die Grafik links neben „Unsere Motivation für diese Seite" auf der Vision-Seite war das alte Raster-PNG `07_watercolor_splash.png` und gefiel dem User nicht. In der Vorgänger-Session abgesprochen (Eintrag stand als „OFFEN / NÄCHSTER SCHRITT" oben): komplett neue Grafik **analog zu den Kategorien-SVGs** (gleiche erdige Palette, gefüllte Flächen, kaum Outlines), anhand eines vom User hochgeladenen **Inspirationsbilds** (meditierende Person im Wald, von der Abendsonne hinterleuchtet).

### Was umgesetzt wurde
- **Neu: [public/img/brand/kategorien/09_vision_scene.svg](public/img/brand/kategorien/09_vision_scene.svg)** (viewBox 800×800, quadratisch passend zum Slot): meditierende Figur im Schneidersitz (Lotus-Basis, aufrechter Torso, auf den Knien ruhende Arme/Hände, Kopf) als Braun-Silhouette `#6B3410`; **Sonnen-Aura** (konzentrische Kreise `#F2D9A8`/`#D4A047`) mit hellem Kern (`#F4C95D`/`#FCEBB6`) **genau hinter dem Kopf** → hinterleuchteter Heiligenschein wie in der Vorlage; gerahmt von ruhigen Bäumen (zwei flankierende Tannen `#5E6B38` + zwei kleinere + gedämpfte ferne Baumreihe in Oliv `#7A8B4A`); Bodenschatten-Ellipse unter der Figur; ein paar weiche Lichtpunkte. Überwiegend gefüllte Flächen, kaum Outlines — Stil/Palette wie `04_dance_silhouettes.svg` / `08_music_scene.svg` / `06_ceremony_motif.svg`
- **[pages/vision.vue](pages/vision.vue)**: `image`-Prop der `RichTextSection` (Abschnitt `t.vision.about`, `image-side="left"`) von `/img/brand/07_watercolor_splash.png` auf das neue SVG umgestellt. PNG-Original unverändert gelassen

### Verifikation
- SVG bei nativer Größe (800×800) per Headless-Chrome gerendert → sauberes, valides Bild, trifft die Inspirationsvorlage (Silhouette + Sonnen-Halo + Wald)
- `/vision` → 200; neue SVG-URL → 200; Section-Slot per Screenshot geprüft: **Desktop** (1280) zeigt die Grafik im quadratischen Slot mit türkisem Versatzrahmen, cover-gecroppt, vollständiges Motiv; **Mobil** (390, ~1.4:1-Crop) zeigt die Figur sauber zentriert (Kopf + Halo + Sitz im Bild), kein Overflow

### Iteration nach Feedback (Sonnenfarbe, Format, Layout)
User-Wünsche: Sonne im Hintergrund rötlicher (aber weiter gelb/hell, im Farbschema); Figur minimal kleiner; Bild **über** dem „Warum es uns gibt"-Text statt daneben; Format **breiter & nicht quadratisch**; **türkiser Versatzrahmen** („blauer Balken") weg — nur das Bild; gesamter Text **linksbündig**.
- **[09_vision_scene.svg](public/img/brand/kategorien/09_vision_scene.svg) neu im Querformat** (viewBox 1280×720, 16:9): Sonne jetzt als **radialer Sonnenuntergangs-Verlauf** (`#FFF6DD` → `#F8D277` → Orange `#F2994A` → Coral `#E87A5D` → blendet in Creme `#F7EFE0`) — heller gelb-weißer Kern, rötlicher Rand, alles aus der Brand-Palette; heller Halo direkt hinter dem Kopf; Figur etwas kleiner (`scale 0.8`) und zentriert; Wald über die ganze Breite (vier flankierende Tannen + ferne Baumreihe); Bodenschatten + Lichtpunkte
- **[components/RichTextSection.vue](components/RichTextSection.vue)** um Modus **`image-side="top"`** erweitert (generisch, statt Duplikat): Bild als **Banner über dem Text** (`.rich-banner`, `aspect-ratio` 3/2 mobil → 16/9 ab `md`, `background cover`, Radius 24px, **ohne** Versatzrahmen), darunter `RichTextBody` linksbündig; bestehende `left`/`right`-Modi unverändert. Block linksbündig in `max-w-[920px]`
- **[pages/vision.vue](pages/vision.vue)**: `image-side="left"` → `image-side="top"`

#### Verifikation (Iteration)
- Neues SVG nativ (1280×720) gerendert → warmer Sonnenuntergang (gelb-heller Kern, rötlicher Rand), zentrierte kleinere Figur, Wald über die Breite
- `/vision` → 200; Screenshot **Desktop** (1280): Banner **über** dem Text, Querformat, **kein** türkiser Rahmen, Eyebrow/Titel/Absätze linksbündig; **Mobil** (390): Banner über Text, Figur im 3:2-Crop sauber zentriert, kein Overflow

### Iteration 2 nach Feedback (Bild kleiner, mehr Rot, weniger Leerraum)
- **Bild kleiner**: Banner bekommt eigene Max-Breite `max-w-[600px]` (Textblock `max-w-[820px]`) → Grafik braucht spürbar weniger Platz, weiter linksbündig ([components/RichTextSection.vue](components/RichTextSection.vue))
- **Mehr Rottöne in der Sonne**: Verlauf in [09_vision_scene.svg](public/img/brand/kategorien/09_vision_scene.svg) erweitert — gelb-heller Kern (`#FFF6DD`/`#FAD06A`) bleibt, danach Orange `#F2994A` → Coral `#E87A5D` → tiefes Rot-Terrakotta `#D2542A`/`#C25E2A` → Creme-Fade; der rote Bereich ist jetzt deutlich präsenter
- **Weniger Leerraum Hero→Bild**: Section-Top-Padding der `RichTextSection` von `py-16 sm:py-24 lg:py-[100px]` auf **asymmetrisch** `pt-6 sm:pt-8 lg:pt-10` (Unterkante `pb-16 sm:pb-24 lg:pb-[100px]` unverändert) reduziert
- Verifikation: SVG nativ + `/vision` Desktop/Mobil per Screenshot → kleineres Banner, kräftigeres Rot bei hellem Kern, deutlich engerer Abstand unter dem Hero; linksbündig, kein Overflow

### Iteration 3 nach Feedback (kompakter, „Leitlinien"-Bereich, Säulen-Bilder raus)
- **Banner nochmal ~20% kleiner**: `max-w-[600px]` → `max-w-[480px]`; Banner→Text-Abstand `mb-7/9` → `mb-5/6` ([components/RichTextSection.vue](components/RichTextSection.vue))
- **Noch weniger Abstand Hero→Bild + Bild→Folge-Bereich**: `RichTextSection`-Padding auf `pt-3 sm:pt-4 lg:pt-5 pb-8 sm:pb-10 lg:pb-12` (vorher `pt-6/8/10` + `pb-16/24/100`)
- **Engerer Zeilenabstand im About-Text** ([components/RichTextBody.vue](components/RichTextBody.vue)): Eyebrow `mb-4`→`mb-2`; Titel `mb-1.5 leading-[1.2]`→`mb-1 leading-[1.1]`; EN-Zeile `mb-6`→`mb-3`; Fließtext `mb-5 leading-[1.8]`→`mb-3 leading-[1.55]` (Akzent-Variante analog)
- **„Unsere Motivation für diese Seite" einzeilig**: harter `<br>` zwischen Titel und Script-Teil entfernt → inline; auf Desktop/≥~415px eine Zeile, auf schmalen Phones bricht es natürlich sauber um (kein erzwungener/abgeschnittener Umbruch)
- **„Was uns leitet / Unsere Leitlinien" umgebaut** ([components/TriCardSection.vue](components/TriCardSection.vue)): jetzt **linksbündig** (zentrierte `section-*`-Klassen ersetzt durch explizite, mit dem About-Bereich konsistente Klassen, `max-w-[820px]`-Block), **schließt direkt an** (`pt-2 sm:pt-3 lg:pt-4` statt `py-16/24/100`), engere Abstände (Header→Grid `mt-6/8`, Card-Padding 36/44→24/28px, Fließtext `leading-[1.7]`→`leading-[1.5]`)
- **Säulen-Bilder entfernt**: Icon/Bild-Block aus den drei Karten (Achtsamkeit/Verbindung/Offenheit) raus; `img`/`style` aus den Items in [content/de.ts](content/de.ts) und aus dem `Item`-Interface gelöscht (keine Leichen)
- Verifikation: `/vision` → 200; **CDP-Messung** (echte Viewports 375/390/430, `Emulation.setDeviceMetricsOverride`): **`overflowPx = 0`** bei allen drei → kein horizontaler Overflow; Titel einzeilig ab ~415px, darunter sauberer 2-Zeilen-Umbruch; Desktop- + CDP-390-Screenshot bestätigen kompakteres, linksbündiges Layout ohne Säulen-Bilder. Hinweis: `--window-size`-Screenshots sind hier irreführend (rendern breiter) — Maße via CDP gegengeprüft

### Iteration 4 nach Feedback (Sonne an das Leitlinien-Bild angeglichen)
User: das Rot in der Sonne des oberen Meditationsbildes soll am Rand **eher Orange** sein — die **Farbkombination des unteren Leitlinien-Bildes** auch oben nutzen.
- `sunGlow`-Verlauf in [09_vision_scene.svg](public/img/brand/kategorien/09_vision_scene.svg) auf die Gelb-Gold-Orange-Stops des unteren Afterglows umgestellt: `#FFF6D6` → `#F9D277` → `#F4A94E` → `#EE9244` → Creme-Fade `#F7EFE0` (Rot-Stops `#E87A5D`/`#D2542A`/`#C25E2A` entfernt) → heller Kern bleibt, Rand jetzt orange wie unten
- Verifikation: SVG nativ + `/vision`-Desktop → beide Banner teilen nun dieselbe warme Gold/Orange-Palette (stimmiges Paar); nur SVG-Verlauf geändert, kein Layout-Eingriff

### Offene Punkte / nächste Schritte
- Bei Bedarf weiterer visueller Feinschliff (Banner-Größe, Glüh-Intensität) — iterativ
- Altes `07_watercolor_splash.png` wird nun nirgends mehr referenziert — bei Gelegenheit aufräumen, falls endgültig nicht mehr gebraucht

---

## 2026-06-02 — Kategorie-Grafiken überarbeitet (Singen & Musik, Heilsame Angebote)

### Ausgangslage / Ziel
Diese beiden Kategorien zeigten noch die alten Raster-**PNGs** (`08_drums_instruments.png` = Instrumenten-Stillleben, `06_ceremony_motif.png`). Gewünscht: Musik-Grafik komplett neu (weniger Linien, statt Stillleben ein paar musizierende Menschen analog Tanz, erkennbare Gitarre + klarere Trommeln, Noten, erdige Farben); Heilsame Angebote nur sanft überarbeiten (weniger Linien, größere Kerzen, etwas Rauch).

### Was umgesetzt wurde
- **Neu: [public/img/brand/kategorien/08_music_scene.svg](public/img/brand/kategorien/08_music_scene.svg)** (1200×500, Stil/Palette wie Tanz-SVG): drei Musizierende — Djembe-Spieler (olive), sitzender Gitarrist mit klar erkennbarer Gitarre (Korpus, Schallloch, Hals, wenige Saiten), singende Figur mit erhobenem Arm (terrakotta) — plus schwebende Noten, Sonnen-Aura, Bodenschatten. Überwiegend gefüllte Flächen, kaum Outlines
- **Neu: [public/img/brand/kategorien/06_ceremony_motif.svg](public/img/brand/kategorien/06_ceremony_motif.svg)**: Basis = altes Ceremony-SVG, aber **größere Kerzen** + **aufsteigender Rauch** aus den Flammen; linienlastige Elemente entfernt (Mandala-Akzent, Deko-Punkte, Tassels, Salbei-Blatt-Outlines); Salbei jetzt gefüllt, Kristall ohne Outline. Komposition sonst wie zuvor
- **[data/categories.ts](data/categories.ts)**: `music`- und `healing`-Image auf die neuen SVGs umgestellt (PNGs als Originale unverändert erhalten)

### Verifikation
- Beide SVGs in Originalgröße via Headless-Chrome gerendert (sauber, valides XML) + auf der `/kategorien`-Seite in den Karten (Cover-Crop) geprüft — `/kategorien` → 200

### Iteration nach Feedback
- **Tanz** ([04_dance_silhouettes.svg](public/img/brand/kategorien/04_dance_silhouettes.svg)): alle Noten, die Boden-Instrumente (Djembe/Maraca) und die Bewegungs-Marks/Punkte links/rechts entfernt — nur noch Figuren + Sonne + Bodenschatten
- **Heilsame Angebote** ([06_ceremony_motif.svg](public/img/brand/kategorien/06_ceremony_motif.svg)): Kerzen **ohne Ränder** (weiche Füll-Schattierung statt Outline-Stroke), Wachs minimal dunkler (`#E6C88A`); Schalen-Rauch in der Mitte größer/präsenter (3 Schwaden, dicker), Kerzenrauch reduziert
- **Singen & Musik** ([08_music_scene.svg](public/img/brand/kategorien/08_music_scene.svg)): Djembe links kleiner; Sängerinnen-Kleid realistischer (taillierte Bodice + A-Linie + geschwungener Saum + Taillenband/Falten); Gitarre mit realistischeren Proportionen (kleiner oberer Bug, großer unterer Bug, langer Hals); Noten größer (`scale(1.35)`)

### Iteration 2 (Musik-Feinschliff)
- **Gitarre** kleiner + realistischere Proportionen; **anderer Haltewinkel** (diagonal über dem Schoß, Hals nach oben-links, −52°); **Arme neu** — Greifhand am Hals, Schlaghand am Schallloch (per CDP-`getBoundingClientRect` numerisch bestätigt: Hände sitzen auf Hals/Schallloch, Content innerhalb der viewBox)
- **Djembe**: Rand-/Outline-Linie auf der Trommelfläche entfernt (gefülltes helles Fell statt Stroke)
- **Sängerin**: bodenlanges Kleid → **hüftlanges Top + sichtbare Beine** (wie die anderen Figuren)
- **Note oben-links** nach unten verschoben (y148→196), überlappt nicht mehr mit dem Kategorie-Tag in der Karte
- Hinweis: gerendertes Bild dieser Iteration konnte ich wegen eines Bild-Tool-Limits (sehr viele Screenshots in der Session) nicht selbst sichten — Geometrie numerisch geprüft, visuelle Abnahme durch User

---

## 2026-06-02 — Events-Sektion linksbündig + einklappbarer Filter

### Ausgangslage / Ziel
Die Sektion „Aktuelle Events" unter dem Hero war zentriert, mit viel Padding (60–80px), und der Filter eine große Karte mit drei Zeilen (Kategorien, Zeitraum, Ort — Ort-Dropdown mit 40 Einträgen immer offen). Ziel: linksbündig, kompakter, Filter „viel kleiner", Ort nur bei Bedarf, Gesamtsektion auf-/zuklappbar mit Animation. **Filter-Konzept per Rückfrage abgestimmt** → Variante „Kategorien sichtbar + Rest aufklappbar".

### Was umgesetzt wurde
- **[components/EventList.vue](components/EventList.vue)**: Überschriften (Eyebrow „Aktuelle Events", Titel, Intro) **linksbündig** (eigene `ev-*`-Styles statt der zentrierten globalen `section-*`-Klassen); Sektion-Padding `py-[60px] md:py-[80px]` → `py-9 sm:py-12`; Margins reduziert
- **[components/EventFilter.vue](components/EventFilter.vue)** neu aufgebaut: große Karte entfernt → schlanke **Pill-Zeile** (Kategorien immer sichtbar) + Toggle **„Weitere Filter ▾"** (gestrichelt, Chevron dreht). Zeitraum + Ort liegen in einem **aufklappbaren Bereich** mit **Slide-Animation** (CSS-Grid `grid-template-rows: 0fr → 1fr`, plus Opacity/Margin-Transition). Ort-Dropdown erscheint nur im aufgeklappten Zustand. Aktiver Erweitert-Filter (Datum/Ort) hält den Bereich offen und zeigt einen coral Punkt am Toggle; „Filter zurücksetzen" im Panel

### Verifikation
- Desktop: eingeklappt (Pills + Toggle, linksbündig, kompakt) und aufgeklappt (Zeitraum + Ort gleiten herunter, Chevron ▴) per CDP geprüft — `more-wrap.open`, Höhe 102px, Ort-Select sichtbar
- Mobil 390/375: Pills brechen sauber um, **kein Overflow** (per DevTools-Protokoll gemessen)

### Nachjustierung
- Tags kleiner (Pill-Padding 8/15→6/13px, Font 12→11px)
- Abstand Intro→Tags verkleinert (`ev-head` mb 22→12px)
- „Weitere Filter"-Toggle hebt sich jetzt ab: gefülltes dunkles Pill (`--ink`, weiße Schrift) mit Filter-Icon (Trichter-SVG) statt gestrichelter Outline; kein Overflow (390/375 gemessen)

---

## 2026-06-02 — Hero-Bereiche ~30% kompakter (Events, Vision, Kategorien)

### Was umgesetzt wurde — [components/HeroSection.vue](components/HeroSection.vue)
- Slim-Hero-Padding reduziert: oben/unten 40 → 26px (mobil), lg 56 → 38px → weniger Platz oben
- **Überschrift einzeilig**: festen `<br>` zwischen Titel und Script-Teil entfernt, inline mit Leerzeichen (z. B. „Eine kuratierte Wochenübersicht" auf einer Zeile auf Desktop; bricht auf Mobil sauber um)
- Engerer Zeilenabstand: Titel `line-height` 1.1 → 1.05, Body-Akzent `leading` 1.6 → 1.45; Eyebrow-/Body-Abstände verkleinert (`mb-[22px]`→`mb-3`, `my-[22/26px] mb-9` → `mt-3 mb-4/5`)
- Defensive `min-w-0` an der Hero-`.container-w` (Flex-Item) ergänzt

### Verifikation
- Headless-Screenshots (Desktop): Events/Vision/Kategorien deutlich kompakter, linksbündig, Überschrift einzeilig
- **Mobil-Overflow exakt gemessen** (Chrome DevTools-Protokoll, Viewport 390 & 375): scrollWidth = Viewport, **0 überstehende Elemente** → kein Overflow. Hinweis: `--headless=new --window-size` setzt den Viewport NICHT (rendert ~500px) → frühere „abgeschnittene" Screenshots waren Artefakte; korrekte 390px-Screenshots via CDP (`Emulation.setDeviceMetricsOverride`) bestätigen sauberes Mobil-Layout

### 2. Iteration (noch kompakter + größere Überschrift)
- Slim-Padding nochmals ~15% kleiner (22px mobil / 32px lg)
- Roter Akzent-Text breiter: Block `max-w-[720px]`→`880px`, Akzent-`max-w` 600→840px → längere Zeilen, weniger Raum rechts, vertikal kompakter
- Überschrift größer; Script-Teil (z. B. „Wochenübersicht") deutlich größer als der Rest: slim-Titel 28/35/42px, Script 42/54/64px (Verhältnis ~1,5×)
- Erneut bei 390/375 gemessen: kein Overflow; Desktop einzeilig, Mobil bricht sauber um

### 3. Iteration (Vision/Kategorien einzeilig garantieren + weniger Platz unten)
- `white-space: nowrap` für `.hero-slim .hero-title` ab `md` → Überschrift **garantiert einzeilig** auf Desktop/Tablet (unabhängig von Schreibschrift-Font-Fallback, der bei einzelnen Systemen umbrechen ließ); auf Mobil weiter Umbruch erlaubt. Bei 770px/1280px geprüft: einzeilig, kein Overflow
- Unteres slim-Padding asymmetrisch reduziert (padding-bottom 22→15 mobil / 32→22 lg) → weniger Leerraum unter dem roten Text (v. a. auf Kategorien sichtbar). Alle drei Heroes jetzt strukturell identisch
- Mobil-Overflow erneut gemessen (Vision, 390/375): kein Overflow

---

## 2026-06-02 — Hero linksbündig + E-Mail-Button kleiner

### Was umgesetzt wurde
- **Hero-Bereiche linksbündig** ([components/HeroSection.vue](components/HeroSection.vue)): Bug behoben — der Hero ist ein `flex`-Container, dadurch schrumpfte die innere `.container-w` auf Inhaltsbreite (720px) und wurde per `mx-auto` zentriert (Hero wirkte eingerückt/zentriert). Fix: `w-full` an die `.container-w` → spannt volle Breite (max 1240, zentriert wie die Nav), 720er-Block linksbündig darin → Eyebrow/Titel/Text fluchten mit dem Logo. Gilt für alle Hero-Seiten (Events, Vision, Kategorien, Kontakt, Newsletter)
- **E-Mail-Button (`.btn-mail`) ~15% kleiner** ([assets/css/main.css](assets/css/main.css)): Padding `px-6 sm:px-10 py-4 sm:py-5` → `px-5 sm:px-8 py-3 sm:py-4`; Schrift `text-base sm:text-lg lg:text-xl` → `text-sm sm:text-base lg:text-lg`

### Verifikation
- Headless-Screenshots: Vision-Hero linksbündig (bündig mit Logo); /teilen-Button kleiner & proportionaler. Alle Routen (`/`, `/vision`, `/kategorien`, `/teilen`) → 200

---

## 2026-06-02 — Teilen-Seite kompakter & linksbündig

### Ausgangslage / Ziel
Die /teilen-Seite war zentriert und großzügig gesetzt (viel Leerraum oben, großer Abstand zwischen den Varianten, zweizeilige Überschriften). Gewünscht: übersichtlicher, alles linksbündig, Akzentschrift kleiner, Überschrift „Veranstaltung per E-Mail teilen" einzeilig, engere Abstände.

### Was umgesetzt wurde
- **[pages/teilen.vue](pages/teilen.vue)** neu aufgebaut: eine schlanke, **linksbündige** Spalte (`container-w` volle Breite + linker `max-w-[680px]`-Block, bündig mit dem Logo), reduziertes oberes Padding (`py-7 sm:py-10`). Beide Varianten als kompakte Blöcke: Eyebrow (grad-text) + **einzeilige** Überschrift (Titel + cursive `script`-Teil inline, kein Umbruch mehr) + kleinere coral-Akzentabsätze (15/16px, engerer Zeilenabstand) + CTA bzw. Formular. Geringerer Abstand zwischen Variante 1 und 2 (dezente Trennlinie statt großem Padding)
- **[components/LoginForm.vue](components/LoginForm.vue)** zum kompakten, **linksbündigen** Formular-Block umgebaut: Intro (RichTextBody) und großflächiger Section-Rahmen entfernt (Intro liefert jetzt die Seite); Formular als schmale weiße Karte (max-width 440px), Überschrift/Hinweise linksbündig, kompaktere Inputs/Tabs
- RichTextSection-Nutzung auf /teilen entfernt (Layout jetzt direkt in der Seite)

### Verifikation
- `/teilen` → 200; Headless-Screenshot bestätigt kompaktes, linksbündiges Layout, einzeilige Überschrift, kleinere Akzentschrift; `/` und Event-Detailseite weiterhin 200

### Nachjustierung (Überschriften)
- Bunten (grad-text) Eyebrow entfernt; Inhalt auf schlichtes **„Variante 1" / „Variante 2"** (ink-soft) gekürzt ([content/de.ts](content/de.ts))
- Überschriften größer (27 → 36px); der cursive grad-text-Teil („E-Mail teilen" / „teile selbst") zusätzlich `1.18em` größer

### Nachjustierung (Breite)
- Inhalt nutzt auf Desktop mehr Breite: Spalte `max-w-[680px]` → `max-w-[920px]`, Akzenttext `max-width` 600 → 820px. **Mobil unverändert** (Caps liegen über der Handy-Breite), per Screenshot bei 390px gegengeprüft (kein Overflow)

---

## 2026-06-02 — Event-Detailseite kompakter gestaltet

### Ausgangslage / Ziel
Die Detailseite verschenkte Platz: der Hero (Bild als Hintergrund) füllte fast die halbe Seite, Sektionen hatten große Paddings. Gewünscht: übersichtlicher, dichter, weniger Leerraum; Bild **nicht** als Hintergrund, sondern eigenständig weiter unten in natürlicher Auflösung.

### Was umgesetzt wurde — [pages/event/[uuid]/[slug].vue](pages/event/%5Buuid%5D/%5Bslug%5D.vue)
- HeroSection (Bild-Hintergrund, große Min-Höhe) und die großflächigen RichTextSection/Sektions-Paddings entfernt
- Stattdessen **eine kompakte Spalte** (`container-w max-w-[820px]`, geringes Padding): kleiner Kopf (Kategorie-Pill + Titel + Kurzbeschreibung) → **kompakte Fakten** (Label/Wert-Raster, schmale Zeilen) → Kontakt-Buttons → „Über dieses Event" → **eigenständiges Bild** (`<img>`, zentriert, max-width 460px, 512×512 natürlich, nicht gestreckt/gecroppt) → Hinweis/Quelle
- Titelgröße moderat (26 → 34 → 40px statt Hero-60px); Design-Tokens (ink/coral, pill-Farben, .btn) beibehalten

### Verifikation
- Beispiel-Event → 200; Bild als `<img class="event-image">` mit echtem `src` (kein Hintergrund mehr); Headless-Screenshot bestätigt kompaktes, dichtes Layout; keine Fehler

### Feinjustierung (2. Iteration, nach User-Feedback)
- Padding über/unter „Zurück zu den Events" reduziert (`py-4 sm:py-6`, engerer Kopf)
- Neben dem Kategorie-Pill kein zusätzliches „Tanz · Contact Dance" mehr (Pill genügt); Subkategorie ganz entfernt
- Titel kleiner (22 → 27 → 30px) + engerer Zeilenabstand (1.1); Fließtext-Zeilenabstand 1.6
- **Website, E-Mail, Telefon** als genannte Werte oben in den Fakten (gleiches Label/Wert-Format wie Datum/Ort)
- Die drei Kontakt-Buttons (Website/E-Mail/Anrufen) nach **ganz unten** (unter Beschreibung + Foto) verschoben
- **Linksbündig** statt zentriert: äußerer Container volle Breite (wie die Nav), lesbarer 820px-Block links → Inhalt fluchtet mit dem „Soul & Bliss"-Logo
- Per Headless-Screenshot gegengeprüft

### Offene Punkte
- Weitere visuelle Feinjustierung mit User (Bildgröße, Fakten-Spaltenbreite mobil) — iterativ

---

## 2026-06-02 — Event-Detailseiten (`/event/{uuid}/{slug}`)

### Ausgangslage
Events waren nur Listenzeilen ohne Detailseite/Verlinkung. Ziel: für jedes Event eine Detailseite im bestehenden Design, über eine stabile, SEO-freundliche URL.

### Ziel & Entscheidungen (vom User bestätigt)
- URL **`/event/{uuid}/{titel-slug}`**: Lookup nur über UUID; Slug = slugifizierter Titel; bei falschem Slug **301-Redirect** auf die kanonische URL; unbekannte UUID → 404.
- Detailseite zeigt **alle** Zusatzfelder (detaillierte Beschreibung, Veranstalter-Kontakt, Anmeldung + Subkategorie, Maps-Link, Aggregator-Hinweis).

### Was umgesetzt wurde
- **Datenmodell** ([data/types.ts](data/types.ts)): `Event` um `uuid` (Pflicht) + `subcategory`, `detailedDescription`, `registration`, `email`, `phone`, `mapsUrl`, `source`, `aggregatorNote` erweitert
- **Daten neu erzeugt** ([data/events.ts](data/events.ts), Generator `/tmp/gen2.mjs`): 50 CSV-Events mit allen Feldern neu erzeugt; allen 65 Events eine **deterministische UUID** (uuid v5 aus der Event-ID → reproduzierbar) vergeben
- **Helfer** ([composables/useEvents.ts](composables/useEvents.ts)): `slugify`, `eventPath(event)` (kanonischer Pfad), `getEventByUuid(uuid)`
- **Detailseite** [pages/event/[uuid]/[slug].vue](pages/event/%5Buuid%5D/%5Bslug%5D.vue): Auflösung per UUID (404/Redirect-Logik), Layout aus bestehenden Bausteinen — Hero (mit Event-Bild) → Fakten-Block (Datum/Zeit inkl. Mehrtages-Range, Ort + Maps, Kategorie-Pill + Subkategorie, Anmeldung, Preis, Veranstalter) → Beschreibung (RichTextSection, lange Beschreibung in Absätze gesplittet) → Veranstalter-Kontakt (Website/E-Mail/Telefon als Buttons) → Aggregator-Hinweis + Quelle → Zurück-Link. Dynamische `useHead`-Meta inkl. `og:image`
- **Liste** ([components/EventListItem.vue](components/EventListItem.vue)): Zeile ist jetzt `NuxtLink` auf `eventPath(event)` (Pfeil funktional)
- **Texte** ([content/de.ts](content/de.ts)): neuer `event`-Abschnitt mit UI-Labels

### Verifikation
- Korrekte URL → 200 (alle Sektionen gerendert); falscher Slug → **301** auf kanonische URL; unbekannte UUID → **404**
- Altes Demo-Event ohne Zusatzfelder rendert sauber (Maps/Kontakt korrekt ausgeblendet); Liste verlinkt auf `/event/…`
- Keine echten Fehler (die `createError`-Logzeilen stammen vom 404-Test)

### Offene Punkte / nächste Schritte
- Statische Generierung (Prerender) der dynamischen Routen für Produktion ggf. konfigurieren — im Dev unkritisch
- Optional: „Ähnliche Events" auf der Detailseite, Bild-Thumbnails in der Listenzeile
- Visuelle Prüfung im Browser/iPhone steht beim User aus (Hero-Titelgröße bei langen Titeln, Mobile-Umbrüche)

---

## 2026-06-02 — Beispieldaten aus CSV eingespielt (50 Events)

### Ausgangslage
In `Docs/Beispieldaten/` lag eine CSV mit 50 fiktiven Events (10 je Kategorie) inkl. Bildern, um die Seite mit realistischem Inhalt zu prüfen.

### Ziel
CSV analysieren und als Daten einspielen, Kategorien korrekt zuordnen, Events sichtbar machen. (User-Entscheidungen: bestehende Demo-Events **ergänzen** statt ersetzen; Bilder **kopieren, aber noch nicht anzeigen**.)

### Was umgesetzt wurde
- **Generator** (Node, temporär `/tmp/gen_events.mjs`): robuster CSV-Parser (Semikolon, Quotes, mehrzeiliger Header), mappt Felder auf das `Event`-Modell, dedupliziert Locations, kopiert Bilder
- **Kategorie-Mapping**: Tanz→dance, Singen & Musik→music, Heilsame Angebote→healing, Inspiration & Lernen→inspiration, Mehrtägige Events→retreat (je 10 ✓)
- **Region-Mapping**: Frankfurt/Aschaffenburg/Darmstadt→main, Mainz/Wiesbaden→rhein, Heidelberg→neckar
- **[data/events.ts](data/events.ts)**: 50 Events ergänzt (jetzt 65). Felder: `id` (CSV Event-ID), `title`, `category`, `start`/`end` (ISO aus Datum+Zeit, Mehrtages-Events mit End-Datum), `locationId`, `description` (Kurzfassung), `url`, `image`
- **[data/locations.ts](data/locations.ts)**: 30 neue Locations (Präfix `bsp-`) ergänzt (jetzt 40)
- **Bilder**: 50 PNGs nach [public/img/events/](public/img/events/) kopiert (Unterordner je Kategorie); Pfad in `image` gespeichert, in der Liste (noch) nicht angezeigt

### Verifikation
- `/` → 200; CSV-Events sichtbar (z. B. „Grenzen spüren, Klarheit finden"); Counter „30 von 58 Events" (58 kommende ab heute, Paginierung „Mehr laden")
- Orts-Filter zeigt die neuen Locations; keine `undefined`-Location-Anzeigen; Beispielbild lädt (200); keine Konsolen-/Build-Fehler
- Datums-Spanne der Importe: 2026-07-04 bis 2027-03-19

### Offene Punkte / nächste Schritte
- Event-Bilder werden noch nicht angezeigt — optionale UI-Erweiterung (Thumbnail in der Liste oder Detailseite) möglich
- Orts-Filter hat durch 40 Locations viele Einträge — ggf. später nach Stadt gruppieren
- CSV enthält weitere Felder (Subkategorie, Telefon, Anmeldung erforderlich, detaillierte Beschreibung, Quelle) — bei Bedarf ins Modell aufnehmen

---

## 2026-06-02 — Rechtstexte (Datenschutz, Nutzungsbedingungen, Impressum) eingebunden

### Ausgangslage
Die drei Rechtsseiten enthielten Platzhaltertexte. Der User stellte drei Word-Dokumente bereit (`Docs/Legal Docs/V01/`).

### Was umgesetzt wurde
- **Texte extrahiert** aus den `.docx` (macOS `textutil`) und in [content/de.ts](content/de.ts) eingebunden: `impressum`, `nutzungsbedingungen`, `datenschutz`
- **LegalPage erweitert** ([components/LegalPage.vue](components/LegalPage.vue)): Sektionen unterstützen jetzt strukturierte **Blöcke** statt nur `body` — `{ p }` (Absatz), `{ sub }` (Unterüberschrift, h3) und `{ list }` (Aufzählung mit coral-Punkt). So bleiben Überschriften-Hierarchie und Listen erhalten, im einheitlichen Seitendesign (h1/h2 serif, h3 sans, ink/coral-Tokens)
- Datenschutzerklärung vollständig mit DSGVO-Struktur (I–VII, Unterabschnitte, Aufzählungen); Nutzungsbedingungen mit Unterabschnitten; Impressum schlicht
- Offensichtliche Tippfehler/Abbrüche aus der V01-Vorlage dezent korrigiert (z. B. „Plattfromen" → „Plattformen", unvollständiger Satz vervollständigt)

### Verifikation
- `/datenschutz`, `/nutzungsbedingungen`, `/impressum` → 200; Überschriften, Unterüberschriften und Listen werden gerendert; keine echten Fehler im Output

### Offene Punkte / nächste Schritte
- **Wichtig:** Die Texte sind V01 und enthalten Platzhalter (z. B. „Mohammed Mustermann / Musterstrasse 99", USt-ID `DE XXX`, Google-AdSense-Passage obwohl evtl. nicht genutzt). Vor Live-Gang **juristisch prüfen und finalisieren**; ggf. nicht zutreffende Abschnitte (AdSense) entfernen.

---

## 2026-06-02 — Footer-Restrukturierung + Rechtsseiten (Datenschutz/Nutzungsbedingungen)

### Ausgangslage
Footer-Spalten: Entdecken / Mitmachen (Teilen, Newsletter) / Rechtliches (Kontakt, Disclaimer, Impressum).

### Ziel
Kontakt zu „Mitmachen"; „Rechtliches" auf Datenschutz, Nutzungsbedingungen, Impressum umstellen. (Vom User bestätigt: Disclaimer-Seite umbenennen + neue Nutzungsbedingungen-Seite anlegen.)

### Was umgesetzt wurde — [content/de.ts](content/de.ts) + Seiten
- **Footer-Spalten** ([content/de.ts](content/de.ts)): „Mitmachen" = Teilen · Newsletter · **Kontakt**; „Rechtliches" = **Datenschutz** · **Nutzungsbedingungen** · Impressum
- **Disclaimer → Datenschutz**: Seite `pages/disclaimer.vue` → `pages/datenschutz.vue` (`git mv`), Route `/disclaimer` → `/datenschutz`; Content-Key `disclaimer` → `datenschutz` mit Titel „Datenschutz" und passenden Datenschutz-Platzhaltertexten (Verantwortliche Stelle, erhobene Daten, Newsletter, Rechte)
- **Neu: Nutzungsbedingungen** — [pages/nutzungsbedingungen.vue](pages/nutzungsbedingungen.vue) (LegalPage) + Content-Abschnitt `nutzungsbedingungen` (Rolle der Plattform, Veranstaltungen teilen, Teilnahme auf eigene Verantwortung, Inhalte/externe Links — teils aus dem alten Disclaimer übernommen). Platzhalter, finaler Text folgt.

### Verifikation
- `/datenschutz`, `/nutzungsbedingungen`, `/impressum`, `/kontakt` → 200; alte `/disclaimer` → 404
- Footer zeigt die neuen Links; keine `disclaimer`-Reste mehr im Code

### Offene Punkte / nächste Schritte
- Rechtstexte (Datenschutz, Nutzungsbedingungen, Impressum) sind Platzhalter — vor Live-Gang durch finale Texte ersetzen

---

## 2026-06-02 — Kategorie-Grafiken: Tanz (Geschlechter-Mix) + „Mehrtägige Events" (grüner)

### Was umgesetzt wurde

**Tanz-SVG (`kategorien/04_dance_silhouettes.svg`, → v4)**
- Ziel: links und rechts je eine Frau mit Rock und ein Mann mit Hut
- Figur 2 (links): Rock entfernt + Hut ergänzt → Mann mit Hut
- Figur 4 (rechts): Hut entfernt + Rock ergänzt → Frau mit Rock
- Ergebnis: links Figur 1 (Frau/Rock) + Figur 2 (Mann/Hut); rechts Figur 4 (Frau/Rock) + Figur 5 (Mann/Hut)

**Nature-SVG „Mehrtägige Events" (`kategorien/05_nature_scene.svg`, → v3)**
- Insgesamt wieder grüner: Boden olivgrün (statt braun), vollere/grünere Baumreihe
- Erdfläche reduziert (nur noch schmaler dunkler Streifen unten)
- Bäume größer/prominenter (zwei große Tannen + dritte mittlere + dichtere Baumreihe)
- Personen und Lagerfeuer vergrößert (Personen `scale ~1.25`, Feuer `scale 1.45`); Zelt leicht größer

### Verifikation
- Beide SVGs via `qlmanage` (Vollbreiten-Render) geprüft — Motive korrekt
- `/kategorien` → 200; beide bearbeiteten SVG-Assets → 200

### Grafik-Versionen (Kategorien) — Fortführung
- **04_dance_silhouettes** — … v3 (Hüte, größere rechte Figuren) · **v4** (Frau/Rock + Mann/Hut je Seite)
- **05_nature_scene** — v1 Original · v2 (erdig, Zelt/Feuer/Menschen) · **v3** (grüner, weniger Erde, größere Bäume/Personen/Feuer)

---

## 2026-06-02 — Kategorie-Grafiken: Tanz verfeinert + „Mehrtägige Events" neu gestaltet

### Was umgesetzt wurde

**Tanz-SVG (`kategorien/04_dance_silhouettes.svg`, → v3)**
- Fuß-Strich der 2. Figur entfernt; Strich (Fuß) der rechten Figur entfernt
- Die beiden rechten Figuren (4 & 5) um ~18 % vergrößert (`scale(1.18)`, Translate nachjustiert) und je mit Hut versehen (Figur 4 goldene Krone, Figur 5 terrakotta) → interessanter

**Nature-SVG → „Mehrtägige Events" (`kategorien/05_nature_scene.svg`, neu v2)**
- Retreat-Kategorie auf SVG umgestellt ([data/categories.ts](data/categories.ts): `05_nature_scene.png` → `kategorien/05_nature_scene.svg`)
- Grüntöne reduziert: Boden jetzt erdig-braun (statt olivgrün), Hintergrundbäume gedämpft; nur die zwei Tannen bleiben grün
- Neu ergänzt: **Zelt** (terrakotta A-Frame mit dunklem Eingang) im Wald, **Lagerfeuer** (Flammen + Scheite) mit **aufsteigendem Rauch**, **3 sitzende Menschen** ums Feuer
- Alte, im Karten-Crop ohnehin unsichtbare Elemente (Steinkreis, Bodenkleinkram) entfernt

### Verifikation
- SVGs via `qlmanage` gerendert und visuell geprüft (inkl. Vollbreiten-Render über erweiterte Leinwand, da `qlmanage` breite Bilder quadratisch beschneidet)
- `/kategorien` → 200; alle drei bearbeiteten SVG-Assets → 200; Seite nutzt die SVG-Pfade (dance, mandala, nature)

### Grafik-Versionen (Kategorien) — Fortführung
- **04_dance_silhouettes** — v1 Original · v2 (Figur 2 dynamisch, Noten/Instrumente) · **v3** (Fuß-Striche raus, Figuren 4&5 größer + Hüte)
- **02_mandala_motif** — v1 Original · v2 (erdige Vollflächen-Blüte)
- **05_nature_scene** — v1 Original · **v2** (erdiger, Zelt + Lagerfeuer/Rauch + Menschen)

### Offene Punkte / nächste Schritte
- 2 übrige Kategorie-Bilder (Singen & Musik = `08_drums_instruments`, Heilsame Angebote = `06_ceremony_motif`) noch als PNG — Umstellung/Überarbeitung separat

---

## 2026-06-02 — Kategorie-Grafiken: SVG-Versionierung + Tanz & Mandala überarbeitet

### Ausgangslage
Die Kategorie-Karten ([data/categories.ts](data/categories.ts)) zeigten **PNG-Rastergrafiken**, die nicht editierbar sind. Es existieren aber handgeschriebene, editierbare **SVG-Vektor-Versionen** derselben Motive (PNGs sind nur Raster-Exporte davon).

### Ziel
Kategorie-Grafiken bearbeitbar machen + versionieren; den Anfang machen Tanz (lebendiger, Musik-Bezug) und Inspiration/Mandala (weniger Linien, erdiger).

### Was umgesetzt wurde

**Versionierung / Ordnerstruktur** — `public/img/brand/kategorien/`
- `originals/` — unveränderte v1-Baseline aller 5 Kategorie-Grafiken (je PNG + SVG), wird nie editiert
- `kategorien/*.svg` — Arbeits-SVGs, die die Seite nutzt (aktuell die 2 bearbeiteten)
- `versions/` — Archiv je Iteration (`*_v1.svg`, `*_v2.svg`)

**Format-Umstellung** — [data/categories.ts](data/categories.ts)
- dance + inspiration `image:` von `/img/brand/*.png` auf `/img/brand/kategorien/*.svg` umgestellt (CSS-`background-image` in [CategoryCard.vue](components/CategoryCard.vue) funktioniert mit SVG identisch). Die 3 übrigen Kategorien bleiben vorerst PNG.

**Tanz-SVG (`kategorien/04_dance_silhouettes.svg`)**
- 2. Figur von links: statische „Sprung"-Pose → dynamische, geneigte Tanzpose (Arm hochgeworfen, ausgestelltes Bein) mit goldenem Rock-Akzent
- Musik-Elemente ergänzt: schwebende Notensymbole (Achtel-Paar + Einzelnoten in Braun/Terrakotta), kleine Instrumente am Boden (Djembe-Trommel, Rassel), zusätzliche Schwung-Striche → lebendiger

**Mandala-SVG (`kategorien/02_mandala_motif.svg`)**
- Komplett neu: dünne Linien/gestrichelten Ring/Konzentrik-Kreise entfernt; vollflächige Blüte aus 8 Terrakotta- + 8 Gold-Blütenblättern, gefüllte Sonnen-Mitte (Gold→Terrakotta→Braun), 8 Akzentpunkte, warmer Hintergrund — kräftig & erdig, passend zu den anderen Bildern

### Verifikation
- SVGs gerendert (macOS `qlmanage`) und visuell geprüft — Motive korrekt, erdige Farben, Mandala ohne Linien-Wirrwarr
- Ein XML-Fehler im Mandala (`&` in `<desc>`) erkannt und zu `&amp;` korrigiert
- Dev-Server (war zwischenzeitlich gestoppt → neu gestartet): `/kategorien` & `/` → 200; beide SVG-Assets → 200, valides XML; Seite nutzt die neuen SVG-Pfade

### Grafik-Versionen (Kategorien)
- **04_dance_silhouettes** — v1: Original (5 Figuren, Sonne). v2 (2026-06-02): Figur 2 dynamische Tanzpose + Gold-Rock; Noten, Djembe, Rassel, Schwung-Striche.
- **02_mandala_motif** — v1: Original (blass, viele dünne Linien). v2 (2026-06-02): vollflächige erdige Blüte, gefüllte Sonnen-Mitte, keine dünnen Linien.

### Offene Punkte / nächste Schritte
- 3 übrige Kategorie-Bilder (Singen & Musik, Heilsame Angebote, Mehrtägige Events) noch als PNG — Umstellung/Überarbeitung separat
- Optional: bearbeitete SVGs zusätzlich als PNG rastern, falls an anderer Stelle PNG benötigt wird
- Visueller Feinschliff der neuen Grafiken im Browser/iPhone nach User-Sichtung

---

## 2026-06-02 — Teilen-Seite: Akzent-Absätze, neue E-Mail & Outline-Button

### Ausgangslage
Die Teilen-Seite (zwei Bereiche „Variante 1 · E-Mail" und „Variante 2 · Login") war inhaltlich fertig, sollte aber optisch nachgeschärft werden.

### Was umgesetzt wurde

**Rote Akzent-Formatierung für die Fließtexte** — [RichTextBody.vue](components/RichTextBody.vue), [RichTextSection.vue](components/RichTextSection.vue), [teilen.vue](pages/teilen.vue), [LoginForm.vue](components/LoginForm.vue)
- `RichTextBody` um Option `accentBody` erweitert: rendert die Absätze in coral/kursiv/Serif (wie der Hero-Akzent); `RichTextSection` reicht sie durch
- Aktiviert für die Absätze in Variante 1 (E-Mail) und Variante 2 (Login-Intro)

**Neue E-Mail-Adresse** — [content/de.ts](content/de.ts)
- CTA unter Variante 1: `events@soulandbliss.de` → `veranstaltung-teilen@soul-and-bliss.de` (Label + `mailto:`)

**E-Mail-Button als großer Outline-Button** — [main.css](assets/css/main.css), [RichTextBody.vue](components/RichTextBody.vue), [RichTextSection.vue](components/RichTextSection.vue), [teilen.vue](pages/teilen.vue)
- Neue globale Button-Variante `.btn-mail`: transparenter Hintergrund mit 1,5px-Umrandung in `--ink-soft` (Farbe der Logo-Tagline), Schrift klein geschrieben (`normal-case`), normale Stärke, dunkle Farbe `--ink-soft`, Hover füllt mit `--ink-soft`
- Größe gestuft 16px → 18px → 20px (mobil bewusst kleiner, damit die lange Adresse bei 375px nicht überläuft)
- Durchreichung über neue Option `ctaClass` in `RichTextBody`/`RichTextSection` (andere Buttons unverändert)

### Verifikation
- `/teilen` HTTP 200; 4 coral-Absätze im HTML; neue `mailto`-Adresse aktiv (alte weg); `.btn-mail` im kompilierten CSS mit `background: transparent`, `border: 1.5px solid var(--ink-soft)`, `text-transform: none`, `font-weight: 400`

### Offene Punkte / nächste Schritte
- E-Mail-Button bei 375px visuell gegenprüfen (einzeilig); SEO-Felder der Teilen-Seite weiterhin offen

---

## 2026-06-02 — Kategorie-Tags (Texte + einfarbige Farben) & neue Workflow-Regel

### Ausgangslage
Die Kategorie-Tags (oben links im Bild, sowie in Event-Liste und Filter) zeigten Kurzlabels („Musik", „Heilsam", „Inspiration", „Retreat") und waren mit Farbverläufen hinterlegt.

### Ziel
Tags sollen den Überschriften entsprechen und einfarbig sein (eine Palettenfarbe je Kategorie, keine Verläufe).

### Was umgesetzt wurde

**Tag-Texte = Überschriften** — [data/categories.ts](data/categories.ts)
- `shortLabel` an `label` angeglichen: Tanz (unverändert), Musik → „Singen & Musik", Heilsam → „Heilsame Angebote", Inspiration → „Inspiration & Lernen", Retreat → „Mehrtägige Events"

**Einfarbige Tags statt Verläufe** — [CategoryCard.vue](components/CategoryCard.vue), [EventListItem.vue](components/EventListItem.vue), [EventFilter.vue](components/EventFilter.vue)
- Pill-Farbe wird jetzt aus `category.accent` abgeleitet (`pill-${accent}`) statt aus `gradient`
- Neue Solid-Pill-Klassen (`.pill-coral/-orange/-gold/-teal/-blue/-green`) mit je einer Palettenfarbe; Filter-Pills: Outline in Farbe + Aktiv-Zustand als Vollfarbe (kein Verlauf mehr)
- Events-Seite zieht Tags/Farben automatisch aus den Kategoriedaten → dort ebenfalls aktualisiert

**Farb-Zuordnung (nach Tausch durch User)**
- Tanz = Orange · Singen & Musik = Teal · Heilsame Angebote = Blau · Inspiration & Lernen = Grün · Mehrtägige Events = Coral

**Neue Workflow-Regel in [CLAUDE.md](CLAUDE.md)**
- „Bei Unklarheiten immer zuerst nachfragen, bevor Änderungen vorgenommen werden" als ersten Punkt der Workflow-Erwartungen ergänzt

### Verifikation
- Kategorien & Events: HTTP 200; neue Tag-Texte vorhanden; nur noch einfarbige `pill-*`-Klassen, keine Verlaufs-Pills mehr; `accent`-Tausch korrekt in den Daten

### Offene Punkte / nächste Schritte
- `gradient`-Feld in `data/categories.ts` wird für Tags nicht mehr genutzt (nur noch `accent`); bei Bedarf später aufräumen
- Lange Tags („Inspiration & Lernen") überdecken etwas mehr Bildfläche — Tag-Schrift ggf. leicht verkleinern, falls gewünscht

---

## 2026-06-02 — Route /teilen, Menü-/Footer-Anpassungen, Seitenüberarbeitung & einheitliche Hero-Formatierung

### Ausgangslage
Nach Mobile-Optimierung und Wording-Umstellung folgten mehrere inhaltliche/strukturelle Wünsche: Umbenennung der „Events posten"-Seite, konsistente Menüstruktur, Überarbeitung der Teilen-Seite nach Seiten-Template sowie eine einheitlichere, übersichtlichere Hero-Darstellung über alle Seiten.

### Ziel
Klarere Navigation, eine sinnvoll gegliederte Teilen-Seite und ein einheitliches Hero-Format (rote Akzent-Formatierung für den Beschreibungstext statt separater englischer Subtitle-Zeilen).

### Was umgesetzt wurde

**Route umbenannt: `/events-posten` → `/teilen`**
- Seitendatei via `git mv` → [pages/teilen.vue](pages/teilen.vue); alle internen Links angepasst ([SiteNav.vue](components/SiteNav.vue), Footer-Link & CTA in [content/de.ts](content/de.ts), [index.vue](pages/index.vue), [vision.vue](pages/vision.vue)). Alte Route liefert 404.

**Einheitliche Menüstruktur** — [content/de.ts](content/de.ts)
- Top-Nav: `nav.postEvent` „Events teilen" → „teilen" (wird per CSS als „TEILEN" dargestellt)
- Footer „Entdecken": „Wochenansicht" → „Events"; Footer „Mitmachen": „Events posten" → „Teilen"

**Footer-Branding** — [content/de.ts](content/de.ts), [SiteFooter.vue](components/SiteFooter.vue)
- Footer-Tagline ersetzt durch zweizeilig „Bewusste Veranstaltungen / aus der Region Rhein · Main · Neckar" (mit `whitespace-pre-line`)
- „Soul & Bliss"-Schriftzug (`.footer-name`) vergrößert: 40px → 48px (mobil) / 54px (ab lg)

**Teilen-Seite überarbeitet** (nach Seiten-Template) — [pages/teilen.vue](pages/teilen.vue), [content/de.ts](content/de.ts)
- Hero-Bereich auf Wunsch komplett entfernt; Seite startet direkt mit den zwei Bereichen
- **Bereich 1 „Variante 1 · Unkompliziert"**: Event per E-Mail teilen, mit `mailto:`-CTA (`events@soulandbliss.de`)
- **Bereich 2 „Variante 2 · Mit eigenem Konto"**: Login/Registrieren-Formular mit Intro-Kopf + Mockup-Hinweis
- Alten `explainer`-Content entfernt; Kernbotschaft lebt als Meta-Description weiter

**Newsletter-Hero** — [content/de.ts](content/de.ts), [newsletter.vue](pages/newsletter.vue)
- Eyebrow „Once a week" → „Einmal die Woche"; rote Zeile „Your week, curated" entfernt
- Body neu: „Jeden Sonntagabend ein Newsletter, der die Veranstaltungen der kommenden Woche zeigt."

**Einheitliche Hero-Formatierung über alle Seiten** — [HeroSection.vue](components/HeroSection.vue) + alle Hero-Seiten
- Neue Option `accentBody`: rendert den Hero-Body in coral/kursiv/Serif (die bisherige „rote" Subtitle-Formatierung)
- Auf Events, Vision, Kategorien, Kontakt, Newsletter: separate rote Subtitle-Zeile entfernt, stattdessen Body in coral
- Kategorien zusätzlich: „Categories"-Zeile raus, Satz neu „Fünf Felder, in denen sich Veranstaltungen der bewussten Szene Rhein-Main-Neckar bewegen."
- Vision-Zitat („Es geschieht etwas …") als `vision.quote` erhalten und im selben coral-Format oberhalb der Abschluss-Buttons eingebaut
- Ungenutzte `subtitleEn`-Strings aus `content/de.ts` entfernt (keine Leichen)

**Generische Komponenten erweitert (statt dupliziert)**
- [HeroSection.vue](components/HeroSection.vue): `title` optional (kein leeres `<h1>` mehr), neue Option `accentBody`
- [RichTextBody.vue](components/RichTextBody.vue): CTA rendert externe Links (`mailto:`/`tel:`/`http`) als `<a>`, interne via `NuxtLink`
- [LoginForm.vue](components/LoginForm.vue): optionaler Intro-Kopf (aus `postEvent.login`) + Mockup-Hinweis

### Verifikation
- Alle Routen HTTP 200 (`/`, `/vision`, `/kategorien`, `/kontakt`, `/newsletter`, `/teilen`); `/events-posten` → 404
- Stichproben im gerenderten HTML: neue Texte/Labels vorhanden, rote Subtitle-Zeilen entfernt, Body coral-formatiert, `mailto`-CTA korrekt, keine verwaisten `subtitle-en`/`explainer`-Referenzen

### Offene Punkte / nächste Schritte
- SEO-Felder der Teilen-Seite (Meta Title/Keywords aus dem Template) noch nicht vollständig befüllt
- „Conscious Szene"-Formulierungen auf der Vision-Seite (Body + about/pillars) weiterhin bewusst unverändert — bei Bedarf separat umstellen
- E-Mail-Adresse `events@soulandbliss.de` ist gesetzt — finale Adresse beim User bestätigen

---

## 2026-06-01 — Wording „Conscious" → „Bewusste Veranstaltungen"

### Ausgangslage
An mehreren Stellen wurde der englische Begriff „Conscious(-Veranstaltungen)" verwendet; gewünscht ist deutschsprachiges Wording an den prominenten Stellen.

### Ziel
Drei vom User benannte Texte auf Deutsch umstellen — ohne sonstige Inhalte zu verändern.

### Was umgesetzt wurde — [content/de.ts](content/de.ts)
- **Events-Hero-Untertitel** (`home.hero.subtitleEn`): „— Conscious-Veranstaltungen aus der Region —" → „— Bewusste Veranstaltungen aus der Region —"
- **Events-Hero-Body** (`home.hero.body`): „… von Conscious-Veranstaltungen in der Rhein-Main-Neckar-Region …" → „… von bewussten Veranstaltungen in der Region Rhein-Main-Neckar …"

**Logo-Tagline neu gestaltet (zweizeilig)** — [components/BrandWordmark.vue](components/BrandWordmark.vue), [content/de.ts](content/de.ts)
- `brand.tagline` (String) → `brand.taglineLines` (Array). Finaler Inhalt: `['Bewusste Veranstaltungen', 'aus der Region Rhein · Main · Neckar']` (ersetzt das frühere „Conscious Events · Rhein · Main · Neckar")
- Tagline wird als zwei Zeilen unter der Wortmarke gerendert, **linksbündig**:
  - **Zeile 1** „Bewusste Veranstaltungen": größere Schrift (`first-child`, mobil 17,5px / Desktop 19px), füllt natürlich die Logo-Breite und definiert die Referenzbreite
  - **Zeile 2** „aus der Region Rhein · Main · Neckar": kleiner (mobil 12,5px / Desktop 13,5px); per `align-self: stretch` + `text-align-last: justify` **exakt auf die Breite von Zeile 1 gestreckt** → rechte Kante schließt geräteunabhängig bündig ab (die vielen Wörter/Trennpunkte verteilen den Rest unsichtbar)
- Behebt zugleich das ursprüngliche Overflow-Risiko der längeren Tagline auf iPhone (Zeile-1-Breite bleibt innerhalb der Wortmarke). (Mobile-First-Pflicht beachtet.)
- Hinweis: mehrere Feinjustier-Iterationen mit dem User zu Schriftgröße/Ausrichtung; obige Werte sind der abgenommene Endstand.

### Verifikation
- Dev-Server: Startseite liefert die drei neuen Texte; die drei Zielstellen enthalten kein „Conscious" mehr.

### Offene Punkte / nächste Schritte
- **Bewusst nicht geändert** (nicht beauftragt): Newsletter-Tagline (`footer`-Bereich), Demo-Daten („Conscious Loft", „Conscious-Festival"), sowie „Conscious Szene"-Erwähnungen auf der Vision-Seite — bei Bedarf separat umstellen.

---

## 2026-06-01 — Mobile-Optimierung (iPhone/iOS)

### Ausgangslage
Die Webseite war auf Desktop gut, auf Mobilgeräten (iPhone, 375–430px) jedoch unruhig: zu große Headlines ohne Mobile-Skalierung (Hero 60/82px, diverse 40–52px hartcodiert), festes Container-Padding (32px überall), uneinheitliche Breakpoints (teils `900px`, teils `768px`/`640px`) mit einem „Loch" im Tablet-Hochformat-Bereich, sowie ein zu kleines Burger-Touch-Target (32×28px).

### Ziel
Klarere Struktur und bessere Lesbarkeit auf Mobilgeräten durch gestufte responsive Skalierung — **ohne das Desktop-Erscheinungsbild zu verändern**. Plandokument: [05_mobile-optimierung.md](05_mobile-optimierung.md).

**User-Entscheidungen:** (1) Breakpoint-Stufen statt clamp, (2) Breakpoints projektweit auf Tailwind-Standard (640/768/1024) vereinheitlichen, (3) Desktop (≥1024px) bleibt 1:1.

### Was umgesetzt wurde

**Architektur-Konvention (neu, dokumentiert in 05):** Komponenten sind jetzt **mobile-first** — Basiswerte = iPhone, via `min-width`/`sm:`/`md:`/`lg:` hochskaliert. Alle `@media (max-width: 900px)` wurden entfernt; der bisherige Desktop-Wert ist zum `lg:`-Wert geworden, sodass ≥1024px unverändert bleibt.

**Global** — [assets/css/main.css](assets/css/main.css)
- `.container-w`: `px-8` → `px-5 sm:px-6 lg:px-8`
- `.section-title` `46px` → `30 / sm:36 / lg:46`; `.section-intro` & `.section-eyebrow` gestuft

**Navigation/Branding**
- [SiteNav.vue](components/SiteNav.vue): Burger auf 44×44px Touch-Target, Nav-Padding gestuft
- [BrandWordmark.vue](components/BrandWordmark.vue): Nav-Logo (`md`) `52 → 64 → 78px` gegen Overflow auf schmalen Screens
- [SiteFooter.vue](components/SiteFooter.vue): Link-Spalten mobil 2-spaltig, Brand-Block volle Breite

**Hero** — [HeroSection.vue](components/HeroSection.vue)
- `900px`-Query durch mobile-first `min-width`-Stufen ersetzt (Titel 34/46/60, Script 46/64/82, Min-Höhen, Padding)
- CTA-Buttons mobil gestapelt + volle Breite (`w-full sm:w-auto`)

**Event-Liste**
- [DayBlock.vue](components/DayBlock.vue): einspaltig bis `md`, `.day-number` 44/52/64
- [EventListItem.vue](components/EventListItem.vue): kompaktes Raster als Basis, breit erst ab `md`
- [EventFilter.vue](components/EventFilter.vue): Labels mobil gestapelt, Pills/Inputs ≥ Tap-Höhe, Ort-Select volle Breite

**Content-Sektionen**
- [RichTextSection.vue](components/RichTextSection.vue): Bildhöhe 240/320/560, Versatz-Rahmen erst ab `md`
- [RichTextBody.vue](components/RichTextBody.vue), [TriCardSection.vue](components/TriCardSection.vue): Titel/Script/Icon/Gap gestuft (inline-styles → responsive Klassen)
- [NewsletterSection.vue](components/NewsletterSection.vue): Heading gestuft, Formular mobil gestapelt + volle Breite
- [CategoryCard.vue](components/CategoryCard.vue): Bildhöhe 200/240; [QuoteBand.vue](components/QuoteBand.vue): doppeltes Padding entfernt

**Seiten & Legal**
- Section-Paddings & Closing-Headlines gestuft in [index](pages/index.vue), [vision](pages/vision.vue), [kategorien](pages/kategorien.vue), [kontakt](pages/kontakt.vue), [newsletter](pages/newsletter.vue)
- [kategorien.vue](pages/kategorien.vue): Cards 2-spaltig ab `sm`
- [LegalPage.vue](components/LegalPage.vue), [LoginForm.vue](components/LoginForm.vue): Mobile-Paddings/Headline angeglichen

**Projektregel verankert** — [CLAUDE.md](CLAUDE.md)
- Neue verbindliche Sektion **„Mobile-First-Pflicht (WICHTIG)"**: alle künftigen Änderungen müssen für iPhone/iOS (375–430px) optimiert sein; Mobile-Check ist Teil der „fertig"-Definition
- Konventionen festgeschrieben: mobile-first statt `max-width`, nur Standard-Breakpoints (640/768/1024), Headline-Muster `base → md: → lg:`, Touch-Targets ≥ 44px, kein Overflow bei 375px
- Querverweise in „Komponenten-Konventionen" und „Workflow-Erwartungen" (Verifikation jetzt inkl. Mobile-Check bei 375/390/430px)

### Verifikation
- Dev-Server (Port 3000) liefert alle 8 Routen mit HTTP 200
- Gerenderte HTML enthält die neuen Klassen (`hero-inner`, `px-5 sm:px-6 lg:px-8`, `flex-col sm:flex-row`); keine echten Fehler im Output (nur `_errors` im Nuxt-Payload-Schema)
- **Ausstehend (User):** visuelle Browser-Prüfung bei 375/390/430px und Desktop-Regression ≥1280px

### Offene Punkte / nächste Schritte
- Geschmacksfragen mit gewählten Defaults (leicht umkehrbar): CTA-Buttons mobil volle Breite (aktiv), `kategorien` 2-spaltig ab `sm` (aktiv)
- EN-Sprachversion / i18n weiterhin offen (unverändert aus früheren Sessions)

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
