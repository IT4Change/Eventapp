<template>
  <LegalPage
    :title="$t('datenschutz.title')"
    :sections="sections"
    :note="$t('datenschutz.note')"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const sections = useLegalSections('datenschutz')

useHead({
  title: `${t('brand.name')} · ${t('datenschutz.title')}`,
})
</script>
