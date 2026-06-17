<template>
  <article class="event-row group">
    <!-- Links: Wochentag + Datum (klein, fett) + Startzeit -->
    <div class="event-date">
      <span class="ev-weekday">{{ weekday(event.start) }}</span>
      <span class="ev-day">{{ dayMonthYearShort(event.start) }}</span>
      <span class="ev-time">{{ time(event.start) }}</span>
    </div>

    <!-- Hauptspalte -->
    <div class="event-main">
      <!-- Zeile 1: Titel (groß) + externer Domain-Link -->
      <div class="ev-titleline">
        <NuxtLinkLocale :to="eventPath(event)" class="ev-title-link">
          <h3 class="ev-title">{{ event.title }}</h3>
        </NuxtLinkLocale>
        <span v-if="domain" class="ev-linkwrap">
          <span class="ev-dot" aria-hidden="true">·</span>
          <a
            :href="event.url"
            target="_blank"
            rel="noopener noreferrer"
            class="ev-domain"
          >{{ domain }}</a>
        </span>
      </div>

      <!-- Zeile 2: Kategorie-Pille (Akzentfarbe) + Stadt + Ort -->
      <div class="ev-metaline">
        <span class="category-pill" :class="`pill-${category.accent}`">
          {{ category.shortLabel }}
        </span>
        <span v-if="location" class="ev-loc">
          <span class="ev-city">{{ location.city }}</span>
          <svg class="ev-pin" :class="`pin-${category.accent}`" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
          <span class="ev-venue">{{ location.name }}</span>
        </span>
      </div>

      <!-- Zeile 3: Kurzbeschreibung (gedämpft, sekundär) -->
      <p v-if="event.description" class="ev-desc">{{ event.description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Event } from '~/data/types'

const props = defineProps<{ event: Event }>()

const { getLocationFor } = useEvents()
const { categoryByKey } = useCategories()
const { weekday, dayMonthYearShort, time } = useFormat()

const category = computed(() => categoryByKey.value[props.event.category])
const location = computed(() => getLocationFor(props.event))

// Hostname ohne "www." als sichtbarer Link-Text (z. B. martin-timpe.de).
const domain = computed(() => {
  const url = props.event.url
  if (!url) return ''
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '')
  }
})
</script>

<style scoped>
/* Mobile-first: schmale Datums-Spalte + Hauptspalte. Stretched-Link auf die
   ganze Zeile (Detailseite); Domain-Link liegt darüber und bleibt eigenständig. */
.event-row {
  position: relative;
  display: grid;
  grid-template-columns: 108px minmax(0, 1fr);
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(46, 90, 87, 0.1);
  align-items: start;
}
.event-row:last-child {
  border-bottom: none;
}

/* Datums-Spalte */
.event-date {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  padding-top: 3px;
}
.ev-weekday {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}
.ev-day {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
}
.ev-time {
  font-size: 14px;
  color: var(--ink-soft);
  font-weight: 400;
  margin-top: 3px;
}

/* Hauptspalte */
.event-main {
  min-width: 0;
}
.ev-titleline {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 10px;
}
.ev-title-link {
  text-decoration: none;
  color: inherit;
  min-width: 0;
}
/* Stretched-Link: die ganze Zeile navigiert zur Detailseite */
.ev-title-link::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
}
.ev-title {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 21px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.25;
  transition: color 0.2s;
  overflow-wrap: break-word;
}
.event-row:hover .ev-title {
  color: var(--coral);
}
/* Trenn-Punkt + Domain als eine Einheit — bricht zusammen um, kein verwaister "·" */
.ev-linkwrap {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  min-width: 0;
  position: relative;
  z-index: 1;
}
.ev-dot {
  color: var(--ink-soft);
  flex-shrink: 0;
}
.ev-domain {
  position: relative;
  z-index: 1;
  min-width: 0;
  font-size: 16px;
  color: var(--ink-soft);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  transition: color 0.2s;
  overflow-wrap: anywhere;
}
.ev-domain:hover {
  color: var(--teal);
}

/* Zeile 2: Pille + Ort */
.ev-metaline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 5px;
}
.category-pill {
  font-size: 9px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  font-weight: 600;
  color: #fff;
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
}
/* einfarbige Tags — eine Palettenfarbe je Kategorie (kein Verlauf) */
.pill-coral  { background: var(--coral); }
.pill-orange { background: var(--orange); }
.pill-gold   { background: var(--gold); }
.pill-teal   { background: var(--teal); }
.pill-blue   { background: var(--blue); }
.pill-green  { background: var(--green); }

.ev-loc {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 6px;
  font-size: 14px;
  color: var(--ink-soft);
  font-weight: 300;
  min-width: 0;
}
.ev-city {
  white-space: nowrap;
}
.ev-pin {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.pin-coral  { fill: var(--coral); }
.pin-orange { fill: var(--orange); }
.pin-gold   { fill: var(--gold); }
.pin-teal   { fill: var(--teal); }
.pin-blue   { fill: var(--blue); }
.pin-green  { fill: var(--green); }
.ev-venue {
  min-width: 0;
  overflow-wrap: anywhere;
}

/* Zeile 3: Kurzbeschreibung */
.ev-desc {
  margin-top: 4px;
  font-size: 14px;
  color: var(--ink-soft);
  font-weight: 300;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* md ≥ 768px (Tablet/Desktop) */
@media (min-width: 768px) {
  .event-row {
    grid-template-columns: 132px minmax(0, 1fr);
    gap: 24px;
    padding: 14px 0;
  }
  .ev-weekday {
    font-size: 18px;
  }
  .ev-day {
    font-size: 19px;
  }
  .ev-time {
    font-size: 15px;
  }
  .ev-title {
    font-size: 24px;
  }
  .ev-domain {
    font-size: 17px;
  }
}
</style>
