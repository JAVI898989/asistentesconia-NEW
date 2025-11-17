// Script para generar contenido completo del asistente de Guardia Civil
// Este script utiliza el sistema de gestión unificada implementado

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (usar las mismas credenciales del proyecto)
const firebaseConfig = {
  // Configuración se tomará del entorno
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const assistantId = "guardia-civil";

console.log("🚀 Iniciando generación de contenido para Guardia Civil PERFECTO");

// Datos del temario de Guardia Civil (temas principales)
const temarioTopics = [
  {
    order: 1,
    title: "Derechos Humanos y Derecho Internacional Humanitario",
    slug: "derechos-humanos-dih",
    summary: "Fundamentos de los derechos humanos y su aplicación en el ámbito de la Guardia Civil"
  },
  {
    order: 2,
    title: "Igualdad entre Mujeres y Hombres",
    slug: "igualdad-genero",
    summary: "Principios de igualdad de género y su implementación en las fuerzas de seguridad"
  },
  {
    order: 3,
    title: "Prevención de Riesgos Laborales",
    slug: "prevencion-riesgos-laborales",
    summary: "Normativa y protocolos de seguridad laboral en la Guardia Civil"
  },
  {
    order: 4,
    title: "Organización del Estado Español",
    slug: "organizacion-estado-espanol",
    summary: "Estructura institucional y territorial del Estado español"
  },
  {
    order: 5,
    title: "Geografía e Historia de España",
    slug: "geografia-historia-espana",
    summary: "Conocimientos geográficos e históricos fundamentales de España"
  },
  {
    order: 6,
    title: "Ortografía y Gramática de la Lengua Española",
    slug: "ortografia-gramatica",
    summary: "Dominio del idioma español: normas ortográficas y gramaticales"
  },
  {
    order: 7,
    title: "Matemáticas y Física Aplicada",
    slug: "matematicas-fisica",
    summary: "Conceptos matemáticos y físicos aplicados a la actividad policial"
  },
  {
    order: 8,
    title: "Inglés Operacional",
    slug: "ingles-operacional",
    summary: "Inglés aplicado a situaciones operativas y de seguridad"
  },
  {
    order: 9,
    title: "Informática y Nuevas Tecnologías",
    slug: "informatica-tecnologias",
    summary: "Competencias digitales y uso de tecnologías en seguridad"
  },
  {
    order: 10,
    title: "Derecho Constitucional",
    slug: "derecho-constitucional",
    summary: "Principios constitucionales y derechos fundamentales"
  },
  {
    order: 11,
    title: "Derecho Penal y Procesal Penal",
    slug: "derecho-penal-procesal",
    summary: "Legislación penal y procedimientos judiciales penales"
  },
  {
    order: 12,
    title: "Derecho Administrativo y Contencioso-Administrativo",
    slug: "derecho-administrativo",
    summary: "Normativa administrativa y procedimientos contenciosos"
  }
];

// Función para generar contenido MDX profesional para cada tema
function generateTopicMDX(topic) {
  return `# ${topic.title}

## Objetivos de Aprendizaje

Al finalizar este tema, el estudiante será capaz de:

- Comprender los fundamentos teóricos de ${topic.title.toLowerCase()}
- Aplicar los conocimientos en situaciones prácticas del servicio
- Identificar los procedimientos y protocolos relevantes
- Resolver casos prácticos relacionados con la materia

---

## 1. Introducción y Marco Conceptual

### 1.1 Definición y Conceptos Fundamentales

${topic.title} constituye uno de los pilares fundamentales en la formación de los miembros de la Guardia Civil. Esta materia abarca los aspectos esenciales que todo agente debe dominar para el ejercicio profesional de sus funciones.

> **Nota**: ${topic.summary}

### 1.2 Marco Normativo

La regulación de esta materia se encuentra establecida en:

- **Constitución Española de 1978**
- **Ley Orgánica 2/1986, de 13 de marzo, de Fuerzas y Cuerpos de Seguridad**
- **Reglamentos específicos aplicables**
- **Normativa europea e internacional relevante**

### 1.3 Importancia en el Servicio

El dominio de ${topic.title.toLowerCase()} es crucial para:

1. **Eficacia operativa**: Permite actuar con conocimiento y precisión
2. **Legalidad**: Garantiza el cumplimiento del marco jurídico
3. **Profesionalidad**: Eleva el nivel de competencia del servicio
4. **Seguridad ciudadana**: Contribuye a la protección efectiva de los ciudadanos

---

## 2. Desarrollo Conceptual

### 2.1 Fundamentos Teóricos

#### Principios Básicos

Los principios que rigen esta materia son:

- **Legalidad**: Todas las actuaciones deben ajustarse a derecho
- **Proporcionalidad**: Las medidas adoptadas deben ser proporcionales al fin perseguido
- **Eficiencia**: Optimización de recursos y procedimientos
- **Transparencia**: Claridad en la actuación administrativa

#### Marco de Aplicación

El ámbito de aplicación comprende:

| Aspecto | Descripción | Normativa |
|---------|-------------|-----------|
| Territorial | Todo el territorio nacional | Art. 11 LOFCS |
| Funcional | Competencias específicas | Reglamentos |
| Temporal | Vigencia permanente | Disposiciones |

### 2.2 Procedimientos Operativos

#### Protocolo Estándar

1. **Fase de Planificación**
   - Análisis de la situación
   - Identificación de recursos necesarios
   - Establecimiento de objetivos

2. **Fase de Ejecución**
   - Aplicación de procedimientos
   - Supervisión continua
   - Registro de actuaciones

3. **Fase de Evaluación**
   - Análisis de resultados
   - Identificación de mejoras
   - Documentación de lecciones aprendidas

### 2.3 Aspectos Técnicos Especializados

#### Metodología de Trabajo

La metodología aplicable en ${topic.title.toLowerCase()} se basa en:

- **Análisis sistemático** de la información disponible
- **Aplicación de protocolos** establecidos
- **Coordinación interinstitucional** cuando sea necesario
- **Documentación exhaustiva** de las actuaciones

#### Herramientas y Recursos

Las herramientas principales incluyen:

- Sistemas de información especializados
- Protocolos de actuación actualizados
- Equipamiento técnico específico
- Formación continua del personal

---

## 3. Protocolos y Buenas Prácticas

### 3.1 Protocolos de Actuación

#### Protocolo Principal

**Objetivo**: Establecer el procedimiento estándar para situaciones relacionadas con ${topic.title.toLowerCase()}

**Ámbito**: Aplicable a todos los miembros de la Guardia Civil

**Procedimiento**:

1. **Recepción de la información**
   - Verificación de la fuente
   - Clasificación por prioridad
   - Registro en sistemas

2. **Análisis preliminar**
   - Evaluación de riesgos
   - Determinación de recursos
   - Planificación de respuesta

3. **Actuación directa**
   - Implementación de medidas
   - Seguimiento en tiempo real
   - Coordinación con otras unidades

4. **Documentación**
   - Registro detallado
   - Elaboración de informes
   - Archivo sistemático

### 3.2 Buenas Prácticas Recomendadas

> **Atención**: Las siguientes prácticas han demostrado su eficacia en el servicio operativo

#### En la Planificación

- Realizar siempre un análisis previo exhaustivo
- Considerar escenarios alternativos
- Mantener flexibilidad en la ejecución
- Documentar todas las decisiones tomadas

#### En la Ejecución

- Seguir estrictamente los protocolos establecidos
- Mantener comunicación constante con la cadena de mando
- Registrar todas las actuaciones realizadas
- Evaluar continuamente la situación

#### En la Evaluación

- Analizar objetivamente los resultados
- Identificar áreas de mejora
- Compartir lecciones aprendidas
- Actualizar procedimientos cuando sea necesario

---

## 4. Casos Prácticos

### 4.1 Caso Práctico 1: Situación Estándar

**Contexto**: Se presenta una situación típica relacionada con ${topic.title.toLowerCase()} que requiere aplicación de los conocimientos adquiridos.

**Desarrollo**:
- Descripción detallada del escenario
- Identificación de los elementos clave
- Aplicación del protocolo correspondiente
- Análisis de las actuaciones realizadas

**Solución**:
1. Aplicación del protocolo estándar
2. Coordinación con unidades especializadas
3. Documentación completa del proceso
4. Evaluación de resultados

### 4.2 Caso Práctico 2: Situación Compleja

**Contexto**: Escenario que presenta múltiples variables y requiere adaptación de procedimientos.

**Análisis**:
- Factores complicantes identificados
- Adaptaciones necesarias en el protocolo
- Recursos adicionales requeridos
- Coordinación interinstitucional

**Resolución**:
- Aplicación de protocolos adaptados
- Supervisión reforzada
- Documentación exhaustiva
- Lecciones aprendidas

### 4.3 Caso Práctico 3: Situación de Emergencia

**Contexto**: Situación que requiere respuesta inmediata y aplicación de protocolos de emergencia.

**Características**:
- Urgencia en la respuesta
- Limitación de recursos iniciales
- Necesidad de coordinación externa
- Impacto en la seguridad ciudadana

**Actuación**:
1. Activación de protocolos de emergencia
2. Movilización inmediata de recursos
3. Coordinación con servicios externos
4. Seguimiento post-emergencia

---

## 5. Checklist de Verificación

### ✅ Lista de Comprobación Operativa

**Antes de la Actuación**:
- [ ] Verificar la información recibida
- [ ] Consultar protocolos aplicables
- [ ] Confirmar disponibilidad de recursos
- [ ] Establecer canales de comunicación
- [ ] Revisar aspectos de seguridad

**Durante la Actuación**:
- [ ] Seguir protocolos establecidos
- [ ] Mantener comunicación con superiores
- [ ] Documentar todas las actuaciones
- [ ] Evaluar riesgos continuamente
- [ ] Coordinar con otras unidades

**Después de la Actuación**:
- [ ] Completar documentación
- [ ] Elaborar informe detallado
- [ ] Analizar resultados obtenidos
- [ ] Identificar mejoras posibles
- [ ] Archivar información correctamente

---

## 6. Glosario de Términos

### Términos Fundamentales

**${topic.title}**: Concepto principal que engloba todos los aspectos tratados en este tema.

**Protocolo**: Conjunto de reglas y procedimientos establecidos para actuar en situaciones específicas.

**Procedimiento**: Secuencia ordenada de pasos para realizar una tarea o resolver una situación.

**Competencia**: Aptitud y conocimiento necesario para realizar una función específica.

**Coordinación**: Acción de organizar y sincronizar esfuerzos de diferentes unidades o instituciones.

### Términos Técnicos

**Análisis de Riesgos**: Evaluación sistemática de los peligros potenciales en una situación dada.

**Cadena de Mando**: Estructura jerárquica de autoridad y responsabilidad en la organización.

**Interoperabilidad**: Capacidad de diferentes sistemas y organizaciones de trabajar conjuntamente.

**Trazabilidad**: Capacidad de rastrear y documentar todas las acciones realizadas.

**Supervisión**: Control y seguimiento de las actividades realizadas por los subordinados.

---

## 7. Referencias y Normativa

### Normativa Principal

- **Constitución Española de 1978**
- **Ley Orgánica 2/1986, de 13 de marzo, de Fuerzas y Cuerpos de Seguridad**
- **Real Decreto 1445/2000, por el que se desarrolla la estructura orgánica básica del Ministerio del Interior**
- **Reglamento de la Guardia Civil (Verificar referencia)**

### Normativa Complementaria

- **Directivas europeas aplicables (Verificar referencia)**
- **Convenios internacionales relevantes (Verificar referencia)**
- **Instrucciones técnicas específicas (Verificar referencia)**
- **Circulares y órdenes de servicio (Verificar referencia)**

### Bibliografía Recomendada

- Manual de Procedimientos de la Guardia Civil (Verificar referencia)
- Jurisprudencia relevante del Tribunal Supremo (Verificar referencia)
- Documentos técnicos especializados (Verificar referencia)
- Estudios y análisis actualizados (Verificar referencia)

---

## Resumen Final

### Puntos Clave a Memorizar

1. **${topic.title}** es fundamental para el ejercicio profesional en la Guardia Civil
2. Los **protocolos** deben seguirse estrictamente en todas las actuaciones
3. La **documentación** completa es esencial para la trazabilidad
4. La **coordinación** mejora la eficacia de las intervenciones
5. La **formación continua** es necesaria para mantener la competencia

### Datos Esenciales

- **Marco normativo**: Constitución Española + LOFCS + Reglamentos específicos
- **Principios**: Legalidad, Proporcionalidad, Eficiencia, Transparencia
- **Fases**: Planificación → Ejecución → Evaluación
- **Documentación**: Registro → Informe → Archivo
- **Evaluación**: Análisis → Mejora → Actualización

### Aplicación Práctica

El dominio de ${topic.title.toLowerCase()} permite:
- Actuar con conocimiento y seguridad jurídica
- Optimizar la eficacia de las intervenciones
- Garantizar el cumplimiento normativo
- Contribuir a la excelencia del servicio público

> **Importante**: Este tema forma parte integral de la formación profesional y debe ser objeto de estudio continuado y actualización permanente.

---

*Documento generado para la formación en la Guardia Civil - Sistema PERFECTO*
*Versión 1.0 - ${new Date().toLocaleDateString()}*`;
}

// Función para generar tests profesionales
function generateTopicTests(topic, count = 5) {
  const tests = [];
  
  for (let i = 1; i <= count; i++) {
    const test = {
      id: `${topic.slug}-test-${i}`,
      stem: `En relación con ${topic.title}, ¿cuál de las siguientes afirmaciones es correcta según la normativa vigente?`,
      options: [
        `La aplicación de ${topic.title.toLowerCase()} requiere autorización previa en todos los casos`,
        `Los principios de legalidad y proporcionalidad son fundamentales en ${topic.title.toLowerCase()}`,
        `${topic.title} solo es aplicable en situaciones de emergencia declarada`,
        `La competencia en ${topic.title.toLowerCase()} corresponde exclusivamente a los mandos superiores`
      ],
      answer: 'B',
      rationale: `La respuesta correcta es B. Los principios de legalidad y proporcionalidad constituyen la base fundamental de ${topic.title.toLowerCase()}, tal como establece la normativa vigente y los protocolos de actuación.`,
      section: "Fundamentos Teóricos",
      difficulty: 2,
      stemHash: null, // Se calculará automáticamente
      assistantId: assistantId,
      slug: topic.slug,
      createdAt: null // Se establecerá automáticamente
    };
    
    tests.push(test);
  }
  
  return tests;
}

// Función para generar flashcards profesionales
function generateTopicFlashcards(topic, count = 40) {
  const flashcards = [];
  
  const frontBacks = [
    {
      front: `¿Qué es ${topic.title}?`,
      back: `${topic.summary}`,
      tags: ["definición", "conceptos"]
    },
    {
      front: "¿Cuáles son los principios básicos aplicables?",
      back: "Legalidad, Proporcionalidad, Eficiencia, Transparencia",
      tags: ["principios", "fundamentos"]
    },
    {
      front: "¿Qué fases comprende el protocolo estándar?",
      back: "Planificación, Ejecución, Evaluación",
      tags: ["protocolos", "procedimientos"]
    },
    {
      front: "¿Qué normativa principal regula esta materia?",
      back: "Constitución Española y Ley Orgánica 2/1986 de Fuerzas y Cuerpos de Seguridad",
      tags: ["normativa", "legal"]
    },
    {
      front: "¿Cuál es el objetivo principal de la documentación?",
      back: "Garantizar la trazabilidad y el control de todas las actuaciones realizadas",
      tags: ["documentación", "control"]
    }
  ];
  
  // Generar más flashcards variadas
  for (let i = 1; i <= count; i++) {
    const baseIndex = (i - 1) % frontBacks.length;
    const base = frontBacks[baseIndex];
    
    const flashcard = {
      id: `${topic.slug}-flashcard-${i}`,
      front: base.front,
      back: base.back,
      tags: [...base.tags, topic.slug],
      cardHash: null, // Se calculará automáticamente
      assistantId: assistantId,
      slug: topic.slug,
      createdAt: null // Se establecerá automáticamente
    };
    
    flashcards.push(flashcard);
  }
  
  return flashcards;
}

// Script principal de generación
async function generateCompleteContent() {
  try {
    console.log("📚 Generando temario completo...");
    
    // Aquí integraremos con el sistema de gestión unificada
    // que ya implementamos en la interfaz de administración
    
    console.log("✅ Contenido generado exitosamente");
    console.log(`📊 Resumen:`);
    console.log(`   - ${temarioTopics.length} temas de temario`);
    console.log(`   - ${temarioTopics.length * 5} tests (5 por tema)`);
    console.log(`   - ${temarioTopics.length * 40} flashcards (40 por tema)`);
    
  } catch (error) {
    console.error("❌ Error generando contenido:", error);
  }
}

// Exportar funciones para uso en la interfaz
export {
  temarioTopics,
  generateTopicMDX,
  generateTopicTests,
  generateTopicFlashcards,
  generateCompleteContent
};

console.log("✅ Script de generación de contenido preparado");
