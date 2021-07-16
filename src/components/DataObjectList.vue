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
        <div class="float-left">
          <div>
            <b>{{ dataObject.name }}</b> ID: {{ dataObject.id }}
          </div>
          <small>
            created at {{ dataObject.createdAt.toDateString() }} by
            {{ dataObject.createdBy }}
          </small>
        </div>
        <div class="icon">
          <references-icon title="References" />
          {{ dataObject.referenceIds.length }}
        </div>
        <div class="icon">
          <successor-icon title="Successors" />
          {{ dataObject.successorIds.length }}
        </div>
        <div class="icon">
          <predecessor-icon title="Predecessors" />
          {{ dataObject.predecessorIds.length }}
        </div>
        <div class="icon">
          <child-icon title="Children" />
          {{ dataObject.childrenIds.length }}
        </div>
        <div class="icon">
          <parent-icon title="Parents" />
          <a v-if="dataObject.parentId"> 1 </a>
          <a v-else> 0 </a>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from "vue";
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
    dataObjectIds: {
      type: Array as PropType<Array<number>>,
      default: () => {
        return [];
      },
    },
    parentId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      dataObjects: new Array<DataObject>(),
      currentDataObject: undefined,
    } as DataObjectListData;
  },
  mounted() {
    if (this.parentId === undefined) {
      this.retrieveDataObjects();
    } else {
      this.retrieveDataObjectsByParent();
    }
  },
  methods: {
    retrieveDataObjects() {
      this.dataObjectIds?.forEach(element => {
        this.dataObjectApi
          ?.getDataObject({
            collectionId: this.currentCollectionId,
            dataObjectId: element,
          })
          .then(response => {
            this.dataObjects.push(response);
          })
          .catch(e => {
            console.log("Error while fetching dataObject " + e);
          })
          .finally();
      });
    },
    retrieveDataObjectsByParent() {
      this.dataObjectApi
        ?.getAllDataObjects({
          collectionId: this.currentCollectionId,
          parentId: this.parentId,
        })
        .then(response => {
          this.dataObjects = response;
        })
        .catch(e => {
          console.log("Error while fetching dataObjects " + e);
        })
        .finally();
    },
  },
});
</script>

<style scoped>
.icon {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  float: right;
}
.float-left {
  float: left;
}
</style>
