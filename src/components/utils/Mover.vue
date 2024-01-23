<template>
  <div ref="container">
    <teleport v-if="active" :to="to" :disabled="!enabled">
      <slot></slot>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  to: {
    type: [String, HTMLElement],
    required: true,
  },
  when: {
    type: Boolean,
    default: true,
  },
});

const container = ref(null as HTMLElement | null);
const active = ref(false);
const enabled = ref(props.when);



function onWhenChanged(value: boolean) {
  enabled.value = value;
}

watch(() => props.when, onWhenChanged);

onMounted(() => {
  active.value = true;
});
</script>
