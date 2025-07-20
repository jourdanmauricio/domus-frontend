import {
  ClipboardList,
  X,
  FileText,
  FileSpreadsheet,
  File,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import 'keen-slider/keen-slider.min.css';
import { useCallback, useState, useEffect, useMemo } from 'react';

import { FileUploader } from '@/components/form-generics';
import { FileItem } from '@/components/form-generics/images-gallery/file-uploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagesContainer } from '@/components/form-generics/images-gallery/images-container';
import { useFormContext } from '@/lib/contexts/form-context';

// Tipo unificado para manejar tanto archivos como URLs
export interface UnifiedImageItem {
  id: string;
  type: 'file' | 'url';
  file?: File;
  url?: string;
  previewUrl: string;
  hash?: string;
  name: string;
}

// Función helper para verificar si algo es un archivo de manera segura
const isFile = (item: any): boolean => {
  return (
    typeof window !== 'undefined' &&
    item &&
    typeof item === 'object' &&
    'name' in item &&
    'size' in item &&
    'type' in item &&
    typeof item.name === 'string' &&
    typeof item.size === 'number' &&
    typeof item.type === 'string'
  );
};

const ImagesGalery = () => {
  const { form } = useFormContext();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [containerKey, setContainerKey] = useState(0); // Key para forzar re-montaje

  // Función para obtener extensión de archivo desde URL
  const getFileExtensionFromUrl = (url: string): string => {
    const fileName = url.split('/').pop() || '';
    return fileName.split('.').pop()?.toLowerCase() || '';
  };

  // Obtener URLs existentes del formulario
  const existingImages = form.watch('images') || [];
  const existingImageUrls = Array.isArray(existingImages)
    ? existingImages.filter((img) => typeof img === 'string')
    : [];

  // Obtener URLs de documentos existentes del formulario
  const existingDocuments = form.watch('documents') || [];
  const existingDocumentUrls = Array.isArray(existingDocuments)
    ? existingDocuments.filter((doc) => typeof doc === 'string')
    : [];

  // Separar imágenes y documentos de archivos
  const imageFiles = files.filter((file) => file.fileType === 'image');
  const documentFiles = files.filter((file) => file.fileType === 'document');

  // Convertir FileItem[] y URLs a UnifiedImageItem[] para el componente ImagesContainer
  const unifiedImages: UnifiedImageItem[] = useMemo(() => {
    const fileImages: UnifiedImageItem[] = imageFiles.map((file) => ({
      id: file.id,
      type: 'file',
      file: file.file,
      previewUrl: URL.createObjectURL(file.file),
      hash: file.hash,
      name: file.file.name,
    }));

    const urlImages: UnifiedImageItem[] = existingImageUrls.map((url, index) => ({
      id: `url-${index}`,
      type: 'url',
      url: url,
      previewUrl: url,
      name: `Imagen ${index + 1}`,
    }));

    return [...fileImages, ...urlImages];
  }, [imageFiles, existingImageUrls]);

  // Crear lista unificada de documentos (archivos + URLs)
  const unifiedDocuments = useMemo(() => {
    const fileDocuments = documentFiles.map((file) => ({
      id: file.id,
      type: 'file' as const,
      file: file.file,
      name: file.file.name,
      size: file.size,
      fileExtension: file.fileExtension,
    }));

    const urlDocuments = existingDocumentUrls.map((url, index) => ({
      id: `doc-url-${index}`,
      type: 'url' as const,
      url: url,
      name: `Documento ${index + 1}`,
      size: 0, // No tenemos el tamaño real
      fileExtension: getFileExtensionFromUrl(url),
    }));

    return [...fileDocuments, ...urlDocuments];
  }, [documentFiles, existingDocumentUrls, getFileExtensionFromUrl]);

  // Limpieza global al desmontar
  useEffect(() => {
    return () => {
      unifiedImages.forEach((image) => {
        if (image.type === 'file') {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, [unifiedImages]);

  // Función para sincronizar archivos con el formulario
  const syncFilesWithForm = useCallback(
    (currentFiles: FileItem[]) => {
      const imageFiles = currentFiles
        .filter((file) => file.fileType === 'image')
        .map((file) => file.file);
      const documentFiles = currentFiles
        .filter((file) => file.fileType === 'document')
        .map((file) => file.file);

      // Combinar archivos nuevos con URLs existentes y filtrar elementos vacíos
      const allImages = [...existingImageUrls, ...imageFiles].filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          item !== '' &&
          (typeof item === 'string' || isFile(item))
      );
      const allDocuments = [...existingDocumentUrls, ...documentFiles].filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          item !== '' &&
          (typeof item === 'string' || isFile(item))
      );

      form.setValue('images', allImages, { shouldValidate: true });
      form.setValue('documents', allDocuments, { shouldValidate: true });
    },
    [form, existingImageUrls, existingDocumentUrls]
  );

  const handleFilesChange = useCallback(
    (newFiles: FileItem[]) => {
      setFiles(newFiles);
      // Sincronizar con el formulario
      syncFilesWithForm(newFiles);
      // Forzar re-montaje del container cuando cambien los archivos
      setContainerKey((prev) => prev + 1);
    },
    [syncFilesWithForm]
  );

  const removeFile = useCallback(
    (id: string) => {
      // Determinar si es un archivo o URL
      const isUrl = id.startsWith('url-');
      const isDocUrl = id.startsWith('doc-url-');

      if (isUrl) {
        // Eliminar URL de imagen del formulario
        const urlIndex = parseInt(id.replace('url-', ''));
        const updatedUrls = existingImageUrls.filter((_, index) => index !== urlIndex);
        form.setValue('images', updatedUrls, { shouldValidate: true });
      } else if (isDocUrl) {
        // Eliminar URL de documento del formulario
        const urlIndex = parseInt(id.replace('doc-url-', ''));
        const updatedUrls = existingDocumentUrls.filter((_, index) => index !== urlIndex);
        form.setValue('documents', updatedUrls, { shouldValidate: true });
      } else {
        // Eliminar archivo
        const updatedFiles = files.filter((file) => file.id !== id);
        setFiles(updatedFiles);
        // Sincronizar con el formulario
        syncFilesWithForm(updatedFiles);
      }

      // Forzar re-montaje del container al eliminar
      setContainerKey((prev) => prev + 1);
    },
    [files, syncFilesWithForm, existingImageUrls, existingDocumentUrls, form]
  );

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

    return iconMap[extension] || <File className='h-5 w-5 text-gray-500' />;
  };

  return (
    <Card className='pb-8'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between text-primary'>
          <div className='flex items-center'>
            <ClipboardList className='mr-2 h-5 w-5' />
            Galería de imágenes y documentos
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='pb-0'>
        <div className='flex flex-col gap-8'>
          <div className='flex gap-6'>
            <ImagesContainer
              key={containerKey} // Forzar re-montaje
              images={unifiedImages}
              removeImage={removeFile}
            />

            <div className='w-1/2'>
              <h3 className='mb-4 text-lg font-bold'>Documentos</h3>
              {unifiedDocuments.length > 0 ? (
                <div className='space-y-2'>
                  {unifiedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className='flex items-center justify-between rounded-lg border bg-white p-3'
                    >
                      <div className='flex min-w-0 flex-1 items-center space-x-3'>
                        {getFileIcon(doc.fileExtension)}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium'>{doc.name}</p>
                          <p className='text-xs text-gray-500'>
                            {doc.type === 'file'
                              ? `${(doc.size / 1024 / 1024).toFixed(2)} MB •`
                              : ''}
                            {doc.fileExtension.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-2'>
                        {/* Link de descarga para URLs */}
                        {doc.type === 'url' && (
                          <a
                            href={doc.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='rounded-full bg-blue-500 p-1 text-white opacity-80 transition-colors hover:bg-blue-600'
                            aria-label='Ver documento'
                          >
                            <ExternalLink className='h-4 w-4' />
                          </a>
                        )}

                        {/* Botón eliminar */}
                        <button
                          type='button'
                          onClick={() => removeFile(doc.id)}
                          className='rounded-full bg-red-500 p-1 text-white opacity-80 transition-colors hover:bg-red-600'
                          aria-label='Eliminar documento'
                        >
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50'>
                  <p className='text-sm text-gray-500'>No hay documentos agregados</p>
                </div>
              )}
            </div>
          </div>
          <div className='min-h-[320px]'>
            <FileUploader
              className='w-full'
              files={files}
              onFilesChange={handleFilesChange}
              maxFiles={10}
              maxSize={5}
              accept='image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.csv'
              fileType='mixed'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { ImagesGalery };
