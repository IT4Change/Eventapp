<template>
  <footer class="bg-ink text-white/85 pt-[70px] pb-8">
    <div class="container-w">
      <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
        <div>
          <div class="footer-name">{{ t.brand.name }}</div>
          <p class="text-white/65 text-sm leading-[1.7] max-w-[320px] font-light">
            {{ t.footer.tagline }}
          </p>
        </div>

        <div v-for="col in t.footer.columns" :key="col.title">
          <h4 class="text-xs tracking-[3px] uppercase text-gold mb-[18px] font-medium">
            {{ col.title }}
          </h4>
          <ul class="list-none">
            <li v-for="item in col.items" :key="item.label" class="mb-2.5">
              <NuxtLink
                :to="item.href"
                class="text-white/70 no-underline text-sm transition-colors duration-200 hover:text-gold font-light"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="pt-6 flex justify-between text-xs text-white/50 flex-wrap gap-4"
        style="border-top: 1px solid rgba(255,255,255,0.12);"
      >
        <span>{{ t.footer.copyright }}</span>
        <span>{{ t.footer.language }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const t = useContent()
</script>

<style scoped>
.footer-name {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Snell Roundhand', cursive;
  font-style: italic;
  font-size: 40px;
  color: #fff;
  line-height: 1;
  margin-bottom: 16px;
}
</style>
