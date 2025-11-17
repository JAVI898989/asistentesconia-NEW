import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely serialize Firebase errors for logging
 */
export function serializeFirebaseError(error: any): string {
  if (!error) return "No error provided";

  try {
    const errorInfo = {
      message: error?.message || "No message",
      code: error?.code || "No code",
      name: error?.name || "No name",
      type: typeof error,
      stack: error?.stack?.split('\n')[0] || "No stack trace"
    };

    return JSON.stringify(errorInfo, null, 2);
  } catch (serializationError) {
    return `Error serialization failed: ${error?.toString() || 'Unknown error'}`;
  }
}

/**
 * Log Firebase errors with consistent formatting
 */
export function logFirebaseError(context: string, error: any): void {
  console.error(`🔥 ${context}:`, serializeFirebaseError(error));

  // Also log the raw error for debugging
  if (error) {
    console.error(`🔥 ${context} (raw):`, error);
  }
}
