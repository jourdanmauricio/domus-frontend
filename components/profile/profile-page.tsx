'use client';

import { useState } from 'react';
import { Edit, X } from 'lucide-react';

import { QUERY_KEYS } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileForm } from './profile-form';
import { BasicInfo } from '@/components/profile/basic-info';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/services/users.service';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const { data: userProfile, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USERS.ME],
    queryFn: () => usersService.getProfile(),
  });

  // console.log('userProfile!!!!!!!!!!!!!!!!!!!!!', userProfile);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

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

  return (
    <div className=''>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight text-primary'>Mi Perfil</h2>
          <p className='text-primary/80'>Gestiona tu información personal y preferencias</p>
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
      <BasicInfo userProfile={userProfile} />

      {/* Formulario de perfil */}
      <div className=''>
        <ProfileForm
          userProfile={userProfile}
          onSave={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
          disabled={!isEditing}
        />
      </div>
    </div>
  );
}
