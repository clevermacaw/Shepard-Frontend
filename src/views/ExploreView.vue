<template>
  <div class="explore">
    <div class="component">
      <h4>Explore Collections</h4>
      <b-button v-b-modal.create-collection-modal variant="primary">
        Create Collection
      </b-button>
      <b-modal
        id="create-collection-modal"
        ref="modal"
        size="lg"
        title="Create Collection"
        @show="prepareCreate"
        @ok="handleCreate"
      >
        <b-form-group>
          <b-container>
            <b-row class="mb-3">
              <b-col cols="2"> Name </b-col>
              <b-col cols="8">
                <b-form-input
                  id="name-input"
                  v-model="newCollection.name"
                  required
                  placeholder="Name"
                >
                </b-form-input>
              </b-col>
            </b-row>

            <b-row class="mb-3">
              <b-col cols="2"> Description </b-col>
              <b-col cols="8">
                <b-form-textarea
                  id="collection-description"
                  v-model="newCollection.description"
                  placeholder="please insert description"
                  rows="3"
                  max-rows="6"
                >
                </b-form-textarea>
              </b-col>
            </b-row>
          </b-container>
        </b-form-group>
      </b-modal>
    </div>
    <div class="component">
      <CollectionList />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import CollectionList from "@/components/CollectionList.vue";
import { CollectionApi, Collection } from "@dlr-shepard/shepard-client";
import { CollectionVue } from "@/utils/api-mixin";

interface ExploreData {
  collectionApi?: CollectionApi;
  newCollection: Collection;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  components: { CollectionList },
  mixins: [CollectionVue],
  data() {
    return {
      newCollection: {},
    } as ExploreData;
  },
  methods: {
    prepareCreate() {
      this.newCollection = {};
    },
    handleCreate() {
      this.collectionApi
        ?.createCollection({ collection: this.newCollection })
        .then(response => {
          this.$router.push({
            name: "Collection",
            params: { collectionId: "" + response.id },
          });
        })
        .catch(e => {
          console.log("Error while creating collection" + e);
        })
        .finally();
    },
  },
});
</script>
