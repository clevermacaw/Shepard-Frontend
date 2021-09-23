<template>
  <b-card no-body>
    <b-tabs card>
      <b-tab title="Parent" :disabled="!parentIds.length">
        <DataObjectList
          :current-collection-id="currentDataObject.collectionId"
          :data-object-ids="parentIds"
        />
      </b-tab>
      <b-tab title="Children" :disabled="!childrenIds.length">
        <ChildrenList
          :current-collection-id="currentDataObject.collectionId"
          :parent-id="currentDataObject.id"
          :max-objects="childrenIds.length"
        />
      </b-tab>
      <b-tab title="Predecessors" :disabled="!predecessorIds.length">
        <DataObjectList
          :current-collection-id="currentDataObject.collectionId"
          :data-object-ids="predecessorIds"
        />
      </b-tab>
      <b-tab title="Successors" :disabled="!successorIds.length">
        <DataObjectList
          :current-collection-id="currentDataObject.collectionId"
          :data-object-ids="successorIds"
        />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script lang="ts">
import Vue from "vue";
import { DataObject } from "@dlr-shepard/shepard-client";
import DataObjectList from "@/components/dataobjects/DataObjectList.vue";
import ChildrenList from "@/components/dataobjects/ChildrenList.vue";

interface RelatedObjectsTableData {
  parentIds: number[];
  childrenIds: number[];
  predecessorIds: number[];
  successorIds: number[];
}

export default Vue.extend({
  components: { DataObjectList, ChildrenList },
  props: {
    currentDataObject: {
      type: Object as () => DataObject,
      required: true,
    },
  },
  data() {
    return {
      parentIds: this.currentDataObject.parentId
        ? [this.currentDataObject.parentId]
        : [],
      childrenIds: this.currentDataObject.childrenIds || [],
      predecessorIds: this.currentDataObject.predecessorIds || [],
      successorIds: this.currentDataObject.successorIds || [],
    } as RelatedObjectsTableData;
  },
});
</script>
