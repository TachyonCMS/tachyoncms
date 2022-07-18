<template>
  <div class="row col-6">
    <q-space></q-space>

      <select-btn
        :size="size"
        :class="styleClass"
        :padding="padding"
        label="Create New"
        @dirHandle="(dirHandle) => this.initHandle(dirHandle)"
      ></select-btn>

    <q-space></q-space>

      <select-btn
        :size="size"
        :class="styleClass"
        :padding="padding"
        label="Open Existing"
        @dirHandle="(dirHandle) => this.openHandle(dirHandle)"
      ></select-btn>
      <q-space></q-space>

  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

import useFlows from "../composables/useFlows";

import SelectBtn from "./SelectBtn.vue";

const initFuncs = {
  flows: ["flows", "nugget", "tags"]
};

export default defineComponent({
  emits: ['dirReady'],
  props: {
    size: {
      type: String,
      default: "xl"
    },
    styleClass: {
      type: String,
      default: "cta text-weight-bolder"
    },
    padding: {
      type: String,
      default: "xl"
    },
    label: {
      type: String,
      default: "Select Directory"
    },
    initType: {
      type: String,
      default: "flows" // flows|audit-ally|secret-stash
    },
    encrypt: {
      type: String,
      default: "no" // yes|no|opt
    }
  },

  emits: ["dirHandleObj"],

  components: {
    SelectBtn
  },

  setup() {
    const sourceDirHandle = ref(null);

    const { setFlowSource, setFlowConnector, initSource, dirHasFile } =
      useFlows();

    return {
      setFlowSource,
      setFlowConnector,
      initSource,
      dirHasFile
    };
  },

  methods: {
    async initHandle(dirHandle) {
      switch (this.initType) {
        case "flows":
          this.setFlowConnector("filesystem");
          let isEmpty = true;
          for await (const e of dirHandle.entries()) {
            // Entry found, not an empty directory
            isEmpty = false;
          }

          if (isEmpty) {
            this.setFlowSource(dirHandle);
            this.initSource(dirHandle);
            this.$emit('dirReady');
          } else {
            this.$q
              .dialog({
                title: "Existing Files Found!",
                message:
                  "Files were found in the directory, you must start in a empty directory.",
                cancel: false,
                persistent: true
              })
              .onOk((data) => {

              })
          }
      }
    },
    async openHandle(dirHandle) {
      switch (this.initType) {
        case "flows":
          this.setFlowConnector("filesystem");
          const result = await this.dirHasFile(dirHandle, "tachyon-cms.json");
          console.log(result)
          if (result) {
            await this.setFlowSource(dirHandle);
            this.$emit('dirReady');
          } else {
            this.$q
              .dialog({
                title: "Configuration Missing",
                message:
                  "A configuration file was not found, please choose a directory with existing data.",
                cancel: false,
                persistent: true
              })
              .onOk((data) => {

              })
              .onCancel(() => {
                // console.log('>>>> Cancel')
                this.setFlowConnector(null);
                this.setFlowSource(null);
              })
              .onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
              });
          }
          break;
      }
    },
  }
});
</script>

<style scoped></style>
