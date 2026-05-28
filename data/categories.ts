import type { Category } from './types'

export const categories: Category[] = [
  {
    key: 'inspiration',
    label: 'Inspiration & Lernen',
    shortLabel: 'Inspiration',
    gradient: 'warm',
    image: '/img/brand/02_mandala_motif.png',
    accent: 'coral',
    description:
      'Vorträge, Workshops und Kreise, in denen neues Wissen, alte Weisheit und gelebte Erfahrung zusammenkommen. Für Menschen, die ihren Horizont erweitern und sich bewusst weiterentwickeln möchten.',
  },
  {
    key: 'dance',
    label: 'Tanz',
    shortLabel: 'Tanz',
    gradient: 'rainbow',
    image: '/img/brand/04_dance_silhouettes.png',
    accent: 'orange',
    description:
      'Ekstatischer Tanz, Conscious Dance, 5Rhythms und freie Bewegung. Räume, in denen Körper und Seele atmen dürfen — ohne Schritte, ohne Show, nur Bewegung als Sprache.',
  },
  {
    key: 'healing',
    label: 'Heilsame Angebote',
    shortLabel: 'Heilsam',
    gradient: 'ceremony',
    image: '/img/brand/06_ceremony_motif.png',
    accent: 'teal',
    description:
      'Zeremonien, Atemarbeit, Körperarbeit und energetische Sessions. Begleitete Räume für Integration, Loslassen und Heilung — sanft gehalten, mit Respekt für deinen Prozess.',
  },
  {
    key: 'music',
    label: 'Singen & Musik',
    shortLabel: 'Musik',
    gradient: 'cool',
    image: '/img/brand/08_drums_instruments.png',
    accent: 'blue',
    description:
      'Mantra-Singen, Sound Journeys, Kirtan und gemeinsames Musizieren. Die Stimme als Instrument, der Klang als Brücke — zurück zu dir und in die Gemeinschaft.',
  },
  {
    key: 'retreat',
    label: 'Mehrtägige Events',
    shortLabel: 'Retreat',
    gradient: 'nature',
    image: '/img/brand/05_nature_scene.png',
    accent: 'green',
    description:
      'Retreats, Festivals und längere Auszeiten in Natur und Gemeinschaft. Zeit, in der Tiefe entstehen kann — fern vom Alltag, eingebettet in einen klaren Container.',
  },
]

export const categoryByKey = Object.fromEntries(
  categories.map((c) => [c.key, c]),
) as Record<Category['key'], Category>
