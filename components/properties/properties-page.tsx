'use client';

import { Plus, Search, MapPin, Download, X, PointerIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/form-generics/tables/data-table';
import { RoleGuard } from '@/components/dashboard/role-guard';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import { propertiesService } from '@/lib/services/properties.service';
import { PropertyBackendDto } from '@/lib/types/properties';
import { getColumns } from '@/components/properties/properties-data-table/columns';
import DeleteConfirmationModal from '@/components/form-generics/dialogs/delete-confirmation-modal';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import PropertyPdf from '@/components/properties/property-pdf';

const PropertiesPage = () => {
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyBackendDto | null>(null);
  const [isViewPDF, setIsViewPDF] = useState(false);
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
    console.log('view', row);
    setSelectedProperty(row);
    setIsViewPDF(true);
  }, []);

  const onDelete = useCallback((row: PropertyBackendDto) => {
    setSelectedProperty(row);
    setIsDeleteConfirmationModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedProperty) {
      propertiesService.deleteProperty(selectedProperty.id);
    }
  }, [selectedProperty]);

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
              <div className='flex items-center gap-2'>
                <Button variant='outline'>
                  <MapPin className='mr-2 h-4 w-4' />
                  Mapa
                </Button>
                <Button variant='outline'>
                  <Download className='mr-2 h-4 w-4' />
                  Descargar
                </Button>
              </div>
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

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
        onConfirm={() => {
          handleDelete();
        }}
        item={selectedProperty}
      />

      {isViewPDF && selectedProperty && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='flex h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white'>
            <div className='flex items-center justify-between border-b p-4'>
              <h3 className='text-lg font-semibold'>Vista previa: {selectedProperty.id}</h3>
              <div className='flex gap-2'>
                <PDFDownloadLink
                  document={<PropertyPdf property={selectedProperty} />}
                  fileName={`propiedad_${selectedProperty.id}.pdf`}
                >
                  {({ loading }) => (
                    <Button variant='outline' size='sm'>
                      <Download className='mr-2 h-4 w-4' />
                      {loading ? 'Preparando...' : 'Descargar'}
                    </Button>
                  )}
                </PDFDownloadLink>
                <Button variant='outline' size='sm' onClick={() => setIsViewPDF(false)}>
                  <X className='mr-2 h-4 w-4' />
                  Cerrar
                </Button>
              </div>
            </div>

            <div className='flex-1'>
              <PDFViewer width='100%' height='100%'>
                <PropertyPdf property={selectedProperty} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
};

export { PropertiesPage };
