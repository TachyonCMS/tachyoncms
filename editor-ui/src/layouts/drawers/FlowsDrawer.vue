<template>
  <q-scroll-area class="fit text-primary-140">
    <q-list separator bordered>
      <q-item class="drawer-header">
        <q-item-section class="text-center text-h5"> Flows </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        v-show="flowConnector"
        @click="confirmClosingSource"
      >
        <q-item-section avatar>
          <q-icon name="folder" v-show="flowConnector == 'electron'"></q-icon>
          <q-icon name="api" v-show="flowConnector == 'storageApi'"></q-icon>
        </q-item-section>

        <q-item-section>
          <q-item-label
            >{{ flowSourceMsg
            }}<q-tooltip>{{ flowSourceDetail }}</q-tooltip></q-item-label
          >
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        @click="onSelectConnector('electron')"
        v-if="$q.platform.is.electron"
        v-show="!flowConnector"
      >
        <q-item-section avatar>
          <q-icon name="folder" />
        </q-item-section>

        <q-item-section>
          <q-item-label
            >Select a local directory<q-tooltip
              >A flows and nuggets directory will be created if they don't
              exist.</q-tooltip
            ></q-item-label
          >
        </q-item-section>
      </q-item>

      <q-expansion-item
        expand-separator
        icon="api"
        label="Connect to Storage API"
        caption="Requires credentials"
        v-model="formExpanded"
        v-show="!flowConnector"
        data-cy="expand-storage-api-login"
      >
        <api-credentials-form
          @isSubmitted="
            formExpanded = false;
            onSelectConnector('storageApi');
          "
        ></api-credentials-form>
      </q-expansion-item>

      <template v-if="hasAmplifyS3">
        <q-item
          clickable
          v-ripple
          @click="onSelectConnector('amplifyS3')"
          v-show="!flowConnector"
        >
          <q-item-section avatar>
            <q-icon name="cloud" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              >AWS Amplify S3<q-tooltip
                >Connect to the built-in AWS S3 cloud storage.</q-tooltip
              ></q-item-label
            >
          </q-item-section>
        </q-item>
      </template>
      <q-item
        clickable
        v-ripple
        exact
        to="/flows"
        @click="this.$emit('toggleDrawer')"
        exact-active-class="exact-active"
        v-if="flowSource"
      >
        <q-item-section avatar>
          <q-icon name="list" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Manage Flows</q-item-label>
        </q-item-section>
      </q-item>

      <q-expansion-item
        expand-separator
        icon="mdi-briefcase-plus"
        label="New Flow"
        caption="Share a new flow"
        v-model="formExpanded"
        v-if="flowSource"
      >
        <new-flow-form
          :condensed="true"
          :openFlowChecked="true"
          @isSubmitted="formExpanded = false"
        ></new-flow-form>
      </q-expansion-item>

      <q-separator></q-separator>

      <template v-if="pageFlowData && flowId && pageFlowData.id === flowId">
        <q-item class="drawer-subheader">
          <q-item-section class="text-center text-h6">
            Current Flow
          </q-item-section>
        </q-item>
        <q-card flat>
          <q-card-section class="inline-form-section">
            <div class="row">
              <div class="col-3 inline-form-label">ID:</div>
              <div class="col-9 inline-form-value ellipsis">
                {{ pageFlowData.id }}
                <q-tooltip anchor="center start" :delay="400">
                  <div class="row">
                    <span class="col-3">Flow Id:</span>
                    <span class="col-9">{{ pageFlowData.id }}</span>
                  </div>
                </q-tooltip>
              </div>
            </div>
            <div class="row">
              <div class="col-3 inline-form-label">Name:</div>
              <div class="col-9 inline-form-value">
                <span class="cursor-pointer">
                  {{ pageFlowData.name }}
                  <q-icon
                    size="xs"
                    name="edit"
                    v-if="!pageFlowData.name || pageFlowData.name.length < 1"
                  ></q-icon>
                  <q-popup-edit
                    :model-value="pageFlowData.name"
                    auto-save
                    @save="
                      (v, iv) => {
                        updateFlowProp(pageFlowData.id, 'name', v);
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
                        hint="Flow name"
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
                </span>
              </div>
            </div>

            <div class="row">
              <div class="col-3 inline-form-label">Title:</div>
              <div class="col-9 inline-form-value">
                <span class="cursor-pointer">
                  {{ pageFlowData.title }}
                  <q-icon
                    size="xs"
                    name="edit"
                    v-if="!pageFlowData.title || pageFlowData.title.length < 1"
                  ></q-icon>
                  <q-popup-edit
                    :model-value="pageFlowData.title"
                    auto-save
                    @save="
                      (v, iv) => {
                        updateFlowProp(pageFlowData.id, 'title', v);
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
                </span>
              </div>
            </div>

            <div class="row">
              <div class="col-3 inline-form-label">Publish:</div>
              <div class="col-9 inline-form-value">
                <span class="cursor-pointer">
                  <date-display
                    :rawDate="pageFlowData.pubAt"
                    displayFormat="YYYY/MM/DD hh:mm a"
                    label="Publish At:"
                  ></date-display>
                  <q-icon
                    size="xs"
                    name="edit"
                    v-if="!pageFlowData.pubAt || pageFlowData.pubAt.length < 1"
                  ></q-icon>
                  <q-popup-edit
                    :model-value="pageFlowData.pubAt"
                    auto-save
                    @save="
                      (v, iv) => {
                        const isoDate = v + ':00.000Z';
                        updateFlowProp(pageFlowData.id, 'pubAt', isoDate);
                      }
                    "
                  >
                    <template v-slot="scope">
                      <q-date
                        dense
                        v-model="scope.value"
                        :model-value="scope.value"
                        mask="YYYY-MM-DDTHH:mm"
                        hint="The day the Flow is published."
                      >
                      </q-date>
                      <q-time
                        dense
                        v-model="scope.value"
                        :model-value="scope.value"
                        mask="YYYY-MM-DDTHH:mm"
                        hint="The time the Flow is published."
                      >
                      </q-time>

                      <div>
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
                      </div>
                    </template>
                  </q-popup-edit>
                </span>
              </div>
            </div>

            <div class="row">
              <div class="col-3 inline-form-label">Expire:</div>
              <div class="col-9 inline-form-value">
                <span class="cursor-pointer">
                  <date-display
                    :rawDate="pageFlowData.unPubAt"
                    displayFormat="YYYY/MM/DD hh:mm a"
                    label="Expire At:"
                  ></date-display>
                  <q-icon
                    size="xs"
                    name="edit"
                    v-if="
                      !pageFlowData.unPubAt || pageFlowData.unPubAt.length < 1
                    "
                  ></q-icon>
                  <q-popup-edit
                    :model-value="pageFlowData.pubAt"
                    auto-save
                    @save="
                      (v, iv) => {
                        const isoDate = v + ':00.000Z';
                        updateFlowProp(pageFlowData.id, 'unPubAt', isoDate);
                      }
                    "
                  >
                    <template v-slot="scope">
                      <q-date
                        dense
                        v-model="scope.value"
                        :model-value="scope.value"
                        mask="YYYY-MM-DDTHH:mm"
                        hint="The day the Flow is removed from publication."
                      >
                      </q-date>
                      <q-time
                        dense
                        v-model="scope.value"
                        :model-value="scope.value"
                        mask="YYYY-MM-DDTHH:mm"
                        hint="The time the Flow is removed from publication."
                      >
                      </q-time>

                      <div>
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
                      </div>
                    </template>
                  </q-popup-edit>
                </span>
              </div>
            </div>

            <div class="row">
              <div class="col-3 inline-form-label">Created:</div>
              <div class="col-9 inline-form-value">
                <date-display
                  :rawDate="pageFlowData.createdAt"
                  label="Created"
                ></date-display>
              </div>
            </div>
            <div class="row">
              <div class="col-3 inline-form-label">Updated:</div>
              <div class="col-9 inline-form-value">
                <date-display
                  :rawDate="pageFlowData.updatedAt"
                  label="Updated"
                ></date-display>
              </div>
            </div>
            <div class="row">
              <div class="col-3 inline-form-label">Notes:</div>
              <div class="col-9 inline-form-value">
                <span class="cursor-pointer">
                  {{ pageFlowData.notes }}
                  <q-icon
                    size="xs"
                    name="edit"
                    v-if="!pageFlowData.notes || pageFlowData.notes.length < 1"
                  ></q-icon>
                  <q-popup-edit
                    :model-value="pageFlowData.notes"
                    @save="
                      (v, iv) => {
                        updateFlowProp(pageFlowData.id, 'notes', v);
                      }
                    "
                  >
                    <template v-slot="scope">
                      <q-input
                        type="textarea"
                        autofocus
                        dense
                        v-model="scope.value"
                        :model-value="scope.value"
                        hint="Flow notes"
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
                </span>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-separator></q-separator>

        <q-item
          clickable
          v-ripple
          exact
          :to="'/flows/' + flowId + '/nuggets'"
          @click="this.$emit('toggleDrawer')"
          exact-active-class="exact-active"
          :inset-level="1"
        >
          <q-item-section avatar>
            <q-icon name="mdi-puzzle" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Edit Nuggets</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          exact
          :to="'/flows/' + flowId + '/sequence'"
          @click="this.$emit('toggleDrawer')"
          exact-active-class="exact-active"
          :inset-level="1"
        >
          <q-item-section avatar>
            <q-icon name="mdi-order-numeric-ascending" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Sequence Nuggets</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          exact
          :to="'/flows/' + flowId + '/preview'"
          @click="this.$emit('toggleDrawer')"
          exact-active-class="exact-active"
          :inset-level="1"
        >
          <q-item-section avatar>
            <q-icon name="mdi-eye" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Preview Flow</q-item-label>
          </q-item-section>
        </q-item>
        <!-- @todo allow toggling nugget and block outlines in preview
        <q-item :inset-level="1">
              <q-item-section>
            <q-toggle
              v-model="outlineNuggets"
              label="Outline nuggets"
              left-label
            ></q-toggle>
          </q-item-section>
        </q-item>
      -->
        <q-item
          clickable
          v-ripple
          exact
          :to="'/flows/' + flowId + '/published'"
          @click="this.$emit('toggleDrawer')"
          exact-active-class="exact-active"
          :inset-level="1"
        >
          <q-item-section avatar>
            <q-icon name="mdi-earth" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Published Flow</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="confirmDeleteFlow(pageFlowData.id, pageFlowData.name)"
          :inset-level="1"
        >
          <q-item-section avatar>
            <q-icon name="mdi-delete" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Delete Flow</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-scroll-area>
</template>

<script>
// Vue 3 composition and reactive components
import { defineComponent, computed, ref } from "vue";

import { useQuasar } from "quasar";

// We use route in determining navigation options
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

// A form to create a new flow
import NewFlowForm from "../../components/flows/forms/NewFlowForm.vue";
import ApiCredentialsForm from "../../components/flows/forms/ApiCredentialsForm.vue";
// An inline form to edit the Flow meta data
//import FlowMetaInlineForm from "../../components/flow/form/FlowMetaInlineForm.vue";
// An "enter" nav button to show visitors who haven't signed in.
// We want to remove this from the view when in the "/auth" path to avoid a loop.
import EnterButton from "../../components/site/buttons/Link.vue";

import useFlows from "../../composables/useFlows";

import DateDisplay from "../../components/site/widgets/DateDisplay.vue";

export default defineComponent({
  name: "FlowsDrawer",
  props: [],
  emits: ["toggleDrawer", "appNotification"],
  components: {
    NewFlowForm,
    DateDisplay,
    ApiCredentialsForm,
  },
  setup() {
    const $q = useQuasar();

    // Use the `/auth` route or isSignedIn state to trigger hiding the entry navigation.
    const route = useRoute();

    // Is Amplify S3 Storage enabled?
    // @todo Make computed function that checks for Amplify
    const hasAmplifyS3 = false;

    const {
      updateFlowProp,
      deleteFlow,
      pageFlowId,
      flowMap,
      flowSource,
      flowSourceMsg,
      flowSourceDetail,
      setFlowSource,
      setFlowConnector,
      flowConnector,
      checkAuth,
    } = useFlows();

    const flowId = computed(() => {
      return route.params.flowId;
    });

    const pageFlowData = computed(() => {
      return flowMap.get(flowId.value);
    });

    const outlineNuggets = ref(false);

    const formExpanded = ref(false);

    return {
      pageFlowId,
      updateFlowProp,
      deleteFlow,
      flowId,
      flowMap,
      pageFlowData,
      outlineNuggets,
      formExpanded,
      flowSourceMsg,
      flowSourceDetail,
      flowSource,
      setFlowSource,
      setFlowConnector,
      flowConnector,
      hasAmplifyS3,
      checkAuth,
    };
  },
  methods: {
    async onSelectConnector(connector) {
      // Record the connector choice
      //this.setFlowConnector(connector);

      // Display sources options for the connector
      switch (connector) {
        case "electron":
          this.onSelectRootDir();
          break;
        case "storageApi":
          this.onStorageApi();
          break;
      }
    },
    async onStorageApi() {
      // Check Auth to verify the URL and credentials provided are valid
      if (this.checkAuth()) {
        console.log("Auth OK");
        this.$router.push("/flows");
      } else {
        console.log("Auth Failed");
      }
    },
    async onSelectRootDir() {
      const selection = await electronApi.openDirectoryDialog(
        "TachyonCMS Content Root",
        "folder",
        {
          name: "All Files",
          extensions: ["*"],
        }
      );
      const selectedDir = selection[0];
      console.log(selectedDir);
      if (selectedDir) {
        const hasFlowsDir = await electronApi.dirAccessible([
          selectedDir,
          "flows",
        ]);
        const hasNuggetsDir = await electronApi.dirAccessible([
          selectedDir,
          "nuggets",
        ]);

        console.log(hasFlowsDir);
        console.log(hasNuggetsDir);

        if (hasFlowsDir && hasNuggetsDir) {
          this.setFlowConnector("electron");
          this.setFlowSource(selectedDir);
          this.$emit("toggleDrawer");
          this.$router.push("/flows");
          console.log("EXISTING ROOTDIR");
        } else {
          console.log("NEW ROOTDIR");
          this.$q
            .dialog({
              title: "Confirm New Root Directory",
              message:
                "Required subdirectories are missing. Click 'OK' to initialize the directory or cancel to choose another directory.",
              cancel: true,
              persistent: true,
            })
            .onOk((data) => {
              electronApi.initRootDir(selectedDir);
              this.flowSource = selectedDir;
              this.$router.push("/flows");
            })
            .onCancel(() => {
              // console.log('>>>> Cancel')
              this.setFlowConnector(null);
              this.setFlowSource(null);
            })
            .onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            });
        }
      }
    },
    async confirmDeleteFlow(flowId, name) {
      console.log(flowId);
      const message = "Enter the name of the flow to confirm: " + name;
      this.$q
        .dialog({
          title: "Confirm Flow Deletion",
          message: message,
          prompt: {
            model: "",
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          if (data === name) {
            this.deleteFlow(flowId);
            this.$router.push("/flows");
          } else {
            // Display an error message stating the name did not match
            this.$emit("appNotification", {
              type: "negative",
              name: "Confirmation failed",
              message: "You must enter the flow name: '" + name,
            });
          }
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    async confirmClosingSource(f) {
      this.$q
        .dialog({
          title: "Confirm Closing Source",
          message: "Are you sure you want to close this source?",
          cancel: true,
          persistent: false,
        })
        .onOk((data) => {
          this.setFlowSource(null);
          this.setFlowConnector(null);
          this.pageFlowId = null;
          this.flowId = null;
          this.nuggetMap = new Map();
          this.flowMap = new Map();
          this.$router.push("/");
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
  },
});
</script>
