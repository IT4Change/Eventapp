<template>
  <nav class="sticky top-0 z-50 nav-bg backdrop-blur-md">
    <div class="flex items-center justify-between px-8 py-[18px] max-w-container mx-auto gap-8">
      <NuxtLink to="/" class="flex items-center gap-3 logo-link" aria-label="Soul & Bliss">
        <BrandWordmark size="md" with-tagline />
      </NuxtLink>

      <ul class="hidden lg:flex gap-[36px] list-none items-center flex-1 justify-end">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="nav-link"
            active-class="nav-link-active"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="hidden lg:flex items-center gap-5 nav-actions">
        <NuxtLink to="/newsletter" class="btn nav-newsletter">
          {{ t.nav.newsletter }}
        </NuxtLink>
        <button class="lang-btn" aria-label="Sprache wechseln" @click="onLangClick">
          <span class="text-coral font-medium">{{ t.nav.language.de }}</span>
          <span class="mx-1">·</span>
          <span>{{ t.nav.language.en }}</span>
        </button>
      </div>

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
      <ul class="flex flex-col gap-1 px-8 py-6 list-none">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block py-3.5 text-ink text-[15px] tracking-[2px] uppercase no-underline border-b border-ink/10"
            active-class="text-coral"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
        <li class="pt-5">
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
]

function onLangClick() {
  console.log('Sprachumschaltung folgt — English version coming soon.')
}

const route = useRoute()
watch(() => route.path, () => { mobileOpen.value = false })
</script>

<style scoped>
.nav-bg {
  background: rgba(251, 249, 245, 0.96);
  border-bottom: 1.5px solid rgba(46, 90, 87, 0.12);
  box-shadow: 0 4px 14px rgba(46, 90, 87, 0.04);
}

.logo-link {
  text-decoration: none;
}

.nav-link {
  color: var(--ink);
  text-decoration: none;
  font-size: 15px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  font-weight: 500;
  padding: 8px 2px;
  position: relative;
  transition: color 0.2s, transform 0.2s;
  display: inline-block;
}
.nav-link:hover {
  color: var(--coral);
  transform: translateY(-1px);
}
.nav-link-active {
  color: var(--coral);
  font-weight: 600;
}
.nav-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 3px;
  background: var(--grad-warm);
  border-radius: 3px;
}

.nav-actions {
  border-left: 1.5px solid rgba(46, 90, 87, 0.15);
  padding-left: 22px;
}

.nav-newsletter {
  padding: 10px 24px !important;
  font-size: 15px !important;
  letter-spacing: 1.4px !important;
}

.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  color: var(--ink);
  padding: 8px 2px;
  letter-spacing: 1.4px;
  font-weight: 500;
  text-transform: uppercase;
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
  box-shadow: 0 8px 24px rgba(46, 90, 87, 0.08);
}
</style>
