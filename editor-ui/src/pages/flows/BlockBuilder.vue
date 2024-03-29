<template>
  <q-page>
    <div class="fit row wrap justify-around items-start content-start">
      BlockBuilder
    </div>
    <component
      :is="editor"
      :data="data"
      @save="(event) => (saveData = event)"
    ></component>
    <div class="blockbuilder">
      <p>Everything above here is the block editor.</p>

      <p>The emitted data:</p>
      <p>
        {{ saveData }}
      </p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

// Import all supported block render and editor components.
// Register each in the Vue "components" below.
// Define a slug for each in tcmsBlockTypes if it follows TachyonCMS conventions.
// -OR-
// Map the desired slug to an editor and render component in blockHandlers.
//      DO NOT add this custom mapped element to tcmsBlockTypes.
// Editors
import RichtextEditor from "../../components/flows/blocks/editors/RichtextEditor";
import HeadingEditor from "../../components/flows/blocks/editors/HeadingEditor";
import ImageEditor from "../../components/flows/blocks/editors/ImageEditor";
import SeparatorEditor from "../../components/flows/blocks/editors/SeparatorEditor";
import MulticorderEditor from "../../components/flows/blocks/editors/MulticorderEditor";
//import JsonEditor from "../../components/flows/blocks/editors/JsonEditor";

// TachyonCMS compliant block types
const tcmsBlockTypes = [
  "image",
  "richtext",
  "separator",
  "json",
  "heading",
  "multicorder",
];

// Map url block type string to an editor and a renderer
const blockHandlers = {};
// We use a convention for the TachyonCMS created ones.
// You can append custom editor and render mappings for a url segment to the blockHandlers.
tcmsBlockTypes.forEach((type) => {
  blockHandlers[type] = {
    editor: [type] + "-editor",
    render: [type] + "-block",
  };
});

export default defineComponent({
  name: "PageBlockBuilder",
  emits: ["appNotification"],
  components: {
    RichtextEditor,
    HeadingEditor,
    ImageEditor,
    SeparatorEditor,
    MulticorderEditor,
    //    JsonEditor,
  },
  setup() {
    const route = useRoute();
    const blockType = route.params.blockType;

    const saveData = ref({});

    console.log("Editing " + blockType + " block editor");

    const data = ref({});
    if (blockType === "heading") {
      data.value = { level: "2", heading: "" };
    }

    const getEditor = (blockType) => {
      return blockHandlers[blockType].editor;
    };

    const getRender = (blockType) => {
      return blockHandlers[blockType].render;
    };

    const editor = getEditor(blockType);
    const render = getRender(blockType);

    return {
      blockType,
      data,
      editor,
      render,
      saveData,
    };
  },
  methods: {},
});
</script>

<style scoped>
.blockbuilder {
  background-color: aqua;
}
</style>
