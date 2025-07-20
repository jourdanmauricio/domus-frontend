import { API_ENDPOINTS, buildEndpoint } from '@/lib/constants';
import { georefCityDto } from '@/lib/types/geography';
import axiosInstance from '@/lib/utils/axios-config'; // Usar axiosInstance

export const geographyService = {
  async getCitiesByProvince(provinceId: string): Promise<georefCityDto[]> {
    const response = await axiosInstance.get(buildEndpoint(API_ENDPOINTS.CITIES, { provinceId }));
    return response.data;
  },

  async addCity(city: georefCityDto): Promise<georefCityDto> {
    const response = await axiosInstance.post(API_ENDPOINTS.ADD_CITY, city);
    return response.data;
  },
};
