<template>
  <div class="list">
    <b-list-group>
      <b-list-group-item
        v-for="(structuredDataItem, index) in structuredDataList"
        :key="index"
        class="list-group-item list-group-item-action"
      >
        <div>
          <b>{{ structuredDataItem.name }}</b>
          | ID: {{ structuredDataItem.id }} | Container:
          {{ structuredDataItem.structuredDataContainerId }}
        </div>

        <small>
          created at {{ structuredDataItem.createdAt.toDateString() }} by
          {{ structuredDataItem.createdBy }}
        </small>
        <b-table
          striped
          hover
          small
          :items="structuredDataItem.structuredDatas"
        >
        </b-table>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { StructuredDataReference } from "@dlr-shepard/shepard-client";
import { StructuredDataReferenceVue } from "@/utils/api-mixin";

declare interface StructuredDataListData {
  structuredDataList: StructuredDataReference[];
  currentStructuredData?: StructuredDataReference;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataReferenceVue>>
).extend({
  mixins: [StructuredDataReferenceVue],
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
      structuredDataList: new Array<StructuredDataReference>(),
      currentStructuredData: undefined,
    } as StructuredDataListData;
  },
  mounted() {
    this.retrieveStructuredData();
  },
  methods: {
    retrieveStructuredData() {
      this.structuredDataReferenceApi
        ?.getAllStructuredDataReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.structuredDataList = response;
        })
        .catch(e => {
          console.log("Error while fetching StructuredData References" + e);
        })
        .finally();
    },
  },
});
</script>
