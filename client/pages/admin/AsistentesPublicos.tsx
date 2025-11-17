import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, Eye, Users } from "lucide-react";
import { useState } from "react";

export default function AsistentesPublicos() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for public assistants
  const publicAssistants = [
    {
      id: "legal-general",
      name: "Asistente Legal General",
      category: "Público",
      status: "Activo",
      users: 1250,
      queries: 15420,
      rating: 4.6,
      lastUpdate: "2025-01-08",
    },
    {
      id: "nutricion-deporte",
      name: "Asistente de Nutrición y Deporte",
      category: "Público",
      status: "Activo",
      users: 2100,
      queries: 28900,
      rating: 4.8,
      lastUpdate: "2025-01-07",
    },
    {
      id: "bienestar-emocional",
      name: "Asistente de Bienestar Emocional",
      category: "Público",
      status: "Activo",
      users: 1800,
      queries: 22100,
      rating: 4.7,
      lastUpdate: "2025-01-08",
    },
    {
      id: "burocracia-tramites",
      name: "Asistente de Burocracia y Trámites",
      category: "Público",
      status: "Activo",
      users: 3200,
      queries: 45600,
      rating: 4.5,
      lastUpdate: "2025-01-06",
    },
    {
      id: "laboral-basico",
      name: "Asistente Laboral Básico",
      category: "Público",
      status: "Mantenimiento",
      users: 980,
      queries: 12300,
      rating: 4.4,
      lastUpdate: "2025-01-05",
    },
  ];

  const filteredAssistants = publicAssistants.filter((assistant) =>
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Asistentes Públicos
            </h1>
            <p className="text-slate-400 mt-1">
              Gestión de asistentes de acceso libre
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Asistente Público
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Crear Asistente Público
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Los asistentes públicos son gratuitos para todos los usuarios
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-200">
                    Nombre del Asistente
                  </Label>
                  <Input
                    id="name"
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ej: Asistente de Cocina"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-slate-200">
                    Descripción
                  </Label>
                  <Input
                    id="description"
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Descripción del asistente..."
                  />
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Crear Asistente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Asistentes</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Usuarios Activos</p>
                <p className="text-2xl font-bold text-white">9,330</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Consultas Totales</p>
                <p className="text-2xl font-bold text-white">124,320</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Rating Promedio</p>
                <p className="text-2xl font-bold text-white">4.6</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar asistentes públicos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Assistants Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Asistente</TableHead>
                <TableHead className="text-slate-300">Estado</TableHead>
                <TableHead className="text-slate-300">Usuarios</TableHead>
                <TableHead className="text-slate-300">Consultas</TableHead>
                <TableHead className="text-slate-300">Rating</TableHead>
                <TableHead className="text-slate-300">Última Act.</TableHead>
                <TableHead className="text-slate-300">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssistants.map((assistant) => (
                <TableRow key={assistant.id} className="border-slate-700">
                  <TableCell>
                    <div>
                      <p className="text-white font-medium">{assistant.name}</p>
                      <p className="text-slate-400 text-sm">
                        {assistant.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        assistant.status === "Activo"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {assistant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {assistant.users.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {assistant.queries.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    ⭐ {assistant.rating}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {assistant.lastUpdate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="w-4 h-4" />
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
      </div>
    </AdminLayout>
  );
}
