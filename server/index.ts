import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleChatMessage } from "./routes/openai";
import {
  createCheckoutSession,
  createAcademiaCheckoutSession,
  handleWebhook,
} from "./routes/stripe";
import syllabusRouter from "./routes/syllabus";
import {
  createCheckoutSessionWithReferral,
  createAcademiaCheckoutSessionWithReferral,
  handleWebhookWithReferrals
} from "./routes/stripeWithReferrals";
import { createFamilyPackCheckoutSession } from "./routes/familyPackCheckout";
import { handleFamilyPackWebhook } from "./routes/familyPackWebhook";
import { createCheckoutSession } from "./routes/checkout";
import { diagnoseStripe } from "./routes/diagnose";
import { diagnoseSimple } from "./routes/diagnose-simple";
import { diagnoseAssistantStripe } from "./routes/assistant-diagnose";
import { createAssistantCheckout } from "./routes/assistantCheckout";
import { syncStripeCustomer } from "./routes/stripeSyncCustomer";
import { generateTests } from "./routes/generate-tests";
import { generateFlashcards } from "./routes/generate-flashcards";
import { generatePdf } from "./routes/generate-pdf";
import { generateTestsAdvanced } from "./routes/generate-tests-advanced";
import { generateFlashcardsAdvanced } from "./routes/generate-flashcards-advanced";

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());

  // Stripe webhook endpoint needs raw body
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleWebhook,
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // OpenAI routes
  app.post("/api/openai/chat", handleChatMessage);

  // Test and flashcard generation routes
  app.post("/api/generate-tests", generateTests);
  app.post("/api/generate-flashcards", generateFlashcards);
  app.post("/api/generate-tests-advanced", async (req, res) => {
    try {
      const result = await generateTestsAdvanced(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  app.post("/api/generate-flashcards-advanced", async (req, res) => {
    try {
      const result = await generateFlashcardsAdvanced(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // PDF generation route
  app.post("/api/generate-pdf", generatePdf);

  // Stripe routes
  app.post("/api/stripe/create-checkout", createCheckoutSession);
  app.post(
    "/api/stripe/create-academia-checkout",
    createAcademiaCheckoutSession,
  );

  // Stripe routes with referrals
  app.post("/api/stripe/create-checkout-with-referral", createCheckoutSessionWithReferral);
  app.post("/api/stripe/create-academia-checkout-with-referral", createAcademiaCheckoutSessionWithReferral);
  app.post("/api/stripe/webhook-with-referrals", handleWebhookWithReferrals);

  // Family pack routes
  app.post("/api/checkout/family-pack", createFamilyPackCheckoutSession);
  app.post("/api/webhook/family-pack", express.raw({ type: "application/json" }), handleFamilyPackWebhook);

  // Checkout session route
  app.post("/api/checkout/session", createCheckoutSession);

  // Assistant checkout route
  app.post("/api/assistant/checkout", createAssistantCheckout);

  // Stripe customer sync route
  app.post("/api/stripe/sync-customer", syncStripeCustomer);

  // Diagnostic routes (temporary)
  app.get("/api/checkout/diagnose", diagnoseStripe);
  app.get("/api/checkout/diagnose-simple", diagnoseSimple);
  app.get("/api/assistant/diagnose", diagnoseAssistantStripe);

  // Syllabus routes
  app.use("/api/syllabus", syllabusRouter);

  // Upload temario via server (fallback for CORS/storage issues)
  const { uploadTemarioHandler } = await import("./routes/uploadTemario");
  app.post("/api/upload-temario", express.json({ limit: '50mb' }), uploadTemarioHandler as any);

  return app;
}
