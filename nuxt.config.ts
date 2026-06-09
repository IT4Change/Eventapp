// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  i18n: {
    baseUrl: 'https://soul-and-bliss.de',
    langDir: 'locales',
    locales: [
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.ts' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.ts' },
    ],
    defaultLocale: 'de',
    // DE behält die bisherigen URLs, EN liegt unter /en/...
    strategy: 'prefix_except_default',
    lazy: true,
    // Spracheinstellung als technisch notwendiger Funktions-Cookie (DSGVO: einwilligungsfrei)
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      cookieCrossOrigin: false,
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },
  app: {
    head: {
      // lang wird zur Laufzeit von @nuxtjs/i18n gesetzt (useLocaleHead im Layout)
      title: 'Soul & Bliss · Conscious Events · Rhein-Main-Neckar',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
    },
  },
})
