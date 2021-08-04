<template>
  <div class="list">
    <b-list-group>
      <b-list-group-item
        v-for="(uriItem, index) in uriList"
        :key="index"
        class="list-group-item list-group-item-action"
      >
        <div>
          <b>{{ uriItem.name }}</b> | ID: {{ uriItem.id }}
        </div>

        <small>
          created at {{ uriItem.createdAt.toDateString() }} by
          {{ uriItem.createdBy }}
        </small>
        <br />

        <b-link :href="uriItem.uri">{{ uriItem.uri }}</b-link>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { URIReference } from "@dlr-shepard/shepard-client";
import { UriReferenceVue } from "@/utils/api-mixin";

declare interface URIListData {
  uriList: URIReference[];
  currentURI?: URIReference;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof UriReferenceVue>>
).extend({
  mixins: [UriReferenceVue],
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
      uriList: new Array<URIReference>(),
      currentURI: undefined,
    } as URIListData;
  },
  mounted() {
    this.retrieveURI();
  },
  methods: {
    retrieveURI() {
      this.uriReferenceApi
        ?.getAllReferences1({
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
  },
});
</script>
