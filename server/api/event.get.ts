import { authHeaders, calendarUri, createCalDAVAccount, fetchAllEvents, listCalendars } from '../helpers/dav'
import { CATEGORY_KEYS, parseEventsFromCalendarData } from '../utils/ical'
import type { CategoryKey, Event } from '../../data/types'

// Einzelnes Event per uuid (für die Detailseite). Sucht über die Kategorie-Kalender
// anhand der UID IM INHALT — nicht über den Dateinamen, da der href bei manuell
// angelegten Events (Baikal-UI / CalDAV-Client) nicht der UID entspricht.
export default defineEventHandler(async (event): Promise<Event | null> => {
  const uuid = String(getQuery(event).uuid ?? '')
  if (!uuid) throw createError({ statusCode: 400, statusMessage: 'uuid required' })

  const { dav } = useRuntimeConfig()
  const cfg = { url: dav.url, username: dav.username, password: dav.password }
  const account = createCalDAVAccount(cfg)
  const headers = authHeaders(cfg)

  const calendars = await listCalendars(account, headers)
  for (const cal of calendars) {
    const uri = calendarUri(cal.url) as CategoryKey
    if (!CATEGORY_KEYS.includes(uri)) continue
    try {
      const objects = await fetchAllEvents(cal, headers)
      for (const obj of objects) {
        if (!obj.data) continue
        const match = parseEventsFromCalendarData(obj.data, uri).find((e) => e.uuid === uuid)
        if (match) return match
      }
    } catch {
      // Kalender nicht lesbar → weitersuchen
    }
  }
  return null
})
