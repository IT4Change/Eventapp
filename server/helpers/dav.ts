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

// Einzelnes Event per Dateiname (<uid>.ics) aus einem Kalender.
export function fetchEventObject(
  calendar: DAVCalendar,
  headers: Record<string, string>,
  uid: string,
) {
  return fetchCalendarObjects({
    calendar,
    headers,
    objectUrls: [`${uid}.ics`],
  })
}

// Letztes Pfadsegment einer Kalender-URL → Kalender-URI (z. B. 'dance').
export function calendarUri(url: string): string {
  return url.replace(/\/+$/, '').split('/').pop() ?? ''
}
