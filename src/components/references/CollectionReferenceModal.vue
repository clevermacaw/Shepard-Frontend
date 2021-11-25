<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="lg"
    :title="modalName"
    lazy
    @show="reset()"
    @ok="$emit('create', newCollectionReference)"
  >
    <b-form-group>
      <b-container>
        <b-row class="mb-3">
          <b-col cols="2"> Name </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newCollectionReference.name"
              required
              placeholder="Name"
            >
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="2"> Referenced Collection ID </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newCollectionReference.referencedCollectionId"
              required
              placeholder="please insert referenced collection id"
            >
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="2"> Relationship </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newCollectionReference.relationship"
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
import { CollectionReference } from "@dlr-shepard/shepard-client";

interface CollectionReferenceModelData {
  newCollectionReference: CollectionReference;
}

function initialState(): CollectionReferenceModelData {
  return {
    newCollectionReference: {
      name: "",
      referencedCollectionId: 0,
      relationship: "",
    },
  };
}

export default Vue.extend({
  props: {
    modalId: {
      type: String,
      default: "CollectionReferenceModal",
    },
    modalName: {
      type: String,
      default: "CollectionReferenceModal",
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
    return initialState();
  },
  methods: {
    reset() {
      Object.assign(this.$data, initialState());
    },
  },
});
</script>
