<template>
  <section id="pillars" class="pillars bg-sand text-center py-24">
    <div class="container-w">
      <div class="section-eyebrow">Unsere Werte · Our Values</div>
      <h2 class="section-title">
        Drei <span class="script text-rust" style="font-size: 60px;">Pfade</span> in den Wald
      </h2>
      <p class="section-intro">Jedes Event, das wir gestalten, ruht auf diesen drei Säulen.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
        <div v-for="p in pillars" :key="p.title" class="px-4 py-8">
          <div class="pillar-icon mx-auto mb-6">{{ p.icon }}</div>
          <h3 class="font-serif text-2xl text-cacao mb-1.5 font-normal">{{ p.title }}</h3>
          <span class="italic text-rust text-[13px] mb-3.5 block">{{ p.en }}</span>
          <p class="text-[15px] text-cacao-dark leading-[1.7]">{{ p.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const pillars = [
  {
    icon: '◯',
    title: 'Zeremonie',
    en: 'Ceremony',
    text: 'Räume mit Absicht. Wir halten heilige Container, in denen tiefe Erfahrung sicher und respektvoll geschehen darf.',
  },
  {
    icon: '◐',
    title: 'Bewegung',
    en: 'Movement',
    text: 'Tanz als Gebet. Ekstatische Bewegung, Atemarbeit und somatische Praxis bringen dich zurück in deinen Körper.',
  },
  {
    icon: '◑',
    title: 'Natur',
    en: 'Nature',
    text: 'Die Erde als Lehrerin. Wir gehen raus, schlafen draußen, hören zu — und erinnern uns, woher wir kommen.',
  },
]
</script>

<style scoped>
.pillar-icon {
  width: 80px;
  height: 80px;
  border: 1.5px solid var(--rust);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  font-size: 38px;
  color: var(--cacao);
}
</style>
