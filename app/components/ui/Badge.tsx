import type { ComponentProps } from "react";
import { cn } from "@/utilities/cn";

type BadgeTone = "neutral" | "transit" | "walk" | "danger";

/**
 * Filled rather than tinted: a solid brand block keeps small text legible and
 * matches the segmented-control styling used for travel modes.
 */
const TONES: Record<BadgeTone, string> = {
  neutral: "border-mist bg-mist text-slate",
  transit: "border-transit-500 bg-transit-500 text-paper",
  walk: "border-walk-500 bg-walk-500 text-paper",
  danger: "border-danger bg-danger text-paper",
};

interface BadgeProps extends ComponentProps<"span"> {
  tone?: BadgeTone;
}

const Badge = ({ tone = "neutral", className, ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono",
      "text-caption font-medium tracking-[0.08em] uppercase whitespace-nowrap",
      TONES[tone],
      className
    )}
    {...props}
  />
);

export default Badge;