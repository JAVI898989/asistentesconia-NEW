import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Gavel,
  DollarSign,
  Heart,
  BookOpen,
  Globe,
  Car,
  Users,
  Crown,
  Clock,
  CheckCircle,
  Building,
  Microscope,
  GraduationCap,
  Languages,
  Briefcase,
  Search,
} from "lucide-react";
import Header from "@/components/Header";

interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ThemeTests {
  themeId: string;
  themeName: string;
  tests: TestQuestion[];
}

interface Assistant {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced" | "expert";
  image: string;
  features: string[];
  isPublic?: boolean;
  isPro?: boolean;
}

const assistants: Assistant[] = [
  // 1. Administración General del Estado
  {
    id: "auxiliar-administrativo-estado",
    name: "Auxiliar Administrativo del Estado",
    description:
      "Preparación completa para el cuerpo de Auxiliares Administrativos del Estado",
    category: "administracion",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su tem��tica",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "administrativo-estado",
    name: "Administrativo del Estado",
    description: "Preparación para el cuerpo de Administrativos de la AGE",
    category: "administracion",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "gestion-administracion-civil",
    name: "Gesti��n de la Administración Civil",
    description: "Preparación para Técnico Administrativo superior de la AGE",
    category: "administracion",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "tecnicos-hacienda",
    name: "Técnicos de Hacienda",
    description: "Preparación completa para Técnicos de Hacienda",
    category: "administracion",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "administradores-civiles-estado",
    name: "Cuerpo Superior de Administradores Civiles del Estado",
    description:
      "Preparación para el cuerpo superior más prestigioso de la administración",
    category: "administracion",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "agentes-hacienda-publica",
    name: "Agentes de la Hacienda Pública",
    description: "Preparaci����n para Agentes de la Hacienda P��blica",
    category: "administracion",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "tecnicos-auditoria-contabilidad",
    name: "Técnicos de Auditoría y Contabilidad",
    description: "Preparación para Técnicos de Auditoría y Contabilidad",
    category: "administracion",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // 2. Justicia y Ministerio Fiscal
  {
    id: "auxilio-judicial",
    name: "Auxilio Judicial",
    description: "Preparación completa para el cuerpo de Auxilio Judicial",
    category: "justicia",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "tramitacion-procesal",
    name: "Tramitación Procesal",
    description: "Preparación para el cuerpo de Tramitación Procesal",
    category: "justicia",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "gestion-procesal",
    name: "Gestión Procesal",
    description: "Preparación para el cuerpo de Gestión Procesal",
    category: "justicia",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "judicatura",
    name: "Judicatura",
    description: "Preparaci��n para acceso a la carrera judicial",
    category: "justicia",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "fiscalia",
    name: "Fiscalía",
    description: "Preparación para acceso a la carrera fiscal",
    category: "justicia",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivaci��n, Progreso",
    ],
  },
  {
    id: "abogacia-estado",
    name: "Abogacía del Estado",
    description: "Preparación para el cuerpo de Abogados del Estado",
    category: "justicia",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "notarias",
    name: "Notarías",
    description: "Preparación para acceso al cuerpo de Notarios",
    category: "justicia",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "registro-propiedad",
    name: "Registro de la Propiedad",
    description: "Preparación para Registradores de la Propiedad",
    category: "justicia",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "secretarios-judiciales",
    name: "Cuerpo de Secretarios Judiciales",
    description: "Preparación para Secretarios Judiciales",
    category: "justicia",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "medicina-legal",
    name: "Instituto de Medicina Legal",
    description: "Preparación para el Instituto de Medicina Legal",
    category: "justicia",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // 3. Hacienda / Economía
  {
    id: "intervencion-general-estado",
    name: "Intervención General del Estado",
    description: "Preparación para Interventores y Auditores del Estado",
    category: "hacienda",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivaci��n, Progreso",
    ],
  },
  {
    id: "inspeccion-hacienda",
    name: "Inspección de Hacienda",
    description: "Preparación para Inspectores de Hacienda del Estado",
    category: "hacienda",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "cnmv-tecnicos",
    name: "CNMV – Técnicos",
    description: "Preparación para Técnicos de la CNMV",
    category: "hacienda",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "banco-espana-tecnicos",
    name: "Banco de España – Técnicos",
    description: "Preparación para Técnicos del Banco de España",
    category: "hacienda",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "tecnicos-seguridad-social",
    name: "Técnicos de Seguridad Social",
    description: "Preparaci��n para Técnicos de la Seguridad Social",
    category: "hacienda",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "inspectores-hacienda-superior",
    name: "Cuerpo Superior de Inspectores de Hacienda",
    description:
      "Preparación para el Cuerpo Superior de Inspectores de Hacienda",
    category: "hacienda",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // 4. Sanidad
  {
    id: "auxiliar-enfermeria",
    name: "Auxiliar de Enfermería",
    description: "Preparación para Auxiliar de Enfermería",
    category: "sanidad",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "enfermeria-eir",
    name: "Enfermería (EIR)",
    description: "Preparación para el EIR - Enfermero Interno Residente",
    category: "sanidad",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "celador",
    name: "Celador",
    description: "Preparación para Celador hospitalario",
    category: "sanidad",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "tecnico-laboratorio",
    name: "Técnico de Laboratorio",
    description: "Preparación para Técnico Superior en Laboratorio Clínico",
    category: "sanidad",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "tecnico-farmacia",
    name: "Técnico de Farmacia",
    description: "Preparación para Técnico en Farmacia y Parafarmacia",
    category: "sanidad",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "tecnico-rayos",
    name: "Técnico de Rayos",
    description:
      "Preparación para Técnico Superior en Imagen para el Diagnóstico",
    category: "sanidad",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "mir",
    name: "Médico Interno Residente (MIR)",
    description: "Preparación para el MIR - Médico Interno Residente",
    category: "sanidad",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "pir",
    name: "Psicólogo Interno Residente (PIR)",
    description: "Preparación para el PIR - Psicólogo Interno Residente",
    category: "sanidad",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    description: "Preparación para oposiciones de Fisioterapia",
    category: "sanidad",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "matrona",
    name: "Matrona",
    description: "Preparación para oposiciones de Matrona",
    category: "sanidad",
    difficulty: "advanced",
    image:
      "https://cdn.pixabay.com/photo/2017/07/02/19/24/baby-2468008_1280.jpg",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // 5. Fuerzas y Cuerpos de Seguridad
  {
    id: "guardia-civil",
    name: "Guardia Civil",
    description: "Preparación completa para el cuerpo de la Guardia Civil",
    category: "seguridad",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1591996378284-7c60e2bb6f9e?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "policia-nacional",
    name: "Policía Nacional",
    description: "Preparación para el Cuerpo Nacional de Policía",
    category: "seguridad",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "policia-local",
    name: "Policía Local",
    description: "Preparación para Policía Local",
    category: "seguridad",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "mossos-esquadra",
    name: "Mossos d'Esquadra",
    description: "Preparación para los Mossos d'Esquadra",
    category: "seguridad",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "ertzaintza",
    name: "Ertzaintza",
    description: "Preparación para la Ertzaintza",
    category: "seguridad",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "bomberos",
    name: "Bomberos",
    description: "Preparación para el cuerpo de Bomberos",
    category: "seguridad",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pesta��as: Motivación, Progreso",
    ],
  },

  // 6. Ciencia / Ingeniería
  {
    id: "ingenieros-estado",
    name: "Cuerpo de Ingenieros del Estado",
    description: "Preparación para el Cuerpo de Ingenieros del Estado",
    category: "ciencia",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "arquitectos-estado",
    name: "Cuerpo de Arquitectos del Estado",
    description: "Preparación para el Cuerpo de Arquitectos del Estado",
    category: "ciencia",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "meteorologia",
    name: "Meteorología",
    description: "Preparación para oposiciones de Meteorología",
    category: "ciencia",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "instituto-geografico",
    name: "Instituto Geográfico Nacional",
    description: "Preparación para el Instituto Geográfico Nacional",
    category: "ciencia",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // 7. Educación - Solo Estudiantes (eliminados profesores individuales)
  {
    id: "estudiante-primaria",
    name: "Asistente para Alumnos de Primaria",
    description:
      "Asistente especializado para estudiantes de Educación Primaria",
    category: "educacion",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat funcional especializado",
      "Ayuda con tareas y dudas",
      "Explicaciones adaptadas a su nivel",
      "Apoyo en todas las materias",
    ],
  },
  {
    id: "estudiante-eso",
    name: "Asistente para Alumnos de ESO",
    description: "Asistente especializado para estudiantes de ESO",
    category: "educacion",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat funcional especializado",
      "Ayuda con tareas y dudas",
      "Explicaciones adaptadas a su nivel",
      "Apoyo en todas las materias",
    ],
  },
  {
    id: "estudiante-bachillerato",
    name: "Asistente para Alumnos de Bachillerato",
    description: "Asistente especializado para estudiantes de Bachillerato",
    category: "educacion",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat funcional especializado",
      "Ayuda con tareas y dudas",
      "Explicaciones adaptadas a su nivel",
      "Apoyo en todas las materias",
    ],
  },
  {
    id: "estudiante-fp",
    name: "Asistente para Alumnos de Formación Profesional",
    description: "Asistente especializado para estudiantes de FP",
    category: "educacion",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat funcional especializado",
      "Ayuda con tareas y dudas",
      "Explicaciones adaptadas a su nivel",
      "Apoyo en todas las materias",
    ],
  },
  {
    id: "estudiante-universitario",
    name: "Asistente para Alumnos Universitarios",
    description: "Asistente especializado para estudiantes universitarios",
    category: "educacion",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat funcional especializado",
      "Ayuda con tareas y dudas",
      "Explicaciones adaptadas a su nivel",
      "Apoyo en todas las materias",
    ],
  },

  // 8. Idiomas (Unión Europea)
  {
    id: "idioma-ingles",
    name: "Inglés",
    description: "Preparación para exámenes oficiales de inglés UE",
    category: "idiomas",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "idioma-frances",
    name: "Francés",
    description: "Preparación para exámenes oficiales de francés UE",
    category: "idiomas",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "idioma-aleman",
    name: "Alemán",
    description: "Preparación para exámenes oficiales de alemán UE",
    category: "idiomas",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // Correos y Telecomunicaciones
  {
    id: "correos",
    name: "Asistente de Correos",
    description: "Preparación para oposiciones de Correos y Telégrafos",
    category: "correos",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "tecnico-comunicaciones",
    name: "Asistente de Técnico de Comunicaciones",
    description: "Preparación para Técnico de Comunicaciones",
    category: "correos",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "atencion-cliente-postal",
    name: "Asistente de Atención al Cliente Postal",
    description: "Preparación para Atención al Cliente en servicios postales",
    category: "correos",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // Ferroviario y Transporte
  {
    id: "renfe",
    name: "Asistente de RENFE",
    description: "Preparación para oposiciones de RENFE",
    category: "ferroviario",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivaci��n, Progreso",
    ],
  },
  {
    id: "transporte-metropolitano",
    name: "Asistente de Transporte Metropolitano",
    description: "Preparación para Metro y transporte urbano",
    category: "ferroviario",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "trafico-aereo",
    name: "Asistente de Tráfico Aéreo",
    description: "Preparación para Controlador Aéreo",
    category: "ferroviario",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // Servicios Auxiliares
  {
    id: "conserje-portero",
    name: "Asistente de Conserje / Portero",
    description: "Preparación para oposiciones de Conserje y Portero",
    category: "servicios",
    difficulty: "basic",
    image:
      "https://cdn.pixabay.com/photo/2017/08/12/10/16/building-2634238_1280.jpg",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "limpieza",
    name: "Asistente de Limpieza",
    description: "Preparación para oposiciones de Personal de Limpieza",
    category: "servicios",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pesta��as: Motivación, Progreso",
    ],
  },
  {
    id: "vigilancia-seguridad",
    name: "Asistente de Vigilancia y Seguridad",
    description: "Preparación para Vigilante de Seguridad",
    category: "servicios",
    difficulty: "basic",
    image:
      "https://cdn.pixabay.com/photo/2017/08/07/19/45/security-2607746_1280.jpg",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // Justicia Autonómica
  {
    id: "tramitacion-procesal-autonomica",
    name: "Asistente de Tramitación Procesal Autonómica",
    description:
      "Preparación para Tramitación Procesal en comunidades autónomas",
    category: "autonomica",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "gestion-procesal-autonomica",
    name: "Asistente de Gestión Procesal Autonómica",
    description: "Preparación para Gestión Procesal en comunidades autónomas",
    category: "autonomica",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "auxilio-judicial-autonomico",
    name: "Asistente de Auxilio Judicial Autonómico",
    description: "Preparaci��n para Auxilio Judicial en comunidades autónomas",
    category: "autonomica",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // Ejército
  {
    id: "tropa-marineria",
    name: "Asistente de Acceso a Tropa y Marinería",
    description: "Preparación para acceso a Tropa y Marinería",
    category: "ejercito",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "suboficiales",
    name: "Asistente de Acceso a Suboficiales",
    description: "Preparación para acceso a Suboficiales del Ejército",
    category: "ejercito",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1572088075715-78d1dac157fb?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "oficiales",
    name: "Asistente de Acceso a Oficiales",
    description: "Preparación para acceso a Oficiales del Ejército",
    category: "ejercito",
    difficulty: "advanced",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // 9. Carnets de Conducir
  {
    id: "carnet-b",
    name: "Carnet B",
    description: "Preparación completa para el carnet de conducir B",
    category: "carnets",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "carnet-a",
    name: "Carnet A (moto)",
    description: "Preparación para el carnet de moto",
    category: "carnets",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pesta��as: Motivación, Progreso",
    ],
  },
  {
    id: "carnet-c",
    name: "Carnet C (camión)",
    description: "Preparación para el carnet de camión",
    category: "carnets",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "carnet-d",
    name: "Carnet D (autobús)",
    description: "Preparación para el carnet de autobús",
    category: "carnets",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },
  {
    id: "cap",
    name: "CAP (transporte profesional)",
    description: "Preparación para el Certificado de Aptitud Profesional",
    category: "carnets",
    difficulty: "intermediate",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop&crop=center",
    features: [
      "Chat limitado a su temática",
      "Temario por temas",
      "Tests (30 por tema + 30 generales)",
      "Flashcards (20 por tema)",
      "Pestañas: Motivación, Progreso",
    ],
  },

  // 10. Asistentes Públicos (para uso general)
  {
    id: "legal-general",
    name: "Asistente Legal General",
    description: "Asistente para consultas legales generales",
    category: "publico",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&h=600&fit=crop&crop=center",
    features: [
      "Solo chat funcional",
      "Accesible para todo el mundo",
      "Consultas legales generales",
      "Sin bloqueo por pago",
    ],
    isPublic: true,
  },
  {
    id: "nutricion-deporte",
    name: "Asistente de Nutrición y Deporte",
    description: "Asistente especializado en nutrición y ejercicio físico",
    category: "publico",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&crop=center",
    features: [
      "Solo chat funcional",
      "Accesible para todo el mundo",
      "Consejos de nutrición y ejercicio",
      "Sin bloqueo por pago",
    ],
    isPublic: true,
  },
  {
    id: "bienestar-emocional",
    name: "Asistente de Bienestar Emocional",
    description:
      "Asistente de apoyo emocional general (con texto legal obligatorio)",
    category: "publico",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop&crop=center",
    features: [
      "Solo chat funcional",
      "Accesible para todo el mundo",
      "Texto legal obligatorio incluido",
      "Sin bloqueo por pago",
    ],
    isPublic: true,
  },
  {
    id: "burocracia-tramites",
    name: "Asistente de Burocracia y Trámites",
    description: "Asistente para trámites y gestiones burocráticas",
    category: "publico",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop&crop=center",
    features: [
      "Solo chat funcional",
      "Accesible para todo el mundo",
      "Ayuda con trámites administrativos",
      "Sin bloqueo por pago",
    ],
    isPublic: true,
  },
  {
    id: "laboral-basico",
    name: "Asistente Laboral Básico",
    description: "Asistente para consultas laborales y de empleo",
    category: "publico",
    difficulty: "basic",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop&crop=center",
    features: [
      "Solo chat funcional",
      "Accesible para todo el mundo",
      "Consultas sobre derechos laborales",
      "Sin bloqueo por pago",
    ],
    isPublic: true,
  },

  // Asistentes PRO (Próximamente en Fase 2)
  {
    id: "nutricionista-pro",
    name: "Nutricionista PRO",
    description:
      "Asistente especializado para profesionales de la nutrición con IA avanzada",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de documentos",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA adaptada al sector nutricional",
    ],
    isPro: true,
  },
  {
    id: "psicologo-coach-pro",
    name: "Psicólogo / Coach PRO",
    description:
      "Para profesionales de la psicología y coaching con funciones avanzadas",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de documentos",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en psicología",
    ],
    isPro: true,
  },
  {
    id: "abogado-pro",
    name: "Abogado PRO",
    description:
      "Especializado en servicios legales y jurídicos con IA avanzada",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de documentos legales",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en derecho",
    ],
    isPro: true,
  },
  {
    id: "entrenador-personal-pro",
    name: "Entrenador Personal PRO",
    description:
      "Para profesionales del fitness y entrenamiento con herramientas avanzadas",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de rutinas personalizadas",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA adaptada al fitness",
    ],
    isPro: true,
  },
  {
    id: "esteticista-pro",
    name: "Esteticista / Centro de Belleza PRO",
    description: "Especializado en estética y tratamientos de belleza",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de documentos",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en estética",
    ],
    isPro: true,
  },
  {
    id: "veterinario-pro",
    name: "Veterinario PRO",
    description: "Para clínicas veterinarias y profesionales de animales",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de informes veterinarios",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en veterinaria",
    ],
    isPro: true,
  },
  {
    id: "fisioterapeuta-pro",
    name: "Fisioterapeuta PRO",
    description: "Especializado en fisioterapia y rehabilitación",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de planes de tratamiento",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en fisioterapia",
    ],
    isPro: true,
  },
  {
    id: "preparador-selectividad-pro",
    name: "Preparador de Selectividad PRO",
    description: "Para academias y preparadores de EBAU/Selectividad",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de exámenes personalizados",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en educación",
    ],
    isPro: true,
  },
  {
    id: "clinicas-medicas-pro",
    name: "Clínicas médicas privadas PRO",
    description: "Para centros médicos y clínicas privadas",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de informes médicos",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en medicina",
    ],
    isPro: true,
  },
  {
    id: "arquitecto-interiorista-pro",
    name: "Arquitecto / Interiorista PRO",
    description: "Especializado en arquitectura y diseño de interiores",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de proyectos",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en diseño",
    ],
    isPro: true,
  },
  {
    id: "community-manager-pro",
    name: "Community Manager / Agencia de Marketing PRO",
    description: "Para agencias de marketing y community managers",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de contenido",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en marketing",
    ],
    isPro: true,
  },
  {
    id: "profesor-idiomas-pro",
    name: "Profesor de idiomas PRO",
    description: "Especializado en enseñanza de idiomas",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de lecciones personalizadas",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en idiomas",
    ],
    isPro: true,
  },
  {
    id: "podologo-pro",
    name: "Podólogo PRO",
    description: "Para profesionales de podología",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de informes podológicos",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en podología",
    ],
    isPro: true,
  },
  {
    id: "asesor-fiscal-pro",
    name: "Asesor Fiscal / Gestoría PRO",
    description: "Especializado en asesoría fiscal y gestoría",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de documentos fiscales",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en fiscalidad",
    ],
    isPro: true,
  },
  {
    id: "musicoterapeuta-pro",
    name: "Musicoterapeuta PRO",
    description: "Para profesionales de musicoterapia",
    category: "pro",
    difficulty: "expert",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&crop=center",
    features: [
      "Generación de sesiones terapéuticas",
      "Gestión de facturas",
      "Subida de archivos del cliente",
      "IA especializada en musicoterapia",
    ],
    isPro: true,
  },
];

const categories = [
  { id: "todos", name: "Todos", icon: BookOpen },
  {
    id: "administracion",
    name: "Administración General Del Estado",
    icon: Building,
  },
  { id: "justicia", name: "Justicia Y Ministerio Fiscal", icon: Gavel },
  { id: "hacienda", name: "Hacienda Y Seguridad Social", icon: DollarSign },
  { id: "seguridad", name: "Cuerpos Y Fuerzas De Seguridad", icon: Shield },
  { id: "sanidad", name: "Sanidad", icon: Heart },
  { id: "educacion", name: "Educación", icon: GraduationCap },
  { id: "correos", name: "Correos Y Telecomunicaciones", icon: Globe },
  { id: "ferroviario", name: "Ferroviario Y Transporte", icon: Car },
  { id: "servicios", name: "Servicios Auxiliares", icon: Users },
  { id: "autonomica", name: "Justicia Autonómica", icon: Gavel },
  { id: "ejercito", name: "Ejército", icon: Shield },
  { id: "idiomas", name: "Idiomas", icon: Languages },
  { id: "ciencia", name: "Ciencia / Ingeniería", icon: Microscope },
  { id: "carnets", name: "Carnets de Conducir", icon: Car },
  {
    id: "publico",
    name: "Asistentes Públicos (para uso general)",
    icon: Users,
  },
  {
    id: "pro",
    name: "Asistentes PRO (Próximamente)",
    icon: Crown,
  },
];

const getPriceByDifficulty = (difficulty: string) => {
  const prices = {
    basic: { founder: 16, normal: 48 },
    intermediate: { founder: 18, normal: 54 },
    advanced: { founder: 20, normal: 60 },
    expert: { founder: 22, normal: 66 },
  };
  return prices[difficulty as keyof typeof prices] || prices.basic;
};

export default function Assistants() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [billingCycle, setBillingCycle] = useState<{
    [key: string]: "monthly" | "annual";
  }>({});
  const [assistantsWithCustomImages, setAssistantsWithCustomImages] = useState<Assistant[]>(assistants);

  // Load custom images from localStorage on component mount
  useEffect(() => {
    const loadCustomImages = () => {
      const updatedAssistants = assistants.map(assistant => {
        const customImageKey = `assistant_image_${assistant.id}`;
        const customImage = localStorage.getItem(customImageKey);
        return customImage ? { ...assistant, image: customImage } : assistant;
      });
      setAssistantsWithCustomImages(updatedAssistants);
    };

    loadCustomImages();

    // Listen for storage changes to update images in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('assistant_image_')) {
        loadCustomImages();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredAssistants = assistantsWithCustomImages.filter((assistant) => {
    // Filter by category
    const matchesCategory = activeCategory === "todos" || assistant.category === activeCategory;

    // Filter by search query
    const matchesSearch = searchQuery === "" ||
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getPrice = (
    assistant: Assistant,
    isFounder: boolean,
    cycle: "monthly" | "annual",
  ) => {
    if (assistant.isPublic) {
      // Fixed pricing for public assistants
      if (cycle === "annual") {
        return isFounder ? 100 : 300;
      } else {
        return isFounder ? 10 : 30;
      }
    } else {
      // Calculated pricing for private assistants
      const prices = getPriceByDifficulty(assistant.difficulty);
      const basePrice = isFounder ? prices.founder : prices.normal;
      return cycle === "annual" ? Math.floor(basePrice * 10) : basePrice;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Asistentes IA Especializados
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Elige tu asistente especializado y comienza tu preparación
            personalizada para las oposiciones
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar asistente por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <div className="mb-8 overflow-x-auto">
            <TabsList className="flex flex-wrap gap-2 h-auto p-2 bg-muted/50 justify-center">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs px-3 py-2 whitespace-nowrap"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-8">
            {filteredAssistants.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg mb-2">
                  No se han encontrado asistentes con ese nombre
                </div>
                <p className="text-sm text-muted-foreground">
                  Intenta con otro término de búsqueda o selecciona una categoría diferente
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssistants.map((assistant) => {
                const currentCycle = billingCycle[assistant.id] || "monthly";
                const founderPrice = getPrice(assistant, true, currentCycle);
                const normalPrice = getPrice(assistant, false, currentCycle);

                return (
                  <Card
                    key={assistant.id}
                    className="bg-card border-border overflow-hidden group hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={assistant.image}
                        alt={assistant.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-orange-500 text-white font-medium">
                          <Crown className="w-3 h-3 mr-1" />
                          Fundador
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {categories.find((c) => c.id === assistant.category)
                            ?.name || "General"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {assistant.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {assistant.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Billing Toggle */}
                      {!assistant.isPublic && !assistant.isPro && (
                        <div className="flex items-center justify-center">
                          <div className="flex bg-muted rounded-lg p-1">
                            <button
                              onClick={() =>
                                setBillingCycle((prev) => ({
                                  ...prev,
                                  [assistant.id]: "monthly",
                                }))
                              }
                              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                currentCycle === "monthly"
                                  ? "bg-blue-500 text-white"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Mensual
                            </button>
                            <button
                              onClick={() =>
                                setBillingCycle((prev) => ({
                                  ...prev,
                                  [assistant.id]: "annual",
                                }))
                              }
                              className={`px-4 py-2 text-sm rounded-md transition-colors relative ${
                                currentCycle === "annual"
                                  ? "bg-blue-500 text-white"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Anual
                              {currentCycle === "annual" && (
                                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1">
                                  -17%
                                </Badge>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Pricing */}
                      {!assistant.isPublic && !assistant.isPro && (
                        <div className="space-y-3">
                          {/* Founder Price */}
                          <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-green-400">
                                Precio fundador
                              </span>
                              <span className="text-xs text-green-300">
                                (precio base)
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-400">
                                {founderPrice}€
                              </div>
                              <div className="text-xs text-green-300">
                                /{currentCycle === "monthly" ? "mes" : "año"}
                              </div>
                            </div>
                          </div>

                          {/* Normal Price */}
                          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-blue-400">
                                Precio normal
                              </span>
                              <span className="text-xs text-blue-300">
                                (triple del fundador)
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-400">
                                {normalPrice}€
                              </div>
                              <div className="text-xs text-blue-300">
                                /{currentCycle === "monthly" ? "mes" : "año"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Public Assistant Notice */}
                      {assistant.isPublic && (
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Asistente Público
                            </span>
                          </div>
                          <p className="text-xs text-blue-300">
                            Accesible para todo el mundo. Cualquier usuario
                            podrá ver el chat, pero no podrá interactuar hasta
                            pagar o ser administrador.
                          </p>
                        </div>
                      )}

                      {/* PRO Assistant Notice */}
                      {assistant.isPro && (
                        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                          <div className="flex items-center gap-2 text-yellow-400 mb-2">
                            <Crown className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Asistente PRO
                            </span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-yellow-300">
                              <strong>Próximamente en la Fase 2</strong>
                            </p>
                            <p className="text-xs text-yellow-200">
                              Este asistente estará disponible en la Fase 2. Si
                              deseas ser fundador, contacta con el administrador
                              o reserva tu plaza desde el panel.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="space-y-3">
                        {assistant.isPro ? (
                          <Button
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
                            disabled
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Próximamente en la Fase 2
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
                            asChild
                          >
                            <Link to={`/asistente/${assistant.id}`}>
                              <Crown className="w-4 h-4 mr-2" />
                              {assistant.isPublic
                                ? `Desde ${founderPrice}€/mes • Ver Precios`
                                : "Oferta activa: Precio Fundador"}
                            </Link>
                          </Button>
                        )}

                        {assistant.isPublic && (
                          <div className="text-center space-y-1">
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <Crown className="w-3 h-3 text-yellow-500" />
                              <span>
                                Fundadores:{" "}
                                {getPrice(assistant, true, "monthly")}€/mes •
                                Generales:{" "}
                                {getPrice(assistant, false, "monthly")}€/mes
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <DollarSign className="w-3 h-3" />
                              <span>Descuento anual: Solo pagas 10 meses</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="w-3 h-3" />
                              <span>
                                Acceso completo • Chat IA • Tests • Flashcards
                              </span>
                            </div>
                          </div>
                        )}

                        {!assistant.isPublic && !assistant.isPro && (
                          <div className="text-center space-y-1">
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>
                                ESO o equivalente, 16-65 años, nacionalidad
                                española
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <DollarSign className="w-3 h-3" />
                              <span>1.500€/mes iniciales</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                Próximo examen:{" "}
                                {currentCycle === "monthly"
                                  ? "Marzo 2025"
                                  : "Mayo 2025"}
                              </span>
                            </div>
                          </div>
                        )}

                        {!assistant.isPro && (
                          <Button variant="outline" className="w-full" asChild>
                            <Link to={`/asistente/${assistant.id}`}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Ver Plantilla
                            </Link>
                          </Button>
                        )}

                        {assistant.isPublic && (
                          <div className="text-center">
                            <p className="text-xs text-blue-400 font-medium">
                              💎 Asistente Premium • Suscripción mensual o anual
                            </p>
                          </div>
                        )}

                        {!assistant.isPublic && !assistant.isPro && (
                          <div className="text-center">
                            <p className="text-xs text-orange-400 font-medium">
                              ⭐ Oferta limitada para los primeros 200
                              fundadores del sistema!
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <div className="pt-4 border-t border-border">
                        <h4 className="text-sm font-medium mb-2">Incluye:</h4>
                        <ul className="space-y-1">
                          {assistant.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {filteredAssistants.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay asistentes en esta categoría
            </h3>
            <p className="text-muted-foreground">
              Selecciona otra categoría para ver los asistentes disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
