import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Bot,
  Euro,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Brain,
  Zap,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import MassAICurriculumGenerator from "@/components/admin/MassAICurriculumGenerator";

interface DashboardStats {
  totalUsers: number;
  totalAssistants: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  founderSlots: number;
  recentPayments: any[];
  systemAlerts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAssistants: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    founderSlots: 0,
    recentPayments: [],
    systemAlerts: [],
  });
  const [loading, setLoading] = useState(true);
  const [showMassAIGenerator, setShowMassAIGenerator] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulated data - replace with real Firebase calls
      setStats({
        totalUsers: 1247,
        totalAssistants: 83,
        totalRevenue: 45890,
        monthlyRevenue: 12450,
        activeSubscriptions: 892,
        founderSlots: 156,
        recentPayments: [
          {
            id: "pay_1",
            user: "usuario@email.com",
            amount: 19,
            assistant: "Auxiliar Administrativo",
            date: "2025-01-08",
            status: "completed",
          },
          {
            id: "pay_2",
            user: "otro@email.com",
            amount: 22,
            assistant: "Guardia Civil",
            date: "2025-01-08",
            status: "completed",
          },
          {
            id: "pay_3",
            user: "test@email.com",
            amount: 190,
            assistant: "MIR (Anual)",
            date: "2025-01-08",
            status: "pending",
          },
        ],
        systemAlerts: [
          {
            id: "alert_1",
            type: "warning",
            message:
              "Plazas fundador para 'Guardia Civil' casi agotadas (18/20)",
            date: "2025-01-08",
          },
          {
            id: "alert_2",
            type: "info",
            message: "Nueva academia registrada: 'Academia Oposiciones Madrid'",
            date: "2025-01-07",
          },
          {
            id: "alert_3",
            type: "success",
            message: "Backup automático completado correctamente",
            date: "2025-01-07",
          },
        ],
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "info":
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard Principal
            </h1>
            <p className="text-slate-400">
              Resumen general de la plataforma de asistentes IA
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowMassAIGenerator(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
            >
              <Brain className="w-5 h-5 mr-2" />
              Generar todos los temarios con IA (GPT 3.5)
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Usuarios</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Asistentes IA</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalAssistants}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    Ingresos Totales
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Euro className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Este Mes</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(stats.monthlyRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Suscripciones Activas
                </h3>
                <Badge className="bg-green-500/20 text-green-400">
                  {stats.activeSubscriptions}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Precio Fundador</span>
                  <span className="text-green-400">{stats.founderSlots}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Precio Normal</span>
                  <span className="text-blue-400">
                    {stats.activeSubscriptions - stats.founderSlots}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Estado del Sistema
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">
                    Todos los servicios operativos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">
                    Base de datos sincronizada
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300">
                    Stripe conectado
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5" />
                Últimos Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {payment.user}
                      </p>
                      <p className="text-xs text-slate-400">
                        {payment.assistant}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {formatCurrency(payment.amount)}
                      </p>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="w-5 h-5" />
                Alertas del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                  >
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {alert.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mass AI Curriculum Generator */}
        <MassAICurriculumGenerator
          isOpen={showMassAIGenerator}
          onClose={() => setShowMassAIGenerator(false)}
        />
      </div>
    </AdminLayout>
  );
}
