<template>
  <div class="edit">
    <b-button-group>
      <b-button v-b-modal.edit-dataObject-modal variant="warning">
        Edit DataObject
      </b-button>
      <b-button variant="danger" @click="handleDelete">
        Delete DataObject
      </b-button>
    </b-button-group>

    <DataObjectModal
      :current-collection-id="currentCollectionId"
      :current-data-object="currentDataObject"
      modal-id="edit-dataObject-modal"
      modal-name="Edit Data Object"
      @dataObjectChanged="$emit('dataObjectChanged')"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectVue } from "@/utils/api-mixin";
import DataObjectModal from "./DataObjectModal.vue";

declare interface DataObjectEditData {
  currentDataObject?: DataObject;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectVue>>
).extend({
  components: { DataObjectModal },
  mixins: [DataObjectVue],
  props: {
    currentCollectionId: {
      type: Number,
      default: undefined,
    },
    currentDataObjectId: {
      type: Number,
      default: undefined,
    },
  },

  data() {
    return {
      currentDataObject: undefined,
    } as DataObjectEditData;
  },

  mounted() {
    this.retrieveDataObject();
  },

  methods: {
    retrieveDataObject() {
      if (!this.dataObjectApi) return;
      this.dataObjectApi
        .getDataObject({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.currentDataObject = response;
        })
        .catch(e => {
          console.log("Error while fetching dataObject" + e);
        })
        .finally();
    },
    handleDelete() {
      this.dataObjectApi
        ?.deleteDataObject({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(() => {
          this.$router.push({
            name: "Collection",
            params: {
              collectionId: String(this.currentCollectionId),
            },
          });
        })
        .catch(e => {
          console.log("Error while deleting dataObject" + e);
        })
        .finally();
    },
  },
});
</script>
