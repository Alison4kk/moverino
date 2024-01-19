<template>
  <div class="card">
    <Menubar :model="items" />
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    command: () => {
      router.push({ name: "home" });
    }
  },
  {
    label: "Verificador de Pontos",
    icon: "pi pi-clock",
    command: () => {
      router.push({ name: "verificador-pontos" });
    }
  },
]);
</script>
