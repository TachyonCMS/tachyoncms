<template>
  <q-page>
    <!-- Show a spinner over the div if the flow hasn't finished loading. -->
    <template v-if="flowLoaded">
      <h1>{{ flowData.title }}</h1>
      <template v-if="nuggets.length > 0">
        <!-- Reactive list of Nuggets from within the Flow object. -->
        <q-list v-for="nugget in nuggets" :key="nugget.id">
          <div class="nugget-container row col-12">
            <render-blocks :blockData="nugget.blockData"> </render-blocks>
          </div>
        </q-list>
      </template>
    </template>
    <template v-else>
      <q-inner-loading :showing="true">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </template>
  </q-page>
</template>

<script>
import {
  defineComponent,
  computed,
  ref,
  reactive,
  watch,
  onMounted,
} from "vue";
import { useRoute } from "vue-router";

import { useQuasar, useMeta } from "quasar";

import { tcms } from "boot/axios";

import RenderBlocks from "../components/flows/blocks/RenderBlocks";

export default defineComponent({
  name: "FlowPage",
  components: {
    RenderBlocks,
  },
  setup() {
    const route = useRoute();

    // Is any flow data loaded?
    const flowLoaded = ref(false);

    // The flow data
    const flowData = ref({});

    // Are nuggets being loaded? They may be loaded in batches on-demand.
    const nuggetsLoading = ref(false);

    // A sequenced array of nuggetIds
    const nuggetSeq = ref(null);

    // Reactive array of Nuggets
    const nuggets = ref([]);

    // The current flowId
    const flowId = computed(() => {
      return route.params.flowId;
    });

    const title = ref("fetching greatness...");

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

    // Fetch the JSON files for this flow and nuggets
    const fetchFlowData = (flowId) => {
      console.log("Fetching data for flow: " + flowId);

      // Get the flow.json to get the title
      tcms
        .get("/flows/" + flowId + "/flow.json")
        .then((response) => {
          flowData.value = response.data;
          flowLoaded.value = true;
          title.value = response.data.title;
        })
        .catch((e) => {
          console.log(e);
        });

      // Get the nugget seq so we can start loading nuggets
      tcms
        .get("/flows/" + flowId + "/nuggetSeq.json")
        .then((response) => {
          nuggetSeq.value = response.data.nuggetSeq;
          response.data.nuggetSeq.forEach((nuggetId) => {
            console.log("Fetching data for nugget: " + nuggetId);
            tcms
              .get("/nuggets/" + nuggetId + "/nugget.json")
              .then((response) => {
                console.log(response.data);
                nuggets.value.push(response.data);
              })
              .catch((e) => {
                console.log(e);
              });
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    onMounted(async () => {
      fetchFlowData(flowId.value);
    });

    // NOTICE the parameter here is a function
    // Under the hood, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
      };
    });

    watch(flowId, (flowId) => {
      flowData.value = { id: flowId };
      flowLoaded.value = false;
      nuggetsLoading.value = false;
      nuggetSeq.value = null;
      nuggets.value = [];
      fetchFlowData(flowId);
    });

    return {
      flowId,
      flowLoaded,
      flowData,
      nuggetsLoading,
      nuggets,
    };
  },
});
</script>
