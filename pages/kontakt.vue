<template>
  <div>
    <HeroSection
      :eyebrow="t.contact.hero.eyebrow"
      :title="t.contact.hero.title"
      :title-script="t.contact.hero.titleScript"
      :subtitle-en="t.contact.hero.subtitleEn"
      :body="t.contact.hero.body"
      image="/img/brand/07_watercolor_splash.png"
    />

    <section class="bg-off py-16 sm:py-24 lg:py-[100px]">
      <div class="container-w max-w-[820px]">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="block in t.contact.blocks" :key="block.title" class="contact-block">
            <h3 class="font-serif text-[22px] text-ink mb-3 font-normal">{{ block.title }}</h3>
            <p class="text-[15px] text-ink-soft leading-[1.7] font-light">
              {{ block.body }}<a
                v-if="'link' in block && block.link"
                :href="block.link.href"
                class="contact-link"
              >{{ block.link.label }}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.nav.contact}`,
  meta: [{ name: 'description', content: t.contact.hero.body }],
})
</script>

<style scoped>
.contact-block {
  background: #fff;
  padding: 32px 28px;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(46, 90, 87, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}
.contact-block:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(46, 90, 87, 0.12);
}
.contact-link {
  color: var(--coral);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1.5px solid var(--coral);
  padding-bottom: 1px;
}
.contact-link:hover {
  color: var(--ink);
  border-color: var(--ink);
}
</style>
