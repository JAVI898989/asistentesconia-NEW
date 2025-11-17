import { createGuardiaCivilCurriculum } from "./createGuardiaCivilCurriculum";

// Execute Guardia Civil curriculum generation immediately
export const executeGuardiaCivilGeneration = async () => {
  try {
    console.log("🚀 Starting Guardia Civil curriculum generation...");
    const result = await createGuardiaCivilCurriculum();
    console.log("✅ Guardia Civil curriculum generation completed!");
    return result;
  } catch (error) {
    const errorMessage = error?.message || String(error);
    console.error("❌ Guardia Civil generation failed:", errorMessage);

    // In production, don't throw but return false gracefully
    const isProduction = typeof window !== 'undefined' && (window.location.hostname.includes('fly.dev') || window.location.hostname.includes('bd5e2f145be243ac9c2fd44732d97045'));

    if (isProduction) {
      console.log("🔄 Production error handled gracefully - curriculum generation skipped");
      return false;
    }

    return false;
  }
};

// Auto-execute when this module is imported (only in development)
if (typeof window !== 'undefined') {
  const isProduction = window.location.hostname.includes('fly.dev') || window.location.hostname.includes('bd5e2f145be243ac9c2fd44732d97045');

  if (!isProduction) {
    console.log("🎯 Auto-executing Guardia Civil curriculum generation...");
    executeGuardiaCivilGeneration().then((success) => {
      if (success) {
        console.log("🎉 Guardia Civil curriculum ready!");
      } else {
        console.error("💥 Guardia Civil curriculum generation failed");
      }
    });
  } else {
    console.log("🚫 Production environment detected - skipping auto-execution of curriculum generation");
    console.log("💡 To generate curriculum in production, call executeGuardiaCivilGeneration() manually");
  }
}
