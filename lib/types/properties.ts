import { OWNER_INTENTION_LIST, PROPERTY_TYPE_LIST } from '@/lib/constants/list';

export type PropertyType = (typeof PROPERTY_TYPE_LIST)[number]['id'];

export type OwnerIntention = (typeof OWNER_INTENTION_LIST)[number]['id'];

export interface Property {
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
}
