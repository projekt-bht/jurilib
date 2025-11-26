import { NextResponse } from "next/server";

/**
 * Uniform error wrapper that carries an HTTP status so API handlers can throw
 * instead of manually building responses everywhere.
 */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function handleApiError(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(fallbackMessage, error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
