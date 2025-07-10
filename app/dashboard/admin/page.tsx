'use client';

import { useSession } from 'next-auth/react';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building2, FileText, Receipt } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/services/users.service';

export default function DashboardPage() {
  const { data: session } = useSession();

  const {
    data: userProfile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.USERS.ME],
    queryFn: () => usersService.getProfile(),
  });
  const isAdmin = session?.user.roles?.includes('admin');

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-4 w-24' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-16' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>
          Bienvenido, {session?.user.name || 'Usuario'}
        </h2>
        <p className='text-muted-foreground'>Aquí puedes gestionar tu información y actividades.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {isAdmin ? (
          <>
            {/* <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Usuarios</CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{dashboardData?.stats?.totalUsers || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Propiedades</CardTitle>
                <Building2 className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {dashboardData?.stats?.totalProperties || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Contratos</CardTitle>
                <FileText className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {dashboardData?.stats?.totalContracts || 0}
                </div>
              </CardContent>
            </Card> */}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Recibos Pendientes</CardTitle>
                <Receipt className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                {/* <div className='text-2xl font-bold'>
                  {dashboardData?.stats?.pendingReceipts || 0}
                </div> */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Estado del Contrato</CardTitle>
                <FileText className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>Activo</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* User Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          {userProfile ? (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Nombre</label>
                <div className='mt-1 text-sm text-gray-900'>
                  {userProfile.profile?.firstName || 'No disponible'}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Email</label>
                <div className='mt-1 text-sm text-gray-900'>
                  {userProfile.email || session?.user?.email}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>ID de Usuario</label>
                <div className='mt-1 text-sm text-gray-900'>
                  {userProfile.id || 'No disponible'}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>Roles</label>
                <div className='mt-1 text-sm text-gray-900'>
                  {session?.user.roles?.join(', ') || 'Sin roles'}
                </div>
              </div>
            </div>
          ) : (
            <div className='text-sm text-gray-500'>No se pudo cargar la información del perfil</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
