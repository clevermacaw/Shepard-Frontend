<template>
  <div>
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

    <b-button v-b-modal.create-uri-ref-modal class="mb-3" variant="primary">
      Create new Reference
    </b-button>

    <UriReferenceModal
      :current-collection-id="currentCollectionId"
      :current-data-object-id="currentDataObjectId"
      modal-id="create-uri-ref-modal"
      modal-name="Create URI Reference"
      @create="create($event)"
    />

    <b-list-group>
      <b-list-group-item v-for="(uriItem, index) in uriList" :key="index">
        <div>
          <b>{{ uriItem.name }}</b> | ID: {{ uriItem.id }}
          <b-button
            v-b-modal.uri-reference-delete-confirmation-modal
            v-b-tooltip.hover
            class="float-right"
            title="Delete"
            variant="dark"
            @click="currentUriReference = uriItem"
          >
            <DeleteIcon />
          </b-button>
        </div>
        <CreatedByLine
          :created-by="uriItem.createdBy"
          :created-at="uriItem.createdAt"
        />
        <b-link :href="uriItem.uri">{{ uriItem.uri }}</b-link>
      </b-list-group-item>
    </b-list-group>

    <DeleteConfirmationModal
      v-if="currentUriReference"
      modal-id="uri-reference-delete-confirmation-modal"
      modal-name="Confirm to delete URI Reference"
      :modal-text="
        'Do you really want do delete the URI Reference with name ' +
        currentUriReference.name +
        '?'
      "
      @confirmation="handleDelete(currentUriReference.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { URIReference } from "@dlr-shepard/shepard-client";
import { UriReferenceVue } from "@/utils/api-mixin";
import UriReferenceModal from "@/components/references/UriReferenceModal.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

interface URIListData {
  uriList: URIReference[];
  currentUriReference?: URIReference;
  showCreate: boolean;
  showDelete: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof UriReferenceVue>>
).extend({
  components: { CreatedByLine, UriReferenceModal, DeleteConfirmationModal },
  mixins: [UriReferenceVue],
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
      uriList: new Array<URIReference>(),
      currentUriReference: undefined,
      showCreate: false,
      showDelete: false,
    } as URIListData;
  },
  mounted() {
    this.retrieveReferences();
  },
  methods: {
    retrieveReferences() {
      this.uriReferenceApi
        ?.getAllUriReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.uriList = response;
        })
        .catch(e => {
          console.log("Error while fetching URI References: " + e.statusText);
        })
        .finally();
    },

    create(newReference: URIReference) {
      this.uriReferenceApi
        ?.createUriReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          uRIReference: newReference,
        })
        .then(response => {
          this.uriList = [response].concat(this.uriList);
          this.showCreate = true;
        })
        .catch(e => {
          console.log("Error while creating URIReference: " + e.statusText);
        })
        .finally();
    },

    handleDelete(uriReferenceId: number) {
      this.uriReferenceApi
        ?.deleteUriReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          uriReferenceId: uriReferenceId,
        })
        .then(() => {
          this.retrieveReferences();
          this.showDelete = true;
        })
        .catch(e => {
          console.log("Error while deleting URI Reference: " + e.statusText);
        })
        .finally();
    },
  },
});
</script>
