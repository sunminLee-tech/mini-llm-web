<script setup>
const emit = defineEmits(["toggle-sidebar"]);
</script>

<template>
  <header class="header">
    <button class="menu-btn" @click="emit('toggle-sidebar')">&#9776;</button>
    <span class="title">Chatbot</span>
  </header>
</template>

<style scoped>
.header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
}

.menu-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  margin-right: 15px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}
</style>
