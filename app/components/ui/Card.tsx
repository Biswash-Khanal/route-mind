import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/utilities/cn";

/**
 * The single raised surface in the system: a white card with a hairline border
 * on the warm paper page. Everything else composes from this one shape.
 *
 * Props are the union of `div` and `button` attributes, because a Card is
 * sometimes a select target (a route result) and sometimes plain layout. There
 * are no attributes the two element types define incompatibly.
 */
type CardProps = ComponentProps<"div"> &
  ComponentProps<"button"> & {
    /** Draws a 3px accent rule along the top edge to mark a featured card. */
    accent?: "transit" | "walk";
    /** Cards double as select targets in the results list, so they are not always a `div`. */
    as?: ElementType;
  };

const Card = ({
  accent,
  as: Tag = "div",
  className,
  ...props
}: CardProps) => (
  <Tag
    className={cn(
      "card",
      accent && "overflow-hidden border-t-[3px]",
      accent === "transit" && "border-t-transit-500",
      accent === "walk" && "border-t-walk-500",
      className
    )}
    {...props}
  />
);

interface CardTitleProps extends ComponentProps<"h2"> {
  eyebrow?: ReactNode;
}

const CardTitle = ({
  eyebrow,
  className,
  children,
  ...props
}: CardTitleProps) => (
  <div className={cn("flex flex-col gap-1", className)}>
    {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
    <h2 {...props}>{children}</h2>
  </div>
);

export default Card;
export { CardTitle };