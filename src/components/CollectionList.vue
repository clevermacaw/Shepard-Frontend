<template>
  <div class="list">
    <h4>Collections List</h4>
    <b-input-group>
      <b-form-input
        v-model="name"
        placeholder="Search by name"
        @keyup.enter="searchTitle"
      ></b-form-input>
      <b-input-group-append>
        <b-button variant="info" @click="searchTitle"> Search </b-button>
      </b-input-group-append>
    </b-input-group>
    <b-form-group label="Sort by:">
      <b-form-select v-model="sort" @change="sortCollections()">
        <b-form-select-option value="byId">ID</b-form-select-option>
        <b-form-select-option value="byCreatedAt">Date</b-form-select-option>
        <b-form-select-option value="byCreatedBy">Author</b-form-select-option>
      </b-form-select>
      <b-form-checkbox v-model="reverse" @change="sortCollections()">
        Invert Order
      </b-form-checkbox>
    </b-form-group>
    <b-list-group>
      <b-list-group-item
        v-for="(collection, index) in collections"
        :key="index"
        :to="String(collection.id)"
        append
        class="list-group-item list-group-item-action"
      >
        {{ collection.name }}<br />
        <small> created at {{ collection.createdAt.toDateString() }} </small>
        <small v-if="collection.createdBy">
          by {{ collection.createdBy }}</small
        >
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { Collection } from "@dlr-shepard/shepard-client";
import { CollectionVue } from "@/utils/api-mixin";

declare interface CollectionListData {
  collections: Collection[];
  name: string;
  sort: string;
  reverse: boolean;
}

const sortFunc: { [name: string]: (a: Collection, b: Collection) => number } = {
  byId: (a: Collection, b: Collection) => {
    if (!a.id) return -1;
    if (!b.id) return 1;
    return a.id - b.id;
  },
  byCreatedAt: (a: Collection, b: Collection) => {
    if (!a.createdAt) return -1;
    if (!b.createdAt) return 1;
    return a.createdAt.getTime() - b.createdAt.getTime();
  },
  byCreatedBy: (a: Collection, b: Collection) => {
    if (!a.createdBy) return -1;
    if (!b.createdBy) return 1;
    return a.createdBy.toUpperCase() < b.createdBy.toUpperCase() ? -1 : 1;
  },
};

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  mixins: [CollectionVue],
  data() {
    return {
      collections: new Array<Collection>(),
      name: "",
      sort: "byId",
      reverse: false,
    } as CollectionListData;
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
          console.log("Error while fetching collections" + e);
        })
        .finally(() => this.sortCollections());
    },
    searchTitle() {
      this.collectionApi
        ?.getAllCollections({ name: this.name })
        .then(response => {
          this.collections = response;
        })
        .catch(e => {
          console.log("Error while fetching collections with name" + e);
        })
        .finally();
    },
    sortCollections() {
      this.collections.sort(sortFunc[this.sort]);
      if (this.reverse) this.collections.reverse();
    },
  },
});
</script>
