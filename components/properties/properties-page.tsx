'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, MapPin, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RoleGuard } from '@/components/dashboard/role-guard';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/form-generics/tables/data-table';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import { propertiesService } from '@/lib/services/properties.service';
import { PropertyBackendDto } from '@/lib/types/properties';
import { getColumns } from '@/components/properties/properties-data-table/columns';

const PropertiesPage = () => {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES],
    queryFn: () => propertiesService.getProperties(),
  });

  const onEdit = useCallback((row: PropertyBackendDto) => {
    router.push(`/dashboard/admin/properties/${row.id}`);
  }, []);

  const onDownload = useCallback((row: PropertyBackendDto) => {
    // TODO: Implementar descarga
  }, []);

  const onDelete = useCallback((row: PropertyBackendDto) => {
    // TODO: Implementar eliminación
  }, []);

  const columns = useMemo(
    () =>
      getColumns({
        onEdit,
        onDownload,
        onDelete,
      }),
    [onEdit, onDownload, onDelete]
  );

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
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='opacity-50' />
              Lista de Propiedades
            </CardTitle>
            <div className='flex items-center justify-between space-x-2 pt-4'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input placeholder='Buscar propiedades...' className='w-64 pl-8' />
              </div>
              <Button variant='outline'>
                <Download className='mr-2 h-4 w-4' />
                Descargar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-center text-muted-foreground'>
              <DataTable
                data={data || []}
                columns={columns}
                isLoading={isLoading}
                error={!!error}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
};

export { PropertiesPage };
