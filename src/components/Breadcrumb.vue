<template>
  <b-breadcrumb v-if="$route.params.collectionId" class="breadcrumb">
    <b-breadcrumb-item to="/explore"> Explore </b-breadcrumb-item>
    <b-breadcrumb-item
      :to="{
        name: 'Collection',
        params: {
          Collection: $route.params.collectionId,
        },
      }"
    >
      Collection
    </b-breadcrumb-item>
    <b-breadcrumb-item
      v-if="$route.params.dataObjectId"
      :to="{
        name: 'DataObject',
        params: {
          Collection: $route.params.collectionId,
          DataObject: $route.params.dataObjectId,
        },
      }"
    >
      DataObject
    </b-breadcrumb-item>
  </b-breadcrumb>
</template>

<style>
.breadcrumb {
  padding-left: 35px;
  background-color: lightgray;
}
a {
  color: #343a40;
}
</style>
