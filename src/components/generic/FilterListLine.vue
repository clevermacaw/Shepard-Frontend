<template>
  <div>
    <b-row>
      <b-col>
        <b-pagination
          v-model="currentPage"
          :per-page="currentSize"
          :total-rows="totalRows"
          @change="updatePage($event)"
        ></b-pagination>
      </b-col>
      <b-col>
        <b-form-select
          v-model="currentSize"
          :options="sizeOptions"
          @change="updateSize($event)"
        ></b-form-select>
      </b-col>
      <b-col>
        <b-form-select
          v-model="orderBy"
          :options="orderByOptions"
          @change="updateOrderBy($event)"
        ></b-form-select>
      </b-col>
      <b-col>
        <b-form-select
          v-model="descending"
          :options="descendingOptions"
          @change="updateDescending($event)"
        ></b-form-select>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export interface FilterChangedData {
  currentPage: number;
  currentSize: number;
  orderBy: string;
  descending: boolean;
}

interface FilterListLineData {
  currentPage: number;
  currentSize: number;
  orderBy: string;
  descending: boolean;
  sizeOptions: Array<{ value: number; text: string }>;
  orderByOptions: Array<{ value: string; text: string }>;
  descendingOptions: Array<{ value: boolean; text: string }>;
}

export default Vue.extend({
  props: {
    totalRows: {
      type: Number,
      required: true,
    },
    defaultPage: {
      type: Number,
      default: 1,
    },
    defaultSize: {
      type: Number,
      default: 10,
    },
    defaultOrderBy: {
      type: String,
      default: "createdAt",
    },
    defaultDescending: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentPage: this.defaultPage,
      currentSize: this.defaultSize,
      sizeOptions: [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" },
      ],
      orderBy: this.defaultOrderBy,
      orderByOptions: [
        { value: "createdAt", text: "Created At" },
        { value: "createdBy", text: "Created By" },
        { value: "updatedAt", text: "Updated At" },
        { value: "updatedBy", text: "Updated By" },
        { value: "name", text: "Name" },
      ],
      descending: this.defaultDescending,
      descendingOptions: [
        { value: false, text: "Ascending" },
        { value: true, text: "Descending" },
      ],
    } as FilterListLineData;
  },
  watch: {
    defaultPage() {
      if (this.currentPage != this.defaultPage)
        this.currentPage = this.defaultPage;
    },
  },
  methods: {
    update() {
      const options = {
        currentPage: this.currentPage,
        currentSize: this.currentSize,
        orderBy: this.orderBy,
        descending: this.descending,
      } as FilterChangedData;
      this.$emit("filterChanged", options);
    },
    updatePage(nextPage: number) {
      this.currentPage = nextPage;
      this.update();
    },
    updateSize(nextSize: number) {
      this.currentSize = nextSize;
      this.update();
    },
    updateOrderBy(nextOrderBy: string) {
      this.orderBy = nextOrderBy;
      this.update();
    },
    updateDescending(nextDescending: boolean) {
      this.descending = nextDescending;
      this.update();
    },
  },
});
</script>
