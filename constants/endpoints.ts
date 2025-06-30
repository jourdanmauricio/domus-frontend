// constants/endpoints.ts
export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD: "/api/dashboard",

  // Users
  USERS: {
    ME: "/api/users/me",
    PROFILE: "/api/users/profile",
    LIST: "/api/users",
    BY_ID: (id: string) => `/api/users/${id}`,
  },

  // Properties (futuro)
  PROPERTIES: {
    LIST: "/api/properties",
    BY_ID: (id: string) => `/api/properties/${id}`,
    CREATE: "/api/properties",
    UPDATE: (id: string) => `/api/properties/${id}`,
    DELETE: (id: string) => `/api/properties/${id}`,
  },

  // Posts (futuro)
  POSTS: {
    LIST: "/api/posts",
    BY_ID: (id: string) => `/api/posts/${id}`,
    CREATE: "/api/posts",
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
  },
} as const;
