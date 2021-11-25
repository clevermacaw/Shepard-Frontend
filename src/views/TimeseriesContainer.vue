<template>
  <div v-if="currentTimeseries" class="timeseries-container">
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
      <h3>{{ currentTimeseries.name }}</h3>
      <p>
        <b>ID:</b> {{ currentTimeseries.id }}<br />
        <b>Database:</b> {{ currentTimeseries.database }}<br />
        <CreatedByLine
          :created-at="currentTimeseries.createdAt"
          :created-by="currentTimeseries.createdBy"
        />
      </p>
    </div>
    <DeleteConfirmationModal
      modal-id="delete-confirmation-modal"
      modal-name="Confirm to delete timeseries container"
      :modal-text="
        'Do you really want do delete the timeseries container with name ' +
        currentTimeseries.name +
        '?'
      "
      @confirmation="handleDelete()"
    />
    <PermissionsModal
      modal-id="permissions-modal"
      modal-name="Edit Permissions"
      :entity-id="currentTimeseriesId"
      :old-permissions="permissions"
      @update="updatePermissions($event)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { TimeseriesContainer, Permissions } from "@dlr-shepard/shepard-client";
import { TimeseriesVue } from "@/utils/api-mixin";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";
import PermissionsModal from "@/components/PermissionsModal.vue";

interface TimeseriesData {
  currentTimeseries?: TimeseriesContainer;
  permissions?: Permissions;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesVue>>
).extend({
  components: { CreatedByLine, DeleteConfirmationModal, PermissionsModal },
  mixins: [TimeseriesVue],
  data() {
    return {
      currentTimeseries: undefined,
      permissions: undefined,
    } as TimeseriesData;
  },
  computed: {
    currentTimeseriesId(): number {
      return Number(this.$router.currentRoute.params.timeseriesId);
    },
  },
  mounted() {
    this.retrieveTimeseries();
    this.retrievePermissions();
  },
  methods: {
    retrieveTimeseries() {
      this.timeseriesApi
        ?.getTimeseriesContainer({
          timeseriesContainerId: this.currentTimeseriesId,
        })
        .then(response => {
          this.currentTimeseries = response;
        })
        .catch(e => {
          console.log(
            "Error while fetching timeseries container: " + e.statusText,
          );
        })
        .finally();
    },
    handleDelete() {
      this.timeseriesApi
        ?.deleteTimeseriesContainer({
          timeseriesContainerId: this.currentTimeseriesId,
        })
        .then(() => {
          this.$router.push({ name: "TimeseriesList" });
        })
        .catch(e => {
          console.log(
            "Error while deleting timeseries container: " + e.statusText,
          );
        })
        .finally();
    },
    retrievePermissions() {
      this.timeseriesApi
        ?.getTimeseriesPermissions({
          timeseriesContainerId: this.currentTimeseriesId,
        })
        .then(response => {
          this.permissions = response;
        })
        .catch(e => {
          console.log("Error while fetching permissons: " + e.statusText);
        })
        .finally();
    },
    updatePermissions(perms: Permissions) {
      this.timeseriesApi
        ?.editTimeseriesPermissions({
          timeseriesContainerId: this.currentTimeseriesId,
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
