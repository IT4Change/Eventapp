# Projektfortschritt — Soul & Bliss Eventapp

Dieses Dokument wird bei jeder Arbeitssession aktualisiert. Neueste Einträge oben.

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
