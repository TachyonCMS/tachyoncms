<template>
  <q-page>
    <div v-if="!flowSource">
      <q-card flat class="text-center">
        <q-card-section class="font-weight-bolder">
          <p class="text-h5 q-pa-md">
            Choose a directory for your evidence and results
          </p>
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
        <q-card-section class="font-weight-bolder">
          <p class="text-bolder q-pa-md warn">
            Note: This only works with
            <a href="https://caniuse.com/native-filesystem-api"
              >recent version of the Chrome desktop browser</a
            >.
          </p>
          <div class="text-subtitle2 q-pa-md">
            This software is in BETA, you are free to use it with no warranty or
            guarantee.
          </div>
          <div class="text-caption q-pa-md">
            No data is ever sent to the server. Your browser loads the app files
            from the server, after that the server is no longer involved.
          </div>
        </q-card-section>
        <q-card-section class="text-center justify-center">
          <a href="https://github.com/TachyonCMS/tachyoncms"
            >This software is freely distributed.</a
          >
        </q-card-section>
      </q-card>
    </div>
    <div v-else>
      <q-page class="q-pa-xl">
        <div class="text-h2 q-pa-md">It's Easy..</div>
        <div class="text-h4 q-pa-md">1. Select a Security Concern</div>
        <div class="text-h4 q-pa-md">2. Create an Audit Event</div>
        <div class="text-h4 q-pa-md">3. Add Evidence</div>
        <div class="text-h4 q-pa-md">4. Sleep Easy</div>
        </q-page>

    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";

//import NoFlowSourceSetPage from "../pages/flows/NoFlowSourceSetPage";

import useFlows from "../../../composables/useFlows";

export default defineComponent({
  name: "PageIndex",
  components: {
    // NoFlowSourceSetPage,
  },
  emits: ["toggleDrawer", "setDrawer"],

  setup() {
    const {
      setFlowSource,
      setFlowConnector,
      initSource,
      ensureFlowsExist,
      flowSource,
    } = useFlows();

    const reqFlows = [
      "Enterprise Assets",
      "Software Assets",
      "Data Protection",
      "Secure Configuration",
      "Account Management",
      "Access Control",
      "Vulnerability Management",
      "Audit Logging",
      "Email and Web Browser",
      "Malware Protections",
      "Data Recovery",
      "Infrastructure Management",
      "Network Monitoring ",
      "Security Training",
      "Service Providers",
      "Software Security",
      "Incident Response Management",
      "Penetration Testing",
    ];

    //const reqFlows = ["Enterprise Assets"];

    const view = ref("entry");

    return {
      setFlowSource,
      setFlowConnector,
      initSource,
      ensureFlowsExist,
      reqFlows,
      view,
      flowSource,
    };
  },
  methods: {
    async onFilesystem() {
      // Provide a directory picker
      const dirHandle = await window.showDirectoryPicker();
      this.setFlowConnector("filesystem");

      this.loadSource(dirHandle).then(() => {
        // this.$router.push("/flows");
      });
      console.log("EXISTING FILESYSTEM ROOTDIR");
      console.log(dirHandle);
    },
    async loadSource(dirHandle) {
      this.setFlowSource(dirHandle);
      await this.initSource(dirHandle);
      await this.ensureFlowsExist(this.reqFlows);
      this.$emit("setDrawer", true);
    },
  },
});
</script>

<style scoped>
.foot a {
  color: white;
  text-decoration: none; /* no underline */
}

.foot a:visited {
  color: white;
}

.warn {
  color: red;
}
.warn a {
  color: red;
  text-decoration: none; /* no underline */
}

.warn a:visited {
  color: red;
}
</style>