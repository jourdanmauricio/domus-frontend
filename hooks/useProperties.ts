import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { propertiesService, CreatePropertyData } from '@/lib/services/properties.service';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { mapAxiosError } from '@/lib/utils/error-mapper';
import { useRouter } from 'next/navigation';

export const useCreateProperty = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePropertyData) => propertiesService.createProperty(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] });
      toast({
        title: 'Propiedad creada exitosamente',
        description: 'La propiedad ha sido registrada en el sistema',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      const { message, details } = mapAxiosError(error);

      // Para errores de validación, mostrar los errores específicos
      const description = details?.formattedErrors || message;

      toast({
        title: 'Error al crear la propiedad',
        description: description,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: CreatePropertyData; id: string }) =>
      propertiesService.updateProperty(data, id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] });
      toast({
        title: 'Propiedad actualizada exitosamente',
        description: 'La propiedad ha sido actualizada en el sistema',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const { message, details } = mapAxiosError(error);

      // Para errores de validación, mostrar los errores específicos
      const description = details?.formattedErrors || message;

      toast({
        title: 'Error al actualizar la propiedad',
        description: description,
        variant: 'destructive',
      });
    },
  });
};

export const useGetProperties = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES],
    queryFn: () => propertiesService.getProperties(),
  });
};

export const useGetPropertyById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES, id],
    queryFn: () => propertiesService.getPropertyById(id),
    enabled: !!id,
  });
};
