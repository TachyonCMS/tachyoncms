<template>
  <q-page>
    {{ blockType }}
    <component :is="editor" :displayData="displayData"></component>
    <component :is="render" :displayData="displayData"></component>
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
import JsonEditor from "../../components/flows/blocks/editors/JsonEditor";

// Renderers
import RichtextBlock from "../../components/flows/blocks/renders/RichtextBlock";
import HeadingBlock from "../../components/flows/blocks/renders/HeadingBlock";
import ImageBlock from "../../components/flows/blocks/renders/ImageBlock";
import SeparatorBlock from "../../components/flows/blocks/renders/SeparatorBlock";
import JsonBlock from "../../components/flows/blocks/renders/JsonBlock";

// TachyonCMS compliant block types
const tcmsBlockTypes = ["image", "richtext", "separator", "json"];

// Map url block type string to an editor and a renderer
const blockHandlers = {};
// We use a convention for the TachyonCMS created ones.
// You can append custom editor and render mappings for a url segment to the blockHandlers.
tcmsBlockTypes.map((type) => {
  blockHandlers[type] = {
    editor: [type] + "-editor",
    render: [type] + "-block",
  };
});
// The TachyonCMS H2-H5 headings do NOT follow the convention.
// They all share the same editor and render components

const hTags = ["h2", "h3", "h4", "h5"];

hTags.map((type) => {
  blockHandlers[type] = {
    editor: "heading-editor",
    render: "heading-block",
  };
});

// console.log(blockHandlers);

export default defineComponent({
  name: "PageForge",
  emits: ["appNotification"],
  components: {
    RichtextEditor,
    HeadingEditor,
    ImageEditor,
    SeparatorEditor,
    JsonEditor,
    RichtextBlock,
    HeadingBlock,
    ImageBlock,
    SeparatorBlock,
    JsonBlock,
  },
  setup() {
    const route = useRoute();
    const blockType = route.params.blockType;

    console.log(blockType);

    const displayData = ref({});

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
      displayData,
      editor,
      render,
    };
  },
  methods: {},
});
</script>
