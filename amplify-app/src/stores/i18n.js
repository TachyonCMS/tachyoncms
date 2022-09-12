import { defineStore } from 'pinia';

import { useStorage } from '@vueuse/core';

export const useI18nStore = defineStore('i18n', {
  state: () => ({
    locale: useStorage('locale', 'en-US'),
  }),

  getters: {

  },

  actions: {
    setLocale(val) {
      this.locale = val;
    }
  }
});
