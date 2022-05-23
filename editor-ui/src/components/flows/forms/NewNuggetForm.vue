<template>
  <q-card>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card-section>
        <div class="q-pb-md">
          <q-input
            filled
            v-model="name"
            label="Name *"
            hint="The internal name for the nugget."
            ><q-tooltip>
              This is is only visible to you, even when published.
            </q-tooltip>
          </q-input>
        </div>
        <div class="q-pb-md">
          <q-input
            filled
            v-model="title"
            label="Title"
            hint="The title is used in some blocks."
            ><q-tooltip>
              A title must be provided to publish the nugget.
            </q-tooltip></q-input
          >
        </div>
      </q-card-section>
      <q-card-section v-if="!condensed">
        <div class="q-pb-xsm">
          <q-input
            filled
            type="date"
            v-model="pubAtDate"
            label="Publish Date"
            hint="The date the nugget should be viewable by the public."
          ></q-input>
          <q-input
            filled
            type="time"
            v-model="pubAtTime"
            label="Publish Time"
            hint="The time the nugget should be viewable by the public."
          ></q-input>
        </div>
        <div class="q-pb-xsm">
          <q-input
            filled
            type="date"
            v-model="unPubAtDate"
            label="Expiry Date"
            hint="The date public access to the nugget should be removed."
          ></q-input>
          <q-input
            filled
            type="time"
            v-model="unPubAtTime"
            label="Expiry Time"
            hint="The date and time public access to the nugget should be removed."
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
const { createNugget } = useFlows();

export default defineComponent({
  name: "NewNuggetForm",
  components: {},
  props: {
    condensed: {
      default: false,
      type: Boolean,
    },
    openNuggetChecked: {
      default: false,
      type: Boolean,
    },
    flowId: {
      type: String,
    },
  },
  emits: ["appNotification"],
  setup(props) {
    const name = ref("");
    const title = ref("");
    const pubAtDate = ref("");
    const pubAtTime = ref("");
    const unPubAtDate = ref("");
    const unPubAtTime = ref("");
    return {
      name,
      title,
      pubAtDate,
      pubAtTime,
      unPubAtDate,
      unPubAtTime,
      createNugget,
    };
  },
  methods: {
    async onSubmit() {
      const { name, title } = this;
      if (!name) return;
      const nugget = { name, title };
      this.createNugget(this.flowId, nugget);
      this.$emit("closeForm", true);
      this.onReset();
    },
    async onReset() {
      (this.name = ""),
        (this.title = ""),
        (this.pubAtDate = ""),
        (this.pubAtTime = ""),
        (this.unPubAtDate = ""),
        (this.unPubAtTime = "");
    },
  },
});
</script>
