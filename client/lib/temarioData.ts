import { AssistantTemario, TemarioTopic } from "./firebaseData";

// Temario completo para Auxiliar Administrativo del Estado
export const auxiliarAdministrativoTemario: AssistantTemario = {
  assistantId: "auxiliar-administrativo-estado",
  assistantName: "Auxiliar Administrativo del Estado",
  category: "administracion",
  totalTopics: 25,
  estimatedStudyTime: "6-8 meses",
  lastUpdated: "2025-01-01",
  topics: [
    {
      id: "tema-1",
      title: "La Constitución Española de 1978",
      description:
        "Estructura, principios fundamentales y derechos constitucionales",
      estimatedTime: "2-3 semanas",
      difficulty: "básico",
      order: 1,
      content: `TEMA 1: LA CONSTITUCIÓN ESPAÑOLA DE 1978

1. ANTECEDENTES HISTÓRICOS

1.1 El proceso constituyente
- Contexto histórico: Transición democrática tras la dictadura franquista
- Proceso de elaboración: 
  - Comisión de Asuntos Constitucionales y Libertades Públicas
  - Ponencia constitucional (7 miembros)
  - Deliberaciones parlamentarias
  - Referéndum del 6 de diciembre de 1978 (87,87% a favor)

1.2 Influencias constitucionales
- Constitución de la II República (1931)
- Constituciones europeas contemporáneas
- Declaración Universal de Derechos Humanos (1948)

2. ESTRUCTURA DE LA CONSTITUCIÓN

2.1 División formal
- Preámbulo: Objetivos y fundamentos
- Parte dogmática (Títulos I-II): Derechos y libertades
- Parte orgánica (Títulos III-IX): Organización del Estado
- 11 Títulos, 169 artículos
- 4 Disposiciones adicionales
- 9 Disposiciones transitorias
- 1 Disposición derogatoria
- 1 Disposición final

3. PRINCIPIOS FUNDAMENTALES (Título Preliminar)

3.1 Artículo 1: Estado social y democrático de Derecho
- Valores superiores:
  - Libertad
  - Justicia
  - Igualdad
  - Pluralismo político
- Soberanía nacional: reside en el pueblo español
- Forma política: Monarquía parlamentaria

3.2 Artículo 2: Unidad de España
- Derecho a la autonomía de nacionalidades y regiones
- Solidaridad entre todas ellas

3.3 Artículo 3: Lenguas
- Castellano como lengua oficial del Estado
- Demás lenguas españolas oficiales en sus respectivas CCAA
- Patrimonio cultural común

4. DERECHOS Y LIBERTADES

4.1 Clasificación constitucional

Derechos fundamentales y libertades públicas (arts. 15-29)
- Derecho a la vida e integridad física y moral
- Libertad ideológica, religiosa y de culto
- Derecho a la libertad y seguridad
- Derecho al honor, intimidad e imagen
- Inviolabilidad del domicilio
- Secreto de las comunicaciones
- Libertad de residencia y circulación
- Libertad de expresión e información
- Derecho de reunión y manifestación
- Derecho de asociación
- Derecho a la participación política
- Derecho a la tutela judicial efectiva
- Principio de legalidad penal

Derechos y deberes de los ciudadanos (arts. 30-38)
- Derecho y deber de defender España
- Derecho al matrimonio
- Derecho a la propiedad privada
- Derecho de fundación
- Derecho al trabajo
- Derecho de petición

4.2 Garantías constitucionales

Garantías normativas
- Reserva de ley orgánica (art. 81)
- Contenido esencial de los derechos (art. 53.1)

Garantías jurisdiccionales
- Protección judicial ordinaria
- Recurso de amparo ante el TC
- Habeas corpus

Garantías institucionales
- Tribunal Constitucional
- Defensor del Pueblo
- Ministerio Fiscal

5. REFORMA CONSTITUCIONAL

5.1 Procedimientos de reforma

Procedimiento ordinario (art. 167)
- Iniciativa: Gobierno, Congreso, Senado, Asambleas autonómicas
- Aprobación por mayoría de 3/5 en cada Cámara
- Referéndum facultativo si lo solicita 1/10 de cualquier Cámara

Procedimiento agravado (art. 168)
- Para revisión total o parcial del Título Preliminar, Título I (Capítulo II, Sección 1ª) o Título II
- Aprobación del principio por mayoría de 2/3 de cada Cámara
- Disolución de las Cortes
- Ratificación por nuevas Cámaras
- Aprobación por mayoría de 2/3 de cada Cámara
- Referéndum obligatorio

5.2 Límites a la reforma
- Límites temporales: No en tiempo de guerra o estados excepcionales
- Límites materiales: Implícitos (valores superiores, dignidad humana)
- Límites formales: Procedimientos establecidos

CASOS PRÁCTICOS

Caso 1: Conflicto de derechos fundamentales
Un periodista publica información sobre la vida privada de un político. ¿Cómo se resuelve el conflicto entre libertad de información y derecho al honor?

Caso 2: Recurso de amparo
Un ciudadano considera vulnerado su derecho a la tutela judicial efectiva. ¿Qué pasos debe seguir para interponer recurso de amparo?

JURISPRUDENCIA RELEVANTE

- STC 25/1981: Concepto de contenido esencial de los derechos
- STC 53/1985: Derecho a la vida del nasciturus
- STC 120/1990: Límites a la libertad de expresión
- STC 214/1991: Derecho a la intimidad vs libertad de información

PREGUNTAS DE AUTOEVALUACIÓN

1. ¿Cuáles son los valores superiores del ordenamiento jurídico español?
2. Explique la diferencia entre derechos fundamentales y derechos de los ciudadanos
3. ¿Qué mayorías se requieren para cada tipo de reforma constitucional?
4. ¿En qué casos es obligatorio el referéndum en la reforma constitucional?
5. Enumere las garantías constitucionales de los derechos fundamentales

NORMATIVA COMPLEMENTARIA

- Ley Orgánica 6/1985, del Poder Judicial
- Ley Orgánica 2/1979, del Tribunal Constitucional
- Ley Orgánica 3/1981, del Defensor del Pueblo
- Ley 62/1978, de Protección Jurisdiccional de los Derechos Fundamentales

Este tema debe estudiarse en profundidad, prestando especial atención a la jurisprudencia constitucional y los casos prácticos.`,
      subtopics: [
        {
          id: "subtema-1-1",
          title: "Antecedentes históricos y proceso constituyente",
          content:
            "Desarrollo detallado del contexto histórico y proceso de elaboración...",
          order: 1,
        },
        {
          id: "subtema-1-2",
          title: "Estructura y contenido de la Constitución",
          content: "Análisis detallado de la estructura formal y material...",
          order: 2,
        },
        {
          id: "subtema-1-3",
          title: "Principios fundamentales del Estado",
          content: "Estudio del Título Preliminar y sus implicaciones...",
          order: 3,
        },
        {
          id: "subtema-1-4",
          title: "Sistema de derechos y libertades",
          content: "Clasificación y régimen jurídico de los derechos...",
          order: 4,
        },
        {
          id: "subtema-1-5",
          title: "Garantías constitucionales",
          content: "Mecanismos de protección de los derechos fundamentales...",
          order: 5,
        },
        {
          id: "subtema-1-6",
          title: "Reforma constitucional",
          content: "Procedimientos y límites de la reforma...",
          order: 6,
        },
      ],
    },
    {
      id: "tema-2",
      title: "La Administración Pública española",
      description:
        "Organización, principios y funcionamiento de la Administración",
      estimatedTime: "2-3 semanas",
      difficulty: "intermedio",
      order: 2,
      content: `TEMA 2: LA ADMINISTRACIÓN PÚBLICA ESPAÑOLA

1. CONCEPTO Y CARACTERES DE LA ADMINISTRACIÓN PÚBLICA

1.1 Concepto de Administración Pública
Criterio orgánico: Conjunto de órganos que ejercen la función administrativa
Criterio funcional: Actividad encaminada a la satisfacción de intereses generales
Criterio formal: Régimen jurídico específico de Derecho Administrativo

1.2 Caracteres de la Administración Pública
- Personalidad jurídica: Capacidad para ser titular de derechos y obligaciones
- Sometimiento al Derecho: Principio de legalidad
- Servicio objetivo al interés general: Art. 103.1 CE
- Eficacia, jerarquía, descentralización: Principios organizativos
- Coordinación: Entre diferentes Administraciones

2. PRINCIPIOS CONSTITUCIONALES (Art. 103 CE)

2.1 Servicio objetivo al interés general
- Imparcialidad en la actuación administrativa
- Prohibición de favoritismos o discriminaciones
- Prevalencia del interés público sobre los particulares

2.2 Eficacia
- Consecución de los objetivos propuestos
- Optimización de recursos
- Rapidez en la tramitación

2.3 Jerarquía
- Organización vertical del poder
- Relaciones de subordinación
- Unidad de dirección

2.4 Descentralización
- Transferencia de competencias
- Acercamiento de la gestión al ciudadano
- Autonomía en la gestión

2.5 Desconcentración
- Traslado del ejercicio de competencias
- Mantenimiento de la titularidad
- Mejora de la eficacia

2.6 Coordinación
- Armonización de actuaciones
- Evitar duplicidades
- Coherencia en las políticas públicas

3. CLASES DE ADMINISTRACIONES PÚBLICAS

3.1 Administración General del Estado (AGE)
Órganos centrales:
- Presidente del Gobierno
- Vicepresidentes
- Ministros
- Secretarios de Estado
- Subsecretarios
- Directores Generales

Órganos territoriales:
- Delegados del Gobierno en las CCAA
- Subdelegados del Gobierno en las provincias

3.2 Administración Autonómica
Órganos de gobierno:
- Presidente de la Comunidad Autónoma
- Consejo de Gobierno
- Consejeros

Administración institucional autonómica:
- Organismos autónomos
- Entidades públicas empresariales
- Fundaciones y consorcios

3.3 Administración Local
Entidades locales básicas:
- Municipios
- Provincias
- Islas (Baleares y Canarias)

Entidades locales de régimen especial:
- Comarcas
- Áreas metropolitanas
- Mancomunidades

3.4 Administración Institucional
Organismos autónomos: Personificación pública, actividades administrativas
Entidades públicas empresariales: Actividades económicas
Fundaciones públicas: Fines de interés general
Consorcios: Participación de diferentes Administraciones

La comprensión de este tema es fundamental para el desarrollo profesional en la Administración Pública.`,
      subtopics: [
        {
          id: "subtema-2-1",
          title: "Concepto y principios constitucionales",
          content:
            "Desarrollo del concepto de Administración y principios del art. 103 CE...",
          order: 1,
        },
        {
          id: "subtema-2-2",
          title: "Organización territorial del Estado",
          content:
            "Estructura y competencias de las diferentes Administraciones...",
          order: 2,
        },
        {
          id: "subtema-2-3",
          title: "Relaciones interadministrativas",
          content:
            "Principios y mecanismos de colaboración entre Administraciones...",
          order: 3,
        },
        {
          id: "subtema-2-4",
          title: "La función pública",
          content: "Personal al servicio de las Administraciones Públicas...",
          order: 4,
        },
      ],
    },
  ],
};

// Función para inicializar todos los temarios en Firebase
export const initializeAllTemarios = async (): Promise<void> => {
  const { setAssistantTemario } = await import("./firebaseData");

  const temarios = [
    auxiliarAdministrativoTemario,
    // Aquí se añadirían todos los demás temarios
  ];

  for (const temario of temarios) {
    try {
      await setAssistantTemario(temario);
      console.log(`Temario initialized for ${temario.assistantName}`);
    } catch (error) {
      console.error(
        `Error initializing temario for ${temario.assistantName}:`,
        error,
      );
    }
  }
};

// Función para generar temarios base para otros asistentes
export const generateBaseTemario = (
  assistantId: string,
  assistantName: string,
  category: string,
  totalTopics: number = 20,
): AssistantTemario => {
  const topics: TemarioTopic[] = [];

  // Generar temas base según la categoría
  const baseTopics = getBaseTopicsByCategory(category);

  for (let i = 0; i < Math.min(totalTopics, baseTopics.length); i++) {
    topics.push({
      id: `tema-${i + 1}`,
      title: baseTopics[i].title,
      description: baseTopics[i].description,
      content: baseTopics[i].content,
      estimatedTime: "1-2 semanas",
      difficulty: "intermedio",
      order: i + 1,
      subtopics: [],
    });
  }

  return {
    assistantId,
    assistantName,
    category,
    totalTopics,
    estimatedStudyTime: `${Math.ceil(totalTopics / 4)}-${Math.ceil(totalTopics / 3)} meses`,
    lastUpdated: "2025-01-01",
    topics,
  };
};

// Función auxiliar para obtener temas base por categoría
const getBaseTopicsByCategory = (category: string) => {
  const topicsByCategory: {
    [key: string]: Array<{
      title: string;
      description: string;
      content: string;
    }>;
  } = {
    administracion: [
      {
        title: "La Constitución Española de 1978",
        description:
          "Estructura, principios fundamentales y derechos constitucionales",
        content:
          "Contenido detallado sobre la Constitución española, su estructura, principios fundamentales y sistema de derechos y libertades...",
      },
      {
        title: "La Administración Pública española",
        description: "Organización, principios y funcionamiento",
        content:
          "Análisis completo de la organización administrativa española, principios constitucionales y relaciones interadministrativas...",
      },
      {
        title: "El procedimiento administrativo común",
        description: "Ley 39/2015 y principios procedimentales",
        content:
          "Estudio detallado del procedimiento administrativo común, garantías y derechos de los ciudadanos...",
      },
      {
        title: "Los contratos del sector público",
        description: "Ley 9/2017 de contratos del sector público",
        content:
          "Régimen jurídico de la contratación pública, procedimientos de adjudicación y ejecución contractual...",
      },
      {
        title: "El régimen jurídico del sector público",
        description: "Ley 40/2015 de régimen jurídico del sector público",
        content:
          "Principios de actuación, organización administrativa y responsabilidad patrimonial...",
      },
    ],
    justicia: [
      {
        title: "El Poder Judicial",
        description: "Organización y funcionamiento de la justicia",
        content:
          "Estructura del poder judicial español, principios constitucionales y organización territorial...",
      },
      {
        title: "La jurisdicción civil",
        description: "Procedimientos civiles y competencias",
        content:
          "Organización de la jurisdicción civil, competencias y procedimientos ordinarios...",
      },
      {
        title: "La jurisdicción penal",
        description: "Procedimiento penal y garantías",
        content:
          "Fases del procedimiento penal, derechos del imputado y garantías procesales...",
      },
      {
        title: "La jurisdicción contencioso-administrativa",
        description: "Control judicial de la Administración",
        content:
          "Competencias, procedimiento y recursos en la jurisdicción contencioso-administrativa...",
      },
    ],
    seguridad: [
      {
        title: "Fuerzas y Cuerpos de Seguridad",
        description: "Marco legal y organización",
        content:
          "Régimen jurídico de las Fuerzas y Cuerpos de Seguridad del Estado, competencias y principios de actuación...",
      },
      {
        title: "Derecho Penal General",
        description: "Teoría general del delito",
        content:
          "Principios del Derecho Penal, teoría del delito, circunstancias modificativas de la responsabilidad...",
      },
      {
        title: "Derecho Penal Especial",
        description: "Delitos contra las personas y el patrimonio",
        content:
          "Estudio de los principales delitos: homicidio, lesiones, hurto, robo, estafa...",
      },
      {
        title: "Derecho Procesal Penal",
        description: "Procedimiento penal y garantías",
        content:
          "Fases del procedimiento penal, medidas cautelares, derechos del detenido...",
      },
    ],
    sanidad: [
      {
        title: "Sistema Nacional de Salud",
        description: "Organización y principios",
        content:
          "Estructura del Sistema Nacional de Salud, competencias y coordinación entre administraciones...",
      },
      {
        title: "Legislación sanitaria",
        description: "Marco normativo del sector sanitario",
        content:
          "Ley General de Sanidad, Ley de Cohesión y Calidad del SNS, derechos y deberes de los usuarios...",
      },
      {
        title: "Salud Pública",
        description: "Protección y promoción de la salud",
        content:
          "Conceptos de salud pública, prevención, vigilancia epidemiológica y promoción de la salud...",
      },
    ],
  };

  return topicsByCategory[category] || topicsByCategory.administracion;
};
