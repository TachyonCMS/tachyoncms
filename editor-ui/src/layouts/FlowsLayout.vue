<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
          data-cy="toggle-drawer-btn"
        />

        <q-toolbar-title>
          <router-link to="/" class="router-link navbar-title toolbar-text">
            <q-avatar size="md" rounded class="cursor-pointer gt-xs">
              <img src="~/assets/logo.svg" />
            </q-avatar>
            {{ appName }}
          </router-link>
        </q-toolbar-title>

        <q-space></q-space>
      </q-toolbar>
      <template v-if="pageFlowData && flowId && pageFlowData.id === flowId">
        <q-card square class="page-title glossy">
          <q-card-section
            class="text-center text-weight-bold no-padding text-h6"
            ><span class="cursor-pointer">
              {{ pageFlowData.title }}
              <q-icon
                size="xs"
                name="edit"
                v-if="!pageFlowData.title || pageFlowData.title < 1"
              ></q-icon>
              <q-popup-edit
                :model-value="pageFlowData.title"
                auto-save
                @save="
                  (v, iv) => {
                    updateFlowProp(flowId, 'title', v);
                  }
                "
              >
                <template v-slot="scope">
                  <q-input
                    type="text"
                    autofocus
                    dense
                    v-model="scope.value"
                    :model-value="scope.value"
                    hint="Public title for the published flow"
                  >
                    <template v-slot:after>
                      <q-btn
                        flat
                        dense
                        color="negative"
                        icon="cancel"
                        @click.stop="scope.cancel"
                      ></q-btn>

                      <q-btn
                        flat
                        dense
                        color="positive"
                        icon="check_circle"
                        @click.stop="scope.set"
                        :disable="scope.initialValue === scope.value"
                      ></q-btn>
                    </template>
                  </q-input>
                </template>
              </q-popup-edit>
            </span> </q-card-section
        ></q-card>
      </template>
    </q-header>

    <q-drawer
      :show-if-above="false"
      v-model="leftDrawerOpen"
      side="left"
      bordered
    >
      <!-- drawer content -->
      <component :is="currentDrawer" @toggleDrawer="toggleDrawer"></component>
    </q-drawer>
    <q-page-container>
      <router-view
        @appNotification="onAppNotification"
        @flowLoaded="console.log(event)"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
// Vue 3 composition and reactive components
import { defineComponent, ref, computed } from "vue";

// We use route in determining navigation options
import { useRoute } from "vue-router";

// Use Quasar for app notifications
import { useQuasar } from "quasar";

// The drawers
import FlowsDrawer from "./drawers/FlowsDrawer";

import useFlows from "../composables/useFlows";

export default defineComponent({
  name: "FlowsLayout",

  components: {
    FlowsDrawer,
  },

  props: [],
  emits: ["logIt"],

  setup(props, ctx) {
    const route = useRoute();

    const currentDrawer = "flows-drawer";

    const { updateFlowProp, flowMap } = useFlows();

    // $q is the standard convention for calling Quasar.
    // We use it display notification toast to the user.
    const $q = useQuasar();

    // Quasar Drawer
    const leftDrawerOpen = ref(false);

    // Our App name for the toolbar
    const appName = "TachyonCMS";

    const flowId = computed(() => {
      return route.params.flowId;
    });

    const pageFlowData = computed(() => {
      return flowMap.get(flowId.value);
    });

    // Return the values we want to be available under `this.` after setup.
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      appName,
      updateFlowProp,
      pageFlowData,
      flowId,
      currentDrawer,
    };
  },

  methods: {
    // Open/close the left navigation drawer
    toggleDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    // Display notification toast at bottom of screen
    onAppNotification(note) {
      const notification = {
        type: note.type,
        attrs: {
          // for the notification itself:
          role: "alertdialog",
        },
        actions: [
          {
            icon: "close",
            // for individual action (button):
            attrs: {
              "aria-label": "Dismiss",
            },
          },
        ],
        name: note.name,
        message: note.message,
      };
      this.$q.notify(notification);
    },
  },
});
</script>

<style></style>
