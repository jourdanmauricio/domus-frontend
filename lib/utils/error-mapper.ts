export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export const mapAxiosError = (error: any): ApiError => {
  console.log('Error completo en mapAxiosError:', error);

  if (error?.response?.data) {
    console.log('Datos de error del servidor:', error.response.data);
  }

  // Manejar errores de validación con array de errores
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const validationErrors = error.response.data.errors;
    const formattedMessage = validationErrors.join('; ');

    return {
      message: error.response.data.message || 'Error de validación',
      status: error.response.status || 400,
      details: {
        ...error.response.data,
        formattedErrors: formattedMessage,
      },
    };
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
    // Manejar errores de validación con array de errores
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const validationErrors = error.response.data.errors;
      const formattedMessage = validationErrors.join('; ');

      return {
        message: error.response.data.message || 'Error de validación',
        status: error.response.status || 400,
        details: {
          ...error.response.data,
          formattedErrors: formattedMessage,
        },
      };
    }

    return {
      message: error?.response?.data?.message || error?.response?.data?.error || defaultMessage,
      status: error?.response?.status || 500,
      details: error?.response?.data,
    };
  };
