<template>
  <div>
    <h1>Error in authentication</h1>
    This can be a false positive. Give it a try and visit the
    <b-link :to="{ name: 'Explore' }">main page</b-link>.
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "OidcCallbackError",
});
</script>
