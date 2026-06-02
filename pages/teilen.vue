<template>
  <div>
    <!-- Bereich 1: Veranstaltung per E-Mail teilen -->
    <RichTextSection
      :eyebrow="t.postEvent.email.eyebrow"
      :title="t.postEvent.email.title"
      :title-script="t.postEvent.email.titleScript"
      :paragraphs="t.postEvent.email.paragraphs"
      :cta="t.postEvent.email.cta"
      centered
    />

    <!-- Bereich 2: Login / eigenes Konto -->
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · Events teilen`,
  meta: [{ name: 'description', content: t.postEvent.hero.body }],
})
</script>
