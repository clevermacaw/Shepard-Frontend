<template>
  <div>
    <b-list-group>
      <DataObjectListItem
        v-for="(dataObject, index) in dataObjects"
        :key="index"
        :data-object="dataObject"
      />
    </b-list-group>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from "vue";
import { DataObject } from "@dlr-shepard/shepard-client";
import { DataObjectVue } from "@/utils/api-mixin";
import DataObjectListItem from "@/components/dataobjects/DataObjectListItem.vue";

interface DataObjectListData {
  dataObjects: DataObject[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectVue>>
).extend({
  components: { DataObjectListItem },
  mixins: [DataObjectVue],
  props: {
    currentCollectionId: {
      type: Number,
      required: true,
    },
    dataObjectIds: {
      type: Array as PropType<Array<number>>,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      dataObjects: new Array<DataObject>(),
    } as DataObjectListData;
  },
  mounted() {
    this.retrieveDataObjects();
  },
  methods: {
    retrieveDataObjects() {
      this.dataObjectIds?.forEach(element => {
        this.dataObjectApi
          ?.getDataObject({
            collectionId: this.currentCollectionId,
            dataObjectId: element,
          })
          .then(response => {
            this.dataObjects.push(response);
          })
          .catch(e => {
            console.log("Error while fetching dataObject: " + e.statusText);
          })
          .finally();
      });
    },
  },
});
</script>
