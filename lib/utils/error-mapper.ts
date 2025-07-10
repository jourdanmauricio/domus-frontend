export interface ApiError {
  message: string;
  status: number;
}

export const mapAxiosError = (error: any): ApiError => {
  return {
    message: error?.response?.data?.message || 'Error interno del servidor',
    status: error?.response?.data?.error || error?.response?.status || 500,
  };
};

export const createErrorHandler =
  (defaultMessage: string) =>
  (error: any): ApiError => {
    return {
      message: error?.response?.data?.message || defaultMessage,
      status: error?.response?.data?.error || error?.response?.status || 500,
    };
  };
