<template>
  <div>
    <Mover
      style="display: none"
      :to="`#sidebar_${uniqueId}`"
      :when="moverActive"
    >
      <slot></slot>
    </Mover>
    <Sidebar
      v-bind="{
        header: props.header,
        style: {width: props.width},
      }"
      v-model:visible="visible"
    >
      <div :id="`sidebar_${uniqueId}`"></div>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, PropType, ref, watch } from "vue";
import Mover from "./Mover.vue";

const props = defineProps({
  header: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "600px",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const uniqueId = ref(Math.random().toString(36).slice(2, 9) as String);
const moverActive = ref(false);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(visible, (value) => {
  if (value) {
    setTimeout(() => {
      moverActive.value = true;
    }, 1);
  } else {
    moverActive.value = false;
  }
});

const emit = defineEmits(["update:modelValue"]);
</script>
