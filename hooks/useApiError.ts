import { toast } from '@/hooks/use-toast';
import { mapAxiosError } from '@/lib/utils/error-mapper';

export const useApiError = () => {
  const handleError = (error: any, context: string) => {
    const { message, details } = mapAxiosError(error);

    // Para errores de validación, mostrar los errores específicos
    const description = details?.formattedErrors || message;

    toast({
      title: `Error en ${context}`,
      description: description,
      variant: 'destructive',
    });
  };

  return { handleError };
};
