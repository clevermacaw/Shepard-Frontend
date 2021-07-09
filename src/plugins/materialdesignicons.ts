import Vue from "vue";

import AccountCircle from "vue-material-design-icons/AccountCircle.vue";
import AccountCircleOutline from "vue-material-design-icons/AccountCircleOutline.vue";
import AccountCog from "vue-material-design-icons/AccountCog.vue";
import AccountCogOutline from "vue-material-design-icons/AccountCogOutline.vue";
import SourceBranch from "vue-material-design-icons/SourceBranch.vue";

import ChartLine from "vue-material-design-icons/ChartLine.vue";
import GraphOutline from "vue-material-design-icons/GraphOutline.vue";
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue";
import Cryengine from "vue-material-design-icons/Cryengine.vue";
import DatabaseOutline from "vue-material-design-icons/DatabaseOutline.vue";

import HomeOutline from "vue-material-design-icons/HomeOutline.vue";
import Webhook from "vue-material-design-icons/Webhook.vue";
import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";

Vue.component("parent-icon", AccountCircle);
Vue.component("child-icon", AccountCircleOutline);
Vue.component("predecessor-icon", AccountCog);
Vue.component("successor-icon", AccountCogOutline);
Vue.component("references-icon", SourceBranch);

Vue.component("timeseries-icon", ChartLine);
Vue.component("structured-data-icon", GraphOutline);
Vue.component("file-icon", FileDocumentOutline);
Vue.component("meta-data-icon", Cryengine);
Vue.component("data-object-icon", DatabaseOutline);

Vue.component("home-icon", HomeOutline);
Vue.component("related-objects-icon", Webhook);
Vue.component("collaps-icon", ChevronUp);
Vue.component("extend-icon", ChevronDown);
