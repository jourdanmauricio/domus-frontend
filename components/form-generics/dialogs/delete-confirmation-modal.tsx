import { Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui';

type DeleteConfirmationModalProps<TData> = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: TData | null;
  title?: string;
  description?: string;
  isLoading?: boolean;
};

const DeleteConfirmationModal = <TData,>({
  isOpen,
  onClose,
  onConfirm,
  item,
  title = 'Confirmar eliminación',
  description = '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
  isLoading = false,
}: DeleteConfirmationModalProps<TData>) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex items-center gap-2'>
            <Trash2 className='h-5 w-5 text-destructive' />
            {title}
          </AlertDialogTitle>
          <Separator />
          <AlertDialogDescription className='pt-6'>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-6'>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;
