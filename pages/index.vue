<template>
  <div>
    <HeroSection
      :eyebrow="t.home.hero.eyebrow"
      :title="t.home.hero.title"
      :title-script="t.home.hero.titleScript"
      :body="t.home.hero.body"
      accent-body
      variant="slim"
    />

    <EventList />

    <section class="bg-mist py-14 sm:py-20 lg:py-[80px] text-center">
      <div class="container-w max-w-[680px]">
        <h2 class="font-sans text-[28px] sm:text-[36px] md:text-[40px] text-ink mb-4 font-extralight">
          {{ t.home.closing.title }}
        </h2>
        <p class="text-ink-soft text-lg leading-[1.7] mb-8 font-light">
          {{ t.home.closing.body }}
        </p>
        <NuxtLink to="/teilen" class="btn">{{ t.home.closing.cta }}</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.nav.events}`,
  meta: [{ name: 'description', content: t.home.hero.body }],
})
</script>
