<template>
  <div class="explore">
    <div class="component">
      <h4>Explore Collections</h4>
      <GenericEntityList
        :entities="collections"
        @createEntity="createCollection($event)"
        @deleteEntity="deleteCollection($event)"
      />
      <b-pagination
        v-model="currentPage"
        :total-rows="calcTotalRows"
        :per-page="perPage"
        align="center"
        size="sm"
        @change="retrieveCollections($event)"
      ></b-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import GenericEntityList from "@/components/GenericEntityList.vue";
import {
  CollectionApi,
  Collection,
  GetAllCollectionsOrderByEnum,
} from "@dlr-shepard/shepard-client";
import { CollectionVue } from "@/utils/api-mixin";

interface ExploreData {
  collectionApi?: CollectionApi;
  collections: Collection[];
  perPage: number;
  currentPage: number;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  components: { GenericEntityList },
  mixins: [CollectionVue],
  data() {
    return {
      collections: [],
      perPage: 25,
      currentPage: 1,
    } as ExploreData;
  },
  computed: {
    calcTotalRows(): number {
      if (this.collections.length < this.perPage) {
        return this.currentPage * this.perPage;
      }
      return this.currentPage + 1 * this.perPage;
    },
  },
  mounted() {
    this.retrieveCollections();
  },
  methods: {
    retrieveCollections(page?: number) {
      const nextPage = page || this.currentPage;
      this.collectionApi
        ?.getAllCollections({
          size: this.perPage,
          page: nextPage - 1,
          orderBy: GetAllCollectionsOrderByEnum.CreatedAt,
        })
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
        .then(() => {
          this.retrieveCollections();
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
          this.retrieveCollections();
        })
        .catch(e => {
          console.log("Error while deleting collection " + e);
        })
        .finally();
    },
  },
});
</script>
