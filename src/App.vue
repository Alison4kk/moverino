<template>

  <main class="bg-white dark:bg-slate-700 text-black dark:text-white container mx-auto">

    <NavBar class="my-3"/>
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

#app {
  height: 100%;
}
</style>
