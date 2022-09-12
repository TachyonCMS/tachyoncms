<template>
  <q-select
    v-model="locale"
    :options="localeI18n"
    label="Language"
    dense
    borderless
    emit-value
    map-options
    options-dense
    :dark="i18nStore.darkMode"
    input-style="color: white"
  />
</template>

<script  setup>
import { watchEffect } from "vue";
import { useI18n } from "vue-i18n";

// Quasar language support
import { useQuasar } from "quasar";
const $q = useQuasar();
//import languages from 'quasar/lang/index.json';

import { useI18nStore } from "../stores/i18n.js";
const i18nStore = useI18nStore();

const { locale } = useI18n({ useScope: "global" });
locale.value = i18nStore.locale;

watchEffect(() => {
  console.log(locale);
  i18nStore.setLocale(locale.value);
  import(
    /* webpackInclude: /(es|en-US)\.js$/ */
    "../../node_modules/quasar/lang/" + locale.value + ".mjs"
  ).then((lang) => {
    console.log(lang);
    $q.lang.set(lang.default);
  });
});

const localeI18n = [
  { value: "en-US", label: "English" },
  { value: "es", label: "Español" },
];
</script>

<style>
</style>
