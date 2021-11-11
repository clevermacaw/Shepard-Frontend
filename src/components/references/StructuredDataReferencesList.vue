<template>
  <div class="list">
    <b-button
      v-b-modal.create-structured-data-ref-modal
      class="mb-3"
      variant="primary"
    >
      Create new Reference
    </b-button>

    <StructuredDataReferenceModal
      :current-collection-id="currentCollectionId"
      :current-data-object-id="currentDataObjectId"
      modal-id="create-structured-data-ref-modal"
      modal-name="Create StructuredData Reference"
      @create="create($event)"
    />

    <b-list-group>
      <b-list-group-item
        v-for="(structuredDataReference, index) in structuredDataList"
        :key="index"
      >
        <div>
          <b>{{ structuredDataReference.name }}</b> | ID:
          {{ structuredDataReference.id }} |
          <b-link
            :to="{
              name: 'StructuredData',
              params: {
                structuredDataId:
                  structuredDataReference.structuredDataContainerId,
              },
            }"
          >
            Container: {{ structuredDataReference.structuredDataContainerId }}
          </b-link>
        </div>
        <CreatedByLine
          :created-by="structuredDataReference.createdBy"
          :created-at="structuredDataReference.createdAt"
        />
        <div
          v-for="(oid, i) in structuredDataReference.structuredDataOids"
          :key="i"
        >
          <small v-if="structuredDatas[oid]">
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
import StructuredDataReferenceModal from "@/components/references/StructuredDataReferenceModal.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

declare interface StructuredDataListData {
  structuredDataList: StructuredDataReference[];
  structuredDatas: { [key: string]: StructuredDataPayload };
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataReferenceVue>>
).extend({
  components: { CreatedByLine, StructuredDataReferenceModal },
  mixins: [StructuredDataReferenceVue],
  props: {
    currentCollectionId: {
      type: Number,
      required: true,
    },
    currentDataObjectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      structuredDataList: [],
      structuredDatas: {},
    } as StructuredDataListData;
  },
  mounted() {
    this.retrieveReferences();
  },
  methods: {
    retrieveReferences() {
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

    create(newReference: StructuredDataReference) {
      this.structuredDataReferenceApi
        ?.createStructuredDataReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          structuredDataReference: newReference,
        })
        .then(response => {
          this.structuredDataList = [response].concat(this.structuredDataList);
          if (response.id) this.retrieveStructuredDatas(response.id);
        })
        .catch(e => {
          console.log("Error while creating StructuredDataReference " + e);
        })
        .finally();
    },
  },
});
</script>
