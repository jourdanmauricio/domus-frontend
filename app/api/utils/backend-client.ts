import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import axios from 'axios';

const API_BASE_URL = process.env.BACKEND_URL;

export interface BackendResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  details?: any; // Agregar campo para detalles del error
}

export class BackendClient {
  private static async getAuthHeaders() {
    const session = await auth();

    if (!session?.accessToken) {
      throw new Error('No autorizado');
    }

    return {
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  static async get<T = any>(endpoint: string): Promise<BackendResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      if (error instanceof Error && error.message === 'No autorizado') {
        return { error: 'No autorizado', status: 401 };
      }

      return { error: 'Error interno del servidor', status: 500 };
    }
  }

  static async post<T = any>(endpoint: string, body: any): Promise<BackendResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      // Si es FormData, usar axios en lugar de fetch
      if (body instanceof FormData) {
        const { 'Content-Type': _, ...headersWithoutContentType } = headers;
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, body, {
          headers: headersWithoutContentType,
        });
        return { data: response.data, status: response.status };
      }

      // Para JSON, usar fetch como antes
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log(`Error en API ${endpoint}:`, error);

      if (error instanceof Error && error.message === 'No autorizado') {
        return { error: 'No autorizado', status: 401 };
      }

      return { error: 'Error interno del servidor', status: 500 };
    }
  }

  static async put<T = any>(endpoint: string, body: any): Promise<BackendResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      // Si es FormData, no incluir Content-Type para que axios lo maneje automáticamente
      if (body instanceof FormData) {
        const { 'Content-Type': _, ...headersWithoutContentType } = headers;
        const response = await axios.put(`${API_BASE_URL}${endpoint}`, body, {
          headers: headersWithoutContentType,
        });
        return { data: response.data, status: response.status };
      }

      const response = await axios.put(`${API_BASE_URL}${endpoint}`, body, {
        headers,
      });

      return { data: response.data, status: response.status };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const newError = {
          error: error.response?.data?.message || 'Error del servidor',
          status: error.response?.status || 500,
          details: error.response?.data, // Preservar todos los detalles del error
        };
        console.log(`Error en API ${endpoint}:`, newError);
        return newError;
      }

      return { error: 'Error interno del servidor', status: 500 };
    }
  }

  static async delete<T = any>(endpoint: string): Promise<BackendResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.log(`Error en API ${endpoint}:`, error);

      if (error instanceof Error && error.message === 'No autorizado') {
        return { error: 'No autorizado', status: 401 };
      }

      return { error: 'Error interno del servidor', status: 500 };
    }
  }
}

// Función helper para convertir la respuesta del backend a NextResponse
export const createApiResponse = (backendResponse: BackendResponse) => {
  if (backendResponse.error) {
    // Si el backendResponse tiene detalles del error, preservarlos
    if (backendResponse.details) {
      return NextResponse.json(
        {
          error: backendResponse.status,
          message: backendResponse.error,
          ...backendResponse.details, // Preservar todos los detalles del error
        },
        { status: backendResponse.status }
      );
    }

    // Fallback para errores simples
    return NextResponse.json(
      {
        error: backendResponse.status,
        message: backendResponse.error,
      },
      { status: backendResponse.status }
    );
  }

  return NextResponse.json(backendResponse.data, {
    status: backendResponse.status,
  });
};
