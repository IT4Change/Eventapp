<template>
  <section id="events" class="events bg-sand py-24">
    <div class="container-w">
      <div class="section-eyebrow">Kommende Events · Upcoming</div>
      <h2 class="section-title">
        Wo wir uns <span class="script text-rust" style="font-size: 60px;">begegnen</span>
      </h2>
      <p class="section-intro">Drei Pfade, eine Reise. Wähle, was dich ruft — oder gehe alle drei.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
        <EventCard v-for="event in events" :key="event.title" :event="event" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const events = [
  {
    kind: 'dance' as const,
    tag: 'Dance',
    date: '14. Juni 2026 · Sat',
    title: 'Ekstatischer Tanz am Vollmond',
    en: 'Ecstatic Dance · Full Moon Edition',
    meta: ['Wald-Tempel, Brandenburg', '3 h', '€38'],
  },
  {
    kind: 'ceremony' as const,
    tag: 'Spirit',
    date: '28.–30. Juni 2026 · 3 Tage',
    title: 'Stille & Kakao-Zeremonie',
    en: 'Silent Retreat & Cacao Ceremony',
    meta: ['Klosterhof Eifel', '3 Tage', '€480'],
  },
  {
    kind: 'nature' as const,
    tag: 'Nature',
    date: '12.–19. Juli 2026 · 7 Tage',
    title: 'Wildnis-Retreat im Schwarzwald',
    en: 'Wilderness Retreat · Black Forest',
    meta: ['Schwarzwald', '7 Tage', '€890'],
  },
]
</script>
