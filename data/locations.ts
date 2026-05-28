import type { Location } from './types'

export const locations: Location[] = [
  { id: 'frankfurt-tempel', name: 'Tempel Frankfurt', city: 'Frankfurt am Main', region: 'main' },
  { id: 'frankfurt-yoga-loft', name: 'Yoga Loft Bornheim', city: 'Frankfurt am Main', region: 'main' },
  { id: 'mainz-kulturhaus', name: 'Kulturhaus am Rhein', city: 'Mainz', region: 'rhein' },
  { id: 'wiesbaden-studio', name: 'Studio für Bewegung', city: 'Wiesbaden', region: 'main' },
  { id: 'darmstadt-zentrum', name: 'Bewusstseinszentrum', city: 'Darmstadt', region: 'main' },
  { id: 'mannheim-loft', name: 'Conscious Loft', city: 'Mannheim', region: 'neckar' },
  { id: 'heidelberg-altstadt', name: 'Heilraum Altstadt', city: 'Heidelberg', region: 'neckar' },
  { id: 'odenwald-finca', name: 'Finca im Odenwald', city: 'Odenwald', region: 'main' },
  { id: 'pfalz-retreat', name: 'Retreat-Hof Pfalz', city: 'Pfälzerwald', region: 'rhein' },
  { id: 'taunus-naturplatz', name: 'Naturplatz Taunus', city: 'Taunus', region: 'main' },
]

export const locationById = Object.fromEntries(
  locations.map((l) => [l.id, l]),
) as Record<string, Location>
