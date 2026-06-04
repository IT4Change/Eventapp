<template>
  <article class="legal-page bg-off py-14 sm:py-20 lg:py-[100px]">
    <div class="container-w max-w-[820px]">
      <h1 class="font-sans text-[30px] sm:text-[38px] md:text-[48px] text-ink mb-4 font-extralight">
        {{ title }}
      </h1>
      <p v-if="intro" class="text-ink-soft text-lg leading-[1.7] mb-10 font-light">
        {{ intro }}
      </p>

      <div v-for="section in sections" :key="section.heading" class="mb-9">
        <h2 class="font-serif text-[22px] md:text-[24px] text-ink mb-3 font-normal">
          {{ section.heading }}
        </h2>
        <template v-for="(block, i) in section.blocks" :key="i">
          <h3
            v-if="block.sub"
            class="font-sans text-[16px] text-ink mb-2 mt-5 font-semibold"
          >
            {{ block.sub }}
          </h3>
          <ul v-else-if="block.list" class="mb-4 space-y-1.5">
            <li
              v-for="(item, j) in block.list"
              :key="j"
              class="flex gap-2.5 text-ink-soft leading-[1.7] font-light"
            >
              <span class="text-coral font-medium select-none">·</span>
              <span>{{ item }}</span>
            </li>
          </ul>
          <p
            v-else-if="block.p"
            class="text-ink-soft leading-[1.8] mb-4 whitespace-pre-line font-light"
          >
            {{ block.p }}
          </p>
        </template>
      </div>

      <p
        v-if="note"
        class="text-xs text-ink-soft/70 italic mt-12 pt-6 border-t border-ink/10"
      >
        {{ note }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Block {
  p?: string
  sub?: string
  list?: string[]
}
interface Section {
  heading: string
  blocks: Block[]
}

defineProps<{
  title: string
  intro?: string
  sections: Section[]
  note?: string
}>()
</script>
