<template>
  <div class="data">
    <div class="component">
      <h4>Data Management Page</h4>
      <Artifact />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Artifact from "@/components/ArtifactCreate.vue";

export default Vue.extend({
  components: { Artifact },
});
</script>
