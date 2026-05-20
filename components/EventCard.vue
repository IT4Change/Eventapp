<template>
  <article class="event-card bg-cream rounded-sm overflow-hidden border border-cacao/10 transition-all duration-300">
    <div class="event-card-img relative" :class="`img-${event.kind}`">
      <span class="absolute top-4 left-4 bg-cacao text-sand text-[11px] tracking-[2px] px-3.5 py-1.5 uppercase font-medium rounded-sm">
        {{ event.tag }}
      </span>
    </div>
    <div class="px-7 pt-7 pb-8">
      <div class="text-xs text-rust tracking-[3px] uppercase mb-2.5 font-medium">{{ event.date }}</div>
      <h3 class="font-serif text-2xl text-cacao mb-2 leading-[1.3] font-normal">{{ event.title }}</h3>
      <p class="italic text-[13px] text-rust/85 mb-3.5">{{ event.en }}</p>
      <div class="text-sm text-cacao-dark mb-4 flex gap-3.5 flex-wrap event-meta">
        <span v-for="(meta, i) in event.meta" :key="i">{{ meta }}</span>
      </div>
      <a href="#" class="event-link text-cacao no-underline text-[13px] tracking-[2px] uppercase font-medium inline-block">
        Anmelden →
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  event: {
    kind: 'dance' | 'ceremony' | 'nature'
    tag: string
    date: string
    title: string
    en: string
    meta: string[]
  }
}>()
</script>

<style scoped>
.event-card {
  box-shadow: 0 4px 24px rgba(107, 52, 16, 0.08);
}
.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 36px rgba(107, 52, 16, 0.15);
}
.event-card-img {
  height: 240px;
  background-size: cover;
  background-position: center;
}
.img-dance { background-image: url('/img/brand/04_dance_silhouettes.png'); }
.img-ceremony { background-image: url('/img/brand/06_ceremony_motif.png'); }
.img-nature { background-image: url('/img/brand/05_nature_scene.png'); }

.event-meta span::before {
  content: '·';
  margin-right: 14px;
  color: var(--rust);
}
.event-meta span:first-child::before {
  content: '';
  margin: 0;
}

.event-link {
  border-bottom: 1.5px solid var(--rust);
  padding-bottom: 2px;
}
.event-link:hover {
  color: var(--rust);
}
</style>
