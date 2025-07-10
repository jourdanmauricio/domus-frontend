'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { QUERY_KEYS } from '@/lib/constants';
import { UsersDataTable } from './users-data-table/users-table';
import { useCallback, useMemo } from 'react';
import { UserBackendDto } from '@/lib/types/users';
import { getUsersColumns } from './users-data-table/columns';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/services/users.service';

export default function UsersPage() {
  // Fetch users from the API
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.USERS.ME],
    queryFn: () => usersService.getUsers(),
  });

  const onDownload = useCallback(async (row: UserBackendDto) => {
    console.log('Download:', row);
  }, []);

  const onEdit = useCallback((row: UserBackendDto) => {
    // Implementar edición del query
    console.log('Edit query:', row);
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
          <h2 className='text-3xl font-bold tracking-tight'>Gestión de Usuarios</h2>
          <p className='text-muted-foreground'>Administra los usuarios del sistema</p>
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
          <UsersDataTable
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
