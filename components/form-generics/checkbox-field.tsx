import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type CheckboxFieldProps = {
  label: string;
  name: string;
  className?: string;
  labelClassName?: string;
  description?: string;
  errorClassName?: string;
};

export const CheckboxField = ({
  label,
  name,
  className,
  labelClassName,
  description,
  errorClassName,
}: CheckboxFieldProps) => {
  const { error, formItemId, formDescriptionId } = useFormField();

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex items-center space-x-2", className)}>
          <FormControl>
            <Checkbox
              id={formItemId}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-describedby={description ? formDescriptionId : undefined}
              className="align-middle"
            />
          </FormControl>
          <FormLabel
            htmlFor={formItemId}
            className={cn(
              "text-sm text-gray-600 leading-tight !mt-0 p-0 align-middle cursor-pointer",
              labelClassName
            )}
            style={{
              lineHeight: "1.5rem",
              display: "inline-flex",
              alignItems: "center",
              height: "1.5rem",
            }}
          >
            {label}
          </FormLabel>
          <FormMessage className={cn("text-xs", errorClassName)} />
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
