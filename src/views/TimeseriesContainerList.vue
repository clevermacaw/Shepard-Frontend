<template>
  <div class="timeseries-container-list">
    <div class="component">
      <h4>Timeseries Containers</h4>
      <GenericEntityList
        :entities="containers"
        @createEntity="createContainer($event)"
        @deleteEntity="deleteContainer($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { TimeseriesVue } from "@/utils/api-mixin";
import { TimeseriesContainer } from "@dlr-shepard/shepard-client";
import GenericEntityList from "@/components/GenericEntityList.vue";
import Vue, { VueConstructor } from "vue";

interface TimeseriesListData {
  containers?: TimeseriesContainer[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesVue>>
).extend({
  components: { GenericEntityList },
  mixins: [TimeseriesVue],
  data() {
    return {
      containers: [],
    } as TimeseriesListData;
  },
  mounted() {
    this.retrieveContainers();
  },
  methods: {
    retrieveContainers() {
      this.timeseriesApi
        ?.getAllTimeseriesContainers({})
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
        .then(response => {
          this.containers?.push(response);
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
          this.containers = this.containers?.filter(x => {
            return x.id != id;
          });
        })
        .catch(e => {
          console.log("Error while deleting timeseries container " + e);
        })
        .finally();
    },
  },
});
</script>
