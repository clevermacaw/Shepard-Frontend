<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="lg"
    :title="modalName"
    lazy
    @show="handleShowModal()"
    @ok="handleOk()"
  >
    <b-form-group>
      <b-container>
        <b-row class="mb-3">
          <b-col cols="3"> Name </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newFileReference.name"
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
              v-model="newFileReference.fileContainerId"
              required
              placeholder="please insert file container id"
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
import { FileReference } from "@dlr-shepard/shepard-client";
import { FileVue } from "@/utils/api-mixin";

interface Option {
  value: string;
  text: string;
}

interface FileReferenceModelData {
  newFileReference: FileReference;
  possibleOids: Array<Option>;
  selected: Array<string>;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FileVue>>
).extend({
  mixins: [FileVue],
  props: {
    modalId: {
      type: String,
      default: "FileReferenceModal",
    },
    modalName: {
      type: String,
      default: "FileReferenceModal",
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
      newFileReference: {
        name: "",
        fileOids: [],
        fileContainerId: 0,
      },
      possibleOids: [],
      selected: [],
    } as FileReferenceModelData;
  },

  methods: {
    handleShowModal() {
      this.newFileReference = {
        name: "",
        fileOids: [],
        fileContainerId: 0,
      };
      this.possibleOids = [];
    },

    handleOk() {
      this.newFileReference.fileOids = this.selected;
      this.$emit("create", this.newFileReference);
    },

    prepareOids() {
      this.fileApi
        ?.getAllFiles({
          fileContainerId: this.newFileReference.fileContainerId,
        })
        .then(response => {
          response.forEach(file => {
            if (!file.oid) {
              return;
            }
            const option: Option = {
              value: file.oid,
              text: file.oid + " - " + file.filename,
            };
            this.possibleOids.push(option);
          });
        })
        .catch(e => {
          console.log("Error while getting all files " + e);
        })
        .finally();
    },
  },
});
</script>
