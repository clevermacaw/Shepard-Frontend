<template>
  <div class="file-container">
    <div v-if="currentFile" class="component">
      <h3>{{ currentFile.name }}</h3>
      <p>
        <b>ID:</b> {{ currentFile.id }}<br />
        <b>Oid:</b> {{ currentFile.oid }}<br />
        <CreatedByLine
          :created-at="currentFile.createdAt"
          :created-by="currentFile.createdBy"
        />
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
import Vue, { VueConstructor } from "vue";
import { FileVue } from "@/utils/api-mixin";
import { FileContainer } from "@dlr-shepard/shepard-client";
import CreatedByLine from "@/components/CreatedByLine.vue";

interface FileData {
  currentFile?: FileContainer;
  fileList: unknown[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FileVue>>
).extend({
  components: { CreatedByLine },
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
