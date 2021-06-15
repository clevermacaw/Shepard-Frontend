import Vue from "vue";
import { mapGetters } from "vuex";
import {
  Configuration,
  CollectionApi,
  DataObjectApi,
  TimeseriesReferenceApi,
  StructureddataReferenceApi,
  FileReferenceApi,
  UserApi,
  ApikeyApi,
} from "@dlr-shepard/shepard-client";
import getEnv from "@/utils/env";

const ApiVue = Vue.extend({
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

declare interface CollectionData {
  collectionApi?: CollectionApi;
}

const CollectionVue = ApiVue.extend({
  data() {
    return {
      collectionApi: undefined,
    } as CollectionData;
  },
  methods: {
    createApi() {
      this.collectionApi = new CollectionApi(this.config);
    },
  },
});

declare interface DataObjectData {
  dataObjectApi?: DataObjectApi;
}

const DataObjectVue = ApiVue.extend({
  data() {
    return {
      dataObjectApi: undefined,
    } as DataObjectData;
  },
  methods: {
    createApi() {
      this.dataObjectApi = new DataObjectApi(this.config);
    },
  },
});

declare interface TimeseriesReferenceData {
  timeseriesReferenceApi?: TimeseriesReferenceApi;
}

const TimeseriesReferenceVue = ApiVue.extend({
  data() {
    return {
      timeseriesReferenceApi: undefined,
    } as TimeseriesReferenceData;
  },
  methods: {
    createApi() {
      this.timeseriesReferenceApi = new TimeseriesReferenceApi(this.config);
    },
  },
});

declare interface StructuredDataReferenceData {
  structuredDataReferenceApi?: StructureddataReferenceApi;
}

const StructuredDataReferenceVue = ApiVue.extend({
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

declare interface FileReferenceData {
  fileReferenceApi?: FileReferenceApi;
}

const FileReferenceVue = ApiVue.extend({
  data() {
    return {
      fileReferenceApi: undefined,
    } as FileReferenceData;
  },
  methods: {
    createApi() {
      this.fileReferenceApi = new FileReferenceApi(this.config);
    },
  },
});

declare interface UserData {
  userApi?: UserApi;
}

const UserVue = ApiVue.extend({
  data() {
    return {
      userApi: undefined,
    } as UserData;
  },
  methods: {
    createApi() {
      this.userApi = new UserApi(this.config);
    },
  },
});

declare interface ApiKeyData {
  apiKeyApi?: ApikeyApi;
}

const ApiKeyVue = ApiVue.extend({
  data() {
    return {
      apiKeyApi: undefined,
    } as ApiKeyData;
  },
  methods: {
    createApi() {
      this.apiKeyApi = new ApikeyApi(this.config);
    },
  },
});

export {
  CollectionVue,
  DataObjectVue,
  TimeseriesReferenceVue,
  StructuredDataReferenceVue,
  FileReferenceVue,
  UserVue,
  ApiKeyVue,
};
