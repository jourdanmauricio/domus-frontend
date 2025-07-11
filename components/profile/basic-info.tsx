import { useState, useRef, useEffect } from 'react';
import { Lock, User, Edit, Pencil } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserBackendDto } from '@/lib/types/users';
import { ChangePasswordModal } from '@/components/profile/change-password-modal';

type BasicInfoProps = {
  userProfile?: UserBackendDto;
  disabled?: boolean;
  onAvatarSelect?: (file: File) => void;
  previewImage?: string | null;
};

const BasicInfo = ({ userProfile, disabled, onAvatarSelect, previewImage }: BasicInfoProps) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);
  };

  const handleAvatarClick = () => {
    if (disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarSelect) {
      onAvatarSelect(file);
    }
  };

  return (
    <>
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between text-primary'>
            <div className='flex items-center'>
              <User className='mr-2 h-5 w-5' />
              Información Básica
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setIsPasswordModalOpen(true)}>
                Cambiar Contraseña
                <Lock className='mr-1 h-3 w-3' />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <Avatar
                className={`h-16 w-16 ${disabled ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={handleAvatarClick}
              >
                <AvatarImage
                  src={previewImage ?? userProfile?.profile?.avatarUrl ?? undefined}
                  alt={userProfile?.profile?.firstName || ''}
                />
                <AvatarFallback>
                  {getInitials(
                    `${userProfile?.profile?.firstName || 'U'} ${userProfile?.profile?.lastName || ''}`
                  )}
                </AvatarFallback>
              </Avatar>
              {disabled && (
                <div className='absolute -bottom-1 -right-1 rounded-full bg-primary p-1 text-primary-foreground shadow-md'>
                  <Pencil className='h-3 w-3' />
                </div>
              )}
            </div>
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

      {/* Input oculto para seleccionar archivo */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};

export { BasicInfo };
