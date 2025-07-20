import { georefAddressDto, georefAddressResponseDto } from '@/lib/types/geography';
import axiosInstance from '@/lib/utils/axios-config'; // Usar axiosInstance

const API_ENDPOINTS = {
  BASE_URL: 'https://apis.datos.gob.ar/georef/api',
};

export const georefService = {
  async getAllCitiesByName(provinceId: string, cityName: string) {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BASE_URL}/localidades?provincia=${provinceId}&nombre=${cityName}&campos=completo&aplanar=true&max=1000`
    );
    return response.data;
  },

  async getAllAddressesByCity(
    provinceId: string,
    cityName: string,
    address: string
  ): Promise<georefAddressDto[]> {
    const response = await axiosInstance.get<georefAddressResponseDto>(
      `${API_ENDPOINTS.BASE_URL}/direcciones?provincia=${provinceId}&localidad=${cityName}&direccion=${address}&campos=estandar&aplanar=true&max=1000`
    );
    return response.data.direcciones;
  },
};
