<template>
  <section class="bg-off pt-3 sm:pt-4 lg:pt-5 pb-8 sm:pb-10 lg:pb-12">
    <div class="container-w">
      <!-- Banner on top: full-width image above the text, no offset frame -->
      <div v-if="image && imageSide === 'top'" class="max-w-[820px]">
        <div
          class="rich-banner max-w-[480px] mb-5 sm:mb-6"
          :style="{ backgroundImage: `url('${image}')` }"
        />
        <RichTextBody
          :eyebrow="eyebrow"
          :title="title"
          :title-script="titleScript"
          :en="en"
          :paragraphs="paragraphs"
          :quote="quote"
          :cta="cta"
          :accent-body="accentBody"
          :cta-class="ctaClass"
        />
      </div>
      <div
        v-else-if="image"
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
            :accent-body="accentBody"
            :cta-class="ctaClass"
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
          :accent-body="accentBody"
          :cta-class="ctaClass"
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
    imageSide?: 'left' | 'right' | 'top'
    centered?: boolean
    cta?: CtaLink
    accentBody?: boolean
    ctaClass?: string
  }>(),
  {
    imageSide: 'left',
    centered: false,
  },
)
</script>

<style scoped>
/* Banner-on-top: only the image, no offset frame; wider-than-tall format */
.rich-banner {
  width: 100%;
  aspect-ratio: 3 / 2;
  background-size: cover;
  background-position: center;
  border-radius: 24px;
}
@media (min-width: 768px) {
  .rich-banner { aspect-ratio: 16 / 9; }
}

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
