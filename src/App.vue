<script setup>
import MainView  from './components/MainView.vue'
import HeaderView  from './components/HeaderView.vue'
</script>

<template>
 <div class="app">
  <HeaderView/> 
  <MainView/>
 </div>
  
</template>

<style>
.app{
   height: 100vh;
  display: flex;
  flex-direction: column;
}

</style>
