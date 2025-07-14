'use client';

import { useState, useRef, useEffect } from 'react';
import { Edit, X } from 'lucide-react';

import { QUERY_KEYS } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileForm } from './profile-form';
import { BasicInfo } from '@/components/profile/basic-info';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/lib/services/users.service';
import { UserSendProfileDto } from '@/lib/types/users';
import { toast } from '@/hooks/use-toast';
import { mapAxiosError } from '@/lib/utils/error-mapper';
import { BackendResponse } from '@/app/api/utils/backend-client';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USERS.ME],
    queryFn: () => usersService.getProfile(),
  });

  // Mutation para actualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: (data: UserSendProfileDto) => usersService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS.ME] });
      toast({
        title: 'Perfil actualizado correctamente',
        variant: 'success',
      });
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

  // Mutation para subir avatar
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => usersService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS.ME] });
      toast({
        title: 'Avatar actualizado correctamente',
        variant: 'success',
      });
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Limpiar estado al entrar en modo edición
      setSelectedAvatarFile(null);
      setPreviewImage(null);
    }
  };

  const handleAvatarSelect = (file: File) => {
    setSelectedAvatarFile(file);
    // Crear URL para previsualización
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleFormSubmit = async (formData: UserSendProfileDto) => {
    try {
      // 1. Actualizar perfil
      await updateProfileMutation.mutateAsync(formData);

      // 2. Si hay avatar seleccionado, subirlo
      if (selectedAvatarFile) {
        await uploadAvatarMutation.mutateAsync(selectedAvatarFile);
      }

      // 3. Limpiar estado y salir del modo edición
      setSelectedAvatarFile(null);
      setPreviewImage(null);
      setIsEditing(false);
    } catch (error) {
      // Los errores ya son manejados por las mutations
    }
  };

  // Limpiar la URL de previsualización cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='mt-2 h-4 w-64' />
          </div>
          <Skeleton className='h-10 w-24' />
        </div>

        <div className='space-y-6'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <Skeleton className='mb-1 h-4 w-20' />
                      <Skeleton className='h-4 w-32' />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const isSubmitting = updateProfileMutation.isPending || uploadAvatarMutation.isPending;

  return (
    <div className=''>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='page-title'>Mi Perfil</h2>
          <p className='page-description'>Gestiona tu información personal y preferencias</p>
        </div>
        <Button onClick={handleEditToggle} variant={isEditing ? 'outline' : 'default'}>
          {isEditing ? (
            <>
              <X className='mr-2 h-4 w-4' />
              Cancelar
            </>
          ) : (
            <>
              <Edit className='mr-2 h-4 w-4' />
              Editar Perfil
            </>
          )}
        </Button>
      </div>

      {/* Información Básica */}
      <BasicInfo
        userProfile={userProfile}
        disabled={isEditing}
        onAvatarSelect={handleAvatarSelect}
        previewImage={previewImage}
      />

      {/* Formulario de perfil */}
      <div className=''>
        <ProfileForm
          userProfile={userProfile}
          onFormSubmit={handleFormSubmit}
          onCancel={() => setIsEditing(false)}
          disabled={!isEditing}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
