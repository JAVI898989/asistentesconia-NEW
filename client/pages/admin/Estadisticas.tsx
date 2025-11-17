import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";

export default function Estadisticas() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
              Estadísticas Avanzadas
            </h1>
            <p className="text-slate-400 mt-1">
              Análisis detallado y métricas de la plataforma
            </p>
          </div>
          <Button className="bg-cyan-500 hover:bg-cyan-600">
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
          <BarChart3 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Estadísticas Avanzadas
          </h2>
          <p className="text-slate-400">
            Análisis profundo de uso, ingresos y métricas de rendimiento
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
