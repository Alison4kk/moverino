<template>
  <div class="card">
    <Menubar :model="items">
      <template #end>
        <ToggleButton
          v-model="darkMode"
          onLabel="Escuro"
          offLabel="Claro"
          onIcon="pi pi-moon"
          offIcon="pi pi-sun"
          class="w-[9rem]"
        />
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import useEventBus from "@/composables/useEventBus";
import router from "@/router";
import { ref, watch } from "vue";

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
    label: "Home",
    icon: "pi pi-home",
    command: () => {
      router.push({ name: "home" });
    },
  },
  {
    label: "Verificador de Pontos",
    icon: "pi pi-clock",
    command: () => {
      router.push({ name: "verificador-pontos" });
    },
  },
]);
</script>
