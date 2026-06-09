<template>
  <LegalPage
    :title="$t('nutzungsbedingungen.title')"
    :sections="sections"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const sections = useLegalSections('nutzungsbedingungen')

useHead({
  title: `${t('brand.name')} · ${t('nutzungsbedingungen.title')}`,
})
</script>
