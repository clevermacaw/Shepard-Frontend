<template>
  <div class="list">
    <b-alert
      v-model="downloadStarted"
      variant="success"
      dismissible
      class="d-flex align-items-center"
    >
      Download started. Depending on the size of the file this may take a while.
      <b-spinner
        :hidden="!downloadActive"
        class="ml-auto"
        small
        type="grow"
      ></b-spinner>
    </b-alert>
    <b-list-group>
      <b-list-group-item
        v-for="(fileReference, index) in fileReferenceList"
        :key="index"
        class="list-group-item list-group-item-action"
      >
        <div>
          <b>{{ fileReference.name }}</b> | ID: {{ fileReference.id }} |
          Container: {{ fileReference.fileContainerId }}
        </div>

        <small>
          created at {{ fileReference.createdAt.toDateString() }} by
          {{ fileReference.createdBy }}
        </small>

        <div v-for="(file, i) in fileReference.files" :key="i">
          <small>
            <b>Oid:</b> {{ file.oid }} | <b>Filename:</b> {{ file.filename }}
            <b-link
              class="float-right"
              :disabled="downloadActive"
              @click="getFilePayload(fileReference.id, file.oid, file.filename)"
            >
              <download-icon />
            </b-link>
          </small>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { FileReference } from "@dlr-shepard/shepard-client";
import { FileReferenceVue } from "@/utils/api-mixin";
import { downloadFile } from "@/utils/download";

declare interface FileListData {
  fileReferenceList: FileReference[];
  downloadStarted: boolean;
  downloadActive: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FileReferenceVue>>
).extend({
  mixins: [FileReferenceVue],
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
      fileReferenceList: new Array<FileReference>(),
      downloadStarted: false,
      downloadActive: false,
    } as FileListData;
  },
  mounted() {
    this.getFileReference();
  },
  methods: {
    getFileReference() {
      this.fileReferenceApi
        ?.getAllFileReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.fileReferenceList = response;
        })
        .catch(e => {
          console.log("Error while fetching File References " + e);
        })
        .finally();
    },

    getFilePayload(fileReferenceId: number, oid: string, filename: string) {
      this.downloadStarted = true;
      this.downloadActive = true;
      this.fileReferenceApi
        ?.getFilePayload({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          fileReferenceId: fileReferenceId,
          oid: oid,
        })
        .then(response => {
          downloadFile(response, filename);
        })
        .catch(e => {
          console.log("Error while fetching Project File Reference " + e);
        })
        .finally(() => (this.downloadActive = false));
    },
  },
});
</script>
