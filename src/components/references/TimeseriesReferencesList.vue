<template>
  <div class="list">
    <b-alert
      :show="showCreate"
      dismissible
      variant="success"
      @dismissed="showCreate = false"
    >
      Successfully created
    </b-alert>
    <b-alert
      :show="showDelete"
      dismissible
      variant="danger"
      @dismissed="showDelete = false"
    >
      Successfully deleted
    </b-alert>

    <b-button v-b-modal.create-time-ref-modal class="mb-3" variant="primary">
      Create new Reference
    </b-button>

    <TimeseriesReferenceModal
      modal-id="create-time-ref-modal"
      modal-name="Create Time Reference"
      @create="handleCreate($event)"
    />

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
          <b-button
            v-b-modal.timeseries-reference-delete-confirmation-modal
            v-b-tooltip.hover
            class="float-right"
            title="Delete"
            variant="dark"
            @click="currentTimeseriesReference = timeseriesItem"
          >
            <DeleteIcon />
          </b-button>
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

    <DeleteConfirmationModal
      v-if="currentTimeseriesReference"
      modal-id="timeseries-reference-delete-confirmation-modal"
      modal-name="Confirm to delete URI Reference"
      :modal-text="
        'Do you really want do delete the URI Reference with name ' +
        currentTimeseriesReference.name +
        '?'
      "
      @confirmation="handleDelete(currentTimeseriesReference.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { TimeseriesReference } from "@dlr-shepard/shepard-client";
import { TimeseriesReferenceVue } from "@/utils/api-mixin";
import TimeseriesReferenceModal from "@/components/references/TimeseriesReferenceModal.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import DownloadAlert from "@/components/DownloadAlert.vue";
import { downloadFile } from "@/utils/download";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

interface TimeseriesListData {
  timeseriesList: TimeseriesReference[];
  downloadStarted: boolean;
  downloadActive: boolean;
  downloadError: boolean;
  currentTimeseriesReference?: TimeseriesReference;
  showCreate: boolean;
  showDelete: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesReferenceVue>>
).extend({
  components: {
    CreatedByLine,
    DownloadAlert,
    TimeseriesReferenceModal,
    DeleteConfirmationModal,
  },
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
      currentTimeseriesReference: undefined,
      showCreate: false,
      showDelete: false,
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

    handleDelete(timeseriesReferenceId: number) {
      this.timeseriesReferenceApi
        ?.deleteTimeseriesReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          timeseriesReferenceId: timeseriesReferenceId,
        })
        .then(() => {
          this.retrieveReferences();
          this.showDelete = true;
        })
        .catch(e => {
          console.log("Error while deleting Timeseries Reference " + e);
        });
    },

    handleCreate(timeseriesReference: TimeseriesReference) {
      this.timeseriesReferenceApi
        ?.createTimeseriesReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          timeseriesReference: timeseriesReference,
        })
        .then(response => {
          this.timeseriesList = [response].concat(this.timeseriesList);
          this.showCreate = true;
        })
        .catch(e => {
          console.log("Error while creating Timeseries Reference " + e);
        });
    },
  },
});
</script>
