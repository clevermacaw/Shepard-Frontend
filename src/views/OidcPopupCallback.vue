<template>
  <div></div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
export default Vue.extend({
  name: "OidcPopupCallback",
  methods: {
    ...mapActions("oidcStore", ["oidcSignInPopupCallback"]),
  },
  created() {
    this.oidcSignInPopupCallback().catch(err => {
      console.error(err); // Handle errors any way you want
    });
  },
});
</script>
