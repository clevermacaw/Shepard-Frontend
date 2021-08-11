<template>
  <div class="about-user">
    <div class="component">
      <h4>Your current user</h4>
      <b-list-group>
        <b-list-group-item v-for="c in claims" :key="c.key">
          <strong>{{ c.key }}:</strong> {{ c.value }}
        </b-list-group-item>
      </b-list-group>
    </div>
    <b-button variant="danger" @click="signOutOidc()"> Sign out </b-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";

export default Vue.extend({
  computed: {
    ...mapGetters("oidcStore", [
      "oidcAccessToken",
      "oidcIsAuthenticated",
      "oidcUser",
    ]),
    claims() {
      if (this.oidcIsAuthenticated) {
        return Object.keys(this.oidcUser).map(key => ({
          key,
          value: this.oidcUser[key],
        }));
      }
      return [];
    },
  },
  methods: {
    ...mapActions("oidcStore", ["signOutOidc"]),
  },
});
</script>
