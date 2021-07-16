<template>
  <div v-if="currentDataObject" class="dataObject">
    <b-button-group class="float-right">
      <b-button v-b-modal.edit-dataObject-modal variant="light">
        <edit-icon />
      </b-button>
      <b-button variant="dark" @click="handleDelete">
        <delete-icon />
      </b-button>
    </b-button-group>

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
      <RelatedObjectsTable :current-data-object="currentDataObject" />
    </GenericCollapse>

    <GenericCollapse title="References" visible>
      <ReferencesTable :current-data-object="currentDataObject" />
    </GenericCollapse>

    <DataObjectModal
      :current-collection-id="currentCollectionId"
      :current-data-object="currentDataObject"
      modal-id="edit-dataObject-modal"
      modal-name="Edit Data Object"
      @dataObjectChanged="retrieveDataObject()"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import GenericCollapse from "@/components/GenericCollapse.vue";
import { DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectVue } from "@/utils/api-mixin";
import DataObjectModal from "@/components/DataObjectModal.vue";
import ReferencesTable from "@/components/ReferencesTable.vue";
import RelatedObjectsTable from "@/components/RelatedObjectsTable.vue";

interface DataObjectData {
  currentDataObject?: DataObject;
  hasAttribute: boolean;
  screenWidth: number;
  readMore: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectVue>>
).extend({
  components: {
    GenericCollapse,
    DataObjectModal,
    ReferencesTable,
    RelatedObjectsTable,
  },
  mixins: [DataObjectVue],
  data() {
    return {
      currentDataObject: undefined,
      hasAttribute: false,
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
          console.log("Error while fetching dataObject " + e);
        })
        .finally();
    },
    handleDelete() {
      this.dataObjectApi
        ?.deleteDataObject({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(() => {
          this.$router.push({
            name: "Collection",
            params: {
              collectionId: String(this.currentCollectionId),
            },
          });
        })
        .catch(e => {
          console.log("Error while deleting dataObject " + e);
        })
        .finally();
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
</style>
