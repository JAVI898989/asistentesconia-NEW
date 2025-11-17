/**
 * Firebase Error Handler
 * Handles network errors and FullStory conflicts with Firebase operations
 */

import { FirebaseError } from 'firebase/app';

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryCondition?: (error: any) => boolean;
}

/**
 * Check if an error is related to network/fetch issues
 */
export function isNetworkError(error: any): boolean {
  const errorString = error.toString().toLowerCase();
  const errorMessage = error.message?.toLowerCase() || '';
  
  return (
    errorString.includes('failed to fetch') ||
    errorString.includes('network error') ||
    errorString.includes('fetch') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network') ||
    (error.code && error.code.includes('unavailable')) ||
    (error.code && error.code.includes('deadline-exceeded'))
  );
}

/**
 * Check if an error is related to FullStory interference
 */
export function isFullStoryError(error: any): boolean {
  const errorString = error.toString().toLowerCase();
  const errorMessage = error.message?.toLowerCase() || '';
  
  return (
    errorString.includes('fullstory') ||
    errorString.includes('fs.js') ||
    (error.stack && error.stack.includes('fullstory')) ||
    (error.stack && error.stack.includes('fs.js')) ||
    (error.stack && error.stack.includes('edge.fullstory.com'))
  );
}

/**
 * Retry a Firebase operation with exponential backoff
 */
export async function retryFirebaseOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    retryCondition = (error) => isNetworkError(error) || isFullStoryError(error)
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
        console.log(`🔄 Retrying Firebase operation (attempt ${attempt}/${maxRetries}) after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const result = await operation();
      
      if (attempt > 0) {
        console.log(`✅ Firebase operation succeeded on attempt ${attempt + 1}`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      if (isFullStoryError(error)) {
        console.warn(`🚨 FullStory interference detected (attempt ${attempt + 1}):`, error);
      } else if (isNetworkError(error)) {
        console.warn(`🌐 Network error detected (attempt ${attempt + 1}):`, error);
      }
      
      // Check if we should retry
      if (attempt < maxRetries && retryCondition(error)) {
        continue;
      }
      
      // No more retries or non-retryable error
      break;
    }
  }

  // All retries exhausted
  console.error(`❌ Firebase operation failed after ${maxRetries + 1} attempts:`, lastError);
  
  // Provide a more user-friendly error message
  if (isFullStoryError(lastError)) {
    throw new Error('Network interference detected. Please refresh the page and try again.');
  } else if (isNetworkError(lastError)) {
    throw new Error('Network connection issue. Please check your connection and try again.');
  } else {
    throw lastError;
  }
}

/**
 * Wrapper for Firestore operations with automatic retry
 */
export function withFirestoreRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options?: RetryOptions
) {
  return (...args: T): Promise<R> => {
    return retryFirebaseOperation(() => fn(...args), options);
  };
}

/**
 * Create a patched version of common Firestore functions
 */
export function createFirestorePatches() {
  // Store original functions
  const originalConsoleError = console.error;
  
  // Enhanced console.error that filters FullStory noise
  console.error = (...args: any[]) => {
    const errorString = args.join(' ').toLowerCase();
    
    // Filter out FullStory-related noise
    if (errorString.includes('fullstory') || errorString.includes('fs.js')) {
      console.warn('[FullStory Filter]', ...args);
      return;
    }
    
    originalConsoleError.apply(console, args);
  };

  return {
    restore: () => {
      console.error = originalConsoleError;
    }
  };
}

/**
 * Initialize Firebase error handling
 */
export function initializeFirebaseErrorHandling(): void {
  // Patch console to reduce FullStory noise
  createFirestorePatches();
  
  // Add global error handler for unhandled Firebase errors
  window.addEventListener('unhandledrejection', (event) => {
    if (isFullStoryError(event.reason) || isNetworkError(event.reason)) {
      console.warn('🔄 Handled Firebase/Network error:', event.reason);
      event.preventDefault(); // Prevent the error from being logged as unhandled
    }
  });
  
  console.log('✅ Firebase error handling initialized');
}
