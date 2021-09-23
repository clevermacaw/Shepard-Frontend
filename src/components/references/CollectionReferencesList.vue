<template>
  <div class="list">
    <b-list-group>
      <b-list-group-item
        v-for="(collectionItem, index) in collectionList"
        :key="index"
      >
        <div>
          <b>{{ collectionItem.name }}</b> | ID: {{ collectionItem.id }}
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
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { Collection, CollectionReference } from "@dlr-shepard/shepard-client";
import { CollectionReferenceVue } from "@/utils/api-mixin";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

declare interface CollectionListData {
  collectionList: CollectionReference[];
  referencedList: { [key: number]: Collection };
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionReferenceVue>>
).extend({
  components: { CreatedByLine },
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
          console.log("Error while fetching Collection References " + e);
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
          console.log("Error while fetching Collection Reference Payload " + e);
        })
        .finally();
    },
  },
});
</script>
