<template>
  <q-page>
    <!-- Show a spinner over the div if the flow hasn't finished loading. -->
    <template v-if="flowLoaded">
      <template v-if="flowIsPublished">
        <!-- Reactive list of Nuggets from within the Flow object. -->
        <q-list
          v-for="[nuggetId, item] in publishedFlowNuggets"
          :key="nuggetId"
        >
          <div class="nugget-container row col-12">
            <!-- This will receive a stringified JSON array of block objects. -->
            <!-- Block objects have an id, type and displayData -->
            <!-- Display data is stringified data that is rendered differently for each type -->
            <render-blocks :blockData="item.blockData"> </render-blocks>
          </div>
        </q-list>
      </template>
      <template v-else>
        <h4>This Flow is not published.</h4>
      </template>
    </template>
    <template v-else>
      <!-- @todo show spinner -->
    </template>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  toRef,
  reactive,
  onMounted,
  watch,
} from "vue";

import { useQuasar } from "quasar";

import { useRoute } from "vue-router";

import useFlows from "../../composables/useFlows";

import RenderBlocks from "../../components/flows/blocks/RenderBlocks";

export default defineComponent({
  name: "PagePublishedFlow",
  emits: ["appNotification"],
  components: {
    RenderBlocks,
  },
  setup() {
    const route = useRoute();

    const { flowMap, loadFlow, flowLoaded, publishedNuggets, isPublished } =
      useFlows();

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

    const flowId = computed(() => {
      return route.params.flowId;
    });

    const isFlowLoaded = computed(() => {
      return flowLoaded.value;
    });

    const flowIsPublished = ref(false);

    const publishedFlowNuggets = computed(() => {
      return publishedNuggets(flowId.value);
    });

    onMounted(async () => {
      // second param is `true` to return Nuggets in response
      loadFlow(flowId.value, true).then((flow) => {
        console.log(flow);
        flowIsPublished.value = isPublished(flow);

        watch(
          flowMap,
          async (newData, oldData) => {
            flowIsPublished.value = isPublished(flowMap.get(flowId.value));
          },
          { deep: true }
        );
      });
    });

    return {
      flowLoaded,
      publishedNuggets,
      flowId,
      isFlowLoaded,
      flowIsPublished,
      publishedFlowNuggets,
    };
  },
});
</script>

<style scoped>
.nugget-container {
  border: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
  position: relative;
}
</style>
