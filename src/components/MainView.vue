<script setup>
import { useClientId } from '../composables/useClientId';
import { ref } from 'vue';

const { clientId } = useClientId();
const message = ref('')
const loading = ref(false)
const messages = ref([])  
async function sendMessage(){
  if (!message.value.trim() || loading.value) return;

  // 내 메시지 먼저 추가
  messages.value.push({
    role: 'user',
    content: message.value
  })

  const userMessage = message.value
  message.value = ''  // 입력창 초기화
  loading.value = true

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId.value,
        message: userMessage
      })
    })
    
    const data = await response.json()
    
    // AI 응답 추가
    messages.value.push({
      role: 'assistant',
      content: data.reply  // API 응답 형식에 맞게 조정
    })
    
  } catch (error) {
    console.error('전송 실패:', error)
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <main class="main">
    <!-- 채팅 박스 전체 -->
    <div class="chat-container">
      
      <!-- 모델 선택 헤더 -->
  <div class="model-header">
  <div class="model-icon"></div>
  <span style="font-size:20px">GPT</span>
</div>
      
      <!-- 메시지 목록 -->
      <div class="messages">
          <div 
              v-for="(msg, index) in messages" 
              :key="index"
              :class="['message', msg.role]"
            >
          <div class="bubble">{{ msg.content }}</div>
        </div>
      </div>
      
      <!-- 입력 영역 -->
      <div class="input-area">
          <input 
            v-model="message"
            type="text" 
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
          />
        <button @click="sendMessage" :disabled="loading">{{ loading ? '...' : 'Send' }}</button>
      </div>
      
    </div>
  </main>
</template>

<style scoped>
.main {
  flex: 1;
  padding: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;  
}

.chat-container {
  width: 100%;
  max-width: 1400px;         
  height: 80%;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
}

.messages {
  flex: 1;            
  overflow-y: auto;     /* 스크롤 */
    min-height: 0; 
}

.input-area {
  display: flex;
  padding: 10px;
  gap: 10px;
   border-top: 1px solid #ccc; 
}

.input-area input {
  flex: 1;              /* 남은 공간 전부 차지 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-area button {
  padding: 10px 20px;
  background-color: #555;  /* 진회색 */
  color: #fff;             /* 흰색 글자 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.model-header {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ccc;
  gap: 10px;
}

.model-icon {
  width: 30px;
  height: 30px;
  background-color: #ccc;
  border-radius: 50%;
}


.message {
  display: flex;
  margin: 10px;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  word-break: break-word;
}

.message.user .bubble {
  background-color: #555;
  color: #fff;
}

.message.assistant .bubble {
  background-color: #e9e9e9;
  color: #333;
}
</style>
