<template>
  <section id="contact" class="newsletter text-center py-[100px]">
    <div class="container-w">
      <h2 class="text-white font-extralight" style="font-family: 'Helvetica Neue', sans-serif; font-size: 42px; margin-bottom: 8px;">
        Bleib in <span class="script" style="font-size: 52px; font-weight: 400;">Verbindung</span>
      </h2>
      <p class="mb-[34px] max-w-[540px] mx-auto font-light" style="color: rgba(255,255,255,0.92);">
        Erhalte einmal im Monat eine kurze Nachricht über neue Events, kleine Schreibstücke und
        Vollmond-Erinnerungen. Keine Werbung. Versprochen.
      </p>
      <form class="flex gap-3 max-w-[480px] mx-auto flex-wrap justify-center" @submit.prevent="onSubmit">
        <input
          v-model="email"
          type="email"
          placeholder="deine@email.de"
          class="newsletter-input flex-1 min-w-[240px] px-[22px] py-[15px] text-ink text-sm rounded-full"
        />
        <button type="submit" class="btn newsletter-btn">Anmelden</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref('')
function onSubmit() {
  console.log('Newsletter signup:', email.value)
  email.value = ''
}
</script>

<style scoped>
.newsletter {
  background-image:
    linear-gradient(135deg, rgba(232, 122, 93, 0.92), rgba(107, 168, 216, 0.92)),
    url('/img/brand/03_pattern_tile.png');
  background-size: 320px;
  color: #fff;
}
.newsletter-input {
  border: none;
  background: rgba(255, 255, 255, 0.95);
  font-family: inherit;
}
.newsletter-input::placeholder {
  color: var(--ink-soft);
}
.newsletter-btn {
  background: #fff;
  color: var(--coral);
}
.newsletter-btn:hover {
  background: var(--ink);
  color: #fff;
}
</style>
