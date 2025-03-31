<template>
  <div class="max-w-xl mx-auto p-4">
    <AuthButton class="mb-6" />

    <div v-if="user">
      <h1 class="text-2xl font-bold mb-4">📝 TODO App con Markdown</h1>

      <form @submit.prevent="createOrUpdateTodo" class="flex flex-col gap-2 mb-4">
        <input
          v-model="newTitle"
          type="text"
          placeholder="Título"
          class="border rounded px-3 py-2"
        />
        <textarea
          v-model="newText"
          placeholder="Contenido en Markdown"
          class="w-full border rounded px-3 py-2 resize-y min-h-[100px]"
        />

        <div class="flex justify-between items-center">
          <span v-if="editingTodoId" class="text-sm text-gray-500 italic">
            ✏️ Editando tarea...
          </span>

          <div class="flex items-center gap-2">
            <button
              type="button"
              v-if="editingTodoId"
              class="text-sm text-gray-500 hover:text-gray-700"
              @click="cancelEdit"
              :disabled="loading"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="bg-emerald-500 text-white px-4 py-2 rounded disabled:opacity-50"
              :disabled="loading"
            >
              <span v-if="loading">Guardando...</span>
              <span v-else>{{ editingTodoId ? 'Actualizar' : 'Agregar' }}</span>
            </button>
          </div>
        </div>
      </form>

      <ul class="space-y-4">
        <li
          v-for="todo in todoStore.todos"
          :key="todo.id"
          class="p-4 border rounded bg-white shadow-sm hover:shadow-md transition-all"
          @dblclick="startEdit(todo)"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-start gap-2">
              <input
                type="checkbox"
                :checked="todo.done"
                @change="todoStore.toggleDone(todo.id)"
              />
              <div>
                <h2 class="text-lg font-semibold" :class="{ 'line-through text-gray-400': todo.done }">
                  {{ todo.title }}
                </h2>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span
                class="text-sm font-semibold"
                :class="todo.done ? 'text-green-600' : 'text-gray-400'"
              >
                {{ todo.done ? '✔️ Completado' : '' }}
              </span>
              <button
                @click="todoStore.deleteTodo(todo.id)"
                class="text-red-500 text-sm"
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
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
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked'
import { useTodoStore } from '@/stores/todo'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import AuthButton from '@/components/AuthButton.vue'

const todoStore = useTodoStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const newTitle = ref('')
const newText = ref('')
const editingTodoId = ref<string | null>(null)
const loading = ref(false)

onMounted(() => {
  userStore.initAuth()
  if (user.value) {
    todoStore.fetchTodos()
  }
})

watch(user, (newUser) => {
  if (newUser) {
    todoStore.fetchTodos()
  } else {
    todoStore.todos = []
  }
})

const createOrUpdateTodo = async () => {
  if (!newText.value.trim() || !newTitle.value.trim()) return

  loading.value = true

  try {
    if (editingTodoId.value) {
      await todoStore.updateTodo(editingTodoId.value, newTitle.value.trim(), newText.value.trim())
    } else {
      await todoStore.addTodo(newTitle.value.trim(), newText.value.trim())
    }

    newTitle.value = ''
    newText.value = ''
    editingTodoId.value = null
  } finally {
    loading.value = false
  }
}

const startEdit = (todo: { id: string; title: string; text: string }) => {
  newTitle.value = todo.title
  newText.value = todo.text
  editingTodoId.value = todo.id
}

const cancelEdit = () => {
  newTitle.value = ''
  newText.value = ''
  editingTodoId.value = null
}

const renderMarkdown = (text: string) => {
  return marked.parse(text)
}
</script>
