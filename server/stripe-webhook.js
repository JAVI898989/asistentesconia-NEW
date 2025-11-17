/**
 * STRIPE WEBHOOK HANDLER
 *
 * Maneja webhooks de Stripe en tiempo real y sincroniza
 * automáticamente con Firebase sin interrupciones.
 */

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "cursor-64188",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID || "cursor-64188"}.firebaseio.com`,
  });
}

const db = admin.firestore();

/**
 * Process Stripe webhook events
 */
async function handleStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("✅ Webhook signature verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Process the event
    await processStripeEvent(event);

    // Respond to Stripe
    res.status(200).json({ received: true, processed: true });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

/**
 * Process different Stripe event types
 */
async function processStripeEvent(event) {
  console.log(`🔄 Processing ${event.type} event`);

  switch (event.type) {
    case "customer.created":
    case "customer.updated":
      await handleCustomerEvent(event.data.object);
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionEvent(event.data.object);
      break;

    case "invoice.payment_succeeded":
      await handlePaymentSucceeded(event.data.object);
      break;

    case "invoice.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;

    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;

    case "customer.subscription.trial_will_end":
      await handleTrialWillEnd(event.data.object);
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  // Log event for debugging
  await logStripeEvent(event);
}

/**
 * Handle customer events
 */
async function handleCustomerEvent(customer) {
  try {
    console.log(`👤 Processing customer event for: ${customer.id}`);

    // Find user by customer ID or email
    const userId = await findUserIdByCustomerId(customer.id);

    if (userId) {
      // Update user document
      await db.collection("users").doc(userId).update({
        stripeCustomerId: customer.id,
        customerEmail: customer.email,
        customerName: customer.name,
        lastStripeSync: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Customer data synced for user: ${userId}`);
    } else {
      console.warn(`⚠️ No user found for customer: ${customer.id}`);
    }
  } catch (error) {
    console.error("❌ Error handling customer event:", error);
  }
}

/**
 * Handle subscription events
 */
async function handleSubscriptionEvent(subscription) {
  try {
    console.log(`💳 Processing subscription event: ${subscription.id}`);

    const userId = await findUserIdByCustomerId(subscription.customer);

    if (!userId) {
      console.warn(`⚠️ No user found for customer: ${subscription.customer}`);
      return;
    }

    // Prepare subscription data
    const subscriptionData = {
      id: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
      currentPeriodStart: subscription.current_period_start,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      priceId: subscription.items.data[0]?.price?.id,
      productId: subscription.items.data[0]?.price?.product,
      userId: userId,
      lastSync: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Update subscription document
    await db
      .collection("subscriptions")
      .doc(userId)
      .set(subscriptionData, { merge: true });

    // Update user document with subscription status
    await db
      .collection("users")
      .doc(userId)
      .update({
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        hasActiveSubscription: ["active", "trialing"].includes(
          subscription.status,
        ),
        lastStripeSync: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Grant or revoke access based on subscription status
    await updateUserAccess(userId, subscription.status);

    console.log(`✅ Subscription synced for user: ${userId}`);

    // Send real-time update to user
    await sendRealTimeUpdate(userId, "subscriptionChanged", subscriptionData);
  } catch (error) {
    console.error("❌ Error handling subscription event:", error);
  }
}

/**
 * Handle successful payments
 */
async function handlePaymentSucceeded(invoice) {
  try {
    console.log(`💰 Payment succeeded: ${invoice.id}`);

    const userId = await findUserIdByCustomerId(invoice.customer);

    if (userId) {
      // Log payment
      await db.collection("payments").doc(invoice.id).set({
        invoiceId: invoice.id,
        customerId: invoice.customer,
        userId: userId,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: "succeeded",
        subscriptionId: invoice.subscription,
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update user document
      await db.collection("users").doc(userId).update({
        lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
        lastPaymentAmount: invoice.amount_paid,
        lastStripeSync: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Payment logged for user: ${userId}`);

      // Send real-time notification
      await sendRealTimeUpdate(userId, "paymentSucceeded", {
        amount: invoice.amount_paid,
        currency: invoice.currency,
      });
    }
  } catch (error) {
    console.error("❌ Error handling payment succeeded:", error);
  }
}

/**
 * Handle failed payments
 */
async function handlePaymentFailed(invoice) {
  try {
    console.log(`❌ Payment failed: ${invoice.id}`);

    const userId = await findUserIdByCustomerId(invoice.customer);

    if (userId) {
      // Log failed payment
      await db.collection("payments").doc(invoice.id).set({
        invoiceId: invoice.id,
        customerId: invoice.customer,
        userId: userId,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: "failed",
        subscriptionId: invoice.subscription,
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update user document
      await db
        .collection("users")
        .doc(userId)
        .update({
          lastPaymentFailed: admin.firestore.FieldValue.serverTimestamp(),
          paymentFailureCount: admin.firestore.FieldValue.increment(1),
          lastStripeSync: admin.firestore.FieldValue.serverTimestamp(),
        });

      console.log(`⚠️ Payment failure logged for user: ${userId}`);

      // Send real-time notification
      await sendRealTimeUpdate(userId, "paymentFailed", {
        amount: invoice.amount_due,
        currency: invoice.currency,
      });
    }
  } catch (error) {
    console.error("❌ Error handling payment failed:", error);
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session) {
  try {
    console.log(`🛒 Checkout completed: ${session.id}`);

    const userId = session.client_reference_id || session.metadata?.userId;

    if (userId) {
      // Update user document
      await db.collection("users").doc(userId).update({
        stripeCustomerId: session.customer,
        lastCheckoutDate: admin.firestore.FieldValue.serverTimestamp(),
        lastStripeSync: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Checkout processed for user: ${userId}`);

      // Send real-time notification
      await sendRealTimeUpdate(userId, "checkoutCompleted", {
        sessionId: session.id,
        customerId: session.customer,
      });
    }
  } catch (error) {
    console.error("❌ Error handling checkout completed:", error);
  }
}

/**
 * Handle trial will end
 */
async function handleTrialWillEnd(subscription) {
  try {
    console.log(`⏰ Trial will end: ${subscription.id}`);

    const userId = await findUserIdByCustomerId(subscription.customer);

    if (userId) {
      // Update user document
      await db.collection("users").doc(userId).update({
        trialEndingSoon: true,
        trialEndsAt: subscription.trial_end,
        lastStripeSync: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Send real-time notification
      await sendRealTimeUpdate(userId, "trialWillEnd", {
        trialEndsAt: subscription.trial_end,
      });

      console.log(`⚠️ Trial ending notification sent to user: ${userId}`);
    }
  } catch (error) {
    console.error("❌ Error handling trial will end:", error);
  }
}

/**
 * Find user ID by Stripe customer ID
 */
async function findUserIdByCustomerId(customerId) {
  try {
    const usersRef = db.collection("users");
    const query = usersRef.where("stripeCustomerId", "==", customerId);
    const snapshot = await query.get();

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    return null;
  } catch (error) {
    console.error("❌ Error finding user by customer ID:", error);
    return null;
  }
}

/**
 * Update user access based on subscription status
 */
async function updateUserAccess(userId, subscriptionStatus) {
  const hasAccess = ["active", "trialing"].includes(subscriptionStatus);

  await db
    .collection("users")
    .doc(userId)
    .update({
      hasAccess: hasAccess,
      accessGrantedAt: hasAccess
        ? admin.firestore.FieldValue.serverTimestamp()
        : null,
      accessRevokedAt: !hasAccess
        ? admin.firestore.FieldValue.serverTimestamp()
        : null,
    });

  console.log(
    `${hasAccess ? "✅" : "❌"} Access ${hasAccess ? "granted" : "revoked"} for user: ${userId}`,
  );
}

/**
 * Send real-time update to user
 */
async function sendRealTimeUpdate(userId, type, data) {
  try {
    // Create real-time notification document
    await db.collection("notifications").doc(`${userId}_${Date.now()}`).set({
      userId: userId,
      type: type,
      data: data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    });
  } catch (error) {
    console.error("❌ Error sending real-time update:", error);
  }
}

/**
 * Log Stripe event for debugging
 */
async function logStripeEvent(event) {
  try {
    await db.collection("stripeEvents").doc(event.id).set({
      eventId: event.id,
      type: event.type,
      created: event.created,
      livemode: event.livemode,
      processed: true,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error logging Stripe event:", error);
  }
}

module.exports = {
  handleStripeWebhook,
  processStripeEvent,
};
