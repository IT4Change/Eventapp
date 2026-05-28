<template>
  <section class="bg-white py-[80px] md:py-[100px]">
    <div class="container-w max-w-[560px]">
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          {{ t.postEvent.form.tabs.login }}
        </button>
        <button
          class="tab"
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          {{ t.postEvent.form.tabs.register }}
        </button>
      </div>

      <form v-if="mode === 'login'" class="login-form" @submit.prevent="onSubmit">
        <h3 class="form-heading">{{ t.postEvent.form.login.title }}</h3>
        <label>
          <span>{{ t.postEvent.form.login.emailLabel }}</span>
          <input
            v-model="loginEmail"
            type="email"
            :placeholder="t.postEvent.form.login.emailPlaceholder"
            class="form-input"
          />
        </label>
        <label>
          <span>{{ t.postEvent.form.login.passwordLabel }}</span>
          <input
            v-model="loginPassword"
            type="password"
            :placeholder="t.postEvent.form.login.passwordPlaceholder"
            class="form-input"
          />
        </label>
        <button type="submit" class="btn w-full mt-2">
          {{ t.postEvent.form.login.submit }}
        </button>
        <a href="#" class="forgot-link" @click.prevent>
          {{ t.postEvent.form.login.forgot }}
        </a>
      </form>

      <form v-else class="login-form" @submit.prevent="onSubmit">
        <h3 class="form-heading">{{ t.postEvent.form.register.title }}</h3>
        <label>
          <span>{{ t.postEvent.form.register.nameLabel }}</span>
          <input
            v-model="regName"
            type="text"
            :placeholder="t.postEvent.form.register.namePlaceholder"
            class="form-input"
          />
        </label>
        <label>
          <span>{{ t.postEvent.form.register.emailLabel }}</span>
          <input
            v-model="regEmail"
            type="email"
            :placeholder="t.postEvent.form.register.emailPlaceholder"
            class="form-input"
          />
        </label>
        <label>
          <span>{{ t.postEvent.form.register.passwordLabel }}</span>
          <input
            v-model="regPassword"
            type="password"
            :placeholder="t.postEvent.form.register.passwordPlaceholder"
            class="form-input"
          />
        </label>
        <button type="submit" class="btn w-full mt-2">
          {{ t.postEvent.form.register.submit }}
        </button>
        <p class="terms">{{ t.postEvent.form.register.terms }}</p>
      </form>

      <p v-if="submitted" class="submitted-note">
        Danke! Diese Login-Funktion ist noch ein Mockup — eine echte Anmeldung folgt in Kürze.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const t = useContent()
const mode = ref<'login' | 'register'>('login')
const loginEmail = ref('')
const loginPassword = ref('')
const regName = ref('')
const regEmail = ref('')
const regPassword = ref('')
const submitted = ref(false)

function onSubmit() {
  submitted.value = true
  console.log('Mock submit', { mode: mode.value })
}
</script>

<style scoped>
.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  border-bottom: 1px solid rgba(46, 90, 87, 0.12);
}
.tab {
  flex: 1;
  padding: 14px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-soft);
  font-weight: 500;
  position: relative;
  transition: color 0.2s;
  font-family: inherit;
}
.tab:hover {
  color: var(--ink);
}
.tab.active {
  color: var(--ink);
}
.tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--grad-warm);
}
.form-heading {
  font-family: Georgia, serif;
  font-size: 26px;
  color: var(--ink);
  font-weight: normal;
  margin-bottom: 22px;
  text-align: center;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.login-form label span {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink-soft);
  font-weight: 500;
}
.form-input {
  padding: 13px 18px;
  border-radius: 12px;
  border: 1.5px solid rgba(46, 90, 87, 0.15);
  background: var(--off);
  color: var(--ink);
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: var(--teal);
  background: #fff;
}
.forgot-link {
  font-size: 12px;
  color: var(--ink-soft);
  text-align: center;
  text-decoration: underline;
  margin-top: 6px;
}
.forgot-link:hover {
  color: var(--coral);
}
.terms {
  font-size: 12px;
  color: var(--ink-soft);
  text-align: center;
  margin-top: 4px;
  line-height: 1.6;
  font-style: italic;
}
.submitted-note {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--ink-soft);
  background: rgba(244, 201, 93, 0.15);
  padding: 14px 20px;
  border-radius: 12px;
  border-left: 3px solid var(--gold);
}
</style>
