type FlattenedZodError = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[] | undefined>;
};

/**
 * Extracts a human-readable message from an API error response body.
 * zod's `.flatten()` puts whole-form errors under `formErrors` but
 * field-specific errors (e.g. a missing required field) under
 * `fieldErrors` — a naive `data.error?.formErrors?.[0] ?? data.error`
 * silently falls through to the raw object in the field-error case,
 * which stringifies to "[object Object]" when passed to `new Error()`.
 */
export function extractErrorMessage(data: unknown, fallback = "Save failed"): string {
  if (data == null || typeof data !== "object") return fallback;
  const err = (data as { error?: unknown }).error;

  if (typeof err === "string") return err;

  if (err && typeof err === "object") {
    const flat = err as FlattenedZodError;
    if (flat.formErrors?.[0]) return flat.formErrors[0];
    for (const messages of Object.values(flat.fieldErrors ?? {})) {
      if (messages?.[0]) return messages[0];
    }
  }

  return fallback;
}
