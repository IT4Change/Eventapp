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
</script>
