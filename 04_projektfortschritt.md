# Projektfortschritt — Soul & Bliss Eventapp

Dieses Dokument wird bei jeder Arbeitssession aktualisiert. Neueste Einträge oben.

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
