<template>
  <article class="event-row group">
    <div class="event-time">
      <span class="text-[15px] font-medium text-ink">{{ timeRange(event.start, event.end) }}</span>
    </div>
    <div class="event-content">
      <div class="flex items-center gap-3 flex-wrap mb-1">
        <span
          class="category-pill"
          :class="`pill-${category.gradient}`"
        >
          {{ category.shortLabel }}
        </span>
        <span class="text-[13px] text-ink-soft font-light">
          {{ location?.city }} · {{ location?.name }}
        </span>
      </div>
      <h3 class="font-serif text-[20px] md:text-[22px] text-ink leading-[1.35] font-normal mb-1">
        {{ event.title }}
      </h3>
      <p v-if="event.description" class="text-[14px] text-ink-soft leading-[1.6] mb-2 font-light">
        {{ event.description }}
      </p>
      <div class="flex items-center gap-4 text-[12px] text-ink-soft/80 font-light">
        <span v-if="event.organizer">{{ event.organizer }}</span>
        <span v-if="event.price" class="price-tag">{{ event.price }}</span>
      </div>
    </div>
    <div class="event-arrow">
      <span class="arrow">→</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Event } from '~/data/types'

const props = defineProps<{ event: Event }>()

const { getCategoryFor, getLocationFor } = useEvents()
const { timeRange } = useFormat()

const category = computed(() => getCategoryFor(props.event))
const location = computed(() => getLocationFor(props.event))
</script>

<style scoped>
/* Mobile-first: kompaktes Raster; ab md (768px) breiter wie bisher. */
.event-row {
  display: grid;
  grid-template-columns: 84px 1fr 28px;
  gap: 14px;
  padding: 24px 0;
  border-bottom: 1px solid rgba(46, 90, 87, 0.08);
  align-items: start;
  cursor: pointer;
  transition: padding-left 0.2s;
}
.event-row:hover {
  padding-left: 8px;
}
.event-row:last-child {
  border-bottom: none;
}
.event-time {
  padding-top: 4px;
}
.event-arrow {
  align-self: center;
  text-align: right;
}
.arrow {
  color: var(--teal);
  font-size: 22px;
  transition: transform 0.25s, color 0.25s;
  display: inline-block;
}
.event-row:hover .arrow {
  color: var(--coral);
  transform: translateX(4px);
}
.category-pill {
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
  color: #fff;
  padding: 3px 12px;
  border-radius: 999px;
}
.pill-warm     { background: var(--grad-warm); }
.pill-rainbow  { background: var(--grad-rainbow); }
.pill-ceremony { background: linear-gradient(120deg, var(--orange), var(--teal)); }
.pill-cool     { background: var(--grad-cool); }
.pill-nature   { background: linear-gradient(120deg, var(--green), var(--teal)); }

.price-tag::before {
  content: '·';
  margin-right: 12px;
  color: var(--teal);
}
/* md ≥ 768px (Tablet/Desktop — entspricht bisherigem Layout) */
@media (min-width: 768px) {
  .event-row {
    grid-template-columns: 110px 1fr 40px;
    gap: 24px;
  }
}
</style>
