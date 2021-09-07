<template>
  <div>
    <b-row>
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
import Vue, { PropType, VueConstructor } from "vue";
import {
  DataObject,
  GetAllDataObjectsOrderByEnum,
} from "@dlr-shepard/shepard-client";
import { DataObjectVue } from "@/utils/api-mixin";
import DataObjectListItem from "@/components/DataObjectListItem.vue";

interface DataObjectListData {
  dataObjects: DataObject[];
  currentDataObject?: DataObject;
  orderBySelected: GetAllDataObjectsOrderByEnum;
  descendingSelected: boolean;
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
      currentDataObject: undefined,
      descendingSelected: false,
      descendingOptions: [
        { value: false, text: "Ascending" },
        { value: true, text: "Descending" },
      ],
      orderBySelected: GetAllDataObjectsOrderByEnum.CreatedAt,
      orderByOptions: [
        { value: GetAllDataObjectsOrderByEnum.CreatedAt, text: "Created At" },
        { value: GetAllDataObjectsOrderByEnum.CreatedBy, text: "Created By" },
        { value: GetAllDataObjectsOrderByEnum.UpdatedAt, text: "Updated At" },
        { value: GetAllDataObjectsOrderByEnum.UpdatedBy, text: "Updated By" },
        { value: GetAllDataObjectsOrderByEnum.Name, text: "Name" },
        { value: GetAllDataObjectsOrderByEnum.ParentId, text: "Parent Id" },
      ],
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
            console.log("Error while fetching dataObject " + e);
          })
          .finally();
      });
    },
  },
});
</script>
