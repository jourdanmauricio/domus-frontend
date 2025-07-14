import { API_ENDPOINTS } from '@/lib/constants';
import { Property } from '@/lib/types/properties';
import axios from 'axios';
import { z } from 'zod';
import { propertyFormSchema } from '@/lib/schemas/property';

export type CreatePropertyData = z.infer<typeof propertyFormSchema>;

export interface CreatePropertyResponse {
  id: string;
  message: string;
}

// Función para limpiar datos antes de enviar al backend
const cleanDataForBackend = (data: CreatePropertyData) => {
  const cleaned = { ...data };

  // Eliminar campos undefined, null o string vacío
  Object.keys(cleaned).forEach((key) => {
    const value = cleaned[key as keyof CreatePropertyData];
    if (value === undefined || value === null || value === '') {
      delete cleaned[key as keyof CreatePropertyData];
    }
  });

  // Limpiar campos anidados
  if (cleaned.address) {
    Object.keys(cleaned.address).forEach((key) => {
      const value = cleaned.address[key as keyof typeof cleaned.address];
      if (value === undefined || value === null || value === '') {
        delete cleaned.address[key as keyof typeof cleaned.address];
      }
    });

    // Limpiar city
    if (cleaned.address.city) {
      Object.keys(cleaned.address.city).forEach((key) => {
        const value = cleaned.address.city[key as keyof typeof cleaned.address.city];
        if (value === undefined || value === null || value === '') {
          delete cleaned.address.city[key as keyof typeof cleaned.address.city];
        }
      });

      // Limpiar province
      if (cleaned.address.city.province) {
        Object.keys(cleaned.address.city.province).forEach((key) => {
          const value =
            cleaned.address.city.province[key as keyof typeof cleaned.address.city.province];
          if (value === undefined || value === null || value === '') {
            delete cleaned.address.city.province[key as keyof typeof cleaned.address.city.province];
          }
        });
      }
    }

    // Limpiar postalCode
    if (cleaned.address.postalCode) {
      Object.keys(cleaned.address.postalCode).forEach((key) => {
        const value = cleaned.address.postalCode[key as keyof typeof cleaned.address.postalCode];
        if (value === undefined || value === null || value === '') {
          delete cleaned.address.postalCode[key as keyof typeof cleaned.address.postalCode];
        }
      });
    }
  }

  return cleaned;
};

const propertiesService = {
  async createProperty(data: CreatePropertyData): Promise<CreatePropertyResponse> {
    try {
      const cleanedData = cleanDataForBackend(data);
      console.log('Datos limpios para enviar:', JSON.stringify(cleanedData, null, 2));

      // Preparar datos para enviar al backend
      const dataToSend: any = {
        name: cleanedData.name,
        description: cleanedData.description,
        propertyType: cleanedData.propertyType,
        registryNumber: cleanedData.registryNumber,
        ownerIntention: cleanedData.ownerIntention,
        propertyCondition: cleanedData.propertyCondition,
        bathrooms: cleanedData.bathrooms,
        address: {
          street: cleanedData.address?.street,
          number: cleanedData.address?.number,
          cityId: cleanedData.address?.city?.id,
          postalCode: cleanedData.address?.postalCode?.code,
          // Usar coordenadas específicas de la dirección, o coordenadas de la ciudad como fallback
          latitude: cleanedData.address?.latitude || cleanedData.address?.city?.latitude || '0',
          longitude: cleanedData.address?.longitude || cleanedData.address?.city?.longitude || '0',
          apartment: cleanedData.address?.apartment || '',
          neighborhood: cleanedData.address?.neighborhood || '',
          nomenclator: cleanedData.address?.nomenclator || '',
        },
      };

      // Agregar campos opcionales si están presentes
      if (cleanedData.functionalUnit) dataToSend.functionalUnit = cleanedData.functionalUnit;
      if (cleanedData.commercialStatus) dataToSend.commercialStatus = cleanedData.commercialStatus;
      if (cleanedData.coveredMeters) dataToSend.coveredMeters = cleanedData.coveredMeters;
      if (cleanedData.uncoveredMeters) dataToSend.uncoveredMeters = cleanedData.uncoveredMeters;
      if (cleanedData.rooms) dataToSend.rooms = cleanedData.rooms;
      if (cleanedData.yearOfConstruction)
        dataToSend.yearOfConstruction = cleanedData.yearOfConstruction;
      if (cleanedData.electricityIdentifier)
        dataToSend.electricityIdentifier = cleanedData.electricityIdentifier;
      if (cleanedData.gasIdentifier) dataToSend.gasIdentifier = cleanedData.gasIdentifier;
      if (cleanedData.ABLIdentifier) dataToSend.ABLIdentifier = cleanedData.ABLIdentifier;
      if (cleanedData.administration) dataToSend.administration = cleanedData.administration;
      if (cleanedData.administrationPhone)
        dataToSend.administrationPhone = cleanedData.administrationPhone;
      if (cleanedData.administrationEmail)
        dataToSend.administrationEmail = cleanedData.administrationEmail;
      if (cleanedData.administrationAddress)
        dataToSend.administrationAddress = cleanedData.administrationAddress;
      if (cleanedData.ownerName) dataToSend.ownerName = cleanedData.ownerName;
      if (cleanedData.ownerPhone) dataToSend.ownerPhone = cleanedData.ownerPhone;
      if (cleanedData.ownerCBU) dataToSend.ownerCBU = cleanedData.ownerCBU;
      if (cleanedData.ownerAlias) dataToSend.ownerAlias = cleanedData.ownerAlias;
      if (cleanedData.hasExpenses !== undefined) dataToSend.hasExpenses = cleanedData.hasExpenses;
      if (cleanedData.hasExtraordinaryExpenses !== undefined)
        dataToSend.hasExtraordinaryExpenses = cleanedData.hasExtraordinaryExpenses;
      if (cleanedData.hasKitchen !== undefined) dataToSend.hasKitchen = cleanedData.hasKitchen;
      if (cleanedData.hasPatio !== undefined) dataToSend.hasPatio = cleanedData.hasPatio;
      if (cleanedData.hasBarbecue !== undefined) dataToSend.hasBarbecue = cleanedData.hasBarbecue;
      if (cleanedData.hasTerrace !== undefined) dataToSend.hasTerrace = cleanedData.hasTerrace;
      if (cleanedData.hasPool !== undefined) dataToSend.hasPool = cleanedData.hasPool;
      if (cleanedData.hasGarden !== undefined) dataToSend.hasGarden = cleanedData.hasGarden;
      if (cleanedData.hasBalcony !== undefined) dataToSend.hasBalcony = cleanedData.hasBalcony;
      if (cleanedData.hasFurnished !== undefined)
        dataToSend.hasFurnished = cleanedData.hasFurnished;
      if (cleanedData.servicesComment) dataToSend.servicesComment = cleanedData.servicesComment;
      if (cleanedData.hasZoom !== undefined) dataToSend.hasZoom = cleanedData.hasZoom;
      if (cleanedData.hasParking !== undefined) dataToSend.hasParking = cleanedData.hasParking;

      console.log('Datos finales para enviar:', JSON.stringify(dataToSend, null, 2));

      // Verificar si hay archivos para enviar
      const hasFiles =
        data.thumbnail ||
        (data.images && data.images.length > 0) ||
        (data.documents && data.documents.length > 0);

      if (hasFiles) {
        const formData = new FormData();

        // Agregar thumbnail si existe
        if (data.thumbnail) {
          formData.append('thumbnail', data.thumbnail);
        }

        // Agregar imágenes si existen
        if (data.images && data.images.length > 0) {
          data.images.forEach((image, index) => {
            formData.append(`images`, image);
          });
        }

        // Agregar documentos si existen
        if (data.documents && data.documents.length > 0) {
          data.documents.forEach((document, index) => {
            formData.append(`documents`, document);
          });
        }

        // Agregar los datos como JSON string en un campo 'data'
        formData.append('data', JSON.stringify(dataToSend));

        console.log('Enviando FormData con archivos y datos JSON');
        const response = await axios.post(API_ENDPOINTS.PROPERTIES, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // Si no hay archivos, enviar como JSON normal directamente
        console.log('Enviando JSON directamente como objeto');
        const response = await axios.post(
          API_ENDPOINTS.PROPERTIES,
          { data: dataToSend },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (axios.isAxiosError(error)) {
        console.error('Respuesta del servidor:', error.response?.data);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
      }
      throw error;
    }
  },

  async getProperties(): Promise<Property[]> {
    const response = await axios.get(API_ENDPOINTS.PROPERTIES);
    return response.data;
  },

  async getPropertyById(id: string): Promise<Property> {
    const response = await axios.get(`${API_ENDPOINTS.PROPERTIES}/${id}`);
    return response.data;
  },
};

export { propertiesService };
