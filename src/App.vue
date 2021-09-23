<template>
  <div id="app">
    <Navbar />
    <Breadcrumb id="view" />
    <router-view id="view" :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import Navbar from "@/components/Navbar.vue";

export default Vue.extend({
  components: { Breadcrumb, Navbar },
});
</script>

<style>
#app {
  margin-bottom: 20%;
}

#view {
  margin: auto;
  max-width: 850px;
}

.component {
  margin-bottom: 20px;
  margin-top: 20px;
}

.validationField {
  border: solid;
  border-color: red;
  opacity: 0.6;
}

h3 {
  font-weight: bold;
}

h4 {
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
