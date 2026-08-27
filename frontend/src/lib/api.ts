const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export interface ZodFlatError {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
}

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string[] | undefined>;
  constructor(message: string, status: number, fieldErrors: Record<string, string[] | undefined> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isJsonBody = typeof options.body === "string";
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const errorField = body?.error;
    if (typeof errorField === "string") {
      throw new ApiError(errorField, res.status);
    }
    if (errorField && typeof errorField === "object") {
      const zodError = errorField as Partial<ZodFlatError>;
      const message = zodError.formErrors?.[0] ?? "Validation failed";
      throw new ApiError(message, res.status, zodError.fieldErrors ?? {});
    }
    throw new ApiError(`Request failed (${res.status})`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),
  postForm: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", body: formData }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
