import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  createAcademia,
  generateAcademiaSlug,
  Academia,
} from "@/lib/firebaseData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowRight, School, Users, Crown } from "lucide-react";
import Header from "@/components/Header";

const getContractedAssistants = (
  assistantIdFromUrl?: string | null,
): string[] => {
  // Si hay un asistente específico en la URL, usar solo ese
  if (assistantIdFromUrl) {
    return [assistantIdFromUrl];
  }

  // Fallback: devolver un asistente por defecto si no se especifica
  return ["guardia-civil"];
};

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [academiaCreated, setAcademiaCreated] = useState<Academia | null>(null);

  const sessionId = searchParams.get("session_id");
  const assistantId = searchParams.get("assistant_id");
  const academiaId = searchParams.get("academia_id");
  const contractedAssistantId = searchParams.get("contracted_assistant"); // Nuevo: asistente específico contratado

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle academia creation
  useEffect(() => {
    if (user && academiaId && sessionId && !academiaCreated) {
      handleAcademiaCreation();
    }
  }, [user, academiaId, sessionId, academiaCreated]);

  const handleAcademiaCreation = async () => {
    try {
      // Read contract details from URL parameters
      const students = parseInt(searchParams.get("students") || "100");
      const duration = parseInt(searchParams.get("duration") || "2") as
        | 2
        | 5
        | 10;
      const isFounder = searchParams.get("is_founder") === "true";

      // Parse academia type from academiaId
      let academiaType = "oposiciones";
      let academiaName = "Academia de Oposiciones";

      if (academiaId?.includes("idiomas")) {
        academiaType = "idiomas";
        academiaName = "Academia de Idiomas";
      } else if (
        academiaId?.includes("eso") ||
        academiaId?.includes("escolar")
      ) {
        academiaType = "escolar";
        academiaName = "Academia ESO/Bachillerato";
      } else if (academiaId?.includes("universitaria")) {
        academiaType = "universitaria";
        academiaName = "Academia Universitaria";
      }

      // Calculate price per student based on founder pricing
      const founderPricing = {
        "2": { hasta100: 12, "100": 11, "200": 10, "500": 9, "1000": 8 },
        "5": { hasta100: 10, "100": 9, "200": 8, "500": 7, "1000": 6 },
        "10": { hasta100: 8, "100": 7, "200": 6, "500": 5, "1000": 4 },
      };

      let pricePerStudent =
        founderPricing[duration.toString() as keyof typeof founderPricing][
          "hasta100"
        ];

      if (students > 1000) {
        pricePerStudent =
          founderPricing[duration.toString() as keyof typeof founderPricing][
            "1000"
          ];
      } else if (students > 500) {
        pricePerStudent =
          founderPricing[duration.toString() as keyof typeof founderPricing][
            "500"
          ];
      } else if (students > 200) {
        pricePerStudent =
          founderPricing[duration.toString() as keyof typeof founderPricing][
            "200"
          ];
      } else if (students > 100) {
        pricePerStudent =
          founderPricing[duration.toString() as keyof typeof founderPricing][
            "100"
          ];
      }

      // Apply non-founder multiplier if needed
      if (!isFounder) {
        pricePerStudent *= 3;
      }

      // Generate slug
      const slug = generateAcademiaSlug(academiaName);

      // Create academia data
      const academiaData: Omit<Academia, "id" | "createdAt" | "updatedAt"> = {
        slug,
        name: academiaName,
        type: academiaType,
        adminUserId: user!.uid,
        adminEmail: user!.email || "",
        organization: `${academiaName} - ${user!.email}`,
        contractDetails: {
          students,
          duration,
          pricePerStudent,
          totalPrice: pricePerStudent * students,
          billingCycle: "monthly", // Default - could be from URL params
          isFounder,
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + duration * 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        status: "active",
        currentStudents: 0,
        teachers: [],
        assistants: getContractedAssistants(contractedAssistantId),
        stripeSessionId: sessionId,
      };

      const newAcademiaId = await createAcademia(academiaData);
      const newAcademia = {
        ...academiaData,
        id: newAcademiaId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAcademiaCreated(newAcademia);

      // Redirect to academia panel after 3 seconds
      setTimeout(() => {
        navigate(`/academia/${slug}`);
      }, 3000);
    } catch (error) {
      console.error("Error creating academia:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Procesando pago...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <Card className="text-center bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-400">
                ¡Pago Exitoso!
              </CardTitle>
              <CardDescription className="text-slate-300">
                {academiaId
                  ? "Tu academia se ha activado correctamente"
                  : "Tu suscripción se ha activado correctamente"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {academiaCreated ? (
                // Academia Success
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <School className="w-6 h-6 text-green-400" />
                      <h3 className="text-white font-semibold">
                        {academiaCreated.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Alumnos contratados:</p>
                        <p className="text-white font-medium">
                          <Users className="w-4 h-4 inline mr-1" />
                          {academiaCreated.contractDetails.students}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Duración:</p>
                        <p className="text-white font-medium">
                          {academiaCreated.contractDetails.duration} a��os
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Precio por alumno:</p>
                        <p className="text-white font-medium">
                          {academiaCreated.contractDetails.pricePerStudent}€/mes
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Estado:</p>
                        <p className="text-green-400 font-medium flex items-center">
                          {academiaCreated.contractDetails.isFounder && (
                            <Crown className="w-4 h-4 mr-1" />
                          )}
                          {academiaCreated.contractDetails.isFounder
                            ? "Fundador"
                            : "Normal"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-300 font-medium mb-2">
                      ¿Qué sigue?
                    </h4>
                    <ul className="text-slate-300 text-sm space-y-1 text-left">
                      <li>• Configura tu academia y añade profesores</li>
                      <li>
                        • Registra a tus alumnos (hasta{" "}
                        {academiaCreated.contractDetails.students})
                      </li>
                      <li>• Asigna asistentes especializados</li>
                      <li>• Comienza a usar las herramientas educativas</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-yellow-300 text-sm">
                      🔄 Redirigiendo automáticamente al panel de tu academia en
                      unos segundos...
                    </p>
                  </div>
                </div>
              ) : academiaId ? (
                // Academia Loading
                <div className="space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-400 border-t-transparent mx-auto"></div>
                  <p className="text-slate-300">Configurando tu academia...</p>
                </div>
              ) : (
                // Assistant Success
                <div className="space-y-4">
                  <p className="text-slate-300">
                    Ahora tienes acceso completo a tu asistente especializado
                    con IA.
                  </p>

                  {sessionId && (
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <p className="text-xs text-slate-400">
                        ID de sesión: {sessionId.slice(0, 20)}...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!academiaCreated && (
                <div className="space-y-3 pt-4">
                  {academiaId ? (
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                      onClick={() =>
                        navigate(
                          `/academia/${academiaCreated?.slug || "loading"}`,
                        )
                      }
                      disabled={!academiaCreated}
                    >
                      <School className="mr-2 h-4 w-4" />
                      Ir al Panel de tu Academia
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Link
                      to={
                        assistantId
                          ? `/asistente/${assistantId}`
                          : "/asistentes"
                      }
                    >
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                        Comenzar a Usar tu Asistente
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}

                  <Link to={academiaId ? "/academias" : "/asistentes"}>
                    <Button
                      variant="outline"
                      className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      {academiaId
                        ? "Ver Todas las Academias"
                        : "Ver Todos los Asistentes"}
                    </Button>
                  </Link>

                  <Link to="/">
                    <Button
                      variant="outline"
                      className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      Volver al Inicio
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
