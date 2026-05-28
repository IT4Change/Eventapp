<template>
  <div>
    <HeroSection
      :eyebrow="t.postEvent.hero.eyebrow"
      :title="t.postEvent.hero.title"
      :title-script="t.postEvent.hero.titleScript"
      :subtitle-en="t.postEvent.hero.subtitleEn"
      :body="t.postEvent.hero.body"
      image="/img/brand/08_drums_instruments.png"
    />

    <LoginForm />

    <RichTextSection
      :eyebrow="t.postEvent.explainer.eyebrow"
      :title="t.postEvent.explainer.title"
      :title-script="t.postEvent.explainer.titleScript"
      :paragraphs="t.postEvent.explainer.paragraphs"
      :quote="t.postEvent.explainer.note"
      centered
    />
  </div>
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.nav.postEvent}`,
  meta: [{ name: 'description', content: t.postEvent.hero.body }],
})
</script>
