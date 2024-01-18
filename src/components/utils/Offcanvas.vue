<template>
  <div>
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="offcanvas"
      :data-bs-target="`#${id}`"
      :aria-controls="id"
    >
      {{ buttonText }}
    </button>
    <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      :id="id"
      :aria-labelledby="`#${id}Label`"
      style="width: 600px"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" :id="`#${id}Label`">
          {{ title }}
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    required: true,
  }
})

const id = 'offcanvas' + Math.random().toString(36).substring(7);

</script>

<style scoped></style>
