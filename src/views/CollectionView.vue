<template>
  <div v-if="currentCollection" class="collection">
    <div>
      <b-button-group class="float-right">
        <b-button v-b-modal.create-data-object-modal variant="primary">
          <create-icon />
        </b-button>
        <b-button v-b-modal.edit-collection-modal variant="light">
          <edit-icon />
        </b-button>
        <b-button v-b-modal.delete-confirmation-modal variant="dark">
          <delete-icon />
        </b-button>
      </b-button-group>
      <h3>{{ currentCollection.name }}</h3>
    </div>
    <p>
      Object ID: {{ currentCollection.id }}
      <br />
      <small v-if="currentCollection.createdAt">
        created at {{ currentCollection.createdAt.toDateString() }}
      </small>
      <small v-if="currentCollection.createdBy">
        by {{ currentCollection.createdBy }}
      </small>
      <br />
      <small v-if="currentCollection.updatedAt">
        updated at {{ currentCollection.updatedAt.toDateString() }}
      </small>
      <small v-if="currentCollection.updatedBy">
        by {{ currentCollection.updatedBy }}
      </small>
    </p>

    <div v-if="currentCollection.description">
      <h4>Description</h4>
      <div class="description">
        <div v-if="currentCollection.description.length < 300">
          {{ currentCollection.description }}
        </div>
        <div v-else>
          <a v-if="readMore">
            {{ currentCollection.description }}
          </a>
          <a v-else>
            {{ currentCollection.description.substring(0, 300) + "..." }}
          </a>
          <a @click="readMore = !readMore">
            <span v-if="readMore" class="moreorless">Read Less</span>
            <span v-else class="moreorless">Read More</span>
          </a>
        </div>
      </div>
    </div>

    <GenericCollapse v-if="attributeItems.length" title="Attributes" visible>
      <b-table striped small hover :items="attributeItems"> </b-table>
    </GenericCollapse>

    <GenericCollapse
      v-if="currentCollection.dataObjectIds.length"
      title="Data Objects"
      visible
    >
      <DataObjectList
        :current-collection-id="currentCollectionId"
        :parent-id="-1"
      />
    </GenericCollapse>

    <CollectionModal
      :current-collection="currentCollection"
      modal-id="edit-collection-modal"
      modal-name="Edit Collection"
      @collectionChanged="retrieveCollection()"
    />
    <DataObjectModal
      :current-collection-id="currentCollectionId"
      modal-id="create-data-object-modal"
      modal-name="Create Data Object"
    />
    <DeleteConfirmationModal
      modal-id="delete-confirmation-modal"
      modal-name="Confirm to delete collection"
      :modal-text="
        'Do you really want do delete the collection with name ' +
        currentCollection.name +
        '?'
      "
      @confirmation="handleDelete()"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import DataObjectList from "@/components/DataObjectList.vue";
import CollectionModal from "@/components/CollectionModal.vue";
import DataObjectModal from "@/components/DataObjectModal.vue";
import GenericCollapse from "@/components/GenericCollapse.vue";
import { Collection } from "@dlr-shepard/shepard-client";
import { CollectionVue } from "@/utils/api-mixin";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

interface CollectionData {
  currentCollection?: Collection;
  attributeItems: Array<{ key: string; value: string }>;
  readMore: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  components: {
    GenericCollapse,
    DataObjectList,
    DataObjectModal,
    CollectionModal,
    DeleteConfirmationModal,
  },
  mixins: [CollectionVue],
  data() {
    return {
      currentCollection: undefined,
      attributeItems: [],
      readMore: false,
    } as CollectionData;
  },
  computed: {
    currentCollectionId(): number {
      return Number(this.$router.currentRoute.params.collectionId);
    },
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
          this.attributeItems = [];
          if (this.currentCollection.attributes !== undefined) {
            Object.entries(this.currentCollection.attributes).forEach(
              ([key, value]) =>
                this.attributeItems.push({ key: key, value: value }),
            );
          }
        })
        .catch(e => {
          console.log("Error while fetching collection " + e);
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
          console.log("Error while deleting collection " + e);
        })
        .finally();
    },
  },
});
</script>

<style scoped>
h3 {
  font-weight: bold;
}
h4 {
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
