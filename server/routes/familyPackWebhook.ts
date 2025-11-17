import { Request, Response } from "express";

const STRIPE_SECRET_KEY =
  "sk_test_51QLiodGdxZHDR35wlP0JKecvhnZlIl2fkS70KZ2iDD7VFF3qv09VA5hGn2clggTtQwaM6J6z7yiw99qeechjt5Jm00qRUS88cP";

interface Stripe {
  webhooks: {
    constructEvent: (body: any, sig: string, secret: string) => any;
  };
}

let stripe: Stripe;
let db: any;

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

interface SessionMetadata {
  plan: string;
  tier?: string;
  billingCycle?: string;
  addonPublicCount?: string;
  tierSlots?: string;
  buyerUserId: string;
  buyerEmail: string;
  buyerRole: string;
  referralCode?: string;
  referrerUserId?: string;
  referrerRole?: string;
}

async function processFamilyPackSubscription(sessionId: string, metadata: SessionMetadata) {
  try {
    const db = await getFirestore();
    const {
      doc,
      setDoc,
      updateDoc,
      getDoc,
      increment,
      serverTimestamp,
      runTransaction,
      collection,
      query,
      where,
      getDocs,
    } = await import("firebase/firestore");

    console.log("🔄 Processing family pack subscription:", {
      sessionId,
      plan: metadata.plan,
      tier: metadata.tier,
      billingCycle: metadata.billingCycle,
      user: metadata.buyerEmail,
    });

    // Check if this session was already processed (idempotency)
    const processedQuery = query(
      collection(db, 'subscriptions'),
      where('stripeSessionId', '==', sessionId)
    );
    const processedSnap = await getDocs(processedQuery);

    if (!processedSnap.empty) {
      console.log("⚠️ Session already processed:", sessionId);
      return;
    }

    await runTransaction(db, async (transaction) => {
      const now = Date.now();

      // 1. Create/update subscription record
      const subscriptionData = {
        plan: 'family',
        tier: metadata.tier,
        tierSlots: parseInt(metadata.tierSlots || '3'),
        addonPublicSlots: parseInt(metadata.addonPublicCount || '0'),
        billingCycle: metadata.billingCycle,
        status: 'active',
        stripeSessionId: sessionId,
        userId: metadata.buyerUserId,
        userEmail: metadata.buyerEmail,
        userRole: metadata.buyerRole,
        createdAt: serverTimestamp(),
        createdAtMs: now,
        updatedAt: serverTimestamp(),
      };

      const subscriptionRef = doc(collection(db, 'subscriptions'));
      transaction.set(subscriptionRef, subscriptionData);

      // 2. Update user document with subscription info
      const userRef = doc(db, 'users', metadata.buyerUserId);
      transaction.update(userRef, {
        subscriptionPlan: 'family',
        subscriptionTier: metadata.tier,
        subscriptionStatus: 'active',
        totalSlots: (parseInt(metadata.tierSlots || '3') + parseInt(metadata.addonPublicCount || '0')),
        updatedAt: serverTimestamp(),
      });

      // 3. Increment family pack counter (idempotent)
      const counterRef = doc(db, 'counters', 'family_packs');
      transaction.update(counterRef, {
        sold: increment(1),
        updatedAtMs: now,
      });

      console.log("✅ Family pack subscription created successfully");

      // 4. Process referral if present
      if (metadata.referralCode && metadata.referrerUserId && metadata.referrerRole) {
        await processReferralBenefit({
          referralCode: metadata.referralCode,
          referrerUserId: metadata.referrerUserId,
          referrerRole: metadata.referrerRole as 'alumno' | 'academia',
          buyerUserId: metadata.buyerUserId,
          buyerEmail: metadata.buyerEmail,
          buyerRole: metadata.buyerRole as 'alumno' | 'academia',
          amount: 0, // We'll get this from Stripe
          currency: 'eur',
          stripeSessionId: sessionId,
        });
      }
    });

  } catch (error) {
    console.error("❌ Error processing family pack subscription:", error);
    throw error;
  }
}

async function processReferralBenefit(data: {
  referralCode: string;
  referrerUserId: string;
  referrerRole: 'alumno' | 'academia';
  buyerUserId: string;
  buyerEmail: string;
  buyerRole: 'alumno' | 'academia';
  amount: number;
  currency: string;
  stripeSessionId: string;
}) {
  try {
    const db = await getFirestore();
    const {
      doc,
      setDoc,
      updateDoc,
      getDoc,
      serverTimestamp,
      collection,
      query,
      where,
      getDocs,
    } = await import("firebase/firestore");

    console.log("🎯 Processing referral benefit:", {
      referralCode: data.referralCode,
      referrerRole: data.referrerRole,
      buyerRole: data.buyerRole,
      buyerEmail: data.buyerEmail,
    });

    // Check if referral already exists for this session (idempotency)
    const existingQuery = query(
      collection(db, 'referrals'),
      where('stripeSessionId', '==', data.stripeSessionId)
    );
    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty) {
      console.log("⚠️ Referral already processed for session:", data.stripeSessionId);
      return;
    }

    // Determine benefit based on roles
    let benefitReferrer = null;

    if (data.referrerRole === 'alumno' && data.buyerRole === 'academia') {
      // Alumno refers Academia -> 12 months free
      benefitReferrer = {
        type: 'year_free',
        months: 12,
        description: '12 meses gratis por referir academia',
      };
    } else if (data.referrerRole === 'alumno' && data.buyerRole === 'alumno') {
      // Alumno refers Alumno -> 1 month free
      benefitReferrer = {
        type: 'months_free',
        months: 1,
        description: '1 mes gratis por referir alumno',
      };
    }

    if (!benefitReferrer) {
      console.log("ℹ️ No benefit rule for this referral combination");
      return;
    }

    const now = Date.now();

    // Create referral record
    const referralData = {
      referrerUserId: data.referrerUserId,
      referrerRole: data.referrerRole,
      referralCode: data.referralCode,
      buyerUserId: data.buyerUserId,
      buyerEmail: data.buyerEmail,
      buyerRole: data.buyerRole,
      amount: data.amount,
      currency: data.currency,
      stripeSessionId: data.stripeSessionId,
      status: 'approved',
      activated: true,
      activatedAtMs: now,
      benefitReferrer,
      createdAt: serverTimestamp(),
      createdAtMs: now,
    };

    const referralRef = doc(collection(db, 'referrals'));
    await setDoc(referralRef, referralData);

    // Update referrer's entitlement
    const userRef = doc(db, 'users', data.referrerUserId);
    const userSnap = await getDoc(userRef);

    let currentEntitlementEnd = now;
    if (userSnap.exists()) {
      const userData = userSnap.data();
      currentEntitlementEnd = Math.max(
        now,
        userData.entitlementEndAtMs || now
      );
    }

    // Calculate new entitlement end
    const monthsToAdd = benefitReferrer.months;
    const newEntitlementEnd = new Date(currentEntitlementEnd);
    newEntitlementEnd.setMonth(newEntitlementEnd.getMonth() + monthsToAdd);

    // Update user
    const userUpdateData = {
      referralsCount: userSnap.exists() ? (userSnap.data().referralsCount || 0) + 1 : 1,
      referralsRevenue: userSnap.exists() ? (userSnap.data().referralsRevenue || 0) + data.amount : data.amount,
      entitlementEndAtMs: newEntitlementEnd.getTime(),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, userUpdateData);

    // Create reward record
    const rewardData = {
      userId: data.referrerUserId,
      sourceReferralId: referralRef.id,
      type: benefitReferrer.type,
      months: benefitReferrer.months,
      appliedAtMs: now,
      startsAtMs: currentEntitlementEnd,
      endsAtMs: newEntitlementEnd.getTime(),
      status: 'granted',
      note: `Benefit from family pack referral: ${data.buyerEmail}`,
    };

    const rewardRef = doc(collection(db, 'referral_rewards'));
    await setDoc(rewardRef, rewardData);

    console.log("✅ Referral benefit applied successfully:", {
      months: benefitReferrer.months,
      newEntitlementEnd: newEntitlementEnd.toISOString(),
    });

  } catch (error) {
    console.error("❌ Error processing referral benefit:", error);
    throw error;
  }
}

export async function handleFamilyPackWebhook(req: Request, res: Response) {
  try {
    const stripe = await getStripe();
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_secret";

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    console.log("📨 Received webhook event:", event.type);

    // Handle relevant events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata as SessionMetadata;

      console.log("🛒 Checkout session completed:", {
        sessionId: session.id,
        metadata,
      });

      // Only process family pack subscriptions
      if (metadata.plan === 'family') {
        await processFamilyPackSubscription(session.id, metadata);
      }
    }

    // Handle subscription updates
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;

      console.log("💳 Payment succeeded for subscription:", subscriptionId);
      // Handle ongoing subscription payments if needed
    }

    res.json({ received: true });

  } catch (error) {
    console.error("❌ Family pack webhook error:", error);
    res.status(500).json({
      error: "Webhook processing failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
