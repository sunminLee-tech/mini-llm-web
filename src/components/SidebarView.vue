<script setup>
import { ref, onMounted } from "vue";

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const chatHistory = ref([]);
const emit = defineEmits(["navigate"]);

async function fetchChatHistory() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/history`);
    const data = await res.json();
    chatHistory.value = data.data || data;
  } catch (error) {
    console.error("히스토리 조회 실패:", error);
  }
}

async function deleteChat(clientId) {
  if (!confirm("대화를 삭제하시겠습니까?")) return;

  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/history/${clientId}`, {
      method: "DELETE",
    });
    // 삭제 후 목록 갱신
    chatHistory.value = chatHistory.value.filter((item) => item.clientId !== clientId);
  } catch (error) {
    console.error("대화 삭제 실패:", error);
  }
}

onMounted(() => {
  fetchChatHistory();
});

// 외부에서 히스토리 갱신 가능하도록 노출
defineExpose({
  fetchChatHistory,
});
</script>

<template>
  <aside class="sidebar" :class="{ open }">
    <nav class="sidebar-menu">
      <div class="sidebar-item" @click="emit('navigate', 'chat')">New Chat</div>
      <div class="sidebar-item" @click="emit('navigate', 'gallery')">
        Gallery
      </div>

      <!-- 히스토리 섹션 -->
      <div class="history-section">
        <div class="history-title">History</div>
        <div
          v-for="item in chatHistory"
          :key="item.clientId"
          class="history-item"
        >
          <span
            class="history-item-title"
            @click="emit('navigate', { type: 'history', clientId: item.clientId })"
          >
            {{ item.title }}
          </span>
          <button
            class="history-item-delete"
            @click.stop="deleteChat(item.clientId)"
          >
            ✕
          </button>
        </div>
        <div v-if="chatHistory.length === 0" class="history-empty">
          대화 내역이 없습니다
        </div>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #f5f5f5;
  border-right: 1px solid #ccc;
  overflow-y: auto;
  flex-shrink: 0;
  transition: margin-left 0.3s ease;
  margin-left: -260px;
}

.sidebar.open {
  margin-left: 0;
}

.sidebar-menu {
  padding: 10px;
}

.sidebar-item {
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
}

.sidebar-item:hover {
  background-color: #e0e0e0;
}

.history-section {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 15px;
}

.history-title {
  font-size: 12px;
  color: #888;
  padding: 0 15px 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 14px;
}

.history-item:hover {
  background-color: #e0e0e0;
}

.history-item-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.history-item-delete {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.history-item:hover .history-item-delete {
  opacity: 1;
}

.history-item-delete:hover {
  background-color: #ddd;
  color: #666;
}

.history-empty {
  padding: 10px 15px;
  font-size: 13px;
  color: #999;
}
</style>
