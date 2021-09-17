<template>
  <div class="explore">
    <div class="component">
      <h4>Explore Collections</h4>
      <FilterListLine
        :total-rows="totalRows"
        :default-page="currentPage"
        :default-size="perPage"
        :default-descending="descending"
        :default-order-by="orderBy"
        @filterChanged="filterChanged($event)"
      />
      <GenericEntityList
        :entities="collections"
        @createEntity="createCollection($event)"
        @deleteEntity="deleteCollection($event)"
      />
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
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
import GenericEntityList from "@/components/generic/GenericEntityList.vue";
import FilterListLine, {
  FilterChangedData,
} from "@/components/generic/FilterListLine.vue";
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
  orderBy: string;
  descending: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  components: { GenericEntityList, FilterListLine },
  mixins: [CollectionVue],
  data() {
    return {
      collections: [],
      perPage: 10,
      currentPage: 1,
      orderBy: "createdAt",
      descending: false,
    } as ExploreData;
  },
  computed: {
    totalRows(): number {
      if (this.collections.length < this.perPage) {
        return this.currentPage * this.perPage;
      }
      return (this.currentPage + 1) * this.perPage;
    },
  },
  mounted() {
    this.retrieveCollections();
  },
  methods: {
    filterChanged(options: FilterChangedData) {
      this.currentPage = options.currentPage;
      this.perPage = options.currentSize;
      this.descending = options.descending;
      this.orderBy = options.orderBy;
      this.retrieveCollections();
    },
    retrieveCollections(page?: number) {
      const nextPage = page || this.currentPage;
      const nextOrderBy = this
        .orderBy as keyof typeof GetAllCollectionsOrderByEnum as GetAllCollectionsOrderByEnum;
      this.collectionApi
        ?.getAllCollections({
          size: this.perPage,
          page: nextPage - 1,
          orderBy: nextOrderBy,
          orderDesc: this.descending,
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
