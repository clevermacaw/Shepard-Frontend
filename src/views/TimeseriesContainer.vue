<template>
  <div class="timeseries-container">
    <div v-if="currentTimeseries" class="component">
      <h3>{{ currentTimeseries.name }}</h3>
      <p>
        <b>ID:</b> {{ currentTimeseries.id }}<br />
        <b>Database:</b> {{ currentTimeseries.database }}<br />
        <small v-if="currentTimeseries.createdAt">
          created at {{ currentTimeseries.createdAt.toDateString() }}
        </small>
        <small v-if="currentTimeseries.createdBy">
          by {{ currentTimeseries.createdBy }}
        </small>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { TimeseriesVue } from "@/utils/api-mixin";
import { TimeseriesContainer } from "@dlr-shepard/shepard-client";
import Vue, { VueConstructor } from "vue";

interface TimeseriesData {
  currentTimeseries?: TimeseriesContainer;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesVue>>
).extend({
  mixins: [TimeseriesVue],
  data() {
    return {
      currentTimeseries: undefined,
    } as TimeseriesData;
  },
  computed: {
    currentTimeseriesId(): number {
      return Number(this.$router.currentRoute.params.timeseriesId);
    },
  },
  mounted() {
    this.retrieveTimeseries();
  },
  methods: {
    retrieveTimeseries() {
      this.timeseriesApi
        ?.getTimeseriesContainer({
          timeseriesContainerId: this.currentTimeseriesId,
        })
        .then(response => {
          this.currentTimeseries = response;
        })
        .catch(e => {
          console.log("Error while fetching timeseries container " + e);
        })
        .finally();
    },
  },
});
</script>
