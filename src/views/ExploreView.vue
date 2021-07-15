<template>
  <div class="explore">
    <div class="component">
      <h4>Explore Collections</h4>
      <GenericEntityList
        :entities="collections"
        @createEntity="createCollection($event)"
        @deleteEntity="deleteCollection($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import GenericEntityList from "@/components/GenericEntityList.vue";
import { CollectionApi, Collection } from "@dlr-shepard/shepard-client";
import { CollectionVue } from "@/utils/api-mixin";

interface ExploreData {
  collectionApi?: CollectionApi;
  collections: Collection[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  components: { GenericEntityList },
  mixins: [CollectionVue],
  data() {
    return {
      collections: [],
    } as ExploreData;
  },
  mounted() {
    this.retrieveCollections();
  },
  methods: {
    retrieveCollections() {
      this.collectionApi
        ?.getAllCollections({})
        .then(response => {
          this.collections = response;
        })
        .catch(e => {
          console.log("Error while fetching collections " + e);
        })
        .finally();
    },
    createCollection(newName: string) {
      this.collectionApi
        ?.createCollection({
          collection: { name: newName } as Collection,
        })
        .then(response => {
          this.collections?.push(response);
        })
        .catch(e => {
          console.log("Error while creating collection " + e);
        })
        .finally();
    },
    deleteCollection(id: number) {
      this.collectionApi
        ?.deleteCollection({
          collectionId: id,
        })
        .then(() => {
          this.collections = this.collections?.filter(x => {
            return x.id != id;
          });
        })
        .catch(e => {
          console.log("Error while deleting collection " + e);
        })
        .finally();
    },
  },
});
</script>
