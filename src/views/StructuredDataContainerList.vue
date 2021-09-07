<template>
  <div class="structured-data-container-list">
    <div class="component">
      <h4>Structured Data Containers</h4>
      <GenericEntityList
        :entities="containers"
        @createEntity="createContainer($event)"
        @deleteEntity="deleteContainer($event)"
      />
      <b-pagination
        v-model="currentPage"
        :total-rows="calcTotalRows"
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
import GenericEntityList from "@/components/GenericEntityList.vue";
import Vue, { VueConstructor } from "vue";

interface StructuredDatasListData {
  containers: StructuredDataContainer[];
  perPage: number;
  currentPage: number;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataVue>>
).extend({
  components: { GenericEntityList },
  mixins: [StructuredDataVue],
  data() {
    return {
      containers: [],
      perPage: 25,
      currentPage: 1,
    } as StructuredDatasListData;
  },
  computed: {
    calcTotalRows(): number {
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
    retrieveContainers(page?: number) {
      const nextPage = page || this.currentPage;
      this.structuredDataApi
        ?.getAllStructuredDataContainers({
          size: this.perPage,
          page: nextPage - 1,
          orderBy: GetAllStructuredDataContainersOrderByEnum.CreatedAt,
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
