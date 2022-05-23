<template>
  <q-btn
    class="glossy text-weight-bolder"
    color="deep-orange"
    text-color="light-gray"
    :label="label"
    :to="toRoute"
    :size="size ? size : 'md'"
    v-ripple
  ></q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LinkButton",
  props: ["label", "toRoute", "size"],
  setup() {},
});
</script>
