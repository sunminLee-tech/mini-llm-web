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

onMounted(() => {
  fetchChatHistory();
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
          @click="emit('navigate', { type: 'history', clientId: item.clientId })"
        >
          {{ item.title }}
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
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item:hover {
  background-color: #e0e0e0;
}

.history-empty {
  padding: 10px 15px;
  font-size: 13px;
  color: #999;
}
</style>
