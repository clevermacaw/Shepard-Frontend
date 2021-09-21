<template>
  <div class="list">
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
          <small>
            <b>{{ referencedList[dataObjectItem.id].name }}</b> | ID:
            {{ referencedList[dataObjectItem.id].id }}
          </small>
        </b-link>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { DataObjectReference, DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectReferenceVue } from "@/utils/api-mixin";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

declare interface DataObjectListData {
  dataObjectList: DataObjectReference[];
  referencedList: { [key: number]: DataObject };
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectReferenceVue>>
).extend({
  components: { CreatedByLine },
  mixins: [DataObjectReferenceVue],
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
  },
});
</script>
