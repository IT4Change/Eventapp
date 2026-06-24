# Logo-Integration + warmer Marken-Recolor (Soul & Bliss)

## Context
Der Nutzer hat in `Docs/Logo neu/` ein neues Icon-Logo abgelegt (Sonne mit zwei Menschen, warm-erdige Farben). Es soll **links vom „Soul & Bliss"-Schriftzug oben links** stehen, und die bisherigen **Regenbogen-Farbverläufe** (Wortmarke + Überschriften + die türkis/blauen Akzente) sollen durch eine **warme, vom Logo abgeleitete Palette** ersetzt werden. Ziel: konsistentes, erdiges Markenbild, das das neue Logo aufgreift — ohne dass das gesamte Marken-Lockup mehr Platz braucht als bisher.

## Abgestimmte Entscheidungen (User)
1. **Logo-Variante:** transparente Datei `logo-final-icon dunkel.png` (sitzt rahmenlos auf dem hellen Nav-Hintergrund).
2. **Farbverlauf:** **Amber → Terrakotta → Braun** (warm, ohne Grün) — für Wortmarke **und** Überschriften.
3. **Türkis/Blau:** ebenfalls in die warme Palette ziehen (QuoteBand, Outline-Button-Hover, Newsletter-Overlay).

## Logo-Hauptfarben (aus dem PNG gesampelt)
Amber/Sonne `#F0A060`/`#F0C070`/`#F0E0A0` · Terrakotta `#C05020` · Braun `#602010`/`#6B3410` · (Salbeigrün `#608040` — bewusst NICHT im Verlauf).

---

## Änderungen (Datei für Datei)

### 1. Asset kopieren — `public/img/logos/icon-logo.png` (neu)
`Docs/` wird von Nuxt nicht ausgeliefert, nur `public/`. Außerdem stören Leerzeichen im Dateinamen in `src`/CSS. Daher:
```
cp "Docs/Logo neu/logo-final-icon dunkel.png" public/img/logos/icon-logo.png
```
Referenz im Code: `/img/logos/icon-logo.png`. Das 1280×1280-PNG ist hochauflösend genug; der Browser skaliert herunter. (Die `hell.png`-Variante bleibt für später/Favicon — out of scope.)

### 2. `components/BrandWordmark.vue` — Icon einfügen, Lockup umbauen, Schrift verkleinern
- **Neue Prop** `withIcon` (default `false`), damit andere Verwendungen (sm/lg/xl) unberührt bleiben. Nur die Nav opted-in.
- **Template:** Das bestehende vertikale `.brand-lockup` (Wortmarke + Tagline) in eine **horizontale Reihe** `.brand-row` packen, mit dem Icon **links**:
  ```
  .brand-row (inline-flex; flex-direction:row; align-items:center; gap)
   ├─ <img class="brand-icon" v-if="withIcon" src="/img/logos/icon-logo.png" alt="" />
   └─ .brand-lockup  (unverändert: Wortmarke + Tagline)
  ```
  `alt=""` (dekorativ), da der umschließende Link in `SiteNav` bereits `aria-label="Soul & Bliss"` trägt.
- **Footprint konstant halten:** Icon ≈ Höhe des zweizeiligen Lockups (quadratisch), Wortmarke um **~18–20 % verkleinern**, sodass `Icon + kleinere Wortmarke ≈ bisherige Wortmarkenbreite`. Beide `clamp()`-basiert mit `vw`, damit sie auf Mobile **gemeinsam** herunterskalieren (bestehender Overflow-Schutz bleibt erhalten).
  Startwerte (Größe `md`, danach visuell feinjustieren):
  | Breakpoint | Wortmarke (neu) | Icon (quadrat.) | gap |
  |---|---|---|---|
  | `<640` | `clamp(26px, 8.6vw, 42px)` | `clamp(40px, 13vw, 64px)` | `clamp(6px,1.6vw,10px)` |
  | `≥640` | `52px` | `78px` | `10px` |
  | `≥1024`| `64px` | `96px` | `12px` |
  `.brand-icon { flex:none; aspect-ratio:1/1; height:auto; }` (skaliert nie unter den clamp-Boden).
- **Tagline-clamps (Z. 114–115) zunächst belassen** (Overflow-Schutz). Nach dem Verkleinern visuell prüfen, ob Zeile 1 („Bewusste Veranstaltungen") noch in die schmalere Wortmarkenbreite passt; falls nicht, clamp-Max leicht senken (`17.5px`→`16px`). → verify-then-tune.
- **Wortmarken-Gradient** (`.brand-wordmark`, Z. 50–57) ersetzen durch:
  ```css
  background: linear-gradient(to right,
    #F0A85A 0%, #D9722E 22%, #C05020 40%, #6B3410 62%, #5A2D0E 100%);
  ```
  (hält ab ~62 % Dunkelbraun für Lesbarkeit auf Creme — gleiche Lesbarkeits-Logik wie bisher.)

### 3. `components/SiteNav.vue` — Icon aktivieren
Zeile 5: `<BrandWordmark size="md" with-tagline />` → `… with-tagline with-icon />`. Das bestehende `gap-3`/Flex-Layout bleibt. Kein CSS nötig.

### 4. Überschriften-Gradient `--grad-rainbow` (zwei Dateien synchron)
Treibt via `.grad-text` ALLE Eyebrows/Script-Titel (EventList „Current events at a glance", Hero-Eyebrow + Title-Script, RichTextBody, TriCardSection, teilen.vue) **und** die `.hero-slim::after`-2px-Linie. Variablenname beibehalten (spart Änderung aller Call-Sites).
- `assets/css/main.css` (Z. 20) und `tailwind.config.ts` (`grad-rainbow`, Z. 37) **identisch** setzen auf:
  ```css
  linear-gradient(120deg, #E8902E 0%, #C05020 50%, #6B3410 100%);
  ```
  (startet mittel-saturiert amber statt blass → kleine Eyebrow-Texte bleiben auf Creme lesbar.)

### 5. Türkis/Blau → warm (User-Wunsch „auch anpassen")
Dunkel genug für weißen Text auf farbigen Flächen:
- `--grad-cool` in `assets/css/main.css` (Z. 19) **und** `tailwind.config.ts` (Z. 35) → `linear-gradient(120deg, #C05020 0%, #6B3410 100%)` (Terrakotta→Braun). Betrifft `.btn-outline:hover`.
- `components/QuoteBand.vue` (Inline-Gradient, ~Z. 28) `#54C0B4→#6BA8D8` → dieselbe Terrakotta→Braun-Rampe. Weißer Text bleibt kontrastreich.
- `components/NewsletterSection.vue` (Overlay, ~Z. 47–49): das blaue Ende `rgba(107,168,216,0.92)` → `rgba(192,80,32,0.92)` (Terrakotta), Coral-Start bleibt. Entfernt das letzte Blau aus den Verläufen.
- `tailwind.config.ts` `grad-soulevents` (Z. 40, **toter Token**, nirgends genutzt): optional auf den neuen Wortmarken-Gradient setzen (Konsistenz) oder belassen.

**Bewusst NICHT geändert:** die einzelnen Farb-Tokens `--teal`/`--blue` und die Kategorie-Akzentfarben (Pills/Filter) — das ist ein funktionales Farb-Kodierungssystem, kein Verlauf. `--grad-warm` (Buttons) bleibt (bereits warm, harmoniert).

---

## Verifikation (end-to-end)
1. `npm run dev` → http://localhost:3000 (Docker/Baikal laufen bereits).
2. **Desktop ≥1024:** Icon sitzt links, vertikal zentriert am zweizeiligen Lockup; `Icon + Wortmarke` ≈ bisherige Wortmarkenbreite (Vorher/Nachher-Screenshot vergleichen). Alle Eyebrows/Script-Titel auf Home, `/vision`, `/kategorien`, `/teilen`, `/newsletter` zeigen den warmen Verlauf; `.hero-slim`-Linie, QuoteBand, Outline-Hover, Newsletter-Overlay warm.
3. **Mobile (kritisch):** via Chrome DevTools Protocol `Emulation.setDeviceMetricsOverride` bei 375/390/430px prüfen, dass `document.documentElement.scrollWidth === innerWidth` (kein horizontaler Overflow) und Icon + Wortmarke proportional mitskalieren; Tagline-Zeile 1 passt noch. (Headless `--window-size` ist hier unzuverlässig — erzwingt ~500px Mindestbreite.)
4. **Lesbarkeit:** Wortmarken-Ende (Dunkelbraun) und Eyebrow-Start (Amber) auf Creme gut lesbar.
5. Tablet ~768px Stichprobe (fixe `≥640`-Werte).

## Doku (Projektpflicht)
Nach Umsetzung Eintrag in `04_projektfortschritt.md` (Logo-Integration + Recolor, betroffene Dateien, Begründung warm/erdig). Kein eigenes Nummern-Plandokument nötig (überschaubarer Umfang, klar abgestimmt).

## Offen / Feinjustierung während Umsetzung
- Exakte Shrink-Ratio (~0,82×) und Icon/Lockup-Höhenverhältnis visuell nachziehen.
- QuoteBand/Outline-Hover: Textkontrast (weiß) nach Recolor prüfen.
