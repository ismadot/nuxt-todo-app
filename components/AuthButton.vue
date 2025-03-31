<template>
  <div class="flex items-center gap-4">
    <div v-if="user">
      <img :src="userStore.user.photoURL" class="w-8 h-8 rounded-full" />
      <span class="text-gray-700">hola, {{ user.displayName }} {{ "  " }} </span>
      <button
        @click="logout"
        class="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
      >
        Cerrar sesión
      </button>
    </div>
    <button
      v-else
      @click="loginWithGoogle"
      :disabled="loading"
      class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
    >
      <span v-if="loading">Conectando...</span>
      <span v-else>Iniciar sesión con Google</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user, loading } = storeToRefs(userStore)
const { loginWithGoogle, logout } = userStore
</script>
