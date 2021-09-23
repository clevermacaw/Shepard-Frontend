<template>
  <div class="component">
    <h4 @click="toggleVisible()">
      <span v-if="collapsed">
        <CollapsIcon />
      </span>
      <span v-else>
        <ExtendIcon />
      </span>
      {{ title }}
    </h4>
    <b-collapse id="collapse" :visible="collapsed">
      <slot></slot>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { collapsed: this.visible };
  },
  methods: {
    toggleVisible() {
      this.collapsed = !this.collapsed;
    },
  },
});
</script>
