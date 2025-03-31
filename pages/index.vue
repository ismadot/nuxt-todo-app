<template>
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">📝 TODO App</h1>

    <AuthButton class="mb-6" />

    <div v-if="user">
      <form @submit.prevent="createTodo" class="flex gap-2 mb-4">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Agrega una tarea"
          class="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" class="bg-emerald-500 text-white px-4 py-2 rounded">Agregar</button>
      </form>

      <ul>
        <li
          v-for="todo in todoStore.todos"
          :key="todo.id"
          class="flex justify-between items-center py-2 border-b"
        >
          <label class="flex items-center gap-2">
            <input type="checkbox" :checked="todo.done" @change="todoStore.toggleDone(todo.id)" />
            <span :class="{ 'line-through text-gray-400': todo.done }">{{ todo.text }}</span>
          </label>
          <button @click="todoStore.deleteTodo(todo.id)" class="text-red-500">🗑️</button>
        </li>
      </ul>
    </div>

    <p v-else class="text-gray-500 text-sm mt-4">Inicia sesión para ver y crear tus tareas.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todo'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import AuthButton from '@/components/AuthButton.vue'

const todoStore = useTodoStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const newTodo = ref('')

onMounted(() => {
  if (user.value) {
    todoStore.fetchTodos()
  }
})

const createTodo = async () => {
  if (!newTodo.value.trim()) return
  await todoStore.addTodo(newTodo.value.trim())
  newTodo.value = ''
}
</script>
