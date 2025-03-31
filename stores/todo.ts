import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore'
import { useUserStore } from './user'

export interface Todo {
  id: string
  text: string
  done: boolean
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)

  const fetchTodos = async () => {
    const { $db } = useNuxtApp()
    const userStore = useUserStore()
    if (!userStore.user) return

    loading.value = true
    const q = query(collection($db, 'todos'), where('userId', '==', userStore.user.uid))
    const snapshot = await getDocs(q)
    todos.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Todo, 'id'>)
    }))
    loading.value = false
  }

  const addTodo = async (text: string) => {
    const { $db } = useNuxtApp()
    const userStore = useUserStore()
    if (!userStore.user) return

    const docRef = await addDoc(collection($db, 'todos'), {
      text,
      done: false,
      userId: userStore.user.uid
    })

    todos.value.push({
      id: docRef.id,
      text,
      done: false
    })
  }

  const deleteTodo = async (id: string) => {
    const { $db } = useNuxtApp()
    await deleteDoc(doc($db, 'todos', id))
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  const toggleDone = async (id: string) => {
    const { $db } = useNuxtApp()
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return

    todo.done = !todo.done
    await updateDoc(doc($db, 'todos', id), {
      done: todo.done
    })
  }

  return {
    todos,
    loading,
    fetchTodos,
    addTodo,
    deleteTodo,
    toggleDone
  }
})
