<template>
  <LegalPage
    :title="t.impressum.title"
    :intro="t.impressum.intro"
    :sections="t.impressum.sections"
    :note="t.impressum.note"
  />
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.impressum.title}`,
})
</script>
