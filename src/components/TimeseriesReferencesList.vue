<template>
  <div class="list">
    <b-list-group>
      <b-list-group-item
        v-for="(timeseriesItem, index) in timeseriesList"
        :key="index"
        class="list-group-item list-group-item-action"
      >
        <div>
          <b>{{ timeseriesItem.name }}</b>
          | ID: {{ timeseriesItem.id }} | Container:
          {{ timeseriesItem.timeseriesContainerId }}
        </div>

        <small>
          created at {{ timeseriesItem.createdAt.toDateString() }} by
          {{ timeseriesItem.createdBy }}
          <br />
          <b>start:</b>
          {{ new Date(timeseriesItem.start / 1e6).toLocaleString() }} |
          <b>end:</b> {{ new Date(timeseriesItem.end / 1e6).toLocaleString() }}
        </small>
        <b-table striped hover small :items="timeseriesItem.timeseries">
        </b-table>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { TimeseriesReference } from "@dlr-shepard/shepard-client";
import { TimeseriesReferenceVue } from "@/utils/api-mixin";

declare interface TimeseriesListData {
  timeseriesList: TimeseriesReference[];
  currentTimeseries?: TimeseriesReference;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesReferenceVue>>
).extend({
  mixins: [TimeseriesReferenceVue],
  props: {
    currentCollectionId: {
      type: Number,
      default: undefined,
    },
    currentDataObjectId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      timeseriesList: new Array<TimeseriesReference>(),
      currentTimeseries: undefined,
    } as TimeseriesListData;
  },
  mounted() {
    this.retrieveTimeseries();
  },
  methods: {
    retrieveTimeseries() {
      this.timeseriesReferenceApi
        ?.getAllTimeseriesReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.timeseriesList = response;
        })
        .catch(e => {
          console.log("Error while fetching Timeseries References " + e);
        })
        .finally();
    },
  },
});
</script>
