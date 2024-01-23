<template>
  <div>
    <label class="font-bold block mb-2"
      >{{ label }}
    </label>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: '',
  }
});
</script>
