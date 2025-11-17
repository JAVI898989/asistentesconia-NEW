import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Plus,
  Brain,
  FileText,
  Upload,
  Heart,
  Scale,
  GraduationCap,
  Palette,
  Stethoscope,
  Dumbbell,
  Briefcase,
  Users,
  Calculator,
  Music,
  Home,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const proAssistants = [
  {
    id: "nutricionista-pro",
    name: "Nutricionista PRO",
    category: "Sanidad",
    icon: Heart,
    color: "from-green-500 to-emerald-600",
    description: "Asistente especializado para profesionales de la nutrición",
  },
  {
    id: "psicologo-coach-pro",
    name: "Psicólogo / Coach PRO",
    category: "Sanidad",
    icon: Brain,
    color: "from-purple-500 to-violet-600",
    description: "Para profesionales de la psicología y coaching",
  },
  {
    id: "abogado-pro",
    name: "Abogado PRO",
    category: "Legal",
    icon: Scale,
    color: "from-blue-500 to-indigo-600",
    description: "Especializado en servicios legales y jurídicos",
  },
  {
    id: "entrenador-personal-pro",
    name: "Entrenador Personal PRO",
    category: "Deporte",
    icon: Dumbbell,
    color: "from-orange-500 to-red-600",
    description: "Para profesionales del fitness y entrenamiento",
  },
  {
    id: "esteticista-pro",
    name: "Esteticista / Centro de Belleza PRO",
    category: "Belleza",
    icon: Palette,
    color: "from-pink-500 to-rose-600",
    description: "Especializado en estética y tratamientos de belleza",
  },
  {
    id: "veterinario-pro",
    name: "Veterinario PRO",
    category: "Sanidad",
    icon: Heart,
    color: "from-teal-500 to-cyan-600",
    description: "Para clínicas veterinarias y profesionales animales",
  },
  {
    id: "fisioterapeuta-pro",
    name: "Fisioterapeuta PRO",
    category: "Sanidad",
    icon: Stethoscope,
    color: "from-emerald-500 to-green-600",
    description: "Especializado en fisioterapia y rehabilitación",
  },
  {
    id: "preparador-selectividad-pro",
    name: "Preparador de Selectividad PRO",
    category: "Educación",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-600",
    description: "Para academias y preparadores de EBAU/Selectividad",
  },
  {
    id: "clinicas-medicas-pro",
    name: "Clínicas médicas privadas PRO",
    category: "Sanidad",
    icon: Stethoscope,
    color: "from-red-500 to-pink-600",
    description: "Para centros médicos y clínicas privadas",
  },
  {
    id: "arquitecto-interiorista-pro",
    name: "Arquitecto / Interiorista PRO",
    category: "Creatividad",
    icon: Home,
    color: "from-yellow-500 to-orange-600",
    description: "Especializado en arquitectura y diseño de interiores",
  },
  {
    id: "community-manager-pro",
    name: "Community Manager / Agencia de Marketing PRO",
    category: "Marketing",
    icon: Users,
    color: "from-violet-500 to-purple-600",
    description: "Para agencias de marketing y community managers",
  },
  {
    id: "profesor-idiomas-pro",
    name: "Profesor de idiomas PRO",
    category: "Educación",
    icon: GraduationCap,
    color: "from-cyan-500 to-blue-600",
    description: "Especializado en enseñanza de idiomas",
  },
  {
    id: "podologo-pro",
    name: "Podólogo PRO",
    category: "Sanidad",
    icon: Stethoscope,
    color: "from-lime-500 to-green-600",
    description: "Para profesionales de podología",
  },
  {
    id: "asesor-fiscal-pro",
    name: "Asesor Fiscal / Gestoría PRO",
    category: "Fiscal",
    icon: Calculator,
    color: "from-slate-500 to-gray-600",
    description: "Especializado en asesoría fiscal y gestoría",
  },
  {
    id: "musicoterapeuta-pro",
    name: "Musicoterapeuta PRO",
    category: "Sanidad",
    icon: Music,
    color: "from-fuchsia-500 to-pink-600",
    description: "Para profesionales de musicoterapia",
  },
];

export default function AsistentesPro() {
  const [selectedAssistant, setSelectedAssistant] = useState<
    (typeof proAssistants)[0] | null
  >(null);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-400" />
              Asistentes PRO
            </h1>
            <p className="text-slate-400 mt-1">
              Asistentes especializados para profesionales - Próximamente en
              Fase 2
            </p>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Asistente PRO
          </Button>
        </div>

        {/* Description Section */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                🧠 ¿Qué es un Asistente PRO?
              </h2>
              <p className="text-slate-300 mb-4">
                Un Asistente PRO está diseñado para profesionales, autónomos,
                centros médicos, estudios, agencias o cualquier negocio que
                necesite asistencia especializada con IA.
              </p>
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Incluyen funciones exclusivas como:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-4 h-4 text-yellow-400" />
                    <span>Generación de documentos</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calculator className="w-4 h-4 text-yellow-400" />
                    <span>Gestión de facturas</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Upload className="w-4 h-4 text-yellow-400" />
                    <span>Subida de archivos del cliente</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Brain className="w-4 h-4 text-yellow-400" />
                    <span>Interacción inteligente adaptada a su sector</span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 font-medium">
                  Todos los Asistentes PRO estarán disponibles en la{" "}
                  <strong>Fase 2 (Próximamente)</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRO Assistants Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Asistentes PRO Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proAssistants.map((assistant) => {
              const IconComponent = assistant.icon;
              return (
                <div
                  key={assistant.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-yellow-500/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAssistant(assistant)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${assistant.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {assistant.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-slate-600 text-slate-300 text-xs"
                      >
                        {assistant.category}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4">
                    {assistant.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Crown className="w-3 h-3 mr-1" />
                      Próximamente en la Fase 2
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assistant Detail Dialog */}
        <Dialog
          open={!!selectedAssistant}
          onOpenChange={() => setSelectedAssistant(null)}
        >
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-3">
                {selectedAssistant && (
                  <>
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedAssistant.color} flex items-center justify-center`}
                    >
                      <selectedAssistant.icon className="w-5 h-5 text-white" />
                    </div>
                    {selectedAssistant.name}
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                {selectedAssistant?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200 text-center">
                  Este asistente estará disponible en la <strong>Fase 2</strong>
                  .
                </p>
                <p className="text-yellow-200 text-center text-sm mt-2">
                  Contacta con el administrador si deseas reservar tu plaza como
                  fundador.
                </p>
              </div>

              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600"
                onClick={() => setSelectedAssistant(null)}
              >
                Entendido
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
