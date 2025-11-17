import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Crown,
  Users,
  BookOpen,
  CheckCircle,
  Gift,
  Star,
  Target,
  Zap,
  Globe,
  Lock,
  Award,
  TrendingUp,
  RefreshCw,
  Eye,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import RealTimeStatus from "@/components/RealTimeStatus";
import PricingSection from "@/components/PricingSection";

import QuickPanelAccess from "@/components/QuickPanelAccess";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')]'
          }
        ></div>

        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Crown className="w-4 h-4 mr-2" />
            Plataforma de preparación con IA más avanzada
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Prepárate para las
            <br />
            <span className="text-yellow-400">Oposiciones</span>
          </h1>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            35 asistentes de IA especializados para Cuerpos de Seguridad,
            Ejército, Carnets de Conducir, Idiomas UE y más
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/asistentes">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-3 font-semibold"
              >
                <Eye className="mr-2 h-5 w-5" />
                Ver Asistentes IA
              </Button>
            </Link>
            <Link to="/como-funciona">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3 font-semibold"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Cómo Funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Founder Program Section */}
      <section className="py-20 bg-gradient-to-br from-background to-accent/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Programa de Fundadores
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Únete como <span className="text-orange-400">Fundador</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Los primeros usuarios obtienen acceso exclusivo con beneficios
              únicos y precios especiales de por vida
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-card border-border text-center p-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Acceso Anticipado
              </h3>
              <p className="text-sm text-muted-foreground">
                Prueba todas las nuevas funciones antes que nadie
              </p>
            </Card>

            <Card className="bg-card border-border text-center p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Precio Garantizado
              </h3>
              <p className="text-sm text-muted-foreground">
                Mantén tu precio especial para siempre, sin aumentos
              </p>
            </Card>

            <Card className="bg-card border-border text-center p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Herramientas Exclusivas
              </h3>
              <p className="text-sm text-muted-foreground">
                Acceso a funciones premium y herramientas experimentales
              </p>
            </Card>

            <Card className="bg-card border-border text-center p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Comunidad Privada
              </h3>
              <p className="text-sm text-muted-foreground">
                Únete a nuestro grupo exclusivo de fundadores
              </p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border text-center p-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Soporte Prioritario
              </h3>
              <p className="text-sm text-muted-foreground">
                Atención preferencial y respuesta inmediata
              </p>
            </Card>

            <Card className="bg-card border-border text-center p-6">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Visibilidad Especial
              </h3>
              <p className="text-sm text-muted-foreground">
                Reconocimiento como fundador en la plataforma
              </p>
            </Card>

            <Card className="bg-card border-border text-center p-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Fases 2 y 3 Incluidas
              </h3>
              <p className="text-sm text-muted-foreground">
                Acceso automático a todas las expansiones futuras
              </p>
            </Card>

            <Card className="bg-card border-border text-center p-6">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Gift className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Referidos Exclusivos
              </h3>
              <p className="text-sm text-muted-foreground">
                Sistema de ofertas con mejores recompensas para fundadores
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Rewards System Section */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Sistema de Referidos
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Gana <span className="text-green-400">Recompensas</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Refiere academias y obtén descuentos exclusivos en tu próxima
              cuota
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Recompensas para Fundadores */}
            <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-orange-500/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-orange-400" />
                  <div>
                    <CardTitle className="text-orange-400">
                      Recompensas para Fundadores
                    </CardTitle>
                    <CardDescription className="text-orange-300/80">
                      Beneficios exclusivos para miembros fundadores
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="font-medium text-orange-200">
                      TIPO REFERENTE
                    </div>
                    <div className="font-medium text-orange-200">REFERIDO</div>
                    <div className="font-medium text-orange-200">CANTIDAD</div>
                    <div className="font-medium text-orange-200">
                      RECOMPENSA
                    </div>
                  </div>
                  {[
                    {
                      tipo: "Asistente",
                      referido: "Alumnos",
                      cantidad: "2",
                      recompensa: "1 mes gratis",
                    },
                    {
                      tipo: "Asistente",
                      referido: "1 Pro",
                      cantidad: "1",
                      recompensa: "2 meses gratis",
                    },
                    {
                      tipo: "Asistente",
                      referido: "Academia",
                      cantidad: "1",
                      recompensa: "1 año gratis",
                    },
                    {
                      tipo: "Pro",
                      referido: "Asistentes",
                      cantidad: "2",
                      recompensa: "50% descuento",
                    },
                    {
                      tipo: "Pro",
                      referido: "2 Pros",
                      cantidad: "2",
                      recompensa: "1 mes gratis PRO",
                    },
                    {
                      tipo: "Pro",
                      referido: "Academia",
                      cantidad: "1",
                      recompensa: "8 meses gratis",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-orange-500/20"
                    >
                      <div className="text-orange-200">{item.tipo}</div>
                      <div className="text-orange-200">{item.referido}</div>
                      <div className="text-orange-200">{item.cantidad}</div>
                      <Badge
                        variant="secondary"
                        className="bg-orange-500/20 text-orange-400 text-xs"
                      >
                        {item.recompensa}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recompensas No Fundadores */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-purple-400" />
                  <div>
                    <CardTitle className="text-purple-400">
                      Recompensas No Fundadores
                    </CardTitle>
                    <CardDescription className="text-purple-300/80">
                      Cantidad justa necesaria para mínima recompensa
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="font-medium text-purple-200">
                      TIPO REFERENTE
                    </div>
                    <div className="font-medium text-purple-200">REFERIDO</div>
                    <div className="font-medium text-purple-200">
                      CANTIDAD (+3)
                    </div>
                    <div className="font-medium text-purple-200">
                      RECOMPENSA
                    </div>
                  </div>
                  {[
                    {
                      tipo: "Asistente",
                      referido: "Alumnos",
                      cantidad: "6",
                      recompensa: "1 mes gratis",
                    },
                    {
                      tipo: "Asistente",
                      referido: "3 Pros",
                      cantidad: "3",
                      recompensa: "3 meses gratis",
                    },
                    {
                      tipo: "Asistente",
                      referido: "3 Academias",
                      cantidad: "3",
                      recompensa: "1 año gratis",
                    },
                    {
                      tipo: "Pro",
                      referido: "6 Asistentes",
                      cantidad: "6",
                      recompensa: "50% descuento",
                    },
                    {
                      tipo: "Pro",
                      referido: "6 Pros",
                      cantidad: "6",
                      recompensa: "1 mes gratis PRO",
                    },
                    {
                      tipo: "Pro",
                      referido: "3 Academias",
                      cantidad: "3",
                      recompensa: "6 meses gratis",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 text-sm py-2 border-b border-purple-500/20"
                    >
                      <div className="text-purple-200">{item.tipo}</div>
                      <div className="text-purple-200">{item.referido}</div>
                      <div className="text-purple-200">{item.cantidad}</div>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-400 text-xs"
                      >
                        {item.recompensa}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How it works process */}
          <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-green-400 text-center mb-8">
                ¿Cómo funciona?
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    1
                  </div>
                  <h4 className="font-semibold text-green-400 mb-2">
                    Refiere una Academia
                  </h4>
                  <p className="text-sm text-green-200">
                    Comparte tu enlace de referido con academias interesadas
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    2
                  </div>
                  <h4 className="font-semibold text-green-400 mb-2">
                    Se Suscriben
                  </h4>
                  <p className="text-sm text-green-200">
                    La academia se registra y elige su plan
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    3
                  </div>
                  <h4 className="font-semibold text-green-400 mb-2">
                    Obtén Recompensas
                  </h4>
                  <p className="text-sm text-green-200">
                    Recibe tu descuento automáticamente en la próxima factura
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-xl text-muted-foreground">
              Tu preparación personalizada en 3 pasos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border text-center p-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Elige tu Asistente
              </h3>
              <p className="text-muted-foreground">
                Selecciona el asistente especializado en tu oposición específica
              </p>
            </Card>

            <Card className="bg-card border-border text-center p-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Estudia con IA
              </h3>
              <p className="text-muted-foreground">
                Chatea, haz preguntas y recibe explicaciones personalizadas las
                24h
              </p>
            </Card>

            <Card className="bg-card border-border text-center p-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Alcanza el Éxito
              </h3>
              <p className="text-muted-foreground">
                Monitorea tu progreso y prepárate para aprobar tu oposición
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar tu preparación?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de opositores que ya están preparándose con IA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/asistentes">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-3 font-semibold"
              >
                Explorar Asistentes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3 font-semibold"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Crear Cuenta Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 Asistentes con IA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
