<template>
  <div class="component">
    <b-alert
      :show="showCreate"
      dismissible
      variant="dark"
      @dismissed="showCreate = false"
    >
      Successfully created
    </b-alert>
    <b-alert
      :show="showDelete"
      dismissible
      variant="dark"
      @dismissed="showDelete = false"
    >
      Successfully deleted
    </b-alert>

    <b-input-group class="component">
      <b-form-input
        v-model="newName"
        placeholder="Name"
        class="fixed-height"
        @keyup.enter="createEntity"
      ></b-form-input>
      <b-input-group-append>
        <b-button variant="primary" @click="createEntity">
          <create-icon />
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <b-list-group class="component">
      <b-list-group-item
        v-for="(entity, index) in entities"
        :key="index"
        class="list-group-item list-group-item-action"
      >
        <div class="left-align">
          {{ entity.name }}<br />
          <small>created at {{ entity.createdAt.toDateString() }}</small>
          <small> by {{ entity.createdBy }}</small>
        </div>
        <b-button-group class="right-align">
          <b-button variant="light" :to="String(entity.id)" append>
            <edit-icon />
          </b-button>
          <b-button variant="dark" @click="deleteEntity(entity.id)">
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
    entities: {
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
    createEntity() {
      this.$emit("createEntity", this.newName);
      this.newName = "";
      this.showCreate = true;
    },
    deleteEntity(id: number) {
      this.$emit("deleteEntity", id);
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
.fixed-height {
  height: 40px;
}
</style>
