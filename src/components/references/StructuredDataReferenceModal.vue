<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="lg"
    :title="modalName"
    lazy
    @show="reset()"
    @ok="handleOk()"
  >
    <b-form-group>
      <b-container>
        <b-row class="mb-3">
          <b-col cols="3"> Name </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newStructuredDataReference.name"
              required
              placeholder="Name"
            >
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="3"> Container ID </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newStructuredDataReference.structuredDataContainerId"
              required
              placeholder="please insert structured data container id"
              @blur="prepareOids()"
            >
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="3"> Oids </b-col>
          <b-col cols="8">
            <b-form-select
              v-model="selected"
              :options="possibleOids"
              multiple
              required
            >
            </b-form-select>
          </b-col>
        </b-row>
      </b-container>
    </b-form-group>
  </b-modal>
</template>

<script lang="ts">
import Vue from "vue";
import { VueConstructor } from "vue";
import { StructuredDataReference } from "@dlr-shepard/shepard-client";
import { StructuredDataVue } from "@/utils/api-mixin";

interface Option {
  value: string;
  text: string;
}

interface StructuredDataReferenceModelData {
  newStructuredDataReference: StructuredDataReference;
  possibleOids: Array<Option>;
  selected: Array<string>;
}

function initialState(): StructuredDataReferenceModelData {
  return {
    newStructuredDataReference: {
      name: "",
      structuredDataOids: [],
      structuredDataContainerId: 0,
    },
    possibleOids: [],
    selected: [],
  };
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataVue>>
).extend({
  mixins: [StructuredDataVue],
  props: {
    modalId: {
      type: String,
      default: "StructuredDataReferenceModal",
    },
    modalName: {
      type: String,
      default: "StructuredDataReferenceModal",
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

    handleOk() {
      this.newStructuredDataReference.structuredDataOids = this.selected;
      this.$emit("create", this.newStructuredDataReference);
    },

    prepareOids() {
      this.structuredDataApi
        ?.getAllStructuredDatas({
          structureddataContainerId:
            this.newStructuredDataReference.structuredDataContainerId,
        })
        .then(response => {
          response.forEach(strdata => {
            if (!strdata.oid) {
              return;
            }
            const option: Option = {
              value: strdata.oid,
              text: strdata.oid + " - " + strdata.name,
            };
            this.possibleOids.push(option);
          });
        })
        .catch(e => {
          console.log("Error while getting all structured datas " + e);
        })
        .finally();
    },
  },
});
</script>
