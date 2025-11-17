import { RequestHandler } from "express";

// Use environment variable with fallback to hardcoded test key
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ||
  "sk_test_51QLiodGdxZHDR35wlP0JKecvhnZlIl2fkS70KZ2iDD7VFF3qv09VA5hGn2clggTtQwaM6J6z7yiw99qeechjt5Jm00qRUS88cP";

interface Stripe {
  checkout: {
    sessions: {
      create: (params: any) => Promise<any>;
    };
  };
}

let stripe: Stripe;

// Dynamically import Stripe
async function getStripe() {
  if (!stripe) {
    const stripeModule = await import("stripe");
    stripe = new stripeModule.default(STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20" as any,
    });
  }
  return stripe;
}

export const createCheckoutSession: RequestHandler = async (req, res) => {
  try {
    console.log("🚀 Creating robust checkout session with body:", req.body);

    // Environment validation
    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Falta STRIPE_SECRET_KEY" });
    }

    const {
      assistantId,
      assistantName,
      price,
      billingCycle,
      isFounder,
      userId,
    } = req.body;

    console.log("📊 Extracted data:", {
      assistantId,
      assistantName,
      price,
      billingCycle,
      isFounder,
      userId,
    });

    // Input validation
    if (!assistantId || !assistantName || !price || !billingCycle) {
      console.error("❌ Missing required fields");
      return res.status(400).json({
        error: "Missing required fields: assistantId, assistantName, price, billingCycle",
      });
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: "Precio inválido" });
    }

    // Validate billing cycle
    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ error: "Ciclo de facturación inválido" });
    }

    const stripe = await getStripe();
    console.log("Stripe instance created successfully");

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
      metadata: {
        userId: userId || "anonymous",
        assistantId,
        assistantName,
        billingCycle,
        isFounder: isFounder.toString(),
        price: price.toString(),
      },
    };

    console.log("🔧 Creating Stripe session with data:", sessionData);
    const session = await stripe.checkout.sessions.create(sessionData);
    console.log("✅ Session created successfully:", session.id);

    // Critical URL validation (prevents gray screen issues)
    if (!session.url) {
      throw new Error('Stripe no devolvió session.url');
    }

    if (!/^https:\/\/checkout\.stripe\.com\/c\/pay\//.test(session.url)) {
      throw new Error('La URL devuelta no es de Hosted Checkout esperada');
    }

    console.log("🔗 Checkout OK", {
      id: session.id,
      url: session.url,
      livemode: session.livemode,
      urlValid: session.url.startsWith('https://checkout.stripe.com/')
    });

    // Return URL for hosted checkout (prevents gray screen)
    res.json({
      url: session.url,
      id: session.id
    });

  } catch (error: any) {
    console.error("❌ Error creating checkout session:", error);

    // Provide specific error messages
    let errorMessage = "Error creating checkout session. Please try again.";
    if (error.message?.includes('Stripe no devolvió')) {
      errorMessage = "Error de configuración de Stripe. Contacta al soporte.";
    } else if (error.message?.includes('URL devuelta no es')) {
      errorMessage = "URL de checkout inválida. Contacta al soporte.";
    }

    res.status(500).json({
      error: errorMessage,
      details: error.message
    });
  }
};

export const createAcademiaCheckoutSession: RequestHandler = async (
  req,
  res,
) => {
  try {
    console.log("Creating academia checkout session with body:", req.body);

    const {
      academiaId,
      academiaName,
      totalPrice,
      billingCycle,
      students,
      pricePerStudent,
      userId,
      customerInfo,
    } = req.body;

    console.log("Extracted academia data:", {
      academiaId,
      academiaName,
      totalPrice,
      billingCycle,
      students,
      pricePerStudent,
      userId,
      customerInfo,
    });

    if (
      !academiaId ||
      !academiaName ||
      !totalPrice ||
      !billingCycle ||
      !students ||
      !customerInfo
    ) {
      console.error("Missing required fields for academia");
      return res.status(400).json({
        error: "Missing required fields for academia checkout",
      });
    }

    const stripe = await getStripe();
    console.log("Stripe instance created successfully");

    // Calculate the correct amount based on billing cycle
    // For annual plans, we want to charge 10 months worth (2 months free)
    const unitAmount =
      billingCycle === "annual"
        ? Math.round(totalPrice * 10 * 100) // 10 months price for annual (2 months free)
        : totalPrice * 100; // Monthly price

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
      metadata: {
        userId: userId || "anonymous",
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
      },
    };

    console.log("Creating academia session with data:", sessionData);
    const session = await stripe.checkout.sessions.create(sessionData);
    console.log("Academia session created successfully:", session.id);

    // Return URL for hosted checkout (prevents gray screen)
    res.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error("Error creating academia checkout session:", error);
    res.status(500).json({
      error: "Error creating academia checkout session. Please try again.",
    });
  }
};

export const handleWebhook: RequestHandler = async (req, res) => {
  try {
    const stripe = await getStripe();
    const sig = req.headers["stripe-signature"] as string;

    // In a real application, you would verify the webhook signature
    // For this demo, we'll just acknowledge receipt

    const event = req.body;

    switch (event.type) {
      case "checkout.session.completed":
        console.log("Payment successful:", event.data.object);
        // Here you would typically:
        // 1. Update user subscription status in your database
        // 2. Send confirmation email
        // 3. Grant access to premium features
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
