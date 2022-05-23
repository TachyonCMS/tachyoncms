const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },

  {
    path: "/flows",
    name: "flows",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [{ path: "", component: () => import("pages/flows/Flows.vue") }],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/flows/:flowId",
    name: "flow",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [{ path: "", component: () => import("pages/flows/Flow.vue") }],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/flows/:flowId/nuggets",
    name: "flowNuggets",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      { path: "", component: () => import("pages/flows/Nuggets.vue") },
    ],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/flows/:flowId/sequence",
    name: "FlowNuggetSequence",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      { path: "", component: () => import("pages/flows/Sequence.vue") },
    ],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/flows/:flowId/preview",
    name: "flowPreview",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      { path: "", component: () => import("pages/flows/PreviewFlow.vue") },
    ],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/flows/:flowId/published",
    name: "flowPublished",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      { path: "", component: () => import("pages/flows/PublishedFlow.vue") },
    ],
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/flow/:flowId",
    name: "published",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      { path: "", component: () => import("pages/flows/PublishedFlow.vue") },
    ],
    meta: {
      requiresAuth: false,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
