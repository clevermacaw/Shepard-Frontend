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
    class="list-group-item list-group-item-action"
  >
    <div class="float-left">
      <div>
        <b>{{ dataObject.name }}</b> ID: {{ dataObject.id }}
      </div>
      <small>
        created at {{ dataObject.createdAt.toDateString() }} by
        {{ dataObject.createdBy }}
      </small>
    </div>
    <div class="icon">
      <references-icon title="References" />
      {{ dataObject.referenceIds.length }}
    </div>
    <div class="icon">
      <successor-icon title="Successors" />
      {{ dataObject.successorIds.length }}
    </div>
    <div class="icon">
      <predecessor-icon title="Predecessors" />
      {{ dataObject.predecessorIds.length }}
    </div>
    <div class="icon">
      <child-icon title="Children" />
      {{ dataObject.childrenIds.length }}
    </div>
    <div class="icon">
      <parent-icon title="Parents" />
      <a v-if="dataObject.parentId"> 1 </a>
      <a v-else> 0 </a>
    </div>
  </b-list-group-item>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
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
