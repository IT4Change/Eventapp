<template>
  <section class="quote-band text-white text-center py-16 sm:py-24 lg:py-[110px] relative">
    <div class="container-w">
      <blockquote
        class="font-serif italic text-[28px] md:text-[32px] leading-[1.5] max-w-[820px] mx-auto mb-[18px] text-white font-normal whitespace-pre-line"
      >
        {{ text }}
      </blockquote>
      <cite
        class="text-[13px] tracking-[3px] uppercase not-italic"
        style="color: rgba(255,255,255,0.85);"
      >
        {{ author }}
      </cite>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  author: string
}>()
</script>

<style scoped>
.quote-band {
  background: linear-gradient(120deg, #6B3410 0%, #C05020 100%);
}
</style>
