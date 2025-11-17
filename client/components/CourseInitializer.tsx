import React, { useEffect, useState } from "react";
import { checkAndGenerateCoursesIfNeeded } from "@/lib/courseAutoGenerator";

const CourseInitializer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    const initializeCourses = async () => {
      // Only run once per session
      if (hasGenerated || isGenerating) return;

      setIsGenerating(true);

      try {
        console.log("🔄 SISTEMA EN MODO LOCAL (protegiendo quota Firebase)");
        console.log("📚 Contenido de cursos disponible bajo demanda...");

        // Skip bulk generation to protect Firebase quota
        setHasGenerated(true);

        // Mark as completed for this session
        localStorage.setItem("coursesGenerated", "true");
        localStorage.setItem("lastGenerationTime", new Date().toISOString());

        console.log("✅ Sistema listo - contenido se genera individualmente");
      } catch (error: any) {
        // Handle all errors gracefully
        if (
          error.message?.includes("NetworkError") ||
          error.message?.includes("fetch") ||
          error.name === "NetworkError"
        ) {
          console.log(
            "🔄 PROBLEMA DE RED: Los cursos funcionan en modo offline",
          );
        } else {
          console.log("🔄 Error manejado: Los cursos funcionan con datos demo");
        }
        setHasGenerated(true); // Mark as completed even with errors
      } finally {
        setIsGenerating(false);
      }
    };

    // Run immediately to ensure courses are generated quickly
    const timer = setTimeout(initializeCourses, 1000);

    return () => clearTimeout(timer);
  }, [hasGenerated, isGenerating]);

  // Show a subtle indicator during generation (optional)
  if (isGenerating) {
    console.log("⚡ Generando cursos en segundo plano...");
  }

  // This component doesn't render anything visible
  return null;
};

export default CourseInitializer;
