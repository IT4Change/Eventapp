<template>
  <footer class="bg-cacao-dark text-saffron-light pt-16 pb-8">
    <div class="container-w">
      <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
        <div>
          <div class="footer-name">Soul<sup>2</sup></div>
          <p class="text-sand/70 text-sm leading-[1.7] max-w-[320px]">
            Dance · Spirit · Nature. Wir gestalten Räume, in denen Menschen sich wieder begegnen
            können.
          </p>
        </div>

        <div v-for="col in columns" :key="col.title">
          <h4 class="text-xs tracking-[3px] uppercase text-saffron mb-4 font-medium">{{ col.title }}</h4>
          <ul class="list-none">
            <li v-for="item in col.items" :key="item.label" class="mb-2.5">
              <a
                :href="item.href"
                class="text-sand/75 no-underline text-sm transition-colors duration-200 hover:text-saffron"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-saffron/20 pt-6 flex justify-between text-xs text-sand/50 flex-wrap gap-4">
        <span>© 2026 Soul². Made with care in Berlin.</span>
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
      { label: 'hallo@soul-squared.com', href: 'mailto:hallo@soul-squared.com' },
      { label: 'Instagram', href: '#' },
      { label: 'Newsletter', href: '#' },
      { label: 'FAQ', href: '#' },
    ],
  },
]
</script>

<style scoped>
.footer-name {
  font-family: 'Dancing Script', 'Brush Script MT', cursive;
  font-style: italic;
  font-size: 44px;
  color: var(--saffron);
  line-height: 1;
  margin-bottom: 16px;
}
.footer-name sup {
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: var(--rust);
  font-size: 22px;
  font-style: normal;
}
</style>
