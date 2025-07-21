import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';
import { InputHTMLAttributes, forwardRef } from 'react';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type BaseInputFieldProps = {
  label: string;
  name: string;
  className?: string;
  labelClassName?: string;
  enableClean?: boolean;
  errorClassName?: string;
  description?: string;
};

type InputFieldProps = BaseInputFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInputFieldProps>;

const InputFieldComponent = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, name, className, labelClassName, enableClean, errorClassName, description, ...props },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <FormItem className={className}>
        <FormLabel className={cn('text-sm font-medium text-gray-700', labelClassName)}>
          {label} {props.required && <span>*</span>}
        </FormLabel>
        <div className='relative'>
          {enableClean && props.value && (
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors hover:text-gray-600'
              onClick={() => {
                const event = {
                  target: { value: '' },
                } as React.ChangeEvent<HTMLInputElement>;
                props.onChange?.(event);
              }}
              aria-label='Limpiar campo'
            >
              <X className='h-4 w-4 text-neutral-500' />
            </button>
          )}
          <FormControl>
            <Input
              ref={ref}
              id={formItemId}
              aria-describedby={description ? formDescriptionId : undefined}
              className={cn(
                'h-11 rounded-md border-2 outline-none transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                enableClean && props.value && 'pr-10',
                error
                  ? 'border-destructive focus:border-destructive'
                  : 'border-gray-300 focus:border-primary'
              )}
              {...props}
            />
          </FormControl>
        </div>
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

InputFieldComponent.displayName = 'InputField';

// Wrapper que incluye FormField
export const InputField = ({ name, ...props }: InputFieldProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => <InputFieldComponent {...field} {...props} name={name} />}
    />
  );
};

export default InputField;
