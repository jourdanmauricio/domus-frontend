export type UserBackendDto = {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    avatarUrl: string | null;
    birthDate: string | null;
    gender: string;
    bio: string | null;
    nationality: string;
    language: string | null;
    address: {
      id: string;
      street: string;
      number: string;
      apartment: string;
      neighborhood: string | null;
      postalCode: string;
      latitude: string;
      longitude: string;
      nomenclator: string | null;
      city: {
        id: string;
        name: string;
        province: {
          id: string;
          name: string;
          latitude: string;
          longitude: string;
          defaultZoom: number;
        };
        latitude: string;
        longitude: string;
      };
    };
    themePreference: string | null;
  };
  roles: {
    id: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type UserSendProfileDto = {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  language?: string;
  bio?: string;
  address?: {
    street?: string;
    number?: string;
    apartment?: string;
    neighborhood?: string;
    cityId?: string;
    postalCode?: string;
    nomenclator?: string;
    latitude?: string;
    longitude?: string;
  };
};

export type UpdateUserPasswordDto = {
  password: string;
};
