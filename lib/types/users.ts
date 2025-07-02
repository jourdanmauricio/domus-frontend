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
            latitude: string;
            longitude: string;
        }
        themePreference: string | null;
    }
    roles: {
        id: string;
        name: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

