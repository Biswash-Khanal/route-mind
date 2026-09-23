export function sanitizeCallbackUrl(
  value: string | null | undefined,
  fallback = "/admin",
): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;

  return value;
}