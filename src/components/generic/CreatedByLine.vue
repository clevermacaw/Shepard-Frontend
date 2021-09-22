<template>
  <div>
    <small v-if="updated">updated</small>
    <small v-else>created</small>
    <small v-if="createdAt" v-b-tooltip.hover :title="createdAt.toString()">
      at {{ createdAt.toDateString() }}
    </small>
    <small v-if="getAllUsers[createdBy]" v-b-tooltip.hover :title="createdBy">
      by {{ getAllUsers[createdBy].lastName }},
      {{ getAllUsers[createdBy].firstName }}
    </small>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default Vue.extend({
  props: {
    createdBy: {
      type: String,
      default: undefined,
    },
    createdAt: {
      type: Date,
      default: undefined,
    },
    updated: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters("userCache", [
      "isUserInCache",
      "getUserFromCache",
      "getAllUsers",
    ]),
  },
  updated() {
    this.retrieveUser();
  },
  mounted() {
    this.retrieveUser();
  },
  methods: {
    ...mapActions("userCache", ["fetchUser"]),
    ...mapMutations("userCache", ["addUserToCache"]),
    retrieveUser() {
      if (!this.isUserInCache(this.createdBy)) {
        this.fetchUser(this.createdBy);
      }
    },
  },
});
</script>
