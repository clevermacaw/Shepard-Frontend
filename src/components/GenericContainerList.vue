<template>
  <div class="component">
    <b-alert
      :show="showCreate"
      dismissible
      variant="dark"
      @dismissed="showCreate = false"
    >
      Successfully created container
    </b-alert>
    <b-alert
      :show="showDelete"
      dismissible
      variant="dark"
      @dismissed="showDelete = false"
    >
      Successfully deleted container
    </b-alert>

    <b-input-group class="component">
      <b-form-input
        v-model="newName"
        placeholder="Name"
        @keyup.enter="createContainer"
      ></b-form-input>
      <b-input-group-append>
        <b-button variant="primary" @click="createContainer">
          <create-icon />
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <b-list-group class="component">
      <b-list-group-item
        v-for="(container, index) in objects"
        :key="index"
        class="list-group-item list-group-item-action"
      >
        <div class="left-align">
          {{ container.name }}<br />
          <small>created at {{ container.createdAt.toDateString() }}</small>
          <small> by {{ container.createdBy }}</small>
        </div>
        <b-button-group class="right-align">
          <b-button variant="light" :to="String(container.id)" append>
            <edit-icon />
          </b-button>
          <b-button variant="dark" @click="deleteContainer(container.id)">
            <delete-icon />
          </b-button>
        </b-button-group>
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
      showCreate: false,
      showDelete: false,
      newName: "",
    };
  },
  methods: {
    createContainer() {
      this.$emit("createContainer", this.newName);
      this.newName = "";
      this.showCreate = true;
    },
    deleteContainer(id: number) {
      this.$emit("deleteContainer", id);
      this.showDelete = true;
    },
  },
});
</script>

<style scoped>
.right-align {
  float: right;
}
.left-align {
  float: left;
}
</style>
