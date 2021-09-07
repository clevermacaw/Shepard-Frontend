<template>
  <div>
    <h4>Subscriptions List</h4>
    <b-button v-b-modal.create-subscription-modal variant="primary">
      Create
    </b-button>
    <div>
      <b-list-group>
        <b-list-group-item
          v-for="(subscription, index) in subscriptions"
          :key="index"
        >
          {{ subscription.name }} | {{ subscription.callbackURL }} |
          {{ subscription.subscribedURL }} | {{ subscription.requestMethod }}
          <b-button
            v-b-modal.delete-confirmation-modal
            class="float-right"
            size="sm"
            variant="dark"
            @click="currentSubscription = subscription"
          >
            <DeleteIcon />
          </b-button>
        </b-list-group-item>
      </b-list-group>
    </div>
    <b-modal
      id="create-subscription-modal"
      ref="modal"
      title="Create Subscription"
      @show="subscriptionToCreate = { requestMethod: 'GET' }"
      @ok="handleCreate()"
    >
      <div v-if="subscriptionToCreate">
        <b-form-group label="Name">
          <b-form-input
            v-model="subscriptionToCreate.name"
            placeholder="My Subscription"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Callback URL">
          <b-form-input
            v-model="subscriptionToCreate.callbackURL"
            placeholder="http://my-server.example.com/callback-url"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Subscribed URL">
          <b-form-input
            v-model="subscriptionToCreate.subscribedURL"
            placeholder=".*/collections/123"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Request Method">
          <b-form-select
            v-model="subscriptionToCreate.requestMethod"
            :options="requestMethods"
          ></b-form-select>
        </b-form-group>
      </div>
    </b-modal>
    <DeleteConfirmationModal
      v-if="currentSubscription"
      modal-id="delete-confirmation-modal"
      modal-name="Confirm to delete subscription"
      :modal-text="
        'Do you really want do delete the subscription with name ' +
        currentSubscription.name +
        '?'
      "
      @confirmation="handleDelete(currentSubscription.id)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from "vue";
import {
  Subscription,
  SubscriptionRequestMethodEnum,
} from "@dlr-shepard/shepard-client";
import { SubscriptionVue } from "@/utils/api-mixin";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal.vue";

declare interface SubscriptionListData {
  subscriptions: Subscription[];
  currentSubscription?: Subscription;
  subscriptionToCreate?: Subscription;
  requestMethods: string[];
}

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof SubscriptionVue>>
).extend({
  components: { DeleteConfirmationModal },
  mixins: [SubscriptionVue],
  props: {
    currentUsername: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      subscriptions: new Array<Subscription>(),
      currentSubscription: undefined,
      subscriptionToCreate: undefined,
      requestMethods: Object.values(SubscriptionRequestMethodEnum),
    } as SubscriptionListData;
  },
  watch: {
    currentUsername() {
      this.retrieveSubscriptions();
    },
  },
  mounted() {
    this.retrieveSubscriptions();
  },
  methods: {
    retrieveSubscriptions() {
      if (!this.currentUsername) return;
      this.subscriptionApi
        ?.getAllSubscriptions({ username: this.currentUsername })
        .then(response => {
          this.subscriptions = response;
        })
        .catch(e => {
          console.log("Error while fetching subscriptions " + e);
        })
        .finally();
    },
    handleCreate() {
      if (!this.subscriptionToCreate) {
        return;
      }
      this.subscriptionApi
        ?.createSubscription({
          username: this.currentUsername,
          subscription: this.subscriptionToCreate,
        })
        .then(response => {
          this.subscriptions.push(response);
          this.subscriptionToCreate = undefined;
        })
        .catch(e => {
          console.log("Error while creating subscription " + e);
        })
        .finally();
    },
    handleDelete(id: number) {
      this.subscriptionApi
        ?.deleteSubscription({
          username: this.currentUsername,
          subscriptionId: id,
        })
        .catch(e => {
          console.log("Error while deleting subscription " + e);
        })
        .finally(() => {
          this.retrieveSubscriptions();
        });
    },
  },
});
</script>
