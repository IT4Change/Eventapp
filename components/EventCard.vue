<template>
  <article class="event-card bg-off rounded-3xl overflow-hidden transition-all duration-300">
    <div class="event-card-img relative" :class="`img-${event.kind}`">
      <span class="absolute top-4 left-4 text-white text-[11px] tracking-[2px] px-4 py-1.5 uppercase font-medium rounded-full" :class="`tag-${event.kind}`">
        {{ event.tag }}
      </span>
    </div>
    <div class="px-7 pt-[26px] pb-8">
      <div class="text-xs text-coral tracking-[2px] uppercase mb-2.5 font-medium">{{ event.date }}</div>
      <h3 class="font-serif text-[23px] text-ink mb-2 leading-[1.3] font-normal">{{ event.title }}</h3>
      <p class="italic text-[13px] text-ink-soft mb-3.5 font-serif">{{ event.en }}</p>
      <div class="text-sm text-ink-soft mb-[18px] flex gap-3.5 flex-wrap event-meta font-light">
        <span v-for="(meta, i) in event.meta" :key="i">{{ meta }}</span>
      </div>
      <a href="#" class="event-link text-ink no-underline text-[13px] tracking-[1.5px] uppercase font-medium inline-block">
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
  box-shadow: 0 8px 30px rgba(46, 90, 87, 0.06);
}
.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 44px rgba(46, 90, 87, 0.13);
}
.event-card-img {
  height: 320px;
  background-size: cover;
  background-position: center;
}
.img-dance { background-image: url('/img/brand/04_dance_silhouettes.png'); }
.img-ceremony { background-image: url('/img/brand/06_ceremony_motif.png'); }
.img-nature { background-image: url('/img/brand/05_nature_scene.png'); }

.tag-dance {
  background: linear-gradient(120deg, #E87A5D 0%, #F2994A 50%, #F4C95D 100%);
}
.tag-ceremony {
  background: linear-gradient(120deg, #F2994A, #54C0B4);
}
.tag-nature {
  background: linear-gradient(120deg, #9CCC65, #54C0B4);
}

.event-meta span::before {
  content: '·';
  margin-right: 14px;
  color: var(--teal);
}
.event-meta span:first-child::before {
  content: '';
  margin: 0;
}

.event-link {
  border-bottom: 2px solid var(--teal);
  padding-bottom: 2px;
}
.event-link:hover {
  color: var(--coral);
  border-color: var(--coral);
}
</style>
