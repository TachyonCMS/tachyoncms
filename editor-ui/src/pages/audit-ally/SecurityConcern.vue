<template>
  <q-page class="relative-position">
    <q-tabs v-model="tabView" inline-label>
      <q-tab name="auditEvent" icon="mdi-plus" label="Audit Event"></q-tab>
      <q-tab
        name="eventLog"
        icon="mdi-file-multiple"
        label="Event Logs"
      ></q-tab>
    </q-tabs>
    <q-card flat v-if="tabView == 'auditEvent'">
      <q-card-section>
        <q-input label="Title" v-model="title"></q-input>
        <q-input
          type="textarea"
          label="Description"
          v-model="description"
        ></q-input>
      </q-card-section>
      <q-card-actions class="text-center justify-center">
        <template v-if="nuggetId">
          <q-btn icon="mdi-content-save" @click="onUpdateNugget">
            Save Event</q-btn
          >
          <q-btn icon="mdi-close" @click="onCloseNugget"> Close Event </q-btn>
        </template>
        <template v-else>
          <q-btn icon="mdi-content-save" @click="onCreateNugget">
            Create Event</q-btn
          >
        </template>
      </q-card-actions>
      <q-card-section
        class="text-center justify-center ev-header q-ma-md text-h6"
        v-if="nuggetId"
      >
        Evidence of the Event
        <asset-manager :nuggetId="nuggetId"></asset-manager>
      </q-card-section>
    </q-card>

    <template v-if="tabView == 'eventLog'">
      <!-- Reactive list of Nuggets from within the Flow object. -->
      <template v-if="nuggetSeq && nuggetSeq.length > 0">
        <q-list v-for="(nuggetId, nix) in nuggetSeq" :key="nuggetId">
          {{ nuggetId }} {{ nix }}
        </q-list>
      </template>
      <template v-else>
        <!-- Show spinner-->
        <q-spinner-bars
          class="absolute-center"
          color="primary"
          size="2em"
        ></q-spinner-bars>
      </template>
    </template>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  watch,
  computed,
  reactive,
  onMounted,
} from "vue";

import { useQuasar, date } from "quasar";

import { useRoute, useRouter } from "vue-router";

import useFlows from "../../composables/useFlows";
import AssetManager from "./AssetManager";

export default defineComponent({
  name: "PageFlow",
  emits: ["appNotification", "setDrawer"],
  components: {
    AssetManager,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // For automated testing
    const dataCySlug = "nuggets";

    // The current tab, auditEvent or auditLog
    const tabView = ref("auditEvent");

    // The nugget being edited
    const nuggetId = ref(null);
    const title = ref(null);
    const description = ref(null);

    const nuggetAssetStates = reactive(new Map());

    const {
      loadFlow,
      flowMap,
      flowLoaded,
      nuggetMap,
      updateNuggetData,
      deleteNugget,
      createNugget,
      flowSource,
      nuggetSeqMap,
      nuggetBlocksMap,
      loadNuggetAssets,
    } = useFlows();

    console.log(flowSource);

    if (!flowSource.value) {
      router.push("/audit-ally");
    }

    console.log(nuggetMap);

    const flowId = computed(() => {
      return "tcms-" + route.params.securityConcern;
    });

    watch(flowId, async (value) => {
      console.log(value);
      await loadFlow(value);
    });

    // Include Quasar for dialog and loading indicator
    // @todo Move this to a component
    const $q = useQuasar();
    // Configure the loading indicator
    // https://quasar.dev/quasar-plugins/loading
    $q.loading.show({
      delay: 400, // ms
    });
    $q.loading.hide();

    const showLoading = () => {
      $q.loading.show({
        message: "Transporting nuggets...",
      });
    };

    const flow = computed(() => {
      return flowMap.get(flowId.value);
    });

    const saveBlocks = (nuggetId, blocks) => {
      // updateNuggetProp(nuggetId, "blocks", blocks);
      updateNuggetData(nuggetId, "blocks", blocks);
    };

    onMounted(async () => {
      console.log("FLOWID: " + flowId.value);
      loadFlow(flowId.value, true); // second param is `true` to return Nuggets in response
    });

    const nuggetSeq = computed(() => {
      return nuggetSeqMap.get(flowId.value);
    });

    const toggleNuggetAssets = (nuggetId) => {
      if (nuggetAssetStates.get(nuggetId)) {
        nuggetAssetStates.delete(nuggetId);
      } else {
        nuggetAssetStates.set(nuggetId, true);
      }
    };

    return {
      flowId,
      flowSource,
      flowLoaded,
      tabView,
      nuggetId,
      title,
      description,
      createNugget,
      nuggetSeq,
      nuggetAssetStates,
    };
  },
  methods: {
    async confirmDeleteNugget(flowId, nuggetId) {
      this.$q
        .dialog({
          title: "Confirm Nugget Deletion",
          message: "Confirm or cancel deletion of this nugget.",
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.deleteNugget(flowId, nuggetId);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    async onCreateNugget() {
      console.log("Adding Security Event");

      const now = new Date();

      const result = await this.createNugget(
        this.flowId,
        {
          type: "media",
          name: now.toString(),
          title: this.title,
          description: this.description,
        },
        0,
        "before",
        "timeseries"
      );
      console.log(result);

      this.nuggetId = result.nugget.id;
    },
    async onUpdateNugget() {
      console.log("Updating Security Event");

      const now = new Date();

      const result = await this.createNugget(
        this.flowId,
        {
          type: "media",
          name: now.toString(),
          title: this.title,
          description: this.description,
        },
        0,
        "before",
        "timeseries"
      );
      console.log(result);

      this.nuggetId = result.nugget.id;
    },
    async onCloseNugget() {
      console.log("Closing Security Event");

      const now = new Date();

      const result = await this.createNugget(
        this.flowId,
        {
          type: "media",
          name: now.toString(),
          title: this.title,
          description: this.description,
        },
        0,
        "before",
        "timeseries"
      );
      console.log(result);

      this.nuggetId = result.nugget.id;
    },
  },
});
</script>

<style scoped>
.ev-header {
  background-color: lightblue;
}
</style>
