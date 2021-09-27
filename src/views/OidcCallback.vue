<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "OidcCallback",
  created() {
    this.oidcSignInCallback()
      .then(redirectPath => {
        this.$router.push(redirectPath);
      })
      .catch(err => {
        console.error(err);
        this.$router.push("/oidc-callback-error"); // Handle errors any way you want
      });
  },
  methods: {
    ...mapActions("oidcStore", ["oidcSignInCallback"]),
  },
});
</script>
