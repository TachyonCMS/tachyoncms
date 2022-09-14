import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => ({
    title: "Tachyon CMS"
  }),
  getters: {},
  actions: {
    setTitle(title) {
      this.title = title;
    }
  }
});
