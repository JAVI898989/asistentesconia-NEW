import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  Lock,
  PlayCircle,
  FileText,
  Target,
  Lightbulb,
  Clock,
  Star,
  Download,
  Users,
  Award,
  Video,
} from "lucide-react";
import { ProfessionalCourse, CourseTheme } from "@/lib/firebaseData";

interface TemarioCompletoProps {
  course: ProfessionalCourse;
  themes: CourseTheme[];
  hasAccess: boolean;
  onThemeSelect: (theme: CourseTheme) => void;
}

export default function TemarioCompleto({
  course,
  themes,
  hasAccess,
  onThemeSelect,
}: TemarioCompletoProps) {
  // Debug logging
  console.log("📋 TemarioCompleto - Course:", course?.name);
  console.log("📚 TemarioCompleto - Themes received:", themes?.length || 0);
  console.log("🔐 TemarioCompleto - Has access:", hasAccess);

  if (themes) {
    themes.forEach((theme, index) => {
      console.log(
        `  Tema ${index + 1}: ${theme.title} (${theme.questions?.length || 0} preguntas)`,
      );
    });
  }

  const completedThemes =
    themes?.filter((theme) => {
      return theme.testScore && theme.testScore >= 8;
    }).length || 0;

  const progressPercentage = themes?.length
    ? Math.round((completedThemes / themes.length) * 100)
    : 0;

  const totalEstimatedHours =
    themes?.reduce((total, theme) => {
      return total + (theme.estimatedHours || 4);
    }, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Temario del Curso - {course.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">
                Descripción del Curso
              </h3>
              <p className="text-slate-300 mb-4">{course.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Categoría:</span>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {course.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dificultad:</span>
                  <Badge
                    className={
                      course.difficulty === "easy"
                        ? "bg-green-500/20 text-green-400"
                        : course.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }
                  >
                    {course.difficulty === "easy"
                      ? "Fácil"
                      : course.difficulty === "medium"
                        ? "Medio"
                        : "Avanzado"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Duración estimada:</span>
                  <span className="text-slate-300">
                    {totalEstimatedHours}h total
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Temas:</span>
                  <span className="text-slate-300">
                    {themes.length} módulos
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">
                Progreso General
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Temas completados:</span>
                  <span className="text-green-400 font-semibold">
                    {completedThemes} / {themes.length}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="text-center text-slate-300 text-sm">
                  {progressPercentage}% completado
                </div>

                {hasAccess && (
                  <div className="pt-2">
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Acceso completo
                    </Badge>
                  </div>
                )}

                {!hasAccess && (
                  <div className="pt-2">
                    <Badge className="bg-slate-600 text-slate-400">
                      <Lock className="w-3 h-3 mr-1" />
                      Vista previa - Acceso limitado
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Themes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          Temas del Curso ({themes?.length || 0})
        </h2>

        {!themes || themes.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <div className="text-slate-400 mb-4">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg">Generando contenido del curso...</p>
                <p className="text-sm">
                  El temario se está cargando. Por favor, actualiza la página en
                  unos segundos.
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Actualizar página
              </Button>
            </CardContent>
          </Card>
        ) : (
          themes.map((theme, index) => (
            <Card
              key={theme.id}
              className={`bg-slate-800/50 border-slate-700 transition-all duration-200 ${
                hasAccess
                  ? "hover:border-blue-500/50 cursor-pointer"
                  : "opacity-75"
              }`}
              onClick={() => hasAccess && onThemeSelect(theme)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold">
                        {index + 1}
                      </div>
                      <CardTitle className="text-white">
                        {theme.title}
                      </CardTitle>
                      {theme.testScore && theme.testScore >= 8 && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {!hasAccess && (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <p className="text-slate-400">{theme.description}</p>
                  </div>

                  {hasAccess && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      onClick={() => onThemeSelect(theme)}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Ver tema
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Theory Points */}
                  <div>
                    <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Teoría ({theme.content.theory.length})
                    </h4>
                    {hasAccess ? (
                      <ul className="space-y-1">
                        {theme.content.theory.slice(0, 3).map((item, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-slate-400 flex items-start gap-2"
                          >
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                        {theme.content.theory.length > 3 && (
                          <li className="text-xs text-slate-500">
                            +{theme.content.theory.length - 3} temas más...
                          </li>
                        )}
                      </ul>
                    ) : (
                      <div className="space-y-1">
                        {[1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className="h-4 bg-slate-700 rounded animate-pulse"
                          />
                        ))}
                        <p className="text-xs text-slate-500 mt-2">
                          Contenido disponible con acceso
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Practical Examples */}
                  <div>
                    <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      Práctica ({theme.content.practicalExamples.length})
                    </h4>
                    {hasAccess ? (
                      <ul className="space-y-1">
                        {theme.content.practicalExamples
                          .slice(0, 3)
                          .map((item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-slate-400 flex items-start gap-2"
                            >
                              <span className="text-green-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        {theme.content.practicalExamples.length > 3 && (
                          <li className="text-xs text-slate-500">
                            +{theme.content.practicalExamples.length - 3}{" "}
                            ejemplos más...
                          </li>
                        )}
                      </ul>
                    ) : (
                      <div className="space-y-1">
                        {[1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className="h-4 bg-slate-700 rounded animate-pulse"
                          />
                        ))}
                        <p className="text-xs text-slate-500 mt-2">
                          Ejemplos disponibles con acceso
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Key Points */}
                  <div>
                    <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      Puntos Clave ({theme.content.keyPoints.length})
                    </h4>
                    {hasAccess ? (
                      <ul className="space-y-1">
                        {theme.content.keyPoints
                          .slice(0, 3)
                          .map((item, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-slate-400 flex items-start gap-2"
                            >
                              <span className="text-yellow-400 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        {theme.content.keyPoints.length > 3 && (
                          <li className="text-xs text-slate-500">
                            +{theme.content.keyPoints.length - 3} puntos más...
                          </li>
                        )}
                      </ul>
                    ) : (
                      <div className="space-y-1">
                        {[1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className="h-4 bg-slate-700 rounded animate-pulse"
                          />
                        ))}
                        <p className="text-xs text-slate-500 mt-2">
                          Puntos clave disponibles con acceso
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Theme Stats */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {theme.estimatedHours || 4}h estimadas
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        20+ preguntas test
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        15+ flashcards
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {theme.testScore && (
                        <Badge
                          className={
                            theme.testScore >= 8
                              ? "bg-green-500/20 text-green-400"
                              : theme.testScore >= 6
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }
                        >
                          Test: {theme.testScore}/10
                        </Badge>
                      )}

                      {theme.flashcardsCompleted &&
                        theme.flashcardsCompleted > 0 && (
                          <Badge className="bg-purple-500/20 text-purple-400">
                            Flashcards: {theme.flashcardsCompleted}
                          </Badge>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Course Summary */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Certificación del Curso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-3">
                Requisitos para el Certificado
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Completar todos los temas del curso</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Aprobar todos los tests con nota ≥ 8/10</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Completar el examen final con nota ≥ 8/10</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Participación activa en el curso</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">
                Beneficios del Certificado
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Certificado oficial personalizado</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Descarga en formato PDF</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Validación profesional</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Video className="w-4 h-4 text-green-400" />
                  <span>Acceso permanente al contenido</span>
                </li>
              </ul>
            </div>
          </div>

          {!hasAccess && (
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
              <p className="text-slate-400 text-center">
                <Lock className="w-4 h-4 inline mr-2" />
                Obtén acceso al curso para comenzar tu camino hacia la
                certificación
              </p>
            </div>
          )}

          {hasAccess && progressPercentage === 100 && (
            <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <p className="text-green-400 text-center font-semibold">
                <Award className="w-4 h-4 inline mr-2" />
                ¡Felicidades! Has completado todos los temas. ¡El examen final
                te espera!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
