<template>
  <div class="structured-data-container-list">
    <div class="component">
      <h4>Structured Data Containers</h4>
      <FilterListLine
        :total-rows="totalRows"
        :default-page="currentPage"
        :default-size="perPage"
        :default-descending="descending"
        :default-order-by="orderBy"
        @filterChanged="filterChanged($event)"
      />
      <GenericEntityList
        :entities="containers"
        @createEntity="createContainer($event)"
        @deleteEntity="deleteContainer($event)"
      />
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="center"
        size="sm"
        @change="retrieveContainers($event)"
      ></b-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { StructuredDataVue } from "@/utils/api-mixin";
import {
  GetAllStructuredDataContainersOrderByEnum,
  StructuredDataContainer,
} from "@dlr-shepard/shepard-client";
import FilterListLine, {
  FilterChangedData,
} from "@/components/generic/FilterListLine.vue";
import GenericEntityList from "@/components/generic/GenericEntityList.vue";
import Vue, { VueConstructor } from "vue";

interface StructuredDatasListData {
  containers: StructuredDataContainer[];
  perPage: number;
  currentPage: number;
  orderBy: string;
  descending: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataVue>>
).extend({
  components: { GenericEntityList, FilterListLine },
  mixins: [StructuredDataVue],
  data() {
    return {
      containers: [],
      perPage: 10,
      currentPage: 1,
      orderBy: "createdAt",
      descending: false,
    } as StructuredDatasListData;
  },
  computed: {
    totalRows(): number {
      if (this.containers.length < this.perPage) {
        return this.currentPage * this.perPage;
      }
      return (this.currentPage + 1) * this.perPage;
    },
  },
  mounted() {
    this.retrieveContainers();
  },
  methods: {
    filterChanged(options: FilterChangedData) {
      this.currentPage = options.currentPage;
      this.perPage = options.currentSize;
      this.descending = options.descending;
      this.orderBy = options.orderBy;
      this.retrieveContainers();
    },
    retrieveContainers(page?: number) {
      const nextPage = page || this.currentPage;
      const nextOrderBy = this
        .orderBy as keyof typeof GetAllStructuredDataContainersOrderByEnum as GetAllStructuredDataContainersOrderByEnum;
      this.structuredDataApi
        ?.getAllStructuredDataContainers({
          size: this.perPage,
          page: nextPage - 1,
          orderBy: nextOrderBy,
          orderDesc: this.descending,
        })
        .then(response => {
          this.containers = response;
        })
        .catch(e => {
          console.log("Error while fetching structured data containers " + e);
        })
        .finally();
    },
    createContainer(newName: string) {
      this.structuredDataApi
        ?.createStructuredDataContainer({
          structuredDataContainer: { name: newName } as StructuredDataContainer,
        })
        .then(() => {
          this.retrieveContainers();
        })
        .catch(e => {
          console.log("Error while creating structured data container " + e);
        })
        .finally();
    },
    deleteContainer(id: number) {
      this.structuredDataApi
        ?.deleteStructuredDataContainer({
          structureddataContainerId: id,
        })
        .then(() => {
          this.retrieveContainers();
        })
        .catch(e => {
          console.log("Error while deleting structured data container " + e);
        })
        .finally();
    },
  },
});
</script>
