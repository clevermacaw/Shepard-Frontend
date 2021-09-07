<template>
  <div class="file-container-list">
    <div class="component">
      <h4>File Containers</h4>
      <GenericEntityList
        :entities="containers"
        @createEntity="createContainer($event)"
        @deleteEntity="deleteContainer($event)"
      />
      <b-pagination
        v-model="currentPage"
        :total-rows="calcTotalRows"
        :per-page="perPage"
        align="center"
        size="sm"
        @change="retrieveContainers($event)"
      ></b-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { FileVue } from "@/utils/api-mixin";
import {
  FileContainer,
  GetAllFileContainersOrderByEnum,
} from "@dlr-shepard/shepard-client";
import GenericEntityList from "@/components/GenericEntityList.vue";
import Vue, { VueConstructor } from "vue";

interface FilesListData {
  containers: FileContainer[];
  perPage: number;
  currentPage: number;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FileVue>>
).extend({
  components: { GenericEntityList },
  mixins: [FileVue],
  data() {
    return {
      containers: [],
      perPage: 25,
      currentPage: 1,
    } as FilesListData;
  },
  computed: {
    calcTotalRows(): number {
      if (this.containers.length < this.perPage) {
        return this.currentPage * this.perPage;
      }
      return (this.currentPage + 1) * this.perPage;
    },
  },
  mounted() {
    this.retrieveContainers();
  },
  methods: {
    retrieveContainers(page?: number) {
      const nextPage = page || this.currentPage;
      this.fileApi
        ?.getAllFileContainers({
          size: this.perPage,
          page: nextPage - 1,
          orderBy: GetAllFileContainersOrderByEnum.CreatedAt,
        })
        .then(response => {
          this.containers = response;
        })
        .catch(e => {
          console.log("Error while fetching file containers " + e);
        })
        .finally();
    },
    createContainer(newName: string) {
      this.fileApi
        ?.createFileContainer({
          fileContainer: { name: newName } as FileContainer,
        })
        .then(() => {
          this.retrieveContainers();
        })
        .catch(e => {
          console.log("Error while creating file container " + e);
        })
        .finally();
    },
    deleteContainer(id: number) {
      this.fileApi
        ?.deleteFileContainer({
          fileContainerId: id,
        })
        .then(() => {
          this.retrieveContainers();
        })
        .catch(e => {
          console.log("Error while deleting file container " + e);
        })
        .finally();
    },
  },
});
</script>
