import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Edit,
  Plus,
  Users,
  DollarSign,
  Star,
  Clock,
  FileText,
  Eye,
  TrendingUp,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import CurriculumManagement from "@/components/admin/CurriculumManagement";

interface Course {
  id: string;
  name: string;
  slug: string;
  category: string;
  level: "Básico" | "Intermedio" | "Avanzado" | "Experto";
  image: string;
  isActive: boolean;
  isPublic: boolean;
  price: number;
  monthlyPrice: number;
  duration: string;
  totalStudents: number;
  rating: number;
  totalModules: number;
  monthlyRevenue: number;
  description: string;
}

const categories = [
  { value: "profesional", label: "Cursos Profesionales" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "salud", label: "Salud y Bienestar" },
  { value: "idiomas", label: "Idiomas" },
  { value: "negocios", label: "Negocios y Gestión" },
  { value: "arte", label: "Arte y Creatividad" },
  { value: "ciencias", label: "Ciencias" },
  { value: "educacion", label: "Educación" },
];

export default function CursosManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [curriculumDialogOpen, setCurriculumDialogOpen] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // Simulated course data - replace with real Firebase calls
      const mockCourses: Course[] = [
        {
          id: "programador-desde-cero",
          name: "Programador desde Cero",
          slug: "programador-desde-cero",
          category: "tecnologia",
          level: "Básico",
          image:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300",
          isActive: true,
          isPublic: false,
          price: 299,
          monthlyPrice: 49,
          duration: "12 semanas",
          totalStudents: 1245,
          rating: 4.8,
          totalModules: 9,
          monthlyRevenue: 15680,
          description:
            "Aprende programación desde cero hasta nivel profesional",
        },
        {
          id: "auxiliar-veterinaria",
          name: "Auxiliar de Veterinaria",
          slug: "auxiliar-veterinaria",
          category: "salud",
          level: "Intermedio",
          image:
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300",
          isActive: true,
          isPublic: false,
          price: 399,
          monthlyPrice: 59,
          duration: "16 semanas",
          totalStudents: 892,
          rating: 4.9,
          totalModules: 12,
          monthlyRevenue: 12450,
          description: "Formación completa para auxiliar de veterinaria",
        },
        {
          id: "peluqueria-profesional",
          name: "Peluquería Profesional",
          slug: "peluqueria-profesional",
          category: "profesional",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300",
          isActive: true,
          isPublic: false,
          price: 499,
          monthlyPrice: 69,
          duration: "20 semanas",
          totalStudents: 567,
          rating: 4.7,
          totalModules: 15,
          monthlyRevenue: 9890,
          description: "Curso profesional de peluquería y estilismo",
        },
        {
          id: "electricista",
          name: "Electricista Profesional",
          slug: "electricista",
          category: "profesional",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300",
          isActive: true,
          isPublic: false,
          price: 459,
          monthlyPrice: 65,
          duration: "18 semanas",
          totalStudents: 423,
          rating: 4.6,
          totalModules: 14,
          monthlyRevenue: 8670,
          description: "Formación completa en instalaciones eléctricas",
        },
        {
          id: "fontaneria",
          name: "Fontanería Profesional",
          slug: "fontaneria",
          category: "profesional",
          level: "Intermedio",
          image:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
          isActive: true,
          isPublic: false,
          price: 349,
          monthlyPrice: 55,
          duration: "14 semanas",
          totalStudents: 334,
          rating: 4.5,
          totalModules: 11,
          monthlyRevenue: 6780,
          description: "Curso profesional de fontanería y plomería",
        },
        {
          id: "diseno-grafico",
          name: "Diseño Gráfico Digital",
          slug: "diseno-grafico",
          category: "arte",
          level: "Intermedio",
          image:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300",
          isActive: true,
          isPublic: false,
          price: 379,
          monthlyPrice: 59,
          duration: "16 semanas",
          totalStudents: 789,
          rating: 4.8,
          totalModules: 13,
          monthlyRevenue: 11230,
          description:
            "Domina el diseño gráfico con herramientas profesionales",
        },
        {
          id: "marketing-digital",
          name: "Marketing Digital Avanzado",
          slug: "marketing-digital",
          category: "negocios",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300",
          isActive: true,
          isPublic: false,
          price: 449,
          monthlyPrice: 65,
          duration: "20 semanas",
          totalStudents: 1156,
          rating: 4.9,
          totalModules: 16,
          monthlyRevenue: 18450,
          description:
            "Estrategias avanzadas de marketing digital y redes sociales",
        },
        {
          id: "ingles-negocios",
          name: "Inglés para Negocios",
          slug: "ingles-negocios",
          category: "idiomas",
          level: "Intermedio",
          image:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300",
          isActive: true,
          isPublic: false,
          price: 299,
          monthlyPrice: 45,
          duration: "12 semanas",
          totalStudents: 945,
          rating: 4.7,
          totalModules: 10,
          monthlyRevenue: 12680,
          description: "Inglés especializado para entornos profesionales",
        },
        {
          id: "jardineria-paisajismo",
          name: "Jardinería y Paisajismo",
          slug: "jardineria-paisajismo",
          category: "profesional",
          level: "Intermedio",
          image:
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300",
          isActive: true,
          isPublic: false,
          price: 369,
          monthlyPrice: 55,
          duration: "14 semanas",
          totalStudents: 432,
          rating: 4.6,
          totalModules: 12,
          monthlyRevenue: 7890,
          description:
            "Curso completo de jardinería y diseño de espacios verdes",
        },
        {
          id: "carpinteria",
          name: "Carpintería Profesional",
          slug: "carpinteria",
          category: "profesional",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
          isActive: true,
          isPublic: false,
          price: 479,
          monthlyPrice: 67,
          duration: "18 semanas",
          totalStudents: 298,
          rating: 4.8,
          totalModules: 15,
          monthlyRevenue: 6780,
          description: "Técnicas avanzadas de carpintería y ebanistería",
        },
        {
          id: "soldadura",
          name: "Soldadura Profesional",
          slug: "soldadura",
          category: "profesional",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300",
          isActive: true,
          isPublic: false,
          price: 459,
          monthlyPrice: 65,
          duration: "16 semanas",
          totalStudents: 367,
          rating: 4.7,
          totalModules: 13,
          monthlyRevenue: 8120,
          description: "Curso completo de soldadura industrial y artística",
        },
        {
          id: "mecanica-automovil",
          name: "Mecánica del Automóvil",
          slug: "mecanica-automovil",
          category: "profesional",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300",
          isActive: true,
          isPublic: false,
          price: 529,
          monthlyPrice: 75,
          duration: "20 semanas",
          totalStudents: 523,
          rating: 4.9,
          totalModules: 16,
          monthlyRevenue: 11250,
          description:
            "Formación completa en mecánica y reparación de vehículos",
        },
        {
          id: "panaderia-pasteleria",
          name: "Panadería y Pastelería",
          slug: "panaderia-pasteleria",
          category: "profesional",
          level: "Intermedio",
          image:
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300",
          isActive: true,
          isPublic: false,
          price: 399,
          monthlyPrice: 59,
          duration: "16 semanas",
          totalStudents: 678,
          rating: 4.8,
          totalModules: 14,
          monthlyRevenue: 9890,
          description: "Arte de la panadería y pastelería profesional",
        },
        {
          id: "desarrollo-web",
          name: "Desarrollo Web Full Stack",
          slug: "desarrollo-web",
          category: "tecnologia",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300",
          isActive: true,
          isPublic: false,
          price: 599,
          monthlyPrice: 89,
          duration: "24 semanas",
          totalStudents: 1456,
          rating: 4.9,
          totalModules: 20,
          monthlyRevenue: 23450,
          description: "Desarrollo web completo frontend y backend",
        },
        {
          id: "data-science",
          name: "Data Science y Analytics",
          slug: "data-science",
          category: "tecnologia",
          level: "Experto",
          image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300",
          isActive: true,
          isPublic: false,
          price: 679,
          monthlyPrice: 99,
          duration: "26 semanas",
          totalStudents: 892,
          rating: 4.8,
          totalModules: 22,
          monthlyRevenue: 18670,
          description: "Análisis de datos y machine learning avanzado",
        },
        {
          id: "ciberseguridad",
          name: "Ciberseguridad Avanzada",
          slug: "ciberseguridad",
          category: "tecnologia",
          level: "Experto",
          image:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300",
          isActive: true,
          isPublic: false,
          price: 729,
          monthlyPrice: 109,
          duration: "28 semanas",
          totalStudents: 634,
          rating: 4.9,
          totalModules: 24,
          monthlyRevenue: 16780,
          description: "Seguridad informática y ethical hacking",
        },
        {
          id: "frances-avanzado",
          name: "Francés Avanzado",
          slug: "frances-avanzado",
          category: "idiomas",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=300",
          isActive: true,
          isPublic: false,
          price: 349,
          monthlyPrice: 52,
          duration: "14 semanas",
          totalStudents: 567,
          rating: 4.6,
          totalModules: 12,
          monthlyRevenue: 8890,
          description: "Francés para nivel avanzado y profesional",
        },
        {
          id: "aleman-negocios",
          name: "Alemán para Negocios",
          slug: "aleman-negocios",
          category: "idiomas",
          level: "Intermedio",
          image:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300",
          isActive: true,
          isPublic: false,
          price: 379,
          monthlyPrice: 56,
          duration: "15 semanas",
          totalStudents: 423,
          rating: 4.5,
          totalModules: 13,
          monthlyRevenue: 7340,
          description: "Alemán especializado para entornos empresariales",
        },
        {
          id: "contabilidad-avanzada",
          name: "Contabilidad Avanzada",
          slug: "contabilidad-avanzada",
          category: "negocios",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300",
          isActive: true,
          isPublic: false,
          price: 459,
          monthlyPrice: 68,
          duration: "18 semanas",
          totalStudents: 789,
          rating: 4.7,
          totalModules: 15,
          monthlyRevenue: 13450,
          description: "Contabilidad financiera y análisis empresarial",
        },
        {
          id: "recursos-humanos",
          name: "Gestión de Recursos Humanos",
          slug: "recursos-humanos",
          category: "negocios",
          level: "Intermedio",
          image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300",
          isActive: true,
          isPublic: false,
          price: 399,
          monthlyPrice: 59,
          duration: "16 semanas",
          totalStudents: 912,
          rating: 4.6,
          totalModules: 14,
          monthlyRevenue: 14780,
          description: "Gestión integral de talento y recursos humanos",
        },
        {
          id: "psicologia-clinica",
          name: "Psicología Clínica",
          slug: "psicologia-clinica",
          category: "salud",
          level: "Experto",
          image:
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300",
          isActive: true,
          isPublic: false,
          price: 649,
          monthlyPrice: 95,
          duration: "24 semanas",
          totalStudents: 456,
          rating: 4.9,
          totalModules: 20,
          monthlyRevenue: 12340,
          description: "Psicología clínica y terapéutica avanzada",
        },
        {
          id: "nutricion-deportiva",
          name: "Nutrición Deportiva",
          slug: "nutricion-deportiva",
          category: "salud",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300",
          isActive: true,
          isPublic: false,
          price: 429,
          monthlyPrice: 63,
          duration: "17 semanas",
          totalStudents: 634,
          rating: 4.7,
          totalModules: 15,
          monthlyRevenue: 10890,
          description: "Nutrición especializada para atletas y deportistas",
        },
        {
          id: "enfermeria-intensivos",
          name: "Enfermería de Cuidados Intensivos",
          slug: "enfermeria-intensivos",
          category: "salud",
          level: "Experto",
          image:
            "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300",
          isActive: true,
          isPublic: false,
          price: 579,
          monthlyPrice: 85,
          duration: "22 semanas",
          totalStudents: 345,
          rating: 4.8,
          totalModules: 18,
          monthlyRevenue: 8670,
          description: "Especialización en cuidados intensivos y urgencias",
        },
        {
          id: "fotografia-profesional",
          name: "Fotografía Profesional",
          slug: "fotografia-profesional",
          category: "arte",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300",
          isActive: true,
          isPublic: false,
          price: 449,
          monthlyPrice: 66,
          duration: "18 semanas",
          totalStudents: 723,
          rating: 4.8,
          totalModules: 16,
          monthlyRevenue: 12450,
          description: "Técnicas avanzadas de fotografía comercial y artística",
        },
        {
          id: "arquitectura-3d",
          name: "Arquitectura y Diseño 3D",
          slug: "arquitectura-3d",
          category: "arte",
          level: "Avanzado",
          image:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300",
          isActive: true,
          isPublic: false,
          price: 529,
          monthlyPrice: 78,
          duration: "20 semanas",
          totalStudents: 456,
          rating: 4.7,
          totalModules: 17,
          monthlyRevenue: 9890,
          description: "Diseño arquitectónico y modelado 3D profesional",
        },
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setEditDialogOpen(true);
  };

  const handleManageCurriculum = (course: Course) => {
    setSelectedCourse(course);
    setCurriculumDialogOpen(true);
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      Básico: "bg-green-500/20 text-green-400",
      Intermedio: "bg-blue-500/20 text-blue-400",
      Avanzado: "bg-orange-500/20 text-orange-400",
      Experto: "bg-red-500/20 text-red-400",
    };

    return (
      <Badge className={colors[level as keyof typeof colors] || colors.Básico}>
        {level}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-400"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-64 mb-4"></div>
            <div className="h-96 bg-slate-700 rounded"></div>
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
              Gestión de Cursos
            </h1>
            <p className="text-slate-400">
              Administrar cursos profesionales y contenido educativo
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-blue-500/20 text-blue-400">
              {courses.length} cursos totales
            </Badge>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Curso
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Cursos Activos</p>
                  <p className="text-2xl font-bold text-green-400">
                    {courses.filter((c) => c.isActive).length}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-green-400 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    Total Estudiantes
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {courses.reduce((sum, c) => sum + c.totalStudents, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-400 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Rating Promedio</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {(
                      courses.reduce((sum, c) => sum + c.rating, 0) /
                      courses.length
                    ).toFixed(1)}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-400 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    Ingresos Mensuales
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(
                      courses.reduce((sum, c) => sum + c.monthlyRevenue, 0),
                    )}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-64 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5" />
              Lista de Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Curso</TableHead>
                  <TableHead className="text-slate-300">Categoría</TableHead>
                  <TableHead className="text-slate-300">Nivel</TableHead>
                  <TableHead className="text-slate-300">Estudiantes</TableHead>
                  <TableHead className="text-slate-300">Rating</TableHead>
                  <TableHead className="text-slate-300">Precio</TableHead>
                  <TableHead className="text-slate-300">Ingresos/Mes</TableHead>
                  <TableHead className="text-slate-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} className="border-slate-700">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={course.image}
                          alt={course.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">
                            {course.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {course.duration} • {course.totalModules} módulos
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-700 text-slate-300">
                        {categories.find((c) => c.value === course.category)
                          ?.label || course.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getLevelBadge(course.level)}</TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-white font-medium">
                          {course.totalStudents}
                        </div>
                        <div className="text-xs text-slate-400">
                          estudiantes
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(course.rating)}
                        <span className="text-white text-sm ml-1">
                          {course.rating}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-white">
                          {formatCurrency(course.monthlyPrice)}/mes
                        </div>
                        <div className="text-xs text-slate-400">
                          {formatCurrency(course.price)} total
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {formatCurrency(course.monthlyRevenue)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditCourse(course)}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          title="Editar Curso"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleManageCurriculum(course)}
                          className="border-blue-600 text-blue-400 hover:bg-blue-700"
                          title="Gestionar Temario"
                        >
                          <FileText className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(`/curriculum/${course.id}`, "_blank")
                          }
                          className="border-green-600 text-green-400 hover:bg-green-700"
                          title="Vista Previa Pública"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Curriculum Management Dialog */}
        <Dialog
          open={curriculumDialogOpen}
          onOpenChange={setCurriculumDialogOpen}
        >
          <DialogContent className="bg-slate-800 border-slate-700 max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                Gestión de Temario - {selectedCourse?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Administrar curriculum y archivos PDF por temas
              </DialogDescription>
            </DialogHeader>

            {selectedCourse && (
              <CurriculumManagement
                assistantId={selectedCourse.id}
                assistantName={selectedCourse.name}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
