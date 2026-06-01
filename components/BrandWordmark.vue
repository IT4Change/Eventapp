<template>
  <span class="brand-lockup" :class="[size, { 'has-tagline': withTagline }]">
    <span class="brand-wordmark">{{ t.brand.name }}</span>
    <span v-if="withTagline" class="brand-tagline">{{ t.brand.tagline }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl'
    withTagline?: boolean
  }>(),
  {
    size: 'md',
    withTagline: false,
  },
)
const t = useContent()
</script>

<style scoped>
.brand-lockup {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
  gap: 6px;
}

.brand-lockup.has-tagline {
  gap: 4px;
}

.brand-wordmark {
  font-family: 'Brush Script MT', 'Lucida Handwriting', 'Snell Roundhand', cursive;
  font-style: italic;
  line-height: 1;
  font-weight: 400;
  background: linear-gradient(
    to right,
    #E87A5D 0%,
    #F4C95D 15%,
    #54C0B4 30%,
    #2E5A57 40%,
    #2E5A57 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  padding-right: 0.25em;
  display: inline-block;
  white-space: nowrap;
}

.brand-tagline {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
}

.brand-lockup.sm .brand-wordmark { font-size: 44px; }
/* md (Nav-Logo): mobil kleiner, ab lg unverändert bei 78px */
.brand-lockup.md .brand-wordmark { font-size: 52px; }
.brand-lockup.lg .brand-wordmark { font-size: 92px; }
.brand-lockup.xl .brand-wordmark { font-size: 116px; }

.brand-lockup.sm .brand-tagline { font-size: 9px; }
.brand-lockup.md .brand-tagline { font-size: 9px; letter-spacing: 1.8px; }
.brand-lockup.lg .brand-tagline { font-size: 12px; }
.brand-lockup.xl .brand-tagline { font-size: 14px; }

@media (min-width: 640px) {
  .brand-lockup.md .brand-wordmark { font-size: 64px; }
  .brand-lockup.md .brand-tagline { font-size: 10.5px; letter-spacing: 2.5px; }
}
@media (min-width: 1024px) {
  .brand-lockup.md .brand-wordmark { font-size: 78px; }
}

</style>
