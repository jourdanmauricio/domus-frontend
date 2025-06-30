import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";

const API_BASE_URL = process.env.BACKEND_URL;

interface BackendResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class BackendClient {
  private static async getAuthHeaders() {
    const session = await auth();

    if (!session?.accessToken) {
      throw new Error("No autorizado");
    }

    return {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
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
      console.error(`Error en API ${endpoint}:`, error);

      if (error instanceof Error && error.message === "No autorizado") {
        return { error: "No autorizado", status: 401 };
      }

      return { error: "Error interno del servidor", status: 500 };
    }
  }

  static async post<T = any>(
    endpoint: string,
    body: any
  ): Promise<BackendResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error(`Error en API ${endpoint}:`, error);

      if (error instanceof Error && error.message === "No autorizado") {
        return { error: "No autorizado", status: 401 };
      }

      return { error: "Error interno del servidor", status: 500 };
    }
  }

  static async put<T = any>(
    endpoint: string,
    body: any
  ): Promise<BackendResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error(`Error en API ${endpoint}:`, error);

      if (error instanceof Error && error.message === "No autorizado") {
        return { error: "No autorizado", status: 401 };
      }

      return { error: "Error interno del servidor", status: 500 };
    }
  }

  static async delete<T = any>(endpoint: string): Promise<BackendResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error(`Error en API ${endpoint}:`, error);

      if (error instanceof Error && error.message === "No autorizado") {
        return { error: "No autorizado", status: 401 };
      }

      return { error: "Error interno del servidor", status: 500 };
    }
  }
}

// Función helper para convertir la respuesta del backend a NextResponse
export const createApiResponse = (backendResponse: BackendResponse) => {
  if (backendResponse.error) {
    return NextResponse.json(
      { error: backendResponse.error },
      { status: backendResponse.status }
    );
  }

  return NextResponse.json(backendResponse.data, {
    status: backendResponse.status,
  });
};
