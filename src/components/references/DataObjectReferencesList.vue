<template>
  <div class="list">
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
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { DataObjectReference, DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectReferenceVue } from "@/utils/api-mixin";
import DataObjectReferenceModal from "@/components/references/DataObjectReferenceModal.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

declare interface DataObjectListData {
  dataObjectList: DataObjectReference[];
  referencedList: { [key: number]: DataObject };
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectReferenceVue>>
).extend({
  components: { CreatedByLine, DataObjectReferenceModal },
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
        })
        .catch(e => {
          console.log("Error while creating DataObjectReference " + e);
        })
        .finally();
    },
  },
});
</script>
