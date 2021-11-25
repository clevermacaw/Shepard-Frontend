<template>
  <b-modal
    :id="modalId"
    ref="modal"
    size="lg"
    :title="modalName"
    lazy
    @show="reset()"
    @ok="handleOk()"
  >
    <b-form-group>
      <b-container>
        <b-row class="mb-2">
          <b-col cols="12">
            <b-input-group prepend="Name">
              <b-form-input
                v-model="newTimeseriesReference.name"
                required
                placeholder="Name"
              >
              </b-form-input>
            </b-input-group>
          </b-col>
        </b-row>

        <b-row class="mb-4">
          <b-col cols="12">
            <b-input-group prepend="Container ID">
              <b-form-input
                v-model="currentContainerId"
                required
                :state="validContainer"
                placeholder="Container ID"
                @blur="fetchContainer()"
              >
              </b-form-input>
            </b-input-group>
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="6"> Start </b-col>
          <b-col cols="6"> End </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="6">
            <b-form-datepicker
              v-model="startDate"
              placeholder="Start Date"
              required
            >
            </b-form-datepicker>
          </b-col>
          <b-col cols="6">
            <b-form-datepicker
              v-model="endDate"
              placeholder="End Date"
              required
            >
            </b-form-datepicker>
          </b-col>
        </b-row>

        <b-row class="mb-5">
          <b-col cols="6">
            <b-input-group>
              <b-form-input
                v-model="startTime"
                type="text"
                placeholder="Start time"
                required
              ></b-form-input>
              <b-input-group-append>
                <b-form-timepicker
                  v-model="startTime"
                  locale="de"
                  button-only
                  right
                  show-seconds
                >
                </b-form-timepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col cols="6">
            <b-input-group>
              <b-form-input
                v-model="endTime"
                type="text"
                placeholder="End time"
                required
              ></b-form-input>
              <b-input-group-append>
                <b-form-timepicker
                  v-model="endTime"
                  locale="de"
                  button-only
                  right
                  show-seconds
                >
                </b-form-timepicker>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="12">
            <b-form-input v-model="measurment" placeholder="Measurment">
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="6">
            <b-form-input v-model="device" placeholder="Device"> </b-form-input>
          </b-col>
          <b-col cols="6">
            <b-form-input v-model="location" placeholder="Location">
            </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="6">
            <b-form-input v-model="symbolicName" placeholder="Symbolic Name">
            </b-form-input>
          </b-col>
          <b-col cols="6">
            <b-form-input v-model="field" placeholder="Field"> </b-form-input>
          </b-col>
        </b-row>

        <b-row class="mb-3 text-right">
          <b-col cols="12">
            <b-button class="mr-2" variant="primary" @click="handleClear()">
              Clear
            </b-button>
            <b-button variant="success" @click="handleAdd()"> Add </b-button>
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="12">
            <div>Selected Time Series</div>
            <b-form-select
              v-model="selectedTimeseries"
              :options="timeseries"
              :select-size="5"
              multiple
              required
            >
            </b-form-select>
          </b-col>
        </b-row>

        <b-row class="mb-4 text-right">
          <b-col cols="12">
            <b-button variant="danger" @click="handleDelete()">
              Delete
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-form-group>
  </b-modal>
</template>

<script lang="ts">
import Vue from "vue";
import { VueConstructor } from "vue";
import {
  Timeseries,
  TimeseriesContainer,
  TimeseriesReference,
} from "@dlr-shepard/shepard-client";
import { TimeseriesVue } from "@/utils/api-mixin";

interface Option {
  value: Timeseries;
  text: string;
}

interface TimeseriesRefernceModalData {
  newTimeseriesReference: TimeseriesReference;
  timeseries: Array<Option>;
  selectedTimeseries: Array<Option>;
  measurment: string;
  device: string;
  location: string;
  symbolicName: string;
  field: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  currentContainerId: string;
  currentContainer?: TimeseriesContainer;
  validContainer?: boolean;
}

function initialState(): TimeseriesRefernceModalData {
  return {
    newTimeseriesReference: {
      name: "",
      timeseries: [],
      timeseriesContainerId: 0,
      start: 0,
      end: 0,
    },
    timeseries: [],
    selectedTimeseries: [],
    measurment: "",
    device: "",
    location: "",
    symbolicName: "",
    field: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    currentContainerId: "",
    currentContainer: undefined,
    validContainer: undefined,
  };
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof TimeseriesVue>>
).extend({
  mixins: [TimeseriesVue],
  props: {
    modalId: {
      type: String,
      default: "TimeseriesReferenceModal",
    },
    modalName: {
      type: String,
      default: "TimeseriesReferenceModal",
    },
  },

  data() {
    return initialState();
  },

  methods: {
    reset() {
      Object.assign(this.$data, initialState());
    },
    handleAdd() {
      if (
        !this.measurment ||
        !this.device ||
        !this.location ||
        !this.symbolicName ||
        !this.field
      )
        return;
      const option: Option = {
        value: {
          measurement: this.measurment,
          device: this.device,
          location: this.location,
          symbolicName: this.symbolicName,
          field: this.field,
        },
        text: [
          this.measurment,
          this.device,
          this.location,
          this.symbolicName,
          this.field,
        ].join(" - "),
      };

      if (
        !this.timeseries.some(timeseries => timeseries.text === option.text)
      ) {
        this.timeseries.push(option);
      }
    },
    handleDelete() {
      this.selectedTimeseries.forEach(selected => {
        const index = this.timeseries.findIndex(
          option => JSON.stringify(option.value) == JSON.stringify(selected),
        );
        if (index > -1) {
          this.timeseries.splice(index, 1);
        }
      });
    },
    handleClear() {
      this.measurment = "";
      this.device = "";
      this.location = "";
      this.symbolicName = "";
      this.field = "";
    },
    handleOk() {
      this.timeseries.forEach(option => {
        this.newTimeseriesReference.timeseries.push(option.value);
      });
      const startTimestamp = Date.parse(this.startDate + " " + this.startTime);
      const endTimestamp = Date.parse(this.endDate + " " + this.endTime);
      this.newTimeseriesReference.start = startTimestamp * 1e6;
      this.newTimeseriesReference.end = endTimestamp * 1e6;
      this.$emit("create", this.newTimeseriesReference);
    },
    fetchContainer() {
      this.timeseriesApi
        ?.getTimeseriesContainer({
          timeseriesContainerId: +this.currentContainerId,
        })
        .then(container => {
          this.currentContainer = container;
          this.validContainer = true;
          if (container.id)
            this.newTimeseriesReference.timeseriesContainerId = container.id;
        })
        .catch(e => {
          console.log(
            "Error while getting timeseries container: " + e.statusText,
          );
          this.currentContainer = undefined;
          this.validContainer = false;
        });
    },
  },
});
</script>
