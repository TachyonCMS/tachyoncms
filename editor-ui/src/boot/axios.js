// src/boot/axios.js

import { boot } from "quasar/wrappers";
import axios from "axios";

const storageApi = axios.create({ baseURL: "http://localhost" });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$storageApi

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$storageApi = storageApi;
  // ^ ^ ^ this will allow you to use this.$storageApi (for Vue Options API form)
  //       so you can easily perform requests against the TachyonCMS Storage API
});

export { axios, storageApi };
