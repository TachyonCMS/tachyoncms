<template>
    <div class="row fit q-pa-md">
        <div class="col-2"></div>
        <div class="col-8 justify-center relative-position">
            <div class="fit" :id="divName" />
        </div>
    </div>
</template>

<script>
import { reactive, onMounted, watch, defineComponent, ref } from "vue";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import RawTool from "@editorjs/raw";
import SimpleImage from "@editorjs/simple-image";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";

export default defineComponent({
    name: "vue-editor-js",
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

        const dirtyBit = ref(false);

        function initEditor(props) {
            destroyEditor();

            console.log(props.blocks);
            const editor = new EditorJS({
                holder: divName,
                data: {
                    time: 1552744582955,
                    blocks: props.blocks,
                    version: "2.24.3",
                },
                readOnly: true,
                tools: {
                    header: Header,
                    list: List,
                    link: LinkTool,
                    raw: RawTool,
                    checklist: {
                        class: Checklist,
                        inlineToolbar: true,
                    },
                    embed: Embed,
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        shortcut: "CMD+SHIFT+O",
                        config: {
                            quotePlaceholder: "Enter a quote",
                            captionPlaceholder: "Quote's author",
                        },
                    },
                    table: Table,
                    image: SimpleImage,
                    code: CodeTool,
                },
                onReady: () => {
                    console.log("Editor.js is ready to work!");
                    state.editor = editor;
                    props.initialized(state.editor);
                },
            });
        }
        function destroyEditor() {
            if (state.editor) {
                state.editor.destroy();
                state.editor = null;
            }
        }
        onMounted((_) => initEditor(props));
        return { props, state, divName, dirtyBit };
    },
    methods: {},
});
</script>

<style scoped>
.editor {
    background-color: #e8e8e8;
}
</style>
