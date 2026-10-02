import axios from "axios";

export interface ErrorResponse {
  error: string;
  field: string | null;
}

export interface ValidationErrorResponse {
  title?: string;
  status?: number;
  errors: Record<string, string[]>;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly field?: string | null;
  readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status?: number,
    field?: string | null,
    validationErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.status = status;
    this.field = field;
    this.validationErrors = validationErrors;
  }
}

export function toApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return new ApiError("An unexpected error occurred.");
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (isErrorResponse(data)) {
    return new ApiError(data.error, status, data.field);
  }

  if (isValidationErrorResponse(data)) {
    return new ApiError(data.title ?? "Validation failed.", status, undefined, data.errors);
  }

  return new ApiError("An unexpected API error occurred.", status);
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "error" in value && typeof value.error === "string";
}

function isValidationErrorResponse(value: unknown): value is ValidationErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "errors" in value && typeof value.errors === "object";
}
