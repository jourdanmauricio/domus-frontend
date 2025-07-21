import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
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

export const BooleanCheckbox = ({ name, ...props }: BooleanCheckboxProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => {
        const { error, formDescriptionId } = useFormField();

        return (
          <FormItem
            className={cn('flex flex-row items-center space-x-3 space-y-0 p-4', props.className)}
          >
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-describedby={props.description ? formDescriptionId : undefined}
                className={cn(
                  'mt-0 transition-colors',
                  error && 'border-destructive focus:border-destructive'
                )}
                disabled={props.disabled}
              />
            </FormControl>
            <div className='space-y-1 leading-none'>
              <FormLabel
                className={cn(
                  'cursor-pointer text-sm font-medium text-gray-700',
                  props.labelClassName,
                  props.disabled && 'cursor-not-allowed'
                )}
              >
                {props.label}
              </FormLabel>
              {props.description && (
                <p id={formDescriptionId} className='text-sm text-muted-foreground'>
                  {props.description}
                </p>
              )}
            </div>
            {/* Espacio fijo para el mensaje de error */}
            <div className='flex h-5 items-start'>
              <FormMessage
                className={cn(
                  'text-xs transition-all duration-200 ease-in-out',
                  error
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-1 opacity-0',
                  props.errorClassName
                )}
              />
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default BooleanCheckbox;
