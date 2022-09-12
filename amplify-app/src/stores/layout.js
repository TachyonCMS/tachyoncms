import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    title: 'Tachyon App',
  }),
  getters: {},
  actions: {
    setTitle(title) {
      this.title = title;
    },

  }
});
