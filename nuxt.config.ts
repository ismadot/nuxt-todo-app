// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  modules: [
    "@vite-pwa/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
  nitro: {
    prerender: {
      routes: ["/"],
    },
    routeRules: {
      "/": {
        headers: {
          "Cross-Origin-Opener-Policy": "unsafe-none",
          "Cross-Origin-Embedder-Policy": "unsafe-none",
        },
      },
    },
  },
  pwa: {
    registerType: "autoUpdate", // actualiza el SW automáticamente
    manifest: {
      name: "Mi App Nuxt",
      short_name: "NuxtApp",
      description: "Mi aplicación Nuxt convertida en PWA",
      theme_color: "#0ea5e9",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      start_url: "/",      // 👈 obligatorio para instalación
      scope: "/",          // 👈 delimita el alcance de la PWA
      icons: [
        {
          src: "/iconx192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/iconx512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,json,webp,jpg,jpeg}"],
      navigateFallback: '/offline.html', // 👈 importante para Vercel SSR
      additionalManifestEntries: [
        { url: "/offline.html", revision: null } // 👈 fuerza cacheo
      ],
      navigateFallbackAllowlist: [/^(?!\/offline$).*/],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts",
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
        // Imágenes locales y externas
        {
          urlPattern: ({ request }) => request.destination === "image",
          handler: "CacheFirst",
          options: {
            cacheName: "images-cache",
            expiration: {
              maxEntries: 60, // máximo 60 imágenes
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
            },
          },
        }
      ],
    },
  },
  devtools: { enabled: true },
});
