import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserBackendDto } from '@/lib/types/users';
import { ChangePasswordModal } from '@/components/profile/change-password-modal';

type BasicInfoProps = {
  userProfile?: UserBackendDto;
};

const BasicInfo = ({ userProfile }: BasicInfoProps) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { data: session } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 4);
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
            <Button variant='outline' onClick={() => setIsPasswordModalOpen(true)}>
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

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
};

export { BasicInfo };
