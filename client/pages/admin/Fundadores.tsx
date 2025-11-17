import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getGlobalFounderLimits,
  setGlobalFounderLimits,
  type GlobalFounderLimits,
} from "@/lib/firebaseData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Users,
  Search,
  Filter,
  Crown,
  Shield,
  Ban,
  Trash2,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  GraduationCap,
  Bot,
} from "lucide-react";
import { useState, useEffect } from "react";

interface FounderProduct {
  id: string;
  name: string;
  type: "normal" | "pro" | "pack" | "academia";
  category: string;
  plazas_fundador_total: number;
  plazas_fundador_ocupadas: number;
  plazas_fundador_disponibles: number;
  fundador_activo: boolean;
  bloqueo_manual: boolean;
  modo_automatico: boolean;
  revenue_fundador: number;
}

interface GlobalLimits {
  total_fundadores_asistentes: number;
  total_fundadores_asistentes_pro: number;
  total_fundadores_academias: number;
  current_fundadores_asistentes: number;
  current_fundadores_asistentes_pro: number;
  current_fundadores_academias: number;
  bloqueado_manual_asistentes: boolean;
  bloqueado_manual_asistentes_pro: boolean;
  bloqueado_manual_academias: boolean;
}

// Mock data for founder management
const founderProducts: FounderProduct[] = [
  {
    id: "auxiliar-administrativo-estado",
    name: "Auxiliar Administrativo del Estado",
    type: "normal",
    category: "Administración",
    plazas_fundador_total: 100,
    plazas_fundador_ocupadas: 85,
    plazas_fundador_disponibles: 15,
    fundador_activo: true,
    bloqueo_manual: false,
    modo_automatico: true,
    revenue_fundador: 1360,
  },
  {
    id: "guardia-civil",
    name: "Guardia Civil",
    type: "normal",
    category: "Seguridad",
    plazas_fundador_total: 150,
    plazas_fundador_ocupadas: 150,
    plazas_fundador_disponibles: 0,
    fundador_activo: false,
    bloqueo_manual: false,
    modo_automatico: true,
    revenue_fundador: 2400,
  },
  {
    id: "nutricionista-pro",
    name: "Nutricionista PRO",
    type: "pro",
    category: "Sanidad PRO",
    plazas_fundador_total: 50,
    plazas_fundador_ocupadas: 12,
    plazas_fundador_disponibles: 38,
    fundador_activo: true,
    bloqueo_manual: false,
    modo_automatico: true,
    revenue_fundador: 480,
  },
  {
    id: "pack-familiar-basico",
    name: "Pack Familiar Básico",
    type: "pack",
    category: "Packs Familiares",
    plazas_fundador_total: 75,
    plazas_fundador_ocupadas: 45,
    plazas_fundador_disponibles: 30,
    fundador_activo: true,
    bloqueo_manual: false,
    modo_automatico: true,
    revenue_fundador: 1800,
  },
  {
    id: "academia-madrid-centro",
    name: "Academia Madrid Centro",
    type: "academia",
    category: "Academias",
    plazas_fundador_total: 25,
    plazas_fundador_ocupadas: 8,
    plazas_fundador_disponibles: 17,
    fundador_activo: true,
    bloqueo_manual: false,
    modo_automatico: true,
    revenue_fundador: 320,
  },
  {
    id: "judicatura",
    name: "Judicatura",
    type: "normal",
    category: "Justicia",
    plazas_fundador_total: 80,
    plazas_fundador_ocupadas: 45,
    plazas_fundador_disponibles: 35,
    fundador_activo: false,
    bloqueo_manual: true,
    modo_automatico: false,
    revenue_fundador: 990,
  },
];

// Mock global limits data
const initialGlobalLimits: GlobalLimits = {
  total_fundadores_asistentes: 500,
  total_fundadores_asistentes_pro: 200,
  total_fundadores_academias: 50,
  current_fundadores_asistentes: 342,
  current_fundadores_asistentes_pro: 87,
  current_fundadores_academias: 23,
  bloqueado_manual_asistentes: false,
  bloqueado_manual_asistentes_pro: false,
  bloqueado_manual_academias: false,
};

export default function Fundadores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<FounderProduct | null>(
    null,
  );
  const [globalLimits, setGlobalLimits] =
    useState<GlobalLimits>(initialGlobalLimits);
  const [editingLimits, setEditingLimits] = useState(false);

  useEffect(() => {
    const loadGlobalLimits = async () => {
      try {
        const limits = await getGlobalFounderLimits();
        if (limits) {
          setGlobalLimits(limits as GlobalLimits);
        } else {
          // Initialize with default values if not exists
          const defaultLimits: GlobalFounderLimits = {
            ...initialGlobalLimits,
            lastUpdated: new Date().toISOString(),
          };
          await setGlobalFounderLimits(defaultLimits);
          setGlobalLimits(initialGlobalLimits);
        }
      } catch (error) {
        console.error("Error loading global limits:", error);
      }
    };

    loadGlobalLimits();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "normal":
        return <Bot className="w-4 h-4" />;
      case "pro":
        return <Crown className="w-4 h-4" />;
      case "pack":
        return <Package className="w-4 h-4" />;
      case "academia":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (product: FounderProduct) => {
    if (product.bloqueo_manual) {
      return (
        <Badge className="bg-red-500/20 text-red-400">Bloqueado Manual</Badge>
      );
    }
    if (product.plazas_fundador_disponibles === 0) {
      return <Badge className="bg-red-500/20 text-red-400">Completo</Badge>;
    }
    if (product.plazas_fundador_disponibles <= 5) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400">
          Casi Completo
        </Badge>
      );
    }
    return <Badge className="bg-green-500/20 text-green-400">Disponible</Badge>;
  };

  const getStatusColor = (product: FounderProduct) => {
    if (product.bloqueo_manual || product.plazas_fundador_disponibles === 0)
      return "text-red-400";
    if (product.plazas_fundador_disponibles <= 5) return "text-yellow-400";
    return "text-green-400";
  };

  const filteredProducts = founderProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" &&
        product.fundador_activo &&
        product.plazas_fundador_disponibles > 0) ||
      (statusFilter === "full" && product.plazas_fundador_disponibles === 0) ||
      (statusFilter === "blocked" && product.bloqueo_manual);

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalStats = {
    totalProducts: founderProducts.length,
    totalFounders: founderProducts.reduce(
      (sum, p) => sum + p.plazas_fundador_ocupadas,
      0,
    ),
    totalRevenue: founderProducts.reduce(
      (sum, p) => sum + p.revenue_fundador,
      0,
    ),
    activeProducts: founderProducts.filter((p) => p.fundador_activo).length,
  };

  const getGlobalStatusColor = (
    current: number,
    total: number,
    blocked: boolean,
  ) => {
    if (blocked) return "text-red-400";
    const percentage = (current / total) * 100;
    if (percentage >= 90) return "text-red-400";
    if (percentage >= 75) return "text-yellow-400";
    return "text-green-400";
  };

  const getGlobalStatusBadge = (
    current: number,
    total: number,
    blocked: boolean,
  ) => {
    if (blocked) {
      return (
        <Badge className="bg-red-500/20 text-red-400">Bloqueado Manual</Badge>
      );
    }
    const remaining = total - current;
    const percentage = (current / total) * 100;

    if (remaining === 0) {
      return (
        <Badge className="bg-red-500/20 text-red-400">Límite Alcanzado</Badge>
      );
    }
    if (percentage >= 90) {
      return (
        <Badge className="bg-red-500/20 text-red-400">
          Crítico ({remaining} restantes)
        </Badge>
      );
    }
    if (percentage >= 75) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400">
          Alerta ({remaining} restantes)
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-500/20 text-green-400">
        Disponible ({remaining} restantes)
      </Badge>
    );
  };

  const updateGlobalLimit = (
    key: keyof GlobalLimits,
    value: number | boolean,
  ) => {
    setGlobalLimits((prev) => ({ ...prev, [key]: value }));
  };

  const saveGlobalLimits = async () => {
    try {
      const limitsToSave: GlobalFounderLimits = {
        ...globalLimits,
        lastUpdated: new Date().toISOString(),
      };
      await setGlobalFounderLimits(limitsToSave);
      console.log("Límites globales guardados exitosamente");
      setEditingLimits(false);
    } catch (error) {
      console.error("Error guardando límites globales:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              Fundadores
            </h1>
            <p className="text-slate-400 mt-1">
              Gestión de plazas de fundador por producto
            </p>
          </div>
          <Button className="bg-purple-500 hover:bg-purple-600">
            <Settings className="w-4 h-4 mr-2" />
            Configuración Global
          </Button>
        </div>

        {/* Global Limits Section */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-400" />
              Límites Globales de Fundadores
            </h2>
            {editingLimits ? (
              <div className="flex gap-2">
                <Button
                  onClick={saveGlobalLimits}
                  className="bg-green-500 hover:bg-green-600"
                  size="sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  onClick={() => setEditingLimits(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setEditingLimits(true)}
                className="bg-purple-500 hover:bg-purple-600"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Editar Límites
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Asistentes Normales */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                  Asistentes Normales
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Límite Total:</span>
                  {editingLimits ? (
                    <Input
                      type="number"
                      value={globalLimits.total_fundadores_asistentes}
                      onChange={(e) =>
                        updateGlobalLimit(
                          "total_fundadores_asistentes",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-20 h-8 bg-slate-600 border-slate-500 text-white text-sm"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {globalLimits.total_fundadores_asistentes}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Actuales:</span>
                  <span
                    className={`font-bold ${getGlobalStatusColor(globalLimits.current_fundadores_asistentes, globalLimits.total_fundadores_asistentes, globalLimits.bloqueado_manual_asistentes)}`}
                  >
                    {globalLimits.current_fundadores_asistentes}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Restantes:</span>
                  <span
                    className={`font-bold ${getGlobalStatusColor(globalLimits.current_fundadores_asistentes, globalLimits.total_fundadores_asistentes, globalLimits.bloqueado_manual_asistentes)}`}
                  >
                    {globalLimits.total_fundadores_asistentes -
                      globalLimits.current_fundadores_asistentes}
                  </span>
                </div>

                <div className="pt-2">
                  {getGlobalStatusBadge(
                    globalLimits.current_fundadores_asistentes,
                    globalLimits.total_fundadores_asistentes,
                    globalLimits.bloqueado_manual_asistentes,
                  )}
                </div>

                <Button
                  onClick={() =>
                    updateGlobalLimit(
                      "bloqueado_manual_asistentes",
                      !globalLimits.bloqueado_manual_asistentes,
                    )
                  }
                  variant={
                    globalLimits.bloqueado_manual_asistentes
                      ? "default"
                      : "outline"
                  }
                  className={`w-full ${globalLimits.bloqueado_manual_asistentes ? "bg-red-500 hover:bg-red-600" : "border-red-600 text-red-400 hover:bg-red-600/20"}`}
                  size="sm"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {globalLimits.bloqueado_manual_asistentes
                    ? "Desbloqueado"
                    : "Bloquear"}{" "}
                  Manualmente
                </Button>
              </div>
            </div>

            {/* Asistentes PRO */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">
                  Asistentes PRO
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Límite Total:</span>
                  {editingLimits ? (
                    <Input
                      type="number"
                      value={globalLimits.total_fundadores_asistentes_pro}
                      onChange={(e) =>
                        updateGlobalLimit(
                          "total_fundadores_asistentes_pro",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-20 h-8 bg-slate-600 border-slate-500 text-white text-sm"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {globalLimits.total_fundadores_asistentes_pro}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Actuales:</span>
                  <span
                    className={`font-bold ${getGlobalStatusColor(globalLimits.current_fundadores_asistentes_pro, globalLimits.total_fundadores_asistentes_pro, globalLimits.bloqueado_manual_asistentes_pro)}`}
                  >
                    {globalLimits.current_fundadores_asistentes_pro}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Restantes:</span>
                  <span
                    className={`font-bold ${getGlobalStatusColor(globalLimits.current_fundadores_asistentes_pro, globalLimits.total_fundadores_asistentes_pro, globalLimits.bloqueado_manual_asistentes_pro)}`}
                  >
                    {globalLimits.total_fundadores_asistentes_pro -
                      globalLimits.current_fundadores_asistentes_pro}
                  </span>
                </div>

                <div className="pt-2">
                  {getGlobalStatusBadge(
                    globalLimits.current_fundadores_asistentes_pro,
                    globalLimits.total_fundadores_asistentes_pro,
                    globalLimits.bloqueado_manual_asistentes_pro,
                  )}
                </div>

                <Button
                  onClick={() =>
                    updateGlobalLimit(
                      "bloqueado_manual_asistentes_pro",
                      !globalLimits.bloqueado_manual_asistentes_pro,
                    )
                  }
                  variant={
                    globalLimits.bloqueado_manual_asistentes_pro
                      ? "default"
                      : "outline"
                  }
                  className={`w-full ${globalLimits.bloqueado_manual_asistentes_pro ? "bg-red-500 hover:bg-red-600" : "border-red-600 text-red-400 hover:bg-red-600/20"}`}
                  size="sm"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {globalLimits.bloqueado_manual_asistentes_pro
                    ? "Desbloqueado"
                    : "Bloquear"}{" "}
                  Manualmente
                </Button>
              </div>
            </div>

            {/* Academias */}
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Academias</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Límite Total:</span>
                  {editingLimits ? (
                    <Input
                      type="number"
                      value={globalLimits.total_fundadores_academias}
                      onChange={(e) =>
                        updateGlobalLimit(
                          "total_fundadores_academias",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-20 h-8 bg-slate-600 border-slate-500 text-white text-sm"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {globalLimits.total_fundadores_academias}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Actuales:</span>
                  <span
                    className={`font-bold ${getGlobalStatusColor(globalLimits.current_fundadores_academias, globalLimits.total_fundadores_academias, globalLimits.bloqueado_manual_academias)}`}
                  >
                    {globalLimits.current_fundadores_academias}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Restantes:</span>
                  <span
                    className={`font-bold ${getGlobalStatusColor(globalLimits.current_fundadores_academias, globalLimits.total_fundadores_academias, globalLimits.bloqueado_manual_academias)}`}
                  >
                    {globalLimits.total_fundadores_academias -
                      globalLimits.current_fundadores_academias}
                  </span>
                </div>

                <div className="pt-2">
                  {getGlobalStatusBadge(
                    globalLimits.current_fundadores_academias,
                    globalLimits.total_fundadores_academias,
                    globalLimits.bloqueado_manual_academias,
                  )}
                </div>

                <Button
                  onClick={() =>
                    updateGlobalLimit(
                      "bloqueado_manual_academias",
                      !globalLimits.bloqueado_manual_academias,
                    )
                  }
                  variant={
                    globalLimits.bloqueado_manual_academias
                      ? "default"
                      : "outline"
                  }
                  className={`w-full ${globalLimits.bloqueado_manual_academias ? "bg-red-500 hover:bg-red-600" : "border-red-600 text-red-400 hover:bg-red-600/20"}`}
                  size="sm"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  {globalLimits.bloqueado_manual_academias
                    ? "Desbloqueado"
                    : "Bloquear"}{" "}
                  Manualmente
                </Button>
              </div>
            </div>
          </div>

          {/* Global Alerts */}
          <div className="mt-6">
            {(globalLimits.bloqueado_manual_asistentes ||
              globalLimits.bloqueado_manual_asistentes_pro ||
              globalLimits.bloqueado_manual_academias ||
              globalLimits.current_fundadores_asistentes >=
                globalLimits.total_fundadores_asistentes ||
              globalLimits.current_fundadores_asistentes_pro >=
                globalLimits.total_fundadores_asistentes_pro ||
              globalLimits.current_fundadores_academias >=
                globalLimits.total_fundadores_academias) && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Alertas del Sistema</span>
                </div>
                <div className="space-y-1 text-sm text-red-300">
                  {globalLimits.bloqueado_manual_asistentes && (
                    <p>• Asistentes Normales: Bloqueado manualmente</p>
                  )}
                  {globalLimits.bloqueado_manual_asistentes_pro && (
                    <p>• Asistentes PRO: Bloqueado manualmente</p>
                  )}
                  {globalLimits.bloqueado_manual_academias && (
                    <p>• Academias: Bloqueado manualmente</p>
                  )}
                  {globalLimits.current_fundadores_asistentes >=
                    globalLimits.total_fundadores_asistentes && (
                    <p>• Asistentes Normales: Límite máximo alcanzado</p>
                  )}
                  {globalLimits.current_fundadores_asistentes_pro >=
                    globalLimits.total_fundadores_asistentes_pro && (
                    <p>• Asistentes PRO: Límite máximo alcanzado</p>
                  )}
                  {globalLimits.current_fundadores_academias >=
                    globalLimits.total_fundadores_academias && (
                    <p>• Academias: Límite máximo alcanzado</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Productos</p>
                <p className="text-2xl font-bold text-white">
                  {totalStats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Fundadores</p>
                <p className="text-2xl font-bold text-white">
                  {totalStats.totalFounders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Ingresos Fundador</p>
                <p className="text-2xl font-bold text-white">
                  €{totalStats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Productos Activos</p>
                <p className="text-2xl font-bold text-white">
                  {totalStats.activeProducts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="normal">Asistentes Normales</SelectItem>
                <SelectItem value="pro">Asistentes PRO</SelectItem>
                <SelectItem value="pack">Packs Familiares</SelectItem>
                <SelectItem value="academia">Academias</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="full">Completos</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Producto</TableHead>
                <TableHead className="text-slate-300">Tipo</TableHead>
                <TableHead className="text-slate-300">Estado</TableHead>
                <TableHead className="text-slate-300">Plazas</TableHead>
                <TableHead className="text-slate-300">Ocupadas</TableHead>
                <TableHead className="text-slate-300">Disponibles</TableHead>
                <TableHead className="text-slate-300">Ingresos</TableHead>
                <TableHead className="text-slate-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-slate-400 text-sm">
                        {product.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(product.type)}
                      <span className="text-slate-300 capitalize">
                        {product.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(product)}</TableCell>
                  <TableCell className="text-slate-300">
                    {product.plazas_fundador_total}
                  </TableCell>
                  <TableCell className={getStatusColor(product)}>
                    {product.plazas_fundador_ocupadas}
                  </TableCell>
                  <TableCell className={getStatusColor(product)}>
                    {product.plazas_fundador_disponibles}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    €{product.revenue_fundador.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Product Management Dialog */}
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">
                Gestionar Fundadores: {selectedProduct?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Configuración de plazas de fundador para este producto
              </DialogDescription>
            </DialogHeader>

            {selectedProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <p className="text-slate-400 text-sm">Total</p>
                    <p className="text-white font-bold">
                      {selectedProduct.plazas_fundador_total}
                    </p>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <p className="text-slate-400 text-sm">Ocupadas</p>
                    <p className="text-white font-bold">
                      {selectedProduct.plazas_fundador_ocupadas}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600"
                    variant={
                      selectedProduct.bloqueo_manual ? "default" : "outline"
                    }
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    {selectedProduct.bloqueo_manual
                      ? "Desbloquear"
                      : "Bloquear"}{" "}
                    Manualmente
                  </Button>

                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                    variant={
                      selectedProduct.modo_automatico ? "default" : "outline"
                    }
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Modo Automático:{" "}
                    {selectedProduct.modo_automatico ? "ON" : "OFF"}
                  </Button>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    variant="outline"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Fundadores
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
