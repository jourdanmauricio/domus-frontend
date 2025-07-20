import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  hash?: string; // Hash del archivo para detectar duplicados
}

interface ImageUploaderProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxSize?: number; // en MB
  accept?: string;
  aspectRatio?: 'square' | '16/9' | '4/3';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  preventDuplicates?: boolean; // Nueva prop para controlar la validación de duplicados
}

export const ImageUploader = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSize = 5,
  accept = 'image/*',
  aspectRatio = 'square',
  placeholder = 'Arrastra imágenes aquí o haz clic para seleccionar',
  className,
  disabled = false,
  preventDuplicates = true, // Por defecto activar prevención de duplicados
}: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 11);
    return `${timestamp}-${random}`;
  };

  // Función para generar hash del archivo
  const generateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  // Función para verificar si un archivo es duplicado
  const isDuplicate = (file: File, fileHash: string): boolean => {
    if (!preventDuplicates) return false;

    return images.some((existingImage) => {
      // Verificar por hash (contenido idéntico)
      if (existingImage.hash && existingImage.hash === fileHash) {
        return true;
      }

      // Verificar por nombre y tamaño (mismo archivo)
      if (existingImage.file.name === file.name && existingImage.file.size === file.size) {
        return true;
      }

      return false;
    });
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) return false;
    if (file.size > maxSize * 1024 * 1024) return false;
    return true;
  };

  const addImages = useCallback(
    async (files: File[]) => {
      const validFiles = files.filter(validateFile);
      const availableSlots = maxImages - images.length;
      const filesToAdd = validFiles.slice(0, availableSlots);

      if (filesToAdd.length === 0) return;

      const newImages: ImageFile[] = [];
      let duplicatesCount = 0;

      for (const file of filesToAdd) {
        try {
          const fileHash = await generateFileHash(file);

          if (isDuplicate(file, fileHash)) {
            duplicatesCount++;
            continue;
          }

          const clonedFile = new File([file], file.name, { type: file.type });
          newImages.push({
            id: generateId(),
            file: clonedFile,
            previewUrl: URL.createObjectURL(clonedFile),
            hash: fileHash,
          });
        } catch (error) {
          console.log('Error processing file:', error);
          // Si falla la generación del hash, continuar sin hash
          const clonedFile = new File([file], file.name, { type: file.type });
          newImages.push({
            id: generateId(),
            file: clonedFile,
            previewUrl: URL.createObjectURL(clonedFile),
          });
        }
      }

      // Mostrar notificación si hay duplicados
      if (duplicatesCount > 0) {
        toast({
          title: 'Imágenes duplicadas detectadas',
          description: `${duplicatesCount} imagen${duplicatesCount > 1 ? 'es' : ''} no se agregó${duplicatesCount > 1 ? 'ron' : ''} porque ya existe${duplicatesCount > 1 ? 'n' : ''} en la galería.`,
        });
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        onImagesChange(updatedImages);
      }
    },
    [images, maxImages, onImagesChange, preventDuplicates]
  );

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    addImages(Array.from(files));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    handleFileSelect(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) fileInputRef.current.click();
  };

  const getAspectRatioClass = () => {
    if (className && (className.includes('h-') || className.includes('height'))) return '';
    switch (aspectRatio) {
      case '16/9':
        return 'aspect-video';
      case '4/3':
        return 'aspect-[4/3]';
      default:
        return 'aspect-square';
    }
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {canAddMore && (
        <div
          className={cn(
            'relative flex-1 cursor-pointer rounded-lg border-2 border-dashed transition-colors',
            getAspectRatioClass(),
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <div className='flex h-full flex-col items-center justify-center p-6 text-center'>
            <ImageIcon className='mb-2 h-8 w-8 text-gray-400' />
            <p className='mb-1 text-sm font-medium text-gray-700'>{placeholder}</p>
            <p className='text-xs text-gray-500'>
              PNG, JPG hasta {maxSize}MB • Máximo {maxImages} imágenes
              {preventDuplicates && ' • Se evitan duplicados'}
            </p>
            <Button type='button' variant='outline' size='sm' className='mt-2' disabled={disabled}>
              <Upload className='mr-1 h-3 w-3' />
              Seleccionar imágenes
            </Button>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        multiple
        className='hidden'
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};
