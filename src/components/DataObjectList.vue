<template>
  <div class="list">
    <b-list-group>
      <b-list-group-item
        v-for="(dataObject, index) in dataObjects"
        :key="index"
        :to="{
          name: 'DataObject',
          params: {
            collectionId: currentCollectionId,
            dataObjectId: dataObject.id,
          },
        }"
        append
        class="list-group-item list-group-item-action"
      >
        <div>
          <b>{{ dataObject.name }}</b> ID: {{ dataObject.id }}
        </div>

        <small>
          created at {{ dataObject.createdAt.toDateString() }} by
          {{ dataObject.createdBy }}
        </small>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectVue } from "@/utils/api-mixin";

declare interface DataObjectListData {
  dataObjects: DataObject[];
  currentDataObject?: DataObject;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectVue>>
).extend({
  mixins: [DataObjectVue],
  props: {
    currentCollectionId: {
      type: Number,
      default: undefined,
    },
    parentId: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      dataObjects: new Array<DataObject>(),
      currentDataObject: undefined,
    } as DataObjectListData;
  },
  mounted() {
    this.retrieveDataObjects();
  },
  methods: {
    retrieveDataObjects() {
      this.dataObjectApi
        ?.getAllDataObjects({
          collectionId: this.currentCollectionId,
          parentId: this.parentId,
        })
        .then(response => {
          this.dataObjects = response;
        })
        .catch(e => {
          console.log("Error while fetching dataObjects" + e);
        })
        .finally();
    },
  },
});
</script>
