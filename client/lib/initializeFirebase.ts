import {
  initializeAssistantData,
  setAssistantTemario,
  AssistantTemario,
  TemarioTopic,
} from "./firebaseData";
import { generateBaseTemario } from "./temarioData";

// Complete list of all assistants with their categories and difficulties
const allAssistants = [
  // Administración General del Estado
  {
    id: "auxiliar-administrativo-estado",
    name: "Auxiliar Administrativo del Estado",
    category: "administracion",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "administrativo-estado",
    name: "Administrativo del Estado",
    category: "administracion",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "gestion-administracion-civil",
    name: "Gestión de la Administración Civil",
    category: "administracion",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "tecnicos-hacienda",
    name: "Técnicos de Hacienda",
    category: "administracion",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "administradores-civiles-estado",
    name: "Cuerpo Superior de Administradores Civiles del Estado",
    category: "administracion",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "agentes-hacienda-publica",
    name: "Agentes de la Hacienda Pública",
    category: "administracion",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "tecnicos-auditoria-contabilidad",
    name: "Técnicos de Auditoría y Contabilidad",
    category: "administracion",
    difficulty: "advanced" as const,
    isPublic: false,
  },

  // Justicia y Ministerio Fiscal
  {
    id: "auxilio-judicial",
    name: "Auxilio Judicial",
    category: "justicia",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "tramitacion-procesal",
    name: "Tramitación Procesal",
    category: "justicia",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "gestion-procesal",
    name: "Gestión Procesal",
    category: "justicia",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "judicatura",
    name: "Judicatura",
    category: "justicia",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "fiscalia",
    name: "Fiscalía",
    category: "justicia",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "abogacia-estado",
    name: "Abogacía del Estado",
    category: "justicia",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "notarias",
    name: "Notarías",
    category: "justicia",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "registro-propiedad",
    name: "Registro de la Propiedad",
    category: "justicia",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "secretarios-judiciales",
    name: "Cuerpo de Secretarios Judiciales",
    category: "justicia",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "medicina-legal",
    name: "Instituto de Medicina Legal",
    category: "justicia",
    difficulty: "advanced" as const,
    isPublic: false,
  },

  // Hacienda / Economía
  {
    id: "intervencion-general-estado",
    name: "Intervención General del Estado",
    category: "hacienda",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "inspeccion-hacienda",
    name: "Inspección de Hacienda",
    category: "hacienda",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "cnmv-tecnicos",
    name: "CNMV – Técnicos",
    category: "hacienda",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "banco-espana-tecnicos",
    name: "Banco de España – Técnicos",
    category: "hacienda",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "tecnicos-seguridad-social",
    name: "Técnicos de Seguridad Social",
    category: "hacienda",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "inspectores-hacienda-superior",
    name: "Cuerpo Superior de Inspectores de Hacienda",
    category: "hacienda",
    difficulty: "expert" as const,
    isPublic: false,
  },

  // Sanidad
  {
    id: "auxiliar-enfermeria",
    name: "Auxiliar de Enfermería",
    category: "sanidad",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "enfermeria-eir",
    name: "Enfermería (EIR)",
    category: "sanidad",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "celador",
    name: "Celador",
    category: "sanidad",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "tecnico-laboratorio",
    name: "Técnico de Laboratorio",
    category: "sanidad",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "tecnico-farmacia",
    name: "Técnico de Farmacia",
    category: "sanidad",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "tecnico-rayos",
    name: "Técnico de Rayos",
    category: "sanidad",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "mir",
    name: "Médico Interno Residente (MIR)",
    category: "sanidad",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "pir",
    name: "Psicólogo Interno Residente (PIR)",
    category: "sanidad",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    category: "sanidad",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "matrona",
    name: "Matrona",
    category: "sanidad",
    difficulty: "advanced" as const,
    isPublic: false,
  },

  // Fuerzas y Cuerpos de Seguridad
  {
    id: "guardia-civil",
    name: "Guardia Civil",
    category: "seguridad",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "policia-nacional",
    name: "Policía Nacional",
    category: "seguridad",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "policia-local",
    name: "Policía Local",
    category: "seguridad",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "mossos-esquadra",
    name: "Mossos d'Esquadra",
    category: "seguridad",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "ertzaintza",
    name: "Ertzaintza",
    category: "seguridad",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "bomberos",
    name: "Bomberos",
    category: "seguridad",
    difficulty: "intermediate" as const,
    isPublic: false,
  },

  // Ciencia / Ingeniería
  {
    id: "ingenieros-estado",
    name: "Cuerpo de Ingenieros del Estado",
    category: "ciencia",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "arquitectos-estado",
    name: "Cuerpo de Arquitectos del Estado",
    category: "ciencia",
    difficulty: "expert" as const,
    isPublic: false,
  },
  {
    id: "meteorologia",
    name: "Meteorología",
    category: "ciencia",
    difficulty: "advanced" as const,
    isPublic: false,
  },
  {
    id: "instituto-geografico",
    name: "Instituto Geográfico Nacional",
    category: "ciencia",
    difficulty: "advanced" as const,
    isPublic: false,
  },

  // Educación
  {
    id: "estudiante-primaria",
    name: "Asistente para Alumnos de Primaria",
    category: "educacion",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "estudiante-eso",
    name: "Asistente para Alumnos de ESO",
    category: "educacion",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "estudiante-bachillerato",
    name: "Asistente para Alumnos de Bachillerato",
    category: "educacion",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "estudiante-fp",
    name: "Asistente para Alumnos de Formación Profesional",
    category: "educacion",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "estudiante-universitario",
    name: "Asistente para Alumnos Universitarios",
    category: "educacion",
    difficulty: "advanced" as const,
    isPublic: false,
  },

  // Idiomas
  {
    id: "idioma-ingles",
    name: "Inglés",
    category: "idiomas",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "idioma-frances",
    name: "Francés",
    category: "idiomas",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "idioma-aleman",
    name: "Alemán",
    category: "idiomas",
    difficulty: "intermediate" as const,
    isPublic: false,
  },

  // Correos y Telecomunicaciones
  {
    id: "correos",
    name: "Asistente de Correos",
    category: "correos",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "tecnico-comunicaciones",
    name: "Asistente de Técnico de Comunicaciones",
    category: "correos",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "atencion-cliente-postal",
    name: "Asistente de Atención al Cliente Postal",
    category: "correos",
    difficulty: "basic" as const,
    isPublic: false,
  },

  // Ferroviario y Transporte
  {
    id: "renfe",
    name: "Asistente de RENFE",
    category: "ferroviario",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "transporte-metropolitano",
    name: "Asistente de Transporte Metropolitano",
    category: "ferroviario",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "trafico-aereo",
    name: "Asistente de Tráfico Aéreo",
    category: "ferroviario",
    difficulty: "expert" as const,
    isPublic: false,
  },

  // Servicios Auxiliares
  {
    id: "conserje-portero",
    name: "Asistente de Conserje / Portero",
    category: "servicios",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "limpieza",
    name: "Asistente de Limpieza",
    category: "servicios",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "vigilancia-seguridad",
    name: "Asistente de Vigilancia y Seguridad",
    category: "servicios",
    difficulty: "basic" as const,
    isPublic: false,
  },

  // Justicia Autonómica
  {
    id: "tramitacion-procesal-autonomica",
    name: "Asistente de Tramitación Procesal Autonómica",
    category: "autonomica",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "gestion-procesal-autonomica",
    name: "Asistente de Gestión Procesal Autonómica",
    category: "autonomica",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "auxilio-judicial-autonomico",
    name: "Asistente de Auxilio Judicial Autonómico",
    category: "autonomica",
    difficulty: "basic" as const,
    isPublic: false,
  },

  // Ejército
  {
    id: "tropa-marineria",
    name: "Asistente de Acceso a Tropa y Marinería",
    category: "ejercito",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "suboficiales",
    name: "Asistente de Acceso a Suboficiales",
    category: "ejercito",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "oficiales",
    name: "Asistente de Acceso a Oficiales",
    category: "ejercito",
    difficulty: "advanced" as const,
    isPublic: false,
  },

  // Carnets de Conducir
  {
    id: "carnet-b",
    name: "Carnet B",
    category: "carnets",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "carnet-a",
    name: "Carnet A (moto)",
    category: "carnets",
    difficulty: "basic" as const,
    isPublic: false,
  },
  {
    id: "carnet-c",
    name: "Carnet C (camión)",
    category: "carnets",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "carnet-d",
    name: "Carnet D (autobús)",
    category: "carnets",
    difficulty: "intermediate" as const,
    isPublic: false,
  },
  {
    id: "cap",
    name: "CAP (transporte profesional)",
    category: "carnets",
    difficulty: "intermediate" as const,
    isPublic: false,
  },

  // Asistentes Públicos
  {
    id: "legal-general",
    name: "Asistente Legal General",
    category: "publico",
    difficulty: "basic" as const,
    isPublic: true,
  },
  {
    id: "nutricion-deporte",
    name: "Asistente de Nutrición y Deporte",
    category: "publico",
    difficulty: "basic" as const,
    isPublic: true,
  },
  {
    id: "bienestar-emocional",
    name: "Asistente de Bienestar Emocional",
    category: "publico",
    difficulty: "basic" as const,
    isPublic: true,
  },
  {
    id: "burocracia-tramites",
    name: "Asistente de Burocracia y Trámites",
    category: "publico",
    difficulty: "basic" as const,
    isPublic: true,
  },
  {
    id: "laboral-basico",
    name: "Asistente Laboral Básico",
    category: "publico",
    difficulty: "basic" as const,
    isPublic: true,
  },
];

export const initializeAllFirebaseData = async (): Promise<void> => {
  try {
    console.log("🚀 Iniciando configuración de Firebase...");

    // 1. Initialize pricing data
    console.log("💰 Configurando precios de asistentes...");
    await initializeAssistantData();

    // 2. Initialize temarios for all assistants
    console.log("📚 Configurando temarios...");
    for (const assistant of allAssistants) {
      const temario = generateBaseTemario(
        assistant.id,
        assistant.name,
        assistant.category,
        getTopicCountByDifficulty(assistant.difficulty),
      );

      await setAssistantTemario(temario);
      console.log(`✅ Temario creado para ${assistant.name}`);
    }

    console.log("🎉 ¡Configuración de Firebase completada exitosamente!");
    console.log(`📊 Total de asistentes configurados: ${allAssistants.length}`);
  } catch (error) {
    console.error("❌ Error configurando Firebase:", error);
    throw error;
  }
};

// Helper function to get topic count based on difficulty
const getTopicCountByDifficulty = (difficulty: string): number => {
  const topicCounts = {
    basic: 15,
    intermediate: 20,
    advanced: 25,
    expert: 30,
  };
  return topicCounts[difficulty as keyof typeof topicCounts] || 20;
};

// Function to create an admin user
export const createAdminUser = async (
  userId: string,
  email: string,
): Promise<void> => {
  try {
    const { setDoc, doc } = await import("firebase/firestore");
    const { db } = await import("./firebase");

    const adminData = {
      userId,
      email,
      role: "admin",
      permissions: ["all"],
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "admins", userId), adminData);
    console.log(`✅ Usuario admin creado: ${email}`);
  } catch (error) {
    console.error("❌ Error creando usuario admin:", error);
    throw error;
  }
};
