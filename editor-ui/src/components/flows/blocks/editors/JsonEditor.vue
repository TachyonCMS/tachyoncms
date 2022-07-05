<template>
  <div class="fullwidth row col-12 relative-position">
    <div class="fullwidth row col-12 jsoneditor" ref="container"></div>
    <q-btn
      icon="mdi-content-save"
      @click="onSave()"
      class="top-right tr"
      padding="sm"
      ><q-tooltip>Save JSON</q-tooltip></q-btn
    >
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";

import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

export default defineComponent({
  name: "JsonEditor",
  props: ["data", "dataCySlug"],
  components: {},
  setup(props) {
    const container = ref(null);
    const options = { mode: "code" };

    const editor = ref(null);

    onMounted(() => {
      console.log(container);
      editor.value = new JSONEditor(container.value, options);
      editor.value.set(props.data);
    });

    return {
      container,
      props,
      editor,
    };
  },
  methods: {
    async onSave() {
      const currData = this.editor.get();
      console.log(currData);
      this.$emit("save", { newData: currData });
    },
  },
});
</script>

<style scoped>
.jsoneditor {
  width: 500px;
  height: 500px;
  display: flex;
  flex: 1;
}

.tr {
  opacity: 85%;
}
</style>
