<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->
<template>
  <div class="row col-12">
    <!-- Display separator with live updates -->
    <div
      :class="
        'row col-12 q-pt-' +
        displayData.padTop +
        ' q-pb-' +
        displayData.padBot +
        ' q-px-' +
        displayData.padSides
      "
    >
      <q-separator
        :color="displayData.color + '-' + displayData.colorVar"
        :size="displayData.size"
        class="col-12"
        spaced="q-ma-lg"
      ></q-separator>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SeparatorBlock",
  components: {},
  props: ["displayData", "dataCySlug"],
  setup(props) {
    let defaultData = {
      padTop: "xs",
      padBot: "xs",
      padSides: "md",
      size: ".2em",
      color: "green",
      colorVar: "4",
    };

    return {};
  },
  methods: {},
});
</script>
