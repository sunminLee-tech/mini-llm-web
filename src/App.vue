<script setup>
import { ref } from 'vue'
import MainView  from './components/MainView.vue'
import HeaderView  from './components/HeaderView.vue'
import SidebarView from './components/SidebarView.vue'
import GalleryView from './components/GalleryView.vue'

const sidebarOpen = ref(false)
const currentView = ref('chat')

const views = {
  chat: MainView,
  gallery: GalleryView,
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function navigate(view) {
  currentView.value = view
}
</script>

<template>
 <div class="app">
  <HeaderView @toggle-sidebar="toggleSidebar"/>
  <div class="content">
    <SidebarView :open="sidebarOpen" @navigate="navigate"/>
    <component :is="views[currentView]"/>
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
