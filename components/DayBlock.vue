<template>
  <section class="day-block" :class="{ 'is-today': isToday(day) }">
    <header class="day-header">
      <div class="day-number-wrap">
        <span class="day-number grad-text">{{ day.getDate() }}</span>
        <span class="day-month text-ink-soft">{{ monthShort }}</span>
      </div>
      <div class="day-weekday">
        <span class="text-[12px] tracking-[3px] uppercase font-medium text-coral">
          {{ todayLabel }}
        </span>
        <h2 class="font-serif text-[24px] md:text-[28px] text-ink font-normal leading-[1.2]">
          {{ weekday(day) }}
        </h2>
      </div>
    </header>

    <div class="day-events">
      <EventListItem v-for="evt in events" :key="evt.id" :event="evt" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Event } from '~/data/types'

const props = defineProps<{
  day: Date
  events: Event[]
}>()

const t = useContent()
const { weekday, isToday } = useFormat()

const MONTHS_DE = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
]
const monthShort = computed(() => MONTHS_DE[props.day.getMonth()])

const todayLabel = computed(() => (isToday(props.day) ? t.home.week.todayLabel : ' '))
</script>

<style scoped>
.day-block {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  padding: 36px 0;
  border-top: 1px solid rgba(46, 90, 87, 0.1);
}
.day-block:first-child {
  border-top: none;
  padding-top: 12px;
}
.day-header {
  position: sticky;
  top: 90px;
  align-self: start;
}
.day-number-wrap {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 2px;
}
.day-number {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 64px;
  line-height: 1;
  font-weight: 200;
}
.day-month {
  font-size: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 500;
}
.day-weekday {
  margin-top: 4px;
}
.is-today .day-number-wrap::after {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  background: var(--coral);
  border-radius: 50%;
  margin-left: 8px;
  align-self: center;
}
@media (max-width: 768px) {
  .day-block {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 28px 0;
  }
  .day-header {
    position: static;
  }
  .day-number {
    font-size: 48px;
  }
}
</style>
