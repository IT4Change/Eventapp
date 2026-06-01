<template>
  <section class="bg-off py-16 sm:py-24 lg:py-[100px]">
    <div class="container-w">
      <div
        v-if="image"
        class="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 md:gap-20 items-center"
      >
        <div
          class="rich-image-wrap relative"
          :class="imageSide === 'left' ? 'md:order-1' : 'md:order-2'"
        >
          <div
            class="rich-image"
            :style="{ backgroundImage: `url('${image}')` }"
          />
        </div>
        <div :class="imageSide === 'left' ? 'md:order-2' : 'md:order-1'">
          <RichTextBody
            :eyebrow="eyebrow"
            :title="title"
            :title-script="titleScript"
            :en="en"
            :paragraphs="paragraphs"
            :quote="quote"
            :cta="cta"
          />
        </div>
      </div>
      <div v-else class="max-w-[820px] mx-auto">
        <RichTextBody
          :eyebrow="eyebrow"
          :title="title"
          :title-script="titleScript"
          :en="en"
          :paragraphs="paragraphs"
          :quote="quote"
          :cta="cta"
          :centered="centered"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface CtaLink {
  label: string
  to: string
}

withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    titleScript?: string
    en?: string
    paragraphs?: string[]
    quote?: string
    image?: string
    imageSide?: 'left' | 'right'
    centered?: boolean
    cta?: CtaLink
  }>(),
  {
    imageSide: 'left',
    centered: false,
  },
)
</script>

<style scoped>
.rich-image-wrap {
  position: relative;
}
.rich-image {
  background-size: cover;
  background-position: center;
  height: 240px;
  border-radius: 24px;
  position: relative;
  z-index: 1;
}
.rich-image-wrap::after {
  content: '';
  display: none;
  position: absolute;
  top: 22px;
  left: 22px;
  right: -22px;
  bottom: -22px;
  border: 2px solid var(--teal);
  border-radius: 24px;
  z-index: 0;
  opacity: 0.5;
}
/* sm ≥ 640px */
@media (min-width: 640px) {
  .rich-image { height: 320px; }
}
/* md ≥ 768px (Versatz-Rahmen erst ab hier, da Bild dann seitlich steht) */
@media (min-width: 768px) {
  .rich-image-wrap::after { display: block; }
}
/* lg ≥ 1024px (Desktop — unverändert) */
@media (min-width: 1024px) {
  .rich-image { height: 560px; }
}
</style>
