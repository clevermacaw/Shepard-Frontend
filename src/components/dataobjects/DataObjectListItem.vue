<template>
  <b-list-group-item
    :to="{
      name: 'DataObject',
      params: {
        collectionId: dataObject.collectionId,
        dataObjectId: dataObject.id,
      },
    }"
    append
  >
    <div class="float-left">
      <div>
        <b>{{ dataObject.name }}</b> ID: {{ dataObject.id }}
      </div>
      <CreatedByLine
        :created-by="dataObject.createdBy"
        :created-at="dataObject.createdAt"
      />
    </div>
    <div class="icon">
      <ReferencesIcon title="References" />
      {{ dataObject.referenceIds.length }}
    </div>
    <div class="icon">
      <SuccessorIcon title="Successors" />
      {{ dataObject.successorIds.length }}
    </div>
    <div class="icon">
      <PredecessorIcon title="Predecessors" />
      {{ dataObject.predecessorIds.length }}
    </div>
    <div class="icon">
      <ChildIcon title="Children" />
      {{ dataObject.childrenIds.length }}
    </div>
    <div class="icon">
      <ParentIcon title="Parents" />
      <a v-if="dataObject.parentId"> 1 </a>
      <a v-else> 0 </a>
    </div>
  </b-list-group-item>
</template>

<script lang="ts">
import Vue from "vue";
import CreatedByLine from "@/components/generic/CreatedByLine.vue";

export default Vue.extend({
  components: { CreatedByLine },
  props: {
    dataObject: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped>
.icon {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  float: right;
}
</style>
