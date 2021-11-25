<template>
  <div class="list">
    <b-alert
      :show="showCreate"
      dismissible
      variant="success"
      @dismissed="showCreate = false"
    >
      Successfully created
    </b-alert>
    <b-alert
      :show="showDelete"
      dismissible
      variant="danger"
      @dismissed="showDelete = false"
    >
      Successfully deleted
    </b-alert>

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
          <b-button
            v-b-modal.structured-data-reference-delete-confirmation-modal
            v-b-tooltip.hover
            class="float-right"
            title="Delete"
            variant="dark"
            @click="currentStructuredDataReference = structuredDataReference"
          >
            <DeleteIcon />
          </b-button>
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

    <DeleteConfirmationModal
      v-if="currentStructuredDataReference"
      modal-id="structured-data-reference-delete-confirmation-modal"
      modal-name="Confirm to delete Structured Data Reference"
      :modal-text="
        'Do you really want do delete the Structured Data Reference with name ' +
        currentStructuredDataReference.name +
        '?'
      "
      @confirmation="handleDelete(currentStructuredDataReference.id)"
    />
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
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

interface StructuredDataListData {
  structuredDataList: StructuredDataReference[];
  structuredDatas: { [key: string]: StructuredDataPayload };
  currentStructuredDataReference?: StructuredDataReference;
  showCreate: boolean;
  showDelete: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataReferenceVue>>
).extend({
  components: {
    CreatedByLine,
    StructuredDataReferenceModal,
    DeleteConfirmationModal,
  },
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
      currentStructuredDataReference: undefined,
      showCreate: false,
      showDelete: false,
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
          this.showCreate = true;
        })
        .catch(e => {
          console.log("Error while creating StructuredDataReference " + e);
        })
        .finally();
    },

    handleDelete(structureddataReferenceId: number) {
      this.structuredDataReferenceApi
        ?.deleteStructuredDataReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          structureddataReferenceId: structureddataReferenceId,
        })
        .then(() => {
          this.retrieveReferences();
          this.showDelete = true;
        })
        .catch(e => {
          console.log("Error while deleting Structured Data Reference " + e);
        })
        .finally();
    },
  },
});
</script>
