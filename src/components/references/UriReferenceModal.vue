<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="lg"
    :title="modalName"
    lazy
    @show="reset()"
    @ok="$emit('create', newURIReference)"
  >
    <b-form-group>
      <b-container>
        <b-row class="mb-3">
          <b-col cols="2"> Name </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newURIReference.name"
              required
              placeholder="Name"
            >
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="2"> URI </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newURIReference.uri"
              required
              placeholder="please insert URI"
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
import { URIReference } from "@dlr-shepard/shepard-client";

interface URIReferenceModelData {
  newURIReference: URIReference;
}

function initialState(): URIReferenceModelData {
  return {
    newURIReference: {
      name: "",
      uri: "",
    },
  };
}

export default Vue.extend({
  props: {
    modalId: {
      type: String,
      default: "URIReferenceModal",
    },
    modalName: {
      type: String,
      default: "URIReferenceModal",
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

<style scoped>
.fixed-width {
  width: 40px;
  height: 40px;
  padding: 0px;
}
</style>
