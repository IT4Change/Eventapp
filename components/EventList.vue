<template>
  <section class="bg-white py-9 sm:py-12">
    <div class="container-w">
      <div class="ev-head">
        <div class="ev-eyebrow grad-text">Aktuelle Events</div>
        <h2 class="ev-title">{{ t.home.week.title }}</h2>
        <p class="ev-intro">{{ t.home.week.intro }}</p>
      </div>

      <EventFilter />

      <div v-if="visibleByDay.length" class="event-days">
        <DayBlock
          v-for="entry in visibleByDay"
          :key="entry.day.toISOString()"
          :day="entry.day"
          :events="entry.events"
        />
      </div>
      <div v-else class="empty-state">
        <p class="text-ink-soft text-lg font-light italic">{{ t.home.week.emptyState }}</p>
      </div>

      <div v-if="hasMore" class="load-more">
        <button class="btn btn-outline" @click="loadMore">
          {{ t.home.week.loadMore }}
        </button>
        <p class="load-more-info">
          {{ visibleCount }} von {{ totalCount }} Events
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const t = useContent()
const { visibleByDay, hasMore, loadMore, visibleCount, totalCount } = useEvents()
</script>

<style scoped>
.ev-head {
  margin-bottom: 12px;
}
.ev-eyebrow {
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 8px;
}
.ev-title {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 200;
  color: var(--ink);
  line-height: 1.15;
  font-size: 26px;
}
.ev-intro {
  margin-top: 8px;
  font-size: 16px;
  color: var(--ink-soft);
  font-weight: 300;
}

.event-days {
  margin-top: 28px;
}
.empty-state {
  padding: 48px 0;
}
.load-more {
  margin-top: 40px;
}
.load-more-info {
  margin-top: 12px;
  font-size: 12px;
  color: var(--ink-soft);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

@media (min-width: 640px) {
  .ev-title { font-size: 32px; }
}
@media (min-width: 1024px) {
  .ev-title { font-size: 38px; }
}
</style>
