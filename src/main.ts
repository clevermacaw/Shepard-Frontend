import Vue from "vue";
import "./plugins/materialdesignicons";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import store from "./utils/oidc-store";
import router from "./utils/router";

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
