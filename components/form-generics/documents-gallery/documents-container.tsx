import { ExternalLink, FileText, FileSpreadsheet, File, ImageIcon, X } from 'lucide-react';

// Tipo para documentos unificados (archivos + URLs)
interface UnifiedDocument {
  id: string;
  type: 'file' | 'url';
  file?: File;
  url?: string;
  name: string;
  size: number;
  fileExtension: string;
}

type DocumentContainerProps = {
  documents: UnifiedDocument[];
  removeFile: (id: string) => void;
};

const DocumentsContainer = ({ documents, removeFile }: DocumentContainerProps) => {
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
    <div className='flex w-full flex-col items-center'>
      <h3 className='mb-4 text-lg font-bold'>Documentos</h3>
      {documents.length > 0 ? (
        <div className='w-full space-y-2'>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className='flex items-center justify-between rounded-lg border bg-white p-3'
            >
              <div className='flex min-w-0 flex-1 items-center space-x-3'>
                {getFileIcon(doc.fileExtension)}
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{doc.name}</p>
                  <p className='text-xs text-gray-500'>
                    {doc.type === 'file' ? `${(doc.size / 1024 / 1024).toFixed(2)} MB •` : ''}
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
        <div className='flex h-32 w-full items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-50'>
          <p className='text-sm text-gray-500'>No hay documentos agregados</p>
        </div>
      )}
    </div>
  );
};

export { DocumentsContainer };
