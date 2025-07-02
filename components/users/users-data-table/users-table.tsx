'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, LoaderIcon } from 'lucide-react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type DataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading: boolean;
  error: boolean;
};

export function UsersDataTable<TData, TValue>({
  data,
  columns,
  isLoading,
  error,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSorting = (value: any) => {
    setSorting(value);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: handleSorting,
  });

  const hasData = table.getRowModel().rows?.length > 0;
  const hasError = Boolean(error);
  const isEmpty = !hasData && !isLoading && !hasError;

  return (
    <div className='h-full overflow-y-auto'>
      <Table containerClassName='h-full'>
        <TableHeader className='sticky top-0 z-10 bg-white'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              // className='relative flex h-[32px] w-full items-center border-y border-y-neutral-500'
              className='relative flex h-[32px] w-full items-center !border-b-0'
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className='flex w-full items-center px-4 text-xs font-bold text-neutral-700'
                    style={{
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                      width: header.column.columnDef.size,
                      flexGrow: !header.column.columnDef.size ? 1 : 0,
                    }}
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'relative cursor-pointer select-none w-full'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className='absolute top-0 ml-1'>
                        {{
                          asc: <ArrowDown className='h-4 w-4' />,
                          desc: <ArrowUp className='h-4 w-4' />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
              <TableHead className='absolute left-0 right-0 top-0 h-px bg-neutral-100'></TableHead>
              <TableHead className='absolute bottom-0 left-0 right-0 h-px bg-neutral-100'></TableHead>
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className='relative'>
          {isLoading && (
            <TableRow className='flex min-h-[200px] w-full'>
              <TableCell colSpan={columns.length} className='w-full'>
                <div className='flex h-full items-center justify-center pt-4'>
                  <LoaderIcon className='h-5 w-5 animate-spin' />
                </div>
              </TableCell>
            </TableRow>
          )}

          {hasError && (
            <TableRow className='flex h-[100px] w-full'>
              <TableCell colSpan={columns.length} className='mx-auto h-24'>
                <span className='text-xl font-medium text-neutral-600'>
                  Ocurrió un error al obtener los datos
                </span>
              </TableCell>
            </TableRow>
          )}

          {isEmpty && (
            <TableRow className='flex h-[100px] w-full'>
              <TableCell colSpan={columns.length} className='mx-auto h-24'>
                <span className='text-xl font-medium text-neutral-600'>
                  No hay datos
                </span>
              </TableCell>
            </TableRow>
          )}

          {hasData &&
            !isLoading &&
            !error &&
            table.getRowModel().rows.map((row, index) => {
              return (
                <TableRow
                  key={row.id}
                  className='flex h-[48px] w-full items-center border-y-0 odd:bg-neutral-50 even:bg-transparent'
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className='flex w-full px-4 py-0 text-base text-neutral-700'
                        style={{
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                          width: cell.column.columnDef.size,
                          flexGrow: !cell.column.columnDef.size ? 1 : 0,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
