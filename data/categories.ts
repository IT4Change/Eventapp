import type { Category } from './types'

// Nur strukturelle Daten (Gradient, Bild, Akzentfarbe). Lokalisierte Texte
// (label, shortLabel, description, includes) liegen im i18n-Store unter
// categories.items.<key> und werden via useCategories() zusammengeführt.
export const categories: Category[] = [
  {
    key: 'dance',
    gradient: 'rainbow',
    image: '/img/brand/kategorien/04_dance_silhouettes.svg',
    accent: 'orange',
  },
  {
    key: 'music',
    gradient: 'cool',
    image: '/img/brand/kategorien/08_music_scene.svg',
    accent: 'teal',
  },
  {
    key: 'healing',
    gradient: 'ceremony',
    image: '/img/brand/kategorien/06_ceremony_motif.svg',
    accent: 'blue',
  },
  {
    key: 'inspiration',
    gradient: 'warm',
    image: '/img/brand/kategorien/02_mandala_motif.svg',
    accent: 'green',
  },
  {
    key: 'retreat',
    gradient: 'nature',
    image: '/img/brand/kategorien/05_nature_scene.svg',
    accent: 'coral',
  },
]

export const categoryByKey = Object.fromEntries(
  categories.map((c) => [c.key, c]),
) as Record<Category['key'], Category>
