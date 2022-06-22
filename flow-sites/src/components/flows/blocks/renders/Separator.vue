<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->
<template>
  <div class="row col-12">
    <!-- Display separator with live updates -->
    <div
      :class="
        'row col-12 q-pt-' +
        renderData.padTop +
        ' q-pb-' +
        renderData.padBot +
        ' q-px-' +
        renderData.padSides
      "
    >
      <q-separator
        :color="selectedColor"
        :size="renderData.size"
        class="col-12"
        spaced="q-ma-lg"
      ></q-separator>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SeparatorDisplay",
  components: {},
  props: ["displayData"],
  setup(props) {
    let defaultData = {
      padTop: "xs",
      padBot: "xs",
      padSides: "md",
      size: ".2em",
      color: "green",
      colorVar: "4",
    };

    const renderData = { ...defaultData, ...props.displayData };

    const selectedColor = computed(() => {
      return renderData.color + "-" + renderData.colorVar;
    });

    return {
      renderData,
      selectedColor,
    };
  },
  methods: {},
});
</script>
