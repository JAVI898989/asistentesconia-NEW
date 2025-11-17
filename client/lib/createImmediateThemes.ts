// Create immediate themes for all assistants to show the layout
export const createImmediateThemesForAssistant = (assistantId: string, assistantName: string) => {
  console.log(`📚 Creating immediate themes for ${assistantName}...`);

  // Create 9 themes with proper structure
  const themes = [
    {
      number: 1,
      title: "Introducción y Marco General",
      description: "Fundamentos básicos y conceptos generales"
    },
    {
      number: 2,
      title: "Marco Normativo y Legal",
      description: "Legislación aplicable y marco jurídico"
    },
    {
      number: 3,
      title: "Organización y Estructura",
      description: "Estructura organizativa y jerarquías"
    },
    {
      number: 4,
      title: "Procedimientos y Protocolos",
      description: "Procesos administrativos y protocolos"
    },
    {
      number: 5,
      title: "Funciones y Competencias",
      description: "Responsabilidades y ámbitos de actuación"
    },
    {
      number: 6,
      title: "Normativa Específica",
      description: "Regulaciones particulares del sector"
    },
    {
      number: 7,
      title: "Casos Prácticos y Aplicaciones",
      description: "Ejemplos reales y supuestos prácticos"
    },
    {
      number: 8,
      title: "Recursos y Herramientas",
      description: "Instrumentos y recursos disponibles"
    },
    {
      number: 9,
      title: "Evaluación y Exámenes",
      description: "Sistemas de evaluación y pruebas"
    }
  ];

  // Save to localStorage immediately
  themes.forEach(theme => {
    const localKey = `curriculum_${assistantId}_${theme.number}`;
    const themeData = {
      id: `theme-${assistantId}-${theme.number}`,
      assistantId,
      number: theme.number,
      title: theme.title,
      description: theme.description,
      content: createBasicThemeContent(assistantName, theme.number, theme.title),
      order: theme.number,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(localKey, JSON.stringify(themeData));
  });

  // Save index
  const indexKey = `curriculum_index_${assistantId}`;
  const themeIndex = themes.map(t => t.number);
  localStorage.setItem(indexKey, JSON.stringify(themeIndex));

  console.log(`✅ Created ${themes.length} immediate themes for ${assistantName}`);
  return themes.length;
};

// Create basic content for immediate display
const createBasicThemeContent = (assistantName: string, themeNumber: number, themeTitle: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tema ${themeNumber}: ${themeTitle}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
        }
        h1 { 
            color: #2563eb; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 10px; 
        }
        h2 { 
            color: #1d4ed8; 
            margin-top: 30px; 
        }
        .summary { 
            background: #f0f9ff; 
            padding: 20px; 
            border-left: 5px solid #2563eb; 
            margin: 20px 0; 
        }
        .key-points { 
            background: #fef3c7; 
            padding: 20px; 
            border-left: 5px solid #f59e0b; 
            margin: 20px 0; 
        }
    </style>
</head>
<body>
    <h1>Tema ${themeNumber}: ${themeTitle}</h1>
    
    <h2>Introducción</h2>
    <p>
        Este tema aborda los aspectos fundamentales de <strong>${themeTitle}</strong> 
        en el contexto de <strong>${assistantName}</strong>.
    </p>

    <h2>Objetivos</h2>
    <ul>
        <li>Comprender los fundamentos teóricos</li>
        <li>Analizar la aplicación práctica</li>
        <li>Desarrollar competencias específicas</li>
    </ul>

    <h2>Desarrollo del Contenido</h2>
    <p>
        El desarrollo de este tema incluye conceptos clave, aplicaciones prácticas 
        y casos de estudio relevantes para ${assistantName}.
    </p>

    <div class="summary">
        <h3>Resumen</h3>
        <p>
            Contenido fundamental sobre ${themeTitle} aplicado al ámbito de ${assistantName}.
        </p>
    </div>

    <div class="key-points">
        <h3>Puntos Clave</h3>
        <ul>
            <li>Concepto principal: ${themeTitle}</li>
            <li>Aplicación en ${assistantName}</li>
            <li>Competencias requeridas</li>
        </ul>
    </div>
</body>
</html>`;
};

// Initialize themes for main assistants
export const initializeAllAssistantThemes = () => {
  const mainAssistants = [
    { id: "policia-nacional", name: "Policía Nacional" },
    { id: "guardia-civil", name: "Guardia Civil" },
    { id: "auxiliar-administrativo-estado", name: "Auxiliar Administrativo del Estado" },
    { id: "administrativo", name: "Administrativo" },
    { id: "auxiliar-administrativo", name: "Auxiliar Administrativo" },
    { id: "administrativo-estado", name: "Administrativo del Estado" },
    { id: "celador", name: "Celador" },
    { id: "mir", name: "Médico Interno Residente (MIR)" },
    { id: "tecnicos-hacienda", name: "Técnicos de Hacienda" },
    { id: "agentes-hacienda-publica", name: "Agentes de la Hacienda Pública" },
    { id: "intervencion-general", name: "Intervención General del Estado" },
    { id: "inspeccion-hacienda", name: "Inspección de Hacienda" },
    { id: "cnmv-tecnicos", name: "CNMV – Técnicos" },
    { id: "banco-espana-tecnicos", name: "Banco de España – Técnicos" },
    { id: "tecnicos-seguridad-social", name: "Técnicos de Seguridad Social" },
    { id: "inspectores-hacienda-superior", name: "Cuerpo Superior de Inspectores de Hacienda" },
    { id: "tecnico-hacienda", name: "Técnico de Hacienda" },
    { id: "auxiliar-enfermeria", name: "Auxiliar de Enfermería" },
    { id: "enfermero", name: "Enfermero/a" },
    { id: "tecnico-radiodiagnostico", name: "Técnico en Radiodiagnóstico" },
    { id: "tecnico-laboratorio", name: "Técnico de Laboratorio" },
    { id: "fisioterapeuta", name: "Fisioterapeuta" },
    { id: "trabajador-social", name: "Trabajador Social" },
    { id: "psicologo-clinico", name: "Psicólogo Clínico" },
    { id: "farmaceutico", name: "Farmacéutico" },
    { id: "medico-familia", name: "Médico de Familia" },
    { id: "maestros-primaria", name: "Maestros de Educación Primaria" },
    { id: "profesores-secundaria", name: "Profesores de Educación Secundaria" },
    { id: "orientador-educativo", name: "Orientador Educativo" },
    { id: "inspector-educacion", name: "Inspector de Educación" },
    { id: "juez", name: "Juez" },
    { id: "fiscal", name: "Fiscal" },
    { id: "secretario-judicial", name: "Secretario Judicial" },
    { id: "gestor-procesal", name: "Gestor Procesal" },
    { id: "tramitador-procesal", name: "Tramitador Procesal" },
    { id: "auxilio-judicial", name: "Auxilio Judicial" },
    { id: "notario", name: "Notario" },
    { id: "registrador", name: "Registrador de la Propiedad" },
    { id: "letrado-administracion-justicia", name: "Letrado de la Administración de Justicia" },
    { id: "bombero", name: "Bombero" },
    { id: "policia-local", name: "Policía Local" },
    { id: "mossos-esquadra", name: "Mossos d'Esquadra" },
    { id: "ertzaintza", name: "Ertzaintza" }
  ];

  let totalCreated = 0;
  
  mainAssistants.forEach(assistant => {
    // Only create if doesn't exist
    const indexKey = `curriculum_index_${assistant.id}`;
    if (!localStorage.getItem(indexKey)) {
      const themesCreated = createImmediateThemesForAssistant(assistant.id, assistant.name);
      totalCreated += themesCreated;
    }
  });

  console.log(`🎯 Total themes created: ${totalCreated} for ${mainAssistants.length} assistants`);
  return totalCreated;
};
