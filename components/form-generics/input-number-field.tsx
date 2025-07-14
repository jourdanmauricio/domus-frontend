import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, useRef } from 'react';
import { useFormContext, UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type BaseInputFieldProps = {
  label: string;
  name: string;
  // form?: UseFormReturn<any>;
  className?: string;
  labelClassName?: string;
  enableClean?: boolean;
  errorClassName?: string;
  regExp?: RegExp;
  integerDigits?: number;
  decimalDigits?: number;
};

type InputFieldProps = BaseInputFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | keyof BaseInputFieldProps>;

/**
 * Componente que permite aplicar validaciones dinámicas mediante expresiones regulares, limitar la cantidad de dígitos enteros
 * y decimales, solo cantidad de dígitos enteros, o solo dígitos numéricos.
 *
 * Normalización:
 * - Si el valor inicial posee un punto (.) lo remplaza por coma (,)
 * - De la misma manera, al editar el valor almacenado en el formulario reemplaza coma (,) por (.)
 *
 * Funcionamiento:
 * - si se envía un expresión regular se aplicará "en vivo" al ingreso de caracteres
 * - Si no recibe la prop regExp, aplicará la restricción utilizando la cantidad de enteros y de decimales indicado
 * - Si no recibe regExp no decimalDigits, utilizará integerDigits para restringir la cantidad de dígitos
 * - Si no se envían props solo permite el ingreso de caracteres numéricos
 *
 * Props:
 * @param {RegExp} [regExp] - Expresión regular personalizada para validar el valor ingresado.
 * @param {number} [integerDigits] - Cantidad máxima de dígitos enteros permitidos.
 * @param {number} [decimalDigits] - Cantidad máxima de dígitos decimales permitidos.
 *
 * @returns {JSX.Element} El campo de entrada numérica renderizado.
 */
export function InputNumberField({
  label,
  name,
  // form,
  className,
  labelClassName,
  enableClean,
  errorClassName,
  regExp,
  integerDigits,
  decimalDigits,
  ...props
}: InputFieldProps) {
  const { getFieldState, formState, getValues, setValue } = useFormContext();

  const fieldState = getFieldState(name, formState);

  const lastKeyRef = useRef<string | null>(null);

  // Si recibimos regExp, la utilizamos
  const dynamicRegex =
    regExp ??
    (() => {
      // Si recibimos integerDigits y decimalDigits armamos la expresión regular. Ej:(7, 2) -> 1511111,15
      if (typeof integerDigits === 'number' && typeof decimalDigits === 'number') {
        return new RegExp(`^-?(\\d{0,${integerDigits}})?(,\\d{0,${decimalDigits}})?$`);
      }

      // Si recibimos integerDigits restringimos a la cantidad indicada. Ej: (5) -> 15155
      if (typeof integerDigits === 'number') {
        return new RegExp(`^\\d{0,${integerDigits}}$`);
      }

      // Si no recibimos parámetros restringimos el ingreso solo a números
      return /^\d*$/;
    })();

  return (
    <FormField
      // control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={cn('text-sm font-medium text-gray-700', labelClassName)}>
            {label}
          </FormLabel>
          {enableClean && field.value && (
            <div className='relative w-full'>
              <div
                className='absolute right-3 top-5 -translate-y-1/2 transform cursor-pointer'
                onClick={() => field.onChange('')}
              >
                <X className='h-4 w-4 text-neutral-500' />
              </div>
            </div>
          )}
          <FormControl>
            <Input
              type='text'
              tabIndex={props.readOnly ? -1 : 0}
              className={cn(
                'h-11 rounded-md border-2 outline-none transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                enableClean && props.value && 'pr-10',
                fieldState.error
                  ? 'border-destructive focus:border-destructive'
                  : 'border-gray-300 focus:border-primary'
              )}
              // {...field}
              value={typeof field.value === 'string' ? field.value.replace('.', ',') : field.value}
              onKeyDown={(e) => {
                lastKeyRef.current = e.key;
              }}
              onChange={(e) => {
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                const value = e.target.value;

                const validValue = !dynamicRegex || dynamicRegex.test(value) || value === '';

                if (!validValue && !allowedKeys.includes(lastKeyRef.current || '')) {
                  e.target.value = getValues(name);
                  return;
                }

                // field.onChange(e);
                // props.onChange?.(e);
                const normalizedValue = value.replace(',', '.');

                field.onChange(normalizedValue);
                props.onChange?.(e);
              }}
              onFocus={(e) => {
                field.onBlur();
                if (props.onFocus) {
                  props.onFocus(e);
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                let newValue = value;

                if (value.endsWith(',')) {
                  newValue = value.replace(',', '');
                  e.target.value = newValue;
                  setValue(name, newValue.replace(',', '.'));
                }

                field.onBlur();
                props.onBlur?.(e);
              }}
              {...props}
            />
          </FormControl>
          <div className='flex h-5 items-start'>
            <FormMessage
              className={cn(
                'text-xs transition-all duration-200 ease-in-out',
                fieldState.error
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-1 opacity-0',
                errorClassName
              )}
            />
          </div>
        </FormItem>
      )}
    />
  );
}
