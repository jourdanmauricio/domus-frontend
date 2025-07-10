'use client';

import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { QUERY_KEYS } from '@/lib/constants';
import { mapAxiosError } from '@/lib/utils/error-mapper';
import { FormProvider } from '@/lib/contexts/form-context';
import { Button, Form } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { profileSchema } from '@/lib/schemas/users';
import { usersService } from '@/lib/services/users.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BackendResponse } from '@/app/api/utils/backend-client';
import { UserBackendDto, UserSendProfileDto } from '@/lib/types/users';
import {
  userProfileDefaultValues,
  userProfileMapperBack,
  userProfileMapperFront,
} from '@/lib/mappers/userProfile';
import { ProfileTabs } from '@/components/profile/profile-tabs/profile-tabs';

export type ProfileFormDataDto = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userProfile?: UserBackendDto;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export function ProfileForm({ userProfile, onSave, onCancel, disabled = false }: ProfileFormProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: UserSendProfileDto) => usersService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS.ME] });
      toast({
        title: 'Perfil actualizado correctamente',
        variant: 'success',
      });
      onSave();
    },
    onError: (error: BackendResponse) => {
      const { message } = mapAxiosError(error);
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      });
    },
  });

  const form = useForm<ProfileFormDataDto>({
    resolver: zodResolver(profileSchema),
    defaultValues: userProfileDefaultValues,
  });

  useEffect(() => {
    if (userProfile) {
      form.reset(userProfileMapperFront(userProfile));
    }

    if (!disabled && !form.getValues('address.city.province.id')) {
      form.setValue('address.city.province.id', '06');
    }
  }, [userProfile, disabled, form]);

  const handleSubmit = async (data: ProfileFormDataDto) => {
    const body = userProfileMapperBack(data);
    try {
      await updateMutation.mutateAsync(body);
    } catch (error) {
      // El error ya es manejado por onError de la mutación, así que no hacemos nada aquí
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.log('errors', errors);
        })}
        className='mt-6 space-y-6'
      >
        <FormProvider form={form}>
          <ProfileTabs disabled={disabled} />
        </FormProvider>

        {/* Botones de acción */}
        {!disabled && (
          <div className='flex justify-end space-x-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
