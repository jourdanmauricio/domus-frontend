import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BaseBooleanCheckboxProps = {
  label: string;
  name: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  description?: string;
};

type BooleanCheckboxProps = BaseBooleanCheckboxProps &
  Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, keyof BaseBooleanCheckboxProps>;

const BooleanCheckboxComponent = forwardRef<
  React.ComponentRef<typeof Checkbox>,
  BooleanCheckboxProps
>(({ label, name, className, labelClassName, errorClassName, description, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <FormItem className={cn('flex flex-row items-center space-x-3 space-y-0 p-4', className)}>
      <FormControl>
        <Checkbox
          ref={ref}
          id={formItemId}
          aria-describedby={description ? formDescriptionId : undefined}
          className={cn(
            'mt-0 transition-colors',
            error && 'border-destructive focus:border-destructive'
          )}
          {...props}
        />
      </FormControl>
      <div className='space-y-1 leading-none'>
        <FormLabel
          className={cn(
            'cursor-pointer text-sm font-medium text-gray-700',
            labelClassName,
            props.disabled && 'cursor-not-allowed'
          )}
        >
          {label}
        </FormLabel>
        {description && (
          <p id={formDescriptionId} className='text-sm text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
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
});

BooleanCheckboxComponent.displayName = 'BooleanCheckbox';

// Wrapper que incluye FormField
export const BooleanCheckbox = ({ name, ...props }: BooleanCheckboxProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => <BooleanCheckboxComponent {...field} {...props} name={name} />}
    />
  );
};

export default BooleanCheckbox;
