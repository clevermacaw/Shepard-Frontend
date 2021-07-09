<template>
  <div>
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
    <hr />
  </div>
</template>

<style>
.breadcrumb {
  font-style: italic;
  margin-top: 30px;
  margin-bottom: 0px;
  padding: 0px;
  background-color: #fff;
}

a {
  color: #343a40;
}

hr {
  margin-top: 4px;
  border-top: 1px solid #343a40;
}
</style>
