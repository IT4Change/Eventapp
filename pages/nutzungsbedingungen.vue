<template>
  <LegalPage
    :title="t.nutzungsbedingungen.title"
    :intro="t.nutzungsbedingungen.intro"
    :sections="t.nutzungsbedingungen.sections"
    :note="t.nutzungsbedingungen.note"
  />
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · ${t.nutzungsbedingungen.title}`,
})
</script>
