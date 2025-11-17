import { createCurriculumTheme } from "./firebaseData";

// Generate initial themes for assistants
export const generateInitialThemes = async (assistantId: string, assistantName: string) => {
  console.log(`🎯 Generating initial themes for ${assistantName}...`);

  try {
    // Generate 9 basic themes for the assistant
    const themes = [
      {
        number: 1,
        title: "Introducción y Marco General",
        description: "Fundamentos básicos y conceptos generales",
        content: generateThemeContent(assistantName, 1, "Introducción y Marco General")
      },
      {
        number: 2,
        title: "Marco Normativo y Legal",
        description: "Legislación aplicable y marco jurídico",
        content: generateThemeContent(assistantName, 2, "Marco Normativo y Legal")
      },
      {
        number: 3,
        title: "Organización y Estructura",
        description: "Estructura organizativa y jerarquías",
        content: generateThemeContent(assistantName, 3, "Organización y Estructura")
      },
      {
        number: 4,
        title: "Procedimientos y Protocolos",
        description: "Procesos administrativos y protocolos",
        content: generateThemeContent(assistantName, 4, "Procedimientos y Protocolos")
      },
      {
        number: 5,
        title: "Funciones y Competencias",
        description: "Responsabilidades y ámbitos de actuación",
        content: generateThemeContent(assistantName, 5, "Funciones y Competencias")
      },
      {
        number: 6,
        title: "Normativa Específica",
        description: "Regulaciones particulares del sector",
        content: generateThemeContent(assistantName, 6, "Normativa Específica")
      },
      {
        number: 7,
        title: "Casos Prácticos y Aplicaciones",
        description: "Ejemplos reales y supuestos prácticos",
        content: generateThemeContent(assistantName, 7, "Casos Prácticos y Aplicaciones")
      },
      {
        number: 8,
        title: "Recursos y Herramientas",
        description: "Instrumentos y recursos disponibles",
        content: generateThemeContent(assistantName, 8, "Recursos y Herramientas")
      },
      {
        number: 9,
        title: "Evaluación y Exámenes",
        description: "Sistemas de evaluación y pruebas",
        content: generateThemeContent(assistantName, 9, "Evaluación y Exámenes")
      }
    ];

    // Create themes in Firebase with fallback to localStorage
    for (const theme of themes) {
      try {
        const themeId = await createCurriculumTheme({
          assistantId,
          number: theme.number,
          title: theme.title,
          description: theme.description,
          content: theme.content,
          order: theme.number,
          isActive: true,
        });

        if (!themeId) {
          console.warn(`Firebase save failed for theme ${theme.number}, using localStorage fallback`);
          // Fallback to localStorage
          const localKey = `curriculum_${assistantId}_${theme.number}`;
          const themeData = {
            id: `theme-${assistantId}-${theme.number}`,
            assistantId,
            number: theme.number,
            title: theme.title,
            description: theme.description,
            content: theme.content,
            order: theme.number,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          localStorage.setItem(localKey, JSON.stringify(themeData));
        }
      } catch (error) {
        console.warn(`Firebase error for theme ${theme.number}, using localStorage:`, error);
        // Fallback to localStorage
        const localKey = `curriculum_${assistantId}_${theme.number}`;
        const themeData = {
          id: `theme-${assistantId}-${theme.number}`,
          assistantId,
          number: theme.number,
          title: theme.title,
          description: theme.description,
          content: theme.content,
          order: theme.number,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(localKey, JSON.stringify(themeData));
      }
    }

    // Save index of generated themes
    const indexKey = `curriculum_index_${assistantId}`;
    const themeIndex = themes.map(t => t.number);
    localStorage.setItem(indexKey, JSON.stringify(themeIndex));

    console.log(`✅ Successfully generated ${themes.length} themes for ${assistantName}`);
    return themes.length;

  } catch (error) {
    console.error(`❌ Error generating themes for ${assistantName}:`, error);
    throw error;
  }
};

// Generate HTML content for a theme
const generateThemeContent = (assistantName: string, themeNumber: number, themeTitle: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tema ${themeNumber}: ${themeTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        h2 {
            color: #1d4ed8;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            color: #3730a3;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .summary {
            background: #f0f9ff;
            padding: 20px;
            border-left: 5px solid #2563eb;
            margin: 20px 0;
        }
        .key-points {
            background: #fef3c7;
            padding: 20px;
            border-left: 5px solid #f59e0b;
            margin: 20px 0;
        }
        .legal-ref {
            background: #f3f4f6;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin: 5px 0;
        }
        .important {
            background: #fee2e2;
            border: 1px solid #fca5a5;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>Tema ${themeNumber}: ${themeTitle}</h1>

    <h2>1. Introducción</h2>
    <p>
        Este tema aborda los aspectos fundamentales de <strong>${themeTitle}</strong>
        en el contexto de <strong>${assistantName}</strong>. Es esencial comprender
        estos conceptos para el desarrollo profesional en esta área.
    </p>

    <h2>2. Objetivos del Tema</h2>
    <ul>
        <li>Comprender los fundamentos teóricos de ${themeTitle}</li>
        <li>Analizar la aplicación práctica en el ámbito de ${assistantName}</li>
        <li>Identificar las competencias clave necesarias</li>
        <li>Desarrollar habilidades específicas para la práctica profesional</li>
    </ul>

    <h2>3. Desarrollo del Contenido</h2>

    <h3>3.1 Marco Conceptual</h3>
    <p>
        Los fundamentos de ${themeTitle} se basan en principios establecidos
        que han sido desarrollados a lo largo del tiempo. Es importante
        entender estos principios para aplicarlos correctamente en el
        contexto profesional.
    </p>

    <div class="legal-ref">
        <h4>Marco Normativo</h4>
        <p>
            La normativa aplicable incluye las regulaciones específicas
            del sector y las disposiciones generales que afectan a
            ${assistantName}.
        </p>
    </div>

    <h3>3.2 Aplicación Práctica</h3>
    <p>
        La aplicación práctica de ${themeTitle} requiere un conocimiento
        detallado de los procedimientos y protocolos establecidos.
        Estos elementos son cruciales para el desempeño efectivo.
    </p>

    <ol>
        <li>Identificación de requerimientos específicos</li>
        <li>Análisis de la situación actual</li>
        <li>Implementación de medidas apropiadas</li>
        <li>Seguimiento y evaluación de resultados</li>
    </ol>

    <h2>4. Casos Prácticos</h2>

    <div class="important">
        <h4>Caso de Estudio 1</h4>
        <p>
            En situaciones donde se requiere la aplicación de ${themeTitle},
            es fundamental seguir los protocolos establecidos y mantener
            una comunicación efectiva con todas las partes involucradas.
        </p>
    </div>

    <h2>5. Competencias Requeridas</h2>
    <ul>
        <li><strong>Conocimientos teóricos:</strong> Dominio de los fundamentos conceptuales</li>
        <li><strong>Habilidades prácticas:</strong> Capacidad de aplicación en situaciones reales</li>
        <li><strong>Competencias transversales:</strong> Comunicación, trabajo en equipo, resolución de problemas</li>
        <li><strong>Actualización continua:</strong> Mantenerse al día con cambios normativos y mejores prácticas</li>
    </ul>

    <div class="summary">
        <h3>Resumen del Tema</h3>
        <p>
            Este tema ha cubierto los aspectos esenciales de ${themeTitle}
            en el contexto de ${assistantName}. Los puntos clave incluyen:
        </p>
        <ul>
            <li>Los fundamentos teóricos y su importancia</li>
            <li>La aplicación práctica en situaciones profesionales</li>
            <li>Los casos de estudio y ejemplos relevantes</li>
            <li>Las competencias necesarias para el desempeño efectivo</li>
        </ul>
    </div>

    <div class="key-points">
        <h3>CLAVES PARA MEMORIZAR</h3>
        <ul>
            <li><strong>Concepto principal:</strong> ${themeTitle} es fundamental para ${assistantName}</li>
            <li><strong>Aplicación:</strong> Requiere conocimiento teórico y habilidades prácticas</li>
            <li><strong>Competencias:</strong> Combinación de conocimientos, habilidades y actitudes</li>
            <li><strong>Evaluación:</strong> Se basa en la comprensión y aplicación efectiva</li>
        </ul>
    </div>

    <h2>6. Bibliografía y Referencias</h2>
    <ul>
        <li>Normativa específica del sector</li>
        <li>Manuales oficiales de ${assistantName}</li>
        <li>Publicaciones especializadas</li>
        <li>Jurisprudencia relevante</li>
    </ul>

    <hr style="margin-top: 40px; border: 1px solid #e5e7eb;">
    <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px;">
        © Contenido educativo - ${assistantName} - Tema ${themeNumber}
    </p>
</body>
</html>`;
};

// Check if assistant has themes, if not generate them
export const ensureAssistantHasThemes = async (assistantId: string, assistantName: string) => {
  try {
    // Import here to avoid circular dependency
    const { getCurriculumThemes } = await import("./firebaseData");

    const existingThemes = await getCurriculumThemes(assistantId);

    if (existingThemes.length === 0) {
      console.log(`📚 No themes found for ${assistantName}, generating initial themes...`);
      await generateInitialThemes(assistantId, assistantName);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking/generating themes:", error);
    return false;
  }
};
