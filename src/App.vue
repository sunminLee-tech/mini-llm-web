<script setup>
import { ref } from 'vue'
import MainView  from './components/MainView.vue'
import HeaderView  from './components/HeaderView.vue'
import SidebarView from './components/SidebarView.vue'

const sidebarOpen = ref(false)

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
 <div class="app">
  <HeaderView @toggle-sidebar="toggleSidebar"/>
  <div class="content">
    <SidebarView :open="sidebarOpen"/>
    <MainView/>
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
