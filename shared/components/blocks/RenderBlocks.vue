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
              :displayData="block.displayData"
              @click="openEditor(block.id)"
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

// Renderers
import HtmlDisplay from "./renders/HtmlDisplay";
import Heading from "./renders/Heading";
import Image from "./renders/Image";
import BasicSeparator from "./renders/Separator";

export default defineComponent({
  name: "RenderBlocks",
  props: {
    blockData: {
      type: String,
    },
  },
  emits: ["save"],
  components: {
    HtmlDisplay,
    Heading,
    Image,
    BasicSeparator,
    //    Font
  },
  setup(props, { emit }) {
    // We'll receive a string that can be converted to a JSON object.
    // That object will have an array of block objects.
    // Block object have an id, type and displayData.
    // displayData is stringified data that the renderers and editors handle by type.

    const $q = useQuasar();

    // Convert Amplify AWSJSON blockData to editable blocks array.
    const convertToBlocks = (blockData) => {
      if (!blockData) {
        return [];
      }
      const blockArr = JSON.parse(blockData);

      return blockArr;
    };

    // Reactive blocks array
    const blocks = ref(convertToBlocks(props.blockData));

    // Map a block type to a renderer
    const renderers = {
      richText: "html-display",
      image: "image",
      basicSeparator: "basic-separator",
      h2: "heading",
      h3: "heading",
      h4: "heading",
      h5: "heading",
      h6: "heading",
    };

    return {
      blocks,
      renderers,
    };
  },
  methods: {},
});
</script>
