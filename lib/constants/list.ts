export const GENDER_LIST = [
  { id: 'male', name: 'Masculino' },
  { id: 'female', name: 'Femenino' },
  { id: 'other', name: 'Otro' },
];

export const NATIONALITY_LIST = [
  { id: 'argentina', name: 'Argentina' },
  { id: 'chile', name: 'Chile' },
  { id: 'uruguay', name: 'Uruguay' },
  { id: 'paraguay', name: 'Paraguay' },
  { id: 'bolivia', name: 'Bolivia' },
];

export const LANGUAGE_LIST = [
  { id: 'español', name: 'Español' },
  { id: 'inglés', name: 'Inglés' },
  { id: 'francés', name: 'Francés' },
  { id: 'alemán', name: 'Alemán' },
];

export const PROPERTY_TYPE_LIST = [
  { id: 'house', name: 'Casa' },
  { id: 'ph', name: 'Ph' },
  { id: 'apartment', name: 'Departamento' },
  { id: 'office', name: 'Oficina' },
  { id: 'local', name: 'Local Comercial' },
  { id: 'land', name: 'Terreno' },
  { id: 'farmland', name: 'Campo' },
  { id: 'garage', name: 'Cochera' },
  { id: 'other', name: 'Otro' },
] as const;

// Enum para usar como constantes en el código
export enum PropertyTypeEnum {
  HOUSE = 'house',
  PH = 'ph',
  APARTMENT = 'apartment',
  OFFICE = 'office',
  LOCAL = 'local',
  LAND = 'land',
  FARMLAND = 'farmland',
  GARAGE = 'garage',
  OTHER = 'other',
}

// Tipo TypeScript basado en el enum
export type PropertyType = PropertyTypeEnum;

export const OWNER_INTENTION_LIST = [
  { name: 'Alquilar', id: 'rent' },
  { name: 'Vender', id: 'sale' },
  { name: 'Alquilar y Vender', id: 'both' },
];

// Enum para OwnerIntention
export enum OwnerIntentionEnum {
  RENT = 'rent',
  SALE = 'sale',
  BOTH = 'both',
}

// Tipo TypeScript basado en el enum
export type OwnerIntention = OwnerIntentionEnum;

export const PROPERTY_CONDITION_LIST = [
  { id: 'needs_renovation', name: 'A Renovar' },
  { id: 'good', name: 'Bueno' },
  { id: 'very_good', name: 'Muy Bueno' },
  { id: 'excellent', name: 'Excelente' },
];

// Enum para PropertyCondition
export enum PropertyConditionEnum {
  NEEDS_RENOVATION = 'needs_renovation',
  GOOD = 'good',
  VERY_GOOD = 'very_good',
  EXCELLENT = 'excellent',
}

// Tipo TypeScript basado en el enum
export type PropertyCondition = PropertyConditionEnum;
