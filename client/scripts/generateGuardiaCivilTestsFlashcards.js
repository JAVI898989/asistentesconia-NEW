import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBywGWqSpzZ4BRxIoEnIQZhv3ObHvrLIC8",
  authDomain: "cursor-64188.firebaseapp.com",
  projectId: "cursor-64188",
  storageBucket: "cursor-64188.appspot.com",
  messagingSenderId: "657742231663",
  appId: "1:657742231663:web:9b6fce322922f3b6e0f59a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ASSISTANT_ID = 'guardia-civil';

// 27 Temas oficiales de Guardia Civil
const GUARDIA_CIVIL_OFFICIAL_TOPICS = [
  {
    number: 1,
    title: "Derechos Humanos y normativa internacional",
    slug: "derechos-humanos-normativa-internacional",
    category: "Derecho Constitucional"
  },
  {
    number: 2,
    title: "La Constitución Española de 1978",
    slug: "constitucion-espanola-1978",
    category: "Derecho Constitucional"
  },
  {
    number: 3,
    title: "El Tribunal Constitucional. El Defensor del Pueblo",
    slug: "tribunal-constitucional-defensor-pueblo",
    category: "Derecho Constitucional"
  },
  {
    number: 4,
    title: "La organización territorial del Estado",
    slug: "organizacion-territorial-estado",
    category: "Derecho Constitucional"
  },
  {
    number: 5,
    title: "La Unión Europea",
    slug: "union-europea",
    category: "Derecho Europeo"
  },
  {
    number: 6,
    title: "Derecho Penal. Concepto, principios y estructura del Código Penal",
    slug: "derecho-penal-concepto-principios-estructura",
    category: "Derecho Penal"
  },
  {
    number: 7,
    title: "Delitos contra la Administración Pública",
    slug: "delitos-contra-administracion-publica",
    category: "Derecho Penal"
  },
  {
    number: 8,
    title: "Delitos cometidos por funcionarios públicos en el ejercicio de su cargo",
    slug: "delitos-funcionarios-publicos-ejercicio-cargo",
    category: "Derecho Penal"
  },
  {
    number: 9,
    title: "Delitos contra las personas",
    slug: "delitos-contra-personas",
    category: "Derecho Penal"
  },
  {
    number: 10,
    title: "Delitos contra el patrimonio y contra el orden socioeconómico",
    slug: "delitos-patrimonio-orden-socioeconomico",
    category: "Derecho Penal"
  },
  {
    number: 11,
    title: "Delitos contra la seguridad colectiva",
    slug: "delitos-seguridad-colectiva",
    category: "Derecho Penal"
  },
  {
    number: 12,
    title: "Delitos contra el orden público",
    slug: "delitos-orden-publico",
    category: "Derecho Penal"
  },
  {
    number: 13,
    title: "Derecho Procesal Penal: concepto, objeto y principios fundamentales",
    slug: "derecho-procesal-penal-concepto-objeto-principios",
    category: "Derecho Procesal"
  },
  {
    number: 14,
    title: "La Policía Judicial. Concepto y funciones",
    slug: "policia-judicial-concepto-funciones",
    category: "Derecho Procesal"
  },
  {
    number: 15,
    title: "La detención. Concepto y duración. Derechos del detenido",
    slug: "detencion-concepto-duracion-derechos-detenido",
    category: "Derecho Procesal"
  },
  {
    number: 16,
    title: "La entrada y registro en lugar cerrado. Intervención de las comunicaciones postales y telefónicas",
    slug: "entrada-registro-lugar-cerrado-intervencion-comunicaciones",
    category: "Derecho Procesal"
  },
  {
    number: 17,
    title: "El Ministerio Fiscal. Funciones",
    slug: "ministerio-fiscal-funciones",
    category: "Derecho Procesal"
  },
  {
    number: 18,
    title: "Normativa reguladora de las Fuerzas y Cuerpos de Seguridad",
    slug: "normativa-fuerzas-cuerpos-seguridad",
    category: "Guardia Civil"
  },
  {
    number: 19,
    title: "La Guardia Civil. Origen e historia. Servicios actuales",
    slug: "guardia-civil-origen-historia-servicios",
    category: "Guardia Civil"
  },
  {
    number: 20,
    title: "Derechos y deberes de los miembros de la Guardia Civil. Régimen disciplinario",
    slug: "derechos-deberes-miembros-regimen-disciplinario",
    category: "Guardia Civil"
  },
  {
    number: 21,
    title: "Régimen estatutario de la Guardia Civil. Acceso, formación, situaciones administrativas",
    slug: "regimen-estatutario-acceso-formacion-situaciones",
    category: "Guardia Civil"
  },
  {
    number: 22,
    title: "La Ley Orgánica 2/1986, de Fuerzas y Cuerpos de Seguridad",
    slug: "ley-organica-2-1986-fuerzas-cuerpos-seguridad",
    category: "Guardia Civil"
  },
  {
    number: 23,
    title: "El uso de la fuerza. Principios básicos de actuación",
    slug: "uso-fuerza-principios-basicos-actuacion",
    category: "Técnicas Operativas"
  },
  {
    number: 24,
    title: "Armas de fuego: normativa, uso y protocolo",
    slug: "armas-fuego-normativa-uso-protocolo",
    category: "Técnicas Operativas"
  },
  {
    number: 25,
    title: "Materias técnico-científicas. Criminalística básica",
    slug: "materias-tecnico-cientificas-criminalistica",
    category: "Técnicas Operativas"
  },
  {
    number: 26,
    title: "Informática básica. Redes, seguridad y delitos informáticos",
    slug: "informatica-basica-redes-seguridad-delitos",
    category: "Técnicas Operativas"
  },
  {
    number: 27,
    title: "Deontología profesional. Código Ético de la Guardia Civil",
    slug: "deontologia-profesional-codigo-etico",
    category: "Ética Profesional"
  }
];

// Generate tests for a topic
function generateTopicTests(topic) {
  const tests = [];
  
  for (let i = 1; i <= 5; i++) {
    const testData = {
      id: `${topic.slug}-test-${i}`,
      stem: generateTestQuestion(topic, i),
      options: generateTestOptions(topic, i),
      answer: 'A', // La primera opción es siempre correcta
      rationale: generateTestRationale(topic, i),
      section: topic.category,
      difficulty: Math.floor(Math.random() * 3) + 1,
      assistantId: 'guardia-civil',
      slug: topic.slug,
      createdAt: serverTimestamp()
    };
    
    tests.push(testData);
  }
  
  return tests;
}

// Generate flashcards for a topic
function generateTopicFlashcards(topic) {
  const flashcards = [];
  
  const baseFlashcards = [
    {
      front: `¿Qué es ${topic.title}?`,
      back: getTopicDefinition(topic),
      tags: ["definición", topic.category.toLowerCase()]
    },
    {
      front: `¿Cuál es la normativa principal que regula ${topic.title}?`,
      back: getKeyLaws(topic),
      tags: ["normativa", "legal"]
    },
    {
      front: `¿Cuáles son los principios básicos aplicables a ${topic.title}?`,
      back: "Legalidad, proporcionalidad, eficacia, transparencia y coordinación institucional según la normativa vigente",
      tags: ["principios", "básico"]
    },
    {
      front: `¿Cuál es el procedimiento básico de aplicación en ${topic.title}?`,
      back: "FASE 1: Preparación (identificación y planificación) → FASE 2: Ejecución (aplicación y documentación) → FASE 3: Finalización (verificación y archivo)",
      tags: ["procedimiento", "fases"]
    },
    {
      front: `¿Qué competencias tiene la Guardia Civil en ${topic.title}?`,
      back: "Competencia nacional con especial dedicación al medio rural, funciones de seguridad ciudadana y policía judicial según la Ley Orgánica 2/1986",
      tags: ["competencias", "territorial"]
    },
    {
      front: `¿Cuáles son los organismos de coordinación en ${topic.title}?`,
      back: "Ministerio del Interior, Ministerio Fiscal, Poder Judicial, Administraciones autonómicas y Entidades locales",
      tags: ["coordinación", "organismos"]
    },
    {
      front: `¿Qué documentación es obligatoria en ${topic.title}?`,
      back: "Acta de intervención completa, documentación de todas las actuaciones realizadas y remisión a autoridades competentes",
      tags: ["documentación", "procedimiento"]
    },
    {
      front: `¿Cuáles son las fases del control de calidad en ${topic.title}?`,
      back: "Medición de indicadores cuantitativos, evaluación de métricas cualitativas y mejora continua de procesos",
      tags: ["calidad", "evaluación"]
    }
  ];

  // Generar 40 flashcards con variaciones inteligentes
  for (let i = 0; i < 40; i++) {
    const baseIndex = i % baseFlashcards.length;
    const base = baseFlashcards[baseIndex];
    
    let front = base.front;
    let back = base.back;
    
    // Añadir variaciones contextuales para evitar repetición exacta
    if (i >= baseFlashcards.length) {
      const variation = Math.floor(i / baseFlashcards.length);
      switch (variation) {
        case 1:
          front = `En el contexto operativo de ${topic.title}, ` + base.front.toLowerCase();
          break;
        case 2:
          front = `Para un miembro de la Guardia Civil, ` + base.front.toLowerCase();
          break;
        case 3:
          front = `Según la normativa vigente aplicable, ` + base.front.toLowerCase();
          break;
        case 4:
          front = `En las actuaciones profesionales de ${topic.title}, ` + base.front.toLowerCase();
          break;
        case 5:
          front = `Respecto a las competencias en ${topic.title}, ` + base.front.toLowerCase();
          break;
      }
    }
    
    flashcards.push({
      id: `${topic.slug}-flashcard-${i + 1}`,
      front,
      back,
      tags: [...base.tags, topic.slug, "guardia-civil"],
      assistantId: 'guardia-civil',
      slug: topic.slug,
      createdAt: serverTimestamp()
    });
  }
  
  return flashcards;
}

// Helper functions
function getTopicDefinition(topic) {
  const definitions = {
    1: "Los Derechos Humanos son derechos inherentes a todos los seres humanos, sin distinción alguna, que deben ser respetados y protegidos por los Estados y sus agentes, incluyendo las fuerzas de seguridad.",
    2: "La Constitución Española de 1978 es la norma suprema del ordenamiento jurídico español que establece los principios fundamentales de convivencia política y social.",
    19: "La Guardia Civil es un Instituto Armado de naturaleza militar que forma parte de las Fuerzas y Cuerpos de Seguridad del Estado, con competencia en todo el territorio nacional.",
    22: "La Ley Orgánica 2/1986 es la norma fundamental que regula las Fuerzas y Cuerpos de Seguridad, estableciendo sus principios, organización y competencias."
  };
  
  return definitions[topic.number] || `${topic.title} constituye una materia fundamental en la formación y actuación profesional de los miembros de la Guardia Civil.`;
}

function getKeyLaws(topic) {
  const laws = {
    1: "Declaración Universal de Derechos Humanos, Convenio Europeo de Derechos Humanos, Constitución Española",
    2: "Constitución Española de 1978",
    19: "Ley de Fundación de la Guardia Civil de 1844, Ley Orgánica 2/1986 de FCSE",
    22: "Ley Orgánica 2/1986, de 13 de marzo, de Fuerzas y Cuerpos de Seguridad"
  };
  
  return laws[topic.number] || "Constitución Española, Ley Orgánica 2/1986 de FCSE, normativa sectorial específica";
}

function generateTestQuestion(topic, questionNumber) {
  const questions = [
    `Según la normativa vigente sobre ${topic.title}, ¿cuál es el procedimiento correcto que debe seguir la Guardia Civil?`,
    `En materia de ${topic.title}, ¿qué principio constitucional debe primar en toda actuación de la Guardia Civil?`,
    `Respecto a las competencias de la Guardia Civil en ${topic.title}, ¿cuál es su ámbito de actuación?`,
    `¿Qué documentación es preceptiva en las actuaciones relacionadas con ${topic.title}?`,
    `En caso de duda sobre la aplicación de ${topic.title}, ¿cuál es la actuación correcta?`
  ];
  
  return questions[questionNumber - 1] || questions[0];
}

function generateTestOptions(topic, questionNumber) {
  const optionSets = [
    [
      "Seguir el protocolo establecido y coordinar con la autoridad competente",
      "Actuar directamente sin comunicar a superiores en casos urgentes", 
      "Aplicar criterios propios basados en la experiencia",
      "Consultar únicamente con el mando directo"
    ],
    [
      "El principio de proporcionalidad y respeto a los derechos fundamentales",
      "La eficacia operativa por encima de cualquier consideración",
      "La rapidez en la resolución sin demoras procedimentales", 
      "La discrecionalidad absoluta del agente"
    ],
    [
      "Ámbito nacional con especial dedicación al medio rural",
      "Exclusivamente en núcleos urbanos superiores a 50.000 habitantes",
      "Únicamente en autopistas y carreteras interurbanas",
      "Solo en casos que afecten a más de una comunidad autónoma"
    ],
    [
      "Acta de intervención con todos los datos y circunstancias relevantes",
      "Simple anotación en el libro de novedades",
      "Informe verbal al superior sin documentación escrita",
      "Registro fotográfico únicamente"
    ],
    [
      "Consultar con el superior jerárquico y coordinar con organismos competentes",
      "Actuar directamente para no perder tiempo",
      "Derivar inmediatamente a otras fuerzas de seguridad",
      "Solicitar instrucciones únicamente a la autoridad judicial"
    ]
  ];
  
  const selectedOptions = optionSets[questionNumber - 1] || optionSets[0];
  return selectedOptions.map((opt, i) => `${['A', 'B', 'C', 'D'][i]}) ${opt}`);
}

function generateTestRationale(topic, questionNumber) {
  const rationales = [
    `Según la normativa de ${topic.title}, es fundamental seguir los protocolos establecidos y mantener coordinación con las autoridades competentes.`,
    `El principio de proporcionalidad y el respeto a los derechos fundamentales son irrenunciables en toda actuación policial según la Constitución.`,
    `La Guardia Civil tiene competencia nacional con especial dedicación al medio rural según la Ley Orgánica 2/1986.`,
    `Toda intervención debe documentarse adecuadamente mediante acta oficial que recoja todos los elementos relevantes.`,
    `Ante dudas competenciales es fundamental consultar con superiores y coordinar con otros organismos competentes.`
  ];
  
  return rationales[questionNumber - 1] || rationales[0];
}

async function generateTestsAndFlashcardsOnly() {
  console.log('🚀 Generando SOLO tests y flashcards para Guardia Civil...');
  
  let testsGenerated = 0;
  let flashcardsGenerated = 0;
  
  try {
    for (const topic of GUARDIA_CIVIL_OFFICIAL_TOPICS) {
      console.log(`📝 Procesando Tema ${topic.number}: ${topic.title}`);

      // 1. Generate and save tests (5 per topic)
      console.log(`🎯 Generando tests para Tema ${topic.number}...`);
      const tests = generateTopicTests(topic);
      const testsCollection = collection(db, 'assistants', ASSISTANT_ID, 'tests');
      
      for (const test of tests) {
        await addDoc(testsCollection, test);
      }
      
      testsGenerated += tests.length;
      console.log(`✅ ${tests.length} tests guardados para Tema ${topic.number}`);

      // 2. Generate and save flashcards (40 per topic)
      console.log(`💳 Generando flashcards para Tema ${topic.number}...`);
      const flashcards = generateTopicFlashcards(topic);
      const flashcardsCollection = collection(db, 'assistants', ASSISTANT_ID, 'flashcards');
      
      for (const flashcard of flashcards) {
        await addDoc(flashcardsCollection, flashcard);
      }
      
      flashcardsGenerated += flashcards.length;
      console.log(`✅ ${flashcards.length} flashcards guardadas para Tema ${topic.number}`);
    }

    console.log(`🎉 ¡COMPLETADO!`);
    console.log(`📊 Tests generados: ${testsGenerated}`);
    console.log(`📊 Flashcards generadas: ${flashcardsGenerated}`);
    
  } catch (error) {
    console.error('❌ Error durante la generación:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTestsAndFlashcardsOnly()
    .then(() => {
      console.log('✅ Script terminado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en script:', error);
      process.exit(1);
    });
}

export { generateTestsAndFlashcardsOnly };
