import { authHeaders, calendarUri, createCalDAVAccount, fetchEventObject, listCalendars } from '../helpers/dav'
import { CATEGORY_KEYS, parseEventsFromCalendarData } from '../utils/ical'
import type { CategoryKey, Event } from '../../data/types'

// Einzelnes Event per uuid (für die Detailseite). Sucht über die Kategorie-Kalender.
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
      const objects = await fetchEventObject(cal, headers, uuid)
      for (const obj of objects) {
        if (!obj.data) continue
        const parsed = parseEventsFromCalendarData(obj.data, uri)
        const match = parsed.find((e) => e.uuid === uuid)
        if (match) return match
      }
    } catch {
      // 404 im Kalender → weitersuchen
    }
  }
  return null
})
