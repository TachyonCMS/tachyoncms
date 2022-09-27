import { boot } from "quasar/wrappers";

import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
Amplify.configure(awsExports);

import AmplifyVue from "@aws-amplify/ui-vue";

export default boot(({ app }) => {
  app.use(AmplifyVue);
});
