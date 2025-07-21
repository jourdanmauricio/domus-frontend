'use client';

import { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';

import { ProfileForm } from './profile-form';
import { UserSendProfileDto } from '@/lib/types/users';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BasicInfo } from '@/components/profile/basic-info';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useGetProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useUsers';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: userProfile, isLoading } = useGetProfile();

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setSelectedAvatarFile(null);
      setPreviewImage(null);
    }
  };

  const handleAvatarSelect = (file: File) => {
    setSelectedAvatarFile(file);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handleFormSubmit = async (formData: UserSendProfileDto) => {
    try {
      await updateProfileMutation.mutateAsync(formData);

      if (selectedAvatarFile) {
        await uploadAvatarMutation.mutateAsync(selectedAvatarFile);
      }

      setSelectedAvatarFile(null);
      setPreviewImage(null);
      setIsEditing(false);
    } catch (error) {
      // Los errores ya son manejados por las mutations
    }
  };

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
