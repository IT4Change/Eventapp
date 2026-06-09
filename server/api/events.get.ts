import { authHeaders, calendarUri, createCalDAVAccount, fetchEventsInRange, listCalendars } from '../helpers/dav'
import { CATEGORY_KEYS, parseEventsFromCalendarData } from '../utils/ical'
import type { CategoryKey, Event } from '../../data/types'

// Liest alle Kategorie-Kalender aus Baikal über ein Vorwärtsfenster und liefert
// die zusammengeführte, nach Startzeit sortierte Event-Liste. Filter/Gruppierung/
// Pagination bleiben im Frontend (useEvents).
export default defineEventHandler(async (): Promise<Event[]> => {
  const { dav } = useRuntimeConfig()
  const cfg = { url: dav.url, username: dav.username, password: dav.password }
  const account = createCalDAVAccount(cfg)
  const headers = authHeaders(cfg)

  const from = new Date()
  from.setHours(0, 0, 0, 0)
  const to = new Date(from)
  to.setMonth(to.getMonth() + Number(dav.windowMonths || 12))

  const calendars = await listCalendars(account, headers)
  const all: Event[] = []

  for (const cal of calendars) {
    const uri = calendarUri(cal.url) as CategoryKey
    if (!CATEGORY_KEYS.includes(uri)) continue
    const objects = await fetchEventsInRange(cal, headers, from, to)
    for (const obj of objects) {
      if (!obj.data) continue
      all.push(...parseEventsFromCalendarData(obj.data, uri))
    }
  }

  all.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  return all
})
