// constants/queryKeys.ts
export const QUERY_KEYS = {
  // Dashboard
  DASHBOARD: 'dashboard-data',
  GEOREF_ALL_CITIES: 'georef-all-cities',
  GEOREF_ALL_ADDRESSES: 'georef-all-addresses',

  // Users
  USERS: {
    ME: 'user-profile',
    PROFILE: 'user-profile',
    LIST: 'users-list',
    BY_ID: (id: string) => `user-${id}`,
  },

  // Properties (futuro)
  PROPERTIES: {
    LIST: 'properties-list',
    BY_ID: (id: string) => `property-${id}`,
    DETAILS: (id: string) => `property-details-${id}`,
  },

  // Posts (futuro)
  POSTS: {
    LIST: 'posts-list',
    BY_ID: (id: string) => `post-${id}`,
    DETAILS: (id: string) => `post-details-${id}`,
  },
} as const;
