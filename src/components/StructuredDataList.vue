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
          v-for="(
            structuredData, oidIndex
          ) in structuredDataReference.structuredDatas"
          :key="oidIndex"
          class="list-group-item list-group-item-action"
        >
          <small>
            <b>Oid: </b>
            {{ structuredData.oid }}
            <br />
            <b>Payload: </b>
            <code> {{ structuredDataPayload[structuredData.oid] }} </code>
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
  structuredDataPayload: { [key: string]: string | undefined };
  structuredDataPayloadReactive: { [key: string]: string | undefined };
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
      structuredDataPayload: {},
      structuredDataPayloadReactive: {},
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
            if (reference.id) this.retrieveStructuredDataPayload(reference.id);
          });
        })
        .catch(e => {
          console.log("Error while fetching StructuredData References " + e);
        })
        .finally();
    },

    retrieveStructuredDataPayload(id: number) {
      this.structuredDataReferenceApi
        ?.getStructuredDataPayload({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          structureddataReferenceId: id,
        })
        .then(response => {
          response.forEach(payload => {
            if (payload?.structuredData?.oid)
              this.structuredDataPayloadReactive[payload.structuredData.oid] =
                payload.payload;
          });
          // TODO: get rid of "structuredDataPayloadReactive"
          this.structuredDataPayload = this.structuredDataPayloadReactive;
        })
        .catch(e => {
          console.log("Error while fetching StructuredDataPayload " + e);
        })
        .finally();
    },
  },
});
</script>
