<template>
  <q-page class="flex flex-center">
    <q-card flat class="text-center">
      <q-card-section>
        <h4>Connect to a Flow Source</h4>

        <h5>Click the hamburger menu to open the drawer</h5>

        <img src="~/assets/screencaps/hamburger-menu-tachyoncms.png" />

        <h5>Choose from the sources available in the drawer.</h5>
        <p>
          Note: "Select a local directory will only work with a current version
          of Chrome on the desktop.
        </p>
        <img src="~/assets/screencaps/connector-options-tachyoncms.png" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NoFlowSourceSetPage",

  setup() {},

  components: {
    //    LinkButton,
  },
});
</script>
