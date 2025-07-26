import { API_ENDPOINTS } from '@/lib/constants';
import { Property, PropertyBackendDto } from '@/lib/types/properties';
import axiosInstance from '@/lib/utils/axios-config'; // Usar axiosInstance
import { z } from 'zod';
import { propertyFormSchema } from '@/lib/schemas/property';

export type CreatePropertyData = z.infer<typeof propertyFormSchema>;

export type UpdatePropertyData = CreatePropertyData & {
  id: string;
};

export interface CreatePropertyResponse {
  id: string;
  message: string;
}

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

  // Limpiar arrays de imágenes y documentos
  if (cleaned.images && Array.isArray(cleaned.images)) {
    cleaned.images = cleaned.images.filter(
      (item) =>
        item !== null &&
        item !== undefined &&
        item !== '' &&
        (typeof item === 'string' || isFile(item)) &&
        !(typeof item === 'object' && Object.keys(item).length === 0)
    );
  }

  if (cleaned.documents && Array.isArray(cleaned.documents)) {
    cleaned.documents = cleaned.documents.filter(
      (item) =>
        item !== null &&
        item !== undefined &&
        item !== '' &&
        (typeof item === 'string' || isFile(item)) &&
        !(typeof item === 'object' && Object.keys(item).length === 0)
    );
  }

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
        const value = cleaned.address.postalCode![key as keyof typeof cleaned.address.postalCode];
        if (value === undefined || value === null || value === '') {
          (cleaned.address.postalCode as any)[key] = undefined;
        }
      });
    }
  }

  return cleaned;
};

// Función para separar archivos físicos de URLs
const separateFilesFromUrls = (data: CreatePropertyData) => {
  const files = {
    thumbnail: null as File | null,
    images: [] as File[],
    documents: [] as File[],
  };

  const dataForBackend = { ...data };

  // Separar thumbnail
  if (isFile(data.thumbnail)) {
    files.thumbnail = data.thumbnail as File;
    delete dataForBackend.thumbnail;
  }

  // Separar imágenes
  if (data.images && Array.isArray(data.images)) {
    const imageFiles: File[] = [];
    const imageUrls: string[] = [];

    data.images.forEach((item) => {
      if (isFile(item)) {
        imageFiles.push(item as File);
      } else if (typeof item === 'string' && item.trim() !== '') {
        imageUrls.push(item);
      }
    });

    files.images = imageFiles;
    dataForBackend.images = imageUrls;
  }

  // Separar documentos
  if (data.documents && Array.isArray(data.documents)) {
    const documentFiles: File[] = [];
    const documentUrls: string[] = [];

    data.documents.forEach((item) => {
      if (isFile(item)) {
        documentFiles.push(item as File);
      } else if (typeof item === 'string' && item.trim() !== '') {
        documentUrls.push(item);
      }
    });

    files.documents = documentFiles;
    dataForBackend.documents = documentUrls;
  }

  return { files, dataForBackend };
};

const propertiesService = {
  async createProperty(data: CreatePropertyData): Promise<CreatePropertyResponse> {
    const { files, dataForBackend } = separateFilesFromUrls(data);
    const cleanedData = cleanDataForBackend(dataForBackend);

    // Verificar si hay archivos físicos para enviar
    const hasPhysicalFiles =
      files.thumbnail || files.images.length > 0 || files.documents.length > 0;

    if (hasPhysicalFiles) {
      const formData = new FormData();

      // Agregar thumbnail si existe
      if (files.thumbnail) {
        formData.append('thumbnail', files.thumbnail);
      }

      // Agregar imágenes físicas si existen
      files.images.forEach((image) => {
        formData.append('images', image);
      });

      // Agregar documentos físicos si existen
      files.documents.forEach((document) => {
        formData.append('documents', document);
      });

      // Agregar los datos como JSON string en un campo 'data'
      formData.append('data', JSON.stringify(cleanedData));

      const response = await axiosInstance.post(API_ENDPOINTS.PROPERTIES, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      // Si no hay archivos físicos, enviar solo JSON
      const response = await axiosInstance.post(API_ENDPOINTS.PROPERTIES, { data: cleanedData });
      return response.data;
    }
  },

  async updateProperty(data: CreatePropertyData, id: string): Promise<CreatePropertyResponse> {
    const { files, dataForBackend } = separateFilesFromUrls(data);
    const cleanedData = cleanDataForBackend(dataForBackend);

    // Verificar si hay archivos físicos para enviar
    const hasPhysicalFiles =
      files.thumbnail || files.images.length > 0 || files.documents.length > 0;

    if (hasPhysicalFiles) {
      const formData = new FormData();

      // Agregar thumbnail si existe
      if (files.thumbnail) {
        formData.append('thumbnail', files.thumbnail);
      }

      // Agregar imágenes físicas si existen
      files.images.forEach((image) => {
        formData.append('images', image);
      });

      // Agregar documentos físicos si existen
      files.documents.forEach((document) => {
        formData.append('documents', document);
      });

      // Agregar los datos como JSON string en un campo 'data'
      formData.append('data', JSON.stringify(cleanedData));

      const response = await axiosInstance.put(`${API_ENDPOINTS.PROPERTIES}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      // Si no hay archivos físicos, enviar solo JSON
      const response = await axiosInstance.put(`${API_ENDPOINTS.PROPERTIES}/${id}`, {
        data: cleanedData,
      });
      return response.data;
    }
  },

  async getProperties(): Promise<PropertyBackendDto[]> {
    const response = await axiosInstance.get(API_ENDPOINTS.PROPERTIES);
    return response.data.data;
  },

  async getPropertyById(id: string): Promise<PropertyBackendDto> {
    const response = await axiosInstance.get(`${API_ENDPOINTS.PROPERTIES}/${id}`);
    return response.data;
  },

  async deleteProperty(id: string): Promise<void> {
    await axiosInstance.delete(`${API_ENDPOINTS.PROPERTIES}/${id}`);
  },
};

export { propertiesService };
