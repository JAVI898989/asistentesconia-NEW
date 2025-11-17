import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { checkIsCurrentUserAdmin } from "@/lib/firebaseData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  ArrowLeft,
  Download,
  Clock,
  Users,
  Target,
  CheckCircle,
  GraduationCap,
  FileText,
  Award,
  Star,
  Calendar,
  MessageCircle,
  FileQuestion,
  Zap,
  Trophy,
} from "lucide-react";
import Header from "@/components/Header";
import Chat from "@/components/Chat";

interface CourseData {
  name: string;
  subtitle: string;
  image: string;
  category: string;
  difficulty: string;
  duration: string;
  modalidad: string;
  certification: string;
  price: string;
}

interface TemaPDF {
  id: string;
  titulo: string;
  descripcion: string;
  pdfUrl: string;
  duracion: string;
  icono: string;
}

export default function TemarioAcademicoSimple() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Flashcards state
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  // Authentication check
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      setUser(user);

      if (user) {
        try {
          const adminStatus = await checkIsCurrentUserAdmin();
          if (isMounted) {
            setIsAdmin(adminStatus);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          if (isMounted) {
            setIsAdmin(false);
          }
        }
      } else {
        if (isMounted) {
          setIsAdmin(false);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Verificar que courseId existe
  if (!courseId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            ID de curso no encontrado
          </h1>
          <p className="text-slate-400 mb-6">
            No se ha proporcionado un ID de curso válido.
          </p>
          <Button onClick={() => navigate("/cursos")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a cursos
          </Button>
        </div>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState("temario");
  const [selectedTema, setSelectedTema] = useState<string | null>(null);
  const [pdfContent, setPdfContent] = useState<string>("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfCache, setPdfCache] = useState<Record<string, string>>({});

  // Datos del curso - simplificados y funcionales
  const courseData: Record<string, CourseData> = {
    "programador-desde-cero": {
      name: "Curso Profesional de Programación desde Cero",
      subtitle: "Desarrollo de Software y Aplicaciones Web",
      image: "💻",
      category: "Tecnología",
      difficulty: "Intermedio",
      duration: "240 horas académicas",
      modalidad: "Online con tutorías",
      certification: "Certificado Profesional de Programador",
      price: "200€",
    },
    "auxiliar-veterinaria": {
      name: "Curso Profesional de Auxiliar de Veterinaria",
      subtitle: "Asistencia Sanitaria en Clínicas Veterinarias",
      image: "🐕",
      category: "Sanidad Animal",
      difficulty: "Intermedio",
      duration: "180 horas académicas",
      modalidad: "Online con prácticas presenciales",
      certification: "Certificado Profesional de Auxiliar de Veterinaria",
      price: "180€",
    },
    "peluqueria-profesional": {
      name: "Curso Profesional de Peluquería",
      subtitle: "Técnicas de Corte, Peinado y Estilismo",
      image: "✂️",
      category: "Belleza",
      difficulty: "Básico",
      duration: "120 horas académicas",
      modalidad: "Online con talleres prácticos",
      certification: "Certificado Profesional de Peluquería",
      price: "80€",
    },
    veterinaria: {
      name: "Curso Profesional de Veterinaria",
      subtitle: "Medicina y Cirugía Veterinaria",
      image: "🐾",
      category: "Sanidad Animal",
      difficulty: "Avanzado",
      duration: "300 horas académicas",
      modalidad: "Online con prácticas presenciales",
      certification: "Certificado Profesional de Veterinaria",
      price: "350€",
    },
    psicologo: {
      name: "Curso Profesional de Psicología",
      subtitle: "Psicología Clínica y Terapéutica",
      image: "🧠",
      category: "Salud Mental",
      difficulty: "Avanzado",
      duration: "250 horas académicas",
      modalidad: "Online con supervisión clínica",
      certification: "Certificado Profesional de Psicología",
      price: "280€",
    },
    "nutricion-deporte": {
      name: "Curso Profesional de Nutrición Deportiva",
      subtitle: "Alimentación y Rendimiento Deportivo",
      image: "🥗",
      category: "Salud y Deporte",
      difficulty: "Intermedio",
      duration: "180 horas académicas",
      modalidad: "Online con talleres prácticos",
      certification: "Certificado Profesional de Nutrición Deportiva",
      price: "220€",
    },
    enfermeria: {
      name: "Curso Profesional de Enfermería",
      subtitle: "Cuidados Sanitarios y Atención al Paciente",
      image: "🏥",
      category: "Sanidad",
      difficulty: "Avanzado",
      duration: "280 horas académicas",
      modalidad: "Online con prácticas hospitalarias",
      certification: "Certificado Profesional de Enfermería",
      price: "320€",
    },
    administracion: {
      name: "Curso Profesional de Administración",
      subtitle: "Gestión Administrativa y Empresarial",
      image: "📊",
      category: "Administración",
      difficulty: "Intermedio",
      duration: "200 horas académicas",
      modalidad: "Online con casos prácticos",
      certification: "Certificado Profesional de Administración",
      price: "180€",
    },
  };

  // Flashcards data for courses
  const courseFlashcards: Record<
    string,
    Array<{
      id: number;
      front: string;
      back: string;
      category: string;
      difficulty: string;
    }>
  > = {
    "programador-desde-cero": [
      {
        id: 1,
        front: "¿Qué es HTML?",
        back: "HyperText Markup Language - Lenguaje de marcado para crear páginas web",
        category: "HTML",
        difficulty: "easy",
      },
      {
        id: 2,
        front: "¿Qué significa CSS?",
        back: "Cascading Style Sheets - Hojas de estilo para diseñar páginas web",
        category: "CSS",
        difficulty: "easy",
      },
      {
        id: 3,
        front: "¿Qué es JavaScript?",
        back: "Lenguaje de programación para crear interactividad en páginas web",
        category: "JavaScript",
        difficulty: "easy",
      },
      {
        id: 4,
        front: "¿Qué es React?",
        back: "Librería de JavaScript para construir interfaces de usuario",
        category: "React",
        difficulty: "medium",
      },
      {
        id: 5,
        front: "¿Qué es Node.js?",
        back: "Entorno de ejecución de JavaScript en el servidor",
        category: "Backend",
        difficulty: "medium",
      },
      {
        id: 6,
        front: "¿Qué es una API?",
        back: "Application Programming Interface - Interfaz para comunicar aplicaciones",
        category: "Backend",
        difficulty: "medium",
      },
      {
        id: 7,
        front: "¿Qué es una base de datos?",
        back: "Sistema para almacenar, organizar y recuperar información",
        category: "Bases de Datos",
        difficulty: "easy",
      },
      {
        id: 8,
        front: "¿Qué es Git?",
        back: "Sistema de control de versiones para gestionar código fuente",
        category: "Herramientas",
        difficulty: "easy",
      },
      {
        id: 9,
        front: "¿Qué es responsive design?",
        back: "Diseño web que se adapta a diferentes tamaños de pantalla",
        category: "CSS",
        difficulty: "medium",
      },
      {
        id: 10,
        front: "¿Qué es DOM?",
        back: "Document Object Model - Representación en memoria del HTML",
        category: "JavaScript",
        difficulty: "medium",
      },
      {
        id: 11,
        front: "¿Qué es un framework?",
        back: "Estructura predefinida que facilita el desarrollo de aplicaciones",
        category: "Conceptos",
        difficulty: "easy",
      },
      {
        id: 12,
        front: "¿Qué es debugging?",
        back: "Proceso de encontrar y corregir errores en el código",
        category: "Desarrollo",
        difficulty: "easy",
      },
      {
        id: 13,
        front: "¿Qué es MVC?",
        back: "Modelo-Vista-Controlador - Patrón de arquitectura de software",
        category: "Arquitectura",
        difficulty: "hard",
      },
      {
        id: 14,
        front: "¿Qué es un algoritmo?",
        back: "Secuencia de pasos lógicos para resolver un problema",
        category: "Programación",
        difficulty: "easy",
      },
      {
        id: 15,
        front: "¿Qué es el deployment?",
        back: "Proceso de publicar una aplicación en un servidor de producción",
        category: "DevOps",
        difficulty: "medium",
      },
    ],
    "auxiliar-veterinaria": [
      {
        id: 1,
        front: "¿Cuál es la temperatura normal de un perro?",
        back: "38-39°C (100.4-102.2°F)",
        category: "Fisiología",
        difficulty: "easy",
      },
      {
        id: 2,
        front: "¿Qué es la esterilización?",
        back: "Proceso para eliminar todos los microorganismos y esporas",
        category: "Higiene",
        difficulty: "easy",
      },
      {
        id: 3,
        front: "¿Cuántos dientes tiene un perro adulto?",
        back: "42 dientes (20 superiores, 22 inferiores)",
        category: "Anatomía",
        difficulty: "medium",
      },
      {
        id: 4,
        front: "¿Qué es una zoonosis?",
        back: "Enfermedad transmisible de animales a humanos",
        category: "Patología",
        difficulty: "medium",
      },
      {
        id: 5,
        front: "¿Cuál es la frecuencia cardíaca normal de un gato?",
        back: "120-140 latidos por minuto",
        category: "Fisiología",
        difficulty: "medium",
      },
      {
        id: 6,
        front: "¿Qué significa anestesia general?",
        back: "Estado de inconsciencia reversible con pérdida de sensibilidad",
        category: "Farmacología",
        difficulty: "medium",
      },
      {
        id: 7,
        front: "¿Qué es la radiografía?",
        back: "Técnica de imagen usando rayos X para ver estructuras internas",
        category: "Diagnóstico",
        difficulty: "easy",
      },
      {
        id: 8,
        front: "¿Cuándo se debe vacunar un cachorro?",
        back: "A partir de las 6-8 semanas de edad",
        category: "Prevención",
        difficulty: "easy",
      },
      {
        id: 9,
        front: "¿Qué es la castración?",
        back: "Extirpación quirúrgica de las gónadas (testículos u ovarios)",
        category: "Cirugía",
        difficulty: "easy",
      },
      {
        id: 10,
        front: "¿Qué es taquicardia?",
        back: "Frecuencia cardíaca anormalmente alta",
        category: "Patología",
        difficulty: "medium",
      },
      {
        id: 11,
        front: "¿Qué alimentos son tóxicos para perros?",
        back: "Chocolate, uvas, cebolla, ajo, xilitol",
        category: "Toxicología",
        difficulty: "medium",
      },
      {
        id: 12,
        front: "¿Qué es la sujeción animal?",
        back: "Técnicas para inmovilizar de forma segura al animal",
        category: "Manejo",
        difficulty: "easy",
      },
      {
        id: 13,
        front: "¿Qué es un hemograma?",
        back: "Análisis de sangre que cuenta y clasifica las células sanguíneas",
        category: "Laboratorio",
        difficulty: "medium",
      },
      {
        id: 14,
        front: "¿Qué es la desparasitación?",
        back: "Tratamiento para eliminar parásitos internos y externos",
        category: "Prevención",
        difficulty: "easy",
      },
      {
        id: 15,
        front: "¿Qué es la eutanasia?",
        back: "Procedimiento para provocar muerte sin sufrimiento por razones médicas",
        category: "Ética",
        difficulty: "hard",
      },
    ],
    "peluqueria-profesional": [
      {
        id: 1,
        front: "¿Qué es la colorimetría?",
        back: "Ciencia que estudia los colores y su aplicación en el cabello",
        category: "Colorimetría",
        difficulty: "easy",
      },
      {
        id: 2,
        front: "¿Cuáles son los colores primarios?",
        back: "Rojo, azul y amarillo",
        category: "Colorimetría",
        difficulty: "easy",
      },
      {
        id: 3,
        front: "¿Qué es un corte en capas?",
        back: "Técnica de corte que crea diferentes longitudes para dar volumen",
        category: "Técnicas de Corte",
        difficulty: "medium",
      },
      {
        id: 4,
        front: "¿Para qué se usa la tijera dentada?",
        back: "Para desenfilar y crear textura en el cabello",
        category: "Herramientas",
        difficulty: "easy",
      },
      {
        id: 5,
        front: "¿Qué es la decoloración?",
        back: "Proceso químico que elimina el pigmento natural del cabello",
        category: "Colorimetría",
        difficulty: "medium",
      },
    ],
    veterinaria: [
      {
        id: 1,
        front: "¿Cuál es la temperatura corporal normal de un caballo?",
        back: "37.5-38.5°C",
        category: "Fisiología",
        difficulty: "medium",
      },
      {
        id: 2,
        front: "¿Qué es la anestesia epidural?",
        back: "Anestesia regional que se aplica en el espacio epidural",
        category: "Anestesia",
        difficulty: "hard",
      },
      {
        id: 3,
        front: "¿Cuántas cámaras tiene el corazón de un ave?",
        back: "4 cámaras (2 aurículas y 2 ventrículos)",
        category: "Anatomía",
        difficulty: "medium",
      },
      {
        id: 4,
        front: "¿Qué es la mastitis?",
        back: "Inflamación de la glándula mamaria",
        category: "Patología",
        difficulty: "easy",
      },
      {
        id: 5,
        front: "¿Cuál es el período de gestación de una vaca?",
        back: "Aproximadamente 9 meses (280 días)",
        category: "Reproducción",
        difficulty: "easy",
      },
    ],
    psicologo: [
      {
        id: 1,
        front: "¿Qué es la terapia cognitivo-conductual?",
        back: "Terapia que combina técnicas cognitivas y conductuales para cambiar pensamientos y comportamientos",
        category: "Terapias",
        difficulty: "medium",
      },
      {
        id: 2,
        front: "¿Qué es la depresión mayor?",
        back: "Trastorno del estado de ánimo caracterizado por tristeza persistente",
        category: "Trastornos",
        difficulty: "easy",
      },
      {
        id: 3,
        front: "¿Qué mide el test de Rorschach?",
        back: "Aspectos de la personalidad a través de manchas de tinta",
        category: "Evaluación",
        difficulty: "medium",
      },
      {
        id: 4,
        front: "¿Qué es la inteligencia emocional?",
        back: "Capacidad de reconocer y gestionar emociones propias y ajenas",
        category: "Psicología Positiva",
        difficulty: "easy",
      },
      {
        id: 5,
        front: "¿Qué es la esquizofrenia?",
        back: "Trastorno mental crónico que afecta pensamiento, percepción y comportamiento",
        category: "Trastornos",
        difficulty: "hard",
      },
    ],
    "nutricion-deporte": [
      {
        id: 1,
        front:
          "¿Cuántos gramos de proteína por kg de peso necesita un deportista?",
        back: "1.2-2.0 gramos por kg de peso corporal",
        category: "Proteínas",
        difficulty: "medium",
      },
      {
        id: 2,
        front: "¿Qué es la creatina?",
        back: "Suplemento que mejora la potencia y fuerza en ejercicios de alta intensidad",
        category: "Suplementación",
        difficulty: "easy",
      },
      {
        id: 3,
        front: "¿Cuándo se debe consumir carbohidratos post-entreno?",
        back: "Dentro de los primeros 30-60 minutos después del ejercicio",
        category: "Timing Nutricional",
        difficulty: "medium",
      },
      {
        id: 4,
        front: "¿Qué son los BCAA?",
        back: "Aminoácidos de cadena ramificada (leucina, isoleucina, valina)",
        category: "Suplementación",
        difficulty: "medium",
      },
      {
        id: 5,
        front: "¿Cuál es la hidratación recomendada durante el ejercicio?",
        back: "150-250ml cada 15-20 minutos durante el ejercicio",
        category: "Hidratación",
        difficulty: "medium",
      },
    ],
    enfermeria: [
      {
        id: 1,
        front: "¿Qué es la asepsia?",
        back: "Conjunto de procedimientos para prevenir la contaminación microbiana",
        category: "Higiene",
        difficulty: "easy",
      },
      {
        id: 2,
        front: "¿Cuáles son los signos vitales básicos?",
        back: "Temperatura, pulso, tensión arterial y frecuencia respiratoria",
        category: "Signos Vitales",
        difficulty: "easy",
      },
      {
        id: 3,
        front: "¿Qué es la vía intramuscular?",
        back: "Vía de administración de medicamentos directamente en el músculo",
        category: "Farmacología",
        difficulty: "medium",
      },
      {
        id: 4,
        front: "¿Cuál es la frecuencia cardíaca normal en adultos?",
        back: "60-100 latidos por minuto",
        category: "Signos Vitales",
        difficulty: "easy",
      },
      {
        id: 5,
        front: "¿Qué es el shock anafiláctico?",
        back: "Reacción alérgica grave y potencialmente mortal",
        category: "Emergencias",
        difficulty: "hard",
      },
    ],
    administracion: [
      {
        id: 1,
        front: "¿Qué es la contabilidad?",
        back: "Sistema de registro y control de las operaciones económicas de una empresa",
        category: "Contabilidad",
        difficulty: "easy",
      },
      {
        id: 2,
        front: "¿Qué es el balance de situación?",
        back: "Estado financiero que muestra el patrimonio de la empresa en un momento dado",
        category: "Contabilidad",
        difficulty: "medium",
      },
      {
        id: 3,
        front: "¿Qué es la nómina?",
        back: "Documento que recoge la liquidación de salarios de los trabajadores",
        category: "Recursos Humanos",
        difficulty: "easy",
      },
      {
        id: 4,
        front: "¿Qué es el IVA?",
        back: "Impuesto sobre el Valor Añadido que grava el consumo",
        category: "Fiscalidad",
        difficulty: "easy",
      },
      {
        id: 5,
        front: "¿Qué es un organigrama?",
        back: "Representación gráfica de la estructura organizacional de una empresa",
        category: "Organización",
        difficulty: "easy",
      },
    ],
  };

  const course = courseData[courseId];

  // Validar que el curso existe
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Curso no encontrado
          </h1>
          <p className="text-slate-400 mb-6">
            El curso "{courseId}" no existe o no está disponible.
          </p>
          <Button onClick={() => navigate("/cursos")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a cursos
          </Button>
        </div>
      </div>
    );
  }

  // Temas con PDFs por curso
  const temasConPDFs: Record<string, TemaPDF[]> = {
    "auxiliar-veterinaria": [
      {
        id: "tema1",
        titulo: "Tema 1: Anatomía Animal",
        descripcion:
          "Estudio completo de la anatomía de perros, gatos y animales exóticos",
        pdfUrl: "/pdfs/tema1-anatomia.html",
        duracion: "45 min",
        icono: "🦴",
      },
      {
        id: "tema2",
        titulo: "Tema 2: Nutrición Animal",
        descripcion:
          "Principios de nutrición y dietética para diferentes especies",
        pdfUrl: "/pdfs/tema2-nutricion.html",
        duracion: "40 min",
        icono: "🥘",
      },
      {
        id: "tema3",
        titulo: "Tema 3: Farmacología Veterinaria",
        descripcion:
          "Medicamentos, dosis y administración en medicina veterinaria",
        pdfUrl: "/pdfs/tema3-farmaco.html",
        duracion: "50 min",
        icono: "💊",
      },
      {
        id: "tema4",
        titulo: "Tema 4: Técnicas de Laboratorio",
        descripcion: "Análisis clínicos y técnicas de diagnóstico veterinario",
        pdfUrl: "/pdfs/tema1-anatomia.html",
        duracion: "35 min",
        icono: "🔬",
      },
      {
        id: "tema5",
        titulo: "Tema 5: Cirugía Básica",
        descripcion: "Asistencia en procedimientos quirúrgicos veterinarios",
        pdfUrl: "/pdfs/tema2-nutricion.html",
        duracion: "60 min",
        icono: "🏥",
      },
    ],
    "programador-desde-cero": [
      {
        id: "tema1",
        titulo: "Tema 1: Fundamentos de Programación",
        descripcion: "Conceptos básicos, algoritmos y lógica de programación",
        pdfUrl: "/pdfs/programacion-fundamentos.html",
        duracion: "55 min",
        icono: "💻",
      },
      {
        id: "tema2",
        titulo: "Tema 2: HTML5 y CSS3 Avanzado",
        descripcion: "Estructura web semántica y diseño responsive profesional",
        pdfUrl: "/pdfs/html-css-avanzado.html",
        duracion: "60 min",
        icono: "🌐",
      },
      {
        id: "tema3",
        titulo: "Tema 3: JavaScript Moderno",
        descripcion: "Sintaxis ES6+, DOM y programación asíncrona",
        pdfUrl: "/pdfs/javascript-moderno.html",
        duracion: "65 min",
        icono: "🟨",
      },
      {
        id: "tema4",
        titulo: "Tema 4: React Framework",
        descripcion: "Componentes, hooks y desarrollo de SPAs",
        pdfUrl: "/pdfs/react-framework.html",
        duracion: "70 min",
        icono: "⚛️",
      },
      {
        id: "tema5",
        titulo: "Tema 5: Backend con Node.js",
        descripcion: "Servidor, APIs REST, autenticación y bases de datos",
        pdfUrl: "/pdfs/nodejs-backend.html",
        duracion: "75 min",
        icono: "🟢",
      },
      {
        id: "tema6",
        titulo: "Tema 6: Bases de Datos",
        descripcion: "MongoDB, diseño de esquemas y operaciones CRUD",
        pdfUrl: "/pdfs/bases-datos.html",
        duracion: "50 min",
        icono: "🗄️",
      },
      {
        id: "tema7",
        titulo: "Tema 7: Despliegue y DevOps",
        descripcion: "Git, Docker, CI/CD y despliegue en producción",
        pdfUrl: "/pdfs/devops-deploy.html",
        duracion: "45 min",
        icono: "🚀",
      },
      {
        id: "tema8",
        titulo: "Tema 8: Proyecto Final Full Stack",
        descripcion: "Aplicación completa con frontend React y backend Node.js",
        pdfUrl: "/pdfs/proyecto-final.html",
        duracion: "90 min",
        icono: "🎯",
      },
    ],
    "peluqueria-profesional": [
      {
        id: "tema1",
        titulo: "Tema 1: Técnicas de Corte",
        descripcion: "Fundamentos del corte de cabello y uso de herramientas",
        pdfUrl: "/pdfs/tema1-anatomia.html",
        duracion: "40 min",
        icono: "✂️",
      },
      {
        id: "tema2",
        titulo: "Tema 2: Colorimetría",
        descripcion: "Teoría del color y técnicas de tinturado profesional",
        pdfUrl: "/pdfs/tema2-nutricion.html",
        duracion: "45 min",
        icono: "🎨",
      },
      {
        id: "tema3",
        titulo: "Tema 3: Peinados y Estilismo",
        descripcion: "Creación de peinados para diferentes ocasiones",
        pdfUrl: "/pdfs/tema3-farmaco.html",
        duracion: "50 min",
        icono: "💇‍♀️",
      },
    ],
    veterinaria: [
      {
        id: "tema1",
        titulo: "Tema 1: Anatomía Veterinaria Avanzada",
        descripcion: "Anatomía comparada de especies domésticas y exóticas",
        pdfUrl: "/pdfs/tema1-anatomia.html",
        duracion: "60 min",
        icono: "🦴",
      },
      {
        id: "tema2",
        titulo: "Tema 2: Patología Clínica",
        descripcion: "Diagnóstico y tratamiento de enfermedades animales",
        pdfUrl: "/pdfs/tema2-nutricion.html",
        duracion: "75 min",
        icono: "🔬",
      },
      {
        id: "tema3",
        titulo: "Tema 3: Cirugía Veterinaria",
        descripcion: "Técnicas quirúrgicas y procedimientos especializados",
        pdfUrl: "/pdfs/tema3-farmaco.html",
        duracion: "80 min",
        icono: "🏥",
      },
    ],
    psicologo: [
      {
        id: "tema1",
        titulo: "Tema 1: Psicología Clínica",
        descripcion: "Fundamentos de la evaluación y diagnóstico psicológico",
        pdfUrl: "/pdfs/tema1-anatomia.html",
        duracion: "55 min",
        icono: "🧠",
      },
      {
        id: "tema2",
        titulo: "Tema 2: Terapias Psicológicas",
        descripcion: "Técnicas terapéuticas y modelos de intervención",
        pdfUrl: "/pdfs/tema2-nutricion.html",
        duracion: "65 min",
        icono: "💭",
      },
      {
        id: "tema3",
        titulo: "Tema 3: Psicopatología",
        descripcion: "Trastornos mentales y criterios diagnósticos",
        pdfUrl: "/pdfs/tema3-farmaco.html",
        duracion: "70 min",
        icono: "📋",
      },
    ],
    "nutricion-deporte": [
      {
        id: "tema1",
        titulo: "Tema 1: Nutrición Deportiva",
        descripcion: "Macronutrientes y micronutrientes para el rendimiento",
        pdfUrl: "/pdfs/tema1-anatomia.html",
        duracion: "50 min",
        icono: "🥗",
      },
      {
        id: "tema2",
        titulo: "Tema 2: Suplementación",
        descripcion: "Suplementos deportivos y ayudas ergogénicas",
        pdfUrl: "/pdfs/tema2-nutricion.html",
        duracion: "45 min",
        icono: "💊",
      },
      {
        id: "tema3",
        titulo: "Tema 3: Planificación Nutricional",
        descripcion: "Diseño de planes alimentarios para deportistas",
        pdfUrl: "/pdfs/tema3-farmaco.html",
        duracion: "55 min",
        icono: "📊",
      },
    ],
    enfermeria: [
      {
        id: "tema1",
        titulo: "Tema 1: Cuidados Básicos",
        descripcion: "Fundamentos de enfermería y atención al paciente",
        pdfUrl: "/pdfs/tema1-anatomia.html",
        duracion: "60 min",
        icono: "🏥",
      },
      {
        id: "tema2",
        titulo: "Tema 2: Farmacología",
        descripcion: "Administración de medicamentos y farmacovigilancia",
        pdfUrl: "/pdfs/tema2-nutricion.html",
        duracion: "55 min",
        icono: "💉",
      },
      {
        id: "tema3",
        titulo: "Tema 3: Urgencias y Emergencias",
        descripcion: "Atención en situaciones críticas y primeros auxilios",
        pdfUrl: "/pdfs/tema3-farmaco.html",
        duracion: "65 min",
        icono: "🚨",
      },
    ],
    administracion: [
      {
        id: "tema1",
        titulo: "Tema 1: Gestión Administrativa",
        descripcion: "Fundamentos de la administración y organización",
        pdfUrl: "/pdfs/tema1-anatomia.html",
        duracion: "50 min",
        icono: "📊",
      },
      {
        id: "tema2",
        titulo: "Tema 2: Contabilidad Básica",
        descripcion: "Principios contables y gestión financiera",
        pdfUrl: "/pdfs/tema2-nutricion.html",
        duracion: "60 min",
        icono: "💰",
      },
      {
        id: "tema3",
        titulo: "Tema 3: Recursos Humanos",
        descripcion: "Gestión de personal y relaciones laborales",
        pdfUrl: "/pdfs/tema3-farmaco.html",
        duracion: "55 min",
        icono: "👥",
      },
    ],
  };

  const temasDelCurso = temasConPDFs[courseId] || [];

  // Función para cargar el contenido del PDF con cache
  const loadPdfContent = async (pdfUrl: string, temaId: string) => {
    // Si ya está en cache, cargar inmediatamente
    if (pdfCache[temaId]) {
      setPdfContent(pdfCache[temaId]);
      return;
    }

    setPdfLoading(true);
    try {
      const response = await fetch(pdfUrl);

      if (response.ok) {
        const htmlContent = await response.text();
        // Guardar en cache
        setPdfCache((prev) => ({ ...prev, [temaId]: htmlContent }));
        setPdfContent(htmlContent);
      } else {
        const errorContent = `
          <div style="padding: 40px; text-align: center; color: #333; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <h2 style="color: #dc2626; margin-bottom: 20px;">⚠️ Error al cargar el contenido</h2>
            <p style="margin-bottom: 10px;">No se pudo cargar el temario.</p>
            <p style="color: #6b7280; font-size: 14px;">Código de error: ${response.status}</p>
            <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Reintentar
            </button>
          </div>
        `;
        setPdfContent(errorContent);
      }
    } catch (error) {
      const errorContent = `
        <div style="padding: 40px; text-align: center; color: #333; background: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <h2 style="color: #dc2626; margin-bottom: 20px;">🔌 Error de conexión</h2>
          <p style="margin-bottom: 10px;">No se pudo conectar para cargar el temario.</p>
          <p style="color: #6b7280; font-size: 14px;">Verifica tu conexión a internet.</p>
          <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Reintentar
          </button>
        </div>
      `;
      setPdfContent(errorContent);
    }
    setPdfLoading(false);
  };

  // Cargar contenido cuando se selecciona un tema
  useEffect(() => {
    if (selectedTema) {
      const tema = temasDelCurso.find((t) => t.id === selectedTema);
      if (tema) {
        loadPdfContent(tema.pdfUrl, selectedTema);
      }
    } else {
      setPdfContent("");
      setPdfLoading(false);
    }
  }, [selectedTema, temasDelCurso, pdfCache]);

  // Temario extenso y detallado SIMPLIFICADO
  const temarioProgramacion = {
    objetivos: [
      "Dominar los fundamentos de la programación y la lógica computacional",
      "Aprender a desarrollar aplicaciones web modernas con tecnologías actuales",
      "Manejar bases de datos y sistemas de gestión de información",
      "Implementar buenas prácticas de desarrollo y metodologías ágiles",
      "Prepararse para el mercado laboral como programador junior",
    ],
    metodologia: [
      "Clases teóricas con ejemplos prácticos",
      "Ejercicios guiados paso a paso",
      "Proyectos reales de desarrollo",
      "Revisi��n de código y feedback personalizado",
      "Tutorías individuales y grupales",
    ],
    evaluacion: [
      "Exámenes teóricos por módulo (40%)",
      "Proyectos prácticos individuales (40%)",
      "Proyecto final integrador (20%)",
      "Nota mínima para aprobar: 7/10",
    ],
    modulos: [
      {
        numero: 1,
        titulo: "Fundamentos de Programación",
        horas: 40,
        descripcion:
          "Este m��dulo cubre los conceptos básicos de programación, desde qué es un programa hasta las estructuras de control fundamentales. Los estudiantes aprenderán a pensar de manera algorítmica y a resolver problemas de forma sistemática.",
        objetivos: [
          "Comprender qué es la programación y su importancia en el mundo actual",
          "Aprender los conceptos básicos de algoritmos y estructuras de datos",
          "Dominar la lógica de programación y resolución de problemas paso a paso",
          "Conocer los diferentes paradigmas de programación y sus aplicaciones",
        ],
        temas: [
          {
            numero: "1.1",
            titulo: "Introducción a la Programación",
            contenido: [
              "¿Qué es un programa de computadora? - Definición y conceptos básicos",
              "Historia y evolución de la programación - Desde los primeros computadores hasta hoy",
              "Lenguajes de programación: compilados vs interpretados - Diferencias y aplicaciones",
              "Entornos de desarrollo integrado (IDE) - Herramientas esenciales del programador",
              "Instalación y configuración del entorno de trabajo - Setup profesional",
            ],
            teoria:
              "Un programa de computadora es un conjunto de instrucciones escritas en un lenguaje específico que la computadora puede entender y ejecutar. Estas instrucciones deben ser precisas, lógicas y seguir una secuencia determinada para lograr el resultado deseado. La programación es tanto un arte como una ciencia, requiriendo creatividad para resolver problemas y precisión técnica para implementar soluciones.",
            ejemplos: [
              "Análisis de un programa simple 'Hola Mundo' en diferentes lenguajes",
              "Comparación entre código compilado (C++) y código interpretado (Python)",
              "Configuración paso a paso de Visual Studio Code con extensiones",
              "Creación del primer proyecto y estructura de archivos",
            ],
          },
          {
            numero: "1.2",
            titulo: "Algoritmos y Lógica de Programación",
            contenido: [
              "Conceptos de algoritmo y pseudocódigo - Planificación antes de programar",
              "Diagramas de flujo y representación gráfica - Visualización de la lógica",
              "Estructuras de control: secuencial, condicional, iterativa - Los tres pilares",
              "Resolución de problemas paso a paso - Metodología estructurada",
              "Ejercicios prácticos de l��gica - Desarrollo del pensamiento algorítmico",
            ],
            teoria:
              "Un algoritmo es una secuencia finita de instrucciones bien definidas para resolver un problema específico. El pseudocódigo nos permite planificar la lógica usando un lenguaje similar al natural, facilitando la posterior codificación. Los diagramas de flujo proporcionan una representación visual que ayuda a identificar errores lógicos antes de programar.",
            ejemplos: [
              "Algoritmo para preparar café: pasos detallados y ordenados",
              "Diagrama de flujo para determinar si un número es par o impar",
              "Pseudocódigo para calcular el promedio de calificaciones",
              "Resolución del problema clásico de las Torres de Hanoi",
            ],
          },
          {
            numero: "1.3",
            titulo: "Variables y Tipos de Datos",
            contenido: [
              "Concepto de variable y constante - Almacenamiento de información",
              "Tipos de datos primitivos: números, texto, booleanos - Bloques básicos",
              "Declaración e inicialización de variables - Sintaxis y buenas prácticas",
              "Operadores aritméticos, lógicos y de comparación - Manipulación de datos",
              "Conversión entre tipos de datos - Compatibilidad y casting",
            ],
            teoria:
              "Las variables son contenedores que almacenan datos en la memoria del programa. Cada variable tiene un nombre (identificador), un tipo de dato que determina qué operaciones se pueden realizar, y un valor que puede cambiar durante la ejecución. La elecci��n correcta del tipo de dato optimiza el uso de memoria y previene errores.",
            ejemplos: [
              "Declaración: int edad = 25; // Variable entera",
              "String nombre = 'Juan Pérez'; // Cadena de texto",
              "boolean esEstudiante = true; // Valor booleano",
              "Conversión: String.valueOf(25) → '25'",
            ],
          },
          {
            numero: "1.4",
            titulo: "Estructuras de Control",
            contenido: [
              "Condicionales: if, else, else if - Toma de decisiones en el código",
              "Bucles: for, while, do-while - Repetición controlada de instrucciones",
              "Estructuras de control anidadas - Lógica compleja y organizada",
              "Sentencias break y continue - Control de flujo avanzado",
              "Switch-case y su aplicación - Alternativa elegante a múltiples if",
            ],
            teoria:
              "Las estructuras de control dirigen el flujo de ejecución del programa. Los condicionales permiten ejecutar código basado en condiciones, los bucles repiten instrucciones mientras se cumpla una condición, y las estructuras anidadas combinan ambos para crear lógica sofisticada. El uso apropiado de estas estructuras es fundamental para crear programas eficientes.",
            ejemplos: [
              "if (edad >= 18) { acceso = 'permitido'; } else { acceso = 'denegado'; }",
              "for (int i = 1; i <= 10; i++) { suma += i; } // Suma números del 1 al 10",
              "while (usuario.quiereContinuar()) { procesarDatos(); }",
              "switch(dia) { case 'lunes': tareas = 5; break; }",
            ],
          },
        ],
        proyecto_modulo:
          "Desarrollo de una calculadora básica que implemente todas las estructuras de control aprendidas",
        evaluacion:
          "Examen teórico (50%) + Proyecto calculadora (30%) + Ejercicios prácticos (20%)",
      },
      {
        numero: 2,
        titulo: "JavaScript Moderno",
        horas: 50,
        descripcion:
          "Inmersión completa en JavaScript moderno, desde sintaxis básica hasta conceptos avanzados como programación asíncrona y manipulación del DOM. Este módulo prepara a los estudiantes para el desarrollo web profesional.",
        objetivos: [
          "Dominar la sintaxis completa de JavaScript ES6+",
          "Manejar el DOM y crear interfaces web interactivas",
          "Comprender y aplicar programación asíncrona",
          "Implementar conceptos de programación orientada a objetos",
        ],
        temas: [
          {
            numero: "2.1",
            titulo: "Sintaxis Básica de JavaScript",
            contenido: [
              "Historia y evolución de JavaScript - De simple script a lenguaje universal",
              "Configuración del entorno de desarrollo - Chrome DevTools y Node.js",
              "Variables: var, let, const - Diferencias y cuándo usar cada una",
              "Tipos de datos y conversiones - Dinámico vs estático",
              "Funciones: declaración, expresión y arrow functions - Múltiples sintaxis",
              "Scope, hoisting y closures - Conceptos avanzados de JavaScript",
            ],
            teoria:
              "JavaScript es un lenguaje dinámico e interpretado que ha evolucionado desde un simple lenguaje de scripting hasta convertirse en uno de los lenguajes más utilizados del mundo. Su flexibilidad permite múltiples paradigmas de programación y su ecosistema es extremadamente rico.",
            ejemplos: [
              "let edad = 25; const nombre = 'Ana'; var obsoleto = 'evitar';",
              "function saludar() { return 'Hola'; } // Declaración",
              "const saludar = () => 'Hola'; // Arrow function",
              "console.log(typeof '123'); // 'string'",
            ],
          },
          {
            numero: "2.2",
            titulo: "Estructuras de Datos en JavaScript",
            contenido: [
              "Arrays: métodos modernos y manipulación - map, filter, reduce",
              "Objetos: creación, propiedades y métodos - Programación orientada a objetos",
              "Destructuring de arrays y objetos - Sintaxis moderna y elegante",
              "Spread operator y rest parameters - Flexibilidad en funciones",
              "Map, Set y otras estructuras modernas - Alternativas a arrays y objetos",
            ],
            teoria:
              "JavaScript ofrece estructuras de datos flexibles y potentes. Los arrays y objetos son fundamentales, pero ES6+ introdujo nuevas estructuras como Map y Set que ofrecen ventajas específicas. El destructuring y spread operator hacen el código más limpio y expresivo.",
            ejemplos: [
              "const numeros = [1,2,3].map(n => n * 2); // [2,4,6]",
              "const {nombre, edad} = persona; // Destructuring",
              "const nuevo = {...objeto, propiedad: 'valor'}; // Spread",
              "const mapa = new Map([['clave', 'valor']]); // Map",
            ],
          },
        ],
        proyecto_modulo:
          "Aplicación web interactiva de lista de tareas con almacenamiento local",
        evaluacion:
          "Proyecto web (60%) + Examen de sintaxis (25%) + Ejercicios prácticos (15%)",
      },
      {
        numero: 3,
        titulo: "HTML5 y CSS3 Avanzado",
        horas: 45,
        descripcion:
          "Dominio completo de las tecnologías frontend fundamentales, incluyendo semántica HTML5, CSS Grid, Flexbox, animaciones y diseño responsive profesional.",
        objetivos: [
          "Crear estructuras HTML semánticas y accesibles",
          "Implementar layouts complejos con Grid y Flexbox",
          "Desarrollar diseños responsive para todos los dispositivos",
          "Aplicar animaciones y efectos visuales modernos",
        ],
        proyecto_modulo:
          "Sitio web corporativo completo responsive con animaciones",
        evaluacion: "Proyecto web completo (70%) + Examen teórico (30%)",
      },
      {
        numero: 4,
        titulo: "React y Desarrollo de SPAs",
        horas: 60,
        descripcion:
          "Desarrollo de aplicaciones de una sola página (SPA) usando React, incluyendo hooks, gestión de estado, routing y integración con APIs.",
        objetivos: [
          "Crear aplicaciones React desde cero",
          "Manejar estado local y global eficientemente",
          "Implementar routing y navegación",
          "Integrar APIs y manejar datos asíncronos",
        ],
        proyecto_modulo: "Aplicación web completa tipo e-commerce con React",
        evaluacion:
          "Aplicación React funcional (80%) + Documentación técnica (20%)",
      },
      {
        numero: 5,
        titulo: "Backend con Node.js y Bases de Datos",
        horas: 45,
        descripcion:
          "Desarrollo backend completo incluyendo APIs REST, autenticación, bases de datos y despliegue en producción.",
        objetivos: [
          "Crear APIs REST profesionales",
          "Implementar autenticación y autorización",
          "Diseñar y manejar bases de datos",
          "Desplegar aplicaciones en producción",
        ],
        proyecto_modulo: "API REST completa con autenticación y base de datos",
        evaluacion:
          "API funcional (70%) + Documentación (20%) + Despliegue (10%)",
      },
    ],
    proyecto_final: {
      titulo: "Aplicación Web Full Stack Completa",
      descripcion:
        "Desarrollo de una aplicación web completa que integre frontend React, backend Node.js, base de datos y despliegue en producción",
      duracion: "4 semanas",
      requisitos: [
        "Frontend desarrollado en React con al menos 8 componentes diferentes",
        "Backend con API REST completa en Node.js/Express",
        "Base de datos MongoDB con al menos 4 colecciones relacionadas",
        "Sistema de autenticación JWT con roles de usuario",
        "Diseño responsive y accesible (WCAG 2.1)",
        "Testing unitario con al menos 80% de cobertura",
        "Documentación técnica completa y README detallado",
        "Despliegue en plataforma cloud con CI/CD",
      ],
    },
  };

  // Si no se encuentra el curso, mostrar error
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Curso no encontrado
          </h1>
          <p className="text-slate-400 mb-6">
            El curso que buscas no existe o ha sido movido.
          </p>
          <Button onClick={() => navigate("/cursos")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a cursos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate("/cursos")}
            variant="outline"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a cursos
          </Button>

          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-8 border border-blue-500/30">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{course.image}</div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {course.name}
              </h1>
              <p className="text-xl text-blue-300 mb-4">{course.subtitle}</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge className="bg-blue-500/20 text-blue-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {course.difficulty}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400">
                  <Award className="w-3 h-3 mr-1" />
                  Certificado privado de formación
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* TABS PRINCIPALES */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border-slate-700 mb-8">
            <TabsTrigger value="temario" className="text-slate-300">
              <BookOpen className="w-4 h-4 mr-2" />
              Temario Completo
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-slate-300">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-slate-300">
              <FileQuestion className="w-4 h-4 mr-2" />
              Tests
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="text-slate-300">
              <Zap className="w-4 h-4 mr-2" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="progreso" className="text-slate-300">
              <Trophy className="w-4 h-4 mr-2" />
              Progreso
            </TabsTrigger>
          </TabsList>

          {/* TAB TEMARIO COMPLETO - VISOR DE PDFs */}
          <TabsContent value="temario" className="mt-6">
            <div className="space-y-6">
              {/* Header del Temario */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-3">
                    {course.image} Temario del Curso: {course.name}
                  </CardTitle>
                  <p className="text-slate-300">
                    Selecciona un tema para ver el contenido completo en formato
                    PDF
                  </p>
                </CardHeader>
              </Card>

              {/* Botones de Temas */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">
                    📚 Contenidos del Curso ({temasDelCurso.length} temas)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {temasDelCurso.map((tema) => (
                      <div
                        key={tema.id}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                          selectedTema === tema.id
                            ? "bg-blue-900/40 border-blue-500 shadow-lg"
                            : "bg-slate-700/30 border-slate-600 hover:border-blue-500/50 hover:bg-slate-700/50"
                        }`}
                        onClick={() => setSelectedTema(tema.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{tema.icono}</div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-sm mb-1">
                              {tema.titulo}
                            </h3>
                            <p className="text-slate-400 text-xs mb-2">
                              {tema.descripcion}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {tema.duracion}
                              </Badge>
                              {selectedTema === tema.id && (
                                <Badge className="bg-green-500/20 text-green-400 text-xs">
                                  ✓ Viendo
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedTema !== tema.id && (
                          <Button
                            size="sm"
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTema(tema.id);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Ver PDF
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Admin Panel - Preparado para futuras funcionalidades */}
                  <div className="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-purple-400 font-semibold">
                          Panel de Administración
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Gestión de PDFs del curso
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="border-purple-500 text-purple-300"
                        disabled
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Subir PDF (Próximamente)
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visor de PDF */}
              {selectedTema ? (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-xl">
                        📖{" "}
                        {
                          temasDelCurso.find((t) => t.id === selectedTema)
                            ?.titulo
                        }
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTema(null)}
                        className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      >
                        Cerrar PDF
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Info del PDF */}
                      <div className="bg-blue-900/20 p-3 rounded border-l-4 border-blue-500">
                        <p className="text-blue-300 text-sm">
                          📄 <strong>Contenido:</strong>{" "}
                          {
                            temasDelCurso.find((t) => t.id === selectedTema)
                              ?.descripcion
                          }
                        </p>
                        <p className="text-blue-300 text-sm mt-1">
                          ⏱️ <strong>Duración estimada:</strong>{" "}
                          {
                            temasDelCurso.find((t) => t.id === selectedTema)
                              ?.duracion
                          }
                        </p>
                      </div>

                      {/* Visor PDF Integrado */}
                      <div className="w-full relative">
                        {pdfContent ? (
                          <div
                            className="pdf-content border border-slate-300 rounded-lg overflow-auto shadow-lg"
                            dangerouslySetInnerHTML={{ __html: pdfContent }}
                            style={{
                              backgroundColor: "white",
                              minHeight: "600px",
                              maxHeight: "800px",
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-[600px] bg-slate-800 rounded-lg border border-slate-600">
                            <div className="text-center">
                              <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                              <p className="text-slate-400">
                                Selecciona un tema para ver el contenido del
                                temario
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Overlay de loading solo cuando sea necesario */}
                        {pdfLoading && !pdfContent && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 rounded-lg border border-slate-600">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                              <p className="text-slate-400">
                                Cargando temario...
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Small loading indicator for cached content */}
                        {pdfLoading && pdfContent && (
                          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                            Actualizando...
                          </div>
                        )}
                      </div>

                      {/* Controles adicionales */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-600">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              temasDelCurso.find((t) => t.id === selectedTema)
                                ?.pdfUrl,
                              "_blank",
                            )
                          }
                          className="bg-slate-700 border-slate-600 text-slate-300"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Abrir en nueva pestaña
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-700 border-slate-600 text-slate-300"
                          disabled
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Marcar como favorito
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-700 border-slate-600 text-slate-300"
                          disabled
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Compartir progreso
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Mensaje cuando no hay tema seleccionado */
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Selecciona un tema para comenzar
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Haz clic en cualquiera de los temas de arriba para ver su
                      contenido completo en formato PDF
                    </p>
                    <div className="flex justify-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">
                        📱 Responsive
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-400">
                        📖 Sin descarga
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400">
                        🔄 Actualizable
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* TAB CHAT IA */}
          <TabsContent value="chat" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  💬 Chat especializado en {course.name}
                </CardTitle>
                <div className="text-sm text-slate-400">
                  <p>Asistente IA específico para este curso</p>
                </div>
              </CardHeader>
              <CardContent>
                {user && (isAdmin || user) ? (
                  <Chat
                    assistantType={courseId || "curso"}
                    isAccessible={true}
                    userRole={isAdmin ? "admin" : "student"}
                  />
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">
                      Chat disponible solo para usuarios registrados
                    </h3>
                    <p className="text-orange-700 mb-4">
                      Regístrate y accede al curso para usar el chat
                      especializado en {course.name}
                    </p>
                    <Button
                      onClick={() => navigate("/login")}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Registrarse para acceder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB TESTS */}
          <TabsContent value="tests" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  📝 Tests y Evaluaciones por Módulo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {temarioProgramacion.modulos.map((modulo, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 p-4 rounded flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-white font-semibold">
                          Test Módulo {modulo.numero}: {modulo.titulo}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          20 preguntas • {modulo.horas} horas de contenido
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          // Start test for this module
                          console.log(
                            `Starting test for módulo ${modulo.numero}`,
                          );
                          // TODO: Implement test navigation
                        }}
                      >
                        Hacer Test
                      </Button>
                    </div>
                  ))}

                  {/* Final Exam Section */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Trophy className="h-6 w-6 text-yellow-600" />
                      <h3 className="text-xl font-semibold text-yellow-800">
                        Examen Final
                      </h3>
                    </div>
                    <p className="text-yellow-700 mb-4">
                      Complete todos los tests por módulo con nota mínima de
                      8/10 para desbloquear el examen final. Al aprobar el
                      examen final (mínimo 8/10), recibirás un certificado
                      personalizado.
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        disabled={true} // TODO: Implement logic to check completion
                        className="bg-gray-400 cursor-not-allowed text-white"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Examen Final (Bloqueado)
                      </Button>
                      <div className="text-sm text-yellow-600">
                        <span className="font-medium">Progreso: </span>
                        0/{temarioProgramacion?.modulos?.length || 0} módulos
                        completados con nota ≥ 8
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB FLASHCARDS */}
          <TabsContent value="flashcards" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  🃏 Flashcards - {course.name}
                </CardTitle>
                <div className="text-sm text-slate-400">
                  <p>
                    {courseFlashcards[courseId]?.length || 15} flashcards
                    disponibles • Conceptos clave del curso
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {courseFlashcards[courseId] ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-slate-400">
                        Tarjeta {currentCard + 1} de{" "}
                        {courseFlashcards[courseId].length}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-green-400 border-green-400"
                        >
                          {masteredCards.length} Dominadas
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-blue-400 border-blue-400"
                        >
                          {courseFlashcards[courseId][currentCard]?.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${
                            courseFlashcards[courseId][currentCard]
                              ?.difficulty === "easy"
                              ? "text-green-400 border-green-400"
                              : courseFlashcards[courseId][currentCard]
                                    ?.difficulty === "medium"
                                ? "text-yellow-400 border-yellow-400"
                                : "text-red-400 border-red-400"
                          }`}
                        >
                          {courseFlashcards[courseId][currentCard]
                            ?.difficulty === "easy"
                            ? "Fácil"
                            : courseFlashcards[courseId][currentCard]
                                  ?.difficulty === "medium"
                              ? "Medio"
                              : "Difícil"}
                        </Badge>
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        className={`w-full h-64 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg cursor-pointer transition-transform duration-500 preserve-3d ${
                          isFlipped ? "rotate-y-180" : ""
                        }`}
                        onClick={() => setIsFlipped(!isFlipped)}
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        }}
                      >
                        {/* Front of card */}
                        <div className="absolute inset-0 backface-hidden flex items-center justify-center p-6">
                          <div className="text-center">
                            <div className="text-2xl mb-4">❓</div>
                            <h3 className="text-white text-lg font-semibold">
                              {courseFlashcards[courseId][currentCard]?.front}
                            </h3>
                            <p className="text-blue-200 text-sm mt-4">
                              Haz clic para ver la respuesta
                            </p>
                          </div>
                        </div>

                        {/* Back of card */}
                        <div
                          className="absolute inset-0 backface-hidden flex items-center justify-center p-6 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg"
                          style={{ transform: "rotateY(180deg)" }}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-4">✅</div>
                            <h3 className="text-white text-lg font-semibold">
                              {courseFlashcards[courseId][currentCard]?.back}
                            </h3>
                            <p className="text-green-200 text-sm mt-4">
                              Haz clic para volver a la pregunta
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentCard((prev) => Math.max(0, prev - 1));
                          setIsFlipped(false);
                        }}
                        disabled={currentCard === 0}
                        className="border-slate-600 text-slate-300"
                      >
                        ← Anterior
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (
                              !masteredCards.includes(
                                courseFlashcards[courseId][currentCard].id,
                              )
                            ) {
                              setMasteredCards([
                                ...masteredCards,
                                courseFlashcards[courseId][currentCard].id,
                              ]);
                            }
                            setCurrentCard((prev) =>
                              prev < courseFlashcards[courseId].length - 1
                                ? prev + 1
                                : prev,
                            );
                            setIsFlipped(false);
                          }}
                          className="border-green-600 text-green-400"
                        >
                          ✓ Ya la sé
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentCard((prev) =>
                              prev < courseFlashcards[courseId].length - 1
                                ? prev + 1
                                : prev,
                            );
                            setIsFlipped(false);
                          }}
                          className="border-red-600 text-red-400"
                        >
                          ✗ Debo repasarla
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentCard((prev) =>
                            Math.min(
                              courseFlashcards[courseId].length - 1,
                              prev + 1,
                            ),
                          );
                          setIsFlipped(false);
                        }}
                        disabled={
                          currentCard === courseFlashcards[courseId].length - 1
                        }
                        className="border-slate-600 text-slate-300"
                      >
                        Siguiente →
                      </Button>
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={() => {
                          setCurrentCard(0);
                          setIsFlipped(false);
                          setMasteredCards([]);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        🔄 Reiniciar Flashcards
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">���</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Flashcards no disponibles
                    </h3>
                    <p className="text-slate-400">
                      Las flashcards para este curso estarán disponibles
                      próximamente.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB PROGRESO */}
          <TabsContent value="progreso" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  🏆 Progreso y Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-semibold mb-3">
                      Progreso General del Curso
                    </h3>
                    <div className="bg-slate-700/30 p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300">Progreso Total</span>
                        <span className="text-blue-400 font-semibold">0%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
