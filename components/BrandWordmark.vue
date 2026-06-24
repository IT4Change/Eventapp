<template>
  <span class="brand-row" :class="size">
    <img
      v-if="withIcon"
      class="brand-icon"
      src="/img/logos/icon-logo.png"
      alt=""
    />
    <span class="brand-lockup" :class="[size, { 'has-tagline': withTagline }]">
      <span class="brand-wordmark"><template v-if="ampParts.length === 2">{{ ampParts[0] }}<span class="brand-amp">&amp;</span>{{ ampParts[1] }}</template><template v-else>{{ brandName }}</template></span>
      <span v-if="withTagline" class="brand-tagline">
        <span
          v-for="(line, i) in taglineLines"
          :key="i"
          class="brand-tagline-line"
        >{{ line }}</span>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl'
    withTagline?: boolean
    withIcon?: boolean
  }>(),
  {
    size: 'md',
    withTagline: false,
    withIcon: false,
  },
)
const { t, tm, rt, locale } = useI18n()
const taglineLines = computed(() => {
  void locale.value
  return (tm('brand.taglineLines') as unknown[]).map((x) => rt(x as never))
})
const brandName = computed(() => t('brand.name'))
// "Soul & Bliss" → ["Soul", "Bliss"] (getrimmt), das "&" bekommt eigene Farbe
// + kontrolliert engeren Abstand (siehe .brand-amp margin)
const ampParts = computed(() => brandName.value.split('&').map((s) => s.trim()))
</script>

<style scoped>
/* Reihe: Icon links, daneben das Wortmarken-Lockup (Wortmarke + Tagline).
   Icon-Höhe ≈ Lockup-Höhe (Oberkante Wortmarke bis Unterkante Tagline),
   vertikal zentriert → optisch oben/unten bündig mit dem Textblock. */
.brand-row {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
}
.brand-row.md {
  gap: clamp(7px, 1.8vw, 11px);
}
.brand-icon {
  flex: none;
  display: block;
  width: auto;
  /* native Proportion des zugeschnittenen Logos (910×982) */
  aspect-ratio: 910 / 982;
  object-fit: contain;
}
.brand-row.md .brand-icon {
  height: clamp(52px, 16vw, 74px);
}

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
  /* Terrakotta, minimal dunkler als die Eyebrow. */
  color: #AC4824;
  -webkit-text-fill-color: #AC4824;
  letter-spacing: 0.012em;
  padding-right: 0.16em;
  display: inline-block;
  white-space: nowrap;
}
/* "&" mit kräftigem Sonnen-Verlauf dunkel → hell (nur das &).
   inline-block + großzügiges Padding (auch vertikal) erweitert die background-clip-Malfläche,
   damit der kursive Glyph oben/unten/seitlich nicht beschnitten wird; negatives Margin
   neutralisiert das Padding für die Zeilenhöhe (Tagline-Ausrichtung bleibt). */
.brand-amp {
  display: inline-block;
  margin: -0.3em 0.03em;
  padding: 0.3em 0.16em;
  /* helles Ende als sichtbares Gold (nicht fast-Creme), damit die obere rechte
     Spitze nicht im hellen Hintergrund verblasst/„abgeschnitten" wirkt */
  background: linear-gradient(135deg, #A8500D 0%, #ED8E22 40%, #F3C95E 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
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
/* md (Nav-Logo): skaliert auf schmalen Screens mit der Viewport-Breite herunter,
   damit der nowrap-Schriftzug die Body-Breite nicht sprengt (Mobile-Overflow-Schutz).
   Bei ~495px erreicht clamp die bisherigen 52px; ab 640/1024 greifen die festen Werte. */
.brand-lockup.md .brand-wordmark { font-size: clamp(26px, 8.6vw, 42px); }
.brand-lockup.lg .brand-wordmark { font-size: 92px; }
.brand-lockup.xl .brand-wordmark { font-size: 116px; }

.brand-lockup.sm .brand-tagline { font-size: 10px; }
.brand-lockup.md .brand-tagline { font-size: 12px; }
.brand-lockup.lg .brand-tagline { font-size: 14px; }
.brand-lockup.xl .brand-tagline { font-size: 16px; }

/* Nav-Logo (md): Zeile 1 = Logo-Breite; Zeile 2 (längerer Text) kleiner = gleiche Breite.
   Zeile 1 ist nowrap → ebenfalls per clamp gegen Mobile-Overflow geschützt. */
.brand-lockup.md .brand-tagline-line:first-child { font-size: clamp(10px, 3.2vw, 14.5px); }
.brand-lockup.md .brand-tagline-line:last-child  { font-size: clamp(7px, 2.3vw, 10.3px); letter-spacing: 1px; }

@media (min-width: 640px) {
  .brand-lockup.md .brand-wordmark { font-size: 52px; }
  .brand-lockup.md .brand-tagline-line:first-child { font-size: 15.5px; }
  .brand-lockup.md .brand-tagline-line:last-child  { font-size: 11px; }
  .brand-row.md { gap: 11px; }
  .brand-row.md .brand-icon { height: 86px; }
}
@media (min-width: 1024px) {
  .brand-lockup.md .brand-wordmark { font-size: 64px; }
  .brand-row.md { gap: 13px; }
  .brand-row.md .brand-icon { height: 98px; }
}

</style>
