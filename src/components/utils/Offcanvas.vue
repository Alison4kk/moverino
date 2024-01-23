<template>
  <div>
    <Mover :to="`#${uniqueId}`" :when="active">
      <slot></slot>
    </Mover>
    <Sidebar :header="props.header" :visible="active">
      <div :id="`${uniqueId}`">

      </div>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">

import { defineProps, PropType, ref } from "vue";
import Mover from "./Mover.vue";

const uniqueId = ref(Math.random().toString(36).slice(2, 9)  as String)

const props = defineProps({
  header: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
});

</script>

