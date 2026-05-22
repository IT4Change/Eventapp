<template>
  <span class="brand-wordmark" :class="size">Soulevents</span>
</template>

<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' | 'xl' }>()
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
}

.brand-wordmark.sm { font-size: 36px; }
.brand-wordmark.md { font-size: 56px; }
.brand-wordmark.lg { font-size: 72px; }
.brand-wordmark.xl { font-size: 96px; }
.brand-wordmark { font-size: 56px; }
</style>
