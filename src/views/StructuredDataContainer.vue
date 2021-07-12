<template>
  <div class="structured-data-container">
    <div v-if="currentStructuredData" class="component">
      <h3>{{ currentStructuredData.name }}</h3>
      <p>
        <b>ID:</b> {{ currentStructuredData.id }}<br />
        <b>Oid:</b> {{ currentStructuredData.oid }}<br />
        <small v-if="currentStructuredData.createdAt">
          created at {{ currentStructuredData.createdAt.toDateString() }}
        </small>
        <small v-if="currentStructuredData.createdBy">
          by {{ currentStructuredData.createdBy }}
        </small>
      </p>
      <b-list-group>
        <b-list-group-item
          v-for="(structuredData, index) in structuredDataList"
          :key="index"
        >
          {{ structuredData.oid }}
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script lang="ts">
import { StructuredDataVue } from "@/utils/api-mixin";
import {
  StructuredData,
  StructuredDataContainer,
} from "@dlr-shepard/shepard-client";
import Vue, { VueConstructor } from "vue";

interface StructuredDataData {
  currentStructuredData?: StructuredDataContainer;
  structuredDataList: StructuredData[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataVue>>
).extend({
  mixins: [StructuredDataVue],
  data() {
    return {
      currentStructuredData: undefined,
      structuredDataList: [],
    } as StructuredDataData;
  },
  computed: {
    currentStructuredDataId(): number {
      return Number(this.$router.currentRoute.params.structuredDataId);
    },
  },
  mounted() {
    this.retrieveStructuredData();
    this.retrieveStructuredDataList();
  },
  methods: {
    retrieveStructuredData() {
      this.structuredDataApi
        ?.getStructuredDataContainer({
          structureddataContainerId: this.currentStructuredDataId,
        })
        .then(response => {
          this.currentStructuredData = response;
        })
        .catch(e => {
          console.log("Error while fetching structuredData container " + e);
        })
        .finally();
    },
    retrieveStructuredDataList() {
      this.structuredDataApi
        ?.getAllStructuredDatas({
          structureddataContainerId: this.currentStructuredDataId,
        })
        .then(response => {
          this.structuredDataList = response;
        })
        .catch(e => {
          console.log("Error while fetching structuredData payload " + e);
        })
        .finally();
    },
  },
});
</script>
