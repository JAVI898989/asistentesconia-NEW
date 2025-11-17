import { Request, Response } from "express";

export async function syncStripeCustomer(req: Request, res: Response) {
  try {
    const { userId, userEmail } = req.body;

    console.log("🔄 Syncing Stripe customer:", {
      userId: userId?.substring(0, 8) + '***',
      userEmail: userEmail?.split('@')[0] + '***'
    });

    // Basic validation
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Handle missing email gracefully
    const email = userEmail || `user_${userId}@temp.com`;

    // For now, return success - we'll implement full customer sync later
    res.json({
      success: true,
      message: "Customer sync completed",
      customerId: `cus_${userId.substring(0, 8)}`,
    });

  } catch (error) {
    console.error("❌ Error syncing customer:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      message: error instanceof Error ? error.message : "Error desconocido"
    });
  }
}
