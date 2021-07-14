<template>
  <div>
    <div>
      <h4>Api Keys List</h4>
      <b-button v-b-modal.create-apikey-modal variant="primary">
        <create-icon />
      </b-button>
      <b-modal
        id="create-apikey-modal"
        ref="modal"
        title="Create Api Key"
        @show="prepareCreate"
        @ok="handleCreate"
      >
        <b-form-group label="Name" label-for="name-input">
          <b-form-input id="name-input" v-model="newApiKey.name"></b-form-input>
        </b-form-group>
      </b-modal>
      <b-modal id="created-apikey-model" ref="modal" title="Created Api Key">
        <div v-if="createdApiKey">
          <h6>Successfully created!</h6>
          <p>{{ createdApiKey.name }} | {{ createdApiKey.uid }}</p>
          <b-button size="sm" variant="primary" @click="copyApiKey">
            Copy Api Key
          </b-button>
        </div>
      </b-modal>
    </div>
    <div>
      <b-list-group>
        <b-list-group-item v-for="(apiKey, index) in apiKeys" :key="index">
          {{ apiKey.name }}
          <b-button-group style="float: right">
            <b-button size="sm" variant="dark" @click="handleDelete(index)">
              <delete-icon />
            </b-button>
          </b-button-group>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { ApiKey, ApiKeyWithJWT } from "@dlr-shepard/shepard-client";
import { ApiKeyVue } from "@/utils/api-mixin";

declare interface ApiKeyListData {
  apiKeys: ApiKey[];
  name: string;
  newApiKey: ApiKey;
  createdApiKey?: ApiKeyWithJWT;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof ApiKeyVue>>
).extend({
  mixins: [ApiKeyVue],
  props: {
    currentUsername: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      apiKeys: new Array<ApiKey>(),
      name: "",
      newApiKey: {},
      createdApiKey: undefined,
    } as ApiKeyListData;
  },
  watch: {
    currentUsername() {
      this.retrieveApiKeys();
    },
  },
  mounted() {
    this.retrieveApiKeys();
  },
  methods: {
    retrieveApiKeys() {
      if (!this.currentUsername) return;
      this.apiKeyApi
        ?.getAllApiKeys({ username: this.currentUsername })
        .then(response => {
          this.apiKeys = response;
        })
        .catch(e => {
          console.log("Error while fetching apiKeys" + e);
        })
        .finally();
    },
    prepareCreate() {
      this.newApiKey = {};
      this.createdApiKey = undefined;
    },
    copyApiKey() {
      if (!this.createdApiKey || !this.createdApiKey.jwt) return;
      navigator.clipboard.writeText(this.createdApiKey.jwt);
    },
    handleCreate() {
      this.apiKeyApi
        ?.createApiKey({
          username: this.currentUsername,
          apiKey: this.newApiKey,
        })
        .then(response => {
          this.createdApiKey = response;
          this.$bvModal.show("created-apikey-model");
        })
        .catch(e => {
          console.log("Error while creating api key" + e);
        })
        .finally(() => {
          this.retrieveApiKeys();
        });
    },
    handleDelete(index: number) {
      const uid = this.apiKeys[index].uid;
      if (!uid) return;
      this.apiKeyApi
        ?.deleteApiKey({ username: this.currentUsername, apikeyUid: uid })
        .then()
        .catch(e => {
          console.log("Error while fetching apiKeys" + e);
        })
        .finally(() => {
          this.retrieveApiKeys();
        });
    },
  },
});
</script>
