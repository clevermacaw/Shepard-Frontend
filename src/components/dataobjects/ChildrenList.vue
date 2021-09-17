<template>
  <div>
    <FilterListLine
      v-if="maxObjects"
      :total-rows="maxObjects"
      :default-size="sizeSelected"
      :default-descending="descendingSelected"
      :default-order-by="orderBySelected"
      @filterChanged="filterChanged($event)"
    />
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
import Vue, { VueConstructor } from "vue";
import {
  DataObject,
  GetAllDataObjectsOrderByEnum,
} from "@dlr-shepard/shepard-client";
import DataObjectListItem from "@/components/dataobjects/DataObjectListItem.vue";
import FilterListLine from "@/components/generic/FilterListLine.vue";
import { DataObjectVue } from "@/utils/api-mixin";
import { FilterChangedData } from "../generic/FilterListLine.vue";

interface DataObjectListData {
  dataObjects: DataObject[];
  currentDataObject?: DataObject;
  sizeSelected: number;
  orderBySelected: string;
  descendingSelected: boolean;
  currentPage: number;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof DataObjectVue>>
).extend({
  components: { DataObjectListItem, FilterListLine },
  mixins: [DataObjectVue],
  props: {
    currentCollectionId: {
      type: Number,
      required: true,
    },
    parentId: {
      type: Number,
      required: true,
    },
    maxObjects: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      dataObjects: [],
      currentDataObject: undefined,
      currentPage: 1,
      descendingSelected: false,
      orderBySelected: GetAllDataObjectsOrderByEnum.CreatedAt,
      sizeSelected: 10,
    } as DataObjectListData;
  },
  mounted() {
    this.retrieveDataObjects();
  },
  methods: {
    filterChanged(options: FilterChangedData) {
      this.currentPage = options.currentPage;
      this.sizeSelected = options.currentSize;
      this.descendingSelected = options.descending;
      this.orderBySelected = options.orderBy;
      this.retrieveDataObjects();
    },
    retrieveDataObjects(page?: number) {
      const nextPage = page || this.currentPage;
      const nextOrderBy = this
        .orderBySelected as keyof typeof GetAllDataObjectsOrderByEnum as GetAllDataObjectsOrderByEnum;
      this.dataObjectApi
        ?.getAllDataObjects({
          collectionId: this.currentCollectionId,
          parentId: this.parentId,
          size: this.sizeSelected,
          orderBy: nextOrderBy,
          orderDesc: this.descendingSelected,
          page: nextPage - 1,
        })
        .then(response => {
          this.dataObjects = response;
        })
        .catch(e => {
          console.log("Error while fetching dataObjects " + e);
        })
        .finally();
    },
  },
});
</script>
