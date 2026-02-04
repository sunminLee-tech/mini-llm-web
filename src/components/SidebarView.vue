<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <aside class="sidebar" :class="{ open }">
    <nav class="sidebar-menu">
      <div class="sidebar-item">New Chat</div>
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
</style>
