<template>
  <section id="contact" class="newsletter text-center py-24">
    <div class="container-w">
      <h2 class="font-serif text-[40px] mb-2 text-saffron-light font-normal">
        Bleib in <span class="script text-saffron" style="font-size: 50px;">Verbindung</span>
      </h2>
      <p class="text-sand/90 mb-8 max-w-[540px] mx-auto">
        Erhalte einmal im Monat eine kurze Nachricht über neue Events, kleine Schreibstücke und
        Vollmond-Erinnerungen. Keine Werbung. Versprochen.
      </p>
      <form class="flex gap-3 max-w-[480px] mx-auto flex-wrap justify-center" @submit.prevent="onSubmit">
        <input
          v-model="email"
          type="email"
          placeholder="deine@email.de"
          class="newsletter-input flex-1 min-w-[240px] px-5 py-3.5 text-sand text-sm rounded-sm font-inherit"
        />
        <button type="submit" class="btn newsletter-btn">Anmelden</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref('')
function onSubmit() {
  // TODO: connect newsletter service
  console.log('Newsletter signup:', email.value)
  email.value = ''
}
</script>

<style scoped>
.newsletter {
  background-image: linear-gradient(rgba(107, 52, 16, 0.92), rgba(58, 31, 14, 0.96)),
    url('/img/brand/03_pattern_tile.png');
  background-size: 300px;
  color: var(--sand);
}
.newsletter-input {
  border: 1.5px solid rgba(247, 239, 224, 0.4);
  background: rgba(247, 239, 224, 0.1);
}
.newsletter-input::placeholder {
  color: rgba(247, 239, 224, 0.6);
}
.newsletter-btn {
  background: var(--saffron);
  color: var(--cacao-dark);
}
.newsletter-btn:hover {
  background: var(--rust);
  color: var(--sand);
}
</style>
