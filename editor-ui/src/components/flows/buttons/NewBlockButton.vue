<template>
  <!-- A button to add a new Block of a given type. -->
  <q-btn
    style="background-color: white"
    icon="mdi-plus"
    :label="btnLabel"
    class="option-btn"
    ><q-menu>
      <q-list>
        <!-- H2-H6 Header Blocks -->
        <q-item clickable>
          <q-item-section>Header</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"></q-icon>
          </q-item-section>

          <q-menu anchor="top end" self="top start">
            <q-list>
              <q-item
                v-for="n in [2, 3, 4, 5, 6]"
                :key="n"
                dense
                clickable
                v-close-popup
              >
                <q-item-section @click="addBlock('h' + n)"
                  >H{{ n }} Header</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <!-- Rich Text Content / HTML block -->
        <q-separator></q-separator>
        <q-item v-close-popup clickable @click="addBlock('richText')">
          <q-item-section>Rich Text</q-item-section>
        </q-item>

        <!-- Image centric blocks -->
        <q-separator></q-separator>
        <q-item clickable>
          <q-item-section>Images</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"></q-icon>
          </q-item-section>
          <q-menu anchor="top end" self="top start">
            <q-list>
              <!-- Image Choices -->
              <q-item v-close-popup clickable @click="addBlock('image')">
                <q-item-section>Image</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="addBlock('gallery')"
                disabled
              >
                <q-item-section>Gallery</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="addBlock('before-and-after')"
                disabled
              >
                <q-item-section>Before & After</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <!-- Multimedia Blocks-->
        <q-separator></q-separator>
        <q-item clickable disabled>
          <q-item-section>Multimedia</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"></q-icon>
          </q-item-section>
          <q-menu anchor="top end" self="top start">
            <q-list>
              <!-- Multimedia Choices -->
              <q-item
                v-close-popup
                clickable
                @click="addBlock('carousel')"
                disabled
              >
                <q-item-section>Carousel</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="addBlock('video')"
                disabled
              >
                <q-item-section>Video</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <!-- In-Nugget Page Separators -->
        <q-separator></q-separator>
        <q-item clickable>
          <q-item-section>Separators</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"></q-icon>
          </q-item-section>
          <q-menu anchor="top end" self="top start">
            <q-list>
              <!-- Separator Choices -->
              <q-item
                v-close-popup
                clickable
                @click="addBlock('basicSeparator')"
              >
                <q-item-section>Basic</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
      </q-list>
    </q-menu></q-btn
  >
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

// UID generator (not a true UUID but just as unique)
// They will get removed before submitting to
import { nanoid } from "nanoid";

export default defineComponent({
  name: "NewBlockButton",
  props: {
    blockData: {
      type: String,
    },
    btnLabel: {
      type: String,
      default: "New Block",
    },
    nextBlock: {
      type: String,
      default: "",
    },
  },
  emits: ["addBlock"],
  setup(props, { emit }) {
    const addBlock = (type) => {
      console.log("Adding " + type + " block.");

      console.log(props);

      const def = { type: type, nextBlock: props.nextBlock };

      //  @todo Add debounce
      emit("addBlock", def);
    };

    return {
      addBlock,
    };
  },
});
</script>
