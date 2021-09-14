import Vue from "vue";
import Vuex from "vuex";
import { vuexOidcCreateStoreModule } from "vuex-oidc";
import { VuexOidcClientSettings } from "vuex-oidc";
import { nanoid } from "nanoid";
import getEnv from "@/utils/env";
import { Configuration, User, UserApi } from "@dlr-shepard/shepard-client";

Vue.use(Vuex);

// OIDC
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

// User Cache
interface UserCacheData {
  users: { [key: string]: User };
  pending: string[];
}

const userCache = {
  namespaced: true,
  state: {
    users: {},
    pending: [],
  } as UserCacheData,
  mutations: {
    addUserToCache: (state: UserCacheData, user: User) => {
      if (user.username) {
        const tmp: { [key: string]: User } = {};
        tmp[user.username] = user;
        state.users = { ...state.users, ...tmp };
      }
    },
    addUserToPending: (state: UserCacheData, username: string) => {
      if (!state.pending.includes(username)) state.pending.push(username);
    },
    removeUserFromPending: (state: UserCacheData, username: string) => {
      state.pending = state.pending.filter(i => i !== username);
    },
  },
  getters: {
    getAllUsers: (state: UserCacheData) => {
      return state.users;
    },
    getUserFromCache: (state: UserCacheData) => (username: string) => {
      return state.users[username];
    },
    isUserInCache: (state: UserCacheData) => (username: string) => {
      return username in state.users;
    },
    isUserPending: (state: UserCacheData) => (username: string) => {
      return state.pending.includes(username);
    },
  },
  actions: {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    fetchUser: (context: any, username: string) => {
      if (context.getters.isUserPending(username)) return;
      context.commit("addUserToPending", username);
      const conf = new Configuration({
        basePath: getEnv("VUE_APP_BACKEND"),
        accessToken: context.rootState.oidcStore.access_token,
      });
      const userApi = new UserApi(conf);
      userApi
        .getUser({ username })
        .then(response => {
          context.commit("addUserToCache", response);
        })
        .finally(() => {
          context.commit("removeUserFromPending", username);
        });
    },
  },
};

export default new Vuex.Store({
  modules: {
    oidcStore: vuexOidcCreateStoreModule(clientSettings, {
      namespaced: true,
      routeBase: process.env.BASE_URL,
    }),
    userCache: userCache,
  },
});
