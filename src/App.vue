<template>

  <NavBar/>
  <div class="container">
    <router-view />
  </div>


</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import {ref} from 'vue'


</script>

<style lang="scss">

</style>
