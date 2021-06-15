<template>
  <div class="about">
    <div class="component">
      <h4>This is an about page</h4>
      <ul>
        <li>
          <strong>Frontend Version</strong> :
          <code>{{ appVersion }}</code>
        </li>
        <li>
          <strong>Backend Version</strong> :
          <code v-if="backend">{{ backend.info.version }}</code>
          <code v-else>unknown</code>
        </li>
        <li>
          <strong>OpenAPI Version</strong> :
          <code v-if="backend">{{ backend.openapi }}</code>
          <code v-else>unknown</code>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import getEnv from "@/utils/env";
import { version } from "../../package.json";

declare interface AboutData {
  backend?: unknown;
  appVersion: string;
}

export default Vue.extend({
  data() {
    return {
      backend: undefined,
      appVersion: version,
    } as AboutData;
  },
  mounted() {
    this.fetchBackend();
  },
  methods: {
    fetchBackend() {
      const backendUrl: string[] = getEnv("VUE_APP_BACKEND").split("/");
      backendUrl.pop();
      backendUrl.push("doc/openapi.json");
      fetch(backendUrl.join("/"))
        .then(response => response.json())
        .then(data => (this.backend = data));
    },
  },
});
</script>
