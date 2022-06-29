<template>
  <q-page class="flex flex-center">
    <q-card flat class="text-center">
      <q-card-section>
        <div class="text-h4 q-py-lg">Populate the Flow with Nuggets</div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center">
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-lg">
            <new-typed-nugget-button
              nuggetType="editor"
              btnLabel="Editor"
              icon="mdi-format-text"
              @addNugget="(event) => this.$emit('addNugget', event)"
            >
            </new-typed-nugget-button>
            <div class="text-body1 q-pa-md">
              Create <span class="text-weight-bold">Editor</span> nuggets for
              text content.
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 q-px-lg">
            <new-typed-nugget-button
              nuggetType="media"
              btnLabel="Media"
              icon="mdi-folder-multiple-image"
              @addNugget="(event) => this.$emit('addNugget', event)"
            >
            </new-typed-nugget-button>
            <div class="text-body1 q-py-md">
              Create <span class="text-weight-bold">Media</span> nuggets for
              rich multimedia content.
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-px-xl justify-center text-center">
          <q-list>
            <q-item class="text-left justify-center">
              <q-item-section avatar>
                <q-avatar rounded icon="mdi-calendar"></q-avatar>
              </q-item-section>
              <q-item-section class="text-h6"
                >Manage publishing dates</q-item-section
              >
            </q-item>
            <q-item class="text-left justify-center">
              <q-item-section avatar>
                <q-avatar rounded icon="mdi-text"></q-avatar>
              </q-item-section>
              <q-item-section class="text-h6"
                >Define rich-text content</q-item-section
              >
            </q-item>
            <q-item class="text-left justify-center">
              <q-item-section avatar>
                <q-avatar rounded icon="mdi-image-multiple"></q-avatar>
              </q-item-section>
              <q-item-section class="text-h6"
                >Connect file assets</q-item-section
              >
            </q-item>
            <q-item class="text-left justify-center">
              <q-item-section avatar>
                <q-avatar rounded icon="mdi-video-image"></q-avatar>
              </q-item-section>
              <q-item-section class="text-h6"
                >Enable multimedia components</q-item-section
              >
            </q-item>
            <q-item class="text-left justify-center">
              <q-item-section avatar>
                <q-avatar rounded icon="mdi-camera"></q-avatar>
              </q-item-section>
              <q-item-section class="text-h6"
                >Capture camera, audio and screen</q-item-section
              >
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center">
          <div class="col-xs-12 col-sm-6 col-md-4 q-ma-lg chead">
            <div class="text-h5">Editor Blocks</div>

            <div class="text-body1 q-pa-md">Paragraph</div>
            <div class="text-body1 q-pa-md">Header</div>
            <div class="text-body1 q-pa-md">List</div>
            <div class="text-body1 q-pa-md">Image</div>
            <div class="text-body1 q-pa-md">Links</div>
            <div class="text-body1 q-pa-md">Raw HTML</div>
            <div class="text-body1 q-pa-md">Code</div>
            <div class="text-body1 q-pa-md">Checklist</div>
            <div class="text-body1 q-pa-md">Embed</div>
            <div class="text-body1 q-pa-md">Quote</div>
            <div class="text-body1 q-pa-md">Table</div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 q-ma-lg chead">
            <div class="text-h5">Media Blocks</div>
            <div class="text-body1 q-pa-md">Captioned Image</div>
            <div class="text-body1 q-pa-md">Header</div>
            <div class="text-body1 q-pa-md">Rich text</div>
            <div class="text-body1 q-pa-md">Separator</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

import NewTypedNuggetButton from "../../components/flows/buttons/NewTypedNuggetButton";

export default defineComponent({
  name: "FirstNuggetInstructionsPage",
  emits: ["addNugget"],
  components: {
    NewTypedNuggetButton,
  },
  setup(props, { emit }) {},
});
</script>

<style scoped>
.chead {
  border-block-style: solid;
}
</style>
