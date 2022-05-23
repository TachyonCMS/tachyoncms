<template>
  <!-- Allow HTML content creation using the Quasar QEditor -->
  <q-editor
    class="col-12"
    v-model="editorData"
    :dense="$q.screen.lt.md"
    :toolbar="[
      [
        {
          label: $q.lang.editor.align,
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          options: ['left', 'center', 'right', 'justify'],
        },
      ],
      ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
      ['token', 'hr', 'link'],
      [
        {
          label: $q.lang.editor.formatting,
          icon: $q.iconSet.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h3', 'h4', 'h5', 'h6', 'code'],
        },
        {
          label: $q.lang.editor.fontSize,
          icon: $q.iconSet.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'size-1',
            'size-2',
            'size-3',
            'size-4',
            'size-5',
            'size-6',
            'size-7',
          ],
        },
        {
          label: $q.lang.editor.defaultFont,
          icon: $q.iconSet.editor.font,
          fixedIcon: true,
          list: 'no-icons',
          options: [
            'default_font',
            'arial',
            'arial_black',
            'comic_sans',
            'courier_new',
            'impact',
            'lucida_grande',
            'times_new_roman',
            'verdana',
          ],
        },
        'removeFormat',
      ],
      ['quote', 'unordered', 'ordered'],

      ['undo', 'redo'],
      ['viewsource'],
    ]"
    :fonts="{
      arial: 'Arial',
      arial_black: 'Arial Black',
      comic_sans: 'Comic Sans MS',
      courier_new: 'Courier New',
      impact: 'Impact',
      lucida_grande: 'Lucida Grande',
      times_new_roman: 'Times New Roman',
      verdana: 'Verdana',
    }"
  ></q-editor>

  <!-- Control buttons -->
  <div class="row col-12">
    <q-space></q-space>
    <q-btn
      @click="this.clear()"
      class="subdued-btn"
      icon-right="mdi-sync"
      flat
      size="sm"
      label="Clear"
      :disabled="!dirtyBit"
    ></q-btn>
    <q-btn
      @click="
        this.$emit('save', { newData: editorData });
        this.dirtyBit = false;
      "
      class="option-btn"
      icon="save"
      size="sm"
      :disabled="!dirtyBit"
      label="Save"
    ></q-btn>
    <q-space></q-space>
    <q-btn
      @click="this.$emit('close')"
      class="subdued-btn"
      icon-right="mdi-close"
      flat
      size="sm"
      label="Close"
      :disabled="dirtyBit"
    ></q-btn>
  </div>
</template>

<script>
import { defineComponent, unref, watch, ref, reactive } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "HtmlEditor",
  props: ["displayData"],
  emits: ["save", "close", "delete"],
  setup(props) {
    const $q = useQuasar();

    console.log(props.displayData);

    const rawData = unref(props.displayData);

    console.log(rawData);

    const editorData = ref(rawData);

    const dirtyBit = ref(false);

    const clear = () => {
      console.log("Clearing");
      dirtyBit.value = false;
    };

    watch(editorData, (value) => {
      if (value) {
        console.log(value);
        console.log(editorData);
        console.log(props.displayData);
        dirtyBit.value = true;
      }
    });

    return {
      editorData,
      dirtyBit,
    };
  },
});
</script>
