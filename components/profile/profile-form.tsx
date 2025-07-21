'use client';

import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { FormProvider } from '@/lib/contexts/form-context';
import { Button, Form } from '@/components/ui';
import { profileSchema } from '@/lib/schemas/users';
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
  onFormSubmit: (data: UserSendProfileDto) => void;
  onCancel: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
}

export function ProfileForm({
  userProfile,
  onFormSubmit,
  onCancel,
  disabled = false,
  isSubmitting = false,
}: ProfileFormProps) {
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
    onFormSubmit(body); // Solo notifica a ProfilePage
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {})} className='mt-6 space-y-6'>
        <FormProvider form={form}>
          <ProfileTabs disabled={disabled} />
        </FormProvider>

        {/* Botones de acción */}
        {!disabled && (
          <div className='flex justify-end space-x-4'>
            <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
