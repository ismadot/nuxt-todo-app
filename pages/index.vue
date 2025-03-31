<template>
  <div class="max-w-xl mx-auto p-4">
    <AuthButton class="mb-6" />

    <div v-if="user">
      <h1 class="text-2xl font-bold mb-4">📝 TODO App con Markdown</h1>

      <form @submit.prevent="createTodo" class="flex flex-col gap-2 mb-4">
        <textarea
          v-model="newTodo"
          placeholder="Agrega una tarea (usa Markdown)"
          class="w-full border rounded px-3 py-2 resize-y min-h-[100px]"
        />
        <button type="submit" class="bg-emerald-500 text-white px-4 py-2 rounded self-end">
          Agregar
        </button>
      </form>

      <ul class="space-y-4">
        <li
          v-for="todo in todoStore.todos"
          :key="todo.id"
          class="p-3 border rounded bg-white shadow-sm"
        >
          <div class="flex justify-between items-start">
            <label class="flex items-center gap-2">
  <input
    type="checkbox"
    :checked="todo.done"
    @change="todoStore.toggleDone(todo.id)"
  />
</label>
            <button @click="todoStore.deleteTodo(todo.id)" class="text-red-500 text-sm">🗑️</button>
          </div>

          <div
  class="prose prose-sm max-w-none mt-2"
  v-html="renderMarkdown(todo.text)"
></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { marked } from 'marked'
import { useTodoStore } from '@/stores/todo'
import { useUserStore } from '@/stores/user'
import AuthButton from '@/components/AuthButton.vue'

const todoStore = useTodoStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const newTodo = ref('')
onMounted(() => {
  const userStore = useUserStore()
  userStore.initAuth()
  if (user.value) {
    todoStore.fetchTodos()
  }
})

watch(user, (newUser) => {
  if (newUser) {
    todoStore.fetchTodos()
  } else {
    todoStore.todos = [] // Limpiar al hacer logout
  }
})

const createTodo = async () => {
  if (!newTodo.value.trim()) return
  await todoStore.addTodo(newTodo.value.trim())
  newTodo.value = ''
}

const renderMarkdown = (text: string) => {
  return marked.parse(text)
}
</script>

<style scoped>
.prose {
  line-height: 1.4;
}
</style>
