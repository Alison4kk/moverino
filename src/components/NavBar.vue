<template>
  <div class="card">
    <Menubar :model="items">
      <template #start>
        <img class="w-32 mx-3" src="@/assets/img/marca/logo-moverino.png" alt="">
      </template>
      <template #end>
        <DarkModeButton/>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import useEventBus from "@/composables/useEventBus";
import router from "@/router";
import { ref, watch } from "vue";
import DarkModeButton from "./utils/DarkModeButton.vue";

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

const items = ref([
  {
    label: "Verificador de Pontos",
    icon: "pi pi-clock",
    command: () => {
      router.push({ name: "verificador-pontos" });
    },
  },
]);
</script>
