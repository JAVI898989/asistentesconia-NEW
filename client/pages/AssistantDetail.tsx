import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Check, Crown, MessageCircle, BookOpen, FileText, Gamepad2, Trophy, Heart } from "lucide-react";
import Header from "@/components/Header";
import TestsPanel from "@/components/curso/TestsPanel";
import FlashcardsSimple from "@/components/curso/FlashcardsSimple";
import GamesPanel from "@/components/curso/GamesPanel";
import ProgresoMotivacion from "@/components/curso/ProgresoMotivacion";
import MotivationPanel from "@/components/curso/MotivationPanel";
import Chat from "@/components/Chat";
import BlurredPreview from "@/components/BlurredPreview";
import TemarioEnhanced from "@/components/curso/TemarioEnhanced";
import AdminBar from "@/components/AdminBar";
import AdminInit from "@/components/AdminInit";
import ReferralCodeInput from "@/components/ReferralCodeInput";
import TemarioCompletoGC from "@/components/curso/TemarioCompletoGC";
import TestPorTemaGC from "@/components/curso/TestPorTemaGC";
import FlashcardsGC from "@/components/curso/FlashcardsGC";
import { useAdminStatus } from "@/hooks/useIsAdmin";
import { useAssistantAvatar } from "@/hooks/useAssistantAvatar";
import type { AssistantSyllabusTopic } from "@/hooks/useAssistantSyllabus";
import type { ReferralValidationResult } from "@/types/referral";

interface AssistantData {
  id: string;
  name: string;
  description: string;
  founderPrice: {
    monthly: number;
    annual: number;
  };
  normalPrice: {
    monthly: number;
    annual: number;
  };
  fundador_activo: boolean;
}

const getAssistantById = (id: string): AssistantData | null => {
  const assistants = [
    // ADMINISTRACIÓN
    {
      id: "auxiliar-administrativo-estado",
      name: "Auxiliar Administrativo del Estado",
      description: "Preparación completa para oposiciones de auxiliar administrativo del estado",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },
    {
      id: "administrativo-estado",
      name: "Administrativo del Estado",
      description: "Preparación para el cuerpo de Administrativos de la AGE",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "gestion-administracion-civil",
      name: "Gestión de la Administración Civil",
      description: "Preparación para Técnico Administrativo superior de la AGE",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "tecnicos-hacienda",
      name: "Técnicos de Hacienda",
      description: "Preparación completa para Técnicos de Hacienda",
      founderPrice: { monthly: 20, annual: 200 },
      normalPrice: { monthly: 60, annual: 600 },
      fundador_activo: true,
    },
    {
      id: "administradores-civiles-estado",
      name: "Cuerpo Superior de Administradores Civiles del Estado",
      description: "Preparación para el cuerpo superior más prestigioso de la administración",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "agentes-hacienda-publica",
      name: "Agentes de la Hacienda Pública",
      description: "Preparación para Agentes de la Hacienda Pública",
      founderPrice: { monthly: 20, annual: 200 },
      normalPrice: { monthly: 60, annual: 600 },
      fundador_activo: true,
    },
    {
      id: "tecnicos-auditoria-contabilidad",
      name: "Técnicos de Auditoría y Contabilidad",
      description: "Preparación para Técnicos de Auditoría y Contabilidad",
      founderPrice: { monthly: 20, annual: 200 },
      normalPrice: { monthly: 60, annual: 600 },
      fundador_activo: true,
    },

    // JUSTICIA
    {
      id: "auxilio-judicial",
      name: "Auxilio Judicial",
      description: "Preparación completa para el cuerpo de Auxilio Judicial",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },
    {
      id: "tramitacion-procesal",
      name: "Tramitación Procesal",
      description: "Preparación para el cuerpo de Tramitación Procesal",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "gestion-procesal",
      name: "Gestión Procesal",
      description: "Preparación para el cuerpo de Gestión Procesal",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "judicatura",
      name: "Judicatura",
      description: "Preparación para acceso a la carrera judicial",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "fiscalia",
      name: "Fiscalía",
      description: "Preparación para acceso a la carrera fiscal",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "abogacia-estado",
      name: "Abogacía del Estado",
      description: "Preparación para el cuerpo de Abogados del Estado",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "notarias",
      name: "Notarías",
      description: "Preparación para acceso al cuerpo de Notarios",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "registro-propiedad",
      name: "Registro de la Propiedad",
      description: "Preparación para Registradores de la Propiedad",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "secretarios-judiciales",
      name: "Cuerpo de Secretarios Judiciales",
      description: "Preparación para Secretarios Judiciales",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    },
    {
      id: "medicina-legal",
      name: "Instituto de Medicina Legal",
      description: "Preparación para el Instituto de Medicina Legal",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    },

    // SANIDAD
    {
      id: "auxiliar-enfermeria",
      name: "Auxiliar de Enfermería",
      description: "Preparación para Auxiliar de Enfermería",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },
    {
      id: "enfermeria-eir",
      name: "Enfermería (EIR)",
      description: "Preparación para Enfermería especializada",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "celador",
      name: "Celador",
      description: "Preparación para oposiciones de celador hospitalario",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },
    {
      id: "mir",
      name: "Médico Interno Residente (MIR)",
      description: "Preparación especializada para el examen MIR",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    },
    {
      id: "tecnico-laboratorio",
      name: "T��cnico de Laboratorio",
      description: "Preparación para Técnico de Laboratorio",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "tecnico-farmacia",
      name: "Técnico de Farmacia",
      description: "Preparación para Técnico de Farmacia",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "tecnico-rayos",
      name: "Técnico de Rayos X",
      description: "Preparación para Técnico de Rayos X",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "pir",
      name: "Psicólogo Interno Residente (PIR)",
      description: "Preparación para el examen PIR",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    },
    {
      id: "fisioterapia",
      name: "Fisioterapia",
      description: "Preparación para oposiciones de Fisioterapia",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "matrona",
      name: "Matrona",
      description: "Preparación para oposiciones de Matrona",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },

    // SEGURIDAD
    {
      id: "guardia-civil",
      name: "Guardia Civil",
      description: "Asistente especializado en oposiciones de Guardia Civil",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "policia-nacional",
      name: "Policía Nacional",
      description: "Preparación integral para las oposiciones de Policía Nacional",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "policia-local",
      name: "Policía Local",
      description: "Asistente especializado en oposiciones de Policía Local",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },
    {
      id: "bomberos",
      name: "Bomberos",
      description: "Preparación completa para oposiciones de bombero",
      founderPrice: { monthly: 20, annual: 200 },
      normalPrice: { monthly: 60, annual: 600 },
      fundador_activo: true,
    },
    {
      id: "mossos-esquadra",
      name: "Mossos d'Esquadra",
      description: "Preparación para Mossos d'Esquadra",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "ertzaintza",
      name: "Ertzaintza",
      description: "Preparación para Ertzaintza",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },

    // CORREOS Y TELECOMUNICACIONES
    {
      id: "correos",
      name: "Correos y Telégrafos",
      description: "Preparación completa para oposiciones de correos",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },

    // EDUCACIÓN
    {
      id: "estudiante-primaria",
      name: "Estudiante de Primaria",
      description: "Asistente educativo para estudiantes de primaria",
      founderPrice: { monthly: 12, annual: 120 },
      normalPrice: { monthly: 36, annual: 360 },
      fundador_activo: true,
    },
    {
      id: "estudiante-eso",
      name: "Estudiante de ESO",
      description: "Asistente educativo para estudiantes de ESO",
      founderPrice: { monthly: 14, annual: 140 },
      normalPrice: { monthly: 42, annual: 420 },
      fundador_activo: true,
    },
    {
      id: "estudiante-bachillerato",
      name: "Estudiante de Bachillerato",
      description: "Asistente educativo para estudiantes de bachillerato",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },

    // IDIOMAS
    {
      id: "idioma-ingles",
      name: "Idioma Inglés",
      description: "Asistente para aprender inglés",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },
    {
      id: "idioma-frances",
      name: "Idioma Francés",
      description: "Asistente para aprender francés",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },

    // HACIENDA Y ECONOMÍA
    {
      id: "intervencion-general-estado",
      name: "Intervención General del Estado",
      description: "Preparación para Interventores y Auditores del Estado",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "inspeccion-hacienda",
      name: "Inspección de Hacienda",
      description: "Preparación para Inspectores de Hacienda del Estado",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "cnmv-tecnicos",
      name: "CNMV – Técnicos",
      description: "Preparación para Técnicos de la CNMV",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    },
    {
      id: "banco-espana-tecnicos",
      name: "Banco de España – Técnicos",
      description: "Preparación para Técnicos del Banco de España",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    },
    {
      id: "tecnicos-seguridad-social",
      name: "Técnicos de Seguridad Social",
      description: "Preparación para Técnicos de la Seguridad Social",
      founderPrice: { monthly: 20, annual: 200 },
      normalPrice: { monthly: 60, annual: 600 },
      fundador_activo: true,
    },
    {
      id: "inspectores-hacienda-superior",
      name: "Cuerpo Superior de Inspectores de Hacienda",
      description: "Preparación para el Cuerpo Superior de Inspectores de Hacienda",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },

    // CIENCIA E INGENIERÍA
    {
      id: "ingenieros-estado",
      name: "Ingenieros del Estado",
      description: "Preparación para Ingenieros del Estado",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "arquitectos-estado",
      name: "Arquitectos del Estado",
      description: "Preparación para Arquitectos del Estado",
      founderPrice: { monthly: 25, annual: 250 },
      normalPrice: { monthly: 75, annual: 750 },
      fundador_activo: true,
    },
    {
      id: "meteorologia",
      name: "Meteorología",
      description: "Preparación para Meteorólogos del Estado",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    },
    {
      id: "instituto-geografico",
      name: "Instituto Geográfico",
      description: "Preparación para el Instituto Geogr��fico Nacional",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    },

    // CORREOS Y TELECOMUNICACIONES
    {
      id: "tecnico-comunicaciones",
      name: "Técnico en Comunicaciones",
      description: "Preparación para Técnico en Comunicaciones",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "atencion-cliente-postal",
      name: "Atención al Cliente Postal",
      description: "Preparación para Atención al Cliente en Correos",
      founderPrice: { monthly: 16, annual: 160 },
      normalPrice: { monthly: 48, annual: 480 },
      fundador_activo: true,
    },

    // TRANSPORTE
    {
      id: "renfe",
      name: "RENFE",
      description: "Preparación para oposiciones de RENFE",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "transporte-metropolitano",
      name: "Transporte Metropolitano",
      description: "Preparación para Transporte Metropolitano",
      founderPrice: { monthly: 18, annual: 180 },
      normalPrice: { monthly: 54, annual: 540 },
      fundador_activo: true,
    },
    {
      id: "trafico-aereo",
      name: "Tráfico Aéreo",
      description: "Preparación para Controlador de Tráfico Aéreo",
      founderPrice: { monthly: 22, annual: 220 },
      normalPrice: { monthly: 66, annual: 660 },
      fundador_activo: true,
    }
  ];

  return assistants.find(a => a.id === id) || null;
};

export default function AssistantDetailFixed() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [assistant, setAssistant] = useState<AssistantData | null>(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual" | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [syllabusTopics, setSyllabusTopics] = useState<AssistantSyllabusTopic[]>([]);
  const [isPaid, setIsPaid] = useState(false);

  // Use centralized admin detection
  const isAdmin = useAdminStatus();

  // Real-time avatar updates
  const { avatar, imageUrl, thumbUrl } = useAssistantAvatar(id || "");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser && id) {
        // For now, set isPaid to true for admin or if user has subscription
        // This would normally check against Firestore subscriptions
        setIsPaid(false); // Will be overridden by admin status
      } else {
        setIsPaid(false);
      }

      setLoading(false);
    });

    if (id) {
      const assistantData = getAssistantById(id);
      setAssistant(assistantData);
    }

    return () => unsubscribe();
  }, [id]);

  const handleSubscribe = (plan: "monthly" | "annual") => {
    if (!user) {
      toast.error("Por favor, inicia sesión para suscribirte al asistente.");
      return;
    }

    if (!assistant) {
      toast.error("Error: No se han cargado los datos del asistente.");
      return;
    }

    setSelectedPlan(plan);
    setShowReferralModal(true);
  };

  const proceedToPayment = async (referralCode?: string) => {
    if (!user || !assistant || !selectedPlan) return;

    try {
      const currentPricing = assistant.founderPrice;
      const price = selectedPlan === "monthly" ? currentPricing.monthly : currentPricing.annual;

      console.log("💳 Creating Stripe checkout session:", {
        price,
        plan: selectedPlan,
        referralCode: referralCode || 'none'
      });

      const sessionData = {
        assistantId: id || "",
        assistantName: assistant.name,
        price: price,
        billingCycle: selectedPlan,
        userId: user.uid || "",
        userEmail: user.email || user.providerData?.[0]?.email || "",
        referralCode: referralCode || undefined,
      };

      // Call our API to create Stripe session
      const res = await fetch('/api/assistant/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Checkout failed:", res.status, errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("No checkout URL received");
      }

      console.log("✅ Opening Stripe checkout:", data.url);

      // Open in new window to avoid breaking the current page
      window.open(data.url, '_blank', 'noopener,noreferrer,width=800,height=600,scrollbars=yes,resizable=yes');

      // Show success message
      const message = referralCode
        ? `Pago de €${price} con código ${referralCode}`
        : `Abriendo pago de €${price} para ${assistant.name}`;
      toast.success(message);

    } catch (error) {
      console.error("❌ Payment error:", error);
      toast.error("Error al crear la sesión de pago. Por favor, inténtalo de nuevo.");
    } finally {
      setShowReferralModal(false);
      setSelectedPlan(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-4"></div>
            <div className="h-96 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Asistente no encontrado</h1>
            <p className="text-slate-400">El asistente solicitado no existe.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AdminInit />
      <AdminBar
        assistantId={assistant?.id}
        assistantName={assistant?.name}
        paywallBypassed={isAdmin}
      />
      <Header />

      <div className={`container mx-auto px-4 py-8 ${isAdmin ? 'pt-16' : ''}`}>
        {/* Header del Asistente */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {thumbUrl || imageUrl ? (
              <div className="relative">
                <img
                  src={thumbUrl || imageUrl}
                  alt={avatar?.alt || assistant.name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-white/10"
                />
                {avatar && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    v{avatar.version}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{assistant.name}</h1>
              <p className="text-slate-400">{assistant.description}</p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Plan Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-yellow-400 mb-1">
                    {formatCurrency(assistant.founderPrice.monthly)}
                  </div>
                  <div className="text-xs text-yellow-400 mb-2">🚀 Precio de Fundador</div>
                  <div className="text-2xl text-slate-400 line-through">
                    {formatCurrency(assistant.normalPrice.monthly)}
                  </div>
                  <div className="text-slate-400 mt-2">por mes</div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Chat IA especializado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Temario completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Tests especializados</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe("monthly")}
                  disabled={loading || !user}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {!user
                    ? "Inicia sesión para suscribirte"
                    : `Suscribirse Mensual - ${formatCurrency(assistant.founderPrice.monthly)}`
                  }
                </Button>
              </CardContent>
            </Card>

            {/* Annual Plan */}
            <Card className="bg-slate-800 border-slate-700 border-2 border-yellow-500">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2" />
              <CardHeader>
                <CardTitle className="text-white">Plan Anual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-yellow-400 mb-1">
                    {formatCurrency(assistant.founderPrice.annual)}
                  </div>
                  <div className="text-xs text-yellow-400 mb-2">🚀 Precio de Fundador</div>
                  <div className="text-2xl text-slate-400 line-through">
                    {formatCurrency(assistant.normalPrice.annual)}
                  </div>
                  <div className="text-green-400 text-sm mt-2">
                    Ahorras {formatCurrency(assistant.founderPrice.monthly * 12 - assistant.founderPrice.annual)} vs mensual
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Chat IA especializado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Temario completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300">Tests especializados</span>
                  </li>
                </ul>
                <Button
                  onClick={() => handleSubscribe("annual")}
                  disabled={loading || !user}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold"
                >
                  {!user
                    ? "Inicia sesión para suscribirte"
                    : `Suscribirse Anual - ${formatCurrency(assistant.founderPrice.annual)}`
                  }
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-slate-800">
            <TabsTrigger value="chat">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="temario">
              <BookOpen className="w-4 h-4 mr-2" />
              Temario
            </TabsTrigger>
            <TabsTrigger value="tests">
              <FileText className="w-4 h-4 mr-2" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="flashcards">
              <Brain className="w-4 h-4 mr-2" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="games">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Juegos
            </TabsTrigger>
            <TabsTrigger value="progress">
              <Trophy className="w-4 h-4 mr-2" />
              Progreso
            </TabsTrigger>
            <TabsTrigger value="motivation">
              <Heart className="w-4 h-4 mr-2" />
              Motivación
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <BlurredPreview
              isLocked={!(isPaid || isAdmin)}
              title={`Chat con ${assistant.name}`}
              description="Chatea con tu asistente especializado las 24 horas"
              onUnlock={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              unlockButtonText="Suscribirse al Asistente"
            >
              <Chat assistantId={id || ""} />
            </BlurredPreview>
          </TabsContent>

          {/* Temario Tab */}
          <TabsContent value="temario">
            {assistant.id === "guardia-civil" ? (
              <TemarioCompletoGC
                assistantId={assistant.id}
                hasAccess={isPaid || isAdmin}
              />
            ) : (
              <TemarioEnhanced
                assistantId={assistant.id}
                hasAccess={isPaid || isAdmin}
                onTopicSelect={(topicId)=> setSelectedTopic(topicId)}
                onTopicsLoaded={(topics)=> setSyllabusTopics(topics)}
                userId={user?.uid}
              />
            )}
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests">
            {assistant.id === "guardia-civil" ? (
              <TestPorTemaGC
                assistantId={assistant.id}
                hasAccess={isPaid || isAdmin}
              />
            ) : (
              <BlurredPreview
                isLocked={!(isPaid || isAdmin)}
                title="Tests"
                description="Practica con tests generados por tema"
                onUnlock={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                unlockButtonText="Suscribirse al Asistente"
              >
                <TestsPanel assistantId={assistant.id} themeId={selectedTopic} />
              </BlurredPreview>
            )}
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards">
            {assistant.id === "guardia-civil" ? (
              <FlashcardsGC
                assistantId={assistant.id}
                hasAccess={isPaid || isAdmin}
              />
            ) : (
              <BlurredPreview
                isLocked={!(isPaid || isAdmin)}
                title="Flashcards"
                description="Repasa conceptos clave por tema"
                onUnlock={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                unlockButtonText="Suscribirse al Asistente"
              >
                <FlashcardsSimple assistantId={assistant.id} themeId={selectedTopic} />
              </BlurredPreview>
            )}
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games">
            {assistant.id === "guardia-civil" ? (
              <BlurredPreview
                isLocked={!(isPaid || isAdmin)}
                title="Juegos"
                description="Actividades no disponibles en este asistente"
                onUnlock={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                unlockButtonText="Suscribirse al Asistente"
              >
                <div className="text-sm text-slate-300">
                  Este asistente utiliza un sistema propio de juegos.
                </div>
              </BlurredPreview>
            ) : (
              <BlurredPreview
                isLocked={!(isPaid || isAdmin)}
                title="Juegos"
                description="Practica con juegos interactivos"
                onUnlock={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                unlockButtonText="Suscribirse al Asistente"
              >
                <GamesPanel assistantId={assistant.id} themeId={selectedTopic} />
              </BlurredPreview>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <BlurredPreview
              isLocked={!(isPaid || isAdmin)}
              title="Progreso del estudiante"
              description="Seguimiento personalizado de tu avance"
              onUnlock={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              unlockButtonText="Suscribirse al Asistente"
            >
              <ProgresoMotivacion
                assistantId={assistant.id}
                userId={user?.uid}
                selectedTopicId={selectedTopic}
                topics={assistant.id === "guardia-civil" ? [] : syllabusTopics}
              />
            </BlurredPreview>
          </TabsContent>

          {/* Motivation Tab */}
          <TabsContent value="motivation">
            <BlurredPreview
              isLocked={!(isPaid || isAdmin)}
              title="Motivación diaria"
              description="Mensajes motivadores y logros desbloqueados"
              onUnlock={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              unlockButtonText="Suscribirse al Asistente"
            >
              <MotivationPanel assistantId={assistant.id} userId={user?.uid} />
            </BlurredPreview>
          </TabsContent>
        </Tabs>
      </div>

      {/* Referral Code Modal */}
      <Dialog open={showReferralModal} onOpenChange={setShowReferralModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Código de Referidos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPlan && assistant && (
              <ReferralCodeInput
                onValidReferral={(validation) => {
                  proceedToPayment(validation.code);
                }}
                onContinue={() => {
                  proceedToPayment();
                }}
                userId={user?.uid || ""}
                userEmail={user?.email || ""}
                assistantName={assistant.name}
                price={selectedPlan === "monthly" ? assistant.founderPrice.monthly : assistant.founderPrice.annual}
                isOptional={true}
                showSummary={true}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
