<template>
    <q-btn
          :size="size"
          :class="styleClass"
          :padding="padding"
          @click="selectDir()"
          >{{label}}</q-btn
        >
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
    
    props: {
        "size": {
            type: String,
            default: "xl"
        },
        "styleClass": {
            type: String,
            default: "cta text-weight-bolder"
        },
        "padding": {
            type: String,
            default: "xl"
        },
        "label": {
            type: String,
            default: "Select Directory"
        }
    },

    emits: ["dirHandle"],

    setup() {

        return {
           
        }
    },

    methods: {
    async selectDir() {
      // Provide a directory picker
      const dirHandle = await window.showDirectoryPicker();
      this.$emit('dirHandle', dirHandle)
    },
    }
});
</script>

<style scoped></style>
