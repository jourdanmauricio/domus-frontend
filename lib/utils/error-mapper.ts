export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export const mapAxiosError = (error: any): ApiError => {
  console.error('Error completo en mapAxiosError:', error);

  if (error?.response?.data) {
    console.error('Datos de error del servidor:', error.response.data);
  }

  return {
    message:
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Error interno del servidor',
    status: error?.response?.status || 500,
    details: error?.response?.data,
  };
};

export const createErrorHandler =
  (defaultMessage: string) =>
  (error: any): ApiError => {
    return {
      message: error?.response?.data?.message || error?.response?.data?.error || defaultMessage,
      status: error?.response?.status || 500,
      details: error?.response?.data,
    };
  };
