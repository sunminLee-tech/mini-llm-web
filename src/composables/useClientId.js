import { ref } from 'vue'

const clientId = ref(null)

export function useClientId() {
  if (!clientId.value) {
    let stored = localStorage.getItem('client_id')

    if (!stored) {
      stored = crypto.randomUUID()
      localStorage.setItem('client_id', stored)
    }

    clientId.value = stored
  }

  // 새 clientId 생성 (New Chat 용)
  function regenerateClientId() {
    const newId = crypto.randomUUID()
    localStorage.setItem('client_id', newId)
    clientId.value = newId
    return newId
  }

  return { clientId, regenerateClientId }
}