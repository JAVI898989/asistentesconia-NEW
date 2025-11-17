import { RequestHandler } from "express";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";

const STRIPE_SECRET_KEY =
  "sk_test_51QLiodGdxZHDR35wlP0JKecvhnZlIl2fkS70KZ2iDD7VFF3qv09VA5hGn2clggTtQwaM6J6z7yiw99qeechjt5Jm00qRUS88cP";

interface Stripe {
  checkout: {
    sessions: {
      create: (params: any) => Promise<any>;
      retrieve: (sessionId: string) => Promise<any>;
    };
  };
  webhooks: {
    constructEvent: (payload: any, signature: string, secret: string) => any;
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

async function getFirebaseDb() {
  if (!db) {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");

    const firebaseConfig = {
      // Firebase config will be loaded from environment
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }

    db = getFirestore();
  }
  return db;
}

// Import referral functions from client lib
async function recordReferralConversion(data: any) {
  // This would typically be imported from a shared lib
  // For now, we'll implement the core logic here

  const db = await getFirebaseDb();
  const {
    addDoc,
    updateDoc,
    runTransaction,
    serverTimestamp,
    collection: firestoreCollection,
    doc: firestoreDoc
  } = await import("firebase/firestore");

  try {
    // Check for existing referral with same session ID (idempotency)
    const existingQuery = query(
      firestoreCollection(db, 'referrals'),
      where('stripeSessionId', '==', data.stripeSessionId)
    );
    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty) {
      console.log('Referral already processed for session:', data.stripeSessionId);
      return;
    }

    // Create referral record and update referrer stats in transaction
    await runTransaction(db, async (transaction) => {
      // Create referral document
      const referralData = {
        referrerUserId: data.referrerUserId,
        referrerRole: data.referrerRole,
        referralCode: data.referralCode,
        buyerUserId: data.buyerUserId,
        buyerEmail: data.buyerEmail,
        amount: data.amount,
        currency: data.currency,
        stripeSessionId: data.stripeSessionId,
        stripePaymentIntentId: data.stripePaymentIntentId,
        status: 'approved',
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };

      const referralRef = firestoreDoc(firestoreCollection(db, 'referrals'));
      transaction.set(referralRef, referralData);

      // Update referrer's stats
      const referrerRef = firestoreDoc(db, 'users', data.referrerUserId);
      const referrerSnap = await transaction.get(referrerRef);

      if (referrerSnap.exists()) {
        const referrerData = referrerSnap.data();
        const currentCount = referrerData.referralsCount || 0;
        const currentRevenue = referrerData.referralsRevenue || 0;

        transaction.update(referrerRef, {
          referralsCount: currentCount + 1,
          referralsRevenue: currentRevenue + data.amount,
        });
      }
    });

    console.log('Referral conversion recorded successfully');
  } catch (error) {
    console.error('Error recording referral conversion:', error);
    throw error;
  }
}

export const createCheckoutSessionWithReferral: RequestHandler = async (req, res) => {
  try {
    console.log("Creating checkout session with referral:", req.body);

    const {
      assistantId,
      assistantName,
      price,
      billingCycle,
      isFounder,
      userId,
      userEmail,
      referralCode,
      referrerUserId,
      referrerRole,
    } = req.body;

    if (!assistantId || !assistantName || !price || !billingCycle) {
      console.error("Missing required fields");
      return res.status(400).json({
        error: "Missing required fields: assistantId, assistantName, price, billingCycle",
      });
    }

    const stripe = await getStripe();
    console.log("Stripe instance created successfully");

    // Build metadata including referral information
    const metadata: any = {
      userId: userId || "anonymous",
      userEmail: userEmail || "",
      assistantId,
      assistantName,
      billingCycle,
      isFounder: isFounder.toString(),
      price: price.toString(),
    };

    // Add referral metadata if provided
    if (referralCode && referrerUserId && referrerRole) {
      metadata.referralCode = referralCode;
      metadata.referrerUserId = referrerUserId;
      metadata.referrerRole = referrerRole;
      metadata.hasReferral = "true";
    }

    const sessionData = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${assistantName} - ${isFounder ? "Precio Fundador" : "Precio Normal"}`,
              description: `Suscripción ${billingCycle === "monthly" ? "mensual" : "anual"} para ${assistantName}`,
            },
            unit_amount: price * 100, // Convert to cents
            recurring: {
              interval: billingCycle === "monthly" ? "month" : "year",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&assistant_id=${assistantId}`,
      cancel_url: `${req.headers.origin}/asistente/${assistantId}`,
      metadata,
      customer_email: userEmail,
    };

    console.log("Creating session with referral data:", sessionData);
    const session = await stripe.checkout.sessions.create(sessionData);
    console.log("Session created successfully:", session.id);

    // Return URL for hosted checkout (prevents gray screen)
    res.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error("Error creating checkout session with referral:", error);
    res.status(500).json({
      error: "Error creating checkout session. Please try again.",
    });
  }
};

export const createAcademiaCheckoutSessionWithReferral: RequestHandler = async (req, res) => {
  try {
    console.log("Creating academia checkout session with referral:", req.body);

    const {
      academiaId,
      academiaName,
      totalPrice,
      billingCycle,
      students,
      pricePerStudent,
      assistantId,
      userId,
      userEmail,
      customerInfo,
      referralCode,
      referrerUserId,
      referrerRole,
    } = req.body;

    if (!academiaId || !academiaName || !totalPrice || !billingCycle || !students || !customerInfo) {
      console.error("Missing required fields for academia");
      return res.status(400).json({
        error: "Missing required fields for academia checkout",
      });
    }

    const stripe = await getStripe();
    console.log("Stripe instance created successfully");

    // Calculate the correct amount based on billing cycle
    const unitAmount =
      billingCycle === "annual"
        ? Math.round(totalPrice * 10 * 100) // 10 months price for annual (2 months free)
        : totalPrice * 100; // Monthly price

    // Build metadata including referral information
    const metadata: any = {
      userId: userId || "anonymous",
      userEmail: userEmail || customerInfo.email,
      academiaId,
      academiaName,
      billingCycle,
      students: students.toString(),
      pricePerStudent: pricePerStudent.toString(),
      totalPrice: totalPrice.toString(),
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone || "",
      organization: customerInfo.organization,
      assistantId: assistantId || "",
    };

    // Add referral metadata if provided
    if (referralCode && referrerUserId && referrerRole) {
      metadata.referralCode = referralCode;
      metadata.referrerUserId = referrerUserId;
      metadata.referrerRole = referrerRole;
      metadata.hasReferral = "true";
    }

    const sessionData = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${academiaName} - ${students} alumnos`,
              description: `Suscripción ${billingCycle === "monthly" ? "mensual" : "anual (2 meses gratis)"} para ${academiaName} (${students} alumnos a ${pricePerStudent}€ cada uno)`,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: billingCycle === "monthly" ? "month" : "year",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: customerInfo.email,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&academia_id=${academiaId}&students=${students}&duration=${req.body.duration || 2}&is_founder=true`,
      cancel_url: `${req.headers.origin}/academias`,
      metadata,
    };

    console.log("Creating academia session with referral data:", sessionData);
    const session = await stripe.checkout.sessions.create(sessionData);
    console.log("Academia session created successfully:", session.id);

    // Return URL for hosted checkout (prevents gray screen)
    res.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error("Error creating academia checkout session with referral:", error);
    res.status(500).json({
      error: "Error creating academia checkout session. Please try again.",
    });
  }
};

export const handleWebhookWithReferrals: RequestHandler = async (req, res) => {
  try {
    const stripe = await getStripe();
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).send(`Webhook Error: ${err}`);
      }
    } else {
      // For development, just parse the body
      event = req.body;
    }

    console.log("Processing webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("Payment successful:", session.id);

        // Process referral if present
        if (session.metadata?.hasReferral === "true") {
          await processReferralConversion(session);
        }

        // Update user subscription status
        await updateUserSubscription(session);
        break;

      case "invoice.payment_succeeded":
        console.log("Subscription payment succeeded:", event.data.object);
        break;

      case "invoice.payment_failed":
        console.log("Subscription payment failed:", event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: "Webhook error" });
  }
};

async function processReferralConversion(session: any) {
  try {
    const metadata = session.metadata;

    if (!metadata.referralCode || !metadata.referrerUserId) {
      console.log("No valid referral data in session metadata");
      return;
    }

    // Check if this referral was already processed (idempotency)
    const { referralExists } = await import('../../client/lib/enhancedReferralService');
    const alreadyProcessed = await referralExists(session.id);

    if (alreadyProcessed) {
      console.log("Referral already processed for session:", session.id);
      return;
    }

    // Get the payment amount
    let amount = 0;
    if (session.amount_total) {
      amount = session.amount_total; // Amount in cents
    } else if (session.subscription) {
      amount = session.amount_total || 0;
    }

    // Determine buyer role (default to 'alumno' if not specified)
    const buyerRole = metadata.buyerRole || 'alumno';

    // Activate referral and apply benefits
    const { activateReferralAndApplyBenefits } = await import('../../client/lib/enhancedReferralService');

    await activateReferralAndApplyBenefits({
      referrerUserId: metadata.referrerUserId,
      referrerRole: metadata.referrerRole,
      referralCode: metadata.referralCode,
      buyerUserId: metadata.userId || session.customer,
      buyerEmail: metadata.userEmail || session.customer_email,
      buyerRole: buyerRole as 'alumno' | 'academia',
      amount: amount,
      currency: session.currency || 'eur',
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
    });

    console.log("Referral activated and benefits applied successfully");
  } catch (error) {
    console.error("Error processing referral conversion:", error);
  }
}

async function updateUserSubscription(session: any) {
  try {
    // This would update the user's subscription status in the database
    // Implementation depends on your user model
    console.log("Updating user subscription for session:", session.id);

    const metadata = session.metadata;
    if (metadata.userId && metadata.userId !== "anonymous") {
      // Update user subscription in Firestore
      const db = await getFirebaseDb();
      const { updateDoc, doc: firestoreDoc } = await import("firebase/firestore");

      const userRef = firestoreDoc(db, 'users', metadata.userId);
      await updateDoc(userRef, {
        subscriptionStatus: 'active',
        subscriptionId: session.subscription,
        lastPaymentDate: new Date().toISOString(),
        assistantId: metadata.assistantId,
      });
    }
  } catch (error) {
    console.error("Error updating user subscription:", error);
  }
}
