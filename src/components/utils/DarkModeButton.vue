<template>
  <Button :icon="darkMode ? 'pi pi-moon' : 'pi pi-sun'" @click="darkMode = !darkMode" severity="secundary" outlined rounded aria-label="Trocar thema escuro"/>
</template>

<script setup lang="ts">
import useEventBus from '@/composables/useEventBus';
import { ref, watch } from 'vue';

const darkMode = ref(false);
const { eventBus } = useEventBus();

if (localStorage.getItem("darkMode") == "true") {
  darkMode.value = true;
  document.documentElement.classList.add("dark");
}

watch(darkMode, (value) => {
  if (value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkMode", "true");
    eventBus.emit('theme-changed', 'dark');
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
    eventBus.emit('theme-changed', 'light');
  }
});
</script>

