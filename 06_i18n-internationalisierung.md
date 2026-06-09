# 06 — Internationalisierung (i18n) mit @nuxtjs/i18n

Status: **Umgesetzt** (2026-06-09) — siehe Eintrag in [04_projektfortschritt.md](04_projektfortschritt.md) · erstellt 2026-06-09

## Ziel

DE/EN-Mehrsprachigkeit produktiv schalten:

1. Alle hartcodierten, nutzersichtbaren Texte in Locale-Quellen extrahieren.
2. Funktionierende Sprachumschaltung im Menü (der DE·EN-Schalter ist bereits da, aber ein Stub).
3. Vollständige englische Übersetzung aller deutschen Texte — **inklusive** der Rechtstexte (Datenschutz, Nutzungsbedingungen, Impressum).

### Abgestimmte Vorentscheidungen (User)

- **Architektur:** `@nuxtjs/i18n` (Vollmodul) — locale-prefixed Routes, SEO-hreflang, Browser-Detection, Cookie-Persistenz, Switcher-API.
- **Rechtstexte:** voll übersetzen (bestehender V01-Hinweis bleibt).
- **Demo-Daten:** nur **Kategorien/UI** übersetzen; Demo-Events & Locations (`data/events.ts`, `data/locations.ts`) bleiben deutsch (Platzhalter bis Backend).

---

## Zentrale Design-Entscheidung: Wo liegen die Messages?

`@nuxtjs/i18n` wickelt `vue-i18n` ein. Der Idiomatik-Weg wäre `$t('home.hero.title')` + für Arrays/Objekte `tm()` / `rt()`. **Problem:** der Content hier ist tief strukturiert — Legal-Seiten als `sections[] → blocks[] → {p | sub | list[]}`, dazu `pillars`, `columns`, `paragraphs`. Das durch `tm()`/`rt()` zu zwängen ist umständlich, verliert die TS-Typsicherheit und erzeugt Churn in **jeder** Komponente.

**Gewählter Weg (User-Entscheidung): kanonischer vue-i18n Message-Store + `$t`.**

- Alle Texte wandern in lazy-geladene Locale-Dateien `i18n/locales/de.ts` + `i18n/locales/en.ts` (Message-Store von vue-i18n).
- Zugriff:
  - Einzelstrings: `$t('home.hero.title')` (global im Template, kein Script-Setup nötig).
  - Verschachtelte Arrays/Objekte (`paragraphs`, `pillars.items`, Legal `sections[].blocks[]`, `footer.columns`, `taglineLines`): `const { tm, rt } = useI18n()` → `tm('pfad')` liefert die Roh-Struktur, `rt(leaf)` löst jeden Leaf auf.
- `content/de.ts` + `composables/useContent.ts` werden **entfernt** (keine Backwards-Compat-Reste).

**Konsequenz:** jede Komponente/Seite, die heute `useContent()` nutzt, wird auf `$t`/`tm`+`rt` umgebaut (~18 Dateien). Vorteile: kanonisch/erwartbar, Lazy-Load nur der aktiven Sprache, native Pluralisierung/Interpolation für später.

---

## Arbeitspakete

### A. Modul & Konfiguration
- `@nuxtjs/i18n` installieren, in `nuxt.config.ts` `modules` ergänzen.
- `i18n`-Block: `locales: [{code:'de', language:'de-DE', name:'Deutsch'}, {code:'en', language:'en-US', name:'English'}]`, `defaultLocale: 'de'`, `strategy: 'prefix_except_default'` (→ DE behält jetzige URLs, EN unter `/en/...`), `detectBrowserLanguage: { useCookie:true, cookieKey:'i18n_locale', redirectOn:'root', alwaysRedirect:false }`, `baseUrl` für korrekte hreflang/canonical.
- `i18n.config.ts`: `{ legacy:false, locale:'de', messages:{de:{},en:{}} }` (Store bleibt minimal, da Bodies via `useContent`).
- **Slugs:** deutsche Routen-Slugs (`kategorien`, `teilen`, …) bleiben unter beiden Sprachen gleich (`/en/kategorien`). Übersetzte Slugs sind bewusst **out of scope** (späteres Paket via `pages:`-Config).
- **DSGVO:** der Locale-Cookie ist ein technisch notwendiger Funktionscookie (Spracheinstellung) → einwilligungsfrei; minimal gehalten.

### B. Message-Store / Locale-Dateien
- `i18n/locales/de.ts`: Inhalt aus bisherigem `content/de.ts` + neue Keys (Paket C) + Kategorie-Texte (Paket D).
- `i18n/locales/en.ts`: vollständige, strukturgleiche Übersetzung (inkl. Legal).
- `lazy: true`, `langDir: 'locales'` → nur aktive Sprache wird geladen.
- `content/de.ts` und `composables/useContent.ts` löschen.
- Komponenten/Seiten von `useContent()` auf `$t` (Einzelstrings) bzw. `tm`+`rt` (Arrays/verschachtelte Objekte) umstellen. `LegalPage.vue` erhält statt eines fertigen Objekts die `tm()`-Struktur und löst Leaves intern via `rt()` auf.

### C. Hartcodierte Strings extrahieren → Content
Neue Keys in `de.ts`/`en.ts` + Komponenten auf `useContent()` umstellen:
- **EventFilter.vue:** `Weitere Filter`, `Zeitraum`, `Von`, `Bis`, `Ort`, `Alle Orte`, `Filter zurücksetzen` → neue Sektion `filter.*`.
- **EventList.vue:** Eyebrow `Aktuelle Events` → `home.week.eyebrow`.
- **LoginForm.vue:** Erfolgs-Mock-Meldung → `postEvent.form.successMock`.
- **event/[uuid]/[slug].vue:** 404 `Event nicht gefunden` → `event.notFound`.
- **SiteNav.vue:** aria-labels `Sprache wechseln`, `Menü öffnen` → `nav.a11y.langSwitch`, `nav.a11y.menu`.

### D. Kategorien lokalisieren (echte UI)
- `data/types.ts`/`data/categories.ts`: strukturelle Felder (`key`, `gradient`, `image`, `accent`) bleiben in `categories.ts`.
- Display-Text (`label`, `shortLabel`, `description`, `includes[]`) wandert je Sprache in `content` (`categories.items[key]`).
- Neue Resolver-Schicht: `useCategories()` (oder Erweiterung in `useEvents`) zippt Struktur + lokalisierten Text → liefert `Category[]` lokalisiert. Konsumenten: `CategoryCard`, `EventFilter`, `pages/kategorien.vue`, `useEvents` (Filter-Pills).

### E. Datums-/Zeitformat lokalisieren
- `composables/useFormat.ts`: Wochentag-/Monats-Arrays je Sprache (DE + EN), Auswahl über `useI18n().locale` (Arrays statt `Intl`, um den kompakten Design-Stil — `So/Mo`, `Jan/Feb` — exakt zu erhalten).
- `DayBlock.vue`: eigenes `MONTHS_DE` entfernen, `useFormat` nutzen (Konsolidierung).

### F. SEO / Head
- `layouts/default.vue`: `useLocaleHead()` (hreflang, `<html lang>`, canonical).
- Locale-abhängiger `title` + `meta description`: neue `content.seo.{title,description}`, gesetzt via `useHead` im Layout. `nuxt.config.ts` `head` entsprechend entschlacken/als Fallback.

### G. Sprachumschalter (Menü)
- `SiteNav.vue`: Stub `onLangClick`/`console.log` ersetzen durch `useSwitchLocalePath()` + `setLocale()`. DE/EN-Spans als echte Links/Buttons, aktive Sprache hervorheben (statt fix `coral` auf DE). Gilt für Desktop- und Mobile-Block.
- `SiteFooter.vue`: `footer.language` („Deutsch · English coming soon") auf funktionalen/aktualisierten Text anpassen.

### H. Verifikation
- `npm run dev`: `/`, `/vision`, `/kategorien`, `/teilen`, `/newsletter`, `/kontakt`, `/datenschutz`, `/nutzungsbedingungen`, `/impressum`, Event-Detail — je DE und `/en/...` (HTTP 200, Konsole sauber).
- Switch DE↔EN auf mehreren Seiten; Cookie-Persistenz über Reload; `<html lang>` korrekt; hreflang im `<head>`.
- **Mobile-Pflicht (375/390/430px):** Switcher als Touch-Target ≥44px, kein Overflow durch längere/kürzere EN-Strings (Nav, Filter-Pills, Buttons). Desktop ≥1280px gegen vorherigen Stand gegenchecken.

### I. Dokumentation
- Eintrag in `04_projektfortschritt.md` (oben).
- `CLAUDE.md`: „DE/EN-Switcher … noch nicht funktional" → aktualisieren; Content-Konvention auf `content/{de,en}.ts` + `useContent()`-Reaktivität erweitern; offene i18n-Punkte als erledigt markieren.

---

## Risiken / offene Punkte
- **Übersetzungsqualität Rechtstexte:** GDPR-/TMG-Terminologie wird fachlich sinngemäß übersetzt; der bestehende „vor Live-Gang juristisch prüfen"-Hinweis bleibt und gilt erst recht für die EN-Fassung.
- **Übersetzte Slugs:** bewusst verschoben (eigenes Paket, `pages:`-Route-Mapping).
- **Demo-Events/Locations bleiben DE** — in der EN-Ansicht erscheinen Event-Titel/Orte deutsch (akzeptiert, da Platzhalter).
