import { OWNER_INTENTION_LIST, PROPERTY_TYPE_LIST } from '@/lib/constants/list';
import { AddressBackendDto } from '@/lib/types/geography';

export type PropertyType = (typeof PROPERTY_TYPE_LIST)[number]['id'];

export type OwnerIntention = (typeof OWNER_INTENTION_LIST)[number]['id'];

export type Property = {
  // Información básica
  id: string;
  name: string;
  propertyType: PropertyType;
  description: string;
  registryNumber: string;
  functionalUnit: string;

  // Estados
  ownerIntention: OwnerIntention;
  commercialStatus: 'available' | 'rented' | 'sold';
  propertyCondition: 'needs_renovation' | 'good' | 'very_good' | 'excellent';

  // Owner
  ownerId: string;
  ownerName: string;

  // Dirección
  address: {
    street: string;
    number: string;
    apartment: string;
    neighborhood?: string;
    cityId: string;
    postalCode: string;
    nomenclator: string;
    latitude: string;
    longitude: string;
  };
};

export type PropertyBackendDto = {
  // Información básica
  ABLIdentifier: string;
  address: AddressBackendDto;
  addressId: string;
  administration: string;
  administrationAddress: string;
  administrationEmail: string;
  administrationPhone: string;
  bathrooms: number;
  commercialStatus: string;
  coveredMeters: number;
  description: string;
  documents: string[];
  electricityIdentifier: string;
  functionalUnit: string;
  gasIdentifier: string;
  hasBalcony: boolean;
  hasBarbecue: boolean;
  hasExpenses: boolean;
  hasExtraordinaryExpenses: boolean;
  hasFurnished: boolean;
  hasGarden: boolean;
  hasKitchen: boolean;
  hasParking: boolean;
  hasPatio: boolean;
  hasPool: boolean;
  hasTerrace: boolean;
  hasZoom: boolean;
  id: string;
  images: string[];
  name: string;
  ownerAlias: string;
  ownerCBU: string;
  ownerIntention: string;
  ownerName: string;
  ownerPhone: string;
  propertyCondition: string;
  propertyType: string;
  registryNumber: string;
  rooms: number;
  servicesComment: string;
  thumbnail: string;
  uncoveredMeters: number;
  yearOfConstruction: number;
};
