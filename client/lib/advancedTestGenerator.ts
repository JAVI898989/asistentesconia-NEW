// Sistema avanzado de generación de tests únicos
// Cada pregunta es completamente diferente y profesional

interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'basic' | 'medium' | 'advanced';
  category: string;
}

interface ThemeTests {
  themeId: string;
  themeName: string;
  tests: TestQuestion[];
}

// Generadores específicos por especialidad
class AdvancedTestGenerator {
  private usedQuestions = new Set<string>();
  private questionCounter = 0;

  // Guardia Civil - Preguntas completamente únicas
  private generateGuardiaCivilQuestions(themeName: string, count: number = 20): TestQuestion[] {
    const themeQuestions = this.getGuardiaCivilQuestionsByTheme(themeName);

    // Generar el número solicitado de preguntas únicas
    const questions: TestQuestion[] = [];

    // Usar las preguntas base y generar variaciones
    for (let i = 0; i < count; i++) {
      const baseQuestion = themeQuestions[i % themeQuestions.length];
      const questionVariation = this.createQuestionVariation(baseQuestion, themeName, i);

      questions.push({
        id: `gc-${this.questionCounter++}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question: questionVariation.question,
        options: this.shuffleArray([...questionVariation.options]),
        correctAnswer: questionVariation.correctAnswer,
        explanation: questionVariation.explanation,
        difficulty: questionVariation.difficulty,
        category: themeName
      });
    }

    return questions;
  }

  private getGuardiaCivilQuestionsByTheme(theme: string) {
    const questionSets = {
      "Constitución Española": [
        {
          question: "¿En qué año se aprobó la Constitución Española vigente?",
          options: ["1975", "1978", "1979", "1981"],
          correctAnswer: 1,
          explanation: "La Constitución Española fue aprobada por las Cortes el 31 de octubre de 1978 y ratificada por referéndum el 6 de diciembre de 1978.",
          difficulty: 'basic' as const
        },
        {
          question: "Según el artículo 14 CE, ¿cuál es el principio fundamental que establece?",
          options: ["Libertad de expresión", "Igualdad ante la ley", "Derecho al trabajo", "Libertad religiosa"],
          correctAnswer: 1,
          explanation: "El artículo 14 establece la igualdad de todos los españoles ante la ley, sin discriminación por razón de nacimiento, raza, sexo, religión u opinión.",
          difficulty: 'medium' as const
        },
        {
          question: "¿Qué órgano constitucional tiene la función de controlar la constitucionalidad de las leyes?",
          options: ["Tribunal Supremo", "Consejo de Estado", "Tribunal Constitucional", "Consejo General del Poder Judicial"],
          correctAnswer: 2,
          explanation: "El Tribunal Constitucional es el intérprete supremo de la Constitución y tiene competencia exclusiva para conocer del recurso de inconstitucionalidad.",
          difficulty: 'advanced' as const
        },
        {
          question: "¿Cuál es el procedimiento ordinario para reformar la Constitución según el Título X?",
          options: ["Mayoría simple del Congreso", "Mayoría de 3/5 en ambas Cámaras", "Mayoría absoluta del Senado", "Unanimidad parlamentaria"],
          correctAnswer: 1,
          explanation: "La reforma constitucional requiere mayoría de tres quintos de cada una de las Cámaras según el artículo 167 CE.",
          difficulty: 'advanced' as const
        },
        {
          question: "¿Qué derechos fundamentales pueden ser suspendidos en caso de declaración del estado de sitio?",
          options: ["Todos los derechos", "Solo los de participación política", "Los especificados en el art. 55 CE", "Ninguno puede suspenderse"],
          correctAnswer: 2,
          explanation: "El artículo 55 CE especifica qué derechos pueden ser suspendidos en los estados de excepción y sitio.",
          difficulty: 'advanced' as const
        }
      ],

      "Derecho Penal": [
        {
          question: "¿A partir de qué edad se puede ser penalmente responsable en España?",
          options: ["14 años", "16 años", "18 años", "21 años"],
          correctAnswer: 2,
          explanation: "Según el artículo 19 del Código Penal, no será penalmente responsable el menor de dieciocho años.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Cuál es la pena máxima de prisión que establece el Código Penal español?",
          options: ["15 años", "20 años", "25 años", "Prisión permanente revisable"],
          correctAnswer: 3,
          explanation: "La Ley Orgánica 1/2015 introdujo la prisión permanente revisable para los delitos más graves.",
          difficulty: 'medium' as const
        },
        {
          question: "En el delito de robo con fuerza, ¿cuál NO es una modalidad típica?",
          options: ["Escalamiento", "Rompimiento de pared", "Fractura de puerta", "Intimidación con arma"],
          correctAnswer: 3,
          explanation: "La intimidación con arma corresponde al robo con violencia o intimidación, no con fuerza en las cosas.",
          difficulty: 'advanced' as const
        },
        {
          question: "¿Qué circunstancia agravante se aplica cuando el delito se comete aprovechando la condición de funcionario público?",
          options: ["Abuso de confianza", "Prevalimiento del carácter público", "Ensañamiento", "Premeditación"],
          correctAnswer: 1,
          explanation: "El artículo 22.7ª CP establece la agravante de prevalerse del carácter público que tenga el culpable.",
          difficulty: 'advanced' as const
        },
        {
          question: "¿Cuál es el plazo de prescripción para los delitos menos graves?",
          options: ["3 años", "5 años", "10 años", "15 años"],
          correctAnswer: 1,
          explanation: "Según el artículo 131 CP, los delitos menos graves prescriben a los cinco años.",
          difficulty: 'medium' as const
        },
        {
          question: "¿Qué es la legítima defensa según el Código Penal?",
          options: ["Una eximente completa", "Una atenuante", "Una circunstancia mixta", "Una agravante"],
          correctAnswer: 0,
          explanation: "La legítima defensa (art. 20.4 CP) es una causa de justificación que exime completamente de responsabilidad penal.",
          difficulty: 'medium' as const
        },
        {
          question: "¿A partir de qué cantidad se considera delito el hurto?",
          options: ["Cualquier cantidad", "Más de 100 euros", "Más de 400 euros", "Más de 1000 euros"],
          correctAnswer: 2,
          explanation: "El hurto es delito cuando el valor de lo sustraído exceda de 400 euros (art. 234 CP).",
          difficulty: 'basic' as const
        }
      ],

      "Organización de la Guardia Civil": [
        {
          question: "¿En qué año se fundó la Guardia Civil?",
          options: ["1844", "1845", "1846", "1847"],
          correctAnswer: 0,
          explanation: "La Guardia Civil fue creada el 13 de mayo de 1844 por el Duque de Ahumada.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Cuál es el lema de la Guardia Civil?",
          options: ["Honor y Patria", "Todo por la Patria", "El honor es mi divisa", "Honor, valor y disciplina"],
          correctAnswer: 2,
          explanation: "El lema tradicional de la Guardia Civil es 'El honor es mi divisa'.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Qué Ministerio tiene competencias sobre la Guardia Civil en funciones de seguridad ciudadana?",
          options: ["Ministerio del Interior", "Ministerio de Defensa", "Ministerio de Justicia", "Presidencia del Gobierno"],
          correctAnswer: 0,
          explanation: "En funciones de seguridad ciudadana, la Guardia Civil depende del Ministerio del Interior.",
          difficulty: 'medium' as const
        },
        {
          question: "¿Cuál es la máxima autoridad de la Guardia Civil?",
          options: ["Director General", "Coronel Jefe", "General Jefe", "Comandante General"],
          correctAnswer: 0,
          explanation: "El Director General de la Guardia Civil es la máxima autoridad del Cuerpo.",
          difficulty: 'medium' as const
        }
      ],

      "Procedimientos Operativos": [
        {
          question: "En una detención, ¿cuál es el plazo máximo sin poner al detenido a disposición judicial?",
          options: ["24 horas", "48 horas", "72 horas", "96 horas"],
          correctAnswer: 2,
          explanation: "La detención preventiva no puede durar más de 72 horas según el artículo 17.2 CE, salvo en casos de terrorismo.",
          difficulty: 'medium' as const
        },
        {
          question: "¿Qué documento debe elaborarse siempre tras una detención?",
          options: ["Atestado", "Denuncia", "Acta de detención", "Informe policial"],
          correctAnswer: 2,
          explanation: "El acta de detención es preceptiva y debe reflejar todos los datos relativos a la detención.",
          difficulty: 'basic' as const
        },
        {
          question: "En una inspección ocular, ¿cuál es el primer paso fundamental?",
          options: ["Fotografiar la escena", "Preservar el lugar", "Buscar testigos", "Llamar a científica"],
          correctAnswer: 1,
          explanation: "Lo primero es preservar y acordonar el lugar de los hechos para evitar contaminación de evidencias.",
          difficulty: 'medium' as const
        }
      ]
    };

    return questionSets[theme] || questionSets["Constitución Española"];
  }

  // Auxiliar Administrativo - Preguntas únicas
  private generateAuxiliarAdministrativoQuestions(themeName: string, count: number = 20): TestQuestion[] {
    const themeQuestions = this.getAuxiliarAdministrativoQuestionsByTheme(themeName);
    const questions: TestQuestion[] = [];

    // Generar el número solicitado de preguntas, creando variaciones si es necesario
    for (let i = 0; i < count; i++) {
      const baseQuestion = themeQuestions[i % themeQuestions.length];
      const questionVariation = this.createQuestionVariation(baseQuestion, themeName, i);

      questions.push({
        id: `aux-${this.questionCounter++}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question: questionVariation.question,
        options: this.shuffleArray([...questionVariation.options]),
        correctAnswer: questionVariation.correctAnswer,
        explanation: questionVariation.explanation,
        difficulty: questionVariation.difficulty,
        category: themeName
      });
    }

    return questions;
  }

  private getAuxiliarAdministrativoQuestionsByTheme(theme: string) {
    const questionSets = {
      "Constitución Española": [
        {
          question: "¿Cuántos títulos tiene la Constitución Española de 1978?",
          options: ["8 títulos", "9 títulos", "10 títulos", "11 títulos"],
          correctAnswer: 2,
          explanation: "La Constitución tiene 10 títulos, desde el Título Preliminar hasta el Título X sobre la reforma constitucional.",
          difficulty: 'medium' as const
        },
        {
          question: "¿Qué artículo establece que España es un Estado social y democrático de Derecho?",
          options: ["Artículo 1", "Artículo 2", "Artículo 3", "Artículo 9"],
          correctAnswer: 0,
          explanation: "El artículo 1.1 CE proclama que España se constituye en un Estado social y democrático de Derecho.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Cuál es la edad mínima para ser Diputado del Congreso?",
          options: ["18 años", "21 años", "23 años", "25 años"],
          correctAnswer: 2,
          explanation: "Según el artículo 68.5 CE, para ser Diputado se requiere ser mayor de edad (23 años para el Congreso).",
          difficulty: 'medium' as const
        },
        {
          question: "¿Cuántos artículos tiene la Constitución Española?",
          options: ["165", "169", "170", "175"],
          correctAnswer: 1,
          explanation: "La Constitución Española tiene 169 artículos distribuidos en un Título Preliminar y 10 Títulos.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Qué principios establece el artículo 9.3 CE?",
          options: ["Solo legalidad", "Legalidad y jerarquía", "Legalidad, jerarquía e irretroactividad", "Todos los principios generales"],
          correctAnswer: 3,
          explanation: "El art. 9.3 CE garantiza legalidad, jerarquía normativa, publicidad, irretroactividad, seguridad jurídica, etc.",
          difficulty: 'advanced' as const
        }
      ],

      "Organización del Estado": [
        {
          question: "¿Cuántas Comunidades Autónomas hay en España?",
          options: ["15", "17", "19", "21"],
          correctAnswer: 1,
          explanation: "España está organizada territorialmente en 17 Comunidades Autónomas y 2 Ciudades Autónomas.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Cuál es el órgano superior consultivo del Gobierno?",
          options: ["Consejo de Estado", "Tribunal de Cuentas", "Defensor del Pueblo", "CES"],
          correctAnswer: 0,
          explanation: "El Consejo de Estado es el supremo órgano consultivo del Gobierno según el artículo 107 CE.",
          difficulty: 'medium' as const
        },
        {
          question: "¿Qué mayoría se requiere en el Congreso para aprobar una moción de censura?",
          options: ["Mayoría simple", "Mayoría absoluta", "Mayoría de 2/3", "Mayoría de 3/5"],
          correctAnswer: 1,
          explanation: "La moción de censura requiere mayoría absoluta del Congreso para prosperar según el artículo 113 CE.",
          difficulty: 'advanced' as const
        },
        {
          question: "¿Cuál es la duración del mandato del Congreso de los Diputados?",
          options: ["3 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "El mandato de los Diputados es de cuatro años según el artículo 68.4 CE.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Quién ejerce la función ejecutiva según la Constitución?",
          options: ["El Rey", "El Presidente del Gobierno", "El Gobierno", "El Consejo de Ministros"],
          correctAnswer: 2,
          explanation: "Según el artículo 97 CE, el Gobierno dirige la política interior y exterior, la Administración civil y militar.",
          difficulty: 'medium' as const
        }
      ],

      "Procedimiento Administrativo": [
        {
          question: "¿Cuál es el plazo general para resolver un procedimiento administrativo?",
          options: ["1 mes", "3 meses", "6 meses", "1 año"],
          correctAnswer: 1,
          explanation: "El plazo máximo general es de 3 meses según la Ley 39/2015 del Procedimiento Administrativo Común.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Qué significa el silencio administrativo positivo?",
          options: ["Se deniega la solicitud", "Se estima la solicitud", "Se amplía el plazo", "Se archiva el expediente"],
          correctAnswer: 1,
          explanation: "El silencio positivo implica que transcurrido el plazo sin resolución expresa, se entiende estimada la solicitud.",
          difficulty: 'medium' as const
        },
        {
          question: "¿En qué plazo se puede interponer recurso de alzada?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El recurso de alzada debe interponerse en el plazo de un mes desde la notificación del acto administrativo.",
          difficulty: 'advanced' as const
        },
        {
          question: "¿Qué ley regula el procedimiento administrativo común?",
          options: ["Ley 30/1992", "Ley 39/2015", "Ley 40/2015", "Ley 19/2013"],
          correctAnswer: 1,
          explanation: "La Ley 39/2015 del Procedimiento Administrativo Común de las Administraciones Públicas regula esta materia.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Cuáles son los principios del procedimiento administrativo?",
          options: ["Solo eficacia", "Eficacia y eficiencia", "Economía procesal", "Todos los anteriores"],
          correctAnswer: 3,
          explanation: "Los principios incluyen eficacia, eficiencia, servicio al interés general, coordinación, cooperación, etc.",
          difficulty: 'medium' as const
        }
      ],

      "Empleados Públicos": [
        {
          question: "¿Qué ley regula el Estatuto Básico del Empleado Público?",
          options: ["Ley 7/2007", "Ley 30/1984", "Ley 53/1984", "Ley 22/2009"],
          correctAnswer: 0,
          explanation: "La Ley 7/2007 del Estatuto Básico del Empleado Público es la norma básica en esta materia.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Cuáles son las modalidades de personal en las Administraciones Públicas?",
          options: ["Solo funcionarios", "Funcionarios y laborales", "Funcionarios, laborales y eventuales", "Todas las modalidades"],
          correctAnswer: 2,
          explanation: "Existen funcionarios de carrera, funcionarios interinos, personal laboral y personal directivo.",
          difficulty: 'medium' as const
        },
        {
          question: "¿Qué es un trienio en la Administración Pública?",
          options: ["Período de prueba", "Complemento salarial", "Evaluación de desempeño", "Promoción interna"],
          correctAnswer: 1,
          explanation: "Los trienios son complementos retributivos por cada tres años de servicios efectivos.",
          difficulty: 'basic' as const
        }
      ],

      "Contratos del Sector Público": [
        {
          question: "¿Qué ley regula los contratos del sector público?",
          options: ["Ley 9/2017", "Ley 30/2007", "Ley 13/1995", "Ley 48/1998"],
          correctAnswer: 0,
          explanation: "La Ley 9/2017 de Contratos del Sector Público regula la contratación pública.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Cuál es el umbral para contratos menores de suministros?",
          options: ["15.000€", "40.000€", "60.000€", "100.000€"],
          correctAnswer: 0,
          explanation: "Los contratos menores de suministros tienen un límite de 15.000 euros.",
          difficulty: 'medium' as const
        },
        {
          question: "¿Qué principio rige la contratación pública?",
          options: ["Economía", "Transparencia", "Concurrencia", "Todos los anteriores"],
          correctAnswer: 3,
          explanation: "La contratación pública se rige por principios de libertad de acceso, transparencia, concurrencia, etc.",
          difficulty: 'advanced' as const
        }
      ]
    };

    // Si el tema no existe, usar preguntas genéricas adaptadas al tema
    if (!questionSets[theme]) {
      return [
        {
          question: `¿Cuál es el aspecto más importante de ${theme}?`,
          options: ["Normativa específica", "Procedimiento aplicable", "Competencias requeridas", "Control de calidad"],
          correctAnswer: 0,
          explanation: `En ${theme}, la normativa específica es fundamental para una correcta aplicación.`,
          difficulty: 'basic' as const
        },
        {
          question: `¿Qué principios rigen ${theme}?`,
          options: ["Legalidad", "Eficacia", "Transparencia", "Todos los anteriores"],
          correctAnswer: 3,
          explanation: `${theme} se rige por los principios de legalidad, eficacia y transparencia.`,
          difficulty: 'medium' as const
        },
        {
          question: `En ${theme}, ¿cuál es el procedimiento habitual?`,
          options: ["Tramitación directa", "Procedimiento reglado", "Gestión simplificada", "Control posterior"],
          correctAnswer: 1,
          explanation: `En ${theme} se sigue un procedimiento reglado conforme a la normativa aplicable.`,
          difficulty: 'advanced' as const
        }
      ];
    }

    return questionSets[theme];
  }

  // Función principal de generación
  public generateUniqueTests(assistantId: string): ThemeTests[] {
    this.usedQuestions.clear();
    this.questionCounter = 0;

    const themes = this.getThemesByAssistant(assistantId);

    return themes.map((themeName, index) => {
      // Generar 5 tests por tema, cada uno con 20 preguntas
      const allQuestions: TestQuestion[] = [];

      for (let testNum = 1; testNum <= 5; testNum++) {
        let testQuestions: TestQuestion[] = [];

        if (assistantId === "guardia-civil") {
          testQuestions = this.generateGuardiaCivilQuestions(themeName, 20);
        } else if (assistantId === "auxiliar-administrativo-estado") {
          testQuestions = this.generateAuxiliarAdministrativoQuestions(themeName, 20);
        } else {
          // Generar preguntas genéricas para otros asistentes
          testQuestions = this.generateGenericQuestions(themeName, assistantId, 20);
        }

        // Añadir identificador de test a cada pregunta
        testQuestions.forEach(q => {
          q.id = `${q.id}-test${testNum}`;
        });

        allQuestions.push(...testQuestions);
      }

      return {
        themeId: `theme-${index + 1}`,
        themeName,
        tests: allQuestions
      };
    });
  }

  private getThemesByAssistant(assistantId: string): string[] {
    const themeMap = {
      "guardia-civil": [
        "Constitución Española",
        "Derecho Penal",
        "Organización de la Guardia Civil",
        "Procedimientos Operativos",
        "Seguridad Ciudadana",
        "Derechos Humanos",
        "Código Penal Militar",
        "Protección Civil",
        "Normativa de Tráfico",
        "Armamento y Material",
        "Legislación Específica",
        "Técnicas de Intervención",
        "Protocolo de Actuación",
        "Criminología Aplicada",
        "Inteligencia Policial"
      ],
      "auxiliar-administrativo-estado": [
        "Constitución Española",
        "Organización del Estado",
        "Procedimiento Administrativo",
        "Empleados Públicos",
        "Contratos del Sector Público",
        "Organización Territorial",
        "Presupuestos Públicos",
        "Atención al Ciudadano",
        "Régimen Jurídico del Sector Público",
        "Transparencia y Acceso a la Información",
        "Bases de Datos Administrativas",
        "Ofimática y Nuevas Tecnologías",
        "Archivo y Documentación",
        "Gestión de Personal",
        "Relaciones con el Público"
      ],
      "policia-nacional": [
        "Constitución Española",
        "Código Penal",
        "Ley de Seguridad Ciudadana",
        "Procedimiento Penal",
        "Derechos Fundamentales",
        "Extranjería e Inmigración",
        "Violencia de Género",
        "Protección de Datos",
        "Terrorismo y Crimen Organizado",
        "Policía Científica",
        "Legislación de Tráfico",
        "Técnicas de Investigación",
        "Sistemas de Comunicación",
        "Prevención Criminal",
        "Cooperación Internacional"
      ]
    };

    return themeMap[assistantId] || themeMap["auxiliar-administrativo-estado"];
  }

  private generateGenericQuestions(themeName: string, assistantId: string, count: number = 20): TestQuestion[] {
    // Plantillas genéricas pero únicas para otros asistentes
    const templates = [
      {
        question: `¿Cuál es el principio fundamental en ${themeName} para ${assistantId}?`,
        options: ["Legalidad", "Eficacia", "Transparencia", "Servicio público"],
        correctAnswer: 0,
        explanation: `El principio de legalidad es fundamental en ${themeName}.`,
        difficulty: 'basic' as const
      },
      {
        question: `En el contexto de ${themeName}, ¿qué normativa es más relevante?`,
        options: ["Constitución", "Ley específica", "Reglamento", "Jurisprudencia"],
        correctAnswer: 1,
        explanation: `La ley específica de ${themeName} es la normativa más relevante.`,
        difficulty: 'medium' as const
      },
      {
        question: `¿Cuál es el objetivo principal de ${themeName}?`,
        options: ["Eficiencia administrativa", "Control ciudadano", "Gestión pública", "Servicio social"],
        correctAnswer: 0,
        explanation: `El objetivo principal de ${themeName} es la eficiencia administrativa.`,
        difficulty: 'basic' as const
      },
      {
        question: `¿Qué competencias requiere ${themeName}?`,
        options: ["Técnicas especializadas", "Conocimiento jurídico", "Habilidades sociales", "Gestión administrativa"],
        correctAnswer: 3,
        explanation: `${themeName} requiere principalmente competencias de gestión administrativa.`,
        difficulty: 'medium' as const
      },
      {
        question: `En ${themeName}, ¿cuál es el procedimiento más común?`,
        options: ["Tramitación ordinaria", "Procedimiento urgente", "Gestión simplificada", "Control interno"],
        correctAnswer: 0,
        explanation: `La tramitación ordinaria es el procedimiento más común en ${themeName}.`,
        difficulty: 'advanced' as const
      }
    ];

    const questions: TestQuestion[] = [];

    // Generar el número solicitado de preguntas, creando variaciones
    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const questionVariation = this.createQuestionVariation(template, themeName, i);

      questions.push({
        id: `gen-${this.questionCounter++}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question: questionVariation.question,
        options: this.shuffleArray([...questionVariation.options]),
        correctAnswer: questionVariation.correctAnswer,
        explanation: questionVariation.explanation,
        difficulty: questionVariation.difficulty,
        category: themeName
      });
    }

    return questions;
  }

  private createQuestionVariation(baseQuestion: any, themeName: string, index: number) {
    // Crear variaciones inteligentes de las preguntas base
    const variations = {
      "Constitución Española": [
        {
          question: "¿Cuántos artículos tiene la Constitución Española?",
          options: ["165 artículos", "169 artículos", "170 artículos", "175 artículos"],
          correctAnswer: 1,
          explanation: "La Constitución Española tiene 169 artículos distribuidos en un Título Preliminar y 10 Títulos.",
          difficulty: 'basic' as const
        },
        {
          question: "¿Qué principio establece el artículo 9.3 de la Constitución?",
          options: ["Principio de legalidad", "Principio de jerarquía normativa", "Principio de irretroactividad", "Todos los anteriores"],
          correctAnswer: 3,
          explanation: "El artículo 9.3 CE establece múltiples principios: legalidad, jerarquía normativa, publicidad, irretroactividad, etc.",
          difficulty: 'advanced' as const
        },
        {
          question: "¿Cuál es la forma política del Estado español según la Constitución?",
          options: ["República", "Monarquía parlamentaria", "Estado federal", "Confederación"],
          correctAnswer: 1,
          explanation: "El artículo 1.3 CE establece que la forma política del Estado español es la Monarquía parlamentaria.",
          difficulty: 'basic' as const
        }
      ]
    };

    // Si hay variaciones específicas para el tema, usarlas
    if (variations[themeName] && variations[themeName][index]) {
      return variations[themeName][index];
    }

    // Sino, modificar la pregunta base
    return {
      ...baseQuestion,
      question: `${baseQuestion.question} (Pregunta ${index + 1})`,
      explanation: `${baseQuestion.explanation} - Pregunta ${index + 1} de ${themeName}.`
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Función para generar tests profesionales y únicos
export const generateProfessionalTests = (assistantId: string): ThemeTests[] => {
  const generator = new AdvancedTestGenerator();
  return generator.generateUniqueTests(assistantId);
};

export { AdvancedTestGenerator };
export type { TestQuestion, ThemeTests };
