<template>
  <div v-if="currentFile" class="file-container">
    <div class="component">
      <b-button-group class="float-right">
        <b-button
          v-b-modal.permissions-modal
          v-b-tooltip.hover
          title="Edit Permissions"
          variant="light"
        >
          <PermissionsIcon />
        </b-button>
        <b-button
          v-b-modal.delete-confirmation-modal
          v-b-tooltip.hover
          title="Delete"
          variant="dark"
        >
          <DeleteIcon />
        </b-button>
      </b-button-group>
      <h3>{{ currentFile.name }}</h3>
      <p>
        <b>ID:</b> {{ currentFile.id }}<br />
        <b>Oid:</b> {{ currentFile.oid }}<br />
        <CreatedByLine
          :created-at="currentFile.createdAt"
          :created-by="currentFile.createdBy"
          tooltip
        />
      </p>
      <b-list-group>
        <b-list-group-item v-for="(file, index) in fileList" :key="index">
          {{ file.oid }} | {{ file.filename }}
        </b-list-group-item>
      </b-list-group>
    </div>
    <DeleteConfirmationModal
      modal-id="delete-confirmation-modal"
      modal-name="Confirm to delete file container"
      :modal-text="
        'Do you really want do delete the file container with name ' +
        currentFile.name +
        '?'
      "
      @confirmation="handleDelete()"
    />
    <PermissionsModal
      modal-id="permissions-modal"
      modal-name="Edit Permissions"
      :entity-id="currentFileId"
      :old-permissions="permissions"
      @update="updatePermissions($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { FileVue } from "@/utils/api-mixin";
import { FileContainer, Permissions } from "@dlr-shepard/shepard-client";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";
import PermissionsModal from "@/components/PermissionsModal.vue";

interface FileData {
  currentFile?: FileContainer;
  permissions?: Permissions;
  fileList: unknown[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FileVue>>
).extend({
  components: { CreatedByLine, DeleteConfirmationModal, PermissionsModal },
  mixins: [FileVue],
  data() {
    return {
      currentFile: undefined,
      permissions: undefined,
      fileList: [],
    } as FileData;
  },
  computed: {
    currentFileId(): number {
      return Number(this.$router.currentRoute.params.fileId);
    },
  },
  mounted() {
    this.retrieveFile();
    this.retrieveFileList();
    this.retrievePermissions();
  },
  methods: {
    retrieveFile() {
      this.fileApi
        ?.getFileContainer({
          fileContainerId: this.currentFileId,
        })
        .then(response => {
          this.currentFile = response;
        })
        .catch(e => {
          console.log("Error while fetching file container: " + e.statusText);
        })
        .finally();
    },
    retrieveFileList() {
      this.fileApi
        ?.getAllFiles({
          fileContainerId: this.currentFileId,
        })
        .then(response => {
          this.fileList = response;
        })
        .catch(e => {
          console.log("Error while fetching file payload: " + e.statusText);
        })
        .finally();
    },
    handleDelete() {
      this.fileApi
        ?.deleteFileContainer({ fileContainerId: this.currentFileId })
        .then(() => {
          this.$router.push({ name: "FilesList" });
        })
        .catch(e => {
          console.log("Error while deleting file container: " + e.statusText);
        })
        .finally();
    },
    retrievePermissions() {
      this.fileApi
        ?.getFilePermissions({ fileContainerId: this.currentFileId })
        .then(response => {
          this.permissions = response;
        })
        .catch(e => {
          console.log("Error while fetching permissons: " + e.statusText);
        })
        .finally();
    },
    updatePermissions(perms: Permissions) {
      this.fileApi
        ?.editFilePermissions({
          fileContainerId: this.currentFileId,
          permissions: perms,
        })
        .then(response => {
          this.permissions = response;
        })
        .catch(e => {
          console.log("Error while edit permissons: " + e.statusText);
        })
        .finally();
    },
  },
});
</script>
