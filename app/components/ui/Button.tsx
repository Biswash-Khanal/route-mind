import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/utilities/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "border-ink bg-ink text-paper hover:border-slate hover:bg-slate",
  secondary: "border-mist bg-surface text-ink hover:border-ink",
  ghost: "border-transparent bg-transparent text-slate hover:bg-mist hover:text-ink",
  danger: "border-danger bg-danger text-paper hover:bg-danger/85",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-small",
  md: "h-10 px-4 text-small",
  lg: "h-12 px-6 text-body",
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * Shared class recipe for every button in the app. Exported so links and ad-hoc
 * elements can match a `<Button>` without rendering one.
 */
export const buttonClasses = ({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-md border font-medium",
    "whitespace-nowrap transition-colors",
    VARIANTS[variant],
    SIZES[size],
    className
  );

export interface ButtonProps
  extends ComponentProps<"button">,
    Pick<ButtonStyleOptions, "variant" | "size"> {}

const Button = ({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={buttonClasses({ variant, size, className })}
    {...props}
  />
);

export interface ButtonLinkProps
  extends ComponentProps<typeof Link>,
    Pick<ButtonStyleOptions, "variant" | "size"> {}

/** Anchor-styled counterpart to `Button`, so CTAs are real navigable links. */
const ButtonLink = ({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) => (
  <Link className={buttonClasses({ variant, size, className })} {...props} />
);

export default Button;
export { ButtonLink };