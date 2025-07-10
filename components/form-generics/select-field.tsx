import { cn } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';
import { forwardRef, Suspense } from 'react';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type SelectOption = {
  id: string;
  name: string;
};

type BaseSelectFieldProps<T = any> = {
  label: string;
  name: string;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  description?: string;
  apiUrl?: string;
  dataMapper?: (item: T) => SelectOption & Record<string, any>;
};

type SelectFieldProps<T = any> = BaseSelectFieldProps<T> & {
  disabled?: boolean;
  value?: string;
  onChange?: (value: SelectOption & Record<string, any>) => void;
};

const SelectFieldComponent = forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      label,
      name,
      options,
      placeholder = 'Selecciona una opción',
      className,
      labelClassName,
      errorClassName,
      description,
      disabled = false,
      apiUrl,
      dataMapper,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    const { data, isLoading } = useQuery({
      queryKey: [`select-${name}`],
      queryFn: () => axios.get(apiUrl!),
      enabled: !!apiUrl,
    });

    const allOptions =
      options ??
      data?.data?.map((item: any) =>
        dataMapper ? dataMapper(item) : { id: item.id, name: item.name }
      ) ??
      [];

    // Verificar si el valor actual existe en las opciones disponibles
    // Solo validar si las opciones ya están cargadas
    const isValidValue =
      value &&
      (allOptions.length > 0
        ? allOptions.some((option: SelectOption) => option.id === value)
        : true);

    // Usar el valor si es válido o si las opciones aún no se han cargado
    const selectValue = isValidValue ? value : undefined;

    // Componente de fallback para Suspense
    const SelectFallback = () => (
      <div className='flex h-11 items-center rounded-md border-2 border-gray-300 bg-gray-50 px-3'>
        <span className='text-sm text-gray-500'>Cargando opciones...</span>
      </div>
    );

    return (
      <FormItem className={className}>
        <FormLabel className={cn('text-sm font-medium text-gray-700', labelClassName)}>
          {label}
        </FormLabel>
        <FormControl>
          {apiUrl ? (
            <Suspense fallback={<SelectFallback />}>
              <Select
                disabled={disabled || isLoading}
                value={selectValue}
                onValueChange={(selectedId: string) => {
                  const selectedOption = allOptions.find(
                    (option: SelectOption) => option.id === selectedId
                  );
                  if (selectedOption && onChange) {
                    onChange(selectedOption);
                  }
                }}
                {...props}
              >
                <SelectTrigger
                  ref={ref}
                  id={formItemId}
                  aria-describedby={description ? formDescriptionId : undefined}
                  className={cn(
                    'h-11 rounded-md border-2 outline-none transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                    error
                      ? 'border-destructive focus:border-destructive'
                      : 'border-gray-300 focus:border-primary'
                  )}
                >
                  <SelectValue placeholder={isLoading ? 'Cargando...' : placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {allOptions.map((option: SelectOption) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Suspense>
          ) : (
            <Select
              disabled={disabled}
              value={selectValue}
              onValueChange={(selectedId: string) => {
                const selectedOption = allOptions.find(
                  (option: SelectOption) => option.id === selectedId
                );
                if (selectedOption && onChange) {
                  onChange(selectedOption);
                }
              }}
              {...props}
            >
              <SelectTrigger
                ref={ref}
                id={formItemId}
                aria-describedby={description ? formDescriptionId : undefined}
                className={cn(
                  'h-11 rounded-md border-2 outline-none transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  error
                    ? 'border-destructive focus:border-destructive'
                    : 'border-gray-300 focus:border-primary'
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {allOptions.map((option: SelectOption) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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

SelectFieldComponent.displayName = 'SelectField';

// Wrapper que incluye FormField
export const SelectField = <T = any,>({ name, onChange, ...props }: SelectFieldProps<T>) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <SelectFieldComponent
          {...field}
          {...props}
          name={name}
          onChange={(value) => {
            // Actualizar el form con el id
            field.onChange(value.id);

            // Llamar al onChange personalizado si existe
            if (onChange) {
              onChange(value);
            }
          }}
        />
      )}
    />
  );
};

export default SelectField;
