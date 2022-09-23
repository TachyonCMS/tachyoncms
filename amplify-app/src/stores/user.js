import { defineStore } from "pinia";

import { useStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: useStorage("username", null),
    email: useStorage("email", null),
    telephone: useStorage("telephone", null),
    commonName: useStorage("commonName", null),
    authenticated: useStorage("authenticated", false)
  }),

  getters: {
    isSignedIn: (state) => {
      return () => state.authenticated;
    }
  },

  actions: {
    setUsername(val) {
      this.username = val;
    }
  }
});
