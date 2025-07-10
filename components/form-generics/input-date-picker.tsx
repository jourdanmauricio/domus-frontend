import { CircleX } from 'lucide-react';
import { format, isValid, parse } from 'date-fns';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type BaseInputDatePickerProps = {
  label: string;
  name: string;
  placeholder: string;
  className?: string;
  transform?: (value: string) => any;
  max?: Date;
  min?: Date;
  labelClassName?: string;
  disabled?: boolean;
  enableClean?: boolean;
  classNameClean?: string;
  onValueChange?: (value: string) => void;
  readOnly?: boolean;
  errorClassName?: string;
  validateOnChange?: boolean;
  description?: string;
};

type InputDatePickerProps = BaseInputDatePickerProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseInputDatePickerProps>;

const InputDatePickerComponent = forwardRef<HTMLInputElement, InputDatePickerProps>(
  (
    {
      label,
      name,
      placeholder,
      className,
      max,
      min,
      labelClassName,
      disabled,
      enableClean,
      classNameClean,
      onValueChange,
      readOnly = false,
      errorClassName,
      validateOnChange,
      description,
      onChange,
      ...props
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value === '') {
        onChange?.(e);
        onValueChange?.('');
        return;
      }

      const year = value.split('-')[0];
      if (year.length !== 4) {
        return;
      }

      try {
        const date = parse(value, 'yyyy-MM-dd', new Date());
        if (isValid(date)) {
          const newEvent = {
            ...e,
            target: { ...e.target, value: date },
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange?.(newEvent);
        } else {
          onChange?.(e);
        }
      } catch {
        onChange?.(e);
      }
      onValueChange?.(value);
    };

    return (
      <FormItem className={className}>
        <FormLabel className={cn('text-[1rem] font-normal', labelClassName)}>
          {label}
          {enableClean && props.value && (
            <div className='relative w-full'>
              <button
                type='button'
                className={cn('absolute bottom-3.5 right-0 text-red-500', classNameClean)}
                onClick={() => {
                  const event = {
                    target: { value: '' },
                  } as React.ChangeEvent<HTMLInputElement>;
                  onChange?.(event);
                  onValueChange?.('');
                }}
                aria-label='Limpiar campo'
              >
                <CircleX className='h-3 w-5' />
              </button>
            </div>
          )}
        </FormLabel>
        <FormControl>
          <Input
            ref={ref}
            id={formItemId}
            aria-describedby={description ? formDescriptionId : undefined}
            disabled={disabled}
            type='date'
            placeholder={placeholder}
            className={cn(
              'block h-11 rounded-md border-2 outline-none transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
              error
                ? 'border border-destructive text-destructive focus-visible:ring-destructive'
                : 'border-gray-300 focus:border-primary'
            )}
            max={max ? format(new Date(max), 'yyyy-MM-dd') : ''}
            min={min ? format(new Date(min), 'yyyy-MM-dd') : ''}
            {...props}
            value={
              props.value instanceof Date && isValid(props.value)
                ? format(props.value, 'yyyy-MM-dd')
                : props.value || ''
            }
            onChange={handleDateChange}
            inputMode={readOnly ? 'none' : 'text'}
            onKeyDown={readOnly ? (e) => e.preventDefault() : undefined}
          />
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

InputDatePickerComponent.displayName = 'InputDatePicker';

// Wrapper que incluye FormField
export const InputDatePicker = ({ name, ...props }: InputDatePickerProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => <InputDatePickerComponent {...field} {...props} name={name} />}
    />
  );
};

export default InputDatePicker;
