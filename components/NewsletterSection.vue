<template>
  <section class="newsletter text-center py-16 sm:py-24 lg:py-[100px]">
    <div class="container-w">
      <h2
        class="newsletter-heading text-white font-extralight text-[28px] sm:text-[36px] lg:text-[42px] mb-2"
      >
        {{ $t('newsletter.form.heading').split(' ').slice(0, -1).join(' ') }}
        <span class="script text-[36px] sm:text-[44px] lg:text-[52px] font-normal">
          {{ $t('newsletter.form.heading').split(' ').slice(-1)[0] }}
        </span>
      </h2>
      <p
        class="mb-[34px] max-w-[540px] mx-auto font-light"
        style="color: rgba(255,255,255,0.92);"
      >
        {{ $t('newsletter.form.body') }}
      </p>
      <form
        class="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto sm:flex-wrap justify-center"
        @submit.prevent="onSubmit"
      >
        <input
          v-model="email"
          type="email"
          :placeholder="$t('newsletter.form.placeholder')"
          class="newsletter-input w-full sm:flex-1 sm:min-w-[240px] px-[22px] py-[15px] text-ink text-sm rounded-full"
        />
        <button type="submit" class="btn newsletter-btn w-full sm:w-auto">
          {{ $t('newsletter.form.submit') }}
        </button>
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
    linear-gradient(135deg, rgba(192, 80, 32, 0.92), rgba(232, 122, 93, 0.92)),
    url('/img/brand/03_pattern_tile.png');
  background-size: 320px;
  color: #fff;
}
.newsletter-heading {
  font-family: 'Helvetica Neue', sans-serif;
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
