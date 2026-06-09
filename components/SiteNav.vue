<template>
  <nav class="sticky top-0 z-50 nav-bg backdrop-blur-md">
    <div class="flex items-center justify-between px-5 sm:px-6 lg:px-8 py-[18px] max-w-container mx-auto gap-8">
      <NuxtLinkLocale to="/" class="flex items-center gap-3 logo-link" aria-label="Soul & Bliss">
        <BrandWordmark size="md" with-tagline />
      </NuxtLinkLocale>

      <ul class="hidden lg:flex gap-[36px] list-none items-center flex-1 justify-end">
        <li v-for="link in links" :key="link.to">
          <NuxtLinkLocale
            :to="link.to"
            class="nav-link"
            active-class="nav-link-active"
          >
            {{ link.label }}
          </NuxtLinkLocale>
        </li>
      </ul>

      <div class="hidden lg:flex items-center gap-5 nav-actions">
        <NuxtLinkLocale to="/newsletter" class="btn nav-newsletter">
          {{ $t('nav.newsletter') }}
        </NuxtLinkLocale>
        <div class="lang-switch" :aria-label="$t('nav.a11y.langSwitch')">
          <NuxtLink :to="switchLocalePath('de')" class="lang-opt" :class="{ active: locale === 'de' }">
            {{ $t('nav.language.de') }}
          </NuxtLink>
          <span class="mx-1">·</span>
          <NuxtLink :to="switchLocalePath('en')" class="lang-opt" :class="{ active: locale === 'en' }">
            {{ $t('nav.language.en') }}
          </NuxtLink>
        </div>
      </div>

      <button
        class="lg:hidden burger"
        :aria-label="$t('nav.a11y.menu')"
        @click="mobileOpen = !mobileOpen"
      >
        <span :class="{ open: mobileOpen }" />
        <span :class="{ open: mobileOpen }" />
        <span :class="{ open: mobileOpen }" />
      </button>
    </div>

    <div v-if="mobileOpen" class="lg:hidden mobile-menu">
      <ul class="flex flex-col gap-1 px-5 sm:px-6 py-6 list-none">
        <li v-for="link in links" :key="link.to">
          <NuxtLinkLocale
            :to="link.to"
            class="block py-3.5 text-ink text-[15px] tracking-[2px] uppercase no-underline border-b border-ink/10"
            active-class="text-coral"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLinkLocale>
        </li>
        <li class="pt-5">
          <NuxtLinkLocale to="/newsletter" class="btn block text-center" @click="mobileOpen = false">
            {{ $t('nav.newsletter') }}
          </NuxtLinkLocale>
        </li>
        <li class="pt-4 text-center">
          <NuxtLink
            :to="switchLocalePath('de')"
            class="lang-opt text-[15px] tracking-[1px]"
            :class="{ active: locale === 'de' }"
            @click="mobileOpen = false"
          >{{ $t('nav.language.de') }}</NuxtLink>
          <span class="mx-1 text-ink-soft">·</span>
          <NuxtLink
            :to="switchLocalePath('en')"
            class="lang-opt text-[15px] tracking-[1px]"
            :class="{ active: locale === 'en' }"
            @click="mobileOpen = false"
          >{{ $t('nav.language.en') }}</NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const mobileOpen = ref(false)

const links = computed(() => [
  { label: t('nav.events'), to: '/' },
  { label: t('nav.vision'), to: '/vision' },
  { label: t('nav.categories'), to: '/kategorien' },
  { label: t('nav.postEvent'), to: '/teilen' },
])

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

.lang-switch {
  display: inline-flex;
  align-items: center;
  font-size: 15px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--ink);
}
.lang-opt {
  color: var(--ink);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 2px;
  transition: color 0.2s;
}
.lang-opt:hover {
  color: var(--coral);
}
.lang-opt.active {
  color: var(--coral);
  font-weight: 600;
}

.burger {
  background: none;
  border: none;
  cursor: pointer;
  width: 44px;
  height: 44px;
  position: relative;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.burger span {
  display: block;
  height: 2px;
  width: 26px;
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
