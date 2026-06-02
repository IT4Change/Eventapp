<template>
  <span class="brand-lockup" :class="[size, { 'has-tagline': withTagline }]">
    <span class="brand-wordmark">{{ t.brand.name }}</span>
    <span v-if="withTagline" class="brand-tagline">
      <span
        v-for="(line, i) in t.brand.taglineLines"
        :key="i"
        class="brand-tagline-line"
      >{{ line }}</span>
    </span>
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
  /* zweizeilig, linksbündig unter der Wortmarke */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: var(--ink-soft);
  text-transform: uppercase;
  font-weight: 500;
  line-height: 1.1;
}
.brand-tagline-line {
  display: block;
  text-align: left;
  white-space: nowrap;
  letter-spacing: 1px;
}
/* erste Zeile ("Bewusste Veranstaltungen") größer — füllt die Logo-Breite, linksbündig */
.brand-tagline-line:first-child {
  font-size: 1.42em;
  letter-spacing: 1.5px;
}
/* zweite Zeile wird exakt auf die Breite der ersten Zeile gestreckt (Blocksatz) —
   da sie viele Wörter/Trennpunkte hat, verteilt sich der Rest gleichmäßig */
.brand-tagline-line:last-child {
  align-self: stretch;
  white-space: normal;
  text-align: justify;
  text-align-last: justify;
}

.brand-lockup.sm .brand-wordmark { font-size: 44px; }
/* md (Nav-Logo): mobil kleiner, ab lg unverändert bei 78px */
.brand-lockup.md .brand-wordmark { font-size: 52px; }
.brand-lockup.lg .brand-wordmark { font-size: 92px; }
.brand-lockup.xl .brand-wordmark { font-size: 116px; }

.brand-lockup.sm .brand-tagline { font-size: 10px; }
.brand-lockup.md .brand-tagline { font-size: 12px; }
.brand-lockup.lg .brand-tagline { font-size: 14px; }
.brand-lockup.xl .brand-tagline { font-size: 16px; }

/* Nav-Logo (md): Zeile 1 = Logo-Breite; Zeile 2 (längerer Text) kleiner = gleiche Breite */
.brand-lockup.md .brand-tagline-line:first-child { font-size: 17.5px; }
.brand-lockup.md .brand-tagline-line:last-child  { font-size: 12.5px; letter-spacing: 1px; }

@media (min-width: 640px) {
  .brand-lockup.md .brand-wordmark { font-size: 64px; }
  .brand-lockup.md .brand-tagline-line:first-child { font-size: 19px; }
  .brand-lockup.md .brand-tagline-line:last-child  { font-size: 13.5px; }
}
@media (min-width: 1024px) {
  .brand-lockup.md .brand-wordmark { font-size: 78px; }
}

</style>
