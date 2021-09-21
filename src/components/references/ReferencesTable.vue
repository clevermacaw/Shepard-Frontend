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

      <b-tab title="Collection" :disabled="!hasCollectionReference">
        <CollectionReferencesList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>

      <b-tab title="Data Object" :disabled="!hasDataObjectReference">
        <DataObjectReferencesList
          :current-collection-id="currentDataObject.collectionId"
          :current-data-object-id="currentDataObject.id"
        />
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { BasicReference, DataObject } from "@dlr-shepard/shepard-client";
import { ReferenceVue } from "@/utils/api-mixin";
import TimeseriesReferencesList from "@/components/references/TimeseriesReferencesList.vue";
import StructuredDataReferencesList from "@/components/references/StructuredDataReferencesList.vue";
import FileReferencesList from "@/components/references/FileReferencesList.vue";
import UriReferencesList from "@/components/references/UriReferencesList.vue";
import CollectionReferencesList from "@/components/references/CollectionReferencesList.vue";
import DataObjectReferencesList from "@/components/references/DataObjectReferencesList.vue";

interface DataObjectData {
  currentReferences: BasicReference[];
  hasTimeReference: boolean;
  hasStructuredDataReference: boolean;
  hasFileReference: boolean;
  hasURIReference: boolean;
  hasCollectionReference: boolean;
  hasDataObjectReference: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof ReferenceVue>>
).extend({
  components: {
    TimeseriesReferencesList,
    StructuredDataReferencesList,
    FileReferencesList,
    UriReferencesList,
    CollectionReferencesList,
    DataObjectReferencesList,
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
      hasURIReference: false,
      hasCollectionReference: false,
      hasDataObjectReference: false,
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
              case "CollectionReference":
                this.hasCollectionReference = true;
                break;
              case "DataObjectReference":
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
