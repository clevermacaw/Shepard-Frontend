<template>
  <div class="about-user">
    <div class="component">
      <h4>Your current user</h4>
      <ul class="claims">
        <li v-for="c in claims" :key="c.key">
          <strong>{{ c.key }}</strong> : {{ c.value }}
        </li>
        <li>
          <strong>accessToken</strong> : <code>{{ oidcAccessToken }}</code>
        </li>
      </ul>
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

<style>
.claims {
  list-style: none;
  text-align: left;
}
</style>
