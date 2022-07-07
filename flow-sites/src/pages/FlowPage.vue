<template>
  <q-page>
    <!-- Show a spinner over the div if the flow hasn't finished loading. -->
    <template v-if="flowLoaded">
      <template v-if="flowData.nuggets">
        <q-list v-for="nugget in flowData.nuggets" :key="nugget.id">
          <div class="nugget-container row col-12">
            <render-blocks
              :blocks="nugget.blocks"
              v-if="nugget.type === 'media'"
            >
            </render-blocks>
            <editorjs-reader
              :blocks="nugget.blocks"
              v-if="nugget.type === 'editor'"
            >
            </editorjs-reader>
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

import useFlowReader from "../composables/useFlowReader.js";

import RenderBlocks from "../components/flows/blocks/RenderBlocks";
import EditorjsReader from "../components/flows/blocks/EditorjsReader";

export default defineComponent({
  name: "FlowPage",
  components: {
    RenderBlocks,
    EditorjsReader,
  },
  emit: ["newPageTitle"],
  setup(props, { emit }) {
    const route = useRoute();
    const flowId = computed(() => {
      return route.params.flowId;
    });
    const flowLoaded = ref(false);
    const flowData = ref(null);
    const { loadFlowData, title } = useFlowReader();
    onMounted(async () => {
      flowData.value = await loadFlowData(flowId.value);
      flowLoaded.value = true;
      emit("newPageTitle", flowData.value.title);
    });

    watch(flowId, (newFlowId) => {
      flowLoaded.value = false;
      loadFlowData(newFlowId).then((data) => {
        flowData.value = data;
      });
      flowLoaded.value = true;
    });

    // NOTICE the parameter here is a function
    // Under the hood, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
      };
    });

    return { flowLoaded, flowData, title, flowId };
  },
});
</script>

<style scoped>
.nugget-container {
}
</style>
