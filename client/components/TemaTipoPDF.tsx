import React, { useState, useEffect } from "react";
import { getCurriculumContent, CurriculumContent } from "../lib/firebaseData";

interface TemaTipoPDFProps {
  courseId: string;
  themeIndex: number;
  themeTitle: string;
  themeDescription: string;
  forPrint?: boolean;
}

// Helper function to get course display name
const getCourseDisplayName = (courseId: string): string => {
  const courseNames: { [key: string]: string } = {
    "programador-desde-cero": "Programador desde Cero",
    "auxiliar-veterinaria": "Auxiliar de Veterinaria",
    "peluqueria-profesional": "Peluquería Profesional",
    electricista: "Electricista Profesional",
    fontaneria: "Fontanería Profesional",
    "mecanica-automovil": "Mecánica del Automóvil",
    soldadura: "Soldadura Profesional",
    jardineria: "Jardinería y Paisajismo",
    panaderia: "Panadería y Pastelería",
    carpinteria: "Carpintería Profesional",
  };
  return courseNames[courseId] || courseId;
};

export default function TemaTipoPDF({
  courseId,
  themeIndex,
  themeTitle,
  themeDescription,
  forPrint = false,
}: TemaTipoPDFProps) {
  const [content, setContent] = useState<CurriculumContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerClass = forPrint
    ? "pdf-content max-w-none mx-0 p-8 bg-white text-black font-serif"
    : "max-w-4xl mx-auto p-6 bg-white text-gray-900 font-serif rounded-lg shadow-lg";

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const curriculumContent = await getCurriculumContent(
          courseId,
          themeIndex,
        );

        if (curriculumContent) {
          setContent(curriculumContent);
        } else {
          setError("No se pudo cargar el contenido del tema");
        }
      } catch (err) {
        console.error("Error loading curriculum content:", err);
        setError("Error al cargar el contenido");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [courseId, themeIndex]);

  if (loading) {
    return (
      <div className={containerClass}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">
              Cargando contenido del tema...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className={containerClass}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error al cargar contenido
            </h2>
            <p className="text-gray-600">
              {error || "Contenido no disponible"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {/* Cover Page */}
      <div className="text-center mb-12 page-break-after min-h-screen flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-6 text-blue-800 leading-tight">
            Tema {themeIndex + 1}
          </h1>
          <h2 className="text-4xl font-semibold mb-8 text-gray-700">
            {content.title}
          </h2>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>

        <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-200 mx-auto max-w-2xl">
          <h3 className="text-2xl font-bold mb-4 text-blue-800">
            Información del Curso
          </h3>
          <div className="text-lg space-y-2">
            <p>
              <strong>Curso:</strong> {getCourseDisplayName(courseId)}
            </p>
            <p>
              <strong>Duración estimada:</strong> {content.duration}
            </p>
            <p>
              <strong>Nivel:</strong> {content.level}
            </p>
            <p>
              <strong>Modalidad:</strong> Teórico-Práctica
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500">
          <p className="text-lg">Academia Profesional de Formación</p>
          <p>{new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="mb-12 page-break-before">
        <h2 className="text-4xl font-bold mb-8 text-blue-800 border-b-4 border-blue-200 pb-4">
          Índice de Contenidos
        </h2>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="space-y-4 text-lg">
            {content.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-300 pb-3">
                <h3 className="font-bold text-gray-800 mb-2">
                  {section.title}
                </h3>
                <div className="ml-6 text-base text-gray-600">
                  <p>Desarrollo teórico y aplicaciones prácticas</p>
                </div>
              </div>
            ))}

            {content.exercises && content.exercises.length > 0 && (
              <div className="border-b border-gray-300 pb-3">
                <h3 className="font-bold text-gray-800 mb-2">
                  Ejercicios Prácticos
                </h3>
                <div className="ml-6 text-base text-gray-600">
                  <p>{content.exercises.length} ejercicios con soluciones</p>
                </div>
              </div>
            )}

            <div className="border-b border-gray-300 pb-3">
              <h3 className="font-bold text-gray-800 mb-2">
                Resumen y Conclusiones
              </h3>
              <div className="ml-6 text-base text-gray-600">
                <p>Síntesis de conceptos clave</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {content.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-16 page-break-before">
          <h2 className="text-4xl font-bold mb-8 text-blue-800 border-b-4 border-blue-200 pb-4">
            {section.title}
          </h2>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 mb-8">
              <div className="whitespace-pre-line text-lg leading-relaxed text-justify">
                {section.content}
              </div>
            </div>

            {section.subsections &&
              section.subsections.map((subsection, subIndex) => (
                <div key={subIndex} className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-blue-700 border-l-4 border-blue-300 pl-4">
                    {subsection.title}
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {subsection.content}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Exercises Section */}
      {content.exercises && content.exercises.length > 0 && (
        <div className="mb-16 page-break-before">
          <h2 className="text-4xl font-bold mb-8 text-blue-800 border-b-4 border-blue-200 pb-4">
            Ejercicios Prácticos
          </h2>

          <div className="space-y-8">
            {content.exercises.map((exercise, exerciseIndex) => (
              <div
                key={exerciseIndex}
                className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-start mb-4">
                  <div className="bg-green-100 rounded-full p-3 mr-4 mt-1">
                    <span className="text-green-800 font-bold text-lg">
                      {exerciseIndex + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {exercise.title}
                    </h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {exercise.description}
                    </div>
                  </div>
                </div>

                {exercise.solution && (
                  <div className="mt-6 p-6 bg-gray-50 rounded border">
                    <h4 className="font-bold text-gray-800 mb-3">Solución:</h4>
                    <div className="text-gray-700 whitespace-pre-line font-mono text-sm">
                      {exercise.solution}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Section */}
      {content.summary && (
        <div className="mb-16 page-break-before">
          <h2 className="text-4xl font-bold mb-8 text-blue-800 border-b-4 border-blue-200 pb-4">
            Resumen del Tema
          </h2>

          <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-200">
            <div className="whitespace-pre-line text-lg leading-relaxed text-justify">
              {content.summary}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 text-center text-gray-500 border-t border-gray-200 pt-8">
        <p className="text-lg font-semibold">
          Academia Profesional de Formación
        </p>
        <p>© {new Date().getFullYear()} - Material educativo protegido</p>
        <p className="text-sm mt-2">
          Tema {themeIndex + 1}: {content.title} -{" "}
          {getCourseDisplayName(courseId)}
        </p>
      </div>
    </div>
  );
}
