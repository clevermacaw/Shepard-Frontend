<template>
  <div class="list">
    <b-alert
      :show="showCreate"
      dismissible
      variant="success"
      @dismissed="showCreate = false"
    >
      Successfully created
    </b-alert>
    <b-alert
      :show="showDelete"
      dismissible
      variant="danger"
      @dismissed="showDelete = false"
    >
      Successfully deleted
    </b-alert>

    <b-button
      v-b-modal.create-data-object-ref-modal
      class="mb-3"
      variant="primary"
    >
      Create new Reference
    </b-button>

    <DataObjectReferenceModal
      :current-collection-id="currentCollectionId"
      :current-data-object-id="currentDataObjectId"
      modal-id="create-data-object-ref-modal"
      modal-name="Create DataObject Reference"
      @create="create($event)"
    />

    <b-list-group>
      <b-list-group-item
        v-for="(dataObjectItem, index) in dataObjectList"
        :key="index"
      >
        <div>
          <b>{{ dataObjectItem.name }}</b> | ID: {{ dataObjectItem.id }}
          <b-button
            v-b-modal.data-object-reference-delete-confirmation-modal
            v-b-tooltip.hover
            class="float-right"
            title="Delete"
            variant="dark"
            @click="currentDataObjectReference = dataObjectItem"
          >
            <DeleteIcon />
          </b-button>
        </div>
        <CreatedByLine
          :created-by="dataObjectItem.createdBy"
          :created-at="dataObjectItem.createdAt"
        />
        <small>
          {{ dataObjectItem.relationship }}:
          <b-link
            v-if="referencedList[dataObjectItem.id]"
            :to="{
              name: 'DataObject',
              params: {
                collectionId: referencedList[dataObjectItem.id].collectionId,
                dataObjectId: dataObjectItem.referencedDataObjectId,
              },
            }"
          >
            <b>{{ referencedList[dataObjectItem.id].name }}</b> | ID:
            {{ referencedList[dataObjectItem.id].id }}
          </b-link>
        </small>
      </b-list-group-item>
    </b-list-group>

    <DeleteConfirmationModal
      v-if="currentDataObjectReference"
      modal-id="data-object-reference-delete-confirmation-modal"
      modal-name="Confirm to delete Data Object Reference"
      :modal-text="
        'Do you really want do delete the Data Object Reference with name ' +
        currentDataObjectReference.name +
        '?'
      "
      @confirmation="handleDelete(currentDataObjectReference.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { DataObjectReference, DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectReferenceVue } from "@/utils/api-mixin";
import DataObjectReferenceModal from "@/components/references/DataObjectReferenceModal.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

declare interface DataObjectListData {
  dataObjectList: DataObjectReference[];
  referencedList: { [key: number]: DataObject };
  currentDataObjectReference?: DataObjectReference;
  showCreate: boolean;
  showDelete: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectReferenceVue>>
).extend({
  components: {
    CreatedByLine,
    DataObjectReferenceModal,
    DeleteConfirmationModal,
  },
  mixins: [DataObjectReferenceVue],
  props: {
    currentCollectionId: {
      type: Number,
      required: true,
    },
    currentDataObjectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dataObjectList: new Array<DataObjectReference>(),
      referencedList: {},
      currentDataObjectReference: undefined,
      showCreate: false,
      showDelete: false,
    } as DataObjectListData;
  },
  mounted() {
    this.retrieveReferences();
  },
  methods: {
    retrieveReferences() {
      this.dataObjectReferenceApi
        ?.getAllDataObjectReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.dataObjectList = response;
          response.forEach(reference => {
            if (reference.id) this.retrieveDataObject(reference.id);
          });
        })
        .catch(e => {
          console.log("Error while fetching DataObject References " + e);
        })
        .finally();
    },
    retrieveDataObject(referenceId: number) {
      this.dataObjectReferenceApi
        ?.getDataObjectReferencePayload({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          dataObjectReferenceId: referenceId,
        })
        .then(response => {
          const temp: { [key: number]: DataObject } = {};
          temp[referenceId] = response;
          this.referencedList = { ...this.referencedList, ...temp };
        })
        .catch(e => {
          console.log("Error while fetching DataObject Reference Payload " + e);
        })
        .finally();
    },

    create(newReference: DataObjectReference) {
      this.dataObjectReferenceApi
        ?.createDataObjectReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          dataObjectReference: newReference,
        })
        .then(response => {
          this.dataObjectList = [response].concat(this.dataObjectList);
          if (response.id) this.retrieveDataObject(response.id);
          this.showCreate = true;
        })
        .catch(e => {
          console.log("Error while creating DataObjectReference " + e);
        })
        .finally();
    },

    handleDelete(dataObjectReferenceId: number) {
      this.dataObjectReferenceApi
        ?.deleteDataObjectReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          dataObjectReferenceId: dataObjectReferenceId,
        })
        .then(() => {
          this.retrieveReferences();
          this.showDelete = true;
        })
        .catch(e => {
          console.log("Error while deleting Data Object Reference " + e);
        })
        .finally();
    },
  },
});
</script>
