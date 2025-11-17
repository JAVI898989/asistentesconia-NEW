// Centralized environment variable utility
// Uses Next.js standards with Vite fallback for compatibility

// Helper to safely access process.env in browser/server environments
const getEnv = (key: string): string => {
  // Server-side (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }

  // Client-side (browser with Vite)
  if (typeof window !== 'undefined' && (window as any).import?.meta?.env) {
    return (window as any).import.meta.env[key] || '';
  }

  // Client-side (browser with Next.js - only NEXT_PUBLIC_ vars are available)
  if (typeof window !== 'undefined' && key.startsWith('NEXT_PUBLIC_')) {
    return (window as any)[key] || '';
  }

  return '';
};

export const ENV = {
  // Stripe Publishable Key (client-side)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    getEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') ||
    getEnv('VITE_STRIPE_PUBLISHABLE_KEY') ||
    '',

  // Stripe Secret Key (server-side only)
  STRIPE_SECRET_KEY: getEnv('STRIPE_SECRET_KEY'),

  // Site URL for success/cancel redirects
  NEXT_PUBLIC_SITE_URL:
    getEnv('NEXT_PUBLIC_SITE_URL') ||
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    'http://localhost:3000',

  // Development mode detection
  NODE_ENV: getEnv('NODE_ENV') || 'development',

  // Helper functions
  get isDevelopment() {
    return this.NODE_ENV === 'development';
  },

  get isProduction() {
    return this.NODE_ENV === 'production';
  },

  get hasStripeKeys() {
    return !!(this.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && this.STRIPE_SECRET_KEY);
  },

  get stripeMode() {
    const secretKey = this.STRIPE_SECRET_KEY;
    if (secretKey.startsWith('sk_live_')) return 'live';
    if (secretKey.startsWith('sk_test_')) return 'test';
    return 'unknown';
  }
};

// Debug logging in development
if (ENV.isDevelopment && typeof window !== 'undefined') {
  console.log('🔧 ENV Configuration:', {
    hasPublishableKey: !!ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    hasSecretKey: !!ENV.STRIPE_SECRET_KEY,
    stripeMode: ENV.stripeMode,
    siteUrl: ENV.NEXT_PUBLIC_SITE_URL
  });
}
