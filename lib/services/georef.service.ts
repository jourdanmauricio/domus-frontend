import { georefAddressDto, georefAddressResponseDto } from '@/lib/types/geography';
import axios from 'axios';

const API_ENDPOINTS = {
  BASE_URL: 'https://apis.datos.gob.ar/georef/api',
};

export const georefService = {
  async getAllCitiesByName(provinceId: string, cityName: string) {
    const response = await axios.get(
      `${API_ENDPOINTS.BASE_URL}/localidades?provincia=${provinceId}&nombre=${cityName}&campos=completo&aplanar=true&max=1000`
    );
    //apis.datos.gob.ar/georef/api/localidades-censales?provincia=06&aplanar=true&campos=estandar&max=10&exacto=true

    return response.data;
  },

  async getAllAddressesByCity(
    provinceId: string,
    cityName: string,
    address: string
  ): Promise<georefAddressDto[]> {
    const response = await axios.get<georefAddressResponseDto>(
      `${API_ENDPOINTS.BASE_URL}/direcciones?provincia=${provinceId}&localidad=${cityName}&direccion=${address}&campos=estandar&aplanar=true&max=1000`
    );

    return response.data.direcciones;
  },
};
