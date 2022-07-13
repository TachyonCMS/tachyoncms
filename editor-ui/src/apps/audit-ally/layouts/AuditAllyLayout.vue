<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <span v-if="!securityConcern">{{ appName }}</span
          ><span v-if="securityConcern">
            {{ securityConcern.toUpperCase().replaceAll("_", " ") }}</span
          >
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn
          icon="mdi-close"
          round
          clickable
          v-ripple
          @click="onCloseAlly()"
          v-show="flowSource"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content - show the list of Security Concern Flows-->
      <q-scroll-area class="fit">
        <q-list>
          <q-item>
            <q-item-section class="justify-center text-center text-weight-bold"
              >Security Concerns</q-item-section
            >
          </q-item>
          <q-separator></q-separator>
          <div v-for="(menuItem, index) in menuList" :key="menuItem.label">
            <q-item
              :key="index"
              clickable
              v-ripple
              :to="
                '/audit-ally/' +
                menuItem.label.toLowerCase().replaceAll(' ', '_')
              "
            >
             <q-item-section avatar>
          <q-icon :color="menuItem.color" :name="menuItem.icon"></q-icon>
        </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator
              :key="'sep' + index"
              v-if="menuItem.separator"
            ></q-separator>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view @setDrawer="(event) => this.setLeftDrawer(event)" />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <div class="foot justify-center text-center">
        A service of <a href="https://www.tachyoncms.org/">TachyonCMS</a>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
// Vue 3 composition and reactive components
import { defineComponent, ref, computed, onMounted } from "vue";

// We use route in determining navigation options
import { useRoute } from "vue-router";

// Use Quasar for app notifications
import { useQuasar } from "quasar";

// The drawers

import useFlows from "../../../composables/useFlows";

export default defineComponent({
  name: "AuditAllyLayout",

  components: {},

  props: [],

  setup(props, ctx) {
    const route = useRoute();

    const { flowLoaded, destroy, flowSource } = useFlows();

    const securityConcern = computed(() => {
      return route.params.securityConcern
        ? route.params.securityConcern
        : false;
    });

    const leftDrawerOpen = ref(false);

    // $q is the standard convention for calling Quasar.
    // We use it display notification toast to the user.
    const $q = useQuasar();

    // Our App name for the toolbar
    const appName = "Audit Ally";

    const menuList = [
      {
        label: "Enterprise Assets",
        separator: true,
        icon: "mdi-city",
        color: "red-3"
      },
      {
        label: "Software Assets",
        separator: true,
                icon: "mdi-code-braces",
        color: "red-3"
      },
      {
        label: "Data Protection",
        separator: true,
        icon: "mdi-database",
        color: "red-3"
      },
      {
        label: "Secure Configuration",
        separator: true,
        icon: "mdi-cog",
        color: "red-3"
      },
      {
        label: "Account Management",
        separator: true,
        icon: "mdi-account",
        color: "red-3"
      },
      {
        label: "Access Control",
        separator: true,
        icon: "mdi-human",
        color: "red-3"
      },
      {
        label: "Vulnerability Management",
        separator: true,
        icon: "mdi-skull",
        color: "red-3"
      },
      {
        label: "Audit Logging",
        separator: true,
        icon: "mdi-math-log",
        color: "red-3"
      },
      {
        label: "Email and Web Browser",
        separator: true,
        icon: "mdi-email",
        color: "red-3"
      },
      {
        label: "Malware Protections",
        separator: true,
        icon: "mdi-shield-bug",
        color: "red-3"
      },
      {
        label: "Data Recovery",
        separator: true,
        icon: "mdi-backup-restore",
        color: "red-3"
      },
      {
        label: "Infrastructure Management",
        separator: true,
        icon: "mdi-lan",
        color: "red-3"
      },
      {
        label: "Network Monitoring ",
        separator: true,
        icon: "mdi-security-network",
        color: "red-3"
      },
      {
        label: "Security Training",
        separator: true,
        icon: "mdi-account-lock",
        color: "red-3"
      },
      {
        label: "Service Providers",
        separator: true,
        icon: "mdi-account-group",
        color: "red-3"
      },
      {
        label: "Software Security",
        separator: true,
        icon: "mdi-lock",
        color: "red-3"
      },
      {
        label: "Incident Response Management",
        separator: true,
        icon: "mdi-alarm-light",
        color: "red-3"
      },
      {
        label: "Penetration Testing",
        separator: true,
        icon: "mdi-fire",
        color: "red-3"
      },
    ];

    // Return the values we want to be available under `this.` after setup.
    return {
      appName,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      setLeftDrawer(value) {
        leftDrawerOpen.value = value;
      },
      menuList,
      securityConcern,
      flowLoaded,
      destroy,
      flowSource,
    };
  },

  methods: {
    // Display notification toast at bottom of screen
    onAppNotification(note) {
      const notification = {
        type: note.type,
        attrs: {
          // for the notification itself:
          role: "alertdialog",
        },
        actions: [
          {
            icon: "close",
            // for individual action (button):
            attrs: {
              "aria-label": "Dismiss",
            },
          },
        ],
        name: note.name,
        message: note.message,
      };
      this.$q.notify(notification);
    },
    onCloseAlly() {
      this.destroy();
      this.$router.push("/audit-ally");
    },
  },
});
</script>

<style scoped>
.foot a {
  color: white;
  text-decoration: none; /* no underline */
}

.foot a:visited {
  color: white;
}

.warn {
  color: red;
}
.warn a {
  color: red;
  text-decoration: none; /* no underline */
}

.warn a:visited {
  color: red;
}

.close-btn {
  color: primary;
  background-color: white;
}
</style>