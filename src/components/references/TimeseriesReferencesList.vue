<template>
  <div class="list">
    <b-list-group>
      <b-list-group-item
        v-for="(timeseriesItem, index) in timeseriesList"
        :key="index"
      >
        <div>
          <b>{{ timeseriesItem.name }}</b> | ID: {{ timeseriesItem.id }} |
          <b-link
            :to="{
              name: 'Timeseries',
              params: { timeseriesId: timeseriesItem.timeseriesContainerId },
            }"
          >
            Container: {{ timeseriesItem.timeseriesContainerId }}
          </b-link>
        </div>
        <CreatedByLine
          :created-by="timeseriesItem.createdBy"
          :created-at="timeseriesItem.createdAt"
        />
        <small>
          <b>start:</b>
          {{ new Date(timeseriesItem.start / 1e6).toLocaleString() }} |
          <b>end:</b>
          {{ new Date(timeseriesItem.end / 1e6).toLocaleString() }}
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
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

declare interface TimeseriesListData {
  timeseriesList: TimeseriesReference[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesReferenceVue>>
).extend({
  components: { CreatedByLine },
  mixins: [TimeseriesReferenceVue],
  props: {
    currentCollectionId: {
      type: Number,
      required: true,
    },
    currentDataObjectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      timeseriesList: new Array<TimeseriesReference>(),
    } as TimeseriesListData;
  },
  mounted() {
    this.retrieveReferences();
  },
  methods: {
    retrieveReferences() {
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
