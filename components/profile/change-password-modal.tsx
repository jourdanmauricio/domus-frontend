'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InputField } from '@/components/form-generics/input-field';
import { toast } from '@/hooks/use-toast';
import { changePasswordSchema } from '@/lib/schemas/users';
import { usersService } from '@/lib/services/users.service';
import { useMutation } from '@tanstack/react-query';
import { UpdateUserPasswordDto } from '@/lib/types/users';

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserPasswordDto) => usersService.updateUserPassword(data),
    onSuccess: () => {
      toast({
        title: 'Contraseña actualizada correctamente',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    },
  });
  const handleSubmit = async (data: ChangePasswordFormData) => {
    await updateMutation.mutateAsync({ password: data.newPassword });
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Lock className='mr-2 h-5 w-5' />
            Cambiar Contraseña
          </DialogTitle>
          <DialogDescription>
            Ingresa tu contraseña actual y la nueva contraseña que deseas usar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className='relative'>
              <InputField
                name='newPassword'
                label='Nueva Contraseña'
                type={showNewPassword ? 'text' : 'password'}
                placeholder='Ingresa tu nueva contraseña'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-3 top-11 h-6 w-6 p-0 text-gray-400 hover:bg-transparent'
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className='!h-5 !w-5' /> : <Eye className='!h-5 !w-5' />}
              </Button>
            </div>

            <div className='relative'>
              <InputField
                name='confirmPassword'
                label='Confirmar Nueva Contraseña'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirma tu nueva contraseña'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-3 top-11 h-6 w-6 p-0 text-gray-400 hover:bg-transparent'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='!h-5 !w-5' />
                ) : (
                  <Eye className='!h-5 !w-5' />
                )}
              </Button>
            </div>

            <div className='flex justify-end space-x-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={updateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
