'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { forwardRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type ComboboxFieldProps = {
  name: string;
  className?: string;
  label: string;
  labelClassName?: string;
  placeholder: string;
  apiUrl?: string;
  options?: { id: string; name: string }[];
  depeendFiled?: string;
  disabled?: boolean;
  isDisabledOnEmpty?: boolean;
};

type ComboboxFieldComponentProps = ComboboxFieldProps & {
  field: any;
};

const ComboboxFieldComponent = forwardRef<HTMLButtonElement, ComboboxFieldComponentProps>(
  (
    {
      name,
      className,
      label,
      labelClassName,
      placeholder,
      apiUrl,
      depeendFiled,
      options,
      field,
      disabled,
      isDisabledOnEmpty,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    return (
      <FormItem className={cn('flex flex-col', className)}>
        <FormLabel className={cn('text-sm font-medium text-gray-700', labelClassName)}>
          {label}
        </FormLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant='ghost'
                role='combobox'
                aria-expanded={open}
                // className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                className={cn(
                  `w-full justify-between border border-input font-normal hover:bg-background ${!field.value && 'text-muted-foreground hover:text-muted-foreground'}`,
                  className
                )}
                disabled={disabled || (isDisabledOnEmpty && options?.length === 0)}
              >
                {field.value
                  ? options?.find((item: any) => item.id === field.value)?.name
                  : placeholder}

                <ChevronsUpDown className='opacity-50' />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className='w-full min-w-[var(--radix-popover-trigger-width)] p-0'>
            <Command>
              <CommandInput placeholder='Search framework...' className='h-9' />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {options &&
                    options?.map((el: any) => (
                      <CommandItem
                        value={el.name}
                        key={el.id}
                        onSelect={() => {
                          field.onChange(el.id);
                        }}
                      >
                        {el.name}
                        <Check
                          className={cn(
                            'ml-auto',
                            el.id === field.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    );
  }
);

ComboboxFieldComponent.displayName = 'ComboboxField';

// Wrapper que incluye FormField
export const ComboboxField = ({ name, ...props }: ComboboxFieldProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => <ComboboxFieldComponent {...props} name={name} field={field} />}
    />
  );
};

export default ComboboxField;
