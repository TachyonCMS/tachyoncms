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
          data-cy="drawer-toggle-btn"
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
        <div v-if="flowSource">
          <!-- Initial button -->
          <q-btn
            icon="mdi-lock-open-alert"
            v-if="!this.keyExists"
            @click="this.showPassphrase = !this.showPassphrase"
            class="btn-alert"
            ><q-tooltip>No encryption</q-tooltip></q-btn
          >

          <!-- Encryption file exists but has notbeen unlocked -->
          <q-btn
            icon="mdi-lock"
            v-if="keyExists && !masterKey"
            class="btn-alert"
            @click="this.showPassphrase = !this.showPassphrase"
            ><q-tooltip>Click to decrypt</q-tooltip></q-btn
          >

          <!-- Encryption file exists and has been unlocked -->
          <q-btn-dropdown
            icon="mdi-lock-open"
            class="btn-ok"
            v-if="keyExists && masterKey"
          >
            <q-list>
              <q-item clickable v-close-popup @click="onLock()">
                <q-item-section>
                  <q-item-label>Lock</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onPassphraseChange()">
                <q-item-section>
                  <q-item-label>Change Password</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>

      <template v-if="showPassphrase">
        <div class="row q-mb-md">
          <div class="col">&nbsp;</div>
          <div class="col-10 pp">
            <q-card flat>
              <q-card-section class="text-weight-medium text-body1">
                <div v-if="!keyExists">
                  Enter a secure passphrase
                  <div class="row col-12 alert text-weight-bold">
                    If you lose this passphrase you will lose access to your
                    data FOREVER.
                  </div>
                </div>
                <div v-if="keyExists">Enter the current passphrase:</div>

                <div class="col-3">
                  <span v-if="keyError" class="error text-h6">{{
                    keyError
                  }}</span>

                  <q-input
                    filled
                    color="white"
                    v-model="passphrase"
                    label="Passphrase"
                    class="q-py-md"
                  ></q-input>
                  <q-input
                    filled
                    color="white"
                    v-model="passphrase2"
                    label="Repeat passphrase"
                    class="q-pb-sm"
                    v-if="!keyExists"
                  ></q-input>

                  <div v-if="keyExists && showNewPassphrase" class="q-pt-sm">
                    Enter the NEW passphrase:
                  </div>

                  <q-input
                    filled
                    color="white"
                    v-model="newPassphrase"
                    label="New Passphrase"
                    class="q-py-md"
                    v-if="showNewPassphrase"
                  ></q-input>
                  <q-input
                    filled
                    color="white"
                    v-model="newPassphrase2"
                    label="Repeat new passphrase"
                    class="q-pb-sm"
                    v-if="showNewPassphrase"
                  ></q-input>
                </div>
                <div class="col-3 q-pt-sm text-center justify-center">
                  <q-btn
                    icon="mdi-key-plus"
                    @click="createKey()"
                    v-if="!keyExists"
                    ><span class="q-pl-sm">Create Key</span></q-btn
                  >
                  <q-btn
                    icon="mdi-key"
                    @click="decryptKey()"
                    v-if="keyExists && !showNewPassphrase"
                    ><span class="q-pl-sm">Unlock</span></q-btn
                  >
                  <q-btn
                    icon="mdi-key"
                    @click="updateKey()"
                    v-if="keyExists && showNewPassphrase"
                    ><span class="q-pl-sm">Change passphrase</span></q-btn
                  >
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col">&nbsp;</div>
        </div>
      </template>

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
import { defineComponent, ref, computed, onMounted } from "vue";

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

    const {
      updateFlowProp,
      flowMap,
      keyExists,
      passphrase,
      createMasterKey,
      unlockMasterKey,
      flowSource,
      masterKey,
      newPassphrase,
      changeMasterKey,
    } = useFlows();

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

    console.log(route.meta.drawer);

    const pageFlowData = computed(() => {
      return flowMap.get(flowId.value);
    });

    // Show the pasphrase box
    const showPassphrase = ref(null);

    // Show the pasphrase box
    const showNewPassphrase = ref(null);

    const keyError = ref(false);
    const newKeyError = ref(false);

    const passphrase2 = ref(null);
    const newPassphrase2 = ref(null);

    onMounted(async () => {
      //flushAll();
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
      keyExists,
      showPassphrase,
      showNewPassphrase,
      passphrase,
      newPassphrase,
      createMasterKey,
      unlockMasterKey,
      changeMasterKey,
      flowSource,
      masterKey,
      keyError,
      newKeyError,
      passphrase2,
      newPassphrase2,
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
    onLock() {
      this.resetAll();
    },
    onPassphraseChange() {
      this.showPassphrase = true;
      this.showNewPassphrase = true;
    },
    async createKey() {
      console.log(this.passphrase);
      if (this.passphrase && this.passphrase.length >= 9) {
        if (this.passphrase == this.passphrase2) {
          const masterKey = await this.createMasterKey(this.passphrase);
          console.log(masterKey);
          this.masterKey = masterKey;
          this.resetPassphrases();
        } else {
          this.keyError = "The passphrases do not match.";
        }
      } else {
        this.keyError = "The passphrase must be nine characters or more.";
      }
    },
    async decryptKey() {
      console.log(this.passphrase);
      this.keyError = false;
      const masterKey = await this.unlockMasterKey(this.passphrase);
      if (masterKey) {
        console.log(masterKey);
        this.masterKey = masterKey;
        this.resetPassphrases();
      } else {
        this.keyError = "Incorrect passphrase";
      }
    },
    async updateKey() {
      console.log(this.passphrase);
      this.keyError = false;
      if (this.newPassphrase && this.newPassphrase.length >= 9) {
        if (this.newPassphrase == this.newPassphrase2) {
          const masterKey = await this.changeMasterKey();
          if (masterKey) {
            console.log(masterKey);
            this.masterKey = masterKey;
            this.resetPassphrases();
          }
        } else {
          this.keyError = "The NEW passphrases do not match.";
        }
      } else {
        this.keyError = "The NEW passphrase must be nine characters or more.";
      }
    },
    resetAll() {
      this.masterKey = null;
      this.resetPassphrases();
    },
    resetPassphrases() {
      this.passphrase = null;
      this.passphrase2 = null;
      this.newPassphrase = null;
      this.newPassphrase2 = null;
      this.showPassphrase = false;
      this.showNewPassphrase = false;
    },
  },
});
</script>

<style scoped>
.pp {
  color: black;
}
.alert {
  color: red;
}
.error {
  color: red;
}
.btn-alert {
  color: white;
  background-color: red;
}
.btn-ok {
  color: white;
  background-color: limegreen;
}
</style>
