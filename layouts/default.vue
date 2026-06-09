<template>
  <div class="min-h-screen flex flex-col">
    <SiteNav />
    <main class="flex-1">
      <slot />
    </main>
    <NewsletterSection v-if="route.path !== '/newsletter'" />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// SEO: <html lang>, hreflang-Alternates und canonical pro Locale
const head = useLocaleHead()
useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs?.lang },
  link: [...(head.value.link || [])],
  meta: [...(head.value.meta || [])],
}))
</script>
