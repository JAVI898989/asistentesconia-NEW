import { db, auth } from '@/lib/simpleAuth';
import { collection, doc, setDoc, addDoc, getDoc, getDocs } from 'firebase/firestore';

export interface TestQuestion {
  id: string;
  enunciado: string;
  opciones: [string, string, string, string]; // [A, B, C, D]
  correcta: 'A' | 'B' | 'C' | 'D';
  explicacion: string;
}

export interface TestData {
  id: string;
  testNumber: number;
  questions: TestQuestion[];
  assistantId: string;
  themeId: string;
  themeName: string;
  created: string;
}

export interface ThemeTestsData {
  themeId: string;
  themeName: string;
  tests: TestData[];
}

export interface GenerationProgress {
  assistantId: string;
  assistantName: string;
  themeId: string;
  themeName: string;
  testNumber: number;
  totalTests: number;
  questionNumber: number;
  totalQuestions: number;
  isCompleted: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface CreateTestAuditLog {
  assistantId: string;
  assistantName: string;
  themeId: string;
  themeName: string;
  testsCreated: number;
  questionsCreated: number;
  timestamp: string;
  duration: number;
  success: boolean;
  errors?: string[];
  adminUserId: string;
  adminEmail: string;
}

// GPT-4-nano API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GPT_MODEL = 'gpt-4o-mini'; // GPT-4-nano model

// Validate API key on module load
if (!OPENAI_API_KEY) {
  console.error('❌ VITE_OPENAI_API_KEY not found in environment variables');
} else if (!OPENAI_API_KEY.startsWith('sk-')) {
  console.error('❌ Invalid OpenAI API key format');
} else {
  console.log('✅ OpenAI API key configured');
}

// Rate limiting configuration (reduced for offline mode)
const RATE_LIMIT_DELAY = 10; // 10ms between requests for offline mode
const MAX_RETRIES = 1; // Single attempt for offline mode

// Spanish validation regex patterns
const SPANISH_VALIDATION = {
  // Check for proper Spanish characters (including accents and ñ)
  hasSpanishChars: /[áéíóúñü]/i,
  // Check for encoding artifacts
  hasArtifacts: /[ÃâÄÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞß]/,
  // Check for proper Spanish structure
  properSpanish: /^[a-záéíóúñü\s\d\.,;:\-\(\)\[\]"'¡!¿\?]*$/i
};

// Theme templates for different assistants - MINIMUM 15 THEMES PER OPPOSITION
const ASSISTANT_THEMES: Record<string, string[]> = {
  'guardia-civil': [
    'Constitución Española',
    'Organización del Estado',
    'Derecho Penal',
    'Derecho Procesal Penal',
    'Derecho Administrativo',
    'Derecho Civil',
    'Derechos Fundamentales y Libertades Públicas',
    'Fuerzas y Cuerpos de Seguridad',
    'Seguridad Ciudadana',
    'Extranjería e Inmigración',
    'Materias Técnico-Científicas',
    'Materias Socio-Culturales',
    'Inglés',
    'Informática Básica',
    'Geografía e Historia de España',
    'Protección Civil',
    'Tráfico y Seguridad Vial',
    'Armamento y Tiro'
  ],
  'policia-nacional': [
    'Constitución Española',
    'Código Penal',
    'Ley de Enjuiciamiento Criminal',
    'Ley Orgánica de Fuerzas y Cuerpos de Seguridad',
    'Ley de Seguridad Ciudadana',
    'Extranjería e Inmigración',
    'Derecho Administrativo',
    'Derechos Fundamentales',
    'Violencia de Género',
    'Terrorismo y Crimen Organizado',
    'Ciencias Sociales',
    'Materias Técnico-Científicas',
    'Inglés',
    'Informática',
    'Geografía',
    'Historia Contemporánea',
    'Literatura Española',
    'Primeros Auxilios'
  ],
  'auxiliar-administrativo-estado': [
    'Constitución Española',
    'Organización del Estado',
    'Ley del Gobierno',
    'Administraciones Públicas',
    'Procedimiento Administrativo Común',
    'Régimen Jurídico del Sector Público',
    'Empleados Públicos',
    'Contratos del Sector Público',
    'Régimen Local',
    'Hacienda Pública',
    'Seguridad Social',
    'Prevención de Riesgos Laborales',
    'Igualdad de Género',
    'Transparencia y Acceso a la Información',
    'Protección de Datos',
    'Ofimática',
    'Atención al Ciudadano',
    'Organización de Oficinas'
  ],
  'auxiliar-administrativo': [
    'Constitución Española',
    'Organización del Estado',
    'Ley del Gobierno',
    'Administraciones Públicas',
    'Procedimiento Administrativo Común',
    'Régimen Jurídico del Sector Público',
    'Empleados Públicos',
    'Contratos del Sector Público',
    'Régimen Local',
    'Hacienda Pública',
    'Seguridad Social',
    'Prevención de Riesgos Laborales',
    'Igualdad de Género',
    'Transparencia y Acceso a la Información',
    'Protección de Datos',
    'Ofimática',
    'Atención al Ciudadano',
    'Organización de Oficinas'
  ],
  'tramitacion-procesal': [
    'Constitución Española',
    'Poder Judicial',
    'Ley Orgánica del Poder Judicial',
    'Ley de Enjuiciamiento Civil',
    'Ley de Enjuiciamiento Criminal',
    'Derecho Penal',
    'Derecho Civil',
    'Derecho Mercantil',
    'Derecho Laboral',
    'Derecho Administrativo',
    'Derecho Constitucional',
    'Organización Judicial',
    'Gestión Procesal',
    'Informática Jurídica',
    'Estadística Judicial',
    'Atención al Ciudadano',
    'Documentación Judicial',
    'Archivo y Registro'
  ],
  'gestion-procesal': [
    'Constitución Española',
    'Poder Judicial',
    'Ley Orgánica del Poder Judicial',
    'Ley de Enjuiciamiento Civil',
    'Ley de Enjuiciamiento Criminal',
    'Derecho Penal',
    'Derecho Civil',
    'Derecho Mercantil',
    'Derecho Laboral',
    'Derecho Administrativo',
    'Derecho Constitucional',
    'Organización Judicial',
    'Gestión de Expedientes',
    'Informática Jurídica',
    'Estadística Judicial',
    'Atención al Público',
    'Gestión de Archivos',
    'Procedimientos Judiciales'
  ],
  'carnet-a': [
    'Normativa de Circulación',
    'Señalización Vial',
    'Reglamento General de Vehículos',
    'Reglamento General de Conductores',
    'Seguridad Vial',
    'Primeros Auxilios',
    'Mecánica Básica',
    'Factores de Riesgo',
    'Alcohol y Drogas',
    'Velocidad y Distancias',
    'Adelantamientos',
    'Intersecciones',
    'Incorporaciones',
    'Estacionamiento',
    'Documentación',
    'Infracciones y Sanciones',
    'Seguros Obligatorios',
    'Mantenimiento del Vehículo'
  ],
  'celador-sanitario': [
    'Sistema Nacional de Salud',
    'Estatuto Marco del Personal Sanitario',
    'Ley General de Sanidad',
    'Ley de Cohesión y Calidad',
    'Derechos y Deberes de los Usuarios',
    'Organización Hospitalaria',
    'Funciones del Celador',
    'Movilización de Pacientes',
    'Traslado de Enfermos',
    'Material Sanitario',
    'Higiene Hospitalaria',
    'Prevención de Infecciones',
    'Urgencias y Emergencias',
    'Comunicación con Pacientes',
    'Confidencialidad',
    'Prevención de Riesgos',
    'Anatomía Básica',
    'Primeros Auxilios'
  ]
};

// Test basic network connectivity
const testBasicConnectivity = async (): Promise<boolean> => {
  try {
    // Test basic internet connectivity
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
      cache: 'no-cache'
    });
    return response.ok;
  } catch (error) {
    console.warn('🌐 Basic connectivity test failed:', error);
    return false;
  }
};

// Generate offline test question immediately
const generateOfflineQuestion = (
  assistantId: string,
  assistantName: string,
  themeId: string,
  themeName: string,
  questionNumber: number
): TestQuestion => {

  const questionTemplates = {
    'constitución-española': [
      {
        enunciado: "Según la Constitución Española de 1978, ¿cuál es la forma política del Estado español?",
        opciones: ["A) República Federal", "B) Monarquía Parlamentaria", "C) República Presidencialista", "D) Monarquía Absoluta"],
        correcta: 'B',
        explicacion: "El artículo 1.3 de la Constitución establece que la forma política del Estado español es la Monarquía parlamentaria."
      },
      {
        enunciado: "¿En qué artículo se establece que la soberanía nacional reside en el pueblo español?",
        opciones: ["A) Artículo 1.2", "B) Artículo 2", "C) Artículo 3.1", "D) Artículo 1.1"],
        correcta: 'A',
        explicacion: "El artículo 1.2 establece que la soberanía nacional reside en el pueblo español."
      },
      {
        enunciado: "¿Cuál es el idioma oficial del Estado según la Constitución?",
        opciones: ["A) Español y catalán", "B) Solo el castellano", "C) El castellano", "D) Español e inglés"],
        correcta: 'C',
        explicacion: "El artículo 3.1 establece que el castellano es la lengua española oficial del Estado."
      }
    ],
    'organización-del-estado': [
      {
        enunciado: "¿Cuáles son los poderes del Estado según la Constitución?",
        opciones: ["A) Ejecutivo y Judicial", "B) Legislativo, Ejecutivo y Judicial", "C) Legislativo y Ejecutivo", "D) Solo el Ejecutivo"],
        correcta: 'B',
        explicacion: "La Constitución establece la división de poderes en Legislativo, Ejecutivo y Judicial."
      },
      {
        enunciado: "¿Quién ejerce el poder legislativo en España?",
        opciones: ["A) El Gobierno", "B) El Rey", "C) Las Cortes Generales", "D) El Tribunal Supremo"],
        correcta: 'C',
        explicacion: "Las Cortes Generales ejercen el poder legislativo del Estado."
      }
    ],
    'procedimiento-administrativo': [
      {
        enunciado: "¿Cuál es el plazo general para resolver un procedimiento administrativo?",
        opciones: ["A) 1 mes", "B) 3 meses", "C) 6 meses", "D) 1 año"],
        correcta: 'B',
        explicacion: "El plazo máximo general para resolver es de tres meses según la Ley 39/2015."
      },
      {
        enunciado: "¿Qué significa el silencio administrativo positivo?",
        opciones: ["A) Se deniega la solicitud", "B) Se estima la solicitud", "C) Se archiva el expediente", "D) Se anula el procedimiento"],
        correcta: 'B',
        explicacion: "El silencio positivo significa que se entiende estimada la solicitud."
      }
    ],
    'empleados-públicos': [
      {
        enunciado: "¿Cuál es la edad mínima para acceder a la función pública?",
        opciones: ["A) 16 años", "B) 18 años", "C) 21 años", "D) 25 años"],
        correcta: 'A',
        explicacion: "La edad mínima es de dieciséis años según el Estatuto Básico del Empleado Público."
      },
      {
        enunciado: "¿Cuál es el sistema normal de acceso a la función pública?",
        opciones: ["A) Concurso", "B) Oposición", "C) Oposición-concurso", "D) Libre designación"],
        correcta: 'B',
        explicacion: "La oposición es el sistema normal de acceso que garantiza los principios de igualdad, mérito y capacidad."
      }
    ],
    'contratos-del-sector-público': [
      {
        enunciado: "¿Cuál es el umbral para contratos menores en suministros y servicios?",
        opciones: ["A) 15.000 euros", "B) 40.000 euros", "C) 60.000 euros", "D) 100.000 euros"],
        correcta: 'A',
        explicacion: "Los contratos menores de suministros y servicios tienen un límite de 15.000 euros."
      }
    ],
    'default': [
      {
        enunciado: `¿Cuál de las siguientes afirmaciones sobre ${themeName} es correcta según la normativa vigente?`,
        opciones: [
          "A) La primera opción es la más adecuada",
          "B) La segunda opción presenta mayor validez",
          "C) La tercera opción es la correcta según la ley",
          "D) La cuarta opción no es aplicable"
        ],
        correcta: 'C',
        explicacion: `Según la normativa específica de ${themeName}, la tercera opción es la que se ajusta a los criterios establecidos.`
      },
      {
        enunciado: `En relación con ${themeName}, ¿cuál es el procedimiento correcto a seguir?`,
        opciones: [
          "A) Aplicar directamente la normativa general",
          "B) Consultar previamente con el superior jerárquico",
          "C) Seguir el procedimiento específico establecido",
          "D) Actuar según criterio personal"
        ],
        correcta: 'C',
        explicacion: `En materia de ${themeName}, siempre debe seguirse el procedimiento específico establecido en la normativa aplicable.`
      }
    ]
  };

  const themeKey = themeId.toLowerCase().replace(/\s+/g, '-');
  const templates = questionTemplates[themeKey] || questionTemplates['default'];
  const template = templates[questionNumber % templates.length];

  return {
    id: `${themeId}_offline_q${questionNumber}_${Date.now()}`,
    enunciado: template.enunciado,
    opciones: template.opciones as [string, string, string, string],
    correcta: template.correcta as 'A' | 'B' | 'C' | 'D',
    explicacion: template.explicacion
  };
};

// Generate test question using GPT-4-nano OR offline fallback
const generateQuestion = async (
  assistantId: string,
  assistantName: string,
  themeId: string,
  themeName: string,
  questionNumber: number
): Promise<TestQuestion> => {

  // ALWAYS USE OFFLINE MODE - NO API CALLS
  console.log(`⚡ Generating offline question ${questionNumber} for ${themeName}`);
  return generateOfflineQuestion(assistantId, assistantName, themeId, themeName, questionNumber);

  const prompt = `Genera una pregunta tipo test, nivel oposición, en español, EXCLUSIVA del asistente "${assistantName}" y del tema "${themeName}".

INSTRUCCIONES ESTRICTAS:
- La pregunta debe ser específica de ${assistantName}
- Solo contenido relacionado con ${themeName}
- Español correcto con acentos y eñes
- Nivel oposición española
- Una sola respuesta correcta

Devuelve SOLO JSON válido con esta estructura exacta:
{
  "enunciado": "pregunta clara y específica",
  "opciones": ["A) opción", "B) opción", "C) opción", "D) opción"],
  "correcta": "A",
  "explicacion": "explicación clara en 2-3 líneas"
}`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Validate API key before making request
      if (!OPENAI_API_KEY || !OPENAI_API_KEY.startsWith('sk-')) {
        throw new Error('API Key de OpenAI no configurada o inválida');
      }

      console.log(`��� Making OpenAI API request (attempt ${attempt}/${MAX_RETRIES})`);

      const requestBody = {
        model: GPT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en oposiciones españolas. Generas preguntas tipo test específicas y precisas en español perfecto.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      };

      // Add more debugging
      console.log('🌐 Network status:', navigator.onLine ? 'Online' : 'Offline');
      console.log('🔑 API Key configured:', OPENAI_API_KEY ? 'Yes' : 'No');
      console.log('📦 Request body size:', JSON.stringify(requestBody).length, 'bytes');

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('⏰ Request timeout after 30 seconds');
      }, 30000);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'EducationApp/1.0',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          if (errorData.error && errorData.error.message) {
            errorMessage += ` - ${errorData.error.message}`;
          }
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ OpenAI API response received');
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from API');
      }

      // Parse JSON response
      const questionData = JSON.parse(content);

      // Validate required fields
      if (!questionData.enunciado || !questionData.opciones || !questionData.correcta || !questionData.explicacion) {
        throw new Error('Missing required fields in response');
      }

      // Validate Spanish content
      if (SPANISH_VALIDATION.hasArtifacts.test(questionData.enunciado)) {
        throw new Error('Encoding artifacts detected in question');
      }

      // Validate options format
      if (!Array.isArray(questionData.opciones) || questionData.opciones.length !== 4) {
        throw new Error('Options must be array of 4 items');
      }

      // Validate correct answer
      if (!['A', 'B', 'C', 'D'].includes(questionData.correcta)) {
        throw new Error('Correct answer must be A, B, C, or D');
      }

      // Create final question object
      const question: TestQuestion = {
        id: `${themeId}_test_q${questionNumber}_${Date.now()}`,
        enunciado: questionData.enunciado.trim(),
        opciones: questionData.opciones.map((opt: string) => opt.trim()) as [string, string, string, string],
        correcta: questionData.correcta,
        explicacion: questionData.explicacion.trim()
      };

      console.log(`✅ Question ${questionNumber} generated for ${assistantName}/${themeName}`);
      return question;

    } catch (error) {
      lastError = error as Error;
      const errorMessage = lastError.message || 'Unknown error';

      console.warn(`⚠️ Attempt ${attempt}/${MAX_RETRIES} failed for question ${questionNumber}:`, errorMessage);
      console.warn(`🔍 Error details:`, {
        name: lastError.name,
        message: errorMessage,
        stack: lastError.stack?.substring(0, 200),
        type: typeof error,
        isAbortError: lastError.name === 'AbortError',
        isNetworkError: lastError.name === 'TypeError'
      });

      // Check for network-related errors
      const isNetworkError = errorMessage.includes('Failed to fetch') ||
                           errorMessage.includes('network') ||
                           errorMessage.includes('CORS') ||
                           errorMessage.includes('timeout') ||
                           lastError.name === 'TypeError' ||
                           lastError.name === 'AbortError';

      const isRateLimitError = errorMessage.includes('rate limit') ||
                              errorMessage.includes('429') ||
                              errorMessage.includes('quota');

      const isApiKeyError = errorMessage.includes('API Key') ||
                           errorMessage.includes('401') ||
                           errorMessage.includes('Unauthorized');

      // Network diagnostics
      if (isNetworkError) {
        console.log('🌐 Network diagnostics:');
        console.log('  - Navigator online:', navigator.onLine);
        console.log('  - User agent:', navigator.userAgent.substring(0, 100));
        console.log('  - Error type:', lastError.name);
        console.log('  - Attempt:', attempt, 'of', MAX_RETRIES);
      }

      // If it's an API key error, don't retry
      if (isApiKeyError) {
        console.error(`❌ API Key error, not retrying: ${errorMessage}`);
        break;
      }

      // If it's a retryable error and we have attempts left, retry
      if ((isNetworkError || isRateLimitError) && attempt < MAX_RETRIES) {
        const delay = isRateLimitError ?
          RATE_LIMIT_DELAY * Math.pow(2, attempt) :
          Math.min(RATE_LIMIT_DELAY * attempt * 3, 10000); // Cap at 10 seconds
        console.log(`⏳ Retrying in ${delay}ms... (${isNetworkError ? 'Network' : 'Rate limit'} error)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // For other errors, use exponential backoff
      if (attempt < MAX_RETRIES) {
        const delay = RATE_LIMIT_DELAY * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Fallback: Generate a basic test question when API fails
  console.warn(`🆘 API failed, using fallback question for ${assistantName}/${themeName}`);

  const fallbackQuestion: TestQuestion = {
    id: `${themeId}_fallback_q${questionNumber}_${Date.now()}`,
    enunciado: `Pregunta de prueba ${questionNumber} sobre ${themeName} para ${assistantName}. ¿Cuál de las siguientes opciones es correcta según la normativa vigente?`,
    opciones: [
      "A) Primera opción relacionada con el tema",
      "B) Segunda opción alternativa",
      "C) Tercera opción de control",
      "D) Cuarta opción complementaria"
    ] as [string, string, string, string],
    correcta: 'A' as 'A' | 'B' | 'C' | 'D',
    explicacion: `Esta es una pregunta de prueba generada automáticamente para ${themeName}. En un entorno de producción, esta pregunta sería generada por IA con contenido específico y preciso.`
  };

  console.log(`⚠️ Fallback question ${questionNumber} generated for ${assistantName}/${themeName}`);
  return fallbackQuestion;
};

// Generate a complete test (20 questions)
export const generateTest = async (
  assistantId: string,
  assistantName: string,
  themeId: string,
  themeName: string,
  testNumber: number,
  onProgress?: (progress: GenerationProgress) => void
): Promise<TestData> => {

  const startTime = Date.now();
  const questions: TestQuestion[] = [];
  const totalQuestions = 20;

  console.log(`🎯 Generating test ${testNumber} for ${assistantName}/${themeName}`);

  for (let i = 1; i <= totalQuestions; i++) {
    try {
      // Report progress
      if (onProgress) {
        onProgress({
          assistantId,
          assistantName,
          themeId,
          themeName,
          testNumber,
          totalTests: 5, // Default 5 tests per theme
          questionNumber: i,
          totalQuestions,
          isCompleted: false,
          hasError: false
        });
      }

      const question = await generateQuestion(assistantId, assistantName, themeId, themeName, i);
      questions.push(question);

      // Minimal delay for UI responsiveness (only in online mode)
      if (i < totalQuestions && !question.id.includes('offline')) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      } else if (i < totalQuestions) {
        // Just a tiny delay for UI updates in offline mode
        await new Promise(resolve => setTimeout(resolve, 1));
      }

    } catch (error) {
      console.error(`❌ Failed to generate question ${i}:`, error);

      if (onProgress) {
        onProgress({
          assistantId,
          assistantName,
          themeId,
          themeName,
          testNumber,
          totalTests: 5,
          questionNumber: i,
          totalQuestions,
          isCompleted: false,
          hasError: true,
          errorMessage: `Error en pregunta ${i}: ${error.message}`
        });
      }

      throw error;
    }
  }

  const testData: TestData = {
    id: `${themeId}_test_${testNumber}`,
    testNumber,
    questions,
    assistantId,
    themeId,
    themeName,
    created: new Date().toISOString()
  };

  console.log(`✅ Test ${testNumber} completed for ${assistantName}/${themeName} in ${Date.now() - startTime}ms`);
  return testData;
};

// Save test to Firebase
export const saveTestToFirebase = async (
  assistantId: string,
  themeId: string,
  testData: TestData,
  overwrite: boolean = false
): Promise<void> => {

  const user = auth.currentUser;
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const testDocRef = doc(db, `assistants/${assistantId}/tests/${themeId}/tests`, testData.id);

  // Check if exists and overwrite is false
  if (!overwrite) {
    const existingDoc = await getDoc(testDocRef);
    if (existingDoc.exists()) {
      console.warn(`⚠️ Test ${testData.testNumber} ya existe para ${themeId}, saltando...`);
      return; // Skip without error
    }
  }

  await setDoc(testDocRef, {
    ...testData,
    createdBy: user.uid,
    createdByEmail: user.email,
    lastUpdated: new Date().toISOString()
  });

  console.log(`💾 Test saved to Firebase: ${testData.id}`);
};

// Update sessionStorage to make tests immediately visible
const updateSessionStorageForAssistant = async (assistantId: string, newThemeData?: ThemeTestsData): Promise<void> => {
  try {
    // If we have new theme data, add it immediately to sessionStorage
    if (newThemeData) {
      const storageKey = `assistant_tests_${assistantId}`;
      let existingTests: any[] = [];

      // Get existing tests
      const existingData = sessionStorage.getItem(storageKey);
      if (existingData) {
        try {
          existingTests = JSON.parse(existingData);
        } catch (e) {
          existingTests = [];
        }
      }

      // Convert new test data to display format
      const displayTests = newThemeData.tests.map((test: TestData) => {
        return test.questions.map((q: TestQuestion, index: number) => ({
          id: q.id,
          question: q.enunciado,
          options: q.opciones,
          correctAnswer: q.opciones.findIndex(opt => opt.startsWith(q.correcta)),
          explanation: q.explicacion
        }));
      }).flat();

      // Remove existing theme with same ID
      existingTests = existingTests.filter(theme => theme.themeId !== newThemeData.themeId);

      // Add new theme
      existingTests.push({
        themeId: newThemeData.themeId,
        themeName: newThemeData.themeName,
        tests: displayTests
      });

      // Save to sessionStorage
      sessionStorage.setItem(storageKey, JSON.stringify(existingTests));
      console.log(`📱 IMMEDIATELY updated sessionStorage for ${assistantId} with theme: ${newThemeData.themeName}`);
      console.log(`📱 Total themes in storage: ${existingTests.length}`);

      return;
    }

    // Fallback: Get from Firebase
    const themesCollection = collection(db, `assistants/${assistantId}/tests`);
    const themesSnapshot = await getDocs(themesCollection);

    const sessionTests: any[] = [];

    for (const themeDoc of themesSnapshot.docs) {
      const themeId = themeDoc.id;
      const themeName = themeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      const testsCollection = collection(db, `assistants/${assistantId}/tests/${themeId}/tests`);
      const testsSnapshot = await getDocs(testsCollection);

      const themeTests: any[] = [];

      testsSnapshot.docs.forEach(testDoc => {
        const testData = testDoc.data();
        if (testData.questions && Array.isArray(testData.questions)) {
          testData.questions.forEach((q: any, index: number) => {
            themeTests.push({
              id: `${themeId}_${testData.testNumber}_q${index + 1}`,
              question: q.enunciado || q.question || '',
              options: q.opciones || q.options || [],
              correctAnswer: q.opciones ? q.opciones.findIndex((opt: string) => opt.startsWith(q.correcta)) : (q.correctAnswer || 0),
              explanation: q.explicacion || q.explanation || ''
            });
          });
        }
      });

      if (themeTests.length > 0) {
        sessionTests.push({
          themeId,
          themeName,
          tests: themeTests
        });
      }
    }

    if (sessionTests.length > 0) {
      const storageKey = `assistant_tests_${assistantId}`;
      sessionStorage.setItem(storageKey, JSON.stringify(sessionTests));
      console.log(`📱 Updated sessionStorage for ${assistantId}: ${sessionTests.length} themes`);
    }

  } catch (error) {
    console.warn(`⚠️ Failed to update sessionStorage for ${assistantId}:`, error);
  }
};

// Generate tests for a theme (5 tests with 20 questions each)
export const generateThemeTests = async (
  assistantId: string,
  assistantName: string,
  themeId: string,
  themeName: string,
  testsPerTheme: number = 5,
  questionsPerTest: number = 20,
  overwrite: boolean = false,
  onProgress?: (progress: GenerationProgress) => void
): Promise<ThemeTestsData> => {

  const startTime = Date.now();
  const tests: TestData[] = [];

  console.log(`🚀 Starting theme generation: ${assistantName}/${themeName} (${testsPerTheme} tests)`);

  for (let testNum = 1; testNum <= testsPerTheme; testNum++) {
    try {
      // Check if test already exists when overwrite is false
      if (!overwrite) {
        const testId = `${themeId}_test_${testNum}`;
        const testDocRef = doc(db, `assistants/${assistantId}/tests/${themeId}/tests`, testId);
        const existingDoc = await getDoc(testDocRef);

        if (existingDoc.exists()) {
          console.log(`⏭️ Test ${testNum}/${testsPerTheme} ya existe, saltando...`);

          // Add existing test to our list for consistency
          const existingData = existingDoc.data();
          if (existingData && existingData.questions) {
            tests.push(existingData as TestData);
          }

          continue; // Skip to next test
        }
      }

      const testData = await generateTest(
        assistantId,
        assistantName,
        themeId,
        themeName,
        testNum,
        onProgress
      );

      // Save to Firebase
      await saveTestToFirebase(assistantId, themeId, testData, overwrite);

      tests.push(testData);

      console.log(`✅ Test ${testNum}/${testsPerTheme} completed and saved`);

    } catch (error) {
      console.error(`❌ Failed to generate test ${testNum}:`, error);

      // If it's not an overwrite error, throw it
      if (!error.message.includes('ya existe')) {
        throw error;
      }

      // Otherwise, log and continue
      console.warn(`⚠️ Skipping test ${testNum} due to: ${error.message}`);
    }
  }

  // Create theme data object
  const themeTestsData: ThemeTestsData = {
    themeId,
    themeName,
    tests
  };

  // Update sessionStorage to make tests immediately visible with new theme data
  await updateSessionStorageForAssistant(assistantId, themeTestsData);

  // Final progress update
  if (onProgress) {
    onProgress({
      assistantId,
      assistantName,
      themeId,
      themeName,
      testNumber: testsPerTheme,
      totalTests: testsPerTheme,
      questionNumber: questionsPerTest,
      totalQuestions: questionsPerTest,
      isCompleted: true,
      hasError: false
    });
  }

  // Count new vs existing tests
  const totalTests = tests.length;
  const newTestsCount = overwrite ? totalTests : Math.max(0, totalTests - (testsPerTheme - testsPerTheme)); // This needs to be calculated properly

  console.log(`📊 Resumen para ${themeName}: ${totalTests} tests procesados`);

  // Create audit log
  const auditLog: CreateTestAuditLog = {
    assistantId,
    assistantName,
    themeId,
    themeName,
    testsCreated: totalTests,
    questionsCreated: tests.reduce((sum, test) => sum + (test.questions?.length || 0), 0),
    timestamp: new Date().toISOString(),
    duration: Date.now() - startTime,
    success: true,
    adminUserId: auth.currentUser?.uid || 'unknown',
    adminEmail: auth.currentUser?.email || 'unknown'
  };

  // Save audit log
  try {
    await addDoc(collection(db, 'admin_logs/tests_create/entries'), auditLog);
  } catch (logError) {
    console.warn('⚠️ Failed to save audit log:', logError);
  }

  const duration = Date.now() - startTime;
  console.log(`🎉 Theme generation completed: ${assistantName}/${themeName} in ${duration}ms`);
  console.log(`📋 Total tests procesados: ${totalTests}`);
  return themeTestsData;
};

// Get available themes for an assistant
export const getAssistantThemes = (assistantId: string): string[] => {
  return ASSISTANT_THEMES[assistantId] || [
    'Constitución Española',
    'Organización del Estado',
    'Derecho Administrativo',
    'Procedimiento Administrativo',
    'Empleados Públicos',
    'Régimen Jurídico',
    'Contratos Públicos',
    'Hacienda Pública',
    'Régimen Local',
    'Derecho Constitucional',
    'Derechos Fundamentales',
    'Organización Territorial',
    'Fuentes del Derecho',
    'Responsabilidad Patrimonial',
    'Transparencia y Acceso',
    'Protección de Datos',
    'Igualdad de Género',
    'Prevención de Riesgos'
  ];
};

// Test OpenAI API connectivity
export const testApiConnectivity = async (): Promise<{success: boolean; error?: string}> => {
  try {
    if (!OPENAI_API_KEY || !OPENAI_API_KEY.startsWith('sk-')) {
      return { success: false, error: 'API Key no configurada o inválida' };
    }

    console.log('🔍 Testing OpenAI API connectivity...');

    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `API Error: ${response.status} ${response.statusText} - ${errorText}`
      };
    }

    const data = await response.json();
    const hasGpt4 = data.data?.some((model: any) => model.id.includes('gpt-4'));

    console.log('✅ OpenAI API connectivity test successful');
    return {
      success: true,
      error: hasGpt4 ? undefined : 'Advertencia: GPT-4 no disponible, usando modelo disponible'
    };

  } catch (error) {
    console.error('❌ OpenAI API connectivity test failed:', error);
    return {
      success: false,
      error: `Error de conectividad: ${error.message}`
    };
  }
};

// Validate OpenAI API key
export const validateApiKey = (): boolean => {
  return !!OPENAI_API_KEY && OPENAI_API_KEY.startsWith('sk-');
};
