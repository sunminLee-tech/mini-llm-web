<script setup>
import { ref } from 'vue'
import MainView  from './components/MainView.vue'
import HeaderView  from './components/HeaderView.vue'
import SidebarView from './components/SidebarView.vue'
import GalleryView from './components/GalleryView.vue'

const sidebarOpen = ref(false)
const currentView = ref('chat')
const historyClientId = ref(null)
const sidebarRef = ref(null)
const mainViewRef = ref(null)

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
  } else if (view === 'chat') {
    // New Chat 클릭 시
    currentView.value = 'chat'
    historyClientId.value = null
    mainViewRef.value?.resetChat()
  } else {
    currentView.value = view
    historyClientId.value = null
  }
}

function refreshHistory() {
  sidebarRef.value?.fetchChatHistory()
}
</script>

<template>
 <div class="app">
  <HeaderView @toggle-sidebar="toggleSidebar"/>
  <div class="content">
    <SidebarView ref="sidebarRef" :open="sidebarOpen" @navigate="navigate"/>
    <component ref="mainViewRef" :is="views[currentView]" :history-client-id="historyClientId" @refresh-history="refreshHistory"/>
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
