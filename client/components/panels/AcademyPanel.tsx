import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  GraduationCap,
  UserPlus,
  Settings,
  BarChart3,
  School,
  FileText,
  Crown,
  Target,
  BookOpen,
  Calendar,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Star,
  TrendingUp
} from "lucide-react";
import Header from "@/components/Header";

interface Student {
  id: string;
  name: string;
  email: string;
  assignedAssistant: string;
  status: 'active' | 'inactive';
  progress: {
    totalSessions: number;
    completedTopics: number;
    averageScore: number;
    lastActivity: string;
  };
  subscriptionStatus: 'active' | 'inactive' | 'trial';
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher';
  assignedAssistants: string[];
  isActive: boolean;
}

interface AcademyData {
  name: string;
  students: Student[];
  teachers: Teacher[];
  availableAssistants: string[];
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  totalSlots: number;
  usedSlots: number;
}

const ASSISTANT_OPTIONS = [
  { id: "guardia-civil", name: "Guardia Civil", category: "seguridad" },
  { id: "policia-nacional", name: "Policía Nacional", category: "seguridad" },
  { id: "policia-local", name: "Policía Local", category: "seguridad" },
  { id: "bomberos", name: "Bomberos", category: "seguridad" },
  { id: "auxiliar-administrativo-estado", name: "Auxiliar Administrativo del Estado", category: "administracion" },
  { id: "administrativo-estado", name: "Administrativo del Estado", category: "administracion" },
];

export default function AcademyPanel() {
  const { user, permissions, isLoading } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [academyData, setAcademyData] = useState<AcademyData>({
    name: "Academia Ejemplo",
    students: [
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan@example.com",
        assignedAssistant: "guardia-civil",
        status: 'active',
        progress: {
          totalSessions: 15,
          completedTopics: 12,
          averageScore: 88,
          lastActivity: "2024-01-15"
        },
        subscriptionStatus: 'active'
      }
    ],
    teachers: [
      {
        id: "1",
        name: "María García",
        email: "maria@academia.com",
        role: 'admin',
        assignedAssistants: ["guardia-civil", "policia-nacional"],
        isActive: true
      }
    ],
    availableAssistants: ["guardia-civil", "policia-nacional", "policia-local"],
    subscriptionPlan: 'premium',
    totalSlots: 50,
    usedSlots: 23
  });

  // State for forms
  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    email: "",
    assignedAssistant: ""
  });

  const [newTeacherForm, setNewTeacherForm] = useState({
    name: "",
    email: "",
    role: "teacher" as "admin" | "teacher",
    assignedAssistants: [] as string[]
  });

  // Redirect if no access to academy panel
  useEffect(() => {
    if (!isLoading && !permissions.canAccessAcademy) {
      navigate('/');
    }
  }, [permissions.canAccessAcademy, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando panel de academia...</div>
      </div>
    );
  }

  const handleAddStudent = () => {
    if (!newStudentForm.name || !newStudentForm.email || !newStudentForm.assignedAssistant) {
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: newStudentForm.name,
      email: newStudentForm.email,
      assignedAssistant: newStudentForm.assignedAssistant,
      status: 'active',
      progress: {
        totalSessions: 0,
        completedTopics: 0,
        averageScore: 0,
        lastActivity: new Date().toISOString().split('T')[0]
      },
      subscriptionStatus: 'trial'
    };

    setAcademyData(prev => ({
      ...prev,
      students: [...prev.students, newStudent],
      usedSlots: prev.usedSlots + 1
    }));

    setNewStudentForm({ name: "", email: "", assignedAssistant: "" });
  };

  const handleAddTeacher = () => {
    if (!newTeacherForm.name || !newTeacherForm.email) {
      return;
    }

    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name: newTeacherForm.name,
      email: newTeacherForm.email,
      role: newTeacherForm.role,
      assignedAssistants: newTeacherForm.assignedAssistants,
      isActive: true
    };

    setAcademyData(prev => ({
      ...prev,
      teachers: [...prev.teachers, newTeacher]
    }));

    setNewTeacherForm({ name: "", email: "", role: "teacher", assignedAssistants: [] });
  };

  const getAssistantName = (assistantId: string) => {
    const assistant = ASSISTANT_OPTIONS.find(a => a.id === assistantId);
    return assistant?.name || assistantId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <School className="w-10 h-10 text-purple-400" />
                Panel de Academia
              </h1>
              <p className="text-slate-300 mt-2">
                {academyData.name} - {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Crown className="w-4 h-4 mr-1" />
                Plan {academyData.subscriptionPlan}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {academyData.usedSlots}/{academyData.totalSlots} alumnos
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Total Alumnos</p>
                    <p className="text-white text-2xl font-bold">
                      {academyData.students.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Alumnos Activos</p>
                    <p className="text-white text-2xl font-bold">
                      {academyData.students.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Puntuación Media</p>
                    <p className="text-white text-2xl font-bold">
                      {Math.round(academyData.students.reduce((acc, s) => acc + s.progress.averageScore, 0) / academyData.students.length || 0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-orange-400" />
                  <div>
                    <p className="text-slate-400 text-sm">Asistentes</p>
                    <p className="text-white text-2xl font-bold">
                      {academyData.availableAssistants.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="dashboard" className="text-slate-300">
              Panel
            </TabsTrigger>
            <TabsTrigger value="students" className="text-slate-300">
              Alumnos
            </TabsTrigger>
            <TabsTrigger value="teachers" className="text-slate-300">
              Profesores
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-slate-300">
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Resumen de la Academia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">
                        {academyData.students.length}
                      </p>
                      <p className="text-slate-400 text-sm">Total alumnos</p>
                    </div>
                    <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">
                        {academyData.students.filter(s => s.subscriptionStatus === 'active').length}
                      </p>
                      <p className="text-slate-400 text-sm">Con suscripción</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <h4 className="text-white font-medium mb-3">Asistentes Disponibles</h4>
                    <div className="space-y-2">
                      {academyData.availableAssistants.map(assistantId => (
                        <div key={assistantId} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          <span className="text-slate-300 text-sm">
                            {getAssistantName(assistantId)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 justify-start">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Añadir Nuevo Alumno
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white">
                      <DialogHeader>
                        <DialogTitle>Añadir Nuevo Alumno</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Crear una cuenta para un nuevo estudiante
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="student-name">Nombre completo</Label>
                          <Input
                            id="student-name"
                            value={newStudentForm.name}
                            onChange={(e) => setNewStudentForm(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="student-email">Email</Label>
                          <Input
                            id="student-email"
                            type="email"
                            value={newStudentForm.email}
                            onChange={(e) => setNewStudentForm(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="assigned-assistant">Asistente asignado</Label>
                          <Select
                            value={newStudentForm.assignedAssistant}
                            onValueChange={(value) => setNewStudentForm(prev => ({ ...prev, assignedAssistant: value }))}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Seleccionar asistente" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {academyData.availableAssistants.map(assistantId => (
                                <SelectItem key={assistantId} value={assistantId}>
                                  {getAssistantName(assistantId)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddStudent} className="w-full bg-blue-600 hover:bg-blue-700">
                          Crear Alumno
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start"
                    onClick={() => setActiveTab("students")}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Progreso de Alumnos
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start"
                    onClick={() => setActiveTab("teachers")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Gestionar Profesores
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Gestión de Alumnos</CardTitle>
                  <CardDescription className="text-slate-400">
                    Administra los estudiantes de tu academia
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Añadir Alumno
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Añadir Nuevo Alumno</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="student-name">Nombre completo</Label>
                        <Input
                          id="student-name"
                          value={newStudentForm.name}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="student-email">Email</Label>
                        <Input
                          id="student-email"
                          type="email"
                          value={newStudentForm.email}
                          onChange={(e) => setNewStudentForm(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assigned-assistant">Asistente asignado</Label>
                        <Select
                          value={newStudentForm.assignedAssistant}
                          onValueChange={(value) => setNewStudentForm(prev => ({ ...prev, assignedAssistant: value }))}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Seleccionar asistente" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {academyData.availableAssistants.map(assistantId => (
                              <SelectItem key={assistantId} value={assistantId}>
                                {getAssistantName(assistantId)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddStudent} className="w-full bg-blue-600 hover:bg-blue-700">
                        Crear Alumno
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Alumno</TableHead>
                      <TableHead className="text-slate-300">Asistente</TableHead>
                      <TableHead className="text-slate-300">Estado</TableHead>
                      <TableHead className="text-slate-300">Progreso</TableHead>
                      <TableHead className="text-slate-300">Suscripción</TableHead>
                      <TableHead className="text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academyData.students.map((student) => (
                      <TableRow key={student.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{student.name}</p>
                            <p className="text-slate-400 text-sm">{student.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-300">
                            {getAssistantName(student.assignedAssistant)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            student.status === 'active'
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                          }>
                            {student.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-white text-sm">{student.progress.averageScore}%</p>
                            <p className="text-slate-400 text-xs">{student.progress.completedTopics} temas</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            student.subscriptionStatus === 'active'
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : student.subscriptionStatus === 'trial'
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                          }>
                            {student.subscriptionStatus === 'active' ? 'Activa' :
                             student.subscriptionStatus === 'trial' ? 'Prueba' : 'Inactiva'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-600 text-red-300">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Gestión de Profesores</CardTitle>
                  <CardDescription className="text-slate-400">
                    Administra el equipo docente de tu academia
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Añadir Profesor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-slate-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Añadir Nuevo Profesor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="teacher-name">Nombre completo</Label>
                        <Input
                          id="teacher-name"
                          value={newTeacherForm.name}
                          onChange={(e) => setNewTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="teacher-email">Email</Label>
                        <Input
                          id="teacher-email"
                          type="email"
                          value={newTeacherForm.email}
                          onChange={(e) => setNewTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="teacher-role">Rol</Label>
                        <Select
                          value={newTeacherForm.role}
                          onValueChange={(value: "admin" | "teacher") => setNewTeacherForm(prev => ({ ...prev, role: value }))}
                        >
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Seleccionar rol" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="teacher">Profesor</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddTeacher} className="w-full bg-purple-600 hover:bg-purple-700">
                        Crear Profesor
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Profesor</TableHead>
                      <TableHead className="text-slate-300">Rol</TableHead>
                      <TableHead className="text-slate-300">Asistentes</TableHead>
                      <TableHead className="text-slate-300">Estado</TableHead>
                      <TableHead className="text-slate-300">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {academyData.teachers.map((teacher) => (
                      <TableRow key={teacher.id} className="border-slate-700">
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{teacher.name}</p>
                            <p className="text-slate-400 text-sm">{teacher.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            teacher.role === 'admin'
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          }>
                            {teacher.role === 'admin' ? 'Administrador' : 'Profesor'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-300 text-sm">
                            {teacher.assignedAssistants.length} asistentes
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            teacher.isActive
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                          }>
                            {teacher.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-600 text-red-300">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Configuración de la Academia</CardTitle>
                <CardDescription className="text-slate-400">
                  Gestiona la configuración y suscripciones de tu academia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="academy-name">Nombre de la Academia</Label>
                  <Input
                    id="academy-name"
                    value={academyData.name}
                    onChange={(e) => setAcademyData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Plan Actual</h3>
                    <p className="text-2xl font-bold text-purple-400 capitalize">{academyData.subscriptionPlan}</p>
                    <p className="text-slate-400 text-sm">
                      {academyData.usedSlots}/{academyData.totalSlots} slots utilizados
                    </p>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Asistentes Disponibles</h3>
                    <p className="text-2xl font-bold text-blue-400">{academyData.availableAssistants.length}</p>
                    <p className="text-slate-400 text-sm">Asistentes especializados</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-600">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Actualizar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
