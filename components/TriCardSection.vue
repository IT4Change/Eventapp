<template>
  <section class="bg-off pt-2 sm:pt-3 lg:pt-4 pb-14 sm:pb-20 lg:pb-[80px]">
    <div class="container-w">
      <div
        v-if="image"
        class="tri-banner max-w-[480px] mb-5 sm:mb-6"
        :style="{ backgroundImage: `url('${image}')` }"
      />
      <div class="max-w-[820px]">
        <div
          v-if="eyebrow"
          class="text-[13px] tracking-[3px] lg:tracking-[5px] uppercase mb-2 font-medium grad-text inline-block"
        >
          {{ eyebrow }}
        </div>
        <h2 class="font-sans text-[28px] sm:text-[34px] md:text-[42px] text-ink mb-1 leading-[1.1] font-extralight">
          <template v-if="title">{{ title }} </template>
          <span v-if="titleScript" class="script grad-text text-[34px] sm:text-[44px] md:text-[54px]">
            {{ titleScript }}
          </span>
        </h2>
        <p v-if="intro" class="text-ink-soft text-[16px] lg:text-[17px] font-light leading-[1.5]">
          {{ intro }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8">
        <div v-for="item in items" :key="item.title" class="tri-card">
          <h3 class="font-serif text-[22px] sm:text-[26px] text-ink mb-1 font-normal">{{ item.title }}</h3>
          <span v-if="item.en" class="italic text-coral text-[13px] mb-2 block font-serif">
            {{ item.en }}
          </span>
          <p class="text-[15px] text-ink-soft leading-[1.5] font-light">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Item {
  title: string
  en?: string
  text: string
}

defineProps<{
  eyebrow?: string
  title?: string
  titleScript?: string
  intro?: string
  image?: string
  items: Item[]
}>()
</script>

<style scoped>
/* Banner above the section header: only the image, wider-than-tall format */
.tri-banner {
  width: 100%;
  aspect-ratio: 3 / 2;
  background-size: cover;
  background-position: center;
  border-radius: 24px;
}
@media (min-width: 768px) {
  .tri-banner { aspect-ratio: 16 / 9; }
}

.tri-card {
  padding: 24px 24px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(46, 90, 87, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}
.tri-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 40px rgba(46, 90, 87, 0.12);
}
@media (min-width: 1024px) {
  .tri-card {
    padding: 28px 28px;
  }
}
</style>
