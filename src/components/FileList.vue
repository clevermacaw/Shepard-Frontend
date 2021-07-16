<template>
  <div class="list">
    <b-list-group>
      <b-list-group-item
        v-for="(fileReference, index) in fileReferenceList"
        :key="index"
        class="list-group-item list-group-item-action"
      >
        <div>
          <b>{{ fileReference.name }}</b>
          | ID: {{ fileReference.id }} | Container:
          {{ fileReference.fileContainerId }}
        </div>

        <small>
          created at {{ fileReference.createdAt.toDateString() }} by
          {{ fileReference.createdBy }}
        </small>

        <div v-for="(file, i) in fileReference.files" :key="i">
          <small>
            <b>Oid:</b> {{ file.oid }} | <b>Filename:</b> {{ file.filename }}
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

declare interface FileListData {
  fileReferenceList: FileReference[];
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

    getFilePayload(fileReferenceId: number, oid: string) {
      this.fileReferenceApi
        ?.getFilePayload({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          fileReferenceId: fileReferenceId,
          oid: oid,
        })
        .then(response => {
          console.log("Success");
          // this.getFile(response, filename);
        })
        .catch(e => {
          console.log("Error while fetching Project File Reference " + e);
        })
        .finally();
    },

    getFile(response: Blob, filename: string) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(response);
      link.download = filename || "shepard-file";
      link.click();
      URL.revokeObjectURL(link.href);
    },
  },
});
</script>
