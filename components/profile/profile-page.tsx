'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Edit, X, Lock } from 'lucide-react';

import { QUERY_KEYS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProfileForm } from './profile-form';
import { ChangePasswordModal } from './change-password-modal';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/services/users.service';

export function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const {
    data: userProfile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.USERS.ME],
    queryFn: () => usersService.getProfile(),
  });

  // console.log('userProfile!!!!!!!!!!!!!!!!!!!!!', userProfile);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // const handleSaveSuccess = () => {
  //   setIsEditing(false);
  //   refetch();
  //   toast({
  //     title: 'Perfil actualizado',
  //     description: 'Tu información ha sido guardada exitosamente.',
  //   });
  // };

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
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-primary'>
            <div className='flex items-center'>
              <User className='mr-2 h-5 w-5' />
              Información Básica
            </div>
            <Button
              variant='outline'
              // size='sm'
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Cambiar Contraseña
              <Lock className='mr-1 h-3 w-3' />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={userProfile?.profile?.avatarUrl || ''}
                alt={userProfile?.profile?.firstName || ''}
              />
              <AvatarFallback>
                {getInitials(
                  `${userProfile?.profile?.firstName || 'U'} ${userProfile?.profile?.lastName || ''}`
                )}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold'>
                {userProfile?.profile?.firstName && userProfile?.profile?.lastName
                  ? `${userProfile.profile.firstName} ${userProfile.profile.lastName}`
                  : session?.user?.name || 'Usuario'}
              </h3>
              <p className='text-sm text-muted-foreground'>
                {userProfile?.email || session?.user?.email}
              </p>

              {session?.user.roles?.map((role) => (
                <Badge key={role} variant='secondary' className='text-xs'>
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de perfil */}
      <div className=''>
        <ProfileForm
          userProfile={userProfile}
          onSave={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
          disabled={!isEditing}
        />
      </div>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
