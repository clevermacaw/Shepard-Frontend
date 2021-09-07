<template>
  <div class="timeseries-container-list">
    <div class="component">
      <h4>Timeseries Containers</h4>
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
import { TimeseriesVue } from "@/utils/api-mixin";
import {
  GetAllTimeseriesContainersOrderByEnum,
  TimeseriesContainer,
} from "@dlr-shepard/shepard-client";
import GenericEntityList from "@/components/GenericEntityList.vue";
import Vue, { VueConstructor } from "vue";

interface TimeseriesListData {
  containers: TimeseriesContainer[];
  perPage: number;
  currentPage: number;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesVue>>
).extend({
  components: { GenericEntityList },
  mixins: [TimeseriesVue],
  data() {
    return {
      containers: [],
      perPage: 10,
      currentPage: 1,
    } as TimeseriesListData;
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
      this.timeseriesApi
        ?.getAllTimeseriesContainers({
          size: this.perPage,
          page: nextPage - 1,
          orderBy: GetAllTimeseriesContainersOrderByEnum.CreatedAt,
          orderDesc: true,
        })
        .then(response => {
          this.containers = response;
        })
        .catch(e => {
          console.log("Error while fetching timeseries containers " + e);
        })
        .finally();
    },
    createContainer(newName: string) {
      this.timeseriesApi
        ?.createTimeseriesContainer({
          timeseriesContainer: { name: newName } as TimeseriesContainer,
        })
        .then(() => {
          this.retrieveContainers();
        })
        .catch(e => {
          console.log("Error while creating timeseries container " + e);
        })
        .finally();
    },
    deleteContainer(id: number) {
      this.timeseriesApi
        ?.deleteTimeseriesContainer({
          timeseriesContainerId: id,
        })
        .then(() => {
          this.retrieveContainers();
        })
        .catch(e => {
          console.log("Error while deleting timeseries container " + e);
        })
        .finally();
    },
  },
});
</script>
