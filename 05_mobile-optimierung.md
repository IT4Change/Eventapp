# 05 — Mobile-Optimierung (iPhone/iOS)

Status: **umgesetzt** am 2026-06-01 · zugehöriger Log-Eintrag in [04_projektfortschritt.md](04_projektfortschritt.md)

## Ziel
Klarere Struktur und bessere Lesbarkeit auf Mobilgeräten (iPhone, 375–430px) — saubere Umbrüche, passende Schriftgrößen, ausreichende Tap-Flächen. **Desktop (≥1024px) bleibt 1:1 unverändert.**

## Vom User bestätigte Richtung
1. **Schrift-Skalierung über Breakpoint-Stufen** (Tailwind `sm:`/`md:`/`lg:`), nicht fließend/clamp.
2. **Breakpoints projektweit vereinheitlicht** auf Tailwind-Standard (`sm` 640 / `md` 768 / `lg` 1024).
3. **Desktop unverändert** — alle neuen Stufen greifen unterhalb von `lg`.

## Verbindliche Konventionen (für künftige Komponenten)
- **Mobile-first**: Basiswerte = iPhone, via `min-width`/`sm:`/`md:`/`lg:` hochskaliert.
- **Keine `@media (max-width: 900px)` mehr** — alte uneinheitliche Breakpoints wurden durch mobile-first `min-width`-Queries bei 768px/1024px ersetzt.
- **Übergroße Headlines** bekommen das Muster `base → md: → lg:`, wobei der `lg:`-Wert exakt dem bisherigen Desktop-Wert entspricht.
- **Touch-Targets** ≥ 44px (Burger, Filter-Pills, Buttons).
- **Section-Vertikal-Padding**: Muster `py-16 sm:py-24 lg:py-[100px]` (bzw. `py-14 sm:py-20 lg:py-[80px]`).
- **Container-Ränder**: `.container-w` nutzt `px-5 sm:px-6 lg:px-8`.

## Umgesetzte Änderungen (Kurzüberblick)
- **Global** ([assets/css/main.css](assets/css/main.css)): `.container-w`, `.section-title`, `.section-intro`, `.section-eyebrow` gestuft.
- **Navigation** ([components/SiteNav.vue](components/SiteNav.vue)): Burger 44×44px, gestuftes Padding; **Logo** ([components/BrandWordmark.vue](components/BrandWordmark.vue)) `md`-Größe gestuft (52 → 64 → 78px) gegen Overflow.
- **Footer** ([components/SiteFooter.vue](components/SiteFooter.vue)): 2-spaltige Link-Spalten auf Mobile, Brand-Block volle Breite.
- **Hero** ([components/HeroSection.vue](components/HeroSection.vue)): `900px`-Query entfernt; Titel/Script/Min-Höhen/Padding mobile-first; CTA-Buttons mobil gestapelt + volle Breite.
- **Event-Liste**: [DayBlock](components/DayBlock.vue) (Zweispalter erst ab `md`), [EventListItem](components/EventListItem.vue) (kompaktes Raster bis `md`), [EventFilter](components/EventFilter.vue) (gestapelte Labels, größere Tap-Flächen, Ort-Select volle Breite).
- **Content-Sektionen**: [RichTextSection](components/RichTextSection.vue) (Bildhöhe gestuft, Versatz-Rahmen erst ab `md`), [RichTextBody](components/RichTextBody.vue), [TriCardSection](components/TriCardSection.vue), [NewsletterSection](components/NewsletterSection.vue) (Heading gestuft, Formular gestapelt), [CategoryCard](components/CategoryCard.vue), [QuoteBand](components/QuoteBand.vue) (doppeltes Padding entfernt).
- **Seiten/Legal**: Section-Paddings & Headlines gestuft in [index](pages/index.vue), [vision](pages/vision.vue), [kategorien](pages/kategorien.vue) (Cards 2-spaltig ab `sm`), [kontakt](pages/kontakt.vue), [newsletter](pages/newsletter.vue), [LegalPage](components/LegalPage.vue), [LoginForm](components/LoginForm.vue).

## Verifikation
- `npm run dev`, alle 8 Routen HTTP 200, gerenderte Klassen live, Konsole/HTML ohne echte Fehler.
- Manuelle Browser-Prüfung bei 375/390/430px (kein Overflow, saubere Umbrüche, Tap-Flächen) sowie Desktop-Regression ≥1280px steht beim User aus.

## Offen / Geschmacksfragen (Defaults gewählt, leicht umkehrbar)
- CTA-Buttons im Hero auf Mobile **volle Breite** (`w-full sm:w-auto`) — aktuell aktiv.
- `kategorien.vue` **2-spaltig ab `sm`** — aktuell aktiv; `kontakt.vue` bleibt bis `md` einspaltig.
