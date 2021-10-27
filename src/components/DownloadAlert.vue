<template>
  <div>
    <b-alert
      v-model="thisDownloadStarted"
      variant="success"
      dismissible
      class="d-flex align-items-center"
    >
      Download started. Depending on the size of the file this may take a while.
      <b-spinner
        :hidden="!thisDownloadActive"
        class="ml-auto"
        small
        type="grow"
      ></b-spinner>
    </b-alert>
    <b-alert
      v-model="thisDownloadError"
      variant="danger"
      dismissible
      class="d-flex align-items-center"
    >
      File is missing
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

declare interface DownloadAlertData {
  thisDownloadStarted: boolean;
  thisDownloadActive: boolean;
  thisDownloadError: boolean;
}

export default Vue.extend({
  props: {
    downloadStarted: {
      type: Boolean,
      default: false,
    },
    downloadActive: {
      type: Boolean,
      default: false,
    },
    downloadError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      thisDownloadStarted: false,
      thisDownloadActive: false,
      thisDownloadError: false,
    } as DownloadAlertData;
  },
  watch: {
    downloadStarted() {
      this.thisDownloadStarted = this.downloadStarted;
    },
    downloadActive() {
      this.thisDownloadActive = this.downloadActive;
    },
    downloadError() {
      this.thisDownloadError = this.downloadError;
    },
  },
});
</script>
