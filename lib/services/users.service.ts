import { API_ENDPOINTS } from '@/lib/constants';
import { UpdateUserPasswordDto, UserBackendDto } from '@/lib/types/users';
import axios from 'axios';

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  // ... otros campos
}

export const usersService = {
  async getProfile(): Promise<UserBackendDto> {
    const response = await axios(API_ENDPOINTS.ME);
    return response.data;
  },

  async updateProfile(data: UpdateUserData): Promise<UserBackendDto> {
    console.log('updateProfile', data);
    const response = await axios.put(API_ENDPOINTS.ME, data);
    console.log('response', response);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<UserBackendDto> {
    console.log('uploadAvatar', file);
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axios.post(API_ENDPOINTS.AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('response', response);
    return response.data;
  },

  async getUsers(): Promise<UserBackendDto[]> {
    const response = await fetch(API_ENDPOINTS.USERS);

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    return response.json();
  },

  async updateUserPassword(data: UpdateUserPasswordDto): Promise<UserBackendDto> {
    const response = await axios.put(API_ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },
};
