'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RoleGuard } from '@/components/dashboard/role-guard';
import { useRouter } from 'next/navigation';

const PropertiesPage = () => {
  const router = useRouter();

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='page-title'>Gestión de Propiedades</h2>
            <p className='page-description'>Administra las propiedades inmobiliarias</p>
          </div>
          <Button onClick={() => router.push('/dashboard/admin/properties/new')}>
            <Plus className='mr-2 h-4 w-4' />
            Nueva Propiedad
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Propiedades</CardTitle>
            <div className='flex items-center space-x-2'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input placeholder='Buscar propiedades...' className='w-64 pl-8' />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='py-8 text-center text-muted-foreground'>
              <MapPin className='mx-auto mb-4 h-12 w-12 opacity-50' />
              <p>Aquí se mostrará la lista de propiedades</p>
              <p className='text-sm'>Funcionalidad en desarrollo</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
};

export { PropertiesPage };
