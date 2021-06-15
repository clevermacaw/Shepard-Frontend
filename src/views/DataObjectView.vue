<template>
  <div v-if="currentDataObject" class="dataObject">
    <GenericCollapse title="DataObject" visible>
      <p>
        Name: <b>{{ currentDataObject.name }}</b> ID: {{ currentDataObject.id }}
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
      </p>

      <p>
        <i>{{ currentDataObject.description }}</i>
      </p>

      <h4>Attributes</h4>
      <ul>
        <li v-for="(value, key) in currentDataObject.attributes" :key="key">
          <b>{{ key }}:</b> {{ value }}
        </li>
      </ul>
    </GenericCollapse>

    <GenericCollapse title="Children" visible>
      <DataObjectList
        :current-collection-id="currentCollectionId"
        :parent-id="currentDataObjectId"
      />
    </GenericCollapse>

    <GenericCollapse title="Timeseries References" visible>
      <TimeseriesList
        :current-collection-id="currentCollectionId"
        :current-data-object-id="currentDataObjectId"
      />
    </GenericCollapse>

    <GenericCollapse title="Strucured Data References" visible>
      <StructuredDataList
        :current-collection-id="currentCollectionId"
        :current-data-object-id="currentDataObjectId"
      />
    </GenericCollapse>

    <GenericCollapse title="File References" visible>
      <FileList
        :current-collection-id="currentCollectionId"
        :current-data-object-id="currentDataObjectId"
      />
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
import { DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectVue } from "@/utils/api-mixin";
import DataObjectList from "@/components/DataObjectList.vue";
import TimeseriesList from "@/components/TimeseriesList.vue";
import StructuredDataList from "@/components/StructuredDataList.vue";
import FileList from "@/components/FileList.vue";

interface DataObjectData {
  currentDataObject?: DataObject;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectVue>>
).extend({
  components: {
    GenericCollapse,
    DataObjectEdit,
    DataObjectList,
    TimeseriesList,
    StructuredDataList,
    FileList,
  },
  mixins: [DataObjectVue],
  data() {
    return {
      currentDataObject: undefined,
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
        })
        .catch(e => {
          console.log("Error while fetching dataObject" + e);
        })
        .finally();
    },
  },
});
</script>
