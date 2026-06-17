<template>
  <header
    class="hero relative flex items-center overflow-hidden"
    :class="`hero-${variant}`"
    :style="bgStyle"
  >
    <div class="container-w w-full min-w-0">
      <div class="relative z-10 hero-inner max-w-[880px]">
        <div
          v-if="eyebrow"
          class="hero-eyebrow grad-text text-[13px] tracking-[5px] uppercase mb-3 font-medium inline-block"
        >
          {{ eyebrow }}
        </div>
        <h1 v-if="title || titleScript" class="hero-title text-ink font-extralight">
          {{ title }} <span v-if="titleScript" class="script grad-text">{{ titleScript }}</span>
        </h1>
        <p
          v-if="subtitleEn"
          class="hero-en italic text-[15px] text-coral mb-[22px] font-serif"
        >
          {{ subtitleEn }}
        </p>
        <p
          v-if="body"
          :class="accentBody
            ? 'italic font-serif text-coral text-[17px] sm:text-lg leading-[1.45] mt-2.5 mb-4 max-w-[840px]'
            : 'text-lg leading-[1.6] text-ink-soft mt-3 mb-5 max-w-[640px] font-light'"
        >
          {{ body }}
        </p>
        <div v-if="primaryCta || secondaryCta" class="flex gap-3 sm:gap-4 flex-col sm:flex-row sm:flex-wrap">
          <NuxtLink v-if="primaryCta" :to="primaryCta.to" class="btn text-center">{{ primaryCta.label }}</NuxtLink>
          <NuxtLink v-if="secondaryCta" :to="secondaryCta.to" class="btn btn-outline text-center">{{ secondaryCta.label }}</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CtaLink {
  label: string
  to: string
}

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    titleScript?: string
    subtitleEn?: string
    body?: string
    accentBody?: boolean
    image?: string
    variant?: 'large' | 'medium' | 'slim'
    primaryCta?: CtaLink
    secondaryCta?: CtaLink
  }>(),
  {
    variant: 'medium',
  },
)

const bgStyle = computed(() => {
  if (!props.image) return {}
  return {
    backgroundImage: `linear-gradient(to bottom, rgba(251, 249, 245, 0.25) 0%, rgba(251, 249, 245, 0.78) 100%), url('${props.image}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})
</script>

<style scoped>
/* Mobile-first: Basiswerte = iPhone; via min-width hochskaliert.
   Ab lg (1024px) entsprechen die Werte exakt dem bisherigen Desktop-Stand. */
.hero {
  background-color: var(--off);
}
.hero-inner {
  padding-top: 34px;
  padding-bottom: 34px;
}
.hero-large {
  min-height: 400px;
}
.hero-medium {
  min-height: 300px;
}
.hero-slim {
  min-height: 0;
  position: relative;
}
.hero-slim::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--grad-rainbow);
  opacity: 0.55;
}
.hero-slim .hero-inner {
  padding-top: 10px;
  padding-bottom: 8px;
}
.hero-title {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 34px;
  line-height: 1.05;
  margin-bottom: 4px;
}
.hero-title .script {
  font-size: 46px;
  font-weight: 400;
}
.hero-slim .hero-title {
  font-size: 28px;
}
.hero-slim .hero-title .script {
  font-size: 42px;
}
.hero-slim .hero-en {
  font-size: 15px;
  line-height: 1.5;
  max-width: 720px;
}

/* md ≥ 768px (Tablet) */
@media (min-width: 768px) {
  .hero-inner {
    padding-top: 56px;
    padding-bottom: 56px;
  }
  .hero-large { min-height: 500px; }
  .hero-medium { min-height: 340px; }
  .hero-title { font-size: 46px; }
  .hero-title .script { font-size: 64px; }
  .hero-slim .hero-title { font-size: 35px; white-space: nowrap; }
  .hero-slim .hero-title .script { font-size: 54px; }
  .hero-slim .hero-en { font-size: 17px; }
}

/* lg ≥ 1024px (Desktop — unverändert zum bisherigen Stand) */
@media (min-width: 1024px) {
  .hero-large { min-height: 560px; }
  .hero-medium { min-height: 380px; }
  .hero-title { font-size: 60px; }
  .hero-title .script { font-size: 82px; }
  .hero-slim .hero-title { font-size: 42px; }
  .hero-slim .hero-title .script { font-size: 64px; }
  .hero-slim .hero-inner {
    padding-top: 14px;
    padding-bottom: 10px;
  }
}
</style>
