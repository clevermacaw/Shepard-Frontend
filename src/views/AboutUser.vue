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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  computed: {
    ...mapGetters("oidcStore", [
      "oidcIsAuthenticated",
      "oidcUser",
      "oidcAccessToken",
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
});
</script>
