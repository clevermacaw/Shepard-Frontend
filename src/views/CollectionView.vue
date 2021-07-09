<template>
  <div v-if="currentCollection" class="collection">
    <h3>{{ currentCollection.name }}</h3>
    <p>
      Object ID: {{ currentCollection.id }}
      <br />
      <small v-if="currentCollection.createdAt">
        created at {{ currentCollection.createdAt.toDateString() }}
      </small>
      <small v-if="currentCollection.createdBy">
        by {{ currentCollection.createdBy }}
      </small>
      <br />
      <small v-if="currentCollection.updatedAt">
        updated at {{ currentCollection.updatedAt.toDateString() }}
      </small>
      <small v-if="currentCollection.updatedBy">
        by {{ currentCollection.updatedBy }}
      </small>
    </p>

    <div v-if="currentCollection.description">
      <h4>Description</h4>
      <div class="description">
        <div v-if="currentCollection.description.length < 300">
          {{ currentCollection.description }}
        </div>
        <div v-else>
          <a v-if="readMore">
            {{ currentCollection.description }}
          </a>
          <a v-else>
            {{ currentCollection.description.substring(0, 300) + "..." }}
          </a>
          <a @click="readMore = !readMore">
            <span v-if="readMore" class="moreorless">Read Less</span>
            <span v-else class="moreorless">Read More</span>
          </a>
        </div>
      </div>
    </div>

    <div v-if="hasAttribute">
      <h4>Attributes</h4>
      <ul>
        <li v-for="(value, key) in currentCollection.attributes" :key="key">
          <b>{{ key }}:</b> {{ value }}
        </li>
      </ul>
    </div>

    <GenericCollapse
      v-if="currentCollection.dataObjectIds.length"
      title="Data Objects"
      visible
    >
      <DataObjectList
        :current-collection-id="currentCollectionId"
        :parent-id="-1"
      />
    </GenericCollapse>

    <div class="component">
      <h4>Edit</h4>
      <CollectionEdit
        :current-collection-id="currentCollectionId"
        @collectionChanged="retrieveCollection()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import DataObjectList from "@/components/DataObjectList.vue";
import CollectionEdit from "@/components/CollectionEdit.vue";
import GenericCollapse from "@/components/GenericCollapse.vue";
import { Collection } from "@dlr-shepard/shepard-client";
import { CollectionVue } from "@/utils/api-mixin";

interface CollectionData {
  currentCollection?: Collection;
  hasAttribute: boolean;
  readMore: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  components: { GenericCollapse, DataObjectList, CollectionEdit },
  mixins: [CollectionVue],
  data() {
    return {
      currentCollection: undefined,
      hasAttribute: false,
      readMore: false,
    } as CollectionData;
  },
  computed: {
    currentCollectionId(): number {
      return Number(this.$router.currentRoute.params.collectionId);
    },
  },
  mounted() {
    this.retrieveCollection();
  },
  methods: {
    retrieveCollection() {
      this.collectionApi
        ?.getCollection({ collectionId: this.currentCollectionId })
        .then(response => {
          this.currentCollection = response;

          if (this.currentCollection.attributes !== undefined) {
            if (Object.keys(this.currentCollection?.attributes).length > 0) {
              this.hasAttribute = true;
            }
          }
        })
        .catch(e => {
          console.log("Error while fetching collection" + e);
        })
        .finally();
    },
  },
});
</script>

<style scoped>
h3 {
  font-weight: bold;
}
h4 {
  margin-top: 30px;
  margin-bottom: 10px;
}

.description {
  font-style: italic;
  text-align: justify;
}

.moreorless {
  font-style: italic;
  color: blue;
}
</style>
