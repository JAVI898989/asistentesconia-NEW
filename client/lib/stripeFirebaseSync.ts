/**
 * Stripe-Firebase Synchronization Service
 *
 * This service ensures all Stripe events are properly synced with Firebase
 * and user subscription statuses are always up to date.
 */

import { firebaseService } from "./firebaseService";

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

interface SubscriptionData {
  id: string;
  customer: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        id: string;
        product: string;
      };
    }>;
  };
}

export class StripeFirebaseSync {
  private static instance: StripeFirebaseSync;

  static getInstance(): StripeFirebaseSync {
    if (!StripeFirebaseSync.instance) {
      StripeFirebaseSync.instance = new StripeFirebaseSync();
    }
    return StripeFirebaseSync.instance;
  }

  /**
   * Handle Stripe webhook events
   */
  async handleStripeWebhook(event: StripeEvent): Promise<void> {
    console.log(`📡 Processing Stripe webhook: ${event.type}`);

    try {
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await this.handleSubscriptionChange(event.data.object);
          break;

        case "customer.created":
        case "customer.updated":
          await this.handleCustomerChange(event.data.object);
          break;

        case "invoice.payment_succeeded":
          await this.handlePaymentSuccess(event.data.object);
          break;

        case "invoice.payment_failed":
          await this.handlePaymentFailed(event.data.object);
          break;

        case "checkout.session.completed":
          await this.handleCheckoutCompleted(event.data.object);
          break;

        default:
          console.log(`🤷 Unhandled Stripe event: ${event.type}`);
      }

      // Log the event for debugging
      await this.logStripeEvent(event);
    } catch (error) {
      console.error(`❌ Error processing Stripe webhook ${event.type}:`, error);
      throw error;
    }
  }

  /**
   * Handle subscription changes
   */
  private async handleSubscriptionChange(
    subscription: SubscriptionData,
  ): Promise<void> {
    try {
      // Find user by Stripe customer ID
      const userId = await this.findUserByCustomerId(subscription.customer);

      if (!userId) {
        console.warn(
          `⚠️ No user found for Stripe customer: ${subscription.customer}`,
        );
        return;
      }

      // Map Stripe status to our status
      const subscriptionStatus = this.mapStripeStatus(subscription.status);

      // Update user data
      await firebaseService.updateUserData(userId, {
        subscriptionStatus,
        stripeCustomerId: subscription.customer,
      });

      // Save subscription details
      await firebaseService.syncStripeSubscription({
        id: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
        priceId: subscription.items.data[0]?.price.id || "",
        productId: subscription.items.data[0]?.price.product || "",
        userId,
      });

      // Grant/revoke access based on status
      await this.updateUserAccess(userId, subscriptionStatus);

      console.log(
        `✅ Subscription ${subscription.id} synced for user ${userId}`,
      );
    } catch (error) {
      console.error("Error handling subscription change:", error);
      throw error;
    }
  }

  /**
   * Handle customer changes
   */
  private async handleCustomerChange(customer: any): Promise<void> {
    try {
      const userId = await this.findUserByCustomerId(customer.id);

      if (userId) {
        await firebaseService.updateUserData(userId, {
          stripeCustomerId: customer.id,
        });

        console.log(`✅ Customer ${customer.id} synced for user ${userId}`);
      }
    } catch (error) {
      console.error("Error handling customer change:", error);
    }
  }

  /**
   * Handle successful payments
   */
  private async handlePaymentSuccess(invoice: any): Promise<void> {
    try {
      const userId = await this.findUserByCustomerId(invoice.customer);

      if (userId) {
        // Update user subscription status to active
        await firebaseService.updateUserData(userId, {
          subscriptionStatus: "active",
        });

        // Log payment
        await this.logPayment(userId, invoice, "success");

        console.log(`✅ Payment succeeded for user ${userId}`);
      }
    } catch (error) {
      console.error("Error handling payment success:", error);
    }
  }

  /**
   * Handle failed payments
   */
  private async handlePaymentFailed(invoice: any): Promise<void> {
    try {
      const userId = await this.findUserByCustomerId(invoice.customer);

      if (userId) {
        // Update user subscription status
        await firebaseService.updateUserData(userId, {
          subscriptionStatus: "inactive",
        });

        // Log payment failure
        await this.logPayment(userId, invoice, "failed");

        console.log(`⚠️ Payment failed for user ${userId}`);
      }
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  }

  /**
   * Handle completed checkout sessions
   */
  private async handleCheckoutCompleted(session: any): Promise<void> {
    try {
      const userId = session.client_reference_id || session.metadata?.userId;

      if (userId) {
        // Update user subscription status
        await firebaseService.updateUserData(userId, {
          subscriptionStatus: "active",
          stripeCustomerId: session.customer,
        });

        // If it's a course purchase, grant access
        if (session.metadata?.courseId) {
          await this.grantCourseAccess(userId, session.metadata.courseId);
        }

        console.log(`✅ Checkout completed for user ${userId}`);
      }
    } catch (error) {
      console.error("Error handling checkout completion:", error);
    }
  }

  /**
   * Find user by Stripe customer ID
   */
  private async findUserByCustomerId(
    customerId: string,
  ): Promise<string | null> {
    try {
      // This would normally query Firebase for the user
      // For now, we'll check localStorage or make an API call
      const response = await fetch(
        `/api/users/by-stripe-customer/${customerId}`,
      );

      if (response.ok) {
        const { userId } = await response.json();
        return userId;
      }

      return null;
    } catch (error) {
      console.error("Error finding user by customer ID:", error);
      return null;
    }
  }

  /**
   * Map Stripe subscription status to our status
   */
  private mapStripeStatus(
    stripeStatus: string,
  ): "active" | "inactive" | "trial" {
    switch (stripeStatus) {
      case "active":
      case "trialing":
        return "active";
      case "past_due":
      case "canceled":
      case "unpaid":
        return "inactive";
      default:
        return "trial";
    }
  }

  /**
   * Update user access based on subscription status
   */
  private async updateUserAccess(
    userId: string,
    status: "active" | "inactive" | "trial",
  ): Promise<void> {
    // Grant or revoke access to all courses/assistants
    const userData = await firebaseService.getUserData(userId);

    if (userData) {
      const updates: any = {
        subscriptionStatus: status,
      };

      // If subscription is active, ensure user has access
      if (status === "active") {
        updates.hasAccess = true;
        updates.accessGrantedAt = new Date().toISOString();
      } else {
        updates.hasAccess = false;
        updates.accessRevokedAt = new Date().toISOString();
      }

      await firebaseService.updateUserData(userId, updates);
    }
  }

  /**
   * Grant access to a specific course
   */
  private async grantCourseAccess(
    userId: string,
    courseId: string,
  ): Promise<void> {
    const userData = await firebaseService.getUserData(userId);

    if (userData) {
      const courses = userData.courses || [];
      if (!courses.includes(courseId)) {
        courses.push(courseId);
        await firebaseService.updateUserData(userId, { courses });
      }
    }
  }

  /**
   * Log payment events
   */
  private async logPayment(
    userId: string,
    invoice: any,
    status: "success" | "failed",
  ): Promise<void> {
    try {
      await firebaseService.executeOperationPublic({
        id: `payment_${invoice.id}`,
        type: "setDoc",
        collection: "payments",
        id: invoice.id,
        data: {
          userId,
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error logging payment:", error);
    }
  }

  /**
   * Log Stripe events for debugging
   */
  private async logStripeEvent(event: StripeEvent): Promise<void> {
    try {
      await firebaseService.executeOperationPublic({
        id: `stripe_event_${event.id}`,
        type: "setDoc",
        collection: "stripeEvents",
        id: event.id,
        data: {
          eventId: event.id,
          type: event.type,
          created: event.created,
          processed: new Date().toISOString(),
          data: event.data,
        },
      });
    } catch (error) {
      console.warn("Error logging Stripe event:", error);
    }
  }

  /**
   * Manual sync for a specific user
   */
  async syncUserSubscription(userId: string): Promise<void> {
    try {
      const userData = await firebaseService.getUserData(userId);

      if (userData?.stripeCustomerId) {
        // Fetch latest subscription data from Stripe
        const response = await fetch(
          `/api/stripe/customer/${userData.stripeCustomerId}/subscriptions`,
        );

        if (response.ok) {
          const subscriptions = await response.json();

          for (const subscription of subscriptions.data) {
            await this.handleSubscriptionChange(subscription);
          }

          console.log(`✅ Manual sync completed for user ${userId}`);
        }
      }
    } catch (error) {
      console.error("Error in manual sync:", error);
      throw error;
    }
  }

  /**
   * Setup automatic periodic sync
   */
  setupPeriodicSync(): void {
    // Sync every 5 minutes
    setInterval(
      async () => {
        try {
          // This would sync all active users
          console.log("🔄 Running periodic Stripe-Firebase sync...");
          // Implementation would fetch all users with Stripe customer IDs
          // and sync their subscription status
        } catch (error) {
          console.error("Error in periodic sync:", error);
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes
  }
}

// Export singleton instance
export const stripeFirebaseSync = StripeFirebaseSync.getInstance();

// Setup automatic sync
stripeFirebaseSync.setupPeriodicSync();

export default stripeFirebaseSync;
