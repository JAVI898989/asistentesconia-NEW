import { Request, Response } from "express";

// Simple diagnostic endpoint that avoids body stream issues
export async function diagnoseSimple(req: Request, res: Response) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
    const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
    
    const result = {
      hasPk: !!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasSk: !!STRIPE_SECRET_KEY,
      mode: STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'live' :
            STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'test' : 'unknown',
      origin: process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin || 'unknown',
      timestamp: new Date().toISOString()
    };

    console.log('🔍 Simple diagnostics:', result);
    
    res.json(result);
  } catch (error: any) {
    console.error('❌ Simple diagnostic error:', error);
    res.status(500).json({ 
      error: 'Diagnostic failed',
      details: error.message || error,
      timestamp: new Date().toISOString()
    });
  }
}
