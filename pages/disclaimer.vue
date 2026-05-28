<template>
  <LegalPage
    :title="t.disclaimer.title"
    :intro="t.disclaimer.intro"
    :sections="t.disclaimer.sections"
    :note="t.disclaimer.note"
  />
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.disclaimer.title}`,
})
</script>
