<template>
  <div class="user">
    <div class="component">
      <h4>User Management</h4>
      <table v-if="user" class="table">
        <tbody>
          <tr>
            <th scope="row">Username</th>
            <td>{{ user.username }}</td>
          </tr>
          <tr>
            <th scope="row">First Name</th>
            <td>{{ user.firstName }}</td>
          </tr>
          <tr>
            <th scope="row">Last Name</th>
            <td>{{ user.lastName }}</td>
          </tr>
          <tr>
            <th scope="row">E-Mail</th>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <th scope="row">Bearer Token</th>
            <td>
              <b-button size="sm" variant="primary" @click="copyBearerToken()">
                Copy Token
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="user" class="component">
      <ApiKeyList :current-username="user.username" />
    </div>
    <div v-if="user" class="component">
      <SubscriptionList :current-username="user.username" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { User } from "@dlr-shepard/shepard-client";
import ApiKeyList from "@/components/user/ApiKeysList.vue";
import SubscriptionList from "@/components/user/SubscriptionList.vue";
import { UserVue } from "@/utils/api-mixin";

interface UserData {
  userId?: number;
  user?: User;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof UserVue>>
).extend({
  components: {
    ApiKeyList,
    SubscriptionList,
  },
  mixins: [UserVue],
  data() {
    return {
      userId: undefined,
      user: undefined,
    } as UserData;
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      this.userApi
        ?.getCurrentUser()
        .then(response => {
          this.user = response;
        })
        .catch(e => {
          console.log("Error while fetching user " + e);
        });
    },
    userTableItems() {
      if (!this.user) {
        return [];
      }
      return [
        { "First Name": this.user.firstName },
        { "Last Name": this.user.lastName },
      ];
    },
    copyBearerToken() {
      if (this.config.accessToken)
        navigator.clipboard.writeText(this.config.accessToken(""));
    },
  },
});
</script>

<style scoped>
.list {
  max-width: 1280px;
  margin: auto;
}
</style>
