<template>
  <section class="bg-white py-[60px] md:py-[80px]">
    <div class="container-w">
      <div class="text-center mb-10">
        <div class="section-eyebrow grad-text inline-block">Aktuelle Events</div>
        <h2 class="section-title">{{ t.home.week.title }}</h2>
        <p class="section-intro">{{ t.home.week.intro }}</p>
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
.empty-state {
  padding: 80px 0;
  text-align: center;
}
.load-more {
  margin-top: 56px;
  text-align: center;
}
.load-more-info {
  margin-top: 14px;
  font-size: 12px;
  color: var(--ink-soft);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
</style>
