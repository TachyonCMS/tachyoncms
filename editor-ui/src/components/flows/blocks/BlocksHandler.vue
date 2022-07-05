<template>
  <div class="row col-12">
    <!-- Div to wrap all blocks in this nugget -->
    <div class="row col-12 blocks-container">
      <!-- Template to repeat a card section for each block -->
      <template v-for="(block, bix) in editorBlocks" :key="block.id">
        <!-- EDITORS -->
        <div v-show="isInEdit(block.id)" class="row col-12">
          <!-- Section to show for this block if it is in edit mode. -->
          <!-- Using v-show the component gets rendered, but hidden. -->
          <!-- Use v-if to render ONLY the block editor for this block type. -->

          <!-- Display the appropriate editor for the nug.type-->
          <div class="nugget-content row col-12">
            <component
              :is="editors[block.type]"
              :data="block.data"
              @save="(event) => saveBlock(block.id, event)"
              @close="closeEditor(block.id)"
              @delete="(event) => deleteBlock(block.id)"
              :dataCySlug="'nugget' + nix + '-block' + bix"
            ></component>
          </div>
        </div>
        <!--/ END EDITORS -->

        <!-- RENDERERS -->
        <div v-show="!isInEdit(block.id)" class="row col-12 text-center">
          <!-- Section to show when rendering this block. -->
          <!-- Using v-show the component gets rendered, but hidden. -->
          <!-- Use v-if to render ONLY the block editor for this block type. -->

          <!-- Display the appropriate renderer for the nug.type-->

          <!-- Display Rich Text / HTML content -->
          <div class="nugget-content row col-12">
            <component
              :is="renderers[block.type]"
              :data="block.data"
              @click="openEditor(block.id)"
            ></component>
            <new-block-button
              btnLabel="Block"
              :nextBlock="block.id"
              @addBlock="onAddBlock"
              class="top-left"
              :data-cy="'new-block-before-btn-n' + nix + '-b' + bix"
              :dataCySlug="'new-block-before-btn-n' + nix + '-b' + bix"
              size="md"
              padding="sm"
            ></new-block-button>
            <q-btn
              class="top-right"
              icon="mdi-delete"
              @click="confirmDeleteBlock(block.id)"
              size="md"
              padding="sm"
              ><q-tooltip>Delete block</q-tooltip></q-btn
            >
          </div>
        </div>
        <!--/ END RENDERERS -->
      </template>
    </div>
    <div class="row col-12 text-align-center" align="left">
      <!-- A button to add a new Block of a given type. -->
      <span class="col-4">
        <new-block-button
          btnLabel="Block"
          @addBlock="onAddBlock"
          class="col"
          :data-cy="'new-block-btn-n' + nix"
          :dataCySlug="'new-block-btn-n' + nix"
        ></new-block-button>
      </span>

      <!-- <q-btn
        class="option col"
        icon="mdi-order-numeric-ascending"
        @click="alert('Insert Nugget Here')"
        >Sequence<q-tooltip
          >Change the sequence of the blocks in this nugget</q-tooltip
        ></q-btn
      >
      -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

// UID generator (not a true UUID but just as unique)
// They will get removed before submitting to
import { nanoid } from "nanoid";

// Used in Nugget container to add a new block
import NewBlockButton from "../buttons/NewBlockButton.vue";

// Editors
import HtmlEditor from "./editors/RichtextEditor";
import HeadingEditor from "./editors/HeadingEditor";
import ImageEditor from "./editors/ImageEditor";
import SeparatorEditor from "./editors/SeparatorEditor";
import JsonEditor from "./editors/JsonEditor";

// Renderers
import HtmlDisplay from "./renders/RichtextBlock";
import Heading from "./renders/HeadingBlock";
import Image from "./renders/ImageBlock";
import BasicSeparator from "./renders/SeparatorBlock";
import Timeline from "./renders/TimelineBlock";

export default defineComponent({
  name: "BlocksHandler",
  props: {
    blocks: {
      type: Array,
    },
    nix: {
      type: Number,
      default: 0,
    },
  },
  emits: ["save"],
  components: {
    NewBlockButton,
    HtmlEditor,
    HeadingEditor,
    ImageEditor,
    JsonEditor,
    HtmlDisplay,
    Heading,
    Image,
    SeparatorEditor,
    BasicSeparator,
    Timeline,
    //    Font
  },
  setup(props, { emit }) {
    // We'll receive a string that can be converted to a JSON object.
    // That object will have an array of block objects.
    // Block object have an id, type and data.
    // data is stringified data that the renderers and editors handle by type.

    const $q = useQuasar();

    // Convert Amplify AWSJSON blockData to editable blocks array.
    //const convertToBlocks = (blockData) => {
    //  if (!blockData) {
    //    return [];
    //  }
    //  const blockArr = JSON.parse(blockData);
    //
    //  return blockArr;
    //};

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
      timeline: "timeline",
    };

    // Map a block type to a editor
    const editors = {
      richText: "html-editor",
      image: "image-editor",
      basicSeparator: "separator-editor",
      h2: "heading-editor",
      h3: "heading-editor",
      h4: "heading-editor",
      h5: "heading-editor",
      h6: "heading-editor",
      timeline: "json-editor",
    };

    // An array of blocks in edit mode
    const inEdit = ref([]);

    const isInEdit = (blockId) => {
      return inEdit.value.includes(blockId) ? true : false;
    };

    console.log(props.blocks);
    let editorBlocks = ref([]);
    if (props.blocks) {
      editorBlocks = [...props.blocks];
    }

    return {
      inEdit,
      isInEdit,
      renderers,
      editors,
      ref,
      editorBlocks,
    };
  },
  methods: {
    confirmDeleteBlock(blockId) {
      this.$q
        .dialog({
          title: "Confirm block deletion",
          message: 'Click "OK" to delete this block, this cannot be undone.',
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.deleteBlock(blockId);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },

    deleteBlock(blockId) {
      console.log(this.editorBlocks);
      const newBlocks = this.editorBlocks.filter(
        (block) => block.id !== blockId
      );
      this.editorBlocks = newBlocks;
      this.$emit("save", newBlocks);
    },

    onAddBlock(def) {
      // Create an ID for the block.

      const { customAlphabet } = require("nanoid");
      const alphabet =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzu";
      const nanoid = customAlphabet(alphabet, 8);
      const uid = nanoid();
      // Define the default data based on the block type
      let dataHolder = null;
      console.log(def);
      switch (def.type) {
        case "image":
        case "separator":
          dataHolder = {};
          break;
        case "h2":
          dataHolder = { level: "2", heading: "" };
          break;
        case "h3":
          dataHolder = { level: "3", heading: "" };
          break;
        case "h4":
          dataHolder = { level: "4", heading: "" };
          break;
        case "h5":
          dataHolder = { level: "5", heading: "" };
          break;
        case "h6":
          dataHolder = { level: "6", heading: "" };
          break;
        case "richText":
        default:
          dataHolder = "";
          break;
      }

      // Add the block to the local nugget
      const block = { id: uid, type: def.type, data: dataHolder };
      if (def.nextBlock && def.nextBlock.length > 0) {
        const nextIx = this.editorBlocks
          .map((object) => object.id)
          .indexOf(def.nextBlock);
        this.editorBlocks.splice(nextIx, 0, block);
      } else {
        console.log("pushing");
        console.log(block);
        this.editorBlocks.push(block);
      }

      // Set this block in edit mode
      this.openEditor(uid);
    },
    openEditor(blockId) {
      // Add to inEdit index if it isn't already there
      if (this.inEdit.indexOf(blockId) === -1) {
        this.inEdit.push(blockId);
      }
    },
    closeEditor(blockId) {
      const ix = this.inEdit.indexOf(blockId);
      this.inEdit.splice(ix, 1);
    },
    async saveBlock(blockId, data) {
      console.log(data);
      // Get the
      const blockIx = this.editorBlocks.findIndex((x) => x.id === blockId);

      // Set the data of the blockIX item to the string after sanitizing
      this.editorBlocks[blockIx].data = data.newData;

      this.$emit("save", this.editorBlocks);
    },
  },
});
</script>
