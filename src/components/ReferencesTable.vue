<template>
  <b-card no-body>
    <b-tabs card>
      <b-tab title="Timeseries" :disabled="!hasTimeReference">
        <TimeseriesReferencesList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>

      <b-tab title="Strucured Data" :disabled="!hasStructuredDataReference">
        <StructuredDataReferencesList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>

      <b-tab title="File" :disabled="!hasFileReference">
        <FileReferencesList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>

      <b-tab title="URI" :disabled="!hasURIReference">
        <UriReferencesList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>

      <b-tab title="Collection" :disabled="!hasCollectionReference"> </b-tab>

      <b-tab title="Data Object" :disabled="!hasDataObjectReference"> </b-tab>
    </b-tabs>
  </b-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { BasicReference, DataObject } from "@dlr-shepard/shepard-client";
import { ReferenceVue } from "@/utils/api-mixin";
import TimeseriesReferencesList from "@/components/TimeseriesReferencesList.vue";
import StructuredDataReferencesList from "@/components/StructuredDataReferencesList.vue";
import FileReferencesList from "@/components/FileReferencesList.vue";
import UriReferencesList from "@/components/UriReferencesList.vue";

interface DataObjectData {
  currentReferences: BasicReference[];
  hasTimeReference: boolean;
  hasStructuredDataReference: boolean;
  hasFileReference: boolean;
  hasURIReference: boolean; // not yet implemented
  hasCollectionReference: boolean; // not yet implemented
  hasDataObjectReference: boolean; // not yet implemented
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof ReferenceVue>>
).extend({
  components: {
    TimeseriesReferencesList,
    StructuredDataReferencesList,
    FileReferencesList,
    UriReferencesList,
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
      hasURIReference: false, // not yet implemented
      hasCollectionReference: false, // not yet implemented
      hasDataObjectReference: false, // not yet implemented
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
            switch (item.type) {
              case "TimeseriesReference":
                this.hasTimeReference = true;
                break;
              case "StructuredDataReference":
                this.hasStructuredDataReference = true;
                break;
              case "FileReference":
                this.hasFileReference = true;
                break;
              case "URIReference":
                this.hasURIReference = true;
                break;
              case "CollectionReference": // not yet implemented
                this.hasCollectionReference = true;
                break;
              case "DataObjectReference": // not yet implemented
                this.hasDataObjectReference = true;
                break;
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
