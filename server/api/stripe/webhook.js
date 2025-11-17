/**
 * STRIPE WEBHOOK ENDPOINT
 *
 * API endpoint que procesa webhooks de Stripe en tiempo real
 * y mantiene Firebase sincronizado SIEMPRE.
 */

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "cursor-64188",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

/**
 * Webhook handler
 */
async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📡 Processing Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionEvent(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancellation(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Log event
    await logEvent(event);

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).json({ error: "Processing failed" });
  }
}

/**
 * Handle subscription events
 */
async function handleSubscriptionEvent(subscription) {
  console.log(`💳 Processing subscription: ${subscription.id}`);

  const userId = await findUserByCustomerId(subscription.customer);
  if (!userId) {
    console.warn(`⚠️ No user found for customer: ${subscription.customer}`);
    return;
  }

  const subscriptionData = {
    id: subscription.id,
    customerId: subscription.customer,
    status: subscription.status,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end,
    priceId: subscription.items.data[0]?.price?.id,
    productId: subscription.items.data[0]?.price?.product,
    userId: userId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Update subscription document
  await db
    .collection("subscriptions")
    .doc(userId)
    .set(subscriptionData, { merge: true });

  // Update user document
  const hasAccess = ["active", "trialing"].includes(subscription.status);
  await db.collection("users").doc(userId).update({
    subscriptionStatus: subscription.status,
    subscriptionId: subscription.id,
    hasAccess: hasAccess,
    lastStripeSync: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Send real-time notification
  await sendNotification(userId, "subscription_updated", {
    status: subscription.status,
    hasAccess: hasAccess,
  });

  console.log(`✅ Subscription ${subscription.id} synced for user ${userId}`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancellation(subscription) {
  console.log(`🚫 Processing subscription cancellation: ${subscription.id}`);

  const userId = await findUserByCustomerId(subscription.customer);
  if (!userId) return;

  // Update user access
  await db.collection("users").doc(userId).update({
    subscriptionStatus: "cancelled",
    hasAccess: false,
    cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Send notification
  await sendNotification(userId, "subscription_cancelled", {
    subscriptionId: subscription.id,
  });

  console.log(`❌ Access revoked for user ${userId}`);
}

/**
 * Handle successful payments
 */
async function handlePaymentSuccess(invoice) {
  console.log(`💰 Payment succeeded: ${invoice.id}`);

  const userId = await findUserByCustomerId(invoice.customer);
  if (!userId) return;

  // Log payment
  await db.collection("payments").doc(invoice.id).set({
    invoiceId: invoice.id,
    customerId: invoice.customer,
    userId: userId,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: "succeeded",
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update user
  await db.collection("users").doc(userId).update({
    lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
    lastPaymentAmount: invoice.amount_paid,
  });

  // Send notification
  await sendNotification(userId, "payment_succeeded", {
    amount: invoice.amount_paid,
    currency: invoice.currency,
  });
}

/**
 * Handle failed payments
 */
async function handlePaymentFailed(invoice) {
  console.log(`❌ Payment failed: ${invoice.id}`);

  const userId = await findUserByCustomerId(invoice.customer);
  if (!userId) return;

  // Send notification
  await sendNotification(userId, "payment_failed", {
    amount: invoice.amount_due,
    currency: invoice.currency,
  });
}

/**
 * Handle checkout completed
 */
async function handleCheckoutCompleted(session) {
  console.log(`🛒 Checkout completed: ${session.id}`);

  const userId = session.client_reference_id || session.metadata?.userId;
  if (!userId) return;

  // Update user
  await db.collection("users").doc(userId).update({
    stripeCustomerId: session.customer,
    lastCheckoutDate: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Send notification
  await sendNotification(userId, "checkout_completed", {
    sessionId: session.id,
  });
}

/**
 * Find user by Stripe customer ID
 */
async function findUserByCustomerId(customerId) {
  try {
    const snapshot = await db
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

/**
 * Send real-time notification
 */
async function sendNotification(userId, type, data) {
  try {
    await db.collection("notifications").add({
      userId: userId,
      type: type,
      data: data,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

/**
 * Log webhook event
 */
async function logEvent(event) {
  try {
    await db.collection("webhookEvents").doc(event.id).set({
      eventId: event.id,
      type: event.type,
      processed: true,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging event:", error);
  }
}

module.exports = handleWebhook;
