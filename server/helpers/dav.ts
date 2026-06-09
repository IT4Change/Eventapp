import { Buffer } from 'node:buffer'

import { fetchCalendars, fetchCalendarObjects } from 'tsdav'
import type { DAVAccount, DAVCalendar } from 'tsdav'

export interface DavConfig {
  url: string
  username: string
  password: string
}

// Baikal-Pfade: <url>/dav.php/calendars/<user>/<calendar>/
export function createCalDAVAccount(c: DavConfig): DAVAccount {
  const base = c.url.replace(/\/+$/, '')
  return {
    accountType: 'caldav',
    serverUrl: base,
    credentials: { username: c.username, password: c.password },
    rootUrl: `${base}/dav.php/`,
    homeUrl: `${base}/dav.php/calendars/${c.username}/`,
  }
}

export function authHeaders(c: DavConfig): Record<string, string> {
  return {
    authorization: 'Basic ' + Buffer.from(`${c.username}:${c.password}`).toString('base64'),
  }
}

export function listCalendars(account: DAVAccount, headers: Record<string, string>) {
  return fetchCalendars({ account, headers })
}

// Events eines Kalenders im Zeitfenster [from, to).
export function fetchEventsInRange(
  calendar: DAVCalendar,
  headers: Record<string, string>,
  from: Date,
  to: Date,
) {
  return fetchCalendarObjects({
    calendar,
    headers,
    timeRange: { start: from.toISOString(), end: to.toISOString() },
  })
}

// Alle Event-Objekte eines Kalenders (ohne Zeitfenster). Wird für die Einzel-
// Suche per UID genutzt — der Dateiname (href) entspricht NICHT zwingend der UID
// (CalDAV-Clients/Baikal-UI vergeben zufällige hrefs), daher Suche über den Inhalt.
export function fetchAllEvents(calendar: DAVCalendar, headers: Record<string, string>) {
  return fetchCalendarObjects({ calendar, headers })
}

// Letztes Pfadsegment einer Kalender-URL → Kalender-URI (z. B. 'dance').
export function calendarUri(url: string): string {
  return url.replace(/\/+$/, '').split('/').pop() ?? ''
}
