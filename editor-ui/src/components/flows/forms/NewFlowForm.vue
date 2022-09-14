<template>
  <q-card>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card-section>
        <div class="q-pb-md">
          <q-input
            filled
            v-model="name"
            label="Private Name *"
            hint="The internal name for the flow."
            :data-cy="dataCySlug + '-new-flow-form-name-fld'"
            ><q-tooltip>
              The name is only visible to you, even when published.
            </q-tooltip>
          </q-input>
        </div>
        <div class="q-pb-md">
          <q-input
            filled
            v-model="title"
            label="Public Title"
            hint="The public title for published flows."
            :data-cy="dataCySlug + '-new-flow-form-title-fld'"
            ><q-tooltip>
              A title must be provided to publish the flow.
            </q-tooltip></q-input
          >
        </div>
        <div class="q-pb-xsm">
          <q-input
            filled
            type="textarea"
            v-model="notes"
            label="Optional Notes"
            hint="Free form data field."
            :data-cy="dataCySlug + '-new-flow-form-notes-fld'"
          ></q-input>
        </div>
        <div class="q-pb-xsm">
          <q-checkbox
            v-model="openFlow"
            label="Open flow"
            hint="Open the new flow after creating it."
            :data-cy="dataCySlug + '-new-flow-form-openFlow-checkbox'"
          ></q-checkbox>
          <q-checkbox
            v-model="encryptFlow"
            label="Encrypt flow"
            hint="Encrypt the flow, passphrase required."
            :data-cy="dataCySlug + '-new-flow-form-encryptFlow-checkbox'"
            v-show="keyExists"
          ></q-checkbox>
        </div>
      </q-card-section>
      <q-card-section v-if="!condensed">
        <div class="q-pb-xsm">
          <q-input
            filled
            type="date"
            v-model="pubAtDate"
            label="Publish Date"
            hint="The date the flow should be viewable by the public."
          ></q-input>
          <q-input
            filled
            type="time"
            v-model="pubAtTime"
            label="Publish Time"
            hint="The time the flow should be viewable by the public."
          ></q-input>
        </div>
        <div class="q-pb-xsm">
          <q-input
            filled
            type="date"
            v-model="unPubAtDate"
            label="Expiry Date"
            hint="The date public access to the flow should be removed."
          ></q-input>
          <q-input
            filled
            type="time"
            v-model="unPubAtTime"
            label="Expiry Time"
            hint="The time public access to the flow should be removed."
          ></q-input>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          label="Reset"
          type="reset"
          flat
          class="q-ml-sm subdued-btn"
        ></q-btn>

        <q-btn
          label="Submit"
          type="submit"
          class="action-btn"
          :data-cy="dataCySlug + '-new-flow-form-submit-btn'"
        ></q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

const WebCrypto = require("easy-web-crypto");

import useFlows from "../../../composables/useFlows";
const { createFlow, keyExists } = useFlows();

export default defineComponent({
  name: "NewFlowForm",
  components: {},
  props: {
    condensed: {
      default: false,
      type: Boolean,
    },
    openFlowChecked: {
      default: true,
      type: Boolean,
    },
    encryptFlowChecked: {
      default: true,
      type: Boolean,
    },
    dataCySlug: {
      default: "tst",
      type: String,
    },
  },
  emits: ["appNotification", "closeForm"],
  setup(props) {
    const { createFlow } = useFlows();

    const name = ref("");
    const title = ref("");
    const notes = ref("");
    const pubAtDate = ref("");
    const pubAtTime = ref("");
    const unPubAtDate = ref("");
    const unPubAtTime = ref("");
    const openFlow = ref(props.openFlowChecked);
    const encryptFlow = ref(props.encryptFlowChecked);
    const passphrase = ref(null);
    const passHash = async () => {
      return await WebCrypto.hash(passphrase.value);
    };

    return {
      name,
      title,
      notes,
      pubAtDate,
      pubAtTime,
      unPubAtDate,
      unPubAtTime,
      openFlow,
      createFlow,
      encryptFlow,
      passphrase,
      passHash,
      keyExists,
    };
  },
  methods: {
    async onSubmit() {
      const { name, title, notes, encryptFlow } = this;
      if (!name) return;
      const flow = { name, title, notes, encrypted: encryptFlow };
      console.log(flow);
      const newFlow = await this.createFlow(flow);
      console.log(newFlow);
      if (this.openFlow && newFlow.id) {
        this.$router.push("/flows/" + newFlow.id + "/nuggets");
      }
      this.$emit("closeForm", true);

      this.onReset();
    },
    async onReset() {
      (this.name = ""),
        (this.title = ""),
        (this.notes = ""),
        (this.pubAtDate = ""),
        (this.pubAtTime = ""),
        (this.unPubAtDate = ""),
        (this.unPubAtTime = "");
      this.encryptFlow = "";
      this.openFlow = this.openFlowChecked;
    },
  },
});
</script>
