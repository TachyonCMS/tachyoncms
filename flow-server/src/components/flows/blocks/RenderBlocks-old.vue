<template>
  <div class="row col-12">
    <!-- Div to wrap all blocks in this nugget -->
    <div class="row col-12 blocks-container">
      <!-- Template to repeat a card section for each block -->
      <template v-for="block in blocks" :key="block.id">
        <div class="row col-12 text-center">
          <div class="row col-12">
            <component
              :is="renderers[block.type]"
              :displayData="block.displayData"
            ></component>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

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
  },
  setup(props, { emit }) {
    // We'll receive a string that can be converted to a JSON object.
    // That object will have an array of block objects.
    // Block object have an id, type and displayData.
    // displayData is stringified data that the renderers and editors handle by type.
    console.log(props);

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
});
</script>
