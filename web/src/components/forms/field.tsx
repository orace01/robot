import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const controlClass =
  "w-full rounded-[14px] bg-white px-4 text-[15px] ring-1 ring-line transition placeholder:text-faint focus:ring-2 focus:ring-ink focus:outline-none aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500";

interface WrapperProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

function FieldWrapper({ id, label, required, error, hint, className, children }: WrapperProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {!required && <span className="font-normal text-muted"> (facultatif)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-erreur`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-aide`} className="mt-1.5 text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-erreur`;
  if (hint) return `${id}-aide`;
  return undefined;
}

type FieldProps = { label: string; name: string; error?: string; hint?: string; className?: string };

/** Champ de formulaire avec libellé et message d'erreur accessibles. */
export function Field({ label, name, error, hint, className, ...props }: FieldProps & React.ComponentProps<"input">) {
  const id = `champ-${name}`;
  return (
    <FieldWrapper id={id} label={label} required={props.required} error={error} hint={hint} className={className}>
      <input
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlClass, "h-12")}
        {...props}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({
  label,
  name,
  error,
  hint,
  className,
  ...props
}: FieldProps & React.ComponentProps<"textarea">) {
  const id = `champ-${name}`;
  return (
    <FieldWrapper id={id} label={label} required={props.required} error={error} hint={hint} className={className}>
      <textarea
        id={id}
        name={name}
        rows={5}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(controlClass, "py-3")}
        {...props}
      />
    </FieldWrapper>
  );
}

export function SelectField({
  label,
  name,
  error,
  hint,
  className,
  children,
  ...props
}: FieldProps & React.ComponentProps<"select">) {
  const id = `champ-${name}`;
  return (
    <FieldWrapper id={id} label={label} required={props.required} error={error} hint={hint} className={className}>
      <div className="relative">
        <select
          id={id}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(controlClass, "h-12 appearance-none pr-10")}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" aria-hidden />
      </div>
    </FieldWrapper>
  );
}
