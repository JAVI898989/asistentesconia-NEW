import React, { useState, useEffect } from "react";
import { generateAndSaveCurriculumContent } from "../lib/firebaseData";

const courses = [
  {
    id: "programador-desde-cero",
    name: "Programador desde Cero",
    startFromTheme: 1, // Empezar desde tema 2 (índice 1)
    totalThemes: 9,
  },
  {
    id: "auxiliar-veterinaria",
    name: "Auxiliar de Veterinaria",
    startFromTheme: 0,
    totalThemes: 9,
  },
  {
    id: "peluqueria-profesional",
    name: "Peluquería Profesional",
    startFromTheme: 0,
    totalThemes: 9,
  },
  {
    id: "electricista",
    name: "Electricista Profesional",
    startFromTheme: 0,
    totalThemes: 9,
  },
  {
    id: "fontaneria",
    name: "Fontanería Profesional",
    startFromTheme: 0,
    totalThemes: 9,
  },
];

export default function CurriculumGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentCourse, setCurrentCourse] = useState("");
  const [currentTheme, setCurrentTheme] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState({
    generated: 0,
    errors: 0,
  });
  const [autoStarted, setAutoStarted] = useState(false);

  // Auto-start generation when component mounts
  useEffect(() => {
    if (!autoStarted) {
      setAutoStarted(true);
      addLog("🎯 Iniciando generación automática de todo el contenido...");
      setTimeout(() => {
        generateAllContent();
      }, 2000);
    }
  }, [autoStarted]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const generateAllContent = async () => {
    setIsGenerating(true);
    setLogs([]);
    setResults({ generated: 0, errors: 0 });

    addLog("🎯 INICIANDO GENERACIÓN DE CONTENIDO CURRICULAR");

    let totalGenerated = 0;
    let totalErrors = 0;
    let totalThemes = 0;

    // Calcular total de temas
    courses.forEach((course) => {
      totalThemes += course.totalThemes - course.startFromTheme;
    });

    let processedThemes = 0;

    for (const course of courses) {
      setCurrentCourse(course.name);
      addLog(`\n📚 Procesando curso: ${course.name}`);

      for (
        let themeIndex = course.startFromTheme;
        themeIndex < course.totalThemes;
        themeIndex++
      ) {
        setCurrentTheme(themeIndex + 1);

        try {
          addLog(`🚀 Generando tema ${themeIndex + 1} de ${course.name}...`);

          const success = await generateAndSaveCurriculumContent(
            course.id,
            themeIndex,
          );

          if (success) {
            totalGenerated++;
            addLog(
              `✅ Tema ${themeIndex + 1} guardado exitosamente en Firebase`,
            );
          } else {
            totalErrors++;
            addLog(`❌ Error al guardar tema ${themeIndex + 1}`);
          }

          processedThemes++;
          setProgress((processedThemes / totalThemes) * 100);
          setResults({ generated: totalGenerated, errors: totalErrors });

          // Pausa pequeña para no sobrecargar Firebase
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error: any) {
          totalErrors++;
          addLog(
            `❌ Error procesando tema ${themeIndex + 1}: ${error.message}`,
          );
          setResults({ generated: totalGenerated, errors: totalErrors });
        }
      }

      addLog(`📊 Curso ${course.name} completado`);
    }

    addLog("\n🎉 GENERACIÓN COMPLETADA");
    addLog(`✅ Temas generados exitosamente: ${totalGenerated}`);
    addLog(`❌ Errores encontrados: ${totalErrors}`);
    addLog(
      `📈 Tasa de éxito: ${((totalGenerated / (totalGenerated + totalErrors)) * 100).toFixed(1)}%`,
    );

    setIsGenerating(false);
    setCurrentCourse("");
    setCurrentTheme(0);
  };

  const generateSingleTheme = async (
    courseId: string,
    themeIndex: number,
    courseName: string,
  ) => {
    setIsGenerating(true);
    setCurrentCourse(courseName);
    setCurrentTheme(themeIndex + 1);

    addLog(`🚀 Generando tema ${themeIndex + 1} de ${courseName}...`);

    try {
      const success = await generateAndSaveCurriculumContent(
        courseId,
        themeIndex,
      );

      if (success) {
        addLog(
          `✅ Tema ${themeIndex + 1} de ${courseName} guardado exitosamente en Firebase`,
        );
        setResults((prev) => ({ ...prev, generated: prev.generated + 1 }));
      } else {
        addLog(`❌ Error al guardar tema ${themeIndex + 1} de ${courseName}`);
        setResults((prev) => ({ ...prev, errors: prev.errors + 1 }));
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setResults((prev) => ({ ...prev, errors: prev.errors + 1 }));
    }

    setIsGenerating(false);
    setCurrentCourse("");
    setCurrentTheme(0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          🎓 Generador de Contenido Curricular
        </h1>
        <p className="text-gray-600">
          Herramienta para generar y guardar contenido extenso en Firebase
        </p>
      </div>

      {/* Estado actual */}
      {isGenerating && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            🔄 Generando contenido...
          </h3>

          {currentCourse && (
            <p className="text-blue-700">📚 Curso: {currentCourse}</p>
          )}

          {currentTheme > 0 && (
            <p className="text-blue-700">📖 Tema: {currentTheme}</p>
          )}

          <div className="mt-3">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Progreso: {progress.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800">
            ✅ Temas Generados
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {results.generated}
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800">❌ Errores</h3>
          <p className="text-3xl font-bold text-red-600">{results.errors}</p>
        </div>
      </div>

      {/* Controles */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🎮 Controles de Generación
        </h3>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={generateAllContent}
            disabled={isGenerating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Generar Todo el Contenido (41 temas)
          </button>

          <button
            onClick={() =>
              generateSingleTheme(
                "programador-desde-cero",
                1,
                "Programador desde Cero",
              )
            }
            disabled={isGenerating}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📝 Solo Tema 2 de Programación
          </button>

          <button
            onClick={() => setLogs([])}
            disabled={isGenerating}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🧹 Limpiar Logs
          </button>
        </div>
      </div>

      {/* Generación rápida por curso */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">
          ⚡ Generación Rápida por Curso
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                // Generar solo el primer tema del curso para prueba
                generateSingleTheme(
                  course.id,
                  course.startFromTheme,
                  course.name,
                );
              }}
              disabled={isGenerating}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {course.name}
            </button>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="p-4 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          📋 Registro de Actividad
        </h3>

        <div className="bg-black rounded p-4 h-96 overflow-y-auto">
          <div className="font-mono text-sm text-green-400">
            {logs.length === 0 ? (
              <p className="text-gray-500">Esperando iniciar generación...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Información del proceso */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          ℹ️ Información del Proceso
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Cada tema genera contenido de mínimo 10 páginas</li>
          <li>
            • Incluye ejemplos prácticos, ejercicios con soluciones y resumen
          </li>
          <li>• Se guarda automáticamente en Firebase Firestore</li>
          <li>
            • Programador desde Cero empieza desde tema 2 (Variables y Tipos de
            Datos)
          </li>
          <li>• Otros cursos empiezan desde tema 1</li>
          <li>• Total estimado: ~40 temas across all courses</li>
        </ul>
      </div>
    </div>
  );
}
