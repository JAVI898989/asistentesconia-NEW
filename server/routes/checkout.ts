import { Request, Response } from "express";

// Import centralized env utility
const ENV = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  get stripeMode() {
    if (this.STRIPE_SECRET_KEY.startsWith('sk_live_')) return 'live';
    if (this.STRIPE_SECRET_KEY.startsWith('sk_test_')) return 'test';
    return 'unknown';
  }
};

// Strict environment validation
function validateStripeKey(): string {
  const key = ENV.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Falta STRIPE_SECRET_KEY');
  }

  // Validate key format
  if (!key.startsWith('sk_test_') && !key.startsWith('sk_live_')) {
    throw new Error('STRIPE_SECRET_KEY debe empezar con sk_test_ o sk_live_');
  }

  return key;
}

interface Stripe {
  checkout: {
    sessions: {
      create: (params: any) => Promise<{ id: string; url: string }>;
    };
  };
  prices: {
    retrieve: (priceId: string) => Promise<{ active: boolean; type: string; currency: string }>;
  };
}

let stripe: Stripe;
let db: any;

// Dynamically import Stripe with validation
async function getStripe() {
  if (!stripe) {
    const stripeKey = validateStripeKey();
    const stripeModule = await import("stripe");
    stripe = new stripeModule.default(stripeKey, {
      apiVersion: "2024-06-20" as any,
    });
  }
  return stripe;
}

// Dynamically import Firestore
async function getFirestore() {
  if (!db) {
    const { initializeApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");

    const firebaseConfig = {
      apiKey: "AIzaSyDFP6aKC1xqvwJ1-e8xRl_K-mTKPgKGhFQ",
      authDomain: "cursor-64188.firebaseapp.com",
      projectId: "cursor-64188",
      storageBucket: "cursor-64188.firebasestorage.app",
      messagingSenderId: "90000000000",
      appId: "1:90000000000:web:abcdef123456789",
    };

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

interface CheckoutRequest {
  tier: '3' | '5' | '8';
  billingCycle: 'monthly' | 'annual';
  addonPublicCount: number;
  referralCode?: string;
}

// Static pricing configuration (fallback if Firestore not available)
const PRICING_CONFIG = {
  tiers: {
    '3': {
      monthly: { priceId: 'price_family_3_monthly', price: 30, slots: 3 },
      annual: { priceId: 'price_family_3_annual', price: 300, slots: 3 },
    },
    '5': {
      monthly: { priceId: 'price_family_5_monthly', price: 44, slots: 5 },
      annual: { priceId: 'price_family_5_annual', price: 440, slots: 5 },
    },
    '8': {
      monthly: { priceId: 'price_family_8_monthly', price: 59, slots: 8 },
      annual: { priceId: 'price_family_8_annual', price: 590, slots: 8 },
    },
  },
  addonPublic: {
    monthly: { priceId: 'price_addon_public_monthly', price: 8 },
    annual: { priceId: 'price_addon_public_annual', price: 80 },
  },
};

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) throw new Error('Falta STRIPE_SECRET_KEY');

    const { tier, billingCycle, addonPublicCount = 0, referralCode }: CheckoutRequest = req.body;

    console.log("🚀 Creating strengthened checkout session:", {
      tier,
      billingCycle,
      addonPublicCount,
      referralCode: referralCode ? `${referralCode.substring(0, 4)}***` : 'none',
    });

    // Initialize Stripe with validation
    const stripe = await getStripe();

    // Strict input validation
    if (!['3', '5', '8'].includes(String(tier))) {
      return res.status(400).json({ error: "Tier inválido" });
    }

    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ error: "Ciclo inválido" });
    }

    if (addonPublicCount < 0) {
      return res.status(400).json({ error: "Add-on inválido" });
    }

    // Get Firestore
    const db = await getFirestore();
    const { doc, getDoc } = await import("firebase/firestore");

    // Load family pack settings from Firestore
    let settings = null;
    let counter = null;

    try {
      const settingsRef = doc(db, 'settings', 'pricing');
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        settings = settingsSnap.data().family;
      }

      const counterRef = doc(db, 'counters', 'family_packs');
      const counterSnap = await getDoc(counterRef);

      if (counterSnap.exists()) {
        counter = counterSnap.data();
      }
    } catch (firestoreError) {
      console.warn("Firestore not available, using fallback pricing:", firestoreError);
    }

    // Use fallback pricing if Firestore is not available
    if (!settings) {
      settings = {
        enabled: true,
        tiers: PRICING_CONFIG.tiers,
        addonPublic: PRICING_CONFIG.addonPublic,
      };
    }

    if (!counter) {
      counter = { limit: 200, sold: 0 };
    }

    // Check if family packs are enabled and in stock
    const enabled = settings?.enabled !== false;
    const limit = settings?.limit ?? counter?.limit ?? 200;
    const sold = counter?.sold ?? 0;

    if (!enabled) {
      return res.status(409).json({ error: "Ventas desactivadas" });
    }

    if (limit - sold <= 0) {
      return res.status(409).json({ error: "Agotado" });
    }

    // Validate referral code if provided
    let referralData = null;
    if (referralCode) {
      try {
        const normalizedCode = referralCode.trim().toUpperCase();
        const codeRef = doc(db, 'referral_codes', normalizedCode);
        const codeSnap = await getDoc(codeRef);

        if (!codeSnap.exists()) {
          return res.status(400).json({ error: "Código de referidos no encontrado" });
        }

        const codeData = codeSnap.data();
        if (codeData.status !== 'active') {
          return res.status(400).json({ error: "Código de referidos inactivo" });
        }

        referralData = {
          referralCode: normalizedCode,
          referrerUserId: codeData.ownerUserId,
          referrerRole: codeData.ownerRole,
        };
      } catch (referralError) {
        console.error("Error validating referral code:", referralError);
        return res.status(400).json({ error: "Error al validar código de referidos" });
      }
    }

    // Get pricing configuration
    const tierCfg = settings.tiers?.[String(tier)]?.[billingCycle];
    const addonCfg = settings.addonPublic?.[billingCycle];
    const PRICE_TIER = tierCfg?.priceId;
    const PRICE_ADDON = addonCfg?.priceId;

    if (!PRICE_TIER) {
      return res.status(400).json({ error: "priceId del plan no configurado" });
    }

    // Comprehensive Stripe price validation
    console.log(`🔍 Validating tier price: ${PRICE_TIER}`);
    const plan = await stripe.prices.retrieve(PRICE_TIER);
    if (!plan.active) {
      return res.status(400).json({ error: "El precio del plan está inactivo en Stripe" });
    }
    if (plan.type !== 'recurring') {
      return res.status(400).json({ error: "El plan no es de suscripción (recurring)" });
    }

    // Validate addon prices if needed
    let addon = null;
    if (addonPublicCount > 0) {
      if (!PRICE_ADDON) {
        return res.status(400).json({ error: "priceId del add-on no configurado" });
      }
      console.log(`🔍 Validating addon price: ${PRICE_ADDON}`);
      addon = await stripe.prices.retrieve(PRICE_ADDON);
      if (!addon.active || addon.type !== 'recurring') {
        return res.status(400).json({ error: "El add-on no es recurrente/activo" });
      }
      // Validate mode consistency
      if (addon.livemode !== plan.livemode) {
        return res.status(400).json({ error: "El add-on y el plan están en modos distintos (test/live)" });
      }
    }

    // Build line items with validated prices
    const line_items = [
      { price: PRICE_TIER, quantity: 1 },
      ...(addonPublicCount > 0 && PRICE_ADDON ? [{ price: PRICE_ADDON, quantity: addonPublicCount }] : [])
    ];

    // Determine origin for URLs
    const origin = ENV.NEXT_PUBLIC_SITE_URL || new URL(req.url!).origin;

    // Create Stripe session with strict parameters
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: undefined, // Let user enter their email
      line_items,
      success_url: `${origin}/checkout/success?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
      allow_promotion_codes: true,
      metadata: {
        plan: 'family',
        tier: String(tier),
        billingCycle,
        addonPublicCount: String(addonPublicCount),
        ...(referralCode ? { referralCode: String(referralCode).trim().toUpperCase() } : {})
      }
    });

    // Critical URL validation (prevents gray screen issues)
    if (!session.url) {
      throw new Error('Stripe no devolvió session.url');
    }

    if (!/^https:\/\/checkout\.stripe\.com\/c\/pay\//.test(session.url)) {
      throw new Error('La URL devuelta no es de Hosted Checkout esperada');
    }

    console.log("✅ Checkout OK", {
      id: session.id,
      url: session.url,
      livemode: session.livemode,
      urlValid: session.url.startsWith('https://checkout.stripe.com/')
    });

    return res.status(200).json({
      url: session.url,
      id: session.id
    });

  } catch (e: any) {
    console.error('❌ checkout/session error:', e?.message || e);
    return res.status(400).json({
      error: e?.message || 'Error creando sesión'
    });
  }
}
