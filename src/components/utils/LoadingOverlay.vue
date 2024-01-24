<template>
  <Loading
      v-model:active="isLoading"
      :is-full-page="true"
    />
</template>

<script setup lang="ts">
import useEventBus from '@/composables/useEventBus';
import { ref } from 'vue';
import Loading from 'vue-loading-overlay';
const { eventBus } = useEventBus();
const isLoading = ref(false);

eventBus.on('set-loading', (value) => {
  isLoading.value = (!!value);
});

</script>
