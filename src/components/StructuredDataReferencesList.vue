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
          <small v-if="structuredDatas[oid]">
            <b>Oid:</b> {{ oid }} | <b>Name:</b>
            {{ structuredDatas[oid].structuredData.name }} | <b>Created at:</b>
            {{
              new Date(
                structuredDatas[oid].structuredData.createdAt,
              ).toLocaleString()
            }}
            <br />
            <b>Payload: </b>
            <code> {{ structuredDatas[oid].payload }} </code>
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
  structuredDatas: { [key: string]: StructuredDataPayload | undefined };
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
          response.forEach(payload => {
            if (payload?.structuredData?.oid)
              this.structuredDatas[payload.structuredData.oid] = payload;
          });
          this.structuredDatas = { ...this.structuredDatas };
        })
        .catch(e => {
          console.log("Error while fetching StructuredDataPayload " + e);
        })
        .finally();
    },
  },
});
</script>
