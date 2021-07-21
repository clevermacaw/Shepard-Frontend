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
      <!-- Dirty fix: https://stackoverflow.com/a/57044265 -->
      <b-form-input
        placeholder="Please enter a name for the object you want to create"
        class="fixed-height"
        :value="newName"
        @change="value => (newName = value)"
        @keyup.enter="createEntity"
      ></b-form-input>
      <b-input-group-append>
        <b-button variant="primary" @click="createEntity"> Create </b-button>
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
            <open-icon />
          </b-button>
          <b-button
            v-b-modal.delete-confirmation-modal
            variant="dark"
            @click="currentEntity = entity"
          >
            <delete-icon />
          </b-button>
        </b-button-group>
      </b-list-group-item>
    </b-list-group>
    <DeleteConfirmationModal
      v-if="currentEntity"
      modal-id="delete-confirmation-modal"
      modal-name="Confirm to delete"
      :modal-text="
        'Do you really want do delete the entity with name ' +
        currentEntity.name +
        '?'
      "
      @confirmation="deleteEntity(currentEntity.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

interface Entity {
  name: string;
  id: number;
  createdAt: Date;
  createdBy: string;
}

interface GenericEntityListData {
  currentEntity?: Entity;
  showCreate: boolean;
  showDelete: boolean;
  newName: string;
}

export default Vue.extend({
  components: {
    DeleteConfirmationModal,
  },
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
      currentEntity: undefined,
      showCreate: false,
      showDelete: false,
      newName: "",
    } as GenericEntityListData;
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
