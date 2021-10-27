<template>
  <div>
    <small v-if="updated">updated</small>
    <small v-else>created</small>
    <small v-if="createdAt" :id="'at' + id">
      at {{ createdAt.toDateString() }}
    </small>
    <b-tooltip :target="'at' + id" :delay="{ show: 500, hide: 100 }">
      {{ createdAt.toString() }}
    </b-tooltip>
    <small v-if="getAllUsers[createdBy]" :id="'by' + id">
      by {{ getAllUsers[createdBy].lastName }},
      {{ getAllUsers[createdBy].firstName }}
    </small>
    <b-tooltip :target="'by' + id" :delay="{ show: 500, hide: 100 }">
      {{ createdBy }}
    </b-tooltip>
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
  data() {
    return {
      id: Math.random(),
    };
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
