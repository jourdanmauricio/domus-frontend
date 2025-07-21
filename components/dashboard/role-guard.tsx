'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !session.user) {
      router.push('/login');
      return;
    }

    const userRoles = session.user.roles || [];
    const hasRequiredRole = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasRequiredRole) {
      // Si no tiene el rol requerido, redirigir al dashboard principal
      router.push('/dashboard');
    }
  }, [session, status, allowedRoles, router]);

  if (status === 'loading') {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
          <p className='mt-2 text-sm text-muted-foreground'>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const userRoles = session.user.roles || [];
  const hasRequiredRole = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle className='flex items-center text-destructive'>
              <AlertTriangle className='mr-2 h-5 w-5' />
              Acceso Denegado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              No tienes permisos para acceder a esta página. Contacta al administrador si crees que
              esto es un error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
