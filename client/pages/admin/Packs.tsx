import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Packs() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Package className="w-8 h-8 text-orange-400" />
              Packs - Redirección
            </h1>
            <p className="text-slate-400 mt-1">
              Redirección a la nueva gestión de packs familiares
            </p>
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
          <Package className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-4">
            Gestión de Packs Familiares
          </h2>
          <p className="text-slate-400 mb-6">
            La gestión de packs familiares se ha movido a una nueva ubicación con funcionalidades mejoradas.
          </p>
          <Link to="/admin/family-packs">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Package className="w-4 h-4 mr-2" />
              Ir a Packs Familiares
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
