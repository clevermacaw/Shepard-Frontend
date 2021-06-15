<template>
  <div v-if="currentCollection" class="collection">
    <GenericCollapse title="Collection" visible>
      <p>
        Name: <b>{{ currentCollection.name }}</b> ID: {{ currentCollection.id }}
        <br />
        <small v-if="currentCollection.createdAt">
          created at {{ currentCollection.createdAt.toDateString() }}
        </small>
        <small v-if="currentCollection.createdBy">
          by {{ currentCollection.createdBy }}
        </small>
        <br />
        <small v-if="currentCollection.updatedAt">
          updated at {{ currentCollection.updatedAt.toDateString() }}
        </small>
        <small v-if="currentCollection.updatedBy">
          by {{ currentCollection.updatedBy }}
        </small>
      </p>

      <p>
        <i>{{ currentCollection.description }}</i>
      </p>

      <h4>Attributes</h4>
      <ul>
        <li v-for="(value, key) in currentCollection.attributes" :key="key">
          <b>{{ key }}:</b> {{ value }}
        </li>
      </ul>
    </GenericCollapse>

    <GenericCollapse title="Data Objects" visible>
      <DataObjectList :current-collection-id="currentCollectionId" />
    </GenericCollapse>

    <div class="component">
      <h4>Edit</h4>
      <CollectionEdit
        :current-collection-id="currentCollectionId"
        @collectionChanged="retrieveCollection()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import DataObjectList from "@/components/DataObjectList.vue";
import CollectionEdit from "@/components/CollectionEdit.vue";
import GenericCollapse from "@/components/GenericCollapse.vue";
import { Collection } from "@dlr-shepard/shepard-client";
import { CollectionVue } from "@/utils/api-mixin";

interface CollectionData {
  currentCollection?: Collection;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  components: { GenericCollapse, DataObjectList, CollectionEdit },
  mixins: [CollectionVue],
  data() {
    return {
      currentCollection: undefined,
    } as CollectionData;
  },
  computed: {
    currentCollectionId(): number {
      return Number(this.$router.currentRoute.params.collectionId);
    },
  },
  mounted() {
    this.retrieveCollection();
  },
  methods: {
    retrieveCollection() {
      this.collectionApi
        ?.getCollection({ collectionId: this.currentCollectionId })
        .then(response => {
          this.currentCollection = response;
        })
        .catch(e => {
          console.log("Error while fetching collection" + e);
        })
        .finally();
    },
  },
});
</script>
