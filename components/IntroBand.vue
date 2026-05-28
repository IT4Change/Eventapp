<template>
  <section class="intro-band bg-white text-center relative overflow-hidden">
    <div class="container-w">
      <h2
        class="font-serif text-[32px] md:text-[34px] text-ink max-w-[820px] mx-auto mb-4 leading-[1.45] font-normal italic relative z-10"
      >
        {{ quote }}
      </h2>
      <p
        v-if="subtitleEn"
        class="max-w-[580px] mx-auto text-ink-soft text-base relative z-10 font-light"
      >
        {{ subtitleEn }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  quote: string
  subtitleEn?: string
}>()
</script>

<style scoped>
.intro-band {
  padding: 90px 0;
}
.intro-band::before,
.intro-band::after {
  content: '';
  position: absolute;
  width: 260px;
  height: 260px;
  background-image: url('/img/brand/02_mandala_motif.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.1;
}
.intro-band::before { top: -70px; left: -70px; }
.intro-band::after { bottom: -70px; right: -70px; }
</style>
