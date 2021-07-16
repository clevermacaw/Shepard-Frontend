<template>
  <div>
    <h4>Api Keys List</h4>
    <b-input-group class="component">
      <b-form-input
        v-model="newName"
        class="fixed-height"
        placeholder="Name"
        @keyup.enter="handleCreate"
      ></b-form-input>
      <b-input-group-append>
        <b-button variant="primary" @click="handleCreate">
          <create-icon />
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <b-modal
      id="created-apikey-modal"
      ref="modal"
      title="Created Api Key"
      @ok="createdApiKey = undefined"
    >
      <div v-if="createdApiKey">
        <h6>Successfully created!</h6>
        <p>{{ createdApiKey.name }} | {{ createdApiKey.uid }}</p>
        <b-button size="sm" variant="primary" @click="copyApiKey">
          Copy Api Key
        </b-button>
      </div>
    </b-modal>
    <div>
      <b-list-group>
        <b-list-group-item v-for="(apiKey, index) in apiKeys" :key="index">
          {{ apiKey.name }}
          <b-button
            class="float-right"
            size="sm"
            variant="dark"
            @click="handleDelete(index)"
          >
            <delete-icon />
          </b-button>
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
  newName: string;
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
      newName: "",
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
    copyApiKey() {
      if (!this.createdApiKey || !this.createdApiKey.jwt) return;
      navigator.clipboard.writeText(this.createdApiKey.jwt);
    },
    handleCreate() {
      this.apiKeyApi
        ?.createApiKey({
          username: this.currentUsername,
          apiKey: { name: this.newName } as ApiKey,
        })
        .then(response => {
          this.createdApiKey = response;
          this.$bvModal.show("created-apikey-modal");
        })
        .catch(e => {
          console.log("Error while creating api key" + e);
        })
        .finally(() => {
          this.retrieveApiKeys();
          this.newName = "";
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

<style scoped>
.fixed-height {
  height: 40px;
}
</style>
