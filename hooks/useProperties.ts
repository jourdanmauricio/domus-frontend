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
      // Invalidar la lista de propiedades para que se actualice
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES.LIST] });

      toast({
        title: 'Propiedad creada exitosamente',
        description: 'La propiedad ha sido registrada en el sistema',
        variant: 'default',
      });

      // Navegar a la lista de propiedades
      // router.push('/dashboard/admin/properties');
    },
    onError: (error: any) => {
      const { message, details } = mapAxiosError(error);
      console.error('Error en useCreateProperty:', { message, details, error });

      toast({
        title: 'Error al crear la propiedad',
        description: message,
        variant: 'destructive',
      });
    },
  });
};

export const useGetProperties = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES.LIST],
    queryFn: () => propertiesService.getProperties(),
  });
};

export const useGetPropertyById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES.BY_ID(id)],
    queryFn: () => propertiesService.getPropertyById(id),
    enabled: !!id,
  });
};
