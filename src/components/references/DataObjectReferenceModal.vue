<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="lg"
    :title="modalName"
    lazy
    @show="handlePrepare"
    @ok="$emit('create', newDataObjectReference)"
  >
    <b-form-group>
      <b-container>
        <b-row class="mb-3">
          <b-col cols="2"> Name </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newDataObjectReference.name"
              required
              placeholder="Name"
            >
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="2"> Referenced Data Object ID </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newDataObjectReference.referencedDataObjectId"
              required
              placeholder="please insert referenced data object id"
            >
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="2"> Relationship </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newDataObjectReference.relationship"
              required
              placeholder="please insert relationship"
            >
            </b-form-input>
          </b-col>
        </b-row>
      </b-container>
    </b-form-group>
  </b-modal>
</template>

<script lang="ts">
import Vue from "vue";
import { DataObjectReference } from "@dlr-shepard/shepard-client";

declare interface DataObjectReferenceModelData {
  newDataObjectReference: DataObjectReference;
}

export default Vue.extend({
  props: {
    modalId: {
      type: String,
      default: "DataObjectReferenceModal",
    },
    modalName: {
      type: String,
      default: "DataObjectReferenceModal",
    },
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
      newDataObjectReference: {
        name: "",
        referencedDataObjectId: 0,
        relationship: "",
      },
    } as DataObjectReferenceModelData;
  },

  methods: {
    handlePrepare() {
      this.newDataObjectReference = {
        name: "",
        referencedDataObjectId: 0,
        relationship: "",
      };
    },
  },
});
</script>
