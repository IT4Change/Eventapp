import { computed, ref } from 'vue'
import { events as allEvents } from '~/data/events'
import { categories, categoryByKey } from '~/data/categories'
import { locations, locationById } from '~/data/locations'
import type { CategoryKey, Event } from '~/data/types'

const selectedCategories = ref<CategoryKey[]>([])
const selectedLocationId = ref<string>('')
const weekOffset = ref(0)

function startOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  date.setDate(date.getDate() + diff)
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

export const useEvents = () => {
  const referenceDate = computed(() => {
    const base = startOfWeek(new Date())
    return addDays(base, weekOffset.value * 7)
  })

  const weekDays = computed(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(referenceDate.value, i))
  })

  const filtered = computed(() => {
    return allEvents.filter((evt) => {
      if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(evt.category)) {
        return false
      }
      if (selectedLocationId.value && evt.locationId !== selectedLocationId.value) {
        return false
      }
      return true
    })
  })

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

  function toggleCategory(key: CategoryKey) {
    const idx = selectedCategories.value.indexOf(key)
    if (idx === -1) selectedCategories.value.push(key)
    else selectedCategories.value.splice(idx, 1)
  }

  function clearFilters() {
    selectedCategories.value = []
    selectedLocationId.value = ''
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

  function getCategoryFor(event: Event) {
    return categoryByKey[event.category]
  }

  function getLocationFor(event: Event) {
    return locationById[event.locationId]
  }

  return {
    categories,
    locations,
    selectedCategories,
    selectedLocationId,
    weekOffset,
    weekDays,
    eventsByDay,
    hasAnyEventsThisWeek,
    toggleCategory,
    clearFilters,
    nextWeek,
    prevWeek,
    thisWeek,
    getCategoryFor,
    getLocationFor,
  }
}
