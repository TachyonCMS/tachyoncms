<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="on-primary">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ layoutStore.title }}
        </q-toolbar-title>
        <q-btn-dropdown dropdown-icon="mdi-cog" size="sm" class="q-px-sm">
          <q-list bordered padding>
            <q-item-label header>{{ $t("customize") }}</q-item-label>
            <q-item>
              <q-item-section class="text-no-wrap">
                <LanguageSwitcher></LanguageSwitcher>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section class="text-no-wrap">
                <q-toggle
                  v-model="colorStore.darkMode"
                  color="$primary"
                  :label="$t('darkMode')"
                  left-label
                  size="sm"
                ></q-toggle>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-no-wrap">
                <ColorSwitcher></ColorSwitcher>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-drawer on-drawer"
    >
      <MainDrawer
        v-if="route.meta.appDrawer == 'MainDrawer'"
        class="bg-drawer-paper on-drawer-paper"
      ></MainDrawer>
      <EntryDrawer
        v-if="route.meta.appDrawer == 'EntryDrawer'"
        class="bg-drawer-paper on-drawer-paper"
      ></EntryDrawer>
    </q-drawer>

    <q-page-container class="bg-card-surround">
      <!--{{ basePrimaryColor }} {{ baseSecondaryColor }}
      {{ colorStore.primaryColor }} {{ colorStore.secondaryColor }} -->
      <router-view @notification="(event) => displayNotification(event)" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, watchEffect, computed } from "vue";
import { useQuasar, setCssVar, colors } from "quasar";
const $q = useQuasar();
const { getPaletteColor, lighten, brightness } = colors;
// CTA color
const ctaColor = ref(null);

// LAYOUT Store info about the layout
import { useLayoutStore } from "../stores/layout";
const layoutStore = useLayoutStore();

// I18N Store, info about the visitors selected language options
import { useI18nStore } from "../stores/i18n";
const i18nStore = useI18nStore();

// RegEx for validating hex color codes
const hexReg = /^#([0-9a-f]{3}){1,2}$/i;

// COLORS Store, info about the visitors selected color options
import { useColorStore } from "../stores/color";
const colorStore = useColorStore();

// LOCALIZATION
import messages from "src/i18n";
import { useI18n } from "vue-i18n";
const { locale } = useI18n({ useScope: "global" });
locale.value = i18nStore.locale;
const { t } = useI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: i18nStore.locale,
  fallbackLocale: "en-US",
  messages,
});

// NOTIFICATIONS
// Map internal notification statuses to Quasar notify types
const notifyTypeMap = {
  error: {
    qType: "negative",
    labelCode: "error",
  },
  warning: {
    qType: "warning",
    labelCode: "warning",
  },
  info: {
    qType: "info",
    labelCode: "info",
  },
  positive: {
    qType: "positive",
    labelCode: "success",
  },
  negative: {
    qType: "negative",
    labelCode: "sorry",
  },
};

// The value defined in quasar.variables.scss
const basePrimaryColor = getPaletteColor("primary");
const baseSecondaryColor = getPaletteColor("secondary");
const baseAccentColor = getPaletteColor("accent");

// COLOR DEFINITIONS

// Calculate default primary shades
const dk5 = ref(lighten(basePrimaryColor, -65));
const dk4 = ref(lighten(basePrimaryColor, -50));
const dk3 = ref(lighten(basePrimaryColor, -35));
const dk2 = ref(lighten(basePrimaryColor, -20));
const dk1 = ref(lighten(basePrimaryColor, -10));
const lt5 = ref(lighten(basePrimaryColor, 65));
const lt4 = ref(lighten(basePrimaryColor, 50));
const lt3 = ref(lighten(basePrimaryColor, 35));
const lt2 = ref(lighten(basePrimaryColor, 20));
const lt1 = ref(lighten(basePrimaryColor, 10));

// Calculate default secondary shades
const sdk5 = ref(lighten(baseSecondaryColor, -65));
const sdk4 = ref(lighten(baseSecondaryColor, -50));
const sdk3 = ref(lighten(baseSecondaryColor, -35));
const sdk2 = ref(lighten(baseSecondaryColor, -20));
const sdk1 = ref(lighten(baseSecondaryColor, -10));
const slt5 = ref(lighten(baseSecondaryColor, 65));
const slt4 = ref(lighten(baseSecondaryColor, 50));
const slt3 = ref(lighten(baseSecondaryColor, 35));
const slt2 = ref(lighten(baseSecondaryColor, 20));
const slt1 = ref(lighten(baseSecondaryColor, 10));

// Primary card colors
const cardPaper = ref(lighten(basePrimaryColor, 92));
const cardSurround = ref(lighten(basePrimaryColor, 80));
// Secondary card colors
const scardPaper = ref(lighten(baseSecondaryColor, 92));
const scardSurround = ref(lighten(baseSecondaryColor, 80));

const lightText = "#FFF";
const darkText = "#000";

const onPrimary = ref(lightText);
const onSecondary = ref(lightText);
const onAccent = ref(lightText);
const onCta = ref(lightText);
const onCardPaper = ref(darkText);
const onCardSurround = ref(darkText);
const onScardPaper = ref(darkText);
const onScardSurround = ref(darkText);

const onDk5 = ref(lightText);
const onDk4 = ref(lightText);
const onDk3 = ref(lightText);
const onDk2 = ref(lightText);
const onDk1 = ref(lightText);
const onLt5 = ref(darkText);
const onLt4 = ref(darkText);
const onLt3 = ref(darkText);
const onLt2 = ref(lightText);
const onLt1 = ref(lightText);

const onSdk5 = ref(lightText);
const onSdk4 = ref(lightText);
const onSdk3 = ref(lightText);
const onSdk2 = ref(lightText);
const onSdk1 = ref(lightText);
const onSlt5 = ref(darkText);
const onSlt4 = ref(darkText);
const onSlt3 = ref(darkText);
const onSlt2 = ref(lightText);
const onSlt1 = ref(lightText);

const drawerColor = ref(lighten(basePrimaryColor, -30));
const drawerPaper = ref(lighten(basePrimaryColor, -70));
const onDrawerColor = ref(lightText);
const onDrawerPaper = ref(darkText);

// Change the primary color and shades
const setPrimaryColor = (hexCode) => {
  console.log(hexCode);
  setCssVar("primary", hexCode, document.documentElement);
  dk5.value = lighten(hexCode, -65);
  dk4.value = lighten(hexCode, -50);
  dk3.value = lighten(hexCode, -35);
  dk2.value = lighten(hexCode, -20);
  dk1.value = lighten(hexCode, -10);
  lt5.value = lighten(hexCode, 65);
  lt4.value = lighten(hexCode, 50);
  lt3.value = lighten(hexCode, 35);
  lt2.value = lighten(hexCode, 20);
  lt1.value = lighten(hexCode, 10);

  onPrimary.value = brightness(hexCode) > 128 ? darkText : lightText;

  onDk5.value = brightness(dk5.value) > 128 ? darkText : lightText;
  onDk4.value = brightness(dk4.value) > 128 ? darkText : lightText;
  onDk3.value = brightness(dk3.value) > 128 ? darkText : lightText;
  onDk2.value = brightness(dk2.value) > 128 ? darkText : lightText;
  onDk1.value = brightness(dk1.value) > 128 ? darkText : lightText;
  onLt5.value = brightness(lt5.value) > 128 ? darkText : lightText;
  onLt4.value = brightness(lt4.value) > 128 ? darkText : lightText;
  onLt3.value = brightness(lt3.value) > 128 ? darkText : lightText;
  onLt2.value = brightness(lt2.value) > 128 ? darkText : lightText;
  onLt1.value = brightness(lt1.value) > 128 ? darkText : lightText;

  if (colorStore.darkMode) {
    cardPaper.value = lighten(hexCode, -30);
    cardSurround.value = lighten(hexCode, -55);

    onCardPaper.value =
      brightness(cardPaper.value) > 128 ? darkText : lightText;
    onCardSurround.value =
      brightness(cardSurround.value) > 128 ? darkText : lightText;

    drawerColor.value = lighten(hexCode, -75);
    console.log("DRAWER: " + drawerColor.value);
    onDrawerColor.value =
      brightness(drawerColor.value) > 128 ? darkText : lightText;
    drawerPaper.value = lighten(hexCode, -65);
    onDrawerPaper.value =
      brightness(drawerPaper.value) > 128 ? darkText : lightText;
  } else {
    cardPaper.value = lighten(hexCode, 92);
    cardSurround.value = lighten(hexCode, 80);

    onCardPaper.value =
      brightness(cardPaper.value) > 128 ? darkText : lightText;
    onCardSurround.value =
      brightness(cardSurround.value) > 128 ? darkText : lightText;

    drawerColor.value = lighten(hexCode, 70);
    console.log("DRAWER: " + drawerColor.value);
    onDrawerColor.value =
      brightness(drawerColor.value) > 128 ? darkText : lightText;
    drawerPaper.value = lighten(hexCode, 73);
    onDrawerPaper.value =
      brightness(drawerPaper.value) > 128 ? darkText : lightText;
  }
};

// Change the secondary color and shades
const setSecondaryColor = (hexCode) => {
  setCssVar("secondary", hexCode, document.documentElement);
  sdk5.value = lighten(hexCode, -65);
  sdk4.value = lighten(hexCode, -50);
  sdk3.value = lighten(hexCode, -35);
  sdk2.value = lighten(hexCode, -20);
  sdk1.value = lighten(hexCode, -10);
  slt5.value = lighten(hexCode, 65);
  slt4.value = lighten(hexCode, 50);
  slt3.value = lighten(hexCode, 35);
  slt2.value = lighten(hexCode, 20);
  slt1.value = lighten(hexCode, 10);

  onSecondary.value = brightness(hexCode) > 128 ? darkText : lightText;

  onSdk5.value = brightness(sdk5.value) > 128 ? darkText : lightText;
  onSdk4.value = brightness(sdk4.value) > 128 ? darkText : lightText;
  onSdk3.value = brightness(sdk3.value) > 128 ? darkText : lightText;
  onSdk2.value = brightness(sdk2.value) > 128 ? darkText : lightText;
  onSdk1.value = brightness(sdk1.value) > 128 ? darkText : lightText;
  onSlt5.value = brightness(slt5.value) > 128 ? darkText : lightText;
  onSlt4.value = brightness(slt4.value) > 128 ? darkText : lightText;
  onSlt3.value = brightness(slt3.value) > 128 ? darkText : lightText;
  onSlt2.value = brightness(slt2.value) > 128 ? darkText : lightText;
  onSlt1.value = brightness(slt1.value) > 128 ? darkText : lightText;

  if (colorStore.darkMode) {
    scardPaper.value = lighten(hexCode, -30);
    scardSurround.value = lighten(hexCode, -55);

    onScardPaper.value =
      brightness(scardPaper.value) > 128 ? darkText : lightText;
    onScardSurround.value =
      brightness(scardSurround.value) > 128 ? darkText : lightText;
  } else {
    scardPaper.value = lighten(hexCode, 92);
    scardSurround.value = lighten(hexCode, 80);

    onScardPaper.value =
      brightness(scardPaper.value) > 128 ? darkText : lightText;
    onScardSurround.value =
      brightness(scardSurround.value) > 128 ? darkText : lightText;
  }
};

if (!colorStore.primaryColor) {
  colorStore.setPrimaryColor(basePrimaryColor);
} else {
  console.log(colorStore.primaryColor);
  setPrimaryColor(colorStore.primaryColor);
}
if (!colorStore.secondaryColor) {
  colorStore.setSecondaryColor(baseSecondaryColor);
} else {
  console.log(colorStore.secondaryColor);
  setSecondaryColor(colorStore.secondaryColor);
}
if (!colorStore.accentColor) {
  colorStore.setAccentColor(baseAccentColor);
}
// DARK MODE - Enable Quasar dark mode toggling

const setColors = () => {
  if (colorStore.darkMode) {
    console.log("turning dark");
    setPrimaryColor("#383838");
    setSecondaryColor("#696969");
  } else {
    console.log("turning light: " + colorStore.primaryColor);
    setPrimaryColor(colorStore.primaryColor);
    setSecondaryColor(colorStore.secondaryColor);
  }
  $q.dark.set(colorStore.darkMode);
};

setColors();

// Update navbar in dark mode
watch(
  () => colorStore.darkMode,
  (currentValue, oldValue) => {
    console.log(currentValue);
    console.log(oldValue);
    if (currentValue != oldValue) {
      if (colorStore.darkMode) {
        console.log("turning dark");
        setPrimaryColor("#383838");
        setSecondaryColor("#696969");
      } else {
        console.log("turning light: " + colorStore.primaryColor);
        setPrimaryColor(colorStore.primaryColor);
        setSecondaryColor(colorStore.secondaryColor);
      }
      $q.dark.set(colorStore.darkMode);
    }
  }
);

const displayNotification = async (notification) => {
  const msg =
    '<span class="text-h6">' +
    t(notifyTypeMap[notification.type].labelCode) +
    "</span><br />" +
    notification.message;
  $q.notify({
    message: msg,
    multiLine: true,
    position: notification.position,
    type: notifyTypeMap[notification.type].qType,
    html: true,
    //closeBtn: true,
    actions: [
      {
        label: t("close"),
        handler: () => {
          // notificationsStore.delete(notification.id);
        },
      },
    ],
  });
};
// DRAWER
import { useRoute } from "vue-router";
// Potential left drawer content
import MainDrawer from "./drawers/MainDrawer.vue";
import EntryDrawer from "./drawers/EntryDrawer.vue";
const route = useRoute();
console.log(route.meta.appDrawer);
// Mange left drawer state
const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// I18N - Allow choosing an App UI language, content language MAY NOT be affected.
import LanguageSwitcher from "components/LanguageSwitcher.vue";

// Change the secondary color and shades
const setAccentColor = (hexCode) => {
  setCssVar("accent", hexCode, document.documentElement);
  onAccent.value = brightness(hexCode) > 128 ? darkText : lightText;
  console.log("ACCENT: " + hexCode);
  console.log(onAccent.value);
};

// Change the secondary color and shades
const setCtaColor = (hexCode) => {
  colorStore.setCtaColor(hexCode);
  setCssVar("cta", hexCode, document.documentElement);
  ctaColor.value = hexCode;
  onCta.value = brightness(hexCode) > 128 ? darkText : lightText;
};

// COLORS CURRENT
const currPrimaryColor = computed(() => {
  console.log(colorStore.primaryColor);
  console.log(basePrimaryColor);
  return colorStore.primaryColor ? colorStore.primaryColor : basePrimaryColor;
});
const currSecondaryColor = computed(() => {
  return colorStore.secondaryColor
    ? colorStore.secondaryColor
    : baseSecondaryColor;
});
const currAccentColor = computed(() => {
  return colorStore.accentColor ? colorStore.accentColor : baseAccentColor;
});
const currCtaColor = computed(() => {
  return colorStore.ctaColor ? colorStore.ctaColor : "#F00";
});

console.log("Dynamic Primary Color: " + currPrimaryColor.value);

// COLORS SWITCHER- Allow choosing app colors
import ColorSwitcher from "components/ColorSwitcher.vue";

watch(
  () => colorStore.primaryColor,
  (currentValue, oldValue) => {
    setPrimaryColor(currentValue);
  }
);
watch(
  () => colorStore.secondaryColor,
  (currentValue, oldValue) => {
    setSecondaryColor(currentValue);
  }
);

watchEffect(() => {
  if (hexReg.test(currAccentColor.value)) {
    setAccentColor(currAccentColor.value);
  }
});

watchEffect(() => {
  if (hexReg.test(currCtaColor.value)) {
    setCtaColor(currCtaColor.value);
  }
});

//const setShades(type, hexColor) =
</script>


<style lang="scss">
// TEXT COLOR USED ON BACKGROUND
.on-primary {
  color: v-bind("onPrimary");
}
.on-secondary {
  color: v-bind("onSecondary");
}
.on-accent {
  color: v-bind("onAccent");
}
.on-cta {
  color: v-bind("onCta");
}

.on-drawer {
  color: v-bind("onDrawerColor");
}

.on-drawer-paper {
  color: v-bind("onDrawerPaper");
}

.on-dk5 {
  color: v-bind("onDk5");
}
.on-dk4 {
  color: v-bind("onDk4");
}
.on-dk3 {
  color: v-bind("onDk3");
}
.on-dk2 {
  color: v-bind("onDk2");
}
.on-dk1 {
  color: v-bind("onDk1");
}
.on-lt5 {
  color: v-bind("onLt5");
}
.on-lt4 {
  color: v-bind("onLt4");
}
.on-lt3 {
  color: v-bind("onLt3");
}
.on-lt2 {
  color: v-bind("onLt2");
}
.on-lt1 {
  color: v-bind("onLt1");
}

.on-sdk5 {
  color: v-bind("onSdk5");
}
.on-sdk4 {
  color: v-bind("onSdk4");
}
.on-sdk3 {
  color: v-bind("onSdk3");
}
.on-sdk2 {
  color: v-bind("onSdk2");
}
.on-sdk1 {
  color: v-bind("onSdk1");
}
.on-slt5 {
  color: v-bind("onSlt5");
}
.on-slt4 {
  color: v-bind("onSlt4");
}
.on-slt3 {
  color: v-bind("onSlt3");
}
.on-slt2 {
  color: v-bind("onSlt2");
}
.on-slt1 {
  color: v-bind("onSlt1");
}

// BACKGROUND COLOR
.bg-drawer {
  background-color: v-bind("drawerColor");
}

.bg-drawer-paper {
  background-color: v-bind("drawerPaper");
}
.bg-card-paper {
  background-color: v-bind("cardPaper");
}
.bg-card-surround {
  background-color: v-bind("cardSurround");
}
.bg-scard-paper {
  background-color: v-bind("scardPaper");
}
.bg-scard-surround {
  background-color: v-bind("scardSurround");
}
// CTA Color
.bg-cta {
  background-color: v-bind("ctaColor");
}
.bg-accent {
  background-color: v-bind("accentColor");
}
// Primary Dark
.bg-dk5 {
  background-color: v-bind("dk5");
}
.bg-dk4 {
  background-color: v-bind("dk4");
}
.bg-dk3 {
  background-color: v-bind("dk3");
}
.bg-dk2 {
  background-color: v-bind("dk2");
}
.bg-dk1 {
  background-color: v-bind("dk1");
}
// Primary Light
.bg-lt5 {
  background-color: v-bind("lt5");
}
.bg-lt4 {
  background-color: v-bind("lt4");
}
.bg-lt3 {
  background-color: v-bind("lt3");
}
.bg-lt2 {
  background-color: v-bind("lt2");
}
.bg-lt1 {
  background-color: v-bind("lt1");
}
// Secondary Dark
.bg-sdk5 {
  background-color: v-bind("sdk5");
}
.bg-sdk4 {
  background-color: v-bind("sdk4");
}
.bg-sdk3 {
  background-color: v-bind("sdk3");
}
.bg-sdk2 {
  background-color: v-bind("sdk2");
}
.bg-sdk1 {
  background-color: v-bind("sdk1");
}
// Secondary light
.bg-slt5 {
  background-color: v-bind("slt5");
}
.bg-slt4 {
  background-color: v-bind("slt4");
}
.bg-slt3 {
  background-color: v-bind("slt3");
}
.bg-slt2 {
  background-color: v-bind("slt2");
}
.bg-slt1 {
  background-color: v-bind("slt1");
}

// TEXT COLOR
// CTA Color
.text-cta {
  background-color: v-bind("ctaColor");
}
.text-dk5 {
  background-color: v-bind("dk5");
}
.text-dk4 {
  background-color: v-bind("dk4");
}
.text-dk3 {
  background-color: v-bind("dk3");
}
.text-dk2 {
  background-color: v-bind("dk2");
}
.text-dk1 {
  background-color: v-bind("dk1");
}
.text-lt5 {
  background-color: v-bind("lt5");
}
.text-lt4 {
  background-color: v-bind("lt4");
}
.text-lt3 {
  background-color: v-bind("lt3");
}
.text-lt2 {
  background-color: v-bind("lt2");
}
.text-lt1 {
  background-color: v-bind("lt1");
}

.text-sdk5 {
  background-color: v-bind("sdk5");
}
.text-sdk4 {
  background-color: v-bind("sdk4");
}
.text-sdk3 {
  background-color: v-bind("sdk3");
}
.text-sdk2 {
  background-color: v-bind("sdk2");
}
.text-sdk1 {
  background-color: v-bind("sdk1");
}
.text-slt5 {
  background-color: v-bind("slt5");
}
.text-slt4 {
  background-color: v-bind("slt4");
}
.text-slt3 {
  background-color: v-bind("slt3");
}
.text-slt2 {
  background-color: v-bind("slt2");
}
.text-slt1 {
  background-color: v-bind("slt1");
}
</style>
