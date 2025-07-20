import axios from 'axios';

// Crear una instancia específica de axios
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar interceptor en la instancia específica
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Re-lanzar el error para que React Query lo maneje
    return Promise.reject(error);
  }
);

// Exportar solo la instancia configurada
export default axiosInstance;
