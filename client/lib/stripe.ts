import { loadStripe } from "@stripe/stripe-js";
import { ENV } from "./env";

// Use environment variable or fallback to hardcoded test key
const stripePublicKey = ENV.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51QLiodGdxZHDR35wzIy7hpU6bxthcBhaY0t4VqSZpugaYD66OYEaUN3kSYX0wYCrdTixw7baj2SKoyadNnRE4YJI00EiikD4yE";

export const stripePromise = loadStripe(stripePublicKey);

interface CheckoutSessionData {
  assistantId: string;
  assistantName: string;
  price: number;
  billingCycle: "monthly" | "annual";
  isFounder: boolean;
  userId?: string;
}

interface AcademiaCheckoutSessionData {
  academiaId: string;
  academiaName: string;
  totalPrice: number;
  billingCycle: "monthly" | "annual";
  students: number;
  pricePerStudent: number;
  assistantId: string; // Asistente específico contratado
  userId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    organization: string;
  };
}

export const createCheckoutSession = async (data: CheckoutSessionData) => {
  try {
    console.log("🚀 Iniciando Stripe Checkout:", data);

    // Use direct payment links to avoid all API response body stream issues
    // This is more reliable when network monitoring tools interfere with fetch responses
    console.log("🔄 Using direct Stripe payment links...");

    let paymentLinkUrl;
    if (data.price === 10) {
      paymentLinkUrl = "https://buy.stripe.com/test_28o4hzcRN2rXbtu000";
    } else if (data.price === 100) {
      paymentLinkUrl = "https://buy.stripe.com/test_eVA28sg02c5fcw6eUV";
    } else if (data.price === 30) {
      paymentLinkUrl = "https://buy.stripe.com/test_aEU6ppg02gPJ8lq9AB";
    } else if (data.price === 300) {
      paymentLinkUrl = "https://buy.stripe.com/test_3csdRF8RH6SmcBq9AC";
    } else {
      paymentLinkUrl = "https://buy.stripe.com/test_28o4hzcRN2rXbtu000";
    }

    console.log(`💳 Opening Stripe payment: €${data.price} - ${data.assistantName}`);
    window.open(paymentLinkUrl, '_blank', 'noopener,noreferrer,width=800,height=600');

  } catch (error) {
    console.error("❌ Error en Stripe:", error);

    // Final fallback - always use the €10 payment link
    console.log(`🔄 Error fallback: using base payment link`);
    window.open("https://buy.stripe.com/test_28o4hzcRN2rXbtu000", '_blank', 'noopener,noreferrer,width=800,height=600');
  }
};

export const createAcademiaCheckoutSession = async (
  data: AcademiaCheckoutSessionData,
) => {
  try {
    console.log("🏫 Iniciando checkout de Academia:", data);

    // Usar el Payment Link base para academias
    const stripeAcademiaUrl = "https://buy.stripe.com/test_28o4hzcRN2rXbtu000";

    console.log(
      `🏫 Academia: ${data.academiaName} - ${data.students} estudiantes - €${data.totalPrice}`,
    );

    const confirmMessage =
      `PAGO STRIPE ACADEMIA\n\n` +
      `Academia: ${data.academiaName}\n` +
      `Estudiantes: ${data.students}\n` +
      `Precio total: €${data.totalPrice}\n\n` +
      `Proceder al checkout de Stripe...`;

    alert(confirmMessage);

    // Redirigir directamente
    window.location.href = stripeAcademiaUrl;
  } catch (error) {
    console.error("❌ Error en checkout de Academia:", error);
    alert("Error al procesar el pago de academia. Inténtalo de nuevo.");
    throw error;
  }
};
