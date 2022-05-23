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
          ></q-input>
          <q-checkbox
            v-model="openFlow"
            label="Open flow"
            hint="Open the new flow after creating it."
            class="float-right"
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

        <q-btn label="Submit" type="submit" class="action-btn"></q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";

import useFlows from "../../../composables/useFlows";
const { createFlow } = useFlows();

export default defineComponent({
  name: "NewFlowForm",
  components: {},
  props: {
    condensed: {
      default: false,
      type: Boolean,
    },
    openFlowChecked: {
      default: false,
      type: Boolean,
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
    };
  },
  methods: {
    async onSubmit() {
      const { name, title, notes } = this;
      if (!name) return;
      const flow = { name, title, notes };
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
      this.openFlow = this.openFlowChecked;
    },
  },
});
</script>
