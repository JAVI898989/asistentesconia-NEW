import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import PublicCurriculumViewer from "@/components/PublicCurriculumViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface AssistantData {
  name: string;
  description: string;
}

const assistantData: Record<string, AssistantData> = {
  // Asistentes
  "auxiliar-administrativo-estado": {
    name: "Auxiliar Administrativo del Estado",
    description:
      "Preparación completa para oposiciones de auxiliar administrativo del estado",
  },
  "guardia-civil": {
    name: "Guardia Civil",
    description: "Asistente especializado en oposiciones de Guardia Civil",
  },
  "policia-nacional": {
    name: "Policía Nacional",
    description: "Preparación completa para oposiciones de Policía Nacional",
  },
  mir: {
    name: "Médico Interno Residente (MIR)",
    description: "Preparación especializada para el examen MIR",
  },
  "auxiliar-enfermeria": {
    name: "Auxiliar de Enfermería",
    description: "Preparación para auxiliar de enfermería hospitalaria",
  },
  celador: {
    name: "Celador",
    description: "Preparación para celador hospitalario",
  },
  bombero: {
    name: "Bombero",
    description: "Preparación para cuerpo de bomberos",
  },
  "tecnico-hacienda": {
    name: "Técnico de Hacienda",
    description: "Preparación para técnico de hacienda pública",
  },
  correos: {
    name: "Correos y Telégrafos",
    description: "Preparación para correos y telégrafos",
  },
  "maestro-primaria": {
    name: "Maestro de Educación Primaria",
    description: "Preparación para maestro de educación primaria",
  },

  // Cursos
  "programador-desde-cero": {
    name: "Programador desde Cero",
    description: "Aprende programación desde cero hasta nivel profesional",
  },
  "auxiliar-veterinaria": {
    name: "Auxiliar de Veterinaria",
    description: "Formación completa para auxiliar de veterinaria",
  },
  "peluqueria-profesional": {
    name: "Peluquería Profesional",
    description: "Curso profesional de peluquería y estilismo",
  },
  electricista: {
    name: "Electricista Profesional",
    description: "Formación completa en instalaciones eléctricas",
  },
  fontaneria: {
    name: "Fontanería Profesional",
    description: "Curso profesional de fontanería y plomería",
  },
  "diseno-grafico": {
    name: "Diseño Gráfico Digital",
    description: "Domina el diseño gráfico con herramientas profesionales",
  },
  "marketing-digital": {
    name: "Marketing Digital Avanzado",
    description: "Estrategias avanzadas de marketing digital y redes sociales",
  },
  "ingles-negocios": {
    name: "Inglés para Negocios",
    description: "Inglés especializado para entornos profesionales",
  },
};

export default function CurriculumPage() {
  const { id } = useParams<{ id: string }>();
  const [assistant, setAssistant] = useState<AssistantData | null>(null);

  useEffect(() => {
    if (id && assistantData[id]) {
      setAssistant(assistantData[id]);
    }
  }, [id]);

  if (!id || !assistant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">
                Asistente no encontrado
              </h1>
              <p className="text-slate-400 mb-6">
                El asistente solicitado no existe o no está disponible.
              </p>
              <Link to="/assistants">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Asistentes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/assistant/${id}`}>
            <Button
              variant="outline"
              className="mb-4 bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Asistente
            </Button>
          </Link>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">
                📚 Temario Oficial - {assistant.name}
              </CardTitle>
              <p className="text-slate-400">{assistant.description}</p>
            </CardHeader>
          </Card>
        </div>

        {/* Curriculum Viewer */}
        <PublicCurriculumViewer
          assistantId={id}
          assistantName={assistant.name}
        />
      </div>
    </div>
  );
}
