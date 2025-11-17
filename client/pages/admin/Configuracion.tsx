import AdminLayout from "@/components/admin/AdminLayout";
import { ApiKeyBanner } from "@/components/admin/ApiKeyBanner";
import ApiKeyConfiguration from "@/components/admin/ApiKeyConfiguration";
import { Key } from "lucide-react";

export default function Configuracion() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Key className="w-8 h-8 text-yellow-400" />
              API Keys y Configuración
            </h1>
            <p className="text-slate-400 mt-1">
              Gestiona aquí la API key de OpenAI y los parámetros críticos del sistema.
            </p>
          </div>
        </div>

        <ApiKeyBanner />

        <ApiKeyConfiguration />
      </div>
    </AdminLayout>
  );
}
