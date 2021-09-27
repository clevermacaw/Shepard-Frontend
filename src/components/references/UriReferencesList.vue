<template>
  <div class="list">
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
import { defineComponent } from "vue";
import { URIReference } from "@dlr-shepard/shepard-client";
import { UriReferenceVue } from "@/utils/api-mixin";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

declare interface URIListData {
  uriList: URIReference[];
}

export default defineComponent({
  components: { CreatedByLine },
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
  },
});
</script>
