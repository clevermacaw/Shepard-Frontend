<template>
  <div class="structured-data-container-list">
    <div class="component">
      <h4>Structured Data Containers</h4>
      <GenericContainerList
        :objects="containers"
        @createContainer="createContainer($event)"
        @deleteContainer="deleteContainer($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { StructuredDataVue } from "@/utils/api-mixin";
import { StructuredDataContainer } from "@dlr-shepard/shepard-client";
import GenericContainerList from "@/components/GenericContainerList.vue";
import Vue, { VueConstructor } from "vue";

interface StructuredDatasListData {
  containers?: StructuredDataContainer[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataVue>>
).extend({
  components: { GenericContainerList },
  mixins: [StructuredDataVue],
  data() {
    return {
      containers: [],
    } as StructuredDatasListData;
  },
  mounted() {
    this.retrieveContainers();
  },
  methods: {
    retrieveContainers() {
      this.structuredDataApi
        ?.getAllStructuredDataContainers()
        .then(response => {
          this.containers = response;
        })
        .catch(e => {
          console.log("Error while fetching structured data containers " + e);
        })
        .finally();
    },
    createContainer(newName: string) {
      this.structuredDataApi
        ?.createStructuredDataContainer({
          structuredDataContainer: { name: newName } as StructuredDataContainer,
        })
        .then(response => {
          this.containers?.push(response);
        })
        .catch(e => {
          console.log("Error while creating structured data container " + e);
        })
        .finally();
    },
    deleteContainer(id: number) {
      this.structuredDataApi
        ?.deleteStructuredDataContainer({
          structureddataContainerId: id,
        })
        .then(() => {
          this.containers = this.containers?.filter(x => {
            return x.id != id;
          });
        })
        .catch(e => {
          console.log("Error while deleting structured data container " + e);
        })
        .finally();
    },
  },
});
</script>
