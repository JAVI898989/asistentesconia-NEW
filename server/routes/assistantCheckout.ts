import { Request, Response } from "express";

interface AssistantCheckoutRequest {
  assistantId: string;
  assistantName: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  userId: string;
  userEmail: string;
  referralCode?: string;
}

export async function createAssistantCheckout(req: Request, res: Response) {
  try {
    const { assistantId, assistantName, price, billingCycle, userId, userEmail, referralCode }: AssistantCheckoutRequest = req.body;

    console.log("🚀 Creating assistant checkout session:", {
      assistantId,
      assistantName,
      price,
      billingCycle,
      userId: userId.substring(0, 8) + '***',
      userEmail: userEmail.split('@')[0] + '***',
      referralCode: referralCode ? referralCode.substring(0, 4) + '***' : 'none'
    });

    // Basic validation
    if (!assistantId || !assistantName || !price || !billingCycle || !userId || !userEmail) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    if (price <= 0) {
      return res.status(400).json({ error: "Precio inválido" });
    }

    // Initialize Stripe
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return res.status(500).json({ error: "Stripe no configurado" });
    }

    const stripeModule = await import("stripe");
    const stripe = new stripeModule.default(stripeKey, {
      apiVersion: "2024-06-20"
    });

    // Create actual Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${assistantName} - Plan ${billingCycle === 'monthly' ? 'Mensual' : 'Anual'}`,
              description: `Acceso completo al asistente ${assistantName}${referralCode ? ' (Con código de referidos)' : ''}`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `https://bd5e2f145be243ac9c2fd44732d97045-450504c50cec4c3885e1c5065.fly.dev/asistentes/${assistantId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://bd5e2f145be243ac9c2fd44732d97045-450504c50cec4c3885e1c5065.fly.dev/asistentes/${assistantId}?canceled=true`,
      metadata: {
        assistantId,
        userId,
        billingCycle,
        referralCode: referralCode || '',
        type: 'assistant_subscription'
      },
      customer_email: userEmail,
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
    });

    console.log(`✅ Created Stripe session: ${session.id}`);
    console.log(`✅ Checkout URL: ${session.url}`);

    // Return the checkout URL
    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
      message: `Pago de €${price} para ${assistantName}`,
      referralCode: referralCode || null
    });

  } catch (error) {
    console.error("❌ Error creating assistant checkout:", error);

    // Fallback to direct payment links if Stripe fails
    let paymentLinkUrl;
    const price = req.body.price || 10;

    if (price <= 16) {
      paymentLinkUrl = "https://buy.stripe.com/test_28o4hzcRN2rXbtu000"; // €10
    } else if (price <= 30) {
      paymentLinkUrl = "https://buy.stripe.com/test_aEU6ppg02gPJ8lq9AB"; // €30
    } else if (price <= 100) {
      paymentLinkUrl = "https://buy.stripe.com/test_eVA28sg02c5fcw6eUV"; // €100
    } else {
      paymentLinkUrl = "https://buy.stripe.com/test_3csdRF8RH6SmcBq9AC"; // €300
    }

    console.log(`🔄 Fallback to payment link: ${paymentLinkUrl}`);

    res.json({
      success: true,
      url: paymentLinkUrl,
      message: `Pago de €${price} para ${req.body.assistantName || 'Asistente'}`,
      fallback: true
    });
  }
}
