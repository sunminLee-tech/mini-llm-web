import { ref } from 'vue'

const clientId = ref(null)

export function useClientId() {
  if (!clientId.value) {

    let stored = localStorage.getItem('client_id')
    
    if (!stored) {
      // 없으면 새로 생성
      stored = crypto.randomUUID()
      localStorage.setItem('client_id', stored)
    }
    
    clientId.value = stored
  }
  
  return { clientId }
}