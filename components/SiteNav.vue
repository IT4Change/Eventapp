<template>
  <nav class="sticky top-0 z-50 bg-sand/95 backdrop-blur border-b border-cacao/15">
    <div class="flex items-center justify-between px-8 py-4 max-w-container mx-auto">
      <a href="#" class="flex items-center gap-3">
        <img src="/img/logos/01_logo_primary.png" alt="Soul² Logo" class="w-11 h-11" />
        <BrandWordmark size="md" />
      </a>

      <ul class="hidden md:flex gap-9 list-none items-center">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="text-cacao no-underline text-sm tracking-wider uppercase font-medium transition-colors duration-200 hover:text-rust"
          >
            {{ link.label }}
          </a>
        </li>
        <li class="text-xs text-cacao tracking-wider border-l border-cacao/30 pl-4">
          <span class="text-rust font-semibold">DE</span> ·
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
