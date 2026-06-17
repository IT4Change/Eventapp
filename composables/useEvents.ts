import { computed, ref } from 'vue'
import { locations, locationById } from '~/data/locations'
import type { CategoryKey, Event } from '~/data/types'

const PAGE_SIZE = 30

const selectedCategories = ref<CategoryKey[]>([])
const selectedLocationId = ref<string>('')
const dateFrom = ref<string>('')
const dateTo = ref<string>('')
const visibleCount = ref(PAGE_SIZE)
const weekOffset = ref(0)

function startOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function startOfDay(d: Date): Date {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  return date
}

function addDays(d: Date, days: number): Date {
  const date = new Date(d)
  date.setDate(date.getDate() + days)
  return date
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function eventPath(event: Event): string {
  return `/event/${event.uuid}/${slugify(event.title)}`
}

export const useEvents = () => {
  // Events kommen aus dem Backend (Nitro /api/events → Baikal/CalDAV).
  // key teilt den Request/SSR-Payload über alle Komponenten hinweg.
  const { data: allEventsData } = useFetch<Event[]>('/api/events', {
    key: 'events',
    default: () => [],
  })
  const allEvents = computed<Event[]>(() => allEventsData.value ?? [])

  const referenceDate = computed(() => {
    const base = startOfWeek(new Date())
    return addDays(base, weekOffset.value * 7)
  })

  const weekDays = computed(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(referenceDate.value, i))
  })

  const filtered = computed(() => {
    const today = startOfDay(new Date())
    return allEvents.value
      .filter((evt) => {
        const start = new Date(evt.start)
        if (start < today) return false
        if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(evt.category)) {
          return false
        }
        if (selectedLocationId.value && evt.locationId !== selectedLocationId.value) {
          return false
        }
        if (dateFrom.value) {
          const from = new Date(dateFrom.value)
          if (start < from) return false
        }
        if (dateTo.value) {
          const to = new Date(dateTo.value)
          to.setHours(23, 59, 59, 999)
          if (start > to) return false
        }
        return true
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  })

  const visibleEvents = computed(() => filtered.value.slice(0, visibleCount.value))

  const eventsByDay = computed(() => {
    return weekDays.value.map((day) => {
      const dayEvents = filtered.value
        .filter((e) => isSameDay(new Date(e.start), day))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      return { day, events: dayEvents }
    })
  })

  const hasAnyEventsThisWeek = computed(() =>
    eventsByDay.value.some((d) => d.events.length > 0),
  )

  const hasMore = computed(() => filtered.value.length > visibleCount.value)
  const totalCount = computed(() => filtered.value.length)

  function toggleCategory(key: CategoryKey) {
    const idx = selectedCategories.value.indexOf(key)
    if (idx === -1) selectedCategories.value.push(key)
    else selectedCategories.value.splice(idx, 1)
    visibleCount.value = PAGE_SIZE
  }

  function clearFilters() {
    selectedCategories.value = []
    selectedLocationId.value = ''
    dateFrom.value = ''
    dateTo.value = ''
    visibleCount.value = PAGE_SIZE
  }

  function loadMore() {
    visibleCount.value += PAGE_SIZE
  }

  function nextWeek() {
    weekOffset.value += 1
  }

  function prevWeek() {
    weekOffset.value -= 1
  }

  function thisWeek() {
    weekOffset.value = 0
  }

  function getLocationFor(event: Event) {
    return locationById[event.locationId]
  }

  return {
    locations,
    selectedCategories,
    selectedLocationId,
    dateFrom,
    dateTo,
    visibleCount,
    weekOffset,
    weekDays,
    eventsByDay,
    visibleEvents,
    hasAnyEventsThisWeek,
    hasMore,
    totalCount,
    toggleCategory,
    clearFilters,
    loadMore,
    nextWeek,
    prevWeek,
    thisWeek,
    getLocationFor,
    eventPath,
  }
}
