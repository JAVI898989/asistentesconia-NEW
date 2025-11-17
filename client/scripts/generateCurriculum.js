// Script para generar y guardar todo el contenido curricular en Firebase

import { generateAndSaveCurriculumContent } from "../lib/firebaseData.js";

const courses = [
  {
    id: "programador-desde-cero",
    name: "Programador desde Cero",
    themes: [
      "Introducción a la Programación",
      "Variables y Tipos de Datos",
      "Estructuras de Control",
      "Funciones y Métodos",
      "Arrays y Colecciones",
      "Programación Orientada a Objetos",
      "Bases de Datos",
      "Desarrollo Web",
      "Proyecto Final",
    ],
  },
  {
    id: "auxiliar-veterinaria",
    name: "Auxiliar de Veterinaria",
    themes: [
      "Anatomía Animal Básica",
      "Fisiología Veterinaria",
      "Técnicas de Exploración",
      "Primeros Auxilios",
      "Farmacología Básica",
      "Instrumentación Veterinaria",
      "Especies Menores",
      "Especies Mayores",
      "Práctica Profesional",
    ],
  },
  {
    id: "peluqueria-profesional",
    name: "Peluquería Profesional",
    themes: [
      "Anatomía del Cabello",
      "Técnicas de Corte",
      "Coloración Profesional",
      "Tratamientos Capilares",
      "Peinados y Recogidos",
      "Técnicas Avanzadas",
      "Atención al Cliente",
      "Gestión de Salón",
      "Portfolio Profesional",
    ],
  },
  {
    id: "electricista",
    name: "Electricista Profesional",
    themes: [
      "Fundamentos de Electricidad",
      "Circuitos Eléctricos",
      "Instalaciones Residenciales",
      "Instalaciones Industriales",
      "Normativa REBT",
      "Seguridad Eléctrica",
      "Automatización",
      "Mantenimiento",
      "Proyecto Integral",
    ],
  },
  {
    id: "fontaneria",
    name: "Fontanería Profesional",
    themes: [
      "Fundamentos de Fontanería",
      "Instalaciones de Agua",
      "Instalaciones de Gas",
      "Calefacción",
      "Saneamiento",
      "Herramientas y Materiales",
      "Reparaciones",
      "Mantenimiento",
      "Proyecto Final",
    ],
  },
];

async function generateAllContent() {
  console.log("🎯 INICIANDO GENERACIÓN DE CONTENIDO CURRICULAR");
  console.log("================================================");

  let totalGenerated = 0;
  let totalErrors = 0;

  for (const course of courses) {
    console.log(`\n📚 Procesando curso: ${course.name}`);
    console.log(`🔹 ID: ${course.id}`);
    console.log(`🔹 Temas: ${course.themes.length}`);

    for (let themeIndex = 0; themeIndex < course.themes.length; themeIndex++) {
      const themeName = course.themes[themeIndex];

      try {
        // Empezar desde el tema 2 (índice 1) para programador-desde-cero
        if (course.id === "programador-desde-cero" && themeIndex === 0) {
          console.log(
            `⏭️ Saltando tema ${themeIndex + 1}: ${themeName} (ya existente)`,
          );
          continue;
        }

        console.log(`\n🚀 Generando tema ${themeIndex + 1}: ${themeName}`);

        const success = await generateAndSaveCurriculumContent(
          course.id,
          themeIndex,
        );

        if (success) {
          totalGenerated++;
          console.log(`✅ ¡Tema guardado exitosamente!`);

          // Pausa pequeña para no sobrecargar Firebase
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          totalErrors++;
          console.log(`❌ Error al guardar tema`);
        }
      } catch (error) {
        totalErrors++;
        console.log(
          `❌ Error procesando tema ${themeIndex + 1}:`,
          error.message,
        );
      }
    }

    console.log(`\n📊 Curso ${course.name} completado`);
  }

  console.log("\n🎉 GENERACIÓN COMPLETADA");
  console.log("========================");
  console.log(`✅ Temas generados exitosamente: ${totalGenerated}`);
  console.log(`❌ Errores encontrados: ${totalErrors}`);
  console.log(
    `📈 Tasa de éxito: ${((totalGenerated / (totalGenerated + totalErrors)) * 100).toFixed(1)}%`,
  );
}

// Ejecutar la generación
generateAllContent().catch((error) => {
  console.error("❌ Error fatal en la generación:", error);
});
