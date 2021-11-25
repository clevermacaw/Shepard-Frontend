<template>
  <div class="list">
    <b-alert
      :show="showCreate"
      dismissible
      variant="success"
      @dismissed="showCreate = false"
    >
      Successfully created
    </b-alert>
    <b-alert
      :show="showDelete"
      dismissible
      variant="danger"
      @dismissed="showDelete = false"
    >
      Successfully deleted
    </b-alert>

    <b-button v-b-modal.create-file-ref-modal class="mb-3" variant="primary">
      Create new Reference
    </b-button>

    <FileReferenceModal
      :current-collection-id="currentCollectionId"
      :current-data-object-id="currentDataObjectId"
      modal-id="create-file-ref-modal"
      modal-name="Create File Reference"
      @create="create($event)"
    />

    <DownloadAlert
      :download-active="downloadActive"
      :download-started="downloadStarted"
      :download-error="downloadError"
    />
    <b-list-group>
      <b-list-group-item
        v-for="(fileReference, index) in fileReferenceList"
        :key="index"
      >
        <div>
          <b>{{ fileReference.name }}</b> | ID: {{ fileReference.id }} |
          <b-button
            v-b-modal.file-reference-delete-confirmation-modal
            v-b-tooltip.hover
            class="float-right"
            title="Delete"
            variant="dark"
            @click="currentFileReference = fileReference"
          >
            <DeleteIcon />
          </b-button>
          <b-link
            :to="{
              name: 'Files',
              params: { fileId: fileReference.fileContainerId },
            }"
          >
            Container: {{ fileReference.fileContainerId }}
          </b-link>
        </div>
        <CreatedByLine
          :created-by="fileReference.createdBy"
          :created-at="fileReference.createdAt"
        />
        <div v-for="(oid, i) in fileReference.fileOids" :key="i">
          <small v-if="files[oid]">
            <b>Oid:</b> {{ oid }} | <b>Filename:</b> {{ files[oid].filename }}
            <a v-if="files[oid].createdAt">
              | <b>Created at:</b>
              {{ new Date(files[oid].createdAt).toLocaleString() }}
            </a>
            <b-link
              class="float-right"
              :disabled="downloadActive"
              @click="
                getFilePayload(fileReference.id, oid, files[oid].filename)
              "
            >
              <DownloadIcon />
            </b-link>
          </small>
        </div>
      </b-list-group-item>
    </b-list-group>

    <DeleteConfirmationModal
      v-if="currentFileReference"
      modal-id="file-reference-delete-confirmation-modal"
      modal-name="Confirm to delete File Reference"
      :modal-text="
        'Do you really want do delete the File Reference with name ' +
        currentFileReference.name +
        '?'
      "
      @confirmation="handleDelete(currentFileReference.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import { FileReference } from "@dlr-shepard/shepard-client";
import { FileReferenceVue } from "@/utils/api-mixin";
import { downloadFile } from "@/utils/download";
import DownloadAlert from "@/components/DownloadAlert.vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";
import FileReferenceModal from "@/components/references/FileReferenceModal.vue";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

interface FileListData {
  fileReferenceList: FileReference[];
  files: { [key: string]: string };
  downloadStarted: boolean;
  downloadActive: boolean;
  downloadError: boolean;
  currentFileReference?: FileReference;
  showCreate: boolean;
  showDelete: boolean;
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof FileReferenceVue>>
).extend({
  components: {
    CreatedByLine,
    DownloadAlert,
    FileReferenceModal,
    DeleteConfirmationModal,
  },
  mixins: [FileReferenceVue],
  props: {
    currentCollectionId: {
      type: Number,
      required: true,
    },
    currentDataObjectId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      fileReferenceList: [],
      files: {},
      downloadStarted: false,
      downloadActive: false,
      downloadError: false,
      currentFileReference: undefined,
      showCreate: false,
      showDelete: false,
    } as FileListData;
  },
  mounted() {
    this.retrieveReferences();
  },
  methods: {
    retrieveReferences() {
      this.fileReferenceApi
        ?.getAllFileReferences({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
        })
        .then(response => {
          this.fileReferenceList = response;
          this.fileReferenceList.forEach(reference => {
            if (reference.id) this.getFiles(reference.id);
          });
        })
        .catch(e => {
          console.log("Error while fetching File References: " + e.statusText);
        })
        .finally();
    },

    getFiles(id: number) {
      this.fileReferenceApi
        ?.getFiles({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          fileReferenceId: id,
        })
        .then(response => {
          const temp: { [key: string]: string } = {};
          response.forEach(payload => {
            if (payload?.oid) {
              temp[payload.oid] = payload;
            }
          });
          this.files = { ...this.files, ...temp };
        })
        .catch(e => {
          console.log("Error while fetching Files: " + e.statusText);
        })
        .finally();
    },

    getFilePayload(fileReferenceId: number, oid: string, filename: string) {
      this.downloadStarted = true;
      this.downloadActive = true;
      this.fileReferenceApi
        ?.getFilePayload({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          fileReferenceId: fileReferenceId,
          oid: oid,
        })
        .then(response => {
          downloadFile(response, filename);
        })
        .catch(e => {
          console.log("Error while fetching File Payload: " + e.statusText);
          this.downloadStarted = false;
          this.downloadError = true;
        })
        .finally(() => (this.downloadActive = false));
    },

    create(newReference: FileReference) {
      this.fileReferenceApi
        ?.createFileReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          fileReference: newReference,
        })
        .then(response => {
          this.fileReferenceList = [response].concat(this.fileReferenceList);
          if (response.id) this.retrieveReferences();
          this.showCreate = true;
        })
        .catch(e => {
          console.log("Error while creating FileReference: " + e.statusText);
        })
        .finally();
    },

    handleDelete(fileReferenceId: number) {
      this.fileReferenceApi
        ?.deleteFileReference({
          collectionId: this.currentCollectionId,
          dataObjectId: this.currentDataObjectId,
          fileReferenceId: fileReferenceId,
        })
        .then(() => {
          this.retrieveReferences();
          this.showDelete = true;
        })
        .catch(e => {
          console.log("Error while deleting File Reference: " + e.statusText);
        })
        .finally();
    },
  },
});
</script>
