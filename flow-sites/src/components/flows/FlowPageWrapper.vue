<template></template>

<script>
// Core Vue 3
import { defineComponent } from "vue";

// For loading spinner and notifications
import { useQuasar } from "quasar";

// This will render a Flow's Blocks.
import RenderBlocks from "../components/flows/blocks/RenderBlocks";

// This provides logic for loading Flow data from the current site.
import useFlowReader from "../../composables/useFlowReader";

// Our component
export default defineComponent({
    name: "FlowPageWrapper",
    components: {
        RenderBlocks,
    },
    setup() {
        const {
            flowLoaded,
            flowData,
            nuggetsLoading,
            nuggetSeq,
            nuggets,
            nuggetBlocksMap,
        } = useFlowReader();

        return {
            flowLoaded,
            flowData,
            nuggetsLoading,
            nuggetSeq,
            nuggets,
            nuggetBlocksMap,
        };
    },
});
</script>

<style></style>
