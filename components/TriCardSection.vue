<template>
  <section class="bg-off text-center py-16 sm:py-24 lg:py-[100px]">
    <div class="container-w">
      <div v-if="eyebrow" class="section-eyebrow grad-text inline-block">
        {{ eyebrow }}
      </div>
      <h2 class="section-title">
        <template v-if="title">{{ title }} </template>
        <span v-if="titleScript" class="script grad-text text-[38px] sm:text-[46px] lg:text-[58px]">
          {{ titleScript }}
        </span>
      </h2>
      <p v-if="intro" class="section-intro">{{ intro }}</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-10 lg:mt-14">
        <div v-for="item in items" :key="item.title" class="tri-card">
          <div class="tri-card-icon mx-auto mb-6">
            <img :src="item.img" :alt="item.title" :style="item.style" />
          </div>
          <h3 class="font-serif text-[22px] sm:text-[26px] text-ink mb-1 font-normal">{{ item.title }}</h3>
          <span v-if="item.en" class="italic text-coral text-[13px] mb-4 block font-serif">
            {{ item.en }}
          </span>
          <p class="text-[15px] text-ink-soft leading-[1.7] font-light">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Item {
  img: string
  title: string
  en?: string
  text: string
  style?: string
}

defineProps<{
  eyebrow?: string
  title?: string
  titleScript?: string
  intro?: string
  items: Item[]
}>()
</script>

<style scoped>
.tri-card {
  padding: 36px 24px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(46, 90, 87, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}
.tri-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 40px rgba(46, 90, 87, 0.12);
}
.tri-card-icon {
  width: 120px;
  height: 120px;
}
@media (min-width: 1024px) {
  .tri-card {
    padding: 44px 28px;
  }
  .tri-card-icon {
    width: 168px;
    height: 168px;
  }
}
.tri-card-icon img {
  width: 100%;
  height: 100%;
}
</style>
