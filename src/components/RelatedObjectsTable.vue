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
        <DataObjectList
          :current-collection-id="currentDataObject.collectionId"
          :parent-id="currentDataObject.id"
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
import Vue, { VueConstructor } from "vue";
import { DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectVue } from "@/utils/api-mixin";
import DataObjectList from "@/components/DataObjectList.vue";

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectVue>>
).extend({
  components: { DataObjectList },
  mixins: [DataObjectVue],
  props: {
    currentDataObject: {
      type: Object as () => DataObject,
      default: undefined,
    },
  },
  methods: {},
});
</script>
