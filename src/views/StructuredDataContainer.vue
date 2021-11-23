<template>
  <div v-if="currentStructuredData" class="structured-data-container">
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
      <h3>{{ currentStructuredData.name }}</h3>
      <p>
        <b>ID:</b> {{ currentStructuredData.id }}<br />
        <b>Oid:</b> {{ currentStructuredData.oid }}<br />
        <CreatedByLine
          :created-at="currentStructuredData.createdAt"
          :created-by="currentStructuredData.createdBy"
        />
      </p>
      <b-list-group>
        <b-list-group-item
          v-for="(structuredData, index) in structuredDataList"
          :key="index"
        >
          {{ structuredData.oid }} | {{ structuredData.name }}
        </b-list-group-item>
      </b-list-group>
    </div>
    <DeleteConfirmationModal
      modal-id="delete-confirmation-modal"
      modal-name="Confirm to delete structured data container"
      :modal-text="
        'Do you really want do delete the structured data container with name ' +
        currentStructuredData.name +
        '?'
      "
      @confirmation="handleDelete()"
    />
    <PermissionsModal
      modal-id="permissions-modal"
      modal-name="Edit Permissions"
      :entity-id="currentStructuredDataId"
      :old-permissions="permissions"
      @update="updatePermissions($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import {
  StructuredData,
  StructuredDataContainer,
  Permissions,
} from "@dlr-shepard/shepard-client";
import { StructuredDataVue } from "@/utils/api-mixin";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";
import PermissionsModal from "@/components/PermissionsModal.vue";

interface StructuredDataData {
  currentStructuredData?: StructuredDataContainer;
  permissions?: Permissions;
  structuredDataList: StructuredData[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof StructuredDataVue>>
).extend({
  components: { CreatedByLine, DeleteConfirmationModal, PermissionsModal },
  mixins: [StructuredDataVue],
  data() {
    return {
      currentStructuredData: undefined,
      permissions: undefined,
      structuredDataList: [],
    } as StructuredDataData;
  },
  computed: {
    currentStructuredDataId(): number {
      return Number(this.$router.currentRoute.params.structuredDataId);
    },
  },
  mounted() {
    this.retrieveStructuredData();
    this.retrieveStructuredDataList();
    this.retrievePermissions();
  },
  methods: {
    retrieveStructuredData() {
      this.structuredDataApi
        ?.getStructuredDataContainer({
          structureddataContainerId: this.currentStructuredDataId,
        })
        .then(response => {
          this.currentStructuredData = response;
        })
        .catch(e => {
          console.log("Error while fetching structuredData container " + e);
        })
        .finally();
    },
    retrieveStructuredDataList() {
      this.structuredDataApi
        ?.getAllStructuredDatas({
          structureddataContainerId: this.currentStructuredDataId,
        })
        .then(response => {
          this.structuredDataList = response;
        })
        .catch(e => {
          console.log("Error while fetching structuredData payload " + e);
        })
        .finally();
    },
    handleDelete() {
      this.structuredDataApi
        ?.deleteStructuredDataContainer({
          structureddataContainerId: this.currentStructuredDataId,
        })
        .then(() => {
          this.$router.push({ name: "StructuredDatasList" });
        })
        .catch(e => {
          console.log("Error while deleting structured data container " + e);
        })
        .finally();
    },
    retrievePermissions() {
      this.structuredDataApi
        ?.getStructuredDataPermissions({
          structureddataContainerId: this.currentStructuredDataId,
        })
        .then(response => {
          this.permissions = response;
        })
        .catch(e => {
          console.log("Error while fetching permissons " + e);
        })
        .finally();
    },
    updatePermissions(perms: Permissions) {
      this.structuredDataApi
        ?.editStructuredDataPermissions({
          structureddataContainerId: this.currentStructuredDataId,
          permissions: perms,
        })
        .then(response => {
          this.permissions = response;
        })
        .catch(e => {
          console.log("Error while edit permissons " + e);
        })
        .finally();
    },
  },
});
</script>
