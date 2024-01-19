<template>

  <main>
    <NavBar/>
    <div>
      <router-view />
    </div>
  </main>


</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import {ref} from 'vue'


</script>

<style lang="scss">

</style>
