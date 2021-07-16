import Vue from "vue";

import ClipboardArrowUpOutline from "vue-material-design-icons/ClipboardArrowUpOutline.vue";
import ClipboardArrowDownOutline from "vue-material-design-icons/ClipboardArrowDownOutline.vue";
import ClipboardArrowLeftOutline from "vue-material-design-icons/ClipboardArrowLeftOutline.vue";
import ClipboardArrowRightOutline from "vue-material-design-icons/ClipboardArrowRightOutline.vue";
import DatabaseImportOutline from "vue-material-design-icons/DatabaseImportOutline.vue";

import ChartLine from "vue-material-design-icons/ChartLine.vue";
import GraphOutline from "vue-material-design-icons/GraphOutline.vue";
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue";
import ClipboardOutline from "vue-material-design-icons/ClipboardOutline.vue";

import HomeOutline from "vue-material-design-icons/HomeOutline.vue";
import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";

import Delete from "vue-material-design-icons/Delete.vue";
import Pencil from "vue-material-design-icons/Pencil.vue";
import Plus from "vue-material-design-icons/Plus.vue";
import Minus from "vue-material-design-icons/Minus.vue";

Vue.component("parent-icon", ClipboardArrowUpOutline);
Vue.component("child-icon", ClipboardArrowDownOutline);
Vue.component("predecessor-icon", ClipboardArrowLeftOutline);
Vue.component("successor-icon", ClipboardArrowRightOutline);
Vue.component("references-icon", DatabaseImportOutline);

Vue.component("timeseries-icon", ChartLine);
Vue.component("structured-data-icon", GraphOutline);
Vue.component("file-icon", FileDocumentOutline);
Vue.component("data-object-icon", ClipboardOutline);

Vue.component("home-icon", HomeOutline);
Vue.component("collaps-icon", ChevronUp);
Vue.component("extend-icon", ChevronDown);

Vue.component("delete-icon", Delete);
Vue.component("edit-icon", Pencil);
Vue.component("create-icon", Plus);
Vue.component("remove-icon", Minus);
