// constants/endpoints.ts
export const API_ENDPOINTS = {
  // Dashboard

  ME: '/api/users/me',
  CHANGE_PASSWORD: '/api/users/me/password',
  AVATAR: '/api/users/me/avatar',
  USERS: '/api/users',
  PROVINCES: '/api/geography/provinces',
  CITIES: '/api/geography/provinces/:provinceId/cities',
  ADD_CITY: '/api/geography/cities',
  ALL_CITIES: '/api/geography/cities',
} as const;

// Helper function para endpoints dinámicos
export const buildEndpoint = (endpoint: string, params: Record<string, string>) => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  return url;
};
