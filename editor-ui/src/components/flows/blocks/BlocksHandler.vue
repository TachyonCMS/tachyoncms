<template>
  <div class="row col-12">
    <!-- Div to wrap all blocks in this nugget -->
    <div class="row col-12 blocks-container">
      <!-- Template to repeat a card section for each block -->
      <template v-for="block in blocks" :key="block.id">
        <!-- EDITORS -->
        <div v-show="isInEdit(block.id)" class="row col-12">
          <!-- Section to show for this block if it is in edit mode. -->
          <!-- Using v-show the component gets rendered, but hidden. -->
          <!-- Use v-if to render ONLY the block editor for this block type. -->

          <!-- Display the appropriate editor for the nug.type-->
          <div class="nugget-content row col-12">
            <component
              :is="editors[block.type]"
              :displayData="block.displayData"
              @save="(event) => saveBlock(block.id, event)"
              @close="closeEditor(block.id)"
              @delete="(event) => deleteBlock(block.id)"
            ></component>

            <!-- Rich Text / HTML editor

          <html-editor
            v-if="block.type === 'rich-text'"
            :data="block.displayData"
            @save="(event) => saveBlock(block.id, event)"
            @close="closeEditor(block.id)"
            @delete="(event) => deleteBlock(block.id)"
          ></html-editor>

          <heading-editor
            v-if="['h2', 'h3', 'h4', 'h5', 'h6'].includes(block.type)"
            :data="block.displayData"
            :level="block.type"
            @save="(event) => saveBlock(block.id, event)"
            @close="closeEditor(block.id)"
            @delete="(event) => deleteBlock(block.id)"
          ></heading-editor>

          <single-image-editor
            v-if="block.type === 'image'"
            :data="block.displayData"
            @save="(event) => saveBlock(block.id, event)"
            @close="closeEditor(block.id)"
            @delete="(event) => deleteBlock(block.id)"
          ></single-image-editor>


          <separator-editor
            v-if="block.type === 'basicSeparator'"
            :data="block.displayData"
            @save="(event) => saveBlock(block.id, event)"
            @delete="(event) => deleteBlock(block.id)"
            @close="closeEditor(block.id)"
          ></separator-editor>
          --></div>
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
              :displayData="block.displayData"
              @click="openEditor(block.id)"
            ></component>
            <new-block-button
              btnLabel="Block"
              :nextBlock="block.id"
              @addBlock="onAddBlock"
              class="top-left"
            ></new-block-button>
            <q-btn
              class="top-right"
              icon="mdi-delete"
              @click="confirmDeleteBlock(block.id)"
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
import HtmlEditor from "./editors/HtmlEditor";
import HeadingEditor from "./editors/HeadingEditor";
import ImageEditor from "./editors/ImageEditor";
import SeparatorEditor from "./editors/SeparatorEditor";

// Renderers
import HtmlDisplay from "./renders/HtmlDisplay";
import Heading from "./renders/Heading";
import Image from "./renders/Image";
import BasicSeparator from "./renders/Separator";

export default defineComponent({
  name: "BlocksHandler",
  props: {
    blockData: {
      type: String,
    },
  },
  emits: ["save"],
  components: {
    NewBlockButton,
    HtmlEditor,
    HeadingEditor,
    ImageEditor,
    HtmlDisplay,
    Heading,
    Image,
    SeparatorEditor,
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
    };

    // An array of blocks in edit mode
    const inEdit = ref([]);

    const isInEdit = (blockId) => {
      return inEdit.value.includes(blockId) ? true : false;
    };

    const deleteBlock = (blockId) => {
      const newBlocks = blocks.value.filter((block) => block.id !== blockId);
      blocks.value = newBlocks;
      emit("save", JSON.stringify(newBlocks));
    };

    const confirmDeleteBlock = async (blockId) => {
      $q.dialog({
        title: "Confirm block deletion",
        message: 'Click "OK" to delete this block, this cannot be undone.',
        cancel: true,
        persistent: true,
      })
        .onOk((data) => {
          deleteBlock(blockId);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    };

    return {
      blocks,
      inEdit,
      isInEdit,
      deleteBlock,
      renderers,
      editors,
      ref,
      confirmDeleteBlock,
    };
  },
  methods: {
    onAddBlock(def) {
      // Create an ID for the block.
      const uid = nanoid(8);
      // Define the default data based on the block type
      let dataHolder = null;
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
      }

      // Add the block to the local nugget
      const block = { id: uid, type: def.type, displayData: dataHolder };
      if (def.nextBlock && def.nextBlock.length > 0) {
        console.log("Need to splice into blocks");
        console.log(this.blocks);
        const nextIx = this.blocks
          .map((object) => object.id)
          .indexOf(def.nextBlock);
        console.log(nextIx);
        this.blocks.splice(nextIx, 0, block);
      } else {
        this.blocks.push(block);
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
      const blockIx = this.blocks.findIndex((x) => x.id === blockId);
      console.log(blockIx);
      // Set the displayData of the blockIX item to the string after sanitizing
      this.blocks[blockIx].displayData = data.newData;

      this.$emit("save", JSON.stringify(this.blocks));
    },
  },
});
</script>
