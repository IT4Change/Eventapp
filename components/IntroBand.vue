<template>
  <section class="intro-band bg-cream text-center relative overflow-hidden">
    <div class="container-w">
      <h2 class="font-serif text-[36px] text-cacao max-w-[820px] mx-auto mb-4 leading-[1.4] font-normal italic relative z-10">
        „Es gibt einen Ort in dir, der weiß, wie es sich anfühlt, ganz zu sein.
        Wir helfen dir, dorthin zurückzukehren.“
      </h2>
      <p class="max-w-[580px] mx-auto text-cacao text-base relative z-10">
        — There is a place inside you that remembers wholeness. We help you find your way back. —
      </p>
    </div>
  </section>
</template>

<style scoped>
.intro-band {
  padding: 100px 0;
}
.intro-band::before,
.intro-band::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  background-image: url('/img/brand/02_mandala_motif.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.12;
}
.intro-band::before { top: -60px; left: -60px; }
.intro-band::after { bottom: -60px; right: -60px; }
</style>
