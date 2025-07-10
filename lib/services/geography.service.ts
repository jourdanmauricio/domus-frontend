import { API_ENDPOINTS, buildEndpoint } from '@/lib/constants';
import { CityBackendDto } from '@/lib/types/geography';
import axios from 'axios';

export const geographyService = {
  async getCitiesByProvince(provinceId: string): Promise<CityBackendDto[]> {
    // const response = await axios(API_ENDPOINTS.ALL_CITIES);
    const response = await axios.get(buildEndpoint(API_ENDPOINTS.CITIES, { provinceId }));

    return response.data;
  },

  async addCity(city: CityBackendDto): Promise<CityBackendDto> {
    const response = await axios.post(API_ENDPOINTS.ADD_CITY, city);

    return response.data;
  },
};
