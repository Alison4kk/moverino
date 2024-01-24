<template>
  <div ref="container">
    <teleport v-if="active" :to="location" :disabled="!enabled">
      <slot></slot>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

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

const location = ref(document.querySelector('body') as HTMLElement);
updateLocation();

function updateLocation() {
  if (typeof props.to === "string") {
    location.value = (document.querySelector(props.to)) ?? document.querySelector('body') as HTMLElement;
  } else {
    location.value = props.to;
  }
};

function onWhenChanged(value: boolean) {
  updateLocation();
  if (location.value && value) {
    enabled.value = true;
  } else {
    enabled.value = false;
  }
}

watch(() => props.when, onWhenChanged);

onMounted(() => {

  active.value = true;
});
</script>
