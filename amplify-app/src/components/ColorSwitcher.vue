<template>
  <div>
    <q-item>
      <q-item-section class="text-no-wrap">
        <q-input
          v-model="colorStore.primaryColor"
          :disable="colorStore.darkMode"
          :readonly="colorStore.darkMode"
          :rules="['anyColor']"
          :label="$t('primaryColor')"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="colorStore.primaryColor"></q-color>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <!--
    <q-item>
      <q-input
        filled
        v-model="colorStore.secondaryColor"
        :disable="colorStore.darkMode"
        :rules="['anyColor']"
        :label="$t('secondaryColor')"
      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-color v-model="colorStore.secondaryColor"></q-color>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-item>

    <q-item>
      <q-item-section class="text-no-wrap">
        <q-input
          filled
          v-model="colorStore.accentColor"
          :rules="['anyColor']"
          :label="$t('accentColor')"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="colorStore.accentColor"></q-color>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section class="text-no-wrap">
        <q-input
          filled
          v-model="colorStore.ctaColor"
          :label="$t('ctaColor')"
          :rules="['anyColor']"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-color v-model="colorStore.ctaColor"></q-color>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    -->
  </div>
</template>

<script  setup>
import { useColorStore } from "../stores/color.js";
const colorStore = useColorStore();
</script>

<style lang="scss">
</style>
