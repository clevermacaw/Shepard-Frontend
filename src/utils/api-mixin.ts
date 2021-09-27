/* eslint vue/one-component-per-file: 0 */ // --> OFF

import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import {
  Configuration,
  CollectionApi,
  DataObjectApi,
  TimeseriesReferenceApi,
  StructureddataReferenceApi,
  FileReferenceApi,
  UriReferenceApi,
  DataObjectReferenceApi,
  CollectionReferenceApi,
  UserApi,
  ApikeyApi,
  ReferenceApi,
  TimeseriesApi,
  StructureddataApi,
  FileApi,
  SubscriptionApi,
} from "@dlr-shepard/shepard-client";
import getEnv from "@/utils/env";

const ApiVue = defineComponent({
  computed: {
    ...mapGetters("oidcStore", ["oidcAccessToken"]),
    config(): Configuration {
      return new Configuration({
        basePath: getEnv("VUE_APP_BACKEND"),
        accessToken: this.oidcAccessToken,
      });
    },
  },
  watch: {
    oidcAccessToken() {
      this.createApi();
    },
  },
  created() {
    this.createApi();
  },
  methods: {
    createApi() {
      // overwrite this method as needed
    },
  },
});

interface CollectionData {
  collectionApi?: CollectionApi;
}

const CollectionVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { collectionApi: undefined } as CollectionData;
  },
  methods: {
    createApi() {
      this.collectionApi = new CollectionApi(this.config);
    },
  },
});

interface DataObjectData {
  dataObjectApi?: DataObjectApi;
}

const DataObjectVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { dataObjectApi: undefined } as DataObjectData;
  },
  methods: {
    createApi() {
      this.dataObjectApi = new DataObjectApi(this.config);
    },
  },
});

interface ReferenceData {
  referenceApi?: ReferenceApi;
}

const ReferenceVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { referenceApi: undefined } as ReferenceData;
  },
  methods: {
    createApi() {
      this.referenceApi = new ReferenceApi(this.config);
    },
  },
});

interface TimeseriesReferenceData {
  timeseriesReferenceApi?: TimeseriesReferenceApi;
}

const TimeseriesReferenceVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { timeseriesReferenceApi: undefined } as TimeseriesReferenceData;
  },
  methods: {
    createApi() {
      this.timeseriesReferenceApi = new TimeseriesReferenceApi(this.config);
    },
  },
});

interface TimeseriesData {
  timeseriesApi?: TimeseriesApi;
}

const TimeseriesVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { timeseriesApi: undefined } as TimeseriesData;
  },
  methods: {
    createApi() {
      this.timeseriesApi = new TimeseriesApi(this.config);
    },
  },
});

interface StructuredDataReferenceData {
  structuredDataReferenceApi?: StructureddataReferenceApi;
}

const StructuredDataReferenceVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return {
      structuredDataReferenceApi: undefined,
    } as StructuredDataReferenceData;
  },
  methods: {
    createApi() {
      this.structuredDataReferenceApi = new StructureddataReferenceApi(
        this.config,
      );
    },
  },
});

interface StructuredDataData {
  structuredDataApi?: StructureddataApi;
}

const StructuredDataVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { structuredDataApi: undefined } as StructuredDataData;
  },
  methods: {
    createApi() {
      this.structuredDataApi = new StructureddataApi(this.config);
    },
  },
});

interface FileReferenceData {
  fileReferenceApi?: FileReferenceApi;
}

const FileReferenceVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { fileReferenceApi: undefined } as FileReferenceData;
  },
  methods: {
    createApi() {
      this.fileReferenceApi = new FileReferenceApi(this.config);
    },
  },
});

interface FileData {
  fileApi?: FileApi;
}

const FileVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { fileApi: undefined } as FileData;
  },
  methods: {
    createApi() {
      this.fileApi = new FileApi(this.config);
    },
  },
});

interface DataObjectReferenceData {
  dataObjectReferenceApi?: DataObjectReferenceApi;
}

const DataObjectReferenceVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { dataObjectReferenceApi: undefined } as DataObjectReferenceData;
  },
  methods: {
    createApi() {
      this.dataObjectReferenceApi = new DataObjectReferenceApi(this.config);
    },
  },
});

interface CollectionReferenceData {
  collectionReferenceApi?: CollectionReferenceApi;
}

const CollectionReferenceVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { collectionReferenceApi: undefined } as CollectionReferenceData;
  },
  methods: {
    createApi() {
      this.collectionReferenceApi = new CollectionReferenceApi(this.config);
    },
  },
});

interface UriReferenceData {
  uriReferenceApi?: UriReferenceApi;
}

const UriReferenceVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { uriReferenceApi: undefined } as UriReferenceData;
  },
  methods: {
    createApi() {
      this.uriReferenceApi = new UriReferenceApi(this.config);
    },
  },
});

interface UserData {
  userApi?: UserApi;
}

const UserVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { userApi: undefined } as UserData;
  },
  methods: {
    createApi() {
      this.userApi = new UserApi(this.config);
    },
  },
});

interface ApiKeyData {
  apiKeyApi?: ApikeyApi;
}

const ApiKeyVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { apiKeyApi: undefined } as ApiKeyData;
  },
  methods: {
    createApi() {
      this.apiKeyApi = new ApikeyApi(this.config);
    },
  },
});

interface SubscriptionData {
  subscriptionApi?: SubscriptionApi;
}

const SubscriptionVue = defineComponent({
  mixins: [ApiVue],
  data() {
    return { subscriptionApi: undefined } as SubscriptionData;
  },
  methods: {
    createApi() {
      this.subscriptionApi = new SubscriptionApi(this.config);
    },
  },
});

export {
  CollectionVue,
  DataObjectVue,
  TimeseriesReferenceVue,
  TimeseriesVue,
  StructuredDataReferenceVue,
  StructuredDataVue,
  FileReferenceVue,
  FileVue,
  DataObjectReferenceVue,
  CollectionReferenceVue,
  UriReferenceVue,
  UserVue,
  ApiKeyVue,
  ReferenceVue,
  SubscriptionVue,
};
