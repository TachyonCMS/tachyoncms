const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
    meta: {
      drawer: "Flows",
      requiresAuth: false,
    },
  },

  {
    path: "/flows",
    name: "flows",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [{ path: "", component: () => import("pages/flows/Flows.vue") }],
    meta: {
      drawer: "Flows",
      requiresAuth: true,
    },
  },

  {
    path: "/flows/:flowId",
    name: "flow",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [{ path: "", component: () => import("pages/flows/Flow.vue") }],
    meta: {
      drawer: "Flows",
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
      drawer: "Flows",
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
      drawer: "Flows",
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
      drawer: "Flows",
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
      drawer: "Flows",
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
      drawer: "Flows",
      requiresAuth: false,
    },
  },

  {
    path: "/labs/block-builder/:blockType",
    name: "block-factory",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/flows/BlockBuilder.vue"),
      },
    ],
    meta: {
      drawer: "Flows",
      requiresAuth: false,
    },
  },

  {
    path: "/spring",
    name: "spring",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/flows/Spring.vue"),
      },
    ],
    meta: {
      drawer: "Flows",
      requiresAuth: false,
    },
  },

  {
    path: "/editor",
    name: "editorjs",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/EditorJs.vue"),
      },
    ],
    meta: {
      drawer: "Flows",
      requiresAuth: false,
    },
  },

  {
    path: "/pack-track",
    name: "pack-track",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/pack-track/Home.vue"),
      },
    ],
    meta: {
      drawer: "PackTrack",
    },
  },

  {
    path: "/pack-track/storage",
    name: "pack-track-storage",
    component: () => import("src/layouts/FlowsLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/pack-track/Items.vue"),
      },
    ],
    meta: {
      drawer: "PackTrack",
    },
  },

  {
    path: "/audit-ally",
    component: () => import("src/layouts/AuditAllyLayout.vue"),
    children: [
      { path: "", component: () => import("pages/audit-ally/Index.vue") },
    ],
  },

  {
    path: "/audit-ally/:securityConcern",
    component: () => import("src/layouts/AuditAllyLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/audit-ally/SecurityConcern.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
