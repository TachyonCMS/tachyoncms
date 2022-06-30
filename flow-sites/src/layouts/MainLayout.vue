<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <div class="col-12 text-body2 text-weight-thin subdued-link">
          <div class="text-center subdued-link">
            Izzup.com is sponsored by
            <a href="https://opensourcebike.com">Open Source Bike</a>.
          </div>
          <div class="text-center">
            Content is created using
            <a target="_blank" href="https://TachyonCMS.org">TachyonCMS</a>.
          </div>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  setup() {
    return {};
  },
});
</script>
