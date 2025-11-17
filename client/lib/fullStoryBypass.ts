/**
 * FullStory Network Bypass Utility
 * 
 * FullStory's monitoring can interfere with fetch requests, especially to external APIs.
 * This utility provides methods to bypass FullStory's fetch interception.
 */

export interface BypassFetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Bypass FullStory fetch interference using XMLHttpRequest
 */
export async function bypassFetch(url: string, options: BypassFetchOptions = {}): Promise<Response> {
  const {
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`🔄 Retry attempt ${attempt}/${retries} for ${url}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }

      const response = await performXHRRequest(url, fetchOptions, timeout);
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // If it's a FullStory-related error, continue retrying
      if (isFullStoryError(error)) {
        console.warn(`🚨 FullStory interference detected (attempt ${attempt + 1}):`, error);
        continue;
      }
      
      // For other errors, stop retrying
      throw error;
    }
  }

  throw new Error(`Request failed after ${retries} retries. Last error: ${lastError?.message}`);
}

/**
 * Perform XMLHttpRequest bypassing FullStory
 */
function performXHRRequest(url: string, options: RequestInit, timeout: number): Promise<Response> {
  return new Promise((resolve, reject) => {
    // Basic environment checks
    if (typeof window === 'undefined' || typeof XMLHttpRequest === 'undefined') {
      return reject(new Error('XHR is not available in this environment'));
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return reject(new Error('Network offline'));
    }

    // Prevent obvious mixed-content requests which would be blocked by the browser
    try {
      if (typeof window !== 'undefined' && window.location && typeof url === 'string') {
        const pageProtocol = window.location.protocol || '';
        if (pageProtocol === 'https:' && /^http:\/\//i.test(url)) {
          return reject(new Error('Mixed content blocked: secure page cannot request insecure resource (http). Use https endpoint'));
        }
      }
    } catch (e) {
      // ignore
    }

    const xhr = new XMLHttpRequest();

    // Use async open
    xhr.open((options && (options.method as string)) || 'GET', url, true);

    // Respect credentials option
    if ((options as any)?.credentials === 'include') {
      try { xhr.withCredentials = true; } catch {}
    }

    // Set headers
    const headersObj = options.headers as Record<string, any> | undefined;
    let hasAccept = false;
    if (headersObj) {
      Object.entries(headersObj).forEach(([key, value]) => {
        if (typeof value !== 'undefined') {
          try { xhr.setRequestHeader(key, String(value)); } catch (err) { /* ignore header set errors */ }
          if (key.toLowerCase() === 'accept') hasAccept = true;
        }
      });
    }

    if (!hasAccept) {
      try { xhr.setRequestHeader('Accept', 'application/json, text/plain, */*'); } catch {}
    }

    xhr.timeout = timeout;
    // Ensure responseType is text to avoid binary surprises
    try { xhr.responseType = 'text'; } catch {}

    xhr.onload = () => {
      try {
        // If status is 0, it's usually a CORS/mixed-content or network error. Handle explicitly.
        if (xhr.status === 0) {
          // If we have text, sometimes local files or opaque responses show 0. If empty, treat as CORS/network.
          const possibleBody = xhr.responseText;
          if (!possibleBody) {
            return reject(new Error(`Network error or CORS/mixed-content blocked (status 0). URL: ${url}`));
          }
          // else continue and return a 200-like response using the body
        }

        // Parse response headers
        const headers = new Headers();
        const raw = xhr.getAllResponseHeaders();
        if (raw) {
          raw.split('\r\n').forEach(line => {
            const idx = line.indexOf(': ');
            if (idx > -1) {
              const key = line.slice(0, idx);
              const value = line.slice(idx + 2);
              if (key && value) headers.set(key, value);
            }
          });
        }

        const status = xhr.status === 0 ? 200 : xhr.status;
        const statusText = xhr.statusText || (status === 200 ? 'OK' : '');

        const response = new Response(xhr.responseText, {
          status,
          statusText,
          headers,
        });

        resolve(response);
      } catch (error) {
        reject(new Error(`Failed to parse response: ${error}`));
      }
    };

    xhr.onerror = () => {
      // status 0 is common for CORS/mixed-content/network failures; provide more guidance
      const details = `URL: ${url} - readyState: ${xhr.readyState} - status: ${xhr.status}`;
      reject(new Error(`Network error or request blocked (possible CORS/mixed-content). ${details}`));
    };

    xhr.ontimeout = () => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    };

    xhr.onabort = () => {
      reject(new Error('Request aborted'));
    };

    // Send request
    try {
      const body = (options as any).body;
      if (typeof body === 'undefined' || body === null) {
        xhr.send();
      } else if (body instanceof FormData) {
        xhr.send(body);
      } else if (body instanceof Blob) {
        xhr.send(body);
      } else if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
        xhr.send(body as any);
      } else if (body instanceof URLSearchParams) {
        const hasCT = headersObj && (headersObj['Content-Type'] || headersObj['content-type']);
        if (!hasCT) {
          try { xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'); } catch {}
        }
        xhr.send(body.toString());
      } else if (typeof body === 'string') {
        xhr.send(body);
      } else {
        // Assume JSON
        const hasCT = headersObj && (headersObj['Content-Type'] || headersObj['content-type']);
        if (!hasCT) {
          try { xhr.setRequestHeader('Content-Type', 'application/json'); } catch {}
        }
        xhr.send(JSON.stringify(body));
      }
    } catch (error) {
      reject(new Error(`Failed to send request: ${error}`));
    }
  });
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
    errorMessage.includes('failed to fetch') ||
    (error.stack && error.stack.includes('fullstory')) ||
    (error.stack && error.stack.includes('fs.js'))
  );
}

/**
 * Enhanced fetch that automatically falls back to XHR if FullStory interferes
 */
export async function safeFetch(url: string, options: BypassFetchOptions = {}): Promise<Response> {
  try {
    // First try regular fetch
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    // If it's a FullStory error, fallback to XHR
    if (isFullStoryError(error)) {
      console.warn('🔄 FullStory interference detected, using XHR fallback...');
      return bypassFetch(url, options);
    }
    
    // Re-throw non-FullStory errors
    throw error;
  }
}

/**
 * Create a fetch function that bypasses FullStory
 */
export function createBypassFetch(defaultOptions: BypassFetchOptions = {}) {
  return (url: string, options: BypassFetchOptions = {}) => {
    const mergedOptions = { ...defaultOptions, ...options };
    return bypassFetch(url, mergedOptions);
  };
}

/**
 * Monkey patch window.fetch to automatically handle FullStory interference
 */
export function patchFetchForFullStory(): void {
  const originalFetch = window.fetch;
  (window.fetch as any)._original = originalFetch;

  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Prepare safe copies in case we need to fallback
    let url: string;
    let method: string | undefined = init?.method;
    let headers: HeadersInit | undefined = init?.headers;
    let preservedBody: any = init?.body;

    if (input instanceof Request) {
      url = input.url;
      method = method || input.method;
      headers = headers || input.headers;
      // Clone and read the body BEFORE calling original fetch to avoid "body stream already read"
      try {
        if (!preservedBody && input.bodyUsed === false && input.method && !/^GET|HEAD$/i.test(input.method)) {
          const clone = input.clone();
          preservedBody = await clone.text();
        }
      } catch {
        // Ignore body preservation errors; we'll try with init.body if present
      }
    } else {
      url = input.toString();
    }

    try {
      return await originalFetch.call(this, input as any, init);
    } catch (error) {
      if (isFullStoryError(error)) {
        console.warn('🔄 Auto-fallback to XHR due to FullStory interference');
        const options: RequestInit = {
          ...(init || {}),
          method,
          headers,
          body: preservedBody !== undefined ? preservedBody : (init ? init.body : undefined),
        };
        return bypassFetch(url, options);
      }
      throw error;
    }
  } as any;

  console.log('✅ Fetch patched for FullStory compatibility');
}

/**
 * Restore original fetch function
 */
export function restoreOriginalFetch(): void {
  if ((window.fetch as any)._original) {
    window.fetch = (window.fetch as any)._original;
    console.log('✅ Original fetch restored');
  }
}
