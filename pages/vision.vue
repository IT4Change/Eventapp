<template>
  <div>
    <HeroSection
      :eyebrow="$t('vision.hero.eyebrow')"
      :title="$t('vision.hero.title')"
      :title-script="$t('vision.hero.titleScript')"
      :body="$t('vision.hero.body')"
      accent-body
      variant="slim"
    />

    <RichTextSection
      :eyebrow="$t('vision.about.eyebrow')"
      :title="$t('vision.about.title')"
      :title-script="$t('vision.about.titleScript')"
      :en="$t('vision.about.en')"
      :paragraphs="aboutParagraphs"
      image="/img/brand/kategorien/09_vision_scene.svg"
      image-side="top"
    />

    <TriCardSection
      :eyebrow="$t('vision.pillars.eyebrow')"
      :title="$t('vision.pillars.title')"
      :title-script="$t('vision.pillars.titleScript')"
      :intro="$t('vision.pillars.intro')"
      :items="pillars"
      image="/img/brand/kategorien/10_vision_stargazers.svg"
    />

    <section class="bg-off py-14 sm:py-20 lg:py-[80px] text-center">
      <div class="container-w max-w-[760px]">
        <p class="italic font-serif text-coral text-[19px] sm:text-[22px] leading-[1.5] mb-10">
          {{ $t('vision.quote') }}
        </p>
        <div class="flex gap-4 flex-wrap justify-center">
          <NuxtLinkLocale to="/teilen" class="btn">{{ $t('cta.postEvent') }}</NuxtLinkLocale>
          <NuxtLinkLocale to="/newsletter" class="btn btn-outline">{{ $t('cta.subscribe') }}</NuxtLinkLocale>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t, tm, rt, locale } = useI18n()

const aboutParagraphs = computed(() => {
  void locale.value
  return (tm('vision.about.paragraphs') as unknown[]).map((x) => rt(x as never))
})

const pillars = computed(() => {
  void locale.value
  return (tm('vision.pillars.items') as any[]).map((item) => ({
    title: rt(item.title),
    en: rt(item.en),
    text: rt(item.text),
  }))
})

useHead({
  title: `${t('brand.name')} · ${t('nav.vision')}`,
  meta: [{ name: 'description', content: t('vision.hero.body') }],
})
</script>
