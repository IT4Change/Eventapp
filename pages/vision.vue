<template>
  <div>
    <HeroSection
      :eyebrow="t.vision.hero.eyebrow"
      :title="t.vision.hero.title"
      :title-script="t.vision.hero.titleScript"
      :subtitle-en="t.vision.hero.subtitleEn"
      :body="t.vision.hero.body"
      variant="slim"
    />

    <RichTextSection
      :eyebrow="t.vision.about.eyebrow"
      :title="t.vision.about.title"
      :title-script="t.vision.about.titleScript"
      :en="t.vision.about.en"
      :paragraphs="t.vision.about.paragraphs"
      image="/img/brand/07_watercolor_splash.png"
      image-side="left"
    />

    <TriCardSection
      :eyebrow="t.vision.pillars.eyebrow"
      :title="t.vision.pillars.title"
      :title-script="t.vision.pillars.titleScript"
      :intro="t.vision.pillars.intro"
      :items="t.vision.pillars.items"
    />

    <section class="bg-off py-14 sm:py-20 lg:py-[80px] text-center">
      <div class="container-w">
        <div class="flex gap-4 flex-wrap justify-center">
          <NuxtLink to="/events-posten" class="btn">{{ t.cta.postEvent }}</NuxtLink>
          <NuxtLink to="/newsletter" class="btn btn-outline">{{ t.cta.subscribe }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.nav.vision}`,
  meta: [{ name: 'description', content: t.vision.hero.body }],
})
</script>
