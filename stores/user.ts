// stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from 'firebase/auth'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<User | null>(null);
    const loading = ref(false);

    const setUser = (u: User | null) => {
      user.value = u;
    };
    const initialized = ref(false);

    const initAuth = () => {
      if (initialized.value) return;
      initialized.value = true;

      const { $auth } = useNuxtApp();
      onAuthStateChanged($auth, (u) => {
        queueMicrotask(() => {
          user.value = u ?? null;
        });
      });
    }
    


    const loginWithGoogle = async () => {
      const { $auth } = useNuxtApp();
      const provider = new GoogleAuthProvider();

      loading.value = true;
      try {
        const result = await signInWithPopup($auth, provider);
        user.value = result.user;
      } catch (e) {
        console.error("❌ Error al iniciar sesión:", e);
      } finally {
        loading.value = false;
      }
    };

    const logout = async () => {
      const { $auth } = useNuxtApp();
      await signOut($auth);
      user.value = null;
    }

    return {
      user,
      loading,
      setUser,
      initAuth,
      loginWithGoogle,
      logout,
    };
  },
  {
    persist: {
      key: "user-persist",
    },
  }
);
