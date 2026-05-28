<template>
  <div>
    <HeroSection
      :eyebrow="t.home.hero.eyebrow"
      :title="t.home.hero.title"
      :title-script="t.home.hero.titleScript"
      :subtitle-en="t.home.hero.subtitleEn"
      :body="t.home.hero.body"
      image="/img/brand/01_hero_sunrise_dance.png"
      variant="large"
      :primary-cta="{ label: t.home.hero.primaryCta, to: '#week' }"
      :secondary-cta="{ label: t.home.hero.secondaryCta, to: '/vision' }"
    />

    <IntroBand
      :quote="t.home.intro.quote"
      :subtitle-en="t.home.intro.en"
    />

    <div id="week">
      <WeekView />
    </div>

    <section class="bg-mist py-[80px] text-center">
      <div class="container-w max-w-[680px]">
        <h2 class="font-sans text-[36px] md:text-[40px] text-ink mb-4 font-extralight">
          {{ t.home.closing.title }}
        </h2>
        <p class="text-ink-soft text-lg leading-[1.7] mb-8 font-light">
          {{ t.home.closing.body }}
        </p>
        <NuxtLink to="/events-posten" class="btn">{{ t.home.closing.cta }}</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.home.hero.eyebrow}`,
  meta: [{ name: 'description', content: t.home.hero.body }],
})
</script>
