<template>
  <div v-if="currentDataObject" class="dataObject">
    <h3>{{ currentDataObject.name }}</h3>
    <div>
      Object ID: {{ currentDataObject.id }}
      <br />
      <small v-if="currentDataObject.createdAt">
        created at {{ currentDataObject.createdAt.toDateString() }}
      </small>
      <small v-if="currentDataObject.createdBy">
        by {{ currentDataObject.createdBy }}
      </small>
      <br />
      <small v-if="currentDataObject.updatedAt">
        updated at {{ currentDataObject.updatedAt.toDateString() }}
      </small>
      <small v-if="currentDataObject.updatedBy">
        by {{ currentDataObject.updatedBy }}
      </small>
    </div>

    <b-row class="section">
      <b-col v-if="currentDataObject.parentId">
        <parent-icon title="Parent" /> Parent
      </b-col>
      <b-col>
        <child-icon title="Children" />
        {{ currentDataObject.childrenIds.length }} Children</b-col
      >
      <b-col>
        <predecessor-icon title="Predecessors" />
        {{ currentDataObject.predecessorIds.length }} Predecessors</b-col
      >
      <b-col>
        <successor-icon title="Successors" />
        {{ currentDataObject.successorIds.length }} Successors</b-col
      >
      <b-col>
        <references-icon title="References" />
        {{ currentDataObject.referenceIds.length }} References
      </b-col>
    </b-row>

    <div v-if="currentDataObject.description">
      <h4>Description</h4>
      <div class="description">
        <div v-if="currentDataObject.description.length < 300">
          {{ currentDataObject.description }}
        </div>
        <div v-else>
          <a v-if="readMore">
            {{ currentDataObject.description }}
          </a>
          <a v-else>
            {{ currentDataObject.description.substring(0, 300) + "..." }}
          </a>
          <a @click="readMore = !readMore">
            <span v-if="readMore" class="moreorless">Read Less</span>
            <span v-else class="moreorless">Read More</span>
          </a>
        </div>
      </div>
    </div>

    <div v-if="hasAttribute">
      <h4>Attributes</h4>
      <ul>
        <li v-for="(value, key) in currentDataObject.attributes" :key="key">
          <b>{{ key }}:</b> {{ value }}
        </li>
      </ul>
    </div>

    <GenericCollapse title="Related Objects" visible>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Parent" :disabled="!currentDataObject.parentId">
            <DataObjectList
              :current-collection-id="currentCollectionId"
              :data-object-ids="
                currentDataObject.parentId ? [currentDataObject.parentId] : []
              "
            />
          </b-tab>
          <b-tab
            title="Children"
            :disabled="!currentDataObject.childrenIds.length"
          >
            <DataObjectList
              :current-collection-id="currentCollectionId"
              :parent-id="currentDataObjectId"
            />
          </b-tab>
          <b-tab
            title="Predecessors"
            :disabled="!currentDataObject.predecessorIds.length"
          >
            <DataObjectList
              :current-collection-id="currentCollectionId"
              :data-object-ids="currentDataObject.predecessorIds"
            />
          </b-tab>
          <b-tab
            title="Successors"
            :disabled="!currentDataObject.successorIds.length"
          >
            <DataObjectList
              :current-collection-id="currentCollectionId"
              :data-object-ids="currentDataObject.successorIds"
            />
          </b-tab>
        </b-tabs>
      </b-card>
    </GenericCollapse>

    <GenericCollapse title="References" visible>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="Timeseries" :disabled="!hasTimeReference">
            <TimeseriesList
              :current-collection-id="currentCollectionId"
              :current-data-object-id="currentDataObjectId"
            />
          </b-tab>

          <b-tab title="Strucured Data" :disabled="!hasStructuredDataReference">
            <StructuredDataList
              :current-collection-id="currentCollectionId"
              :current-data-object-id="currentDataObjectId"
            />
          </b-tab>

          <b-tab title="File" :disabled="!hasFileReference">
            <FileList
              :current-collection-id="currentCollectionId"
              :current-data-object-id="currentDataObjectId"
            />
          </b-tab>

          <b-tab title="Meta Data" :disabled="!hasMetaDataReference"> </b-tab>

          <b-tab title="URI" :disabled="!hasURIReference"> </b-tab>

          <b-tab title="Data Object" :disabled="!hasDataObjectReference">
          </b-tab>
        </b-tabs>
      </b-card>
    </GenericCollapse>

    <div class="component">
      <h4>Edit</h4>
      <DataObjectEdit
        :current-collection-id="currentCollectionId"
        :current-data-object-id="currentDataObjectId"
        @dataObjectChanged="retrieveDataObject()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import DataObjectEdit from "@/components/DataObjectEdit.vue";
import GenericCollapse from "@/components/GenericCollapse.vue";
import {
  DataObject,
  BasicReference,
  ReferenceApi,
  DataObjectApi,
} from "@dlr-shepard/shepard-client";
import { DataObjectVue, ReferenceVue } from "@/utils/api-mixin";
import DataObjectList from "@/components/DataObjectList.vue";
import TimeseriesList from "@/components/TimeseriesList.vue";
import StructuredDataList from "@/components/StructuredDataList.vue";
import FileList from "@/components/FileList.vue";

interface DataObjectData {
  currentDataObject?: DataObject;
  currentReferences: BasicReference[];
  hasTimeReference: boolean;
  hasStructuredDataReference: boolean;
  hasFileReference: boolean;
  hasAttribute: boolean;
  hasMetaDataReference: boolean; // noch nicht implementiert
  hasURIReference: boolean; // noch nicht implementiert
  hasDataObjectReference: boolean; // noch nicht implementiert
  screenWidth: number;
  readMore: boolean;
}

export default (
  Vue as VueConstructor<
    Vue & InstanceType<typeof DataObjectVue> & InstanceType<typeof ReferenceVue>
  >
).extend({
  components: {
    GenericCollapse,
    DataObjectEdit,
    DataObjectList,
    TimeseriesList,
    StructuredDataList,
    FileList,
  },
  mixins: [DataObjectVue, ReferenceVue],
  data() {
    return {
      currentDataObject: undefined,
      currentReferences: [],
      hasTimeReference: false,
      hasStructuredDataReference: false,
      hasFileReference: false,
      hasAttribute: false,
      hasMetaDataReference: false, // noch nicht implementiert
      hasURIReference: false, // noch nicht implementiert
      hasDataObjectReference: false, // noch nicht implementiert
      screenWidth: 0,
      readMore: false,
    } as DataObjectData;
  },
  computed: {
    currentCollectionId(): number {
      return Number(this.$router.currentRoute.params.collectionId);
    },
    currentDataObjectId(): number {
      return Number(this.$router.currentRoute.params.dataObjectId);
    },
  },
  mounted() {
    this.retrieveDataObject();
    this.screenWidth = window.innerWidth;
  },
  methods: {
    retrieveDataObject() {
      this.dataObjectApi
        ?.getDataObject({
          collectionId: this.currentCollectionId,
          dataObjectId: Number(this.$router.currentRoute.params.dataObjectId),
        })
        .then(response => {
          this.currentDataObject = response;

          if (this.currentDataObject.attributes !== undefined) {
            if (Object.keys(this.currentDataObject?.attributes).length > 0) {
              this.hasAttribute = true;
            }
          }
        })
        .catch(e => {
          console.log("Error while fetching dataObject" + e);
        })
        .finally();

      this.referenceApi
        ?.getAllReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: Number(this.$router.currentRoute.params.dataObjectId),
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
          console.log("Error while fetching references" + e);
        })
        .finally();
    },

    // we have to overwrite createApi() since we extend two Apis
    createApi() {
      this.referenceApi = new ReferenceApi(this.config);
      this.dataObjectApi = new DataObjectApi(this.config);
    },
  },
});
</script>

<style scoped>
h3 {
  font-weight: bold;
}
h4 {
  margin-top: 30px;
  margin-bottom: 10px;
}

.section {
  margin-top: 30px;
  margin-bottom: 10px;
}

.description {
  font-style: italic;
  text-align: justify;
}

.moreorless {
  font-style: italic;
  color: blue;
}
</style>
