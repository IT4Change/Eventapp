<template>
  <section class="bg-white py-[80px] md:py-[100px]">
    <div class="container-w">
      <div class="text-center mb-10">
        <div class="section-eyebrow grad-text inline-block">Aktuelle Woche · This week</div>
        <h2 class="section-title">{{ t.home.week.title }}</h2>
        <p class="section-intro">{{ t.home.week.intro }}</p>
      </div>

      <div class="week-controls mb-8">
        <button class="week-nav-btn" @click="prevWeek" aria-label="Vorherige Woche">
          ←
        </button>
        <div class="week-range">
          <span class="text-[12px] tracking-[2px] uppercase text-ink-soft font-medium">
            Woche
          </span>
          <span class="text-[16px] text-ink font-medium ml-2">
            {{ dateRangeLabel(weekDays[0], weekDays[6]) }}
          </span>
          <button v-if="weekOffset !== 0" class="this-week-btn ml-3" @click="thisWeek">
            heute
          </button>
        </div>
        <button class="week-nav-btn" @click="nextWeek" aria-label="Nächste Woche">
          →
        </button>
      </div>

      <EventFilter />

      <div v-if="hasAnyEventsThisWeek" class="week-days">
        <DayBlock
          v-for="entry in eventsByDay"
          :key="entry.day.toISOString()"
          :day="entry.day"
          :events="entry.events"
        />
      </div>
      <div v-else class="empty-state">
        <p class="text-ink-soft text-lg font-light italic">{{ t.home.week.emptyState }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const t = useContent()
const {
  eventsByDay,
  weekDays,
  weekOffset,
  hasAnyEventsThisWeek,
  nextWeek,
  prevWeek,
  thisWeek,
} = useEvents()
const { dateRangeLabel } = useFormat()
</script>

<style scoped>
.week-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
.week-nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1.5px solid var(--teal);
  background: #fff;
  color: var(--ink);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
  font-family: inherit;
}
.week-nav-btn:hover {
  background: var(--grad-cool);
  color: #fff;
  border-color: transparent;
}
.week-range {
  display: flex;
  align-items: center;
}
.this-week-btn {
  background: none;
  border: none;
  color: var(--coral);
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
}
.empty-state {
  padding: 80px 0;
  text-align: center;
}
</style>
