<template>
  <div :class="{ 'text-center': centered }">
    <div
      v-if="eyebrow"
      class="section-eyebrow grad-text inline-block mb-2"
      :style="{ textAlign: centered ? 'center' : 'left' }"
    >
      {{ eyebrow }}
    </div>
    <h2
      v-if="title || titleScript"
      class="font-sans text-[28px] sm:text-[34px] md:text-[42px] text-ink mb-1 leading-[1.1] font-extralight"
      :class="{ 'text-center': centered }"
    >
      <template v-if="title">{{ title }} </template>
      <span v-if="titleScript" class="script grad-text text-[34px] sm:text-[44px] md:text-[54px]">
        {{ titleScript }}
      </span>
    </h2>
    <span
      v-if="en"
      class="italic text-coral text-base mb-3 block font-serif"
      :class="{ 'text-center': centered }"
    >
      {{ en }}
    </span>
    <p
      v-for="(p, i) in paragraphs"
      :key="i"
      :class="accentBody
        ? 'italic font-serif text-coral text-[17px] sm:text-lg leading-[1.45] mb-3'
        : 'text-base text-ink-soft mb-3 leading-[1.55] font-light'"
    >
      {{ p }}
    </p>
    <blockquote
      v-if="quote"
      class="font-serif italic text-xl text-ink pl-5 my-7 leading-[1.5]"
      style="border-left: 3px solid var(--gold);"
    >
      {{ quote }}
    </blockquote>
    <a v-if="cta && isExternal(cta.to)" :href="cta.to" class="btn" :class="ctaClass">{{ cta.label }}</a>
    <NuxtLink v-else-if="cta" :to="cta.to" class="btn" :class="ctaClass">{{ cta.label }}</NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface CtaLink {
  label: string
  to: string
}

withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    titleScript?: string
    en?: string
    paragraphs?: string[]
    quote?: string
    cta?: CtaLink
    centered?: boolean
    accentBody?: boolean
    ctaClass?: string
  }>(),
  { centered: false },
)

// mailto:, tel: und http(s) als externe Links als <a> rendern, interne Routen via NuxtLink
function isExternal(to: string) {
  return /^(mailto:|tel:|https?:)/.test(to)
}
</script>
