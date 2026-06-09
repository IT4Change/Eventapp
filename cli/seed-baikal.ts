import { execSync } from 'node:child_process'

import { categories } from '../data/categories'
import { events } from '../data/events'
import { buildEventIcs, categoryColor } from '../server/utils/ical'

import { assertLocalEnv, calendarsBase, config, davAuthHeader } from './tools/config'

assertLocalEnv()

// Stellt sicher, dass der DAV-User (admin-Principal) existiert.
console.warn('[seed] stelle DAV-User sicher (cli:baikal:bootstrap)')
execSync('npm run --silent cli:baikal:bootstrap', { stdio: 'inherit' })

// --- 1) Kategorie-Kalender anlegen (1 Kalender je Kategorie, idempotent) -----
async function ensureCalendar(uri: string, displayName: string, color: string): Promise<void> {
  const url = `${calendarsBase}/${uri}/`
  const body =
    '<?xml version="1.0" encoding="utf-8" ?>' +
    '<C:mkcalendar xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:I="http://apple.com/ns/ical/">' +
    '<D:set><D:prop>' +
    `<D:displayname>${displayName}</D:displayname>` +
    `<I:calendar-color>${color}</I:calendar-color>` +
    '<C:supported-calendar-component-set><C:comp name="VEVENT"/></C:supported-calendar-component-set>' +
    '</D:prop></D:set></C:mkcalendar>'
  const res = await fetch(url, {
    method: 'MKCALENDAR',
    headers: { Authorization: davAuthHeader, 'Content-Type': 'application/xml; charset=utf-8' },
    body,
  })
  if (res.status === 201) console.warn(`  + Kalender ${uri}`)
  else if (res.status === 405) console.warn(`  = Kalender ${uri} existiert bereits`)
  else throw new Error(`MKCALENDAR ${url} fehlgeschlagen: HTTP ${res.status} ${res.statusText}`)
}

console.warn(`[seed] lege ${categories.length} Kategorie-Kalender an`)
for (const cat of categories) {
  await ensureCalendar(cat.key, cat.key, categoryColor(cat.key))
}

// --- 2) Events als .ics in den jeweiligen Kategorie-Kalender PUTten ----------
console.warn(`[seed] schreibe ${events.length} Events nach Baikal`)
let ok = 0
for (const ev of events) {
  const url = `${calendarsBase}/${ev.category}/${ev.uuid}.ics`
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: davAuthHeader, 'Content-Type': 'text/calendar; charset=utf-8' },
    body: buildEventIcs(ev),
  })
  if (!res.ok) throw new Error(`PUT ${url} fehlgeschlagen: HTTP ${res.status} ${res.statusText}`)
  ok++
}
console.warn(`[seed] fertig — ${ok}/${events.length} Events in ${config.DAV_URL}`)
process.exit(0)
