<template>
  <header
    class="hero relative flex items-center overflow-hidden"
    :class="`hero-${variant}`"
    :style="bgStyle"
  >
    <div class="container-w">
      <div class="relative z-10 py-20 max-w-[720px]">
        <div
          v-if="eyebrow"
          class="hero-eyebrow grad-text text-[13px] tracking-[5px] uppercase mb-[22px] font-medium inline-block"
        >
          {{ eyebrow }}
        </div>
        <h1 class="hero-title text-ink font-extralight">
          {{ title }}<br v-if="titleScript" />
          <span v-if="titleScript" class="script grad-text">{{ titleScript }}</span>
        </h1>
        <p
          v-if="subtitleEn"
          class="hero-en italic text-[15px] text-coral mb-[22px] font-serif"
        >
          {{ subtitleEn }}
        </p>
        <p
          v-if="body"
          class="text-lg leading-[1.8] text-ink-soft my-[26px] mb-9 max-w-[560px] font-light"
        >
          {{ body }}
        </p>
        <div v-if="primaryCta || secondaryCta" class="flex gap-4 flex-wrap">
          <NuxtLink v-if="primaryCta" :to="primaryCta.to" class="btn">{{ primaryCta.label }}</NuxtLink>
          <NuxtLink v-if="secondaryCta" :to="secondaryCta.to" class="btn btn-outline">{{ secondaryCta.label }}</NuxtLink>
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
    title: string
    titleScript?: string
    subtitleEn?: string
    body?: string
    image?: string
    variant?: 'large' | 'medium'
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
.hero {
  background-color: var(--off);
}
.hero-large {
  min-height: 720px;
}
.hero-medium {
  min-height: 480px;
}
.hero-title {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 60px;
  line-height: 1.1;
  margin-bottom: 6px;
}
.hero-title .script {
  font-size: 82px;
  font-weight: 400;
}
@media (max-width: 900px) {
  .hero-large { min-height: 560px; }
  .hero-medium { min-height: 380px; }
  .hero-title { font-size: 42px; }
  .hero-title .script { font-size: 58px; }
}
</style>
