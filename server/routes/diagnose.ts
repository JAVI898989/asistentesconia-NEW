import { Request, Response } from "express";

// Comprehensive Stripe diagnostic endpoint
export async function diagnoseStripe(req: Request, res: Response) {
  try {
    const sk = process.env.STRIPE_SECRET_KEY || '';
    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url!).origin;
    
    if (!sk) {
      return res.status(400).json({ ok: false, error: 'Falta STRIPE_SECRET_KEY' });
    }

    // Initialize Stripe
    const stripeModule = await import("stripe");
    const stripe = new stripeModule.default(sk, { apiVersion: "2024-06-20" as any });

    // 1) Detect mode and account
    const mode = sk.startsWith('sk_live_') ? 'live' : (sk.startsWith('sk_test_') ? 'test' : 'unknown');
    const acct = await stripe.accounts.retrieve();

    // 2) Check sample price IDs (adjust these to your configured price IDs)
    const SAMPLE_PRICE_IDS = [
      process.env.PRICE_FAMILY_8_M || 'price_family_8_monthly',
      process.env.PRICE_FAMILY_5_M || 'price_family_5_monthly', 
      process.env.PRICE_FAMILY_3_M || 'price_family_3_monthly',
      'price_1QM123',  // Add your actual price IDs here
    ];

    let validPrice = null;
    const priceChecks: any = {};

    for (const priceId of SAMPLE_PRICE_IDS) {
      if (!priceId) continue;
      
      try {
        const price = await stripe.prices.retrieve(priceId);
        priceChecks[priceId] = {
          id: price.id,
          active: price.active,
          type: price.type,
          livemode: price.livemode,
          currency: price.currency
        };
        
        if (price.active && price.type === 'recurring' && !validPrice) {
          validPrice = price;
        }
      } catch (priceError: any) {
        priceChecks[priceId] = {
          error: priceError.message || 'Price not found'
        };
      }
    }

    // 3) Create a minimal test session if we have a valid price
    let session: any = null;
    if (validPrice) {
      try {
        session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          line_items: [{ price: validPrice.id, quantity: 1 }],
          success_url: `${site}/checkout/success?sid={CHECKOUT_SESSION_ID}`,
          cancel_url: `${site}/?canceled=1`,
        });
      } catch (sessionError: any) {
        session = { error: sessionError.message };
      }
    }

    const result = {
      ok: true,
      mode,
      account: { 
        id: acct.id, 
        charges_enabled: (acct as any).charges_enabled,
        details_submitted: (acct as any).details_submitted 
      },
      priceCheck: validPrice ? {
        id: validPrice.id,
        active: validPrice.active,
        type: validPrice.type,
        livemode: validPrice.livemode,
        currency: validPrice.currency
      } : 'NO_VALID_PRICE_FOUND',
      allPriceChecks: priceChecks,
      sessionPreview: session && session.id ? {
        id: session.id,
        urlStartsWith: session.url?.slice(0, 36),
        livemode: session.livemode,
        fullUrl: session.url
      } : (session?.error || 'NO_SESSION_CREATED'),
      environment: {
        site,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        timestamp: new Date().toISOString()
      }
    };

    console.log('🔍 Comprehensive Stripe diagnostic completed:', {
      mode: result.mode,
      validPriceFound: !!validPrice,
      sessionCreated: !!(session?.id),
      urlValid: session?.url?.startsWith('https://checkout.stripe.com/')
    });

    res.json(result);
    
  } catch (error: any) {
    console.error('❌ Diagnostic error:', error);
    res.status(400).json({ 
      ok: false, 
      error: error?.message || String(error),
      stack: error?.stack 
    });
  }
}
