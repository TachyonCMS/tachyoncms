<template>
  <!-- A button to add a new Nugget of a given type. -->
  <q-btn
    icon="mdi-puzzle-plus"
    :label="btnLabel"
    class="option-btn"
    :size="btnSize"
    @click="this.onAddNugget()"
  ></q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NewTypedNuggetButton",
  emits: ["addNugget"],
  props: {
    btnLabel: {
      type: String,
      default: "",
    },
    prevNuggetId: {
      type: String,
      default: "",
    },
    dataCySlug: {
      type: String,
      default: "tst",
    },
    nuggetType: {
      type: String,
      default: "editor",
    },
    btnSize: {
      type: String,
      default: "xl",
    },
  },
  emits: ["addNugget"],
  setup(props, { emit }) {
    const onAddNugget = () => {
      console.log("Adding " + props.nuggetType + " nugget.");

      const def = { type: props.nuggetType, prevNuggetId: props.prevNuggetId };
      console.log(def);

      //  @todo Add debounce
      emit("addNugget", def);
    };

    return {
      onAddNugget,
    };
  },
});
</script>
