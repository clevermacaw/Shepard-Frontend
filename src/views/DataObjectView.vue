<template>
  <div v-if="currentDataObject" class="dataObject">
    <b-button-group class="float-right">
      <b-button
        v-b-modal.create-dataObject-modal
        v-b-tooltip.hover
        title="Create"
        variant="primary"
      >
        <CreateIcon />
      </b-button>
      <b-button
        v-b-modal.edit-dataObject-modal
        v-b-tooltip.hover
        title="Edit"
        variant="light"
      >
        <EditIcon />
      </b-button>
      <b-button
        v-b-modal.data-object-delete-confirmation-modal
        v-b-tooltip.hover
        title="Delete"
        variant="dark"
      >
        <DeleteIcon />
      </b-button>
    </b-button-group>

    <h3>{{ currentDataObject.name }}</h3>
    <div>
      Data Object ID: {{ currentDataObject.id }}
      <CreatedByLine
        :created-at="currentDataObject.createdAt"
        :created-by="currentDataObject.createdBy"
      />
      <CreatedByLine
        v-if="currentDataObject.updatedBy"
        :created-at="currentDataObject.updatedAt"
        :created-by="currentDataObject.updatedBy"
        updated
      />
    </div>

    <b-row class="section">
      <b-col>
        <ParentIcon title="Parents" />
        <span v-if="currentDataObject.parentId"> 1 </span>
        <span v-else> 0 </span>
        Parents
      </b-col>
      <b-col>
        <ChildIcon title="Children" />
        {{ currentDataObject.childrenIds.length }} Children
      </b-col>
      <b-col>
        <PredecessorIcon title="Predecessors" />
        {{ currentDataObject.predecessorIds.length }} Predecessors
      </b-col>
      <b-col>
        <SuccessorIcon title="Successors" />
        {{ currentDataObject.successorIds.length }} Successors
      </b-col>
      <b-col>
        <ReferencesIcon title="References" />
        {{ currentDataObject.referenceIds.length }} References
      </b-col>
    </b-row>

    <GenericDescription
      v-if="currentDataObject.description"
      :text="currentDataObject.description"
    />

    <GenericCollapse v-if="attributeItems.length" title="Attributes" visible>
      <b-table striped small :items="attributeItems"> </b-table>
    </GenericCollapse>

    <GenericCollapse title="Related Objects" visible>
      <RelatedObjectsTable :current-data-object="currentDataObject" />
    </GenericCollapse>

    <GenericCollapse title="References" visible>
      <ReferencesTable :current-data-object="currentDataObject" />
    </GenericCollapse>

    <DataObjectModal
      :current-collection-id="currentCollectionId"
      :current-data-object="currentDataObject"
      modal-id="edit-dataObject-modal"
      modal-name="Edit Data Object"
      @dataObjectChanged="retrieveDataObject()"
    />
    <DataObjectModal
      :current-collection-id="currentCollectionId"
      :current-data-object="{ parentId: currentDataObject.id }"
      modal-id="create-dataObject-modal"
      modal-name="Create Data Object"
    />
    <DeleteConfirmationModal
      modal-id="data-object-delete-confirmation-modal"
      modal-name="Confirm to delete data object"
      :modal-text="
        'Do you really want do delete the data object with name ' +
        currentDataObject.name +
        '?'
      "
      @confirmation="handleDelete()"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectVue } from "@/utils/api-mixin";
import GenericCollapse from "@/components/generic/GenericCollapse.vue";
import GenericDescription from "@/components/generic/GenericDescription.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import DataObjectModal from "@/components/dataobjects/DataObjectModal.vue";
import ReferencesTable from "@/components/references/ReferencesTable.vue";
import RelatedObjectsTable from "@/components/dataobjects/RelatedObjectsTable.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

interface DataObjectData {
  currentDataObject?: DataObject;
  attributeItems: Array<{ key: string; value: string }>;
  screenWidth: number;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectVue>>
).extend({
  components: {
    GenericCollapse,
    GenericDescription,
    CreatedByLine,
    DataObjectModal,
    ReferencesTable,
    RelatedObjectsTable,
    DeleteConfirmationModal,
  },
  mixins: [DataObjectVue],
  data() {
    return {
      currentDataObject: undefined,
      attributeItems: [],
      screenWidth: 0,
    } as DataObjectData;
  },
  computed: {
    currentCollectionId(): number {
      return Number(this.$router.currentRoute.params.collectionId);
    },
    currentDataObjectId(): number {
      return Number(this.$router.currentRoute.params.dataObjectId);
    },
  },
  mounted() {
    this.retrieveDataObject();
    this.screenWidth = window.innerWidth;
  },
  methods: {
    retrieveDataObject() {
      this.dataObjectApi
        ?.getDataObject({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.currentDataObject = response;
          this.attributeItems = [];
          if (this.currentDataObject.attributes !== undefined) {
            Object.entries(this.currentDataObject.attributes).forEach(
              ([key, value]) =>
                this.attributeItems.push({ key: key, value: value }),
            );
          }
        })
        .catch(e => {
          console.log("Error while fetching dataObject: " + e.statusText);
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
          console.log("Error while deleting dataObject: " + e.statusText);
        })
        .finally();
    },
  },
});
</script>

<style scoped>
.section {
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
