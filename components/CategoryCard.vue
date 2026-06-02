<template>
  <article class="category-card" :class="`card-${category.gradient}`">
    <div class="card-image" :style="{ backgroundImage: `url('${category.image}')` }">
      <span class="card-pill" :class="`pill-${category.accent}`">
        {{ category.shortLabel }}
      </span>
    </div>
    <div class="card-body">
      <h3 class="font-serif text-[24px] md:text-[26px] text-ink mb-2 font-normal leading-[1.25]">
        {{ category.label }}
      </h3>
      <p v-if="category.includes?.length" class="card-includes">
        <span class="includes-label">{{ t.categories.includesLabel }}:</span>
        {{ category.includes.join(' · ') }}
      </p>
      <p class="text-[15px] text-ink-soft leading-[1.7] font-light">
        {{ category.description }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Category } from '~/data/types'

defineProps<{ category: Category }>()
const t = useContent()
</script>

<style scoped>
.category-card {
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(46, 90, 87, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}
.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 44px rgba(46, 90, 87, 0.13);
}
.card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}
@media (min-width: 1024px) {
  .card-image {
    height: 240px;
  }
}
.card-body {
  padding: 28px 30px 32px;
  flex: 1;
}
.card-pill {
  position: absolute;
  top: 18px;
  left: 18px;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 500;
  color: #fff;
  padding: 5px 14px;
  border-radius: 999px;
}
/* einfarbige Tags — eine Palettenfarbe je Kategorie (kein Verlauf) */
.pill-coral  { background: var(--coral); }
.pill-orange { background: var(--orange); }
.pill-gold   { background: var(--gold); }
.pill-teal   { background: var(--teal); }
.pill-blue   { background: var(--blue); }
.pill-green  { background: var(--green); }

.card-includes {
  font-size: 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin-bottom: 14px;
  line-height: 1.5;
  font-weight: 500;
}
.includes-label {
  color: var(--coral);
  margin-right: 6px;
}
</style>
