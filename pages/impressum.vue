<template>
  <LegalPage
    :title="$t('impressum.title')"
    :intro="$t('impressum.intro')"
    :sections="sections"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const sections = useLegalSections('impressum')

useHead({
  title: `${t('brand.name')} · ${t('impressum.title')}`,
})
</script>
