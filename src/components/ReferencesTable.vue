<template>
  <b-card no-body>
    <b-tabs card>
      <b-tab title="Timeseries" :disabled="!hasTimeReference">
        <TimeseriesList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>

      <b-tab title="Strucured Data" :disabled="!hasStructuredDataReference">
        <StructuredDataList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>

      <b-tab title="File" :disabled="!hasFileReference">
        <FileList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>

      <b-tab title="Meta Data" :disabled="!hasMetaDataReference"> </b-tab>

      <b-tab title="URI" :disabled="!hasURIReference"> </b-tab>

      <b-tab title="Data Object" :disabled="!hasDataObjectReference"> </b-tab>
    </b-tabs>
  </b-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { BasicReference, DataObject } from "@dlr-shepard/shepard-client";
import { ReferenceVue } from "@/utils/api-mixin";
import TimeseriesList from "@/components/TimeseriesList.vue";
import StructuredDataList from "@/components/StructuredDataList.vue";
import FileList from "@/components/FileList.vue";

interface DataObjectData {
  currentReferences: BasicReference[];
  hasTimeReference: boolean;
  hasStructuredDataReference: boolean;
  hasFileReference: boolean;
  hasMetaDataReference: boolean; // noch nicht implementiert
  hasURIReference: boolean; // noch nicht implementiert
  hasDataObjectReference: boolean; // noch nicht implementiert
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof ReferenceVue>>
).extend({
  components: {
    TimeseriesList,
    StructuredDataList,
    FileList,
  },
  mixins: [ReferenceVue],
  props: {
    currentDataObject: {
      type: Object as () => DataObject,
      default: undefined,
    },
  },
  data() {
    return {
      currentReferences: [],
      hasTimeReference: false,
      hasStructuredDataReference: false,
      hasFileReference: false,
      hasMetaDataReference: false, // noch nicht implementiert
      hasURIReference: false, // noch nicht implementiert
      hasDataObjectReference: false, // noch nicht implementiert
    } as DataObjectData;
  },
  mounted() {
    this.retrieveReferences();
  },
  methods: {
    retrieveReferences() {
      if (!this.currentDataObject.id || !this.currentDataObject.collectionId)
        return;
      this.referenceApi
        ?.getAllReferences({
          collectionId: this.currentDataObject.collectionId,
          dataObjectId: this.currentDataObject.id,
        })
        .then(response => {
          this.currentReferences = response;
          this.currentReferences.forEach(item => {
            if (item.type === "TimeseriesReference") {
              this.hasTimeReference = true;
            }
            if (item.type === "StructuredDataReference") {
              this.hasStructuredDataReference = true;
            }
            if (item.type === "FileReference") {
              this.hasFileReference = true;
            }
            if (item.type === "MetaDataReference") {
              // noch nicht implementiert
              this.hasMetaDataReference = true;
            }
            if (item.type === "URIReference") {
              // noch nicht implementiert
              this.hasURIReference = true;
            }
            if (item.type === "DataObjectReference") {
              // noch nicht implementiert
              this.hasDataObjectReference = true;
            }
          });
        })
        .catch(e => {
          console.log("Error while fetching references " + e);
        })
        .finally();
    },
  },
});
</script>
