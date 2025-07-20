import { ProfileFormDataDto } from '@/components/profile/profile-form';
import { UserBackendDto } from '@/lib/types/users';
import { format } from 'date-fns';

export const userProfileMapperFront = (userProfile: UserBackendDto) => {
  return {
    firstName: userProfile.profile?.firstName || '',
    lastName: userProfile.profile?.lastName || '',
    dni: userProfile.profile?.dni || '',
    phone: userProfile.profile?.phone || '',
    birthDate: userProfile.profile?.birthDate ? userProfile.profile.birthDate : '',
    gender: userProfile.profile?.gender || '',
    nationality: userProfile.profile?.nationality || '',
    language: userProfile.profile?.language || '',
    bio: userProfile.profile?.bio || '',
    address: {
      city: {
        id: userProfile.profile?.address?.city?.id || '',
        name: userProfile.profile?.address?.city?.name || '',
        province: {
          id: userProfile.profile?.address?.city?.province?.id || '',
          name: userProfile.profile?.address?.city?.province?.name || '',
          latitude: userProfile.profile?.address?.city?.province?.latitude || '',
          longitude: userProfile.profile?.address?.city?.province?.longitude || '',
          defaultZoom: userProfile.profile?.address?.city?.province?.defaultZoom || 0,
        },
        latitude: userProfile.profile?.address?.city?.latitude || '',
        longitude: userProfile.profile?.address?.city?.longitude || '',
      },
      street: userProfile.profile?.address?.street || '',
      number: userProfile.profile?.address?.number || '',
      apartment: userProfile.profile?.address?.apartment || '',
      neighborhood: userProfile.profile?.address?.neighborhood || '',
      nomenclator: userProfile.profile?.address?.nomenclator || '',
      searchCity: '',
      postalCode: userProfile.profile?.address?.postalCode || '',
      latitude: userProfile.profile?.address?.latitude || '',
      longitude: userProfile.profile?.address?.longitude || '',
    },
  };
};

export const userProfileDefaultValues = {
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
  birthDate: '',
  gender: '',
  nationality: '',
  language: '',
  bio: '',
  address: {
    city: {
      id: '',
      name: '',
      province: {
        id: '',
        name: '',
      },
      latitude: '',
      longitude: '',
    },
    street: '',
    number: '',
    apartment: '',
    neighborhood: '',
    searchCity: '',
    postalCode: '',
    nomenclator: '',
    latitude: '',
    longitude: '',
  },
};

// Función auxiliar para verificar si hay datos de domicilio válidos
const hasValidAddressData = (address: ProfileFormDataDto['address']) => {
  return !!(
    address.street?.trim() ||
    address.number?.trim() ||
    address.apartment?.trim() ||
    address.neighborhood?.trim() ||
    address.city.id?.trim() ||
    address.postalCode?.trim() ||
    address.nomenclator?.trim() ||
    address.latitude?.trim() ||
    address.longitude?.trim()
  );
};

export const userProfileMapperBack = (data: ProfileFormDataDto) => {
  const baseData = {
    firstName: data.firstName,
    lastName: data.lastName,
    dni: data.dni,
    phone: data.phone,
    birthDate: data.birthDate ? format(new Date(data.birthDate), 'yyyy-MM-dd') : undefined,
    gender: data.gender ? data.gender : undefined,
    nationality: data.nationality ? data.nationality : undefined,
    language: data.language ? data.language : undefined,
    bio: data.bio ? data.bio : undefined,
  };

  // Solo incluir address si hay datos válidos
  if (hasValidAddressData(data.address)) {
    return {
      ...baseData,
      address: {
        street: data.address.street,
        number: data.address.number,
        apartment: data.address.apartment,
        neighborhood: data.address.neighborhood,
        cityId: data.address.city.id,
        postalCode: data.address.postalCode,
        nomenclator: data.address.nomenclator,
        latitude: data.address.latitude,
        longitude: data.address.longitude,
      },
    };
  }

  return baseData;
};
