<template>
  <div>
    <small v-if="updated">updated</small>
    <small v-else>created</small>
    <small v-if="createdAt"> at {{ createdAt.toDateString() }} </small>
    <small v-if="currentUser">
      by {{ currentUser.lastName }}, {{ currentUser.firstName }}
    </small>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { User } from "@dlr-shepard/shepard-client";
import { UserVue } from "@/utils/api-mixin";

interface UserData {
  currentUser?: User;
}

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
  data() {
    return {
      currentUser: undefined,
    } as UserData;
  },
  mounted() {
    this.retrieveUser();
  },
  methods: {
    retrieveUser() {
      this.userApi
        ?.getUser({ username: this.createdBy })
        .then(response => {
          this.currentUser = response;
        })
        .catch(e => {
          console.log("Error while fetching User " + e);
        })
        .finally();
    },
  },
});
</script>
