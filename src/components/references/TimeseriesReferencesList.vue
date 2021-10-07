<template>
  <div class="list">
    <DownloadAlert
      :download-active="downloadActive"
      :download-started="downloadStarted"
      :download-error="downloadError"
    />
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
        <b-link
          class="float-right"
          :disabled="downloadActive"
          @click="downloadCsv(timeseriesItem.id, timeseriesItem.name)"
        >
          <DownloadIcon />
        </b-link>
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
import DownloadAlert from "@/components/DownloadAlert.vue";
import { downloadFile } from "@/utils/download";

declare interface TimeseriesListData {
  timeseriesList: TimeseriesReference[];
  downloadStarted: boolean;
  downloadActive: boolean;
  downloadError: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesReferenceVue>>
).extend({
  components: { CreatedByLine, DownloadAlert },
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
      downloadStarted: false,
      downloadActive: false,
      downloadError: false,
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
    downloadCsv(referenceId: number, referenceName: string) {
      this.downloadStarted = true;
      this.downloadActive = true;
      this.timeseriesReferenceApi
        ?.exportTimeseriesPayload({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          timeseriesReferenceId: referenceId,
        })
        .then(response => {
          downloadFile(response, referenceName + ".csv");
        })
        .catch(e => {
          console.log("Error while fetching Timeseries CSV " + e);
          this.downloadStarted = false;
          this.downloadError = true;
        })
        .finally(() => (this.downloadActive = false));
    },
  },
});
</script>
