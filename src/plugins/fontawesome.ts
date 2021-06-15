import Vue from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faAngleDown, faAngleUp);

Vue.component("FontAwesomeIcon", FontAwesomeIcon);
