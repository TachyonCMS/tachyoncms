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
        <q-item clickable :data-cy="dataCySlug + '-heading'">
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
                <q-item-section
                  @click="addBlock('h' + n)"
                  :data-cy="dataCySlug + '-heading-h' + n"
                  >H{{ n }} Heading</q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <!-- Rich Text Content / HTML block -->
        <q-separator></q-separator>
        <q-item
          v-close-popup
          clickable
          @click="addBlock('richText')"
          :data-cy="dataCySlug + '-richtext'"
        >
          <q-item-section>Rich Text</q-item-section>
        </q-item>

        <!-- Image centric blocks -->
        <q-separator></q-separator>
        <q-item clickable :data-cy="dataCySlug + '-images'">
          <q-item-section>Images</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"></q-icon>
          </q-item-section>
          <q-menu anchor="top end" self="top start">
            <q-list>
              <!-- Image Choices -->
              <q-item
                v-close-popup
                clickable
                @click="addBlock('image')"
                :data-cy="dataCySlug + '-images-image'"
              >
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
                :data-cy="dataCySlug + '-images-b4after'"
              >
                <q-item-section>Before & After</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <!-- Multimedia Blocks-->
        <q-separator></q-separator>
        <q-item clickable disabled :data-cy="dataCySlug + '-multimedia'">
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
                :data-cy="dataCySlug + '-multimedia-carousel'"
              >
                <q-item-section>Carousel</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                @click="addBlock('video')"
                disabled
                :data-cy="dataCySlug + '-multimedia-video'"
              >
                <q-item-section>Video</q-item-section>
              </q-item>

              <!-- Timeline block -->
              <q-item
                v-close-popup
                clickable
                @click="addBlock('timeline')"
                :data-cy="dataCySlug + '-timeline'"
              >
                <q-item-section>Timeline</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <!-- Raw JSON block -->
        <q-separator></q-separator>
        <q-item
          v-close-popup
          clickable
          @click="addBlock('rawJson')"
          :data-cy="dataCySlug + '-raw-json'"
        >
          <q-item-section>Raw JSON</q-item-section>
        </q-item>

        <!-- In-Nugget Page Separators -->
        <q-separator></q-separator>
        <q-item clickable :data-cy="dataCySlug + '-separator'">
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
                :data-cy="dataCySlug + '-separator-basic'"
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

export default defineComponent({
  name: "NewBlockButton",
  props: {
    btnLabel: {
      type: String,
      default: "New Block",
    },
    nextBlock: {
      type: String,
      default: "",
    },
    dataCySlug: {
      type: String,
      default: "tst",
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
