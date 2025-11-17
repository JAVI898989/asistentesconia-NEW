import { Request, Response } from "express";

// Assistant-specific Stripe diagnostic endpoint
export async function diagnoseAssistantStripe(req: Request, res: Response) {
  try {
    const sk = process.env.STRIPE_SECRET_KEY ||
      "sk_test_51QLiodGdxZHDR35wlP0JKecvhnZlIl2fkS70KZ2iDD7VFF3qv09VA5hGn2clggTtQwaM6J6z7yiw99qeechjt5Jm00qRUS88cP";
    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.origin || 'http://localhost:8080';

    if (!sk) {
      return res.status(400).json({ ok: false, error: 'Falta STRIPE_SECRET_KEY' });
    }

    // Initialize Stripe
    const stripeModule = await import("stripe");
    const stripe = new stripeModule.default(sk, { apiVersion: "2024-06-20" as any });

    // 1) Detect mode and account
    const mode = sk.startsWith('sk_live_') ? 'live' : (sk.startsWith('sk_test_') ? 'test' : 'unknown');

    try {
      const acct = await stripe.accounts.retrieve();

      // 2) Test dynamic price creation (as used in assistant checkout)
      // First create a product, then create a price
      const testProduct = await stripe.products.create({
        name: 'Test Assistant - Diagnostic',
        description: 'Test subscription for diagnostic purposes'
      });

      const testPrice = await stripe.prices.create({
        currency: 'eur',
        product: testProduct.id,
        recurring: {
          interval: 'month'
        },
        unit_amount: 1000, // €10.00
      });

      // 3) Create a minimal test session with dynamic pricing
      let session = null;
      try {
        session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          line_items: [{
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Test Assistant - Diagnostic',
                description: 'Test subscription for diagnostic purposes'
              },
              recurring: { interval: 'month' },
              unit_amount: 1000
            },
            quantity: 1
          }],
          success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/?canceled=1`,
        });
      } catch (sessionError: any) {
        session = { error: sessionError.message };
      }

      // Clean up test price
      try {
        await stripe.prices.update(testPrice.id, { active: false });
      } catch (cleanupError) {
        console.warn('Could not deactivate test price:', cleanupError);
      }

      const result = {
        ok: true,
        mode,
        account: {
          id: acct.id,
          charges_enabled: (acct as any).charges_enabled,
          details_submitted: (acct as any).details_submitted
        },
        priceTest: {
          created: testPrice.id,
          active: testPrice.active,
          type: testPrice.type,
          livemode: testPrice.livemode,
          currency: testPrice.currency
        },
        sessionPreview: session && session.id ? {
          id: session.id,
          urlStartsWith: session.url?.slice(0, 36),
          livemode: session.livemode,
          fullUrl: session.url
        } : (session?.error || 'NO_SESSION_CREATED'),
        environment: {
          origin,
          hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          timestamp: new Date().toISOString()
        }
      };

      console.log('🔍 Assistant Stripe diagnostic completed:', {
        mode: result.mode,
        testPriceCreated: !!testPrice.id,
        sessionCreated: !!(session?.id),
        urlValid: session?.url?.startsWith('https://checkout.stripe.com/')
      });

      res.json(result);

    } catch (accountError: any) {
      return res.status(400).json({
        ok: false,
        error: `Account access error: ${accountError.message}`,
        mode
      });
    }

  } catch (error: any) {
    console.error('❌ Assistant diagnostic error:', error);
    res.status(400).json({
      ok: false,
      error: error?.message || String(error)
    });
  }
}
