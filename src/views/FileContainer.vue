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
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { FileVue } from "@/utils/api-mixin";
import { FileContainer } from "@dlr-shepard/shepard-client";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

interface FileData {
  currentFile?: FileContainer;
  fileList: unknown[];
}

export default defineComponent({
  components: { CreatedByLine },
  mixins: [FileVue],
  setup() {
    const route = useRoute();
    const currentFileId = Number(route.params.fileId);
    return { currentFileId };
  },
  data() {
    return {
      currentFile: undefined,
      fileList: [],
    } as FileData;
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
