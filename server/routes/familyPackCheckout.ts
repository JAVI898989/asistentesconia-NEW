import { Request, Response } from "express";
import { validateReferralCode } from "./referralValidation";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ||
  "sk_test_51QLiodGdxZHDR35wlP0JKecvhnZlIl2fkS70KZ2iDD7VFF3qv09VA5hGn2clggTtQwaM6J6z7yiw99qeechjt5Jm00qRUS88cP";

interface Stripe {
  checkout: {
    sessions: {
      create: (params: any) => Promise<{ id: string; url: string }>;
    };
  };
}

let stripe: Stripe;
let db: any;

// Dynamically import Stripe and Firebase
async function getStripe() {
  if (!stripe) {
    const stripeModule = await import("stripe");
    stripe = new stripeModule.default(STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20" as any,
    });
  }
  return stripe;
}

async function getFirestore() {
  if (!db) {
    const { initializeApp } = await import("firebase/app");
    const { getFirestore, connectFirestoreEmulator } = await import("firebase/firestore");

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

interface FamilyPackCheckoutRequest {
  tier: '3' | '5' | '8';
  billingCycle: 'monthly' | 'annual';
  addonPublicCount: number;
  referralCode?: string;
  userId: string;
  userEmail: string;
  userRole: 'alumno' | 'academia';
}

export async function createFamilyPackCheckoutSession(req: Request, res: Response) {
  try {
    const {
      tier,
      billingCycle,
      addonPublicCount = 0,
      referralCode,
      userId,
      userEmail,
      userRole,
    }: FamilyPackCheckoutRequest = req.body;

    console.log("🚀 Creating family pack checkout session:", {
      tier,
      billingCycle,
      addonPublicCount,
      referralCode: referralCode ? `${referralCode.substring(0, 4)}***` : 'none',
      userId: userId ? `${userId.substring(0, 8)}***` : 'undefined',
      userEmail: userEmail ? `${userEmail.split('@')[0]}***` : 'undefined',
      userRole
    });

    // Validate required fields
    if (!tier || !billingCycle) {
      console.error("❌ Missing required fields:", { tier, billingCycle });
      return res.status(400).json({ error: "Missing required fields: tier and billingCycle" });
    }

    // Check Stripe key
    if (!STRIPE_SECRET_KEY || !STRIPE_SECRET_KEY.startsWith('sk_')) {
      console.error("❌ Invalid Stripe secret key configuration");
      return res.status(500).json({ error: "Payment system configuration error" });
    }

    // Initialize Stripe
    const stripe = await getStripe();

    // Calculate pricing based on tier and billing cycle
    let basePrice, totalSlots;

    if (tier === '3') {
      basePrice = billingCycle === 'monthly' ? 29 : 290;
      totalSlots = 3;
    } else if (tier === '5') {
      basePrice = billingCycle === 'monthly' ? 44 : 440;
      totalSlots = 5;
    } else if (tier === '8') {
      basePrice = billingCycle === 'monthly' ? 59 : 590;
      totalSlots = 8;
    } else {
      return res.status(400).json({ error: "Invalid tier selected" });
    }

    // Add addon cost
    const addonCost = billingCycle === 'monthly' ? 8 : 80;
    const totalPrice = basePrice + (addonPublicCount * addonCost);

    console.log("💰 Calculated pricing:", {
      basePrice,
      addonCount: addonPublicCount,
      addonCost,
      totalPrice,
      totalSlots
    });

    // Create Stripe checkout session with simplified pricing
    const sessionData = {
      payment_method_types: ["card"],
      mode: "payment", // Use one-time payment instead of subscription
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Pack Familiar ${tier} Asistentes - ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}`,
              description: `Pack familiar con ${totalSlots} asistentes${addonPublicCount > 0 ? ` + ${addonPublicCount} asistentes adicionales` : ''}${referralCode ? ' (Con código de referidos)' : ''}`,
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `https://bd5e2f145be243ac9c2fd44732d97045-450504c50cec4c3885e1c5065.fly.dev/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://bd5e2f145be243ac9c2fd44732d97045-450504c50cec4c3885e1c5065.fly.dev/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        plan: 'family',
        tier,
        billingCycle,
        addonPublicCount: addonPublicCount.toString(),
        totalSlots: (totalSlots + addonPublicCount).toString(),
        buyerUserId: userId || 'demo-user',
        buyerEmail: userEmail || 'demo@example.com',
        buyerRole: userRole || 'alumno',
        referralCode: referralCode || '',
        totalPrice: totalPrice.toString(),
        type: 'family_pack_payment'
      },
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
    };

    console.log("💳 Creating Stripe session with data:", {
      mode: sessionData.mode,
      totalPrice,
      metadata: sessionData.metadata
    });

    const session = await stripe.checkout.sessions.create(sessionData);

    console.log("✅ Family pack checkout session created:", session.id);

    res.json({
      url: session.url,
      sessionId: session.id,
      message: `Pack Familiar ${tier} - €${totalPrice}`
    });

  } catch (error) {
    console.error("❌ Error creating family pack checkout session:", error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    res.status(500).json({
      error: "Failed to create checkout session",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
}
