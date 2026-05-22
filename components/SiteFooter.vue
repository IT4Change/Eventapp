<template>
  <footer class="bg-ink text-white/85 pt-[70px] pb-8">
    <div class="container-w">
      <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
        <div>
          <div class="footer-name">Soulevents</div>
          <p class="text-white/65 text-sm leading-[1.7] max-w-[320px] font-light">
            Dance · Spirit · Nature. Wir gestalten Räume, in denen Menschen sich wieder begegnen
            können.
          </p>
        </div>

        <div v-for="col in columns" :key="col.title">
          <h4 class="text-xs tracking-[3px] uppercase text-gold mb-[18px] font-medium">{{ col.title }}</h4>
          <ul class="list-none">
            <li v-for="item in col.items" :key="item.label" class="mb-2.5">
              <a
                :href="item.href"
                class="text-white/70 no-underline text-sm transition-colors duration-200 hover:text-gold font-light"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-6 flex justify-between text-xs text-white/50 flex-wrap gap-4" style="border-top: 1px solid rgba(255,255,255,0.12);">
        <span>© 2026 Soulevents. Made with care in Berlin.</span>
        <span>
          <a href="#" class="text-inherit">Impressum</a> ·
          <a href="#" class="text-inherit">Datenschutz</a>
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const columns = [
  {
    title: 'Events',
    items: [
      { label: 'Ekstatischer Tanz', href: '#' },
      { label: 'Zeremonien', href: '#' },
      { label: 'Retreats', href: '#' },
      { label: 'Kalender', href: '#' },
    ],
  },
  {
    title: 'Über',
    items: [
      { label: 'Unsere Geschichte', href: '#' },
      { label: 'Team', href: '#' },
      { label: 'Werte', href: '#' },
      { label: 'Presse', href: '#' },
    ],
  },
  {
    title: 'Kontakt',
    items: [
      { label: 'hallo@soulevents.com', href: 'mailto:hallo@soulevents.com' },
      { label: 'Instagram', href: '#' },
      { label: 'Newsletter', href: '#' },
      { label: 'FAQ', href: '#' },
    ],
  },
]
</script>

<style scoped>
.footer-name {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Snell Roundhand', cursive;
  font-style: italic;
  font-size: 44px;
  color: #fff;
  line-height: 1;
  margin-bottom: 16px;
}
</style>
