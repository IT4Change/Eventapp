<template>
  <LegalPage
    :title="t.datenschutz.title"
    :intro="t.datenschutz.intro"
    :sections="t.datenschutz.sections"
    :note="t.datenschutz.note"
  />
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.datenschutz.title}`,
})
</script>
