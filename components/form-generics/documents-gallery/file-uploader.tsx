import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  ExternalLink,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export interface FileItem {
  id: string;
  file: File;
  fileType: 'image' | 'document';
  fileExtension: string;
  size: number;
  hash?: string;
  cloudinaryUrl?: string; // URL después de subir a Cloudinary
  cloudinaryPublicId?: string; // ID público de Cloudinary
}

interface FileUploaderProps {
  files: FileItem[];
  onFilesChange: (files: FileItem[]) => void;
  maxFiles?: number;
  maxSize?: number; // en MB
  accept?: string;
  fileType?: 'images' | 'documents' | 'mixed';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  preventDuplicates?: boolean;
}

export const FileUploader = ({
  files,
  onFilesChange,
  maxFiles = 10,
  maxSize = 5,
  accept,
  fileType = 'mixed',
  placeholder = 'Arrastra archivos aquí o haz clic para seleccionar',
  className,
  disabled = false,
  preventDuplicates = true,
}: FileUploaderProps) => {
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

    return files.some((existingFile) => {
      // Verificar por hash (contenido idéntico)
      if (existingFile.hash && existingFile.hash === fileHash) {
        return true;
      }

      // Verificar por nombre y tamaño (mismo archivo)
      if (existingFile.file.name === file.name && existingFile.file.size === file.size) {
        return true;
      }

      return false;
    });
  };

  // Obtener extensión del archivo
  const getFileExtension = (fileName: string): string => {
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  // Determinar tipo de archivo
  const getFileType = (file: File): 'image' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    return 'document';
  };

  // Validar archivo según configuración
  const validateFile = (file: File): boolean => {
    const fileExtension = getFileExtension(file.name);
    const fileTypeCategory = getFileType(file);

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) return false;

    // Validar tipo según configuración
    if (fileType === 'images') {
      return fileTypeCategory === 'image';
    }

    if (fileType === 'documents') {
      return fileTypeCategory === 'document';
    }

    // mixed: aceptar ambos tipos
    return true;
  };

  // Icono según extensión
  const getFileIcon = (extension: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      // Imágenes
      jpg: <ImageIcon className='h-5 w-5 text-green-500' />,
      jpeg: <ImageIcon className='h-5 w-5 text-green-500' />,
      png: <ImageIcon className='h-5 w-5 text-green-500' />,
      gif: <ImageIcon className='h-5 w-5 text-green-500' />,
      webp: <ImageIcon className='h-5 w-5 text-green-500' />,

      // Documentos
      pdf: <FileText className='h-5 w-5 text-red-500' />,
      doc: <FileText className='h-5 w-5 text-blue-500' />,
      docx: <FileText className='h-5 w-5 text-blue-500' />,
      txt: <FileText className='h-5 w-5 text-gray-500' />,
      xlsx: <FileSpreadsheet className='h-5 w-5 text-green-600' />,
      xls: <FileSpreadsheet className='h-5 w-5 text-green-600' />,
      csv: <FileSpreadsheet className='h-5 w-5 text-green-600' />,
    };

    return iconMap[extension] || <FileIcon className='h-5 w-5 text-gray-500' />;
  };

  // Obtener texto descriptivo del tipo de archivo
  const getFileTypeDescription = () => {
    switch (fileType) {
      case 'images':
        return 'Imágenes (PNG, JPG, GIF, WebP)';
      case 'documents':
        return 'Documentos (PDF, DOC, DOCX, TXT, XLSX, XLS, CSV)';
      case 'mixed':
        return 'Archivos (Imágenes y Documentos)';
      default:
        return 'Archivos';
    }
  };

  const addFiles = useCallback(
    async (fileList: File[]) => {
      const validFiles = fileList.filter(validateFile);
      const availableSlots = maxFiles - files.length;
      const filesToAdd = validFiles.slice(0, availableSlots);

      if (filesToAdd.length === 0) return;

      const newFiles: FileItem[] = [];
      let duplicatesCount = 0;

      for (const file of filesToAdd) {
        try {
          const fileHash = await generateFileHash(file);

          if (isDuplicate(file, fileHash)) {
            duplicatesCount++;
            continue;
          }

          const clonedFile = new (File as any)([file], file.name, { type: file.type });
          newFiles.push({
            id: generateId(),
            file: clonedFile,
            fileType: getFileType(clonedFile),
            fileExtension: getFileExtension(clonedFile.name),
            size: clonedFile.size,
            hash: fileHash,
          });
        } catch (error) {
          console.log('Error processing file:', error);
          // Si falla la generación del hash, continuar sin hash
          const clonedFile = new (File as any)([file], file.name, { type: file.type });
          newFiles.push({
            id: generateId(),
            file: clonedFile,
            fileType: getFileType(clonedFile),
            fileExtension: getFileExtension(clonedFile.name),
            size: clonedFile.size,
          });
        }
      }

      // Mostrar notificación si hay duplicados
      if (duplicatesCount > 0) {
        toast({
          title: 'Archivos duplicados detectados',
          description: `${duplicatesCount} archivo${duplicatesCount > 1 ? 's' : ''} no se agregó${duplicatesCount > 1 ? 'ron' : ''} porque ya existe${duplicatesCount > 1 ? 'n' : ''} en la lista.`,
        });
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...files, ...newFiles];
        onFilesChange(updatedFiles);
      }
    },
    [files, maxFiles, onFilesChange, preventDuplicates, fileType, maxSize]
  );

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    addFiles(Array.from(files));
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

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId);
    onFilesChange(updatedFiles);
  };

  const canAddMore = files.length < maxFiles;

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      {/* Área de drag & drop */}
      {canAddMore && (
        <div
          className={cn(
            'relative cursor-pointer rounded-lg border-2 border-dashed transition-colors',
            'h-48',
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
            <Upload className='mb-2 h-8 w-8 text-gray-400' />
            <p className='mb-1 text-sm font-medium text-gray-700'>{placeholder}</p>
            <p className='text-xs text-gray-500'>
              {getFileTypeDescription()} hasta {maxSize}MB • Máximo {maxFiles} archivos
              {preventDuplicates && ' • Se evitan duplicados'}
            </p>
            <Button type='button' variant='outline' size='sm' className='mt-2' disabled={disabled}>
              <Upload className='mr-1 h-3 w-3' />
              Seleccionar archivos
            </Button>
          </div>
        </div>
      )}

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className='space-y-2'>
          <h4 className='text-sm font-medium text-gray-700'>
            Archivos seleccionados ({files.length}/{maxFiles})
          </h4>
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              className='flex items-center justify-between rounded-lg border bg-white p-3'
            >
              <div className='flex min-w-0 flex-1 items-center space-x-3'>
                {getFileIcon(fileItem.fileExtension)}
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{fileItem.file.name}</p>
                  <p className='text-xs text-gray-500'>
                    {(fileItem.size / 1024 / 1024).toFixed(2)} MB •{' '}
                    {fileItem.fileExtension.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                {/* Link de descarga/consulta (cuando esté disponible) */}
                {fileItem.cloudinaryUrl && (
                  <Button
                    variant='ghost'
                    size='sm'
                    asChild
                    className='text-blue-500 hover:text-blue-700'
                  >
                    <a
                      href={fileItem.cloudinaryUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      title='Ver/Descargar archivo'
                    >
                      <ExternalLink className='h-4 w-4' />
                    </a>
                  </Button>
                )}

                {/* Botón eliminar */}
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => handleRemoveFile(fileItem.id)}
                  className='text-red-500 hover:text-red-700'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input file oculto */}
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
