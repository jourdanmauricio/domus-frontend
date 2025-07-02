'use client';

import { ColumnDef } from '@tanstack/react-table';

import DataTableRowActions from './data-table-row-actions';
import { TruncatedCell } from '@/components/form-generics/truncatedCell';
import { UserBackendDto } from '@/lib/types/users';


type DataTableColumnsProps = {
  onDownload: (value: UserBackendDto) => void;
  onEdit: (value: UserBackendDto) => void;
  onDelete: (value: UserBackendDto) => void;
};

export const getUsersColumns = ({
  onDownload,
  onEdit,
  onDelete
}: DataTableColumnsProps): ColumnDef<UserBackendDto>[] => [
  {
    id: 'profile.firstName',
    accessorFn: (row) => row.profile?.firstName,
    header: 'Nombre',
    cell: ({ row }) => <span className='mr-auto'>{row.getValue('profile.firstName') || '-'}</span>,
    size: 100,
  },
  {
    id: 'profile.lastName',
    accessorFn: (row) => row.profile?.lastName,
    header: 'Apellido',
    cell: ({ row }) => <span className='mr-auto'>{row.getValue('lastName') || '-'}</span>,
    size: 100,
  },
  {
    accessorKey: 'email',
    header: "Email",
    cell: ({ row }) => (
      <div className='mr-auto'>
        <TruncatedCell value={row.getValue('email')} />
      </div>
    ),
    minSize: 300,
    size: 0,
  },
  {
    accessorKey: 'roles',
    header: "Roles",
    cell: ({ row }) => (
      <div className='mr-auto'>
        <TruncatedCell value={(row.getValue('roles') as { name: string }[]).map((role) => role.name).join(', ')} />
      </div>
    ),
    minSize: 300,
    size: 0,
  },
  {
    header: 'Acciones',
    id: 'actions',
    cell: ({ row }) => (
      <div className='mr-auto'>
        <DataTableRowActions
          row={row}
          onEdit={onEdit}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </div>
    ),
    size: 250,
  },
];
