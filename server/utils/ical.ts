import ICAL from 'ical.js'

import { categories } from '../../data/categories'
import { locationById } from '../../data/locations'
import type { CategoryKey, Event } from '../../data/types'

// Die 5 Kategorie-Keys dienen zugleich als Kalender-URIs in Baikal.
export const CATEGORY_KEYS: CategoryKey[] = categories.map((c) => c.key)

// Akzentfarbe je Kategorie → calendar-color beim Anlegen (kosmetisch).
const ACCENT_HEX: Record<string, string> = {
  coral: '#E87A5D',
  orange: '#F2994A',
  gold: '#F4C95D',
  teal: '#54C0B4',
  blue: '#6BA8D8',
  green: '#9CCC65',
}
export function categoryColor(key: CategoryKey): string {
  const accent = categories.find((c) => c.key === key)?.accent ?? 'teal'
  return ACCENT_HEX[accent] ?? '#54C0B4'
}

// "2026-07-04T10:00:00" → floating ICAL.Time (kein TZ-Mathe, wie das bisherige Modell).
function toIcalTime(iso: string): ICAL.Time {
  const [datePart, timePart = '00:00:00'] = iso.split('T')
  const [y, mo, d] = datePart.split('-').map(Number)
  const [h, mi, s] = timePart.split(':').map(Number)
  return new ICAL.Time({
    year: y,
    month: mo,
    day: d,
    hour: h || 0,
    minute: mi || 0,
    second: s || 0,
    isDate: false,
  })
}

// floating ICAL.Time → "2026-07-04T10:00:00" (Wall-Clock, verlustfreier Round-Trip).
function timeToIso(t: ICAL.Time): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${t.year}-${p(t.month)}-${p(t.day)}T${p(t.hour)}:${p(t.minute)}:${p(t.second)}`
}

/**
 * Baut aus unserem Event eine vollständige VCALENDAR/VEVENT-Repräsentation.
 * Nutzt ical.js → korrektes Escaping/Folding für lange Beschreibungen.
 */
export function buildEventIcs(ev: Event): string {
  const vcal = new ICAL.Component('vcalendar')
  vcal.updatePropertyWithValue('version', '2.0')
  vcal.updatePropertyWithValue('prodid', '-//Soul & Bliss//Eventapp//DE')

  const ve = new ICAL.Component('vevent')
  ve.updatePropertyWithValue('uid', ev.uuid)
  ve.updatePropertyWithValue('dtstamp', ICAL.Time.now())
  ve.updatePropertyWithValue('dtstart', toIcalTime(ev.start))
  if (ev.end) ve.updatePropertyWithValue('dtend', toIcalTime(ev.end))
  ve.updatePropertyWithValue('summary', ev.title)
  ve.updatePropertyWithValue('categories', ev.category)
  if (ev.detailedDescription) ve.updatePropertyWithValue('description', ev.detailedDescription)
  if (ev.url) ve.updatePropertyWithValue('url', ev.url)

  // Ort: denormalisierter Text (für native Clients) + ID als X-Prop.
  const loc = locationById[ev.locationId]
  if (loc) ve.updatePropertyWithValue('location', `${loc.city} · ${loc.name}`)
  ve.updatePropertyWithValue('x-sb-location-id', ev.locationId)

  // Organizer: Name+Mail als ORGANIZER (nativ); nur-Name → X-Prop.
  if (ev.email) {
    const op = new ICAL.Property('organizer', ve)
    if (ev.organizer) op.setParameter('cn', ev.organizer)
    op.setValue(`mailto:${ev.email}`)
    ve.addProperty(op)
  } else if (ev.organizer) {
    ve.updatePropertyWithValue('x-sb-organizer', ev.organizer)
  }

  // Bild: IMAGE;VALUE=URI (nativ, RFC 7986).
  if (ev.image) {
    const ip = new ICAL.Property('image', ve)
    ip.setParameter('value', 'URI')
    ip.setValue(ev.image)
    ve.addProperty(ip)
  }

  // Domänenfelder ohne iCal-Pendant → X-SB-*.
  if (ev.description) ve.updatePropertyWithValue('x-sb-teaser', ev.description)
  if (ev.subcategory) ve.updatePropertyWithValue('x-sb-subcategory', ev.subcategory)
  if (ev.registration) ve.updatePropertyWithValue('x-sb-registration', ev.registration)
  if (ev.price) ve.updatePropertyWithValue('x-sb-price', ev.price)
  if (ev.source) ve.updatePropertyWithValue('x-sb-source', ev.source)
  if (ev.aggregatorNote) ve.updatePropertyWithValue('x-sb-note', ev.aggregatorNote)
  if (ev.mapsUrl) ve.updatePropertyWithValue('x-sb-maps-url', ev.mapsUrl)
  if (ev.phone) ve.updatePropertyWithValue('x-sb-phone', ev.phone)

  vcal.addSubcomponent(ve)
  return vcal.toString()
}

/**
 * Parst eine VCALENDAR-Ressource (eine oder mehrere VEVENTs) zurück in unser
 * Event[]. Die Kategorie kommt vom Quell-Kalender (Bucket), nicht aus CATEGORIES.
 */
export function parseEventsFromCalendarData(calendarData: string, category: CategoryKey): Event[] {
  const root = new ICAL.Component(ICAL.parse(calendarData))
  const vevents = root.getAllSubcomponents('vevent')

  return vevents.map((ve) => {
    const get = (name: string): string | undefined => {
      const v = ve.getFirstPropertyValue(name)
      return v == null ? undefined : String(v)
    }
    const dtstart = ve.getFirstProperty('dtstart')?.getFirstValue() as ICAL.Time | undefined
    const dtend = ve.getFirstProperty('dtend')?.getFirstValue() as ICAL.Time | undefined

    // Organizer aufsplitten (CN + mailto) bzw. X-Prop-Fallback.
    const organizerProp = ve.getFirstProperty('organizer')
    let organizer = get('x-sb-organizer')
    let email: string | undefined
    if (organizerProp) {
      const cn = organizerProp.getParameter('cn')
      if (typeof cn === 'string') organizer = cn
      const val = String(organizerProp.getFirstValue() ?? '')
      if (val.toLowerCase().startsWith('mailto:')) email = val.slice('mailto:'.length)
    }

    const uuid = get('uid') ?? ''
    return {
      id: uuid,
      uuid,
      title: get('summary') ?? '',
      category,
      subcategory: get('x-sb-subcategory'),
      start: dtstart ? timeToIso(dtstart) : '',
      end: dtend ? timeToIso(dtend) : undefined,
      locationId: get('x-sb-location-id') ?? '',
      description: get('x-sb-teaser') ?? '',
      detailedDescription: get('description'),
      registration: get('x-sb-registration'),
      url: get('url'),
      email,
      phone: get('x-sb-phone'),
      mapsUrl: get('x-sb-maps-url'),
      image: get('image'),
      organizer,
      price: get('x-sb-price'),
      source: get('x-sb-source'),
      aggregatorNote: get('x-sb-note'),
    } satisfies Event
  })
}
