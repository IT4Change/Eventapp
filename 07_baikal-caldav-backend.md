# 07 — Baikal/CalDAV als Event-Backend

Status: **Umgesetzt** (2026-06-09) — siehe Eintrag in [04_projektfortschritt.md](04_projektfortschritt.md) · erstellt 2026-06-09

## Ziel

Die Events kommen künftig aus einem **Baikal (CalDAV)**-Server statt aus statischem `data/events.ts`. Baikal wird Teil eines **docker-compose**-Stacks; Credentials sind per Config setzbar und zeigen im Default auf die lokale Instanz + den dort eingerichteten Account. Die bisherigen Demo-Events werden **nach Baikal geseedet** (ein Kalender je Kategorie). Die Gesamtheit aller Termine wird wie bisher gemeinsam angezeigt.

## Referenz: jahrweiser

Das Schwesterprojekt `webcraftmedia/jahrweiser` (IT4Change, gleicher Stack) implementiert genau dieses Muster und dient als **Blueprint**. Wir übernehmen die Transport-Schicht weitgehend, weichen aber beim Datenmodell ab.

### Abgestimmte Entscheidungen (User)
- **jahrweiser-Pattern übernehmen** (Compose + Baikal-Bootstrap + Nitro-Proxy + `tsdav`/`ical.js` + Seed-Skript).
- **Kein MariaDB-Sidecar** — jahrweiser nutzt ihn nur für User-Login/Sync; wir starten **read-only ohne User-Accounts**.
- **Read-only**: Posting/Moderation bleibt vorerst Mockup (eigenes späteres Paket).
- **Locations**: `data/locations.ts` bleibt statische Frontend-Referenz; im VEVENT `LOCATION`-Text + `X-SB-LOCATION-ID`. `region` bleibt ungenutzt.
- **Kalender pro Kategorie** (5 Kalender als Buckets; Kategorie-Optik bleibt im Frontend).

---

## Architektur

```
Browser ──$fetch('/api/events')──▶ Nitro (Nuxt server/) ──tsdav/CalDAV──▶ Baikal
                                        │ ical.js: parse, RRULE-Expand, TZID
                                        ▼
                                   Event[] (unser bestehendes Interface)
```

- **Kein** direkter Browser→DAV-Zugriff (CORS/Secrets). Credentials nur server-seitig.
- `useEvents()` tauscht nur die **Datenquelle** (statt `import events` → `useFetch('/api/events')`); Filter/Wochengruppierung/Pagination/Komponenten bleiben unverändert (entspricht der in CLAUDE.md dokumentierten Erwartung).

### Neue Dependencies
- `tsdav` (CalDAV-Client), `ical.js` (Parser/RRULE/TZID) — Runtime.
- `tsx` — Dev, für das Seed-CLI.

---

## Feld-Mapping: unser `Event` ⇄ iCalendar VEVENT

`X-SB-*` = projektspezifische X-Property (round-trippt verlustfrei in sabre/dav, fremde Clients ignorieren sie).

| `Event`-Feld | iCal | Typ |
|---|---|---|
| `uuid` | `UID` | nativ |
| `id` | (abgeleitet = `uuid`) | — |
| `title` | `SUMMARY` | nativ |
| `category` | **Kalender-Bucket** + `CATEGORIES:<key>` | nativ |
| `start`/`end` | `DTSTART`/`DTEND` (`TZID=Europe/Berlin`) | nativ |
| `detailedDescription` | `DESCRIPTION` | nativ |
| `url` | `URL` | nativ |
| `image` | `IMAGE;VALUE=URI` | nativ (RFC 7986) |
| `organizer`+`email` | `ORGANIZER;CN=<name>:mailto:<email>` | nativ* |
| `description` (Teaser) | `X-SB-TEASER` | X-prop |
| `subcategory` | `X-SB-SUBCATEGORY` | X-prop |
| `registration` | `X-SB-REGISTRATION` | X-prop |
| `price` | `X-SB-PRICE` | X-prop |
| `source` | `X-SB-SOURCE` | X-prop |
| `aggregatorNote` | `X-SB-NOTE` | X-prop |
| `locationId` | `X-SB-LOCATION-ID` (+ `LOCATION`-Text denormalisiert) | X-prop |
| `mapsUrl` | `X-SB-MAPS-URL` (das eine `URL` ist vergeben) | X-prop |
| `phone` | `X-SB-PHONE` | X-prop |

\* **Edge-Case Organizer/Email:** `ORGANIZER` braucht eine cal-address. Regel: beide vorhanden → `ORGANIZER;CN=name:mailto:email`; nur Email → `ORGANIZER:mailto:email`; nur Name (kein Email) → `X-SB-ORGANIZER` (Name) statt `ORGANIZER`. Mapping liest beide Quellen.

- **Kalenderfarbe**: beim Anlegen `calendar-color` = `accent` der Kategorie (kosmetisch).
- **Recurrence**: `RRULE`/`EXDATE` werden im Nitro-Layer via `ICAL.RecurExpansion` über das Anzeigefenster expandiert. Unser bisheriges Modell kann das nicht — **Bonus**, optional ein wiederkehrendes Demo-Event seeden (z. B. „Ekstatischer Tanz am Donnerstag" wöchentlich).

---

## Arbeitspakete

### A. Docker-compose-Stack
- Neu: `docker-compose.yml` (+ optional `docker-compose.override.yml` für Dev) mit:
  - **baikal** (`ckulka/baikal:0.10.1-nginx`), Volumes für `config` + `Specific`, Healthcheck, Port `8088:80`.
  - `infra/baikal/init-bootstrap.sh` (aus jahrweiser adaptiert): überspringt den Web-Installer, schreibt `baikal.yaml` (SQLite, `Europe/Berlin`, Basic-Auth, Admin-Hash aus `BAIKAL_ADMIN_PASSWORD`), exit 0.
  - **app** (Nuxt): eigenes `Dockerfile` (Nitro), `DAV_URL=http://baikal`, `depends_on: baikal`. (Für reines lokales Dev ohne App-Container: `DAV_URL=http://localhost:8088`.)
- DAV-User/Principal provisionieren: `infra/baikal/provision-dav-user.php` + CLI `cli/baikal-bootstrap.ts` (aus jahrweiser), legt den `events`-Principal an (oder Admin-Principal nutzen).

### B. Config / Secrets
- `nuxt.config.ts` → `runtimeConfig` (server-only): `dav: { url, username, password }` aus `DAV_URL` / `DAV_USERNAME` / `DAV_PASSWORD`.
- Defaults: `http://localhost:8088`, `admin` / `admin` (= lokale Baikal-Instanz).
- `.env.example` mit den Variablen; echte Secrets nie committen. Öffentlicher Betrieb nur via TLS (Hinweis in der Doku).

### C. Nitro-API
- `server/helpers/dav.ts` (aus jahrweiser adaptiert): `createCalDAVAccount`, `findCalendars`, `findEvents` (calendar-query time-range), `findEvent` (multiget).
- `server/utils/mapVeventToEvent.ts`: `ical.js`-Parsing → unser `Event` (inkl. X-SB-Props, ORGANIZER-Split, TZID, RRULE-Expand). Kategorie = Quell-Kalender.
- `server/api/events.get.ts`: liest alle 5 Kalender über ein Vorwärtsfenster (heute … +N Monate, konfigurierbar), mappt + merged → `Event[]`. Optional `?from=&to=`.
- `server/api/event.get.ts?uuid=`: Einzel-Event (für die Detailseite) — sucht über die Kalender bzw. multiget.
- **Caching**: einfacher Nitro-Cache/`cachedEventHandler` über das Fenster; später optional `sync-collection`-Token. (Skalierung ist anfangs unkritisch bei ~65 Events.)

### D. Frontend-Anpassung (minimal)
- `composables/useEvents.ts`: `allEvents` aus `useFetch('/api/events')` statt statischem Import; `filtered`/`visibleByDay`/`loadMore` etc. bleiben.
- `getEventByUuid`/Event-Detailseite: auf `useFetch('/api/event?uuid=')` umstellen (statt sync über das Array).
- `data/events.ts` wird **nicht gelöscht**, sondern zur **Seed-Fixture** (Quelle des Seed-CLIs). `data/locations.ts` (statische Referenz) und `data/categories.ts` (Struktur) bleiben.

### E. Seeding
- `cli/seed-baikal.ts` (aus jahrweisers `seed-demo.ts` adaptiert):
  1. `ensureCalendar()` (MKCALENDAR) für die 5 Kategorie-Kalender (displayname=Kategorie-Key, calendar-color=accent).
  2. Für jedes Event aus `data/events.ts`: `buildIcs()` mit obigem Mapping (inkl. X-SB-Props, VTIMEZONE Europe/Berlin), `PUT` als `<uuid>.ics` in den Kategorie-Kalender.
- `cli/seed-reset.ts` (optional): Kalender leeren/neu.
- npm-Scripts: `cli:baikal:bootstrap`, `cli:seed`.

### F. Doku
- `04_projektfortschritt.md`-Eintrag; CLAUDE.md (Datenkonventionen → Backend statt statisch, Compose/Env, X-SB-Konvention, neue `server/`-Struktur).

---

## Fallstricke / Edge-Cases (vorab adressiert)
- **Bild-Hosting**: Demo-Bilder liegen in `public/img/` → `IMAGE` referenziert die App-URL (kein externer Store nötig). Echte Uploads später = eigenes Thema.
- **Ort/Region-/Pagination-Filter**: nicht server-seitig in CalDAV, sondern wie bisher im Frontend (`useEvents`) über das geladene Fenster. OK bei aktueller Größe.
- **Zeitzonen**: konsequent `TZID=Europe/Berlin` + `VTIMEZONE`; `ical.js TimezoneService` registrieren. Mehrtages-Events sauber (DATE vs DATETIME).
- **Detailseite über 5 Kalender**: `event.get.ts` muss kategorieübergreifend finden (multiget je Kalender oder Kategorie aus Route mitführen).
- **Installer-Friktion**: durch `init-bootstrap.sh` umgangen (kein manueller Web-Wizard).
- **Read-only-Annahme**: kein Schreibpfad; der Service-Account liest nur. Posting/Moderation = späteres Paket.

## Verifikation
- `docker compose up` → Baikal healthy; `cli:baikal:bootstrap` + `cli:seed` → 5 Kalender mit den 65 Events.
- `/api/events` liefert gemapptes `Event[]` (Stichproben: X-SB-Felder, ORGANIZER-Split, Kategorie aus Kalender, korrekte Zeiten).
- Frontend DE + `/en`: Wochenansicht, Filter (Kategorie/Ort/Datum), Pagination, Detailseite, Event-404 — unverändertes Verhalten.
- Konsole/Server-Log sauber; Mobile 375/390/430 unverändert (kein Layout-Eingriff).

## Out of Scope (bewusst später)
- Posting/Moderations-Workflow (Schreibpfad, `STATUS`/Inbox-Kalender, Admin-UI).
- Übersetzte Event-Inhalte (Demo-Events bleiben DE; i18n betrifft UI, nicht Event-Daten).
- `webcal://`-Abo-Feed für Endnutzer (möglich, aber separat).
- Echtes Bild-Upload-Hosting.
- `region` als Filtermerkmal.
