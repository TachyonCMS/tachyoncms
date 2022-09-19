import { defineStore } from "pinia";

import { useStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: useStorage("username", null),
    email: useStorage("email", null),
    telephone: useStorage("telephone", null),
    fullname: useStorage("fullname", null)
  }),

  getters: {
    isSignedIn: (state) => {
      console.log(state.username);
      return () => (state.username ? true : false);
    }
  },

  actions: {
    setUsername(val) {
      this.username = val;
    },
    setEmail(val) {
      this.email = val;
    },
    setTelephone(val) {
      this.telephone = val;
    },
    setFullname(val) {
      this.fullname = val;
    }
  }
});
