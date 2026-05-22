<template>
  <nav class="sticky top-0 z-50 nav-bg backdrop-blur-md border-b border-ink/10">
    <div class="flex items-center justify-between px-8 py-[26px] max-w-container mx-auto">
      <a href="#" class="flex items-center gap-3">
        <BrandWordmark size="md" />
      </a>

      <ul class="hidden md:flex gap-[34px] list-none items-center">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="text-ink no-underline text-[13px] tracking-[1.5px] uppercase font-normal transition-colors duration-200 hover:text-coral"
          >
            {{ link.label }}
          </a>
        </li>
        <li class="text-xs text-ink-soft tracking-[1px] border-l border-ink/20 pl-[18px]">
          <span class="text-coral font-medium">DE</span> ·
          <span>EN</span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
const links = [
  { label: 'Events', href: '#events' },
  { label: 'Über uns', href: '#about' },
  { label: 'Werte', href: '#pillars' },
  { label: 'Kontakt', href: '#contact' },
]
</script>

<style scoped>
.nav-bg {
  background: rgba(251, 249, 245, 0.9);
}
</style>
