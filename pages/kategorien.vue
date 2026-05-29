<template>
  <div>
    <HeroSection
      :eyebrow="t.categories.hero.eyebrow"
      :title="t.categories.hero.title"
      :title-script="t.categories.hero.titleScript"
      :subtitle-en="t.categories.hero.subtitleEn"
      :body="t.categories.hero.body"
      variant="slim"
    />

    <section class="bg-off py-[100px]">
      <div class="container-w">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CategoryCard v-for="cat in categories" :key="cat.key" :category="cat" />
        </div>
      </div>
    </section>

    <section class="bg-mist py-[80px] text-center">
      <div class="container-w max-w-[680px]">
        <h2 class="font-sans text-[36px] md:text-[40px] text-ink mb-4 font-extralight">
          {{ t.categories.closing.title }}
        </h2>
        <p class="text-ink-soft text-lg leading-[1.7] mb-8 font-light">
          {{ t.categories.closing.body }}
        </p>
        <NuxtLink to="/" class="btn">{{ t.categories.closing.cta }}</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { categories } from '~/data/categories'

const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.nav.categories}`,
  meta: [{ name: 'description', content: t.categories.hero.body }],
})
</script>
