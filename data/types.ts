export type CategoryKey = 'inspiration' | 'dance' | 'healing' | 'music' | 'retreat'

export type GradientKey = 'warm' | 'cool' | 'rainbow' | 'ceremony' | 'nature'

// Strukturelle Kategorie-Daten (sprachneutral). Die Texte (label, shortLabel,
// description, includes) liegen lokalisiert im i18n-Store unter categories.items.<key>.
export interface Category {
  key: CategoryKey
  gradient: GradientKey
  image: string
  accent: string
}

// Kategorie inkl. lokalisierter Texte — von useCategories() zusammengeführt.
export interface LocalizedCategory extends Category {
  label: string
  shortLabel: string
  description: string
  includes: string[]
}

export type Region = 'rhein' | 'main' | 'neckar'

export interface Location {
  id: string
  name: string
  city: string
  region: Region
}

export interface Event {
  id: string
  uuid: string
  title: string
  category: CategoryKey
  subcategory?: string
  start: string
  end?: string
  locationId: string
  description: string
  detailedDescription?: string
  registration?: string
  url?: string
  email?: string
  phone?: string
  mapsUrl?: string
  image?: string
  organizer?: string
  price?: string
  source?: string
  aggregatorNote?: string
}
