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
      v-b-modal.create-collection-ref-modal
      class="mb-3"
      variant="primary"
    >
      Create new Reference
    </b-button>

    <CollectionReferenceModal
      :current-collection-id="currentCollectionId"
      :current-data-object-id="currentDataObjectId"
      modal-id="create-collection-ref-modal"
      modal-name="Create Collection Reference"
      @create="create($event)"
    />

    <b-list-group>
      <b-list-group-item
        v-for="(collectionItem, index) in collectionList"
        :key="index"
      >
        <div>
          <b>{{ collectionItem.name }}</b> | ID: {{ collectionItem.id }}
          <b-button
            v-b-modal.collection-reference-delete-confirmation-modal
            v-b-tooltip.hover
            class="float-right"
            title="Delete"
            variant="dark"
            @click="currentCollectionReference = collectionItem"
          >
            <DeleteIcon />
          </b-button>
        </div>
        <CreatedByLine
          :created-by="collectionItem.createdBy"
          :created-at="collectionItem.createdAt"
        />
        <small>
          {{ collectionItem.relationship }}:
          <b-link
            v-if="referencedList[collectionItem.id]"
            :to="{
              name: 'Collection',
              params: {
                collectionId: collectionItem.referencedCollectionId,
              },
            }"
          >
            <b>{{ referencedList[collectionItem.id].name }}</b> | ID:
            {{ referencedList[collectionItem.id].id }}
          </b-link>
        </small>
      </b-list-group-item>
    </b-list-group>

    <DeleteConfirmationModal
      v-if="currentCollectionReference"
      modal-id="collection-reference-delete-confirmation-modal"
      modal-name="Confirm to delete Collection Reference"
      :modal-text="
        'Do you really want do delete the Collection Reference with name ' +
        currentCollectionReference.name +
        '?'
      "
      @confirmation="handleDelete(currentCollectionReference.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { Collection, CollectionReference } from "@dlr-shepard/shepard-client";
import { CollectionReferenceVue } from "@/utils/api-mixin";
import CollectionReferenceModal from "@/components/references/CollectionReferenceModal.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

interface CollectionListData {
  collectionList: CollectionReference[];
  referencedList: { [key: number]: Collection };
  currentCollectionReference?: CollectionReference;
  showCreate: boolean;
  showDelete: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionReferenceVue>>
).extend({
  components: {
    CreatedByLine,
    CollectionReferenceModal,
    DeleteConfirmationModal,
  },
  mixins: [CollectionReferenceVue],
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
      collectionList: new Array<CollectionReference>(),
      referencedList: {},
      currentCollectionReference: undefined,
      showCreate: false,
      showDelete: false,
    } as CollectionListData;
  },
  mounted() {
    this.retrieveReferences();
  },
  methods: {
    retrieveReferences() {
      this.collectionReferenceApi
        ?.getAllCollectionReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.collectionList = response;
          response.forEach(reference => {
            if (reference.id) this.retrieveCollection(reference.id);
          });
        })
        .catch(e => {
          console.log(
            "Error while fetching Collection References: " + e.statusText,
          );
        })
        .finally();
    },
    retrieveCollection(referenceId: number) {
      this.collectionReferenceApi
        ?.getCollectionReferencePayload({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          collectionReferenceId: referenceId,
        })
        .then(response => {
          const temp: { [key: number]: Collection } = {};
          temp[referenceId] = response;
          this.referencedList = { ...this.referencedList, ...temp };
        })
        .catch(e => {
          console.log(
            "Error while fetching Collection Reference Payload: " +
              e.statusText,
          );
        })
        .finally();
    },

    create(newReference: CollectionReference) {
      this.collectionReferenceApi
        ?.createCollectionReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          collectionReference: newReference,
        })
        .then(response => {
          this.collectionList = [response].concat(this.collectionList);
          if (response.id) this.retrieveCollection(response.id);
          this.showCreate = true;
        })
        .catch(e => {
          console.log(
            "Error while creating CollectionReference: " + e.statusText,
          );
        })
        .finally();
    },

    handleDelete(collectionReferenceId: number) {
      this.collectionReferenceApi
        ?.deleteCollectionReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          collectionReferenceId: collectionReferenceId,
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
