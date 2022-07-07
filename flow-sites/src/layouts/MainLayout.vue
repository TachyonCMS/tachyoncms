<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ title }}</q-toolbar-title>
        <div class="nameBug">
          <a href="https://www.TachyonCMS.org/#/">TachyonCMS</a>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view @newPageTitle="(event) => onNewTitle(event)" />
    </q-page-container>

    <q-footer class="bg-grey-2 foot">
      <q-toolbar>
        <div class="col-12 text-body2 subdued-link text-center">
          Powered by
          <a target="_blank" href="https://www.tachyoncms.org/#/">TachyonCMS</a
          >, the free CMS.
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

import { useQuasar, useMeta } from "quasar";
export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    const title = ref("great things are loading...");

    // NOTICE the parameter here is a function
    // Under the hood, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
      };
    });

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      title,
    };
  },
  methods: {
    onNewTitle(title) {
      console.log("SETTING Title: " + title);
      this.title = title;
    },
  },
});
</script>

<style scoped>
.foot {
  color: darkgray;
}
.nameBug {
  opacity: 40%;
}
</style>
