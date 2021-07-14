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
        <b-row>
          <b-col>
            <small>
              created at {{ dataObject.createdAt.toDateString() }} by
              {{ dataObject.createdBy }}
            </small>
          </b-col>
          <b-col>
            <a v-if="dataObject.parentId" class="list">
              <parent-icon title="Parent" /> 1
            </a>
            <a class="list">
              <child-icon title="Children" />
              {{ dataObject.childrenIds.length }}
            </a>
            <a class="list">
              <predecessor-icon title="Predecessors" />
              {{ dataObject.predecessorIds.length }}
            </a>
            <a class="list">
              <successor-icon title="Successors" />
              {{ dataObject.successorIds.length }}
            </a>
            <a class="list">
              <references-icon title="References" />
              {{ dataObject.referenceIds.length }}
            </a>
          </b-col>
        </b-row>
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
.list {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
