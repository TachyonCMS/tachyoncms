<template>
  <q-page>
    <!-- Show a spinner over the div if the flow hasn't finished loading. -->
    <template v-if="flowLoaded">
      <template v-if="flowData && flowData.nuggets">
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
import { defineComponent, computed, ref, reactive, onMounted } from "vue";

import useFlowReader from "../composables/useFlowReader.js";

import RenderBlocks from "../components/flows/blocks/RenderBlocks";
import EditorjsReader from "../components/flows/blocks/EditorjsReader";

// Main export

export default defineComponent({
  name: "FlowSitesIndexPage",
  components: {
    RenderBlocks,
    EditorjsReader,
  },
  emits: ["newPageTitle"],
  setup(props, { emit }) {
    const hostName = computed(() => {
      return window.location.hostname;
    });

    const { loadFlowData, title, getHostSiteFlow } = useFlowReader();

    const flowData = ref(null);

    const flowLoaded = ref(false);

    onMounted(async () => {
      const siteFlowId = getHostSiteFlow(hostName.value);

      flowData.value = await loadFlowData(siteFlowId);
      flowLoaded.value = true;
      emit("newPageTitle", flowData.value.title);
    });

    return {
      hostName,
      flowLoaded,
      flowData,
      title,
    };
  },
});
</script>
