<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
export default Vue.extend({
  name: "OidcPopupCallback",
  created() {
    this.oidcSignInPopupCallback().catch(err => {
      console.error(err); // Handle errors any way you want
    });
  },
  methods: {
    ...mapActions("oidcStore", ["oidcSignInPopupCallback"]),
  },
});
</script>
