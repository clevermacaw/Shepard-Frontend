<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="lg"
    :title="modalName"
    lazy
    @show="handleShowModal()"
    @ok="handleOk()"
  >
    <b-input-group prepend="Username">
      <b-form-input
        v-model="username"
        :state="validUser"
        @change="fetchUser()"
      ></b-form-input>
      <b-input-group-append>
        <b-dropdown text="Add">
          <b-dropdown-item :disabled="!validUser" @click="setOwner()">
            Owner
          </b-dropdown-item>
          <b-dropdown-item :disabled="!validUser" @click="addReader()">
            Reader
          </b-dropdown-item>
          <b-dropdown-item :disabled="!validUser" @click="addWriter()">
            Writer
          </b-dropdown-item>
          <b-dropdown-item :disabled="!validUser" @click="addManager()">
            Manager
          </b-dropdown-item>
        </b-dropdown>
      </b-input-group-append>
    </b-input-group>
    <small v-if="currentUser">
      <em> {{ currentUser.firstName }} {{ currentUser.lastName }} </em>
    </small>
    <small v-else>Please enter a valid username</small>

    <h5>Owner</h5>
    <b-list-group>
      <b-list-group-item
        v-if="owner"
        class="d-flex justify-content-between align-items-center"
      >
        {{ owner.firstName }} {{ owner.lastName }}
        <b-button variant="light" size="sm" @click="owner = undefined">
          <DeleteIcon />
        </b-button>
      </b-list-group-item>
    </b-list-group>

    <h5>Reader</h5>
    <b-list-group>
      <b-list-group-item
        v-for="(user, index) in reader"
        :key="user.username"
        class="d-flex justify-content-between align-items-center"
      >
        {{ user.firstName }} {{ user.lastName }}
        <b-button variant="light" size="sm" @click="reader.splice(index, 1)">
          <DeleteIcon />
        </b-button>
      </b-list-group-item>
    </b-list-group>

    <h5>Writer</h5>
    <b-list-group>
      <b-list-group-item
        v-for="(user, index) in writer"
        :key="user.username"
        class="d-flex justify-content-between align-items-center"
      >
        {{ user.firstName }} {{ user.lastName }}
        <b-button variant="light" size="sm" @click="writer.splice(index, 1)">
          <DeleteIcon />
        </b-button>
      </b-list-group-item>
    </b-list-group>

    <h5>Manager</h5>
    <b-list-group>
      <b-list-group-item
        v-for="(user, index) in manager"
        :key="user.username"
        class="d-flex justify-content-between align-items-center"
      >
        {{ user.firstName }} {{ user.lastName }}
        <b-button variant="light" size="sm" @click="manager.splice(index, 1)">
          <DeleteIcon />
        </b-button>
      </b-list-group-item>
    </b-list-group>
  </b-modal>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { Permissions, User } from "@dlr-shepard/shepard-client";
import { UserVue } from "@/utils/api-mixin";

interface PermissionsModalData {
  username: string;
  validUser?: boolean;
  currentUser?: User;
  owner?: User;
  reader: User[];
  writer: User[];
  manager: User[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof UserVue>>
).extend({
  mixins: [UserVue],
  props: {
    modalId: {
      type: String,
      default: "PermissionsModal",
    },
    modalName: {
      type: String,
      default: "PermissionsModal",
    },
    entityId: {
      type: Number,
      required: true,
    },
    oldPermissions: {
      type: Object,
      default: () => {
        return { owner: undefined, reader: [], writer: [], manager: [] };
      },
    },
  },
  data() {
    return {
      username: "",
      validUser: undefined,
      currentUser: undefined,
      owner: undefined,
      reader: [],
      writer: [],
      manager: [],
    } as PermissionsModalData;
  },
  methods: {
    handleShowModal() {
      this.parseOldPermissions();
      this.username = "";
      this.currentUser = undefined;
      this.owner = undefined;
      this.reader = [];
      this.writer = [];
      this.manager = [];
      this.validUser = undefined;
    },
    handleOk() {
      const perms: Permissions = {
        owner: this.owner?.username,
        reader: [],
        manager: [],
        writer: [],
      };
      this.reader.forEach(u => {
        if (u.username) perms.reader.push(u.username);
      });
      this.writer.forEach(u => {
        if (u.username) perms.writer.push(u.username);
      });
      this.manager.forEach(u => {
        if (u.username) perms.manager.push(u.username);
      });
      this.$emit("update", perms);
    },
    setOwner() {
      if (this.currentUser) {
        this.owner = this.currentUser;
      }
    },
    addReader() {
      if (this.currentUser && this.currentUser.username) {
        if (
          !this.reader.some(user => user.username == this.currentUser?.username)
        )
          this.reader.push(this.currentUser);
      }
    },
    addWriter() {
      this.addReader();
      if (this.currentUser && this.currentUser.username) {
        if (
          !this.writer.some(user => user.username == this.currentUser?.username)
        )
          this.writer.push(this.currentUser);
      }
    },
    addManager() {
      this.addReader();
      this.addWriter();
      if (this.currentUser && this.currentUser.username) {
        if (
          !this.manager.some(
            user => user.username == this.currentUser?.username,
          )
        )
          this.manager.push(this.currentUser);
      }
    },
    fetchUser() {
      if (!this.username) {
        this.validUser = undefined;
        this.currentUser = undefined;
        return;
      }
      this.userApi
        ?.getUser({ username: this.username })
        .then(currentUser => {
          this.currentUser = currentUser;
          this.validUser = true;
        })
        .catch(e => {
          console.log("Error while getting user " + e);
          this.currentUser = undefined;
          this.validUser = false;
        });
    },
    parseOldPermissions() {
      const perms: Permissions = this.oldPermissions;
      if (!perms) return;
      if (perms.owner) {
        this.userApi
          ?.getUser({ username: perms.owner })
          .then(owner => (this.owner = owner));
      }
      perms.reader.forEach(username => {
        this.userApi
          ?.getUser({ username: username })
          .then(user => this.reader.push(user));
      });
      perms.writer.forEach(username => {
        this.userApi
          ?.getUser({ username: username })
          .then(user => this.writer.push(user));
      });
      perms.manager.forEach(username => {
        this.userApi
          ?.getUser({ username: username })
          .then(user => this.manager.push(user));
      });
    },
  },
});
</script>

<style scoped>
h5 {
  margin-top: 10px;
}

.list-group-item {
  padding: 0rem;
  padding-left: 1rem;
}
</style>
