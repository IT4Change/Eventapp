<template>
  <header class="hero relative flex items-center overflow-hidden">
    <div class="container-w">
      <div class="relative z-10 py-20 max-w-[720px]">
        <div class="hero-eyebrow grad-text text-[13px] tracking-[5px] uppercase mb-[22px] font-medium inline-block">
          Dance · Spirit · Nature
        </div>
        <h1 class="hero-title text-ink font-extralight">
          Komm zurück zu<br />
          <span class="script grad-text">deiner Seele</span>
        </h1>
        <p class="hero-en italic text-[15px] text-coral mb-[22px] font-serif">— Come home to your soul —</p>
        <p class="text-lg leading-[1.8] text-ink-soft my-[26px] mb-9 max-w-[540px] font-light">
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
  min-height: 860px;
  background-image:
    linear-gradient(to bottom, rgba(251, 249, 245, 0.2) 0%, rgba(251, 249, 245, 0.75) 100%),
    url('/img/brand/01_hero_sunrise_dance.png');
  background-size: cover;
  background-position: center;
}
.hero-title {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 64px;
  line-height: 1.1;
  margin-bottom: 6px;
}
.hero-title .script {
  font-size: 88px;
  font-weight: 400;
}
@media (max-width: 900px) {
  .hero-title { font-size: 46px; }
  .hero-title .script { font-size: 64px; }
}
</style>
