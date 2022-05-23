<template>
  <q-page>
    <!-- Show a spinner over the div if the flow hasn't finished loading. -->
    <template v-if="flowLoaded">
      <!-- Reactive list of Nuggets from within the Flow object. -->
      <q-list v-for="nuggetId in flow.nuggetSeq" :key="nuggetId">
        <div class="nugget-container row col-12">
          <render-blocks :blockData="nuggetMap.get(nuggetId).blockData">
          </render-blocks>
        </div>
      </q-list>
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
} from "vue";

import { useQuasar } from "quasar";

import { useRoute } from "vue-router";

import useFlows from "../../composables/useFlows";

import NewNuggetForm from "../../components/flows/forms/NewNuggetForm";
import DateDisplay from "../../components/site/widgets/DateDisplay";
import RenderBlocks from "../../components/flows/blocks/RenderBlocks";

export default defineComponent({
  name: "PagePreviewFlow",
  emits: ["appNotification"],
  components: {
    //NewNuggetForm,
    //DateDisplay,
    RenderBlocks,
  },
  setup() {
    const route = useRoute();

    const { flowMap, loadFlow, flowLoaded, nuggetMap, setRead } = useFlows();

    console.log(nuggetMap);
    console.log(flowMap);

    const flowId = computed(() => {
      return route.params.flowId;
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
      updateNuggetProp(flowId.value, nuggetId, "blockData", blocks);
    };

    onMounted(async () => {
      loadFlow(flowId.value, true); // second param is `true` to return Nuggets in response
    });

    return {
      flowLoaded,
      flow,
      nuggetMap,
      flowId,
    };
  },
});
</script>
