<template>
  <div class="list">
    <b-list-group>
      <b-list-group-item
        v-for="(structuredDataReference, index) in structuredDataList"
        :key="index"
        class="list-group-item list-group-item-action"
      >
        <div>
          <b>{{ structuredDataReference.name }}</b>
          | ID: {{ structuredDataReference.id }} | Container:
          {{ structuredDataReference.structuredDataContainerId }}
        </div>
        <small>
          created at {{ structuredDataReference.createdAt.toDateString() }} by
          {{ structuredDataReference.createdBy }}
        </small>
        <br />
        <div
          v-for="(oid, i) in structuredDataReference.structuredDataOids"
          :key="i"
          class="list-group-item list-group-item-action"
        >
          <small>
            <div v-if="structuredDatas[oid].structuredData.createdAt">
              <b>Oid:</b> {{ oid }} | <b>Name:</b>
              {{ structuredDatas[oid].structuredData.name }} |
              <b>Created at:</b>
              {{
                new Date(
                  structuredDatas[oid].structuredData.createdAt,
                ).toLocaleString()
              }}
            </div>
            <div v-else><b>Oid:</b> {{ oid }}</div>
            <b>Payload: </b>
            <code v-if="structuredDatas[oid].payload">
              {{ structuredDatas[oid].payload }}
            </code>
            <code v-else>Payload is missing</code>
          </small>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import {
  StructuredDataPayload,
  StructuredDataReference,
} from "@dlr-shepard/shepard-client";
import { StructuredDataReferenceVue } from "@/utils/api-mixin";

declare interface StructuredDataListData {
  structuredDataList: StructuredDataReference[];
  structuredDatas: { [key: string]: StructuredDataPayload };
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataReferenceVue>>
).extend({
  mixins: [StructuredDataReferenceVue],
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
      structuredDataList: [],
      structuredDatas: {},
    } as StructuredDataListData;
  },
  mounted() {
    this.retrieveStructuredDataReferences();
  },
  methods: {
    retrieveStructuredDataReferences() {
      this.structuredDataReferenceApi
        ?.getAllStructuredDataReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.structuredDataList = response;
          this.structuredDataList.forEach(reference => {
            if (reference.id) this.retrieveStructuredDatas(reference.id);
          });
        })
        .catch(e => {
          console.log("Error while fetching StructuredData References " + e);
        })
        .finally();
    },

    retrieveStructuredDatas(id: number) {
      this.structuredDataReferenceApi
        ?.getStructuredDataPayload({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          structureddataReferenceId: id,
        })
        .then(response => {
          const temp: { [key: string]: StructuredDataPayload } = {};
          response.forEach(payload => {
            if (payload?.structuredData?.oid) {
              temp[payload.structuredData.oid] = payload;
            }
          });
          this.structuredDatas = { ...this.structuredDatas, ...temp };
        })
        .catch(e => {
          console.log("Error while fetching StructuredDataPayload " + e);
        })
        .finally();
    },
  },
});
</script>
