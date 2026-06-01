<template>
  <article class="legal-page bg-off py-14 sm:py-20 lg:py-[100px]">
    <div class="container-w max-w-[820px]">
      <h1 class="font-sans text-[30px] sm:text-[38px] md:text-[48px] text-ink mb-4 font-extralight">
        {{ title }}
      </h1>
      <p v-if="intro" class="text-ink-soft text-lg leading-[1.7] mb-10 font-light">
        {{ intro }}
      </p>

      <div v-for="section in sections" :key="section.heading" class="mb-8">
        <h2 class="font-serif text-[22px] text-ink mb-3 font-normal">{{ section.heading }}</h2>
        <p class="text-ink-soft leading-[1.8] whitespace-pre-line font-light">
          {{ section.body }}
        </p>
      </div>

      <p
        v-if="note"
        class="text-xs text-ink-soft/70 italic mt-12 pt-6 border-t border-ink/10"
      >
        {{ note }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Section {
  heading: string
  body: string
}

defineProps<{
  title: string
  intro?: string
  sections: Section[]
  note?: string
}>()
</script>
