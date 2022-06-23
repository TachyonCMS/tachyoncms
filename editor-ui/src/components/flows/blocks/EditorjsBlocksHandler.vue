<template>
  <div class="fit">
    <div class="row col-12 justify-center">
      <q-btn @click="this.onSave()">Save</q-btn>
    </div>
    <div class="fit" :id="divName" />
  </div>
</template>

<script>
import { reactive, onMounted, watch, defineComponent } from "vue";
import EditorJS from "@editorjs/editorjs";
export default defineComponent({
  name: "vue-editor-js",
  emits: ["save"],
  props: {
    blocks: {
      type: Array,
    },
    nix: {
      type: Number,
      default: 0,
    },
    holder: {
      type: String,
      default: () => "vue-editor-js",
      require: true,
    },
    config: {
      type: Object,
      default: () => ({}),
      require: true,
    },
    initialized: {
      type: Function,
      default: () => {},
    },
  },
  setup: (props, context) => {
    const state = reactive({ editor: null });

    const divName = "editor-js-" + props.nix;

    function initEditor(props) {
      destroyEditor();
      const data = {
        time: 1552744582955,
        blocks: props.blocks,
        version: "2.24.3",
      };

      console.log(props.blocks);
      state.editor = new EditorJS({
        holder: divName,
        data: {
          time: 1552744582955,
          blocks: props.blocks,
          version: "2.24.3",
        },
        tools: {},
      });
      props.initialized(state.editor);
    }
    function destroyEditor() {
      if (state.editor) {
        state.editor.destroy();
        state.editor = null;
      }
    }
    onMounted((_) => initEditor(props));
    return { props, state, divName };
  },
  methods: {
    onSave() {
      console.log("SAVING");
      //
      this.state.editor
        .save()
        .then((outputData) => {
          console.log("Article data: ", outputData);
          this.$emit("save", outputData.blocks);
        })
        .catch((error) => {
          console.log("Saving failed: ", error);
        });
    },
  },
});
</script>
