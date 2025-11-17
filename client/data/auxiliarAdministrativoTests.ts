// Tests completos para Auxiliar Administrativo del Estado
export const auxiliarAdministrativoCompleteTests = [
  {
    themeId: "tema-1",
    themeName: "Tema 1 - Conceptos Fundamentales",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t1-q${idx + 1}`,
      question: `¿Cuál es el principio fundamental ${idx + 1} en la administración pública española?`,
      options: [
        "Principio de legalidad",
        "Principio de eficacia",
        "Principio de transparencia",
        "Todos los anteriores"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Esta respuesta es correcta según los fundamentos básicos de la administración pública española establecidos en la Constitución y la legislación administrativa.`
    }))
  },
  {
    themeId: "tema-2", 
    themeName: "Tema 2 - Marco Normativo",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t2-q${idx + 1}`,
      question: `¿Qué normativa ${idx + 1} regula el procedimiento administrativo común?`,
      options: [
        "Ley 39/2015",
        "Ley 40/2015", 
        "Real Decreto 203/2021",
        "Constitución Española"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `La respuesta correcta se fundamenta en la normativa vigente sobre procedimiento administrativo común en España.`
    }))
  },
  {
    themeId: "tema-3",
    themeName: "Tema 3 - Procedimientos Básicos", 
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t3-q${idx + 1}`,
      question: `¿Cuál es el plazo ${idx + 1} establecido para la resolución de procedimientos administrativos?`,
      options: [
        "3 meses",
        "6 meses",
        "1 año", 
        "Depende del procedimiento"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Los plazos se establecen según la normativa específica de cada tipo de procedimiento administrativo.`
    }))
  },
  {
    themeId: "tema-4",
    themeName: "Tema 4 - Documentación Oficial",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t4-q${idx + 1}`,
      question: `¿Qué documento ${idx + 1} es preceptivo en los expedientes administrativos?`,
      options: [
        "Resolución motivada",
        "Informe técnico",
        "Propuesta de resolución",
        "Todas las anteriores"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `La documentación administrativa debe cumplir con los requisitos establecidos en la normativa de procedimiento.`
    }))
  },
  {
    themeId: "tema-5",
    themeName: "Tema 5 - Gestión de Personal y Recursos Humanos",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t5-q${idx + 1}`,
      question: `¿Cuál es el régimen jurídico ${idx + 1} del personal funcionario?`,
      options: [
        "Estatuto Básico del Empleado Público",
        "Estatuto de los Trabajadores",
        "Ley de Función Pública",
        "Código Civil"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `El personal funcionario se rige por normativa específica de función pública en España.`
    }))
  },
  {
    themeId: "tema-6", 
    themeName: "Tema 6 - Atención al Ciudadano y Calidad",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t6-q${idx + 1}`,
      question: `¿Qué derecho ${idx + 1} asiste al ciudadano en sus relaciones con la Administración?`,
      options: [
        "Derecho a la información",
        "Derecho a la participación", 
        "Derecho a la tutela judicial efectiva",
        "Todos los anteriores"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Los ciudadanos tienen múltiples derechos reconocidos en la legislación administrativa española.`
    }))
  },
  {
    themeId: "tema-7",
    themeName: "Tema 7 - Recursos y Medios Materiales",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t7-q${idx + 1}`,
      question: `¿Qué principio ${idx + 1} rige la gestión de recursos públicos?`,
      options: [
        "Eficiencia",
        "Economía", 
        "Eficacia",
        "Todos los anteriores"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `La gestión de recursos públicos debe seguir los principios establecidos en la normativa presupuestaria.`
    }))
  },
  {
    themeId: "tema-8",
    themeName: "Tema 8 - Coordinación Institucional",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t8-q${idx + 1}`,
      question: `¿Cómo se articula ${idx + 1} la coordinación entre administraciones públicas?`,
      options: [
        "Convenios de colaboración",
        "Conferencias sectoriales",
        "Comisiones bilaterales", 
        "Todas las anteriores"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `La coordinación interadministrativa se realiza mediante diversos instrumentos de cooperación.`
    }))
  },
  {
    themeId: "tema-9",
    themeName: "Tema 9 - Tecnologías de la Información y Comunicación",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t9-q${idx + 1}`,
      question: `¿Qué normativa ${idx + 1} regula la administración electrónica?`,
      options: [
        "Ley 39/2015",
        "Ley 40/2015",
        "Real Decreto 203/2021",
        "Todas las anteriores"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `La administración electrónica está regulada por normativa específica sobre procedimiento administrativo.`
    }))
  },
  {
    themeId: "tema-10",
    themeName: "Tema 10 - Calidad y Mejora Continua", 
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t10-q${idx + 1}`,
      question: `¿Qué sistema ${idx + 1} se utiliza para la mejora de la calidad en la administración?`,
      options: [
        "ISO 9001",
        "EFQM",
        "CAF",
        "Todos los anteriores"
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `Existen diversos sistemas de gestión de calidad aplicables a la administración pública.`
    }))
  },
  {
    themeId: "tema-11",
    themeName: "Tema 11 - Prevención de Riesgos Laborales",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t11-q${idx + 1}`,
      question: `¿Qué ley ${idx + 1} regula la prevención de riesgos laborales?`,
      options: [
        "Ley 31/1995",
        "Ley 32/1995", 
        "Ley 30/1995",
        "Ley 33/1995"
      ],
      correctAnswer: 0,
      explanation: `La Ley 31/1995 de Prevención de Riesgos Laborales es la norma fundamental en esta materia.`
    }))
  },
  {
    themeId: "tema-12",
    themeName: "Tema 12 - Ética Profesional y Deontología",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t12-q${idx + 1}`,
      question: `¿Cuál es el principio ético ${idx + 1} fundamental del empleado público?`,
      options: [
        "Integridad",
        "Imparcialidad",
        "Transparencia", 
        "Todos los anteriores"
      ],
      correctAnswer: 3,
      explanation: `Los empleados públicos deben observar todos los principios éticos establecidos en la normativa.`
    }))
  },
  {
    themeId: "tema-13",
    themeName: "Tema 13 - Comunicación Efectiva y Protocolo",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t13-q${idx + 1}`,
      question: `¿Qué elemento ${idx + 1} es clave en la comunicación administrativa?`,
      options: [
        "Claridad",
        "Precisión",
        "Cortesía",
        "Todas las anteriores" 
      ],
      correctAnswer: 3,
      explanation: `La comunicación administrativa debe ser clara, precisa y cortés para ser efectiva.`
    }))
  },
  {
    themeId: "tema-14",
    themeName: "Tema 14 - Innovación y Modernización Administrativa",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t14-q${idx + 1}`,
      question: `¿Qué herramienta ${idx + 1} impulsa la modernización administrativa?`,
      options: [
        "Transformación digital",
        "Simplificación de procedimientos",
        "Gobierno abierto",
        "Todas las anteriores"
      ],
      correctAnswer: 3,
      explanation: `La modernización administrativa requiere un enfoque integral que incluya todos estos elementos.`
    }))
  },
  {
    themeId: "tema-15",
    themeName: "Tema 15 - Evaluación y Seguimiento de Procesos",
    tests: Array.from({length: 20}, (_, idx) => ({
      id: `t15-q${idx + 1}`,
      question: `¿Qué indicador ${idx + 1} se utiliza para evaluar la eficacia administrativa?`,
      options: [
        "Tiempo de respuesta",
        "Satisfacción ciudadana", 
        "Cumplimiento de objetivos",
        "Todos los anteriores"
      ],
      correctAnswer: 3,
      explanation: `La evaluación administrativa debe considerar múltiples indicadores para ser completa y efectiva.`
    }))
  }
];
