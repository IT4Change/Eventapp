import type { Category } from './types'

export const categories: Category[] = [
  {
    key: 'dance',
    label: 'Tanz',
    shortLabel: 'Tanz',
    gradient: 'rainbow',
    image: '/img/brand/kategorien/04_dance_silhouettes.svg',
    accent: 'orange',
    description:
      'Räume, in denen Körper und Seele atmen dürfen — ohne Schritte, ohne Show, nur Bewegung als Sprache.',
    includes: ['Ecstatic Dance', 'Contact Dance', '5 Rhythmen'],
  },
  {
    key: 'music',
    label: 'Singen & Musik',
    shortLabel: 'Singen & Musik',
    gradient: 'cool',
    image: '/img/brand/kategorien/08_music_scene.svg',
    accent: 'teal',
    description:
      'Mantra-Singen, Sound Journeys, Kirtan und gemeinsames Musizieren. Die Stimme als Instrument, der Klang als Brücke — zurück zu dir und in die Gemeinschaft.',
    includes: ['Singkreis', 'Konzert'],
  },
  {
    key: 'healing',
    label: 'Heilsame Angebote',
    shortLabel: 'Heilsame Angebote',
    gradient: 'ceremony',
    image: '/img/brand/kategorien/06_ceremony_motif.svg',
    accent: 'blue',
    description:
      'Zeremonien, Atemarbeit, Körperarbeit und energetische Sessions. Begleitete Räume für Integration, Loslassen und Heilung — sanft gehalten, mit Respekt für deinen Prozess.',
    includes: ['Zeremonien', 'Körperarbeit', 'Massagen', 'Breathwork'],
  },
  {
    key: 'inspiration',
    label: 'Inspiration & Lernen',
    shortLabel: 'Inspiration & Lernen',
    gradient: 'warm',
    image: '/img/brand/kategorien/02_mandala_motif.svg',
    accent: 'green',
    description:
      'Vorträge, Workshops und Kreise, in denen neues Wissen, alte Weisheit und gelebte Erfahrung zusammenkommen. Für Menschen, die ihren Horizont erweitern und sich bewusst weiterentwickeln möchten.',
    includes: ['Workshops', 'Vorträge', 'Coachings'],
  },
  {
    key: 'retreat',
    label: 'Mehrtägige Events',
    shortLabel: 'Mehrtägige Events',
    gradient: 'nature',
    image: '/img/brand/kategorien/05_nature_scene.svg',
    accent: 'coral',
    description:
      'Retreats, Festivals und längere Auszeiten in Natur und Gemeinschaft. Zeit, in der Tiefe entstehen kann — fern vom Alltag, eingebettet in einen klaren Container.',
    includes: ['Festivals', 'Retreats'],
  },
]

export const categoryByKey = Object.fromEntries(
  categories.map((c) => [c.key, c]),
) as Record<Category['key'], Category>
