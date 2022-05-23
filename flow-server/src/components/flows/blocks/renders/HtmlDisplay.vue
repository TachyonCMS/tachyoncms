<!-- WARNING!!
The data passed to this component must be sanitized to prevent XSS.
-->

<template>
  <div
    class="block-object-wrapper col-12 justify-left text-left full-width q-pa-lg"
    v-html="displayData"
  ></div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HtmlDisplay",
  components: {},
  props: ["displayData"],
  setup(props) {
    console.log("HtmlDisplay");
    console.log(props);

    return {};
  },
  methods: {},
});
</script>
