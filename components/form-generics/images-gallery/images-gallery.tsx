import { FileUploader, ImageUploader } from '@/components/form-generics';
import { FileItem } from '@/components/form-generics/images-gallery/file-uploader';
import { ImageFile } from '@/components/form-generics/image-uploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import {
  ClipboardList,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  File,
  Image as ImageIcon,
} from 'lucide-react';
import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import 'keen-slider/keen-slider.min.css';
import { ImagesContainer } from '@/components/form-generics/images-gallery/images-container';
import { useFormContext } from '@/lib/contexts/form-context';

const ImagesGalery = () => {
  const { form } = useFormContext();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [containerKey, setContainerKey] = useState(0); // Key para forzar re-montaje

  // Separar imágenes y documentos
  const images = files.filter((file) => file.fileType === 'image');
  const documents = files.filter((file) => file.fileType === 'document');

  // Convertir FileItem[] a ImageFile[] para el componente ImagesContainer con URLs memoizadas
  const imageFiles: ImageFile[] = useMemo(() => {
    return images.map((file) => ({
      id: file.id,
      file: file.file,
      previewUrl: URL.createObjectURL(file.file),
      hash: file.hash,
    }));
  }, [images]);

  // Limpieza global al desmontar
  useEffect(() => {
    return () => {
      imageFiles.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [imageFiles]);

  // Función para sincronizar archivos con el formulario
  const syncFilesWithForm = useCallback(
    (currentFiles: FileItem[]) => {
      const imageFiles = currentFiles
        .filter((file) => file.fileType === 'image')
        .map((file) => file.file);
      const documentFiles = currentFiles
        .filter((file) => file.fileType === 'document')
        .map((file) => file.file);

      form.setValue('images', imageFiles, { shouldValidate: true });
      form.setValue('documents', documentFiles, { shouldValidate: true });
    },
    [form]
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
      const updatedFiles = files.filter((file) => file.id !== id);
      setFiles(updatedFiles);
      // Sincronizar con el formulario
      syncFilesWithForm(updatedFiles);
      // Forzar re-montaje del container al eliminar
      setContainerKey((prev) => prev + 1);
    },
    [files, syncFilesWithForm]
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
              images={imageFiles}
              removeImage={removeFile}
            />
            <div className='w-1/2'>
              <h3 className='mb-4 text-lg font-bold'>Documentos</h3>
              {documents.length > 0 ? (
                <div className='space-y-2'>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className='flex items-center justify-between rounded-lg border bg-white p-3'
                    >
                      <div className='flex min-w-0 flex-1 items-center space-x-3'>
                        {getFileIcon(doc.fileExtension)}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium'>{doc.file.name}</p>
                          <p className='text-xs text-gray-500'>
                            {(doc.size / 1024 / 1024).toFixed(2)} MB •{' '}
                            {doc.fileExtension.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center space-x-2'>
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
