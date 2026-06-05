<template>
  <div class="login-widget">
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

    <p class="mockup-note">{{ t.postEvent.login.note }}</p>
  </div>
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
.login-widget {
  max-width: 440px;
  background: #fff;
  border: 1px solid rgba(46, 90, 87, 0.1);
  border-radius: 18px;
  padding: 22px 24px 20px;
}
.mockup-note {
  margin-top: 16px;
  font-size: 12px;
  font-style: italic;
  color: var(--ink-soft);
  line-height: 1.5;
}
.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(46, 90, 87, 0.12);
}
.tab {
  flex: 1;
  padding: 11px 0;
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
  font-size: 19px;
  color: var(--ink);
  font-weight: normal;
  margin-bottom: 16px;
  text-align: left;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.login-form label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.login-form label span {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink-soft);
  font-weight: 500;
}
.form-input {
  padding: 11px 16px;
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
  text-align: left;
  text-decoration: underline;
  margin-top: 4px;
}
.forgot-link:hover {
  color: var(--coral);
}
.terms {
  font-size: 12px;
  color: var(--ink-soft);
  text-align: left;
  margin-top: 4px;
  line-height: 1.55;
  font-style: italic;
}
.submitted-note {
  margin-top: 18px;
  font-size: 13px;
  color: var(--ink-soft);
  background: rgba(244, 201, 93, 0.15);
  padding: 12px 18px;
  border-radius: 12px;
  border-left: 3px solid var(--gold);
}
</style>
