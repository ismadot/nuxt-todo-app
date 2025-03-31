import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
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
    const userTodosRef = collection($db, `users/${userStore.user.uid}/todos`);
    const snapshot = await getDocs(userTodosRef);

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

    const userTodosRef = collection($db, `users/${userStore.user.uid}/todos`);
    const docRef = await addDoc(userTodosRef, {
      text,
      done: false,
    });

    todos.value.push({
      id: docRef.id,
      text,
      done: false,
    });
  }

  const deleteTodo = async (id: string) => {
    const { $db } = useNuxtApp()
    const userStore = useUserStore();
    if (!userStore.user) return;

    const todoRef = doc($db, `users/${userStore.user.uid}/todos`, id);
    await deleteDoc(todoRef);

    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  const toggleDone = async (id: string) => {
    const { $db } = useNuxtApp()
    const userStore = useUserStore();
    if (!userStore.user) return;

    const todo = todos.value.find(t => t.id === id)
    if (!todo) return

    todo.done = !todo.done

    const todoRef = doc($db, `users/${userStore.user.uid}/todos`, id);
    await updateDoc(todoRef, {
      done: todo.done,
    });
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
