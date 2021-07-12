<template>
  <div class="component">
    <b-alert
      :show="showAlert"
      dismissible
      variant="success"
      @dismissed="showAlert = false"
    >
      Successfully created container
    </b-alert>

    <b-input-group class="component">
      <b-form-input
        v-model="newName"
        placeholder="Name"
        @keyup.enter="createContainer"
      ></b-form-input>
      <b-input-group-append>
        <b-button variant="success" @click="createContainer">
          Create new container
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <b-list-group class="component">
      <b-list-group-item
        v-for="(object, index) in objects"
        :key="index"
        :to="String(object.id)"
        append
        class="list-group-item list-group-item-action"
      >
        {{ object.name }}<br />
        <small>created at {{ object.createdAt.toDateString() }}</small>
        <small> by {{ object.createdBy }}</small>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    objects: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      showAlert: false,
      newName: "",
    };
  },
  methods: {
    createContainer() {
      this.$emit("createContainer", this.newName);
      this.newName = "";
      this.showAlert = true;
    },
  },
});
</script>
