<script setup>
import { ref } from 'vue'
import MainView  from './components/MainView.vue'
import HeaderView  from './components/HeaderView.vue'
import SidebarView from './components/SidebarView.vue'
import GalleryView from './components/GalleryView.vue'

const sidebarOpen = ref(false)
const currentView = ref('chat')
const historyClientId = ref(null)

const views = {
  chat: MainView,
  gallery: GalleryView,
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function navigate(view) {
  if (typeof view === 'object' && view.type === 'history') {
    // 히스토리 클릭 시
    currentView.value = 'chat'
    historyClientId.value = view.clientId
  } else {
    currentView.value = view
    historyClientId.value = null // 새 채팅이면 히스토리 초기화
  }
}
</script>

<template>
 <div class="app">
  <HeaderView @toggle-sidebar="toggleSidebar"/>
  <div class="content">
    <SidebarView :open="sidebarOpen" @navigate="navigate"/>
    <component :is="views[currentView]" :history-client-id="historyClientId"/>
  </div>
 </div>
  
</template>

<style>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
