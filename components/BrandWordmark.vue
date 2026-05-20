<template>
  <span class="brand-wordmark" :class="size">
    Soul<sup>2</sup>
  </span>
</template>

<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>()
</script>

<style scoped>
.brand-wordmark {
  font-family: 'Dancing Script', 'Brush Script MT', cursive;
  font-style: italic;
  color: var(--cacao);
  line-height: 1;
  font-weight: 500;
}
.brand-wordmark sup {
  font-family: 'Cormorant Garamond', Georgia, serif;
  color: var(--rust);
  font-style: normal;
  vertical-align: super;
  font-weight: 500;
}
.brand-wordmark.sm { font-size: 24px; }
.brand-wordmark.sm sup { font-size: 13px; }
.brand-wordmark.md { font-size: 32px; }
.brand-wordmark.md sup { font-size: 18px; }
.brand-wordmark.lg { font-size: 44px; }
.brand-wordmark.lg sup { font-size: 22px; }
.brand-wordmark { font-size: 32px; }
.brand-wordmark sup { font-size: 18px; }
</style>
