import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

type BaseImageFieldProps = {
  label: string;
  name: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  description?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // en MB
  aspectRatio?: 'square' | '16/9' | '4/3';
  placeholder?: string;
};

type ImageFieldProps = BaseImageFieldProps & {
  value?: File | string | null;
  onChange?: (value: File | null) => void;
};

const ImageFieldComponent = forwardRef<HTMLInputElement, ImageFieldProps>(
  (
    {
      label,
      name,
      className,
      labelClassName,
      errorClassName,
      description,
      disabled = false,
      accept = 'image/*',
      maxSize = 5, // 5MB por defecto
      aspectRatio = 'square',
      placeholder = 'Seleccionar imagen',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generar preview cuando cambie el valor
    useEffect(() => {
      if (value instanceof File) {
        const url = URL.createObjectURL(value);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else if (typeof value === 'string' && value) {
        setPreviewUrl(value);
      } else {
        setPreviewUrl(null);
      }
    }, [value]);

    const handleFileSelect = (file: File) => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Validar tamaño
      if (file.size > maxSize * 1024 * 1024) {
        return;
      }

      onChange?.(file);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(false);

      const file = event.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };

    const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
      event.preventDefault();
      setDragActive(false);
    };

    const handleRemoveImage = () => {
      onChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleClick = () => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const getAspectRatioClass = () => {
      // Si hay una clase de altura específica en className, no aplicar aspect-ratio
      const hasHeightClass = className?.includes('h-');
      if (hasHeightClass) {
        return '';
      }

      switch (aspectRatio) {
        case '16/9':
          return 'aspect-video';
        case '4/3':
          return 'aspect-[4/3]';
        default:
          return 'aspect-square';
      }
    };

    return (
      <FormItem className={className}>
        <FormLabel className={cn('text-sm font-medium text-gray-700', labelClassName)}>
          {label}
        </FormLabel>
        <FormControl>
          <div className='relative'>
            {previewUrl ? (
              <div className='relative'>
                <div
                  className={cn(
                    'relative overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50',
                    getAspectRatioClass(),
                    error && 'border-destructive'
                  )}
                >
                  <img src={previewUrl} alt='Preview' className='h-full w-full object-cover' />
                  {!disabled && (
                    <button
                      type='button'
                      onClick={handleRemoveImage}
                      className='absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600'
                      aria-label='Eliminar imagen'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  'relative cursor-pointer rounded-lg border-2 border-dashed transition-colors',
                  getAspectRatioClass(),
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : error
                      ? 'border-destructive bg-destructive/5'
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
                  <p className='text-xs text-gray-500'>PNG, JPG hasta {maxSize}MB</p>
                  {/* <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='mt-2'
                    disabled={disabled}
                  >
                    <Upload className='mr-1 h-3 w-3' />
                    Subir imagen
                  </Button> */}
                </div>
              </div>
            )}
            <input
              ref={(node) => {
                // Manejar ambos refs
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                fileInputRef.current = node;
              }}
              type='file'
              accept={accept}
              className='hidden'
              onChange={handleFileChange}
              disabled={disabled}
              {...props}
            />
          </div>
        </FormControl>
        {description && (
          <p id={formDescriptionId} className='text-sm text-muted-foreground'>
            {description}
          </p>
        )}
        {/* Espacio fijo para el mensaje de error */}
        <div className='flex h-5 items-start'>
          <FormMessage
            className={cn(
              'text-xs transition-all duration-200 ease-in-out',
              error ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0',
              errorClassName
            )}
          />
        </div>
      </FormItem>
    );
  }
);

ImageFieldComponent.displayName = 'ImageField';

// Wrapper que incluye FormField
export const ImageField = ({ name, ...props }: ImageFieldProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <ImageFieldComponent
          {...field}
          {...props}
          name={name}
          value={field.value}
          onChange={(file) => {
            field.onChange(file);
            props.onChange?.(file);
          }}
        />
      )}
    />
  );
};
