import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser, onAuthChange } from "@/lib/bulletproofAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  Search,
} from "lucide-react";
import Header from "@/components/Header";

export default function AcademiaPanelSimple() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Academia Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Panel de Academia
              </h1>
              <p className="text-muted-foreground mt-2">
                Gestiona tu academia: {slug}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Administrador: {user.email}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">+12% este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cursos Activos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 nuevos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tasa de Finalización
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€12,450</div>
              <p className="text-xs text-muted-foreground">+8% este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
            <TabsTrigger value="cursos">Cursos</TabsTrigger>
            <TabsTrigger value="profesores">Profesores</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>
                    Últimas acciones en la academia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Nuevo estudiante registrado
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ana García - hace 2 horas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Curso completado</p>
                        <p className="text-xs text-muted-foreground">
                          Python Básico - Carlos Ruiz
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Nuevo curso publicado
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JavaScript Avanzado
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cursos Más Populares</CardTitle>
                  <CardDescription>
                    Cursos con más inscripciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Python desde Cero</p>
                        <p className="text-xs text-muted-foreground">
                          45 estudiantes
                        </p>
                      </div>
                      <Badge>Popular</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          React para Principiantes
                        </p>
                        <p className="text-xs text-muted-foreground">
                          38 estudiantes
                        </p>
                      </div>
                      <Badge variant="secondary">Nuevo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Data Science</p>
                        <p className="text-xs text-muted-foreground">
                          29 estudiantes
                        </p>
                      </div>
                      <Badge variant="outline">Avanzado</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="estudiantes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Estudiantes</CardTitle>
                    <CardDescription>
                      Administra los estudiantes de tu academia
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Estudiante
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar estudiantes..."
                      className="flex-1"
                    />
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Ana García",
                        email: "ana@email.com",
                        curso: "Python Básico",
                        progreso: "75%",
                      },
                      {
                        name: "Carlos Ruiz",
                        email: "carlos@email.com",
                        curso: "React",
                        progreso: "100%",
                      },
                      {
                        name: "María López",
                        email: "maria@email.com",
                        curso: "Data Science",
                        progreso: "45%",
                      },
                    ].map((estudiante, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
                            {estudiante.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{estudiante.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {estudiante.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {estudiante.curso}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Progreso: {estudiante.progreso}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cursos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Cursos</CardTitle>
                    <CardDescription>
                      Crea y administra los cursos de tu academia
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Curso
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Python desde Cero",
                      estudiantes: 45,
                      estado: "Activo",
                    },
                    {
                      title: "React para Principiantes",
                      estudiantes: 38,
                      estado: "Activo",
                    },
                    {
                      title: "Data Science Básico",
                      estudiantes: 29,
                      estado: "Activo",
                    },
                    {
                      title: "JavaScript Avanzado",
                      estudiantes: 15,
                      estado: "Borrador",
                    },
                  ].map((curso, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{curso.title}</CardTitle>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              curso.estado === "Activo"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {curso.estado}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {curso.estudiantes} estudiantes
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Ver
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profesores" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Profesores</CardTitle>
                    <CardDescription>
                      Administra el equipo docente de tu academia
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Invitar Profesor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Prof. Juan Pérez",
                      especialidad: "Python & Backend",
                      cursos: 3,
                      email: "juan@academia.com",
                    },
                    {
                      name: "Prof. Laura Martín",
                      especialidad: "Frontend & React",
                      cursos: 2,
                      email: "laura@academia.com",
                    },
                    {
                      name: "Prof. Diego Sánchez",
                      especialidad: "Data Science",
                      cursos: 2,
                      email: "diego@academia.com",
                    },
                  ].map((profesor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                          {profesor.name.split(" ")[1]?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="font-medium">{profesor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {profesor.especialidad}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {profesor.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {profesor.cursos} cursos
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Gestionar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Academia</CardTitle>
                <CardDescription>
                  Personaliza la configuración de tu academia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Academia</Label>
                  <Input id="nombre" defaultValue={`Academia ${slug}`} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    defaultValue="Academia especializada en tecnología y programación"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sitio">Sitio Web</Label>
                  <Input
                    id="sitio"
                    defaultValue={`https://${slug}.academia.com`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contacto</Label>
                  <Input id="email" defaultValue={`contacto@${slug}.com`} />
                </div>

                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
