<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="s"
    :title="modalName"
    @ok="$emit('confirmation')"
  >
    {{ modalText }}
  </b-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    modalId: {
      type: String,
      default: "deleteConfirmationModal",
    },
    modalName: {
      type: String,
      default: "deleteConfirmationModal",
    },
    modalText: {
      type: String,
      default: "Do you really want to delete?",
    },
  },
  emits: ["confirmation"],
});
</script>
