<template>
    <div class="row col-12">
        <!-- Div to wrap all blocks in this nugget -->
        <div class="row col-12 blocks-container">
            <!-- Template to repeat a card section for each block -->
            <template v-for="block in blocks" :key="block.id">
                <!-- RENDERERS -->
                <div class="row col-12 text-center">
                    <!-- Section to show when rendering this block. -->
                    <!-- Using v-show the component gets rendered, but hidden. -->
                    <!-- Use v-if to render ONLY the block editor for this block type. -->

                    <!-- Display the appropriate renderer for the nug.type-->

                    <!-- Display Rich Text / HTML content -->
                    <div class="row col-12">
                        <component
                            :is="renderers[block.type]"
                            :data="block.data"
                        ></component>
                    </div>
                </div>
                <!--/ END RENDERERS -->
            </template>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

//import useFlowReader from "../composables/useFlowReader.js";

// Renderers
import RichText from "./renders/RichtextBlock";
import Heading from "./renders/HeadingBlock";
import Image from "./renders/ImageBlock";
import BasicSeparator from "./renders/SeparatorBlock";
import Timeline from "./renders/TimelineBlock";
import JsonDisplay from "./renders/JsonBlock";

export default defineComponent({
    name: "RenderBlocks",
    props: {
        blocks: {
            type: Array,
        },
    },
    emits: ["save"],
    components: {
        RichText,
        Heading,
        Image,
        BasicSeparator,
        Timeline,
        JsonDisplay,
    },
    setup(props, { emit }) {
        // We'll receive a string that can be converted to a JSON object.
        // That object will have an array of block objects.
        // Block object have an id, type and data.
        // data is stringified data that the renderers and editors handle by type.

        console.log(props);

        const $q = useQuasar();

        // Reactive blocks array
        //const blocks = ref(convertToBlocks(props.blocks));

        // Map a block type to a renderer
        const renderers = {
            richText: "rich-text",
            image: "image",
            basicSeparator: "basic-separator",
            h2: "heading",
            h3: "heading",
            h4: "heading",
            h5: "heading",
            h6: "heading",
            rawJson: "json-display",
            timeline: "timeline",
        };

        return {
            //blocks,
            renderers,
        };
    },
    methods: {},
});
</script>
