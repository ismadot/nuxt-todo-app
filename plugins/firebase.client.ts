import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  config.public.fire
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
    measurementId: config.public.firebaseMeasurementId as string,
  }

  const app = initializeApp(firebaseConfig)
  console.log("🚀 >> app:", app)
  console.log("🚀 >> firebaseConfig:", firebaseConfig)

  const auth = getAuth(app)
  const db = getFirestore(app)

  let analytics = null
  if (process.client) {
    analytics = getAnalytics(app)
  }

  return {
    provide: {
      firebase: app,
      auth,
      db,
      analytics,
    }
  }
})
