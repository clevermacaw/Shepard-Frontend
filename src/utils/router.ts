import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { vuexOidcCreateRouterMiddleware } from "vuex-oidc";
import store from "@/utils/vuex-store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: { name: "Explore" },
  },
  {
    path: "/explore",
    name: "Explore",
    component: () => import("../views/ExploreView.vue"),
  },
  {
    path: "/explore/:collectionId",
    name: "Collection",
    component: () => import("../views/CollectionView.vue"),
  },
  {
    path: "/explore/:collectionId/:dataObjectId",
    name: "DataObject",
    component: () => import("../views/DataObjectView.vue"),
  },
  {
    path: "/files",
    name: "FilesList",
    component: () => import("../views/FileContainerList.vue"),
  },
  {
    path: "/files/:fileId",
    name: "Files",
    component: () => import("../views/FileContainer.vue"),
  },
  {
    path: "/structureddata",
    name: "StructuredDatasList",
    component: () => import("../views/StructuredDataContainerList.vue"),
  },
  {
    path: "/structureddata/:structuredDataId",
    name: "StructuredData",
    component: () => import("../views/StructuredDataContainer.vue"),
  },
  {
    path: "/timeseries",
    name: "TimeseriesList",
    component: () => import("../views/TimeseriesContainerList.vue"),
  },
  {
    path: "/timeseries/:timeseriesId",
    name: "Timeseries",
    component: () => import("../views/TimeseriesContainer.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import("../views/User.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/about-user",
    name: "AboutUser",
    component: () => import("../views/AboutUser.vue"),
  },
  {
    path: "/oidc-callback", // Needs to match redirectUri in you oidcSettings
    name: "oidcCallback",
    component: () => import("../views/OidcCallback.vue"),
  },
  {
    path: "/oidc-popup-callback", // Needs to match popupRedirectUri in you oidcSettings
    name: "oidcPopupCallback",
    component: () => import("../views/OidcPopupCallback.vue"),
  },
  {
    path: "/oidc-callback-error", // Needs to match redirect_uri in you oidcSettings
    name: "oidcCallbackError",
    component: () => import("../views/OidcCallbackError.vue"),
    meta: {
      isPublic: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach(vuexOidcCreateRouterMiddleware(store, "oidcStore"));

export default router;
