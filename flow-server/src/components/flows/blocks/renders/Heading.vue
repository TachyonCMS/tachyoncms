<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->

<template>
  <div class="justify-center row col-12">
    <component :is="'h' + level">{{ displayData.heading }}</component>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "RendersHeading",
  components: {},
  props: ["displayData"],
  setup(props) {
    console.log("Heading");
    console.log(props);
    // Get level from the props, this should not be editable.
    const { level } = { ...props.displayData };

    return { level };
  },
  methods: {},
});
</script>
