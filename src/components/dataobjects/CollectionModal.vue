<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="lg"
    :title="modalName"
    lazy
    @show="prepareEdit"
    @ok="handleEdit"
  >
    <b-form-group>
      <b-container>
        <b-row class="mb-3">
          <b-col cols="2"> Name </b-col>
          <b-col cols="8">
            <b-form-input
              v-model="newCollection.name"
              required
              placeholder="Name"
            >
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3">
          <b-col cols="2"> Description </b-col>
          <b-col cols="8">
            <b-form-textarea
              v-model="newCollection.description"
              placeholder="please insert description"
              rows="3"
              max-rows="6"
            >
            </b-form-textarea>
          </b-col>
        </b-row>
        <p>Attributes</p>
        <div class="mt-3">
          <b-form-group
            v-for="(attribute, i) in possibleAttributes"
            :key="i"
            class="m-0"
          >
            <b-row class="mb-1">
              <b-col cols="2">{{ i }}</b-col>
              <b-col cols="3">
                <b-form-input
                  v-model="attribute.key"
                  placeholder="key"
                ></b-form-input>
              </b-col>

              <b-col cols="5">
                <b-form-input
                  v-model="attribute.value"
                  placeholder="value"
                ></b-form-input>
              </b-col>

              <b-col cols="1">
                <b-button
                  v-show="i == possibleAttributes.length - 1"
                  class="fixed-width"
                  variant="success"
                  @click="
                    possibleAttributes.push({
                      key: '',
                      value: '',
                    })
                  "
                >
                  <CreateIcon />
                </b-button>
              </b-col>
              <b-col cols="1">
                <b-button
                  v-show="i || (!i && possibleAttributes.length > 1)"
                  class="fixed-width"
                  variant="danger"
                  @click="possibleAttributes.splice(i, 1)"
                >
                  <RemoveIcon />
                </b-button>
              </b-col>
            </b-row>
          </b-form-group>
        </div>
      </b-container>
    </b-form-group>
  </b-modal>
</template>

<script lang="ts">
import { CollectionVue } from "@/utils/api-mixin";
import { Collection } from "@dlr-shepard/shepard-client";
import Vue, { VueConstructor } from "vue";

interface CollectionModalData {
  newCollection: Collection;
  possibleAttributes: {
    key: string;
    value: string;
  }[];
  validationError: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof CollectionVue>>
).extend({
  mixins: [CollectionVue],
  props: {
    modalId: {
      type: String,
      default: "collectionModal",
    },
    modalName: {
      type: String,
      default: "collectionModal",
    },
    currentCollection: {
      type: Object as () => Collection,
      default: undefined,
    },
  },

  data() {
    return {
      newCollection: {},
      possibleAttributes: [] as {
        key: string;
        value: string;
      }[],
      validationError: false,
    } as CollectionModalData;
  },

  methods: {
    prepareEdit() {
      this.newCollection = this.currentCollection
        ? { ...this.currentCollection }
        : { name: "" };
      this.possibleAttributes = [];
      this.validationError = false;

      if (this.currentCollection?.attributes) {
        Object.entries(this.currentCollection?.attributes).forEach(
          ([key, value]) => {
            this.possibleAttributes.push({ key: key, value: value });
          },
        );
      }
      if (this.possibleAttributes.length == 0) {
        this.possibleAttributes.push({
          key: "",
          value: "",
        });
      }
    },
    handleEdit() {
      if (!this.currentCollection?.id) return;
      let attributes: { [key: string]: string } = {};
      this.possibleAttributes.forEach(attr => {
        if (attr.key != "") {
          attributes[attr.key] = attr.value;
        }
      });
      this.newCollection.attributes = attributes;

      this.collectionApi
        ?.updateCollection({
          collectionId: this.currentCollection.id,
          collection: this.newCollection,
        })
        .then(() => {
          this.$emit("collectionChanged");
        })
        .catch(e => {
          console.log("Error while updating collection " + e);
        })
        .finally();
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
