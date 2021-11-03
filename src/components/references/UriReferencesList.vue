<template>
  <div>
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
        </div>
        <CreatedByLine
          :created-by="uriItem.createdBy"
          :created-at="uriItem.createdAt"
        />
        <b-link :href="uriItem.uri">{{ uriItem.uri }}</b-link>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { URIReference } from "@dlr-shepard/shepard-client";
import { UriReferenceVue } from "@/utils/api-mixin";
import UriReferenceModal from "@/components/references/UriReferenceModal.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

declare interface URIListData {
  uriList: URIReference[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof UriReferenceVue>>
).extend({
  components: { CreatedByLine, UriReferenceModal },
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
          console.log("Error while fetching URI References " + e);
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
          this.uriList = { ...this.uriList, ...[response] };
        })
        .catch(e => {
          console.log("Error while creating URIReference " + e);
        })
        .finally();
    },
  },
});
</script>
