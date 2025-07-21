import { z } from 'zod';
import { addressSchema } from './geography';

// Función helper para verificar si algo es un archivo de manera segura
const isFile = (item: any): boolean => {
  return (
    typeof window !== 'undefined' &&
    item &&
    typeof item === 'object' &&
    'name' in item &&
    'size' in item &&
    'type' in item &&
    typeof item.name === 'string' &&
    typeof item.size === 'number' &&
    typeof item.type === 'string'
  );
};

export const propertyFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  propertyType: z.string().min(1, 'El tipo de propiedad es requerido'),
  registryNumber: z.string().min(1, 'El número de registro es requerido'),
  functionalUnit: z.string().optional(),
  ownerIntention: z.string().min(1, 'La intención es requerida'),
  commercialStatus: z.string().optional(),
  propertyCondition: z.string().min(1, 'La condición es requerida'),
  thumbnail: z.union([z.custom<File>((val) => isFile(val)), z.string()]).optional(),
  images: z.array(z.union([z.custom<File>((val) => isFile(val)), z.string().min(1)])).optional(),
  documents: z.array(z.union([z.custom<File>((val) => isFile(val)), z.string().min(1)])).optional(),
  coveredMeters: z.string().min(1, 'Los metros cuadrados cubiertos son requeridos'),
  uncoveredMeters: z.string().min(1, 'Los metros cuadrados descubiertos son requeridos'),
  rooms: z.string().min(1, 'La cantidad de habitaciones es requerida'),
  bathrooms: z.string().min(1, 'La cantidad de baños es requerida'),
  yearOfConstruction: z.string().optional(),
  electricityIdentifier: z.string().optional(),
  gasIdentifier: z.string().optional(),
  ABLIdentifier: z.string().optional(),
  administration: z.string().optional(),
  administrationPhone: z.string().optional(),
  administrationEmail: z.string().optional(),
  administrationAddress: z.string().optional(),
  ownerName: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerCBU: z.string().optional(),
  ownerAlias: z.string().optional(),
  hasExpenses: z.boolean().optional(),
  hasExtraordinaryExpenses: z.boolean().optional(),
  hasKitchen: z.boolean().optional(),
  hasPatio: z.boolean().optional(),
  hasBarbecue: z.boolean().optional(),
  hasTerrace: z.boolean().optional(),
  hasPool: z.boolean().optional(),
  hasGarden: z.boolean().optional(),
  hasBalcony: z.boolean().optional(),
  hasFurnished: z.boolean().optional(),
  servicesComment: z.string().optional(),
  hasZoom: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  address: addressSchema,
});
