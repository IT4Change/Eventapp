<template>
  <span class="brand-wordmark" :class="size">{{ t.brand.name }}</span>
</template>

<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>()
const t = useContent()
</script>

<style scoped>
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

.brand-wordmark.sm { font-size: 32px; }
.brand-wordmark.md { font-size: 48px; }
.brand-wordmark.lg { font-size: 68px; }
.brand-wordmark.xl { font-size: 88px; }
.brand-wordmark { font-size: 48px; }
</style>
