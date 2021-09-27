<template>
  <div class="structured-data-container">
    <div v-if="currentStructuredData" class="component">
      <h3>{{ currentStructuredData.name }}</h3>
      <p>
        <b>ID:</b> {{ currentStructuredData.id }}<br />
        <b>Oid:</b> {{ currentStructuredData.oid }}<br />
        <CreatedByLine
          :created-at="currentStructuredData.createdAt"
          :created-by="currentStructuredData.createdBy"
        />
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
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import {
  StructuredData,
  StructuredDataContainer,
} from "@dlr-shepard/shepard-client";
import { StructuredDataVue } from "@/utils/api-mixin";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

interface StructuredDataData {
  currentStructuredData?: StructuredDataContainer;
  structuredDataList: StructuredData[];
}

export default defineComponent({
  components: { CreatedByLine },
  mixins: [StructuredDataVue],
  setup() {
    const route = useRoute();
    const currentStructuredDataId = Number(route.params.structuredDataId);
    return { currentStructuredDataId };
  },
  data() {
    return {
      currentStructuredData: undefined,
      structuredDataList: [],
    } as StructuredDataData;
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
