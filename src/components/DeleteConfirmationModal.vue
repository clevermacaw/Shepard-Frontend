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
import Vue from "vue";
export default Vue.extend({
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
});
</script>
