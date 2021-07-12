<template>
  <div class="file-container">
    <div v-if="currentFile" class="component">
      <h3>{{ currentFile.name }}</h3>
      <p>
        <b>ID:</b> {{ currentFile.id }}<br />
        <b>Oid:</b> {{ currentFile.oid }}<br />
        <small v-if="currentFile.createdAt">
          created at {{ currentFile.createdAt.toDateString() }}
        </small>
        <small v-if="currentFile.createdBy">
          by {{ currentFile.createdBy }}
        </small>
      </p>
      <b-list-group>
        <b-list-group-item v-for="(file, index) in fileList" :key="index">
          {{ file.oid }} | {{ file.filename }}
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script lang="ts">
import { FileVue } from "@/utils/api-mixin";
import { FileContainer } from "@dlr-shepard/shepard-client";
import Vue, { VueConstructor } from "vue";

interface FileData {
  currentFile?: FileContainer;
  fileList: unknown[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FileVue>>
).extend({
  mixins: [FileVue],
  data() {
    return {
      currentFile: undefined,
      fileList: [],
    } as FileData;
  },
  computed: {
    currentFileId(): number {
      return Number(this.$router.currentRoute.params.fileId);
    },
  },
  mounted() {
    this.retrieveFile();
    this.retrieveFileList();
  },
  methods: {
    retrieveFile() {
      this.fileApi
        ?.getFileContainer({
          fileContainerId: this.currentFileId,
        })
        .then(response => {
          this.currentFile = response;
        })
        .catch(e => {
          console.log("Error while fetching file container " + e);
        })
        .finally();
    },
    retrieveFileList() {
      this.fileApi
        ?.getAllFiles({
          fileContainerId: this.currentFileId,
        })
        .then(response => {
          this.fileList = response;
        })
        .catch(e => {
          console.log("Error while fetching file payload " + e);
        })
        .finally();
    },
  },
});
</script>
