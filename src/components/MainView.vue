<script setup>
import { useClientId } from "../composables/useClientId";
import { ref, nextTick, watch } from "vue";
import { marked } from "marked";

const props = defineProps({
  historyClientId: {
    type: String,
    default: null,
  },
});

// marked 옵션 설정
marked.setOptions({
  breaks: true, // 줄바꿈을 <br>로 변환
  gfm: true, // GitHub Flavored Markdown
});

function renderMarkdown(text) {
  if (!text) return "";
  return marked.parse(text);
}

const { clientId, regenerateClientId } = useClientId();
const message = ref("");
const loading = ref(false);
const messages = ref([
  { role: "ASSISTANT", content: "안녕하세요! 어떻게 도와드릴까요? 😊" },
]);
const messagesEl = ref(null);

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight; // 스크롤 위치 / 컨텐츠 전체 높이
    }
  });
}

// 히스토리 대화 조회
async function fetchChatMessages(targetClientId) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/chatbot/messages?client_id=${targetClientId}`
    );
    const data = await res.json();
    messages.value = data.data || data;
    scrollToBottom();
  } catch (error) {
    console.error("대화 내역 조회 실패:", error);
  }
}

// historyClientId가 변경되면 해당 대화 내역 조회
watch(
  () => props.historyClientId,
  (newClientId) => {
    if (newClientId) {
      fetchChatMessages(newClientId);
    } else {
      // 새 채팅 (New Chat 클릭 시) - 새 clientId 생성
      regenerateClientId();
      messages.value = [
        { role: "ASSISTANT", content: "안녕하세요! 어떻게 도와드릴까요? 😊" },
      ];
    }
  }
);

async function sendMessage() {
  if (!message.value.trim() || loading.value) return;

  // 노출용 메세지 - 나
  messages.value.push({
    role: "USER",
    content: message.value,
  });
  scrollToBottom();

  const userMessage = message.value;
  message.value = ""; // 입력창 초기화
  loading.value = true;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/chatbot`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId.value,
          message: userMessage,
        }),
      }
    );
    const data = await response.json();
    const fullText = data.data;

    messages.value.push({
      role: "ASSISTANT",
      content: "",
    });

    const lastIndex = messages.value.length - 1;

    // 가짜 스트리밍 시작
    fakeStreamingByWord(fullText, (partialText) => {
      messages.value[lastIndex].content = partialText;
      scrollToBottom();
    });
  } catch (error) {
    console.error("전송 실패:", error);
  } finally {
    loading.value = false;
  }
}

function fakeStreamingByWord(text, onUpdate, speed = 60) {
  const words = text.split(" ");
  let index = 0;
  let current = "";

  const timer = setInterval(() => {
    if (index >= words.length) {
      clearInterval(timer);
      return;
    }

    current += (index === 0 ? "" : " ") + words[index];
    index++;
    onUpdate(current);
  }, speed);
}
</script>
<template>
  <main class="main">
    <div class="chat-container">
      <div class="model-header">
        <div class="model-icon"></div>
        <span style="font-size: 20px">GPT</span>
      </div>

      <!-- 메시지 목록 -->
      <div class="messages" ref="messagesEl">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.role]"
        >
          <div
            v-if="msg.role === 'ASSISTANT'"
            class="bubble markdown-body"
            v-html="renderMarkdown(msg.content)"
          ></div>
          <div v-else class="bubble">{{ msg.content }}</div>
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
        <button @click="sendMessage" :disabled="loading">
          {{ loading ? "..." : "Send" }}
        </button>
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
  overflow-y: auto; /* 스크롤 */
  min-height: 0;
}

.input-area {
  display: flex;
  padding: 10px;
  gap: 10px;
  border-top: 1px solid #ccc;
}

.input-area input {
  flex: 1; /* 남은 공간 전부 차지 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-area button {
  padding: 10px 20px;
  background-color: #555; /* 진회색 */
  color: #fff; /* 흰색 글자 */
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

.message.USER {
  justify-content: flex-end;
}

.message.ASSISTANT {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  word-break: break-word;
}

.message.USER .bubble {
  background-color: #555;
  color: #fff;
}

.message.ASSISTANT .bubble {
  background-color: #e9e9e9;
  color: #333;
}

/* 마크다운 스타일 */
.markdown-body :deep(p) {
  margin: 0 0 10px 0;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(code) {
  background-color: #d4d4d4;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 10px 0;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 10px 0;
  padding-left: 20px;
}

.markdown-body :deep(li) {
  margin: 5px 0;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid #ccc;
  margin: 10px 0;
  padding-left: 15px;
  color: #666;
}

.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 10px 0;
  width: 100%;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.markdown-body :deep(th) {
  background-color: #d4d4d4;
}

.markdown-body :deep(a) {
  color: #0066cc;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 15px 0 10px 0;
}

.markdown-body :deep(h1) {
  font-size: 1.4em;
}

.markdown-body :deep(h2) {
  font-size: 1.2em;
}

.markdown-body :deep(h3) {
  font-size: 1.1em;
}
</style>
