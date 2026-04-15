export default defineNuxtConfig({
  compatibilityDate: '2026-04-02',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/global.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3004/api/v1',
    },
  },
})
