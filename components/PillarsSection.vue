<template>
  <section id="pillars" class="pillars bg-off text-center py-[100px]">
    <div class="container-w">
      <div class="section-eyebrow grad-text inline-block">Unsere Werte · Our Values</div>
      <h2 class="section-title">
        Drei <span class="script grad-text" style="font-size: 58px;">Pfade</span>
      </h2>
      <p class="section-intro">Jedes Event, das wir gestalten, ruht auf diesen drei Säulen.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
        <div v-for="p in pillars" :key="p.title" class="pillar">
          <div class="pillar-icon mx-auto mb-6">
            <img :src="p.img" :alt="p.title" :style="p.style" />
          </div>
          <h3 class="font-serif text-[26px] text-ink mb-1 font-normal">{{ p.title }}</h3>
          <span class="italic text-coral text-[13px] mb-4 block font-serif">{{ p.en }}</span>
          <p class="text-[15px] text-ink-soft leading-[1.7] font-light">{{ p.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const pillars = [
  {
    img: '/img/brand/02_mandala_motif.png',
    title: 'Zeremonie',
    en: 'Ceremony',
    text: 'Räume mit Absicht. Wir halten heilige Container, in denen tiefe Erfahrung sicher und respektvoll geschehen darf.',
    style: 'object-fit: contain;',
  },
  {
    img: '/img/brand/04_dance_silhouettes.png',
    title: 'Bewegung',
    en: 'Movement',
    text: 'Tanz als Gebet. Ekstatische Bewegung, Atemarbeit und somatische Praxis bringen dich zurück in deinen Körper.',
    style: 'object-fit: contain;',
  },
  {
    img: '/img/brand/05_nature_scene.png',
    title: 'Natur',
    en: 'Nature',
    text: 'Die Erde als Lehrerin. Wir gehen raus, schlafen draußen, hören zu — und erinnern uns, woher wir kommen.',
    style: 'object-fit: cover; border-radius: 50%;',
  },
]
</script>

<style scoped>
.pillar {
  padding: 44px 28px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(46, 90, 87, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}
.pillar:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 40px rgba(46, 90, 87, 0.12);
}
.pillar-icon {
  width: 168px;
  height: 168px;
}
.pillar-icon img {
  width: 100%;
  height: 100%;
}
</style>
