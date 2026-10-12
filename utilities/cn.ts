/**
 * Tiny class name joiner.
 *
 * Falsy entries are dropped so callers can write conditional classes inline
 * (`cn("base", isActive && "active")`) without producing `false`/`undefined`
 * strings or a dependency on `clsx`/`tailwind-merge`.
 */
export const cn = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(" ");