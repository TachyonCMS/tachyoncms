const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
    meta: { appDrawer: "MainDrawer" }
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
    path: "/user/profile",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/user/ProfilePage.vue") }
    ],
    meta: { appDrawer: "EntryDrawer", requiresAuth: true }
  },
  {
    path: "/user/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/user/DashboardPage.vue") }
    ],
    meta: { appDrawer: "EntryDrawer", requiresAuth: true }
  },
  /**
  {
    path: "/auth",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/AuthPage.vue") }
    ],
    meta: { appDrawer: "BenefitsDrawer" }
  },
 */
  {
    path: "/auth/login",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/AuthPage.vue") }
    ],
    meta: { appDrawer: "BenefitsDrawer" }
  },

  {
    path: "/auth/signup",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/AuthPage.vue") }
    ],
    meta: { appDrawer: "BenefitsDrawer" }
  },

  {
    path: "/auth/logout",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/LogoutPage.vue") }
    ],
    meta: { appDrawer: "BenefitsDrawer" }
  },

  {
    path: "/auth/password_reset",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/PasswordResetPage.vue") }
    ],
    meta: { appDrawer: "BenefitsDrawer" }
  },

  {
    path: "/auth/change_password",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/ChangePasswordPage.vue") }
    ],
    meta: { appDrawer: "BenefitsDrawer" }
  },

  {
    path: "/auth/signup/confirm",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/ConfirmSignUpPage.vue") }
    ],
    meta: { appDrawer: "BenefitsDrawer" }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue")
  }
];

export default routes;
