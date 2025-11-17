import { loadStripe } from "@stripe/stripe-js";
import { resolveReferralCode } from "./referralService";
import { ENV } from "./env";

// Use environment variable or fallback to hardcoded test key
const stripePublicKey = ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51QLiodGdxZHDR35wzIy7hpU6bxthcBhaY0t4VqSZpugaYD66OYEaUN3kSYX0wYCrdTixw7baj2SKoyadNnRE4YJI00EiikD4yE";

export const stripePromise = loadStripe(stripePublicKey);

interface CheckoutWithReferralData {
  assistantId: string;
  assistantName: string;
  price: number;
  billingCycle: "monthly" | "annual";
  isFounder: boolean;
  userId?: string;
  userEmail?: string;
  referralCode?: string;
}

interface AcademiaCheckoutWithReferralData {
  academiaId: string;
  academiaName: string;
  totalPrice: number;
  billingCycle: "monthly" | "annual";
  students: number;
  pricePerStudent: number;
  assistantId: string;
  userId?: string;
  userEmail?: string;
  referralCode?: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    organization: string;
  };
}

export const createCheckoutSessionWithReferral = async (data: CheckoutWithReferralData) => {
  try {
    console.log("🚀 Iniciando Stripe Checkout con referidos:", data);

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error("Stripe not loaded");
    }

    // Validate referral code if provided
    let referralValidation = null;
    if (data.referralCode) {
      referralValidation = await resolveReferralCode(data.referralCode, data.userId);

      if (!referralValidation.isValid) {
        throw new Error(`Código de referidos inválido: ${referralValidation.error}`);
      }

      console.log("✅ Código de referidos válido:", referralValidation);
    }

    // Create checkout session via API with referral metadata
    const response = await fetch("/api/stripe/create-checkout-with-referral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistantId: data.assistantId,
        assistantName: data.assistantName,
        price: data.price,
        billingCycle: data.billingCycle,
        isFounder: data.isFounder,
        userId: data.userId,
        userEmail: data.userEmail,
        referralCode: referralValidation?.code,
        referrerUserId: referralValidation?.referrerUserId,
        referrerRole: referralValidation?.referrerRole,
      }),
    });

    // Defensive response handling to prevent body stream issues
    let session;
    let responseText;

    try {
      responseText = await response.text();
      if (responseText) {
        session = JSON.parse(responseText);
      } else {
        session = {};
      }
    } catch (parseError) {
      console.error("❌ Error handling response:", parseError);
      throw new Error("Error al procesar respuesta del servidor de referidos");
    }

    if (!response.ok || !session?.sessionId) {
      throw new Error(session?.error || 'Failed to create checkout session with referrals');
    }

    // Open Stripe in external window (forces outside IDE/preview, prevents gray screen)
    if (session.url) {
      console.log("✅ Opening Stripe hosted checkout in external window:", session.url);
      window.open(session.url, '_blank', 'noopener,noreferrer,width=800,height=600');
    } else {
      console.error("❌ No checkout URL received from server");
      throw new Error("No se recibió URL de checkout. Inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("❌ Error en Stripe con referidos:", error);
    throw error;
  }
};

export const createAcademiaCheckoutSessionWithReferral = async (
  data: AcademiaCheckoutWithReferralData
) => {
  try {
    console.log("🏫 Iniciando checkout de Academia con referidos:", data);

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error("Stripe not loaded");
    }

    // Validate referral code if provided
    let referralValidation = null;
    if (data.referralCode) {
      referralValidation = await resolveReferralCode(data.referralCode, data.userId);

      if (!referralValidation.isValid) {
        throw new Error(`Código de referidos inválido: ${referralValidation.error}`);
      }

      console.log("✅ Código de referidos válido:", referralValidation);
    }

    // Create academia checkout session with referral metadata
    const response = await fetch("/api/stripe/create-academia-checkout-with-referral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        academiaId: data.academiaId,
        academiaName: data.academiaName,
        totalPrice: data.totalPrice,
        billingCycle: data.billingCycle,
        students: data.students,
        pricePerStudent: data.pricePerStudent,
        assistantId: data.assistantId,
        userId: data.userId,
        userEmail: data.userEmail,
        customerInfo: data.customerInfo,
        referralCode: referralValidation?.code,
        referrerUserId: referralValidation?.referrerUserId,
        referrerRole: referralValidation?.referrerRole,
      }),
    });

    // Defensive response handling to prevent body stream issues
    let session;
    let responseText;

    try {
      responseText = await response.text();
      if (responseText) {
        session = JSON.parse(responseText);
      } else {
        session = {};
      }
    } catch (parseError) {
      console.error("❌ Error handling academia response:", parseError);
      throw new Error("Error al procesar respuesta del servidor de academia");
    }

    if (!response.ok || !session?.sessionId) {
      throw new Error(session?.error || 'Failed to create academia checkout session');
    }

    // Open Stripe in external window (forces outside IDE/preview, prevents gray screen)
    if (session.url) {
      console.log("✅ Opening Stripe hosted checkout in external window:", session.url);
      window.open(session.url, '_blank', 'noopener,noreferrer,width=800,height=600');
    } else {
      console.error("❌ No checkout URL received from server");
      throw new Error("No se recibió URL de checkout. Inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("❌ Error en checkout de Academia con referidos:", error);
    throw error;
  }
};

// For backward compatibility, re-export original functions
export { createCheckoutSession, createAcademiaCheckoutSession } from "./stripe";
