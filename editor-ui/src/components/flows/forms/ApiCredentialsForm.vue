<template>
  <q-card>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card-section>
        <div class="q-pb-md">
          <q-input
            filled
            v-model="nickname"
            label="Nickname"
            hint="A name that is useful to you"
            :data-cy="dataCySlug + '-storage-api-login-nickname-fld'"
            ><q-tooltip>
              This a name of your choosing, it is not provided by the Storage
              API or backend server.
            </q-tooltip>
          </q-input>
        </div>
        <div class="q-pb-md">
          <q-input
            filled
            v-model="rootUrl"
            label="Root URL"
            hint="The API server address"
            :data-cy="dataCySlug + '-storage-api-login-host-fld'"
            ><q-tooltip>
              Requires a valid hostname or IP and optionally a port number and
              subdirectory, all requests are sent here.
            </q-tooltip>
          </q-input>
        </div>
        <div class="q-pb-md">
          <q-input
            filled
            v-model="apiUsername"
            label="API Login"
            hint="The API login provided"
            :data-cy="dataCySlug + '-storage-api-login-apiUsername-fld'"
            ><q-tooltip>
              This credential is managed in the Storage API, or backend server.
            </q-tooltip></q-input
          >
        </div>
        <div class="q-pb-md">
          <q-input
            filled
            type="text"
            v-model="apiPassword"
            label="API Password"
            hint="The API password provided"
            :data-cy="dataCySlug + '-storage-api-login-apiPassword-fld'"
          ></q-input>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          label="Reset"
          type="reset"
          flat
          class="q-ml-sm subdued-btn"
        ></q-btn>
        <q-btn
          :data-cy="dataCySlug + '-storage-api-login-submit-btn'"
          label="Submit"
          type="submit"
          class="action-btn"
        ></q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { defineComponent, ref } from "vue";

import useFlows from "../../../composables/useFlows";
const { createFlow, setFlowSource, setFlowConnector } = useFlows();

export default defineComponent({
  name: "ApiCredentialsForm",
  components: {},
  props: ["dataCySlug"],
  emits: ["appNotification", "isSubmitted"],
  setup(props) {
    const { createFlow } = useFlows();
    const nickname = ref("Local Storage API");
    const rootUrl = ref("http://localhost:3333");
    const apiUsername = ref("admin");
    const apiPassword = ref("TachyonCMS");

    return {
      nickname,
      rootUrl,
      apiUsername,
      apiPassword,
      setFlowSource,
      setFlowConnector,
    };
  },
  methods: {
    async onSubmit() {
      const { nickname, rootUrl, apiUsername, apiPassword } = this;

      // All are required
      if (!nickname || !rootUrl || !apiUsername || !apiPassword) return;

      const connDef = { nickname, rootUrl, apiUsername, apiPassword };
      this.setFlowConnector("storageApi");
      this.setFlowSource(connDef);

      this.$emit("isSubmitted", connDef);

      this.onReset();
    },
    async onReset() {
      (this.nickname = ""),
        (this.rootUrl = ""),
        (this.apiUsername = ""),
        (this.apiPassword = "");
    },
  },
});
</script>
