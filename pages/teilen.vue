<template>
  <div class="bg-off">
    <div class="container-w py-7 sm:py-10">
      <div class="max-w-[920px]">
        <!-- Variante 1: Veranstaltung per E-Mail teilen -->
        <section>
          <p class="teil-eyebrow">{{ t.postEvent.email.eyebrow }}</p>
          <h2 class="teil-title">
            {{ t.postEvent.email.title }}
            <span class="script grad-text">{{ t.postEvent.email.titleScript }}</span>
          </h2>
          <p v-for="(p, i) in t.postEvent.email.paragraphs" :key="i" class="teil-accent">{{ p }}</p>
          <a :href="t.postEvent.email.cta.to" class="btn btn-mail teil-mail">{{ t.postEvent.email.cta.label }}</a>
        </section>

        <!-- Variante 2: Login / eigenes Konto -->
        <section class="variante2">
          <p class="teil-eyebrow">{{ t.postEvent.login.eyebrow }}</p>
          <h2 class="teil-title">
            {{ t.postEvent.login.title }}
            <span class="script grad-text">{{ t.postEvent.login.titleScript }}</span>
          </h2>
          <p v-for="(p, i) in t.postEvent.login.paragraphs" :key="i" class="teil-accent">{{ p }}</p>
          <LoginForm class="teil-form" />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const t = useContent()

useHead({
  title: `${t.brand.name} · Events teilen`,
  meta: [{ name: 'description', content: t.postEvent.hero.body }],
})
</script>

<style scoped>
.teil-eyebrow {
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--ink-soft);
  margin-bottom: 8px;
  display: inline-block;
}
.teil-title {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 200;
  color: var(--ink);
  font-size: 27px;
  line-height: 1.12;
  margin-bottom: 12px;
}
.teil-title .script {
  font-weight: 400;
  font-size: 1.18em;
}
.teil-accent {
  font-style: italic;
  font-family: Georgia, serif;
  color: var(--coral);
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 7px;
  max-width: 820px;
}
.teil-mail {
  margin-top: 14px;
}
.variante2 {
  margin-top: 34px;
  padding-top: 28px;
  border-top: 1px solid rgba(46, 90, 87, 0.12);
}
.teil-form {
  margin-top: 20px;
}
@media (min-width: 640px) {
  .teil-title { font-size: 36px; }
  .teil-accent { font-size: 16px; }
}
</style>
