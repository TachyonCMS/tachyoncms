<template>
  <q-page class="flex flex-center">
    <q-card flat class="text-center">
      <q-card-section>
        <div class="text-h2 q-pa-md">PackTrack</div>
        <div class="text-h3">keeping track of your stuff</div>
      </q-card-section>
      <q-card-actions class="justify-center text-center">
        <q-btn
          size="xl"
          class="cta text-weight-bolder"
          padding="xl"
          @click="onFilesystem()"
          >Select Directory</q-btn
        >
      </q-card-actions>
      <q-card-section class="font-weight-bolder"
        ><div class="text-subtitle2 q-pa-md">
          This software is in BETA, you are free to use it with no warranty or
          guarantee.
        </div>
        <div class="text-caption q-pa-md">
          No data is ever sent to the server. Your browser loads the app files
          from the server, after that the server is no longer involved.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import useFlows from "../../composables/useFlows";

export default defineComponent({
  name: "PackTrackHomePage",

  components: {
    //    LinkButton,
  },

  setup() {
    const { setFlowSource, setFlowConnector, initSource } = useFlows();
    return {
      setFlowSource,
      setFlowConnector,
      initSource,
    };
  },
  methods: {
    async onFilesystem() {
      // Provide a directory picker
      const dirHandle = await window.showDirectoryPicker();
      this.setFlowConnector("filesystem");
      let hasFlowsDir = false;
      let hasNuggetsDir = false;
      for await (const e of dirHandle.entries()) {
        if (e[1].kind === "directory" && e[1].name === "flows") {
          hasFlowsDir = true;
        }
        if (e[1].kind === "directory" && e[1].name === "nuggets") {
          hasNuggetsDir = true;
        }
      }

      if (hasFlowsDir && hasNuggetsDir) {
        this.loadSource(dirHandle).then(() => {
          this.$router.push("/flows");
        });
        console.log("EXISTING FILESYSTEM ROOTDIR");
      } else {
        this.$q
          .dialog({
            title: "Confirm New Root Directory",
            message:
              "Required subdirectories are missing. Click 'OK' to initialize the directory or cancel to choose another directory.",
            cancel: true,
            persistent: true,
          })
          .onOk((data) => {
            console.log("NEW FILESYSTEM ROOTDIR");
            this.loadSource(dirHandle).then(() => {
              this.$router.push("/flows");
            });
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
    },
    async loadSource(dirHandle) {
      await this.setFlowSource(dirHandle);
      this.initSource(dirHandle).then(() => {
        this.$emit("toggleDrawer");
        //this.$router.push("/flows");
      });
    },
  },
});
</script>
