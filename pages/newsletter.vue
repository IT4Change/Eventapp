<template>
  <div>
    <HeroSection
      :eyebrow="t.newsletter.hero.eyebrow"
      :title="t.newsletter.hero.title"
      :title-script="t.newsletter.hero.titleScript"
      :subtitle-en="t.newsletter.hero.subtitleEn"
      :body="t.newsletter.hero.body"
    />

    <NewsletterSection />

    <section class="bg-off py-[80px]">
      <div class="container-w max-w-[720px]">
        <h2 class="font-serif text-[28px] text-ink mb-6 font-normal text-center">
          {{ t.newsletter.expectations.title }}
        </h2>
        <ul class="expectations-list">
          <li v-for="(item, i) in t.newsletter.expectations.items" :key="i">
            <span class="expectation-marker">·</span>
            {{ item }}
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.nav.newsletter}`,
  meta: [{ name: 'description', content: t.newsletter.hero.body }],
})
</script>

<style scoped>
.expectations-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.expectations-list li {
  display: flex;
  gap: 14px;
  padding: 14px 20px;
  background: #fff;
  border-radius: 12px;
  color: var(--ink-soft);
  font-size: 15px;
  font-weight: 300;
  line-height: 1.6;
}
.expectation-marker {
  color: var(--coral);
  font-weight: 700;
  font-size: 22px;
  line-height: 1;
}
</style>
