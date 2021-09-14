<template>
  <div class="timeseries-container">
    <div v-if="currentTimeseries" class="component">
      <h3>{{ currentTimeseries.name }}</h3>
      <p>
        <b>ID:</b> {{ currentTimeseries.id }}<br />
        <b>Database:</b> {{ currentTimeseries.database }}<br />
        <CreatedByLine
          :created-at="currentTimeseries.createdAt"
          :created-by="currentTimeseries.createdBy"
        />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { TimeseriesContainer } from "@dlr-shepard/shepard-client";
import CreatedByLine from "@/components/CreatedByLine.vue";
import { TimeseriesVue } from "@/utils/api-mixin";

interface TimeseriesData {
  currentTimeseries?: TimeseriesContainer;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesVue>>
).extend({
  components: { CreatedByLine },
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
