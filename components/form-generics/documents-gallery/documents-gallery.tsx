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
import { FileItem } from '@/components/form-generics/documents-gallery/file-uploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagesContainer } from '@/components/form-generics/documents-gallery/images-container';
import { useFormContext } from '@/lib/contexts/form-context';
import { DocumentsContainer } from '@/components/form-generics/documents-gallery/documents-container';

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

const DocumentsGallery = () => {
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
          <div className='grid grid-cols-2 gap-6'>
            <ImagesContainer
              key={containerKey} // Forzar re-montaje
              images={unifiedImages}
              removeImage={removeFile}
            />

            <div className=''>
              <DocumentsContainer documents={unifiedDocuments} removeFile={removeFile} />
            </div>
          </div>
          <div className='min-h-[320px]'>
            <FileUploader
              className='w-full'
              files={files}
              onFilesChange={handleFilesChange}
              maxFiles={50}
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

export { DocumentsGallery };
