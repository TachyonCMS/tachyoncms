const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }]
  },

  {
    path: "/cms",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/cms/IndexPage.vue") }
    ],
    meta: { appDrawer: "EntryDrawer" }
  },

  {
    path: "/privacy",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/policy/PrivacyPage.vue") }
    ],
    meta: { appDrawer: "EntryDrawer" }
  },

  {
    path: "/terms-of-service",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/policy/TermsOfServicePage.vue")
      }
    ],
    meta: { appDrawer: "EntryDrawer" }
  },

  {
    path: "/data-deletion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/policy/DataDeletionPage.vue") }
    ],
    meta: { appDrawer: "EntryDrawer" }
  },

  {
    path: "/crime",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/policy/CrimePage.vue") }
    ],
    meta: { appDrawer: "EntryDrawer" }
  },

  {
    path: "/user",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/policy/CrimePage.vue") }
    ],
    meta: { appDrawer: "EntryDrawer", auth: true }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue")
  }
];

export default routes;
