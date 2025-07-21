import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { UserSendProfileDto } from '@/lib/types/users';
import { usersService } from '@/lib/services/users.service';
import { useApiError } from '@/hooks/useApiError';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: (data: UserSendProfileDto) => usersService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
      toast({
        title: 'Perfil actualizado correctamente',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      handleError(error, 'actualizar el perfil');
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: (file: File) => usersService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
      toast({
        title: 'Avatar actualizado correctamente',
        variant: 'success',
      });
    },
    onError: (error: any) => {
      handleError(error, 'actualizar el avatar');
    },
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: () => usersService.getProfile(),
  });
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: () => usersService.getUsers(),
  });
};
