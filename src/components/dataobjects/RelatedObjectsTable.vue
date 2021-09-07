<template>
  <b-card no-body>
    <b-tabs card>
      <b-tab title="Parent" :disabled="!currentDataObject.parentId">
        <DataObjectList
          :current-collection-id="currentDataObject.collectionId"
          :data-object-ids="
            currentDataObject.parentId ? [currentDataObject.parentId] : []
          "
        />
      </b-tab>
      <b-tab title="Children" :disabled="!currentDataObject.childrenIds.length">
        <ChildrenList
          :current-collection-id="currentDataObject.collectionId"
          :parent-id="currentDataObject.id"
          :max-objects="currentDataObject.childrenIds.length"
        />
      </b-tab>
      <b-tab
        title="Predecessors"
        :disabled="!currentDataObject.predecessorIds.length"
      >
        <DataObjectList
          :current-collection-id="currentDataObject.collectionId"
          :data-object-ids="currentDataObject.predecessorIds"
        />
      </b-tab>
      <b-tab
        title="Successors"
        :disabled="!currentDataObject.successorIds.length"
      >
        <DataObjectList
          :current-collection-id="currentDataObject.collectionId"
          :data-object-ids="currentDataObject.successorIds"
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

export default Vue.extend({
  components: { DataObjectList, ChildrenList },
  props: {
    currentDataObject: {
      type: Object as () => DataObject,
      default: undefined,
    },
  },
  methods: {},
});
</script>
