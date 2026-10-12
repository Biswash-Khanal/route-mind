import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/utilities/cn";

interface FieldProps {
  id: string;
  label: ReactNode;
  /** Validation message. Presence switches the control to the error style. */
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Label + control + message in one block, so the ~20 forms in the app share a
 * single vertical rhythm and a single error treatment.
 */
const Field = ({ id, label, error, hint, className, children }: FieldProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label htmlFor={id} className="text-small font-medium text-ink">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-caption text-danger">
        {error}
      </p>
    ) : hint ? (
      <p id={`${id}-hint`} className="text-caption text-slate">
        {hint}
      </p>
    ) : null}
  </div>
);

interface CheckboxProps extends ComponentProps<"input"> {
  label: ReactNode;
}

const Checkbox = ({ label, className, id, ...props }: CheckboxProps) => (
  <label
    htmlFor={id}
    className={cn(
      "flex cursor-pointer items-center gap-2.5 rounded-md border border-mist px-3 py-2",
      "text-small text-ink transition-colors hover:border-ink has-checked:border-ink",
      "has-checked:bg-mist",
      className
    )}
  >
    <input
      id={id}
      type="checkbox"
      className="size-4 shrink-0 cursor-pointer accent-transit-500"
      {...props}
    />
    {label}
  </label>
);

export default Field;
export { Checkbox };