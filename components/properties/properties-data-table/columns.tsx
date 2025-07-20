'use client';

import { ColumnDef } from '@tanstack/react-table';

import DataTableRowActions from './data-table-row-actions';
import { TruncatedCell } from '@/components/form-generics/truncatedCell';
import { PropertyBackendDto } from '@/lib/types/properties';

type DataTableColumnsProps = {
  onDownload: (value: PropertyBackendDto) => void;
  onEdit: (value: PropertyBackendDto) => void;
  onDelete: (value: PropertyBackendDto) => void;
};

export const getColumns = ({
  onDownload,
  onEdit,
  onDelete,
}: DataTableColumnsProps): ColumnDef<PropertyBackendDto>[] => [
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => row.getValue('name') || '-',
    minSize: 60,
    size: 120,
  },
  {
    id: 'address.nomenclator',
    accessorFn: (row) => row.address.nomenclator,
    header: 'Dirección',
    cell: ({ row }) => (
      <span className='mr-auto'>{row.getValue('address.nomenclator') || '-'}</span>
    ),
    minSize: 300,
    size: 0,
  },
  {
    accessorKey: 'ownerName',
    header: 'Propietario',
    cell: ({ row }) => row.getValue('ownerName') || '-',
    minSize: 200,
    size: 0,
  },
  {
    accessorKey: 'ownerPhone',
    header: 'Teléfono',
    cell: ({ row }) => row.getValue('ownerPhone') || '-',
    minSize: 120,
    size: 0,
  },
  {
    accessorKey: 'administration',
    header: 'Administración',
    cell: ({ row }) => row.getValue('administration') || '-',
    minSize: 200,
    size: 0,
  },
  {
    accessorKey: 'administrationPhone',
    header: 'Teléfono',
    cell: ({ row }) => row.getValue('administrationPhone') || '-',
    minSize: 120,
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
    size: 150,
  },
];
