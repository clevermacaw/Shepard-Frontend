<template>
  <div>
    <!-- Sometimes mounted() is not executed in combination with pagination -->
    {{ retrieveUser() }}
    <small v-if="updated">updated</small>
    <small v-else>created</small>
    <small v-if="createdAt"> at {{ createdAt.toDateString() }} </small>
    <small v-if="getAllUsers[createdBy]">
      by {{ getAllUsers[createdBy].lastName }},
      {{ getAllUsers[createdBy].firstName }}
    </small>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { UserVue } from "@/utils/api-mixin";

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof UserVue>>
).extend({
  mixins: [UserVue],
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
  mounted() {
    // This is not always executed in combination with pagination, for the bugfix see template
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
