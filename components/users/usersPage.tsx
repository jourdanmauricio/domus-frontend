'use client';

import { Plus, Search } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/form-generics/tables/data-table';
import { UserBackendDto } from '@/lib/types/users';
import { useGetUsers } from '@/hooks/useUsers';
import { getUsersColumns } from './users-data-table/columns';

export default function UsersPage() {
  const { data: usersData, isLoading, error } = useGetUsers();

  const onDownload = useCallback(async (row: UserBackendDto) => {
    // TODO: Implementar descarga
  }, []);

  const onEdit = useCallback((row: UserBackendDto) => {
    // TODO: Implementar edición
  }, []);

  async function handleDialogConfirmation() {
    // await deleteMutation.mutateAsync(currentRow?.id!);
  }

  const onDelete = useCallback(async (row: UserBackendDto) => {
    // setCurrentRow(row);
    // setAlertDialogIsOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getUsersColumns({
        onEdit,
        onDownload,
        onDelete,
      }),
    [onEdit, onDownload, onDelete]
  );

  return (
    <div className='flex h-full flex-col space-y-6 overflow-x-hidden'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='page-title'>Gestión de Usuarios</h2>
          <p className='page-description'>Administra los usuarios del sistema</p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Nuevo Usuario
        </Button>
      </div>

      <Card className='flex w-full max-w-full flex-1 flex-col'>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <div className='flex items-center space-x-2'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input placeholder='Buscar usuarios...' className='w-64 pl-8' />
            </div>
          </div>
        </CardHeader>
        <CardContent className='flex-1 overflow-x-auto p-4'>
          <DataTable
            columns={columns}
            data={usersData || []}
            isLoading={isLoading}
            error={!!error}
          />
        </CardContent>
      </Card>
    </div>
  );
}
