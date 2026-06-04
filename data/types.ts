export type CategoryKey = 'inspiration' | 'dance' | 'healing' | 'music' | 'retreat'

export type GradientKey = 'warm' | 'cool' | 'rainbow' | 'ceremony' | 'nature'

export interface Category {
  key: CategoryKey
  label: string
  shortLabel: string
  gradient: GradientKey
  image: string
  accent: string
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
