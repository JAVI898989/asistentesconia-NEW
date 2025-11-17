import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Settings } from "lucide-react";

export default function Referidos() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <UserPlus className="w-8 h-8 text-pink-400" />
              Sistema de Referidos
            </h1>
            <p className="text-slate-400 mt-1">
              Gestión del programa de referidos y comisiones
            </p>
          </div>
          <Button className="bg-pink-500 hover:bg-pink-600">
            <Settings className="w-4 h-4 mr-2" />
            Configurar Referidos
          </Button>
        </div>

        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
          <UserPlus className="w-16 h-16 text-pink-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Sistema de Referidos
          </h2>
          <p className="text-slate-400">
            Configuración y seguimiento del programa de referidos
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
