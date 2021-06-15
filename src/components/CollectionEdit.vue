<template>
  <div class="edit">
    <b-button-group>
      <b-button v-b-modal.create-data-object-modal variant="primary">
        Create DataObject
      </b-button>
      <b-button v-b-modal.edit-collection-modal variant="warning">
        Edit Collection
      </b-button>
      <b-button variant="danger" @click="handleDelete">
        Delete Collection
      </b-button>
    </b-button-group>

    <b-modal
      id="edit-collection-modal"
      ref="modal"
      size="lg"
      title="Edit Collection"
      @show="prepareEdit"
      @ok="handleEdit"
    >
      <b-form-group>
        <b-container>
          <b-row class="mb-3">
            <b-col cols="2"> Name </b-col>
            <b-col cols="8">
              <b-form-input
                id="name-input"
                v-model="newCollection.name"
                required
                placeholder="Name"
              >
              </b-form-input>
            </b-col>
          </b-row>

          <b-row class="mb-3">
            <b-col cols="2"> Description </b-col>
            <b-col cols="8">
              <b-form-textarea
                id="collection-description"
                v-model="newCollection.description"
                placeholder="please insert description"
                rows="3"
                max-rows="6"
              >
              </b-form-textarea>
            </b-col>
          </b-row>
        </b-container>
      </b-form-group>
    </b-modal>

    <DataObjectModal
      :current-collection-id="currentCollectionId"
      modal-id="create-data-object-modal"
      modal-name="Create Data Object"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { Collection } from "@dlr-shepard/shepard-client";
import { CollectionVue } from "@/utils/api-mixin";
import DataObjectModal from "./DataObjectModal.vue";

declare interface CollectionEditData {
  currentCollection?: Collection;
  newCollection: Collection;
  validationError: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  components: { DataObjectModal },
  mixins: [CollectionVue],
  props: {
    currentCollectionId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      currentCollection: undefined,
      newCollection: {},
      validationError: false,
    } as CollectionEditData;
  },
  mounted() {
    this.retrieveCollection();
  },
  methods: {
    retrieveCollection() {
      this.collectionApi
        ?.getCollection({ collectionId: this.currentCollectionId })
        .then(response => {
          this.currentCollection = response;
        })
        .catch(e => {
          console.log("Error while fetching collection" + e);
        })
        .finally();
    },
    prepareEdit() {
      this.newCollection = this.currentCollection ? this.currentCollection : {};
      this.validationError = false;
    },
    handleEdit() {
      this.collectionApi
        ?.updateCollection({
          collectionId: this.currentCollectionId,
          collection: this.newCollection,
        })
        .then(() => {
          this.$emit("collectionChanged");
        })
        .catch(e => {
          console.log("Error while updating collection" + e);
        })
        .finally();
    },
    handleDelete() {
      this.collectionApi
        ?.deleteCollection({ collectionId: this.currentCollectionId })
        .then(() => {
          this.$router.push({ name: "Explore" });
        })
        .catch(e => {
          console.log("Error while deleting collection" + e);
        })
        .finally();
    },
  },
});
</script>
