import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const FIELD_BASE =
  "block w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-0";

export function FieldLabel({
  children,
  required,
  className,
  htmlFor,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  const cls = cn("block text-sm font-medium text-zinc-800", className);
  const content = (
    <>
      {children}
      {required && <span className="ml-0.5 text-red-600">*</span>}
    </>
  );
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={cls} {...rest}>
        {content}
      </label>
    );
  }
  return (
    <span className={cls} {...rest}>
      {content}
    </span>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-xs text-zinc-500">{children}</p>;
}

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>;
export function TextInput({ className, ...rest }: TextInputProps) {
  return <input className={cn(FIELD_BASE, className)} {...rest} />;
}

export type TextareaInputProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
export function TextareaInput({
  className,
  rows = 4,
  ...rest
}: TextareaInputProps) {
  return (
    <textarea className={cn(FIELD_BASE, className)} rows={rows} {...rest} />
  );
}

export type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement>;
export function SelectInput({
  className,
  children,
  ...rest
}: SelectInputProps) {
  return (
    <select
      className={cn(FIELD_BASE, "appearance-none bg-white pr-8", className)}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Field({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: ReactNode;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <FieldLabel htmlFor={htmlFor} required={required}>
        {label}
      </FieldLabel>
      {children}
      {hint && <FieldHint>{hint}</FieldHint>}
      <FieldError message={error} />
    </div>
  );
}
