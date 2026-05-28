# Plan: Restrukturierung Soul & Bliss Eventapp

## Context

Die aktuelle Nuxt 3 Single-Page-App präsentiert "Soul & Bliss" als One-Pager mit allen Sektionen in [app.vue](app.vue). Sie soll zu einer **Multi-Page-Struktur** umgebaut werden, die die Sitemap aus `02_pfeil-sitemap-vorlage.md` und die Anforderungen aus `01_website-struktur-grundlage.md` umsetzt: Event-Aggregator für die Conscious Szene Rhein-Main-Neckar mit **Wochenansicht (vertikale Liste nach Tagen)** als Hauptdarstellung.

**Erhalten bleibt:** Komplettes Designsystem (Tailwind-Config, Farben, Typografie, custom CSS, Komponenten-Styling) und alle 28 vorhandenen Bilder/Grafiken.

**Erneuert wird:** Routing-Struktur, Inhalte sämtlicher Seiten (inkl. Überarbeitung des bestehenden deutschen Textes), Datenmodell für Events/Kategorien (vorbereitet für späteres Backend), zentralisierte Texthaltung als i18n-Vorstufe.

---

## 1. Neue Dateistruktur

```
Eventapp/
├── app.vue                    [SCHLANK: nur <NuxtLayout><NuxtPage/></NuxtLayout>]
│
├── layouts/
│   └── default.vue            [NEU: SiteNav + <slot/> + SiteFooter + Newsletter]
│
├── pages/                     [NEU: alle Routen]
│   ├── index.vue              [Home = Wochenansicht]
│   ├── vision.vue
│   ├── kategorien.vue
│   ├── events-posten.vue      [Login UI-Mockup]
│   ├── kontakt.vue
│   ├── newsletter.vue
│   ├── disclaimer.vue
│   └── impressum.vue
│
├── content/                   [NEU: zentralisierte Texte als i18n-Vorstufe]
│   └── de.ts                  [Alle deutschen Texte als geschachteltes Objekt]
│
├── data/                      [NEU: Datenmodell, vorbereitet für Backend]
│   ├── types.ts               [Event, Category, Location Interfaces]
│   ├── events.ts              [Demo-Events]
│   ├── categories.ts          [5 Event-Kategorien]
│   └── locations.ts           [Orte der Conscious Szene Rhein-Main-Neckar]
│
├── composables/
│   ├── useContent.ts          [NEU: liefert Text-Keys, später leicht durch $t() ersetzbar]
│   └── useEvents.ts           [NEU: Event-Listing, Filterung, Wochengruppierung]
│
└── components/
    ├── [bestehende Komponenten - siehe Abschnitt 2]
    └── [neue Komponenten - siehe Abschnitt 2]
```

---

## 2. Komponenten-Strategie

### Bleiben wie sind
- [BrandWordmark.vue](components/BrandWordmark.vue) — wird in mehr Größen genutzt
- [NewsletterSection.vue](components/NewsletterSection.vue) — wird im Footer-Layout & auf /newsletter genutzt
- [QuoteBand.vue](components/QuoteBand.vue) — wird auf /vision wiederverwendet

### Refactor (Texte aus `content/de.ts` statt hardcoded)
- [SiteNav.vue](components/SiteNav.vue) — Links-Array auf neue Routes umstellen: Events `/`, Vision `/vision`, Kategorien `/kategorien`, Events posten `/events-posten`, Kontakt `/kontakt`. Newsletter-Button als CTA rechts. `<NuxtLink>` statt `<a href>`. Active-State via `router-link-active` Klasse mit Coral-Unterstrich.
- [SiteFooter.vue](components/SiteFooter.vue) — 4 Spalten mit echten Routes (Events, Über, Service, Rechtliches) inkl. Disclaimer/Impressum-Links.
- [HeroSection.vue](components/HeroSection.vue) — Props für `eyebrow`, `title`, `subtitle`, `image`, `primaryCta`, `secondaryCta`. Mehrfachnutzung über Seiten (jede Page hat einen eigenen Hero).
- [EventCard.vue](components/EventCard.vue) — `kind`-Prop erweitern um 5 neue Kategorien (siehe Abschnitt 4). Gradient/Farbe per Kategorie via Map.
- [AboutSection.vue](components/AboutSection.vue) + [PillarsSection.vue](components/PillarsSection.vue) — Inhalte rüber in `/vision`, Komponenten in slim modes als generische `RichTextSection.vue` und `TriCardSection.vue` refactorn — sodass sie auf weiteren Seiten wiederverwendbar sind.
- [IntroBand.vue](components/IntroBand.vue) — Props für Zitat/Bild, wiederverwendbar auf mehreren Seiten.
- [EventsSection.vue](components/EventsSection.vue) — **wird ersetzt** durch `WeekView.vue` (siehe unten). Datei kann gelöscht werden, sobald `WeekView` läuft.

### Neue Komponenten

| Datei | Zweck |
|---|---|
| `components/WeekView.vue` | Container für Wochenansicht. Holt Events via `useEvents()`, gruppiert nach Datum, rendert eine Liste von `DayBlock`-Komponenten. Oben: `EventFilter`. |
| `components/DayBlock.vue` | Ein Tag im Wochenformat: links Datum (groß, gradient-text), rechts vertikale Liste der Events des Tages. Trenner zwischen Tagen. |
| `components/EventListItem.vue` | Ein einzelnes Event als horizontale Zeile (Uhrzeit · Titel · Ort · Kategorie-Pill · Pfeil zum Detail). Tagesansicht-Variante des `EventCard`. |
| `components/EventFilter.vue` | Filterbar oben: Kategorien-Pills (Multi-Select) + Orts-Dropdown. State per `useEvents()`. |
| `components/CategoryCard.vue` | Kachel für `/kategorien` Seite: großes Bild, Titel, Beschreibung, Gradient-Akzent. |
| `components/LoginForm.vue` | UI-Mockup für `/events-posten`: Login + Register Tabs, Felder, Buttons. Keine Funktion, nur Markup. |
| `components/RichTextSection.vue` | Generisches Textblock-Modul aus AboutSection extrahiert. Props: `eyebrow`, `title`, `body`, `image`, `imageSide`. |
| `components/TriCardSection.vue` | Aus PillarsSection extrahiert. Props: `eyebrow`, `title`, `intro`, `items[]` (3+ Karten). Wird auf `/vision` für die ursprünglichen Pillars genutzt. |
| `components/LegalPage.vue` | Schlanker Wrapper für `/disclaimer` und `/impressum`: Titel + Markdown-artiger Body. |

### Zu löschen (nach Migration)
- [EventsSection.vue](components/EventsSection.vue) — ersetzt durch `WeekView.vue`
- Falls AboutSection und PillarsSection vollständig in `RichTextSection`/`TriCardSection` aufgehen: alte Dateien entfernen

---

## 3. Inhaltsstrategie (Content-Rewrite)

### Zentrale Texthaltung
Alle deutschen Texte landen in `content/de.ts` als verschachteltes Objekt:

```ts
// content/de.ts
export default {
  nav: { events: 'Events', vision: 'Vision', categories: 'Kategorien', ... },
  home: {
    hero: { eyebrow: '...', title: '...', subtitle: '...', primaryCta: 'Aktuelle Woche ansehen', secondaryCta: 'Vision lesen' },
    weekIntro: '...',
    emptyState: 'Diese Woche keine Events in deinen Filtern.'
  },
  vision: {
    hero: { ... },
    about: { eyebrow: 'Unsere Geschichte', title: '...', body: '...' },
    pillars: { eyebrow: 'Worum es geht', items: [ ... ] },
    quote: { text: '...', author: '...' }
  },
  categories: { hero: {...}, items: [...] },
  eventsPosten: { hero: {...}, login: {...}, register: {...} },
  contact: { hero: {...}, email: 'hallo@soulandbliss.de', body: '...' },
  newsletter: { hero: {...}, form: {...} },
  disclaimer: { title: 'Disclaimer', body: '...' },
  impressum: { title: 'Impressum', body: '...' },
  footer: { columns: [...], copyright: '...' }
}
```

Zugriff in Komponenten via `useContent()` composable — später durch `useI18n().t()` ersetzbar ohne Komponenten-Änderungen.

### Seiten-spezifische Inhalte & Bildzuordnung

**`/` (Home/Events)**
- Hero: kurzes Versprechen ("Conscious Events in Rhein-Main-Neckar — eine Woche auf einen Blick"), Hauptbild [01_hero_sunrise_dance.png](public/img/brand/01_hero_sunrise_dance.png)
- IntroBand: dezenter Einleitungssatz mit [02_mandala_motif.png](public/img/brand/02_mandala_motif.png)
- WeekView: Filter + Tagesliste
- Footer-CTA: Newsletter, Vision-Link
- Aufbau: Hero → IntroBand → WeekView (Filter + DayBlocks) → CTA-Band

**`/vision`** — Bestehender Content wird hier migriert und überarbeitet
- Hero: Vision-Statement, Bild [06_ceremony_motif.png](public/img/brand/06_ceremony_motif.png) als Beispiel-Motiv
- RichTextSection: "Warum es uns gibt" — überarbeiteter About-Text. Bild rechts.
- TriCardSection: "Was uns leitet" — die 3 alten Pillars (Zeremonie/Bewegung/Natur) mit überarbeiteten Texten + Bildern [02_mandala_motif.png](public/img/brand/02_mandala_motif.png), [04_dance_silhouettes.png](public/img/brand/04_dance_silhouettes.png), [05_nature_scene.png](public/img/brand/05_nature_scene.png)
- QuoteBand: Nietzsche-Zitat (bleibt)
- CTA: "Eigene Events posten" + "Newsletter abonnieren"

**`/kategorien`** — 5 Kategorien als große Cards (siehe Abschnitt 4 für Bild/Gradient-Mapping)
- Hero: kurze Erklärung "Was du bei Soul & Bliss findest"
- CategoryCard-Grid (2 Spalten auf Desktop, 1 auf Mobile)
- CTA: "Zur aktuellen Woche"

**`/events-posten`** — Login UI-Mockup
- Hero: "Werde Teil der Bewegung — poste deine eigenen Events", Bild [08_drums_instruments.png](public/img/brand/08_drums_instruments.png) (bisher ungenutzt)
- LoginForm: zwei Tabs (Login / Registrieren), Felder, Buttons (alle ohne Funktion)
- RichTextSection: kurze Erklärung des Konzepts und der Qualitätskriterien für Events

**`/kontakt`**
- Hero: "Wir freuen uns von dir zu hören", Bild [07_watercolor_splash.png](public/img/brand/07_watercolor_splash.png) (bisher ungenutzt)
- RichTextSection: E-Mail-Adresse, ggf. Telefon, ggf. Hinweis auf Social Media

**`/newsletter`**
- Hero + die bestehende `NewsletterSection.vue` als Hauptinhalt (anders gestaltet als im Footer)
- RichTextSection: Was der Newsletter enthält + Frequenz + Datenschutzhinweis

**`/disclaimer` und `/impressum`**
- `LegalPage`-Wrapper mit Titel und Body-Text (Platzhalter-Text, vom User später zu ersetzen)
- Schlanke, lesbare Typografie

---

## 4. Kategorien-Mapping

5 neue Kategorien (ersetzen die bisherigen `dance|ceremony|nature` Kinds in [EventCard.vue](components/EventCard.vue)):

| Kategorie | `kind` Key | Gradient (Tailwind) | Bild | Akzentfarbe |
|---|---|---|---|---|
| Inspiration & Lernen | `inspiration` | `grad-warm` (coral→orange→gold) | [02_mandala_motif.png](public/img/brand/02_mandala_motif.png) | coral |
| Tanz | `dance` | `grad-rainbow` | [04_dance_silhouettes.png](public/img/brand/04_dance_silhouettes.png) | orange |
| Heilsame Angebote | `healing` | `grad-ceremony` (orange→teal) | [06_ceremony_motif.png](public/img/brand/06_ceremony_motif.png) | teal |
| Singen & Musik | `music` | `grad-cool` (teal→blue) | [08_drums_instruments.png](public/img/brand/08_drums_instruments.png) | blue |
| Mehrtägige Events | `retreat` | `grad-nature` (green→teal) | [05_nature_scene.png](public/img/brand/05_nature_scene.png) | green |

Die Map liegt in `data/categories.ts`:

```ts
// data/categories.ts
import type { Category } from './types'

export const categories: Category[] = [
  { key: 'inspiration', label: 'Inspiration & Lernen', gradient: 'warm',     image: '/img/brand/02_mandala_motif.png',     accent: 'coral' },
  { key: 'dance',       label: 'Tanz',                  gradient: 'rainbow',  image: '/img/brand/04_dance_silhouettes.png', accent: 'orange' },
  { key: 'healing',     label: 'Heilsame Angebote',     gradient: 'ceremony', image: '/img/brand/06_ceremony_motif.png',    accent: 'teal' },
  { key: 'music',       label: 'Singen & Musik',        gradient: 'cool',     image: '/img/brand/08_drums_instruments.png', accent: 'blue' },
  { key: 'retreat',     label: 'Mehrtägige Events',     gradient: 'nature',   image: '/img/brand/05_nature_scene.png',      accent: 'green' },
]
```

`EventCard.vue` und `EventListItem.vue` ziehen Gradient/Bild/Akzent über diese Map — keine fest verdrahteten Werte mehr im Template.

---

## 5. Datenmodell (vorbereitet für späteres Backend)

```ts
// data/types.ts
export type CategoryKey = 'inspiration' | 'dance' | 'healing' | 'music' | 'retreat'

export interface Category {
  key: CategoryKey
  label: string
  gradient: 'warm' | 'cool' | 'rainbow' | 'ceremony' | 'nature'
  image: string
  accent: string
  description?: string
}

export interface Location {
  id: string
  name: string
  city: string         // z.B. "Frankfurt", "Mannheim", "Heidelberg"
  region: 'rhein' | 'main' | 'neckar'
}

export interface Event {
  id: string
  title: string
  category: CategoryKey
  start: string        // ISO date string, vorbereitet für Backend
  end?: string
  locationId: string
  description: string
  url?: string
  image?: string
  organizer?: string
}
```

`data/events.ts` exportiert eine Liste Demo-Events (10–15 Stück verteilt über die nächsten 2 Wochen, alle 5 Kategorien abgedeckt).

`composables/useEvents.ts` bietet:
- `getWeekEvents(weekOffset = 0)` → gruppiert Events nach Tag (Mo–So) für `WeekView`
- `filterByCategories(keys: CategoryKey[])` und `filterByLocation(locationId)` — reactive state
- Später ersetzt durch `useFetch('/api/events?...')` ohne Komponenten-Änderungen

---

## 6. Routing & Navigation

### SiteNav
- Links als Array aus `content/de.ts`:
  ```
  [Events: '/', Vision: '/vision', Kategorien: '/kategorien', Events posten: '/events-posten', Kontakt: '/kontakt']
  ```
- Newsletter als CTA-Button rechts neben den Links (Coral-Hintergrund)
- DE/EN-Selector bleibt visuell rechts außen (nicht-funktional, im Markup vorbereitet)
- Mobile: Burger-Menü (neue Logik), Overlay mit den Links
- Active-State: aktueller Link bekommt `grad-text` Klasse oder Coral-Underline via `NuxtLink`'s default active class

### SiteFooter (4 Spalten)
1. **Brand**: Wordmark + Tagline
2. **Entdecken**: Events `/`, Vision `/vision`, Kategorien `/kategorien`
3. **Mitmachen**: Events posten `/events-posten`, Kontakt `/kontakt`, Newsletter `/newsletter`
4. **Rechtliches**: Disclaimer `/disclaimer`, Impressum `/impressum`

Copyright-Zeile unten, Sprache-Hinweis ("Deutsch · English coming soon")

### Layout
`layouts/default.vue` umschließt jede Page:
```vue
<template>
  <SiteNav />
  <main><slot /></main>
  <NewsletterSection v-if="$route.path !== '/newsletter'" />
  <SiteFooter />
</template>
```

`app.vue` wird minimal:
```vue
<template><NuxtLayout><NuxtPage /></NuxtLayout></template>
```

---

## 7. i18n-Vorbereitung

**Heute:**
- `content/de.ts` — alle Texte in einem Objekt
- `composables/useContent.ts`:
  ```ts
  import de from '~/content/de'
  export const useContent = () => de
  ```
- Verwendung in Komponenten: `const t = useContent(); <h1>{{ t.home.hero.title }}</h1>`

**Später (1-Schritt-Migration):**
- `@nuxtjs/i18n` installieren
- `content/de.ts` → `locales/de.json` (gleiche Struktur)
- `useContent()` → `useI18n().t()` mit Key-Strings
- Komponenten ändern sich minimal: `t.home.hero.title` → `t('home.hero.title')`

**DE/EN-Selector:** Bleibt visuell, ohne Logik. Klick-Handler kann zunächst nur eine Toast-Meldung "English version coming soon" zeigen.

---

## 8. Verifikation

1. **Dev-Server starten**: `npm run dev` → öffnet `http://localhost:3000`
2. **Routen prüfen**: Jede Route aufrufen — `/`, `/vision`, `/kategorien`, `/events-posten`, `/kontakt`, `/newsletter`, `/disclaimer`, `/impressum`. Keine 404er.
3. **Wochenansicht**: Auf `/` durchscrollen. Tage als Header sichtbar, Events darunter gelistet. Filter-Pills oben funktionieren (visuell: ausgewählte Kategorien werden farbig hervorgehoben).
4. **Bilder laden**: Alle 28 Assets erreichbar prüfen. Vor allem die bisher ungenutzten `07_watercolor_splash` und `08_drums_instruments` auf `/kontakt` bzw. `/events-posten`.
5. **Navigation**: SiteNav-Links navigieren ohne Page-Reload (NuxtLink). Active-State auf aktueller Route sichtbar. Mobile Burger-Menü öffnet/schließt.
6. **Footer-Links**: Alle Links führen zu existierenden Routen.
7. **Responsive**: Chrome DevTools — Mobile (375px), Tablet (768px), Desktop (1440px). Layouts brechen sauber.
8. **Designsystem unverändert**: Hero-Farbverlauf, Gradient-Wordmark, Coral/Teal-Akzente, Buttons sehen aus wie vorher.
9. **Console**: Keine Fehler, keine 404er für Assets, keine TypeScript-Warnungen.
10. **Build**: `npm run build` läuft fehlerfrei durch.

---

## Reihenfolge der Implementierung (Vorschlag)

1. Datenfundament: `data/types.ts`, `data/categories.ts`, `data/events.ts`, `data/locations.ts`
2. Content-Layer: `content/de.ts`, `composables/useContent.ts`, `composables/useEvents.ts`
3. Layout: `layouts/default.vue`, `app.vue` schrumpfen
4. Refactor SiteNav + SiteFooter mit neuen Links + `useContent()`
5. Neue Pages anlegen (zunächst nur mit Hero + Platzhaltern)
6. Generische Sections bauen: `RichTextSection`, `TriCardSection`, `LegalPage`
7. Wochenansicht: `WeekView`, `DayBlock`, `EventListItem`, `EventFilter`
8. CategoryCard für `/kategorien`
9. LoginForm für `/events-posten`
10. Alle Pages mit endgültigem Content befüllen
11. Verifikation laut Abschnitt 8
