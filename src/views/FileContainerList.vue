<template>
  <div class="file-container-list">
    <div class="component">
      <h4>File Containers</h4>
      <GenericContainerList
        :objects="containers"
        @createContainer="createContainer($event)"
        @deleteContainer="deleteContainer($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { FileVue } from "@/utils/api-mixin";
import { FileContainer } from "@dlr-shepard/shepard-client";
import GenericContainerList from "@/components/GenericContainerList.vue";
import Vue, { VueConstructor } from "vue";

interface FilesListData {
  containers?: FileContainer[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FileVue>>
).extend({
  components: { GenericContainerList },
  mixins: [FileVue],
  data() {
    return {
      containers: [],
    } as FilesListData;
  },
  mounted() {
    this.retrieveContainers();
  },
  methods: {
    retrieveContainers() {
      this.fileApi
        ?.getAllFileContainers()
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
        .then(response => {
          this.containers?.push(response);
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
          this.containers = this.containers?.filter(x => {
            return x.id != id;
          });
        })
        .catch(e => {
          console.log("Error while deleting file container " + e);
        })
        .finally();
    },
  },
});
</script>
