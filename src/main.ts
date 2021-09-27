import { createApp } from "vue";
import App from "./App.vue";
import store from "./utils/vuex-store";
import router from "./utils/router";

import BootstrapVue3 from "bootstrap-vue-3";

// Optional, since every component import their Bootstrap funcionality
// the following line is not necessary
// import 'bootstrap'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

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
import FolderOpen from "vue-material-design-icons/FolderOpen.vue";
import FileDownloadOutline from "vue-material-design-icons/FileDownloadOutline.vue";

const app = createApp(App);

app.use(store);
app.use(router);

app.use(BootstrapVue3);

app.component("ParentIcon", ClipboardArrowUpOutline);
app.component("ChildIcon", ClipboardArrowDownOutline);
app.component("PredecessorIcon", ClipboardArrowLeftOutline);
app.component("SuccessorIcon", ClipboardArrowRightOutline);
app.component("ReferencesIcon", DatabaseImportOutline);

app.component("TimeseriesIcon", ChartLine);
app.component("StructuredDataIcon", GraphOutline);
app.component("FileIcon", FileDocumentOutline);
app.component("DataObjectIcon", ClipboardOutline);

app.component("HomeIcon", HomeOutline);
app.component("CollapsIcon", ChevronUp);
app.component("ExtendIcon", ChevronDown);

app.component("DeleteIcon", Delete);
app.component("EditIcon", Pencil);
app.component("CreateIcon", Plus);
app.component("RemoveIcon", Minus);
app.component("OpenIcon", FolderOpen);
app.component("DownloadIcon", FileDownloadOutline);

app.mount("#app");
