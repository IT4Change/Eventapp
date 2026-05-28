// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Soul & Bliss · Conscious Events · Rhein-Main-Neckar',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Conscious Events in der Rhein-Main-Neckar-Region. Tanz, Heilsames, Musik, Inspiration und Retreats — kuratiert und aktuell.' },
      ],
    },
  },
})
