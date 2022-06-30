<template>
  <!-- A button to add a new Nugget of a given type. -->
  <q-btn
    style="background-color: white"
    icon="mdi-puzzle-plus"
    :label="btnLabel"
    class="option-btn"
    ><q-menu>
      <q-list>
        <!-- Add an Editor.js nugget -->
        <q-item
          v-close-popup
          clickable
          @click="addNugget('editorJs')"
          :data-cy="dataCySlug + '-editorNugget'"
        >
          <q-item-section>Editor</q-item-section>
        </q-item>

        <q-separator></q-separator>
        <!-- TachyonCMS Vue/Quasar Nugget/Blocks -->
        <q-item
          v-close-popup
          clickable
          @click="addNugget('tcms')"
          :data-cy="dataCySlug + '-tachyonNugget'"
        >
          <q-item-section>Component</q-item-section>
        </q-item>
      </q-list>
    </q-menu></q-btn
  >
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "NewNuggetButton",
  props: {
    btnLabel: {
      type: String,
      default: "Nugget",
    },
    relId: {
      type: String,
      default: "",
    },
    relType: {
      type: String,
      default: "",
    },
    dataCySlug: {
      type: String,
      default: "tst",
    },
  },
  emits: ["addNugget"],
  setup(props, { emit }) {
    const addNugget = (type) => {
      console.log("Adding " + type + " nugget.");

      console.log(props);

      const def = { type: type, relId: props.prevNuggetId };

      //  @todo Add debounce
      emit("addNugget", def);
    };

    return {
      addNugget,
    };
  },
});
</script>
