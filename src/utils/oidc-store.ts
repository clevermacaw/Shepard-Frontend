import Vue from "vue";
import Vuex from "vuex";
import { vuexOidcCreateStoreModule } from "vuex-oidc";
import { VuexOidcClientSettings } from "vuex-oidc";
import { nanoid } from "nanoid";
import getEnv from "@/utils/env";

Vue.use(Vuex);

const loco = window.location;
const appRootUrl = `${loco.protocol}//${loco.host}${process.env.BASE_URL}`;
console.log(appRootUrl);

const clientSettings = {
  authority: getEnv("VUE_APP_OIDC_AUTHORITY"),
  clientId: getEnv("VUE_APP_CLIENT_ID"),
  redirectUri: appRootUrl + "oidc-callback",
  responseType: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  checkSessionInterval: 3000,
  accessTokenExpiringNotificationTime: 10,
  extraQueryParams: { nonce: nanoid() },
} as VuexOidcClientSettings;

export default new Vuex.Store({
  modules: {
    oidcStore: vuexOidcCreateStoreModule(clientSettings, {
      namespaced: true,
      routeBase: process.env.BASE_URL,
    }),
  },
});
