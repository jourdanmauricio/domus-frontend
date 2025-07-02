import { Row } from '@tanstack/react-table';
import { Pencil, Trash2, FileDown, Sheet, SearchCheck, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

type DataTableRowActionsProps<TData> = {
  row: Row<TData>;
  onEdit: (value: TData) => void;
  onDownload: (value: TData) => void;
  onDelete: (value: TData) => void;
};

const DataTableRowActions = <TData,>({
  row,
  onEdit,
  onDownload,
  onDelete,
}: DataTableRowActionsProps<TData>) => {

  return (
    <div className='flex items-center justify-start gap-2'>
      <Button
        variant='ghost'
        size='sm'
        className='icon-action rounded-full p-2'
        onClick={() => {
          onDownload(row.original);
        }}
      >
        <Download className='h-5 w-5' />
      </Button>

      <Button
        variant='ghost'
        size='sm'
        className='icon-action rounded-full p-2'
        onClick={() => {
          onEdit(row.original);
        }}
      >
        <Pencil className='h-5 w-5' />
      </Button>

      <Button
        variant='ghost'
        size='sm'
        className='icon-action rounded-full p-2'
        onClick={() => {
          onDelete(row.original);
        }}
      >
        <Trash2 className='h-5 w-5' />
      </Button>
    </div>
  );
};

export default DataTableRowActions;
