<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";
export default defineComponent({
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
