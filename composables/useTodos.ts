import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { useNuxtApp } from '#app'
import { useUserStore } from '@/stores/user'

export function useTodos() {
  const { $db } = useNuxtApp()
  const userStore = useUserStore()

  const todos = ref<any[]>([])

  const fetchTodos = async () => {
    if (!userStore.user?.uid) return

    const q = query(
      collection($db, 'todos'),
      where('userId', '==', userStore.user.uid)
    )

    const snapshot = await getDocs(q)
    todos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const addTodo = async (text: string) => {
    if (!userStore.user?.uid) return

    const docRef = await addDoc(collection($db, 'todos'), {
      text,
      completed: false,
      userId: userStore.user.uid,
      createdAt: serverTimestamp()
    })

    todos.value.push({ id: docRef.id, text, completed: false })
  }

  const toggleTodo = async (id: string, current: boolean) => {
    await updateDoc(doc($db, 'todos', id), {
      completed: !current
    })

    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc($db, 'todos', id))
    todos.value = todos.value.filter(t => t.id !== id)
  }

  return {
    todos,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo
  }
}
