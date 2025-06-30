import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/form";
import { TextareaHTMLAttributes, forwardRef } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type BaseTextareaFieldProps = {
  label: string;
  name: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  description?: string;
};

type TextareaFieldProps = BaseTextareaFieldProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    keyof BaseTextareaFieldProps
  >;

const TextareaFieldComponent = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      label,
      name,
      className,
      labelClassName,
      errorClassName,
      description,
      ...props
    },
    ref
  ) => {
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();

    return (
      <FormItem className={className}>
        <FormLabel
          className={cn("text-sm font-medium text-gray-700", labelClassName)}
        >
          {label}
        </FormLabel>
        <FormControl>
          <Textarea
            ref={ref}
            id={formItemId}
            aria-describedby={description ? formDescriptionId : undefined}
            className={cn(
              "min-h-[80px] resize-none",
              error && "border-destructive focus-visible:ring-destructive"
            )}
            {...props}
          />
        </FormControl>
        {description && (
          <p id={formDescriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {/* Espacio fijo para el mensaje de error */}
        <div className="h-5 flex items-start">
          <FormMessage
            className={cn(
              "text-xs transition-all duration-200 ease-in-out",
              error
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1 pointer-events-none",
              errorClassName
            )}
          />
        </div>
      </FormItem>
    );
  }
);

TextareaFieldComponent.displayName = "TextareaField";

export const TextareaField = ({ name, ...props }: TextareaFieldProps) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <TextareaFieldComponent {...field} {...props} name={name} />
      )}
    />
  );
};

export default TextareaField;
