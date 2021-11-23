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
import FolderOpen from "vue-material-design-icons/FolderOpen.vue";
import AccountLock from "vue-material-design-icons/AccountLock.vue";
import FileDownloadOutline from "vue-material-design-icons/FileDownloadOutline.vue";

Vue.component("ParentIcon", ClipboardArrowUpOutline);
Vue.component("ChildIcon", ClipboardArrowDownOutline);
Vue.component("PredecessorIcon", ClipboardArrowLeftOutline);
Vue.component("SuccessorIcon", ClipboardArrowRightOutline);
Vue.component("ReferencesIcon", DatabaseImportOutline);

Vue.component("TimeseriesIcon", ChartLine);
Vue.component("StructuredDataIcon", GraphOutline);
Vue.component("FileIcon", FileDocumentOutline);
Vue.component("DataObjectIcon", ClipboardOutline);

Vue.component("HomeIcon", HomeOutline);
Vue.component("CollapsIcon", ChevronUp);
Vue.component("ExtendIcon", ChevronDown);

Vue.component("DeleteIcon", Delete);
Vue.component("EditIcon", Pencil);
Vue.component("CreateIcon", Plus);
Vue.component("RemoveIcon", Minus);
Vue.component("OpenIcon", FolderOpen);
Vue.component("PermissionsIcon", AccountLock);
Vue.component("DownloadIcon", FileDownloadOutline);
