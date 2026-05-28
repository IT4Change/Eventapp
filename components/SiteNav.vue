<template>
  <nav class="sticky top-0 z-50 nav-bg backdrop-blur-md border-b border-ink/10">
    <div class="flex items-center justify-between px-8 py-[22px] max-w-container mx-auto">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="Soul & Bliss">
        <BrandWordmark size="sm" />
      </NuxtLink>

      <ul class="hidden lg:flex gap-[28px] list-none items-center">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="nav-link text-ink no-underline text-[12px] tracking-[1.5px] uppercase font-normal transition-colors duration-200 hover:text-coral"
            active-class="nav-link-active"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/newsletter" class="btn nav-newsletter">
            {{ t.nav.newsletter }}
          </NuxtLink>
        </li>
        <li class="text-xs text-ink-soft tracking-[1px] border-l border-ink/20 pl-[14px] ml-1">
          <button class="lang-btn" aria-label="Sprache wechseln" @click="onLangClick">
            <span class="text-coral font-medium">{{ t.nav.language.de }}</span>
            <span class="mx-1">·</span>
            <span>{{ t.nav.language.en }}</span>
          </button>
        </li>
      </ul>

      <button
        class="lg:hidden burger"
        aria-label="Menü öffnen"
        @click="mobileOpen = !mobileOpen"
      >
        <span :class="{ open: mobileOpen }" />
        <span :class="{ open: mobileOpen }" />
        <span :class="{ open: mobileOpen }" />
      </button>
    </div>

    <div v-if="mobileOpen" class="lg:hidden mobile-menu">
      <ul class="flex flex-col gap-1 px-8 py-5 list-none">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block py-3 text-ink text-sm tracking-[1.5px] uppercase no-underline border-b border-ink/10"
            active-class="text-coral"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
        <li class="pt-4">
          <NuxtLink to="/newsletter" class="btn block text-center" @click="mobileOpen = false">
            {{ t.nav.newsletter }}
          </NuxtLink>
        </li>
        <li class="text-xs text-ink-soft tracking-[1px] pt-4 text-center">
          <span class="text-coral font-medium">{{ t.nav.language.de }}</span>
          <span class="mx-1">·</span>
          <span>{{ t.nav.language.en }}</span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
const t = useContent()
const mobileOpen = ref(false)

const links = [
  { label: t.nav.events, to: '/' },
  { label: t.nav.vision, to: '/vision' },
  { label: t.nav.categories, to: '/kategorien' },
  { label: t.nav.postEvent, to: '/events-posten' },
  { label: t.nav.contact, to: '/kontakt' },
]

function onLangClick() {
  console.log('Sprachumschaltung folgt — English version coming soon.')
}

const route = useRoute()
watch(() => route.path, () => { mobileOpen.value = false })
</script>

<style scoped>
.nav-bg {
  background: rgba(251, 249, 245, 0.92);
}
.nav-link-active {
  color: var(--coral);
  position: relative;
}
.nav-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  height: 2px;
  background: var(--grad-warm);
  border-radius: 2px;
}
.nav-newsletter {
  padding: 9px 20px !important;
  font-size: 11px !important;
}
.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  color: var(--ink-soft);
  padding: 0;
}
.burger {
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 28px;
  position: relative;
  padding: 0;
}
.burger span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--ink);
  margin: 6px 0;
  transition: transform 0.25s, opacity 0.25s;
  transform-origin: center;
}
.burger span.open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.burger span.open:nth-child(2) {
  opacity: 0;
}
.burger span.open:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
.mobile-menu {
  background: rgba(251, 249, 245, 0.98);
  border-top: 1px solid rgba(46, 90, 87, 0.1);
}
</style>
