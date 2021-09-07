<template>
  <div>
    <b-row>
      <b-col v-if="maxObjects">
        <b-pagination
          v-model="currentPage"
          :total-rows="maxObjects"
          :per-page="sizeSelected"
          size="sm"
          @change="retrieveDataObjects($event)"
        ></b-pagination>
      </b-col>
      <b-col v-if="maxObjects">
        <b-form-select
          v-model="sizeSelected"
          :options="sizeOptions"
          @change="retrieveDataObjects()"
        ></b-form-select>
      </b-col>
      <b-col>
        <b-form-select
          v-model="orderBySelected"
          :options="orderByOptions"
          @change="retrieveDataObjects()"
        ></b-form-select>
      </b-col>
      <b-col>
        <b-form-select
          v-model="descendingSelected"
          :options="descendingOptions"
          @change="retrieveDataObjects()"
        ></b-form-select>
      </b-col>
    </b-row>
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
import { DataObjectVue } from "@/utils/api-mixin";
import DataObjectListItem from "@/components/DataObjectListItem.vue";

interface DataObjectListData {
  dataObjects: DataObject[];
  currentDataObject?: DataObject;
  sizeSelected: number;
  orderBySelected: GetAllDataObjectsOrderByEnum;
  descendingSelected: boolean;
  currentPage: number;
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
      descendingOptions: [
        { value: true, text: "Descending" },
        { value: false, text: "Ascending" },
      ],
      orderBySelected: "name",
      orderByOptions: [
        { value: GetAllDataObjectsOrderByEnum.CreatedAt, text: "Created At" },
        { value: GetAllDataObjectsOrderByEnum.CreatedBy, text: "Created By" },
        { value: GetAllDataObjectsOrderByEnum.UpdatedAt, text: "Updated At" },
        { value: GetAllDataObjectsOrderByEnum.UpdatedBy, text: "Updated By" },
        { value: GetAllDataObjectsOrderByEnum.Name, text: "Name" },
        { value: GetAllDataObjectsOrderByEnum.ParentId, text: "Parent Id" },
      ],
      sizeSelected: 10,
      sizeOptions: [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" },
        { value: 150, text: "150" },
      ],
    } as DataObjectListData;
  },
  mounted() {
    this.retrieveDataObjects();
  },
  methods: {
    retrieveDataObjects(page?: number) {
      const nextPage = page || this.currentPage;
      this.dataObjectApi
        ?.getAllDataObjects({
          collectionId: this.currentCollectionId,
          parentId: this.parentId,
          size: this.sizeSelected,
          orderBy: this.orderBySelected,
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
