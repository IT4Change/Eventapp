<template>
  <header class="hero relative flex items-center overflow-hidden">
    <div class="container-w">
      <div class="relative z-10 py-20 max-w-[720px]">
        <div class="text-[13px] tracking-[4px] uppercase text-rust mb-6 font-medium">
          Dance · Spirit · Nature
        </div>
        <h1 class="hero-title font-serif text-cacao mb-2 font-normal">
          Komm zurück zu<br />
          <span class="script">deiner Seele</span>
        </h1>
        <p class="italic text-[15px] text-rust/80 mb-6">— Come home to your soul —</p>
        <p class="text-lg leading-[1.7] text-cacao-dark my-6 mb-9 max-w-[540px]">
          Wir gestalten Räume, in denen Menschen tanzen, fühlen, schweigen und sich erinnern.
          Zeremonien, Rückzüge und Bewegung in der Natur — für deinen ganzen Menschen.
        </p>
        <div class="flex gap-4 flex-wrap">
          <a href="#events" class="btn">Events entdecken</a>
          <a href="#about" class="btn btn-outline">Unsere Geschichte</a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero {
  min-height: 720px;
  background-image:
    linear-gradient(to bottom, rgba(247, 239, 224, 0.3) 0%, rgba(247, 239, 224, 0.85) 100%),
    url('/img/brand/01_hero_sunrise_dance.png');
  background-size: cover;
  background-position: center;
}
.hero-title {
  font-size: 76px;
  line-height: 1.05;
}
.hero-title .script {
  font-size: 96px;
  color: var(--cacao);
}
@media (max-width: 900px) {
  .hero-title { font-size: 56px; }
  .hero-title .script { font-size: 70px; }
}
</style>
