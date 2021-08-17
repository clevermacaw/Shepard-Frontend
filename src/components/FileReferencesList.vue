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

        <div v-for="(oid, i) in fileReference.fileOids" :key="i">
          <small v-if="files[oid]">
            <b>Oid:</b> {{ oid }} | <b>Filename:</b> {{ files[oid].filename }}
            <a v-if="files[oid].createdAt">
              | <b>Created at:</b>
              {{ new Date(files[oid].createdAt).toLocaleString() }}
            </a>
            <b-link
              class="float-right"
              :disabled="downloadActive"
              @click="
                getFilePayload(fileReference.id, oid, files[oid].filename)
              "
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
  files: { [key: string]: string | undefined };
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
      fileReferenceList: [],
      files: {},
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
          this.fileReferenceList.forEach(reference => {
            if (reference.id) this.getFiles(reference.id);
          });
        })
        .catch(e => {
          console.log("Error while fetching File References " + e);
        })
        .finally();
    },

    getFiles(id: number) {
      this.fileReferenceApi
        ?.getFiles({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          fileReferenceId: id,
        })
        .then(response => {
          response.forEach(payload => {
            console.log(payload);
            if (payload?.oid) this.files[payload.oid] = payload;
          });
          this.files = { ...this.files };
        })
        .catch(e => {
          console.log("Error while fetching Files " + e);
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
