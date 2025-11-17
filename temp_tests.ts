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

export const assistantTests: Record<string, ThemeTests[]> = {
  "auxiliar-administrativo-estado": [
    {
      themeId: "tema-1",
      themeName: "Constitución Española",
      tests: [
        {
          id: "t1-q1",
          question: "¿En qué año se aprobó la Constitución Española?",
          options: ["1976", "1977", "1978", "1979"],
          correctAnswer: 2,
          explanation: "La Constitución Española fue aprobada en referéndum el 6 de diciembre de 1978."
        },
        {
          id: "t1-q2",
          question: "¿Cuántos artículos tiene la Constitución Española?",
          options: ["165", "169", "172", "175"],
          correctAnswer: 1,
          explanation: "La Constitución Española tiene 169 artículos distribuidos en un Preámbulo, un Título Preliminar y diez Títulos."
        },
        {
          id: "t1-q3",
          question: "¿Cuál es la capital del Estado español según la Constitución?",
          options: ["Madrid", "Barcelona", "Sevilla", "Valencia"],
          correctAnswer: 0,
          explanation: "El artículo 5 de la Constitución establece que la capital del Estado es la villa de Madrid."
        },
        {
          id: "t1-q4",
          question: "¿Qué mayoría se requiere para reformar la Constitución por el procedimiento agravado?",
          options: ["Mayoría simple", "Mayoría absoluta", "Dos tercios", "Tres quintos"],
          correctAnswer: 2,
          explanation: "Para la reforma por el procedimiento agravado se requiere una mayoría de dos tercios de cada Cámara."
        },
        {
          id: "t1-q5",
          question: "¿Cuál es la lengua oficial del Estado?",
          options: ["El castellano", "El español", "El castellano y las lenguas cooficiales", "Todas las lenguas de España"],
          correctAnswer: 0,
          explanation: "El artículo 3.1 establece que el castellano es la lengua española oficial del Estado."
        },
        {
          id: "t1-q6",
          question: "¿Quién es el Jefe del Estado según la Constitución?",
          options: ["El Presidente del Gobierno", "El Rey", "El Presidente del Congreso", "El Presidente del Tribunal Supremo"],
          correctAnswer: 1,
          explanation: "Según el artículo 56, el Rey es el Jefe del Estado, símbolo de su unidad y permanencia."
        },
        {
          id: "t1-q7",
          question: "¿Cuántos Títulos tiene la Constitución Española?",
          options: ["9", "10", "11", "12"],
          correctAnswer: 1,
          explanation: "La Constitución tiene un Título Preliminar y 10 Títulos numerados del I al X."
        },
        {
          id: "t1-q8",
          question: "¿Cuál es el artículo que proclama los valores superiores del ordenamiento jurídico?",
          options: ["Artículo 1.1", "Artículo 2", "Artículo 3", "Artículo 9"],
          correctAnswer: 0,
          explanation: "El artículo 1.1 proclama como valores superiores la libertad, la justicia, la igualdad y el pluralismo político."
        },
        {
          id: "t1-q9",
          question: "¿Qué principio se establece respecto a la soberanía nacional?",
          options: ["Reside en el Rey", "Reside en las Cortes", "Reside en el pueblo español", "Reside en el Gobierno"],
          correctAnswer: 2,
          explanation: "El artículo 1.2 establece que la soberanía nacional reside en el pueblo español."
        },
        {
          id: "t1-q10",
          question: "¿Cuál es el fundamento del orden político seg��n la Constitución?",
          options: ["La monarquía", "La dignidad de la persona", "El pluralismo", "La unidad nacional"],
          correctAnswer: 1,
          explanation: "El artículo 10.1 establece que la dignidad de la persona es fundamento del orden político y la paz social."
        },
        {
          id: "t1-q11",
          question: "¿En qué artículo se regula el derecho a la vida?",
          options: ["Artículo 14", "Artículo 15", "Artículo 16", "Artículo 17"],
          correctAnswer: 1,
          explanation: "El artículo 15 garantiza el derecho a la vida y a la integridad física y moral."
        },
        {
          id: "t1-q12",
          question: "¿Cuándo entró en vigor la Constitución?",
          options: ["6 de diciembre de 1978", "27 de diciembre de 1978", "29 de diciembre de 1978", "1 de enero de 1979"],
          correctAnswer: 2,
          explanation: "La Constitución entró en vigor el 29 de diciembre de 1978, tras su publicación en el BOE."
        },
        {
          id: "t1-q13",
          question: "¿Qué mayoría ciudadana obtuvo la Constitución en el referéndum?",
          options: ["87,78%", "88,54%", "91,81%", "94,17%"],
          correctAnswer: 0,
          explanation: "La Constitución fue aprobada por el 87,78% de los votos válidos en el referéndum."
        },
        {
          id: "t1-q14",
          question: "¿En qué Título se regulan los derechos y deberes fundamentales?",
          options: ["Título Preliminar", "Título I", "Título II", "Título III"],
          correctAnswer: 1,
          explanation: "El Título I se dedica a los derechos y deberes fundamentales."
        },
        {
          id: "t1-q15",
          question: "¿Cuál es la bandera de España según la Constitución?",
          options: ["Roja y amarilla", "Formada por tres franjas horizontales", "La que determine el Gobierno", "No se especifica"],
          correctAnswer: 1,
          explanation: "El artículo 4 establece que la bandera está formada por tres franjas horizontales: roja, amarilla y roja."
        },
        {
          id: "t1-q16",
          question: "¿Qué artículo establece la igualdad ante la ley?",
          options: ["Artículo 13", "Artículo 14", "Artículo 15", "Artículo 16"],
          correctAnswer: 1,
          explanation: "El artículo 14 establece la igualdad de todos los españoles ante la ley."
        },
        {
          id: "t1-q17",
          question: "¿Cuál es la forma política del Estado español?",
          options: ["República", "Reino", "Monarquía parlamentaria", "Estado federal"],
          correctAnswer: 2,
          explanation: "El artículo 1.3 establece que la forma política del Estado español es la Monarquía parlamentaria."
        },
        {
          id: "t1-q18",
          question: "¿Qué Disposiciones tiene la Constitución?",
          options: ["Solo Adicionales", "Adicionales, Transitorias y Derogatoria", "Adicionales, Transitorias, Derogatoria y Final", "Solo Final"],
          correctAnswer: 2,
          explanation: "La Constitución tiene Disposiciones Adicionales, Transitorias, Derogatoria y Final."
        },
        {
          id: "t1-q19",
          question: "¿En qué se fundamenta la unidad de la Nación española?",
          options: ["En la historia", "En la solidaridad entre sus pueblos", "En la lengua común", "En el territorio"],
          correctAnswer: 1,
          explanation: "El artículo 2 establece que la unidad se fundamenta en la indisoluble solidaridad entre todos los pueblos de España."
        },
        {
          id: "t1-q20",
          question: "¿Qué reconoce y garantiza el derecho a la autonomía?",
          options: ["Solo a las comunidades", "A las nacionalidades y regiones", "Solo a las regiones", "A las provincias"],
          correctAnswer: 1,
          explanation: "El artículo 2 reconoce y garantiza el derecho a la autonomía de las nacionalidades y regiones."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Organización del Estado",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuántos miembros tiene el Tribunal Constitucional?",
          options: ["10", "12", "14", "16"],
          correctAnswer: 1,
          explanation: "El Tribunal Constitucional está compuesto por 12 miembros nombrados por el Rey."
        },
        {
          id: "t2-q2",
          question: "¿Cuál es el mandato del Presidente del Gobierno?",
          options: ["3 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "El mandato de las Cortes Generales y por tanto del Presidente del Gobierno es de 4 años."
        },
        {
          id: "t2-q3",
          question: "¿Quién nombra al Presidente del Gobierno?",
          options: ["Las Cortes", "El Congreso", "El Rey", "El Senado"],
          correctAnswer: 2,
          explanation: "El Rey nombra al Presidente del Gobierno previa propuesta del Congreso de los Diputados."
        },
        {
          id: "t2-q4",
          question: "¿Cuántos senadores se eligen por cada provincia?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "Se eligen cuatro senadores por cada provincia por sufragio universal, libre, igual, directo y secreto."
        },
        {
          id: "t2-q5",
          question: "¿Cuál es el número mínimo de diputados?",
          options: ["300", "350", "400", "450"],
          correctAnswer: 0,
          explanation: "El Congreso se compone de un mínimo de 300 y un máximo de 400 diputados."
        },
        {
          id: "t2-q6",
          question: "¿Cuál es la duración del mandato de las Cortes Generales?",
          options: ["3 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "Las Cortes Generales son elegidas por cuatro años según el artículo 68.4 de la Constitución."
        },
        {
          id: "t2-q7",
          question: "¿Quién nombra al Presidente del Gobierno?",
          options: ["Las Cortes", "El Congreso", "El Rey", "El pueblo"],
          correctAnswer: 2,
          explanation: "El Rey nombra Presidente del Gobierno tras la investidura en el Congreso."
        },
        {
          id: "t2-q8",
          question: "¿Cuál es la edad mínima para ser diputado?",
          options: ["18 años", "21 años", "23 años", "25 años"],
          correctAnswer: 0,
          explanation: "Para ser diputado se requiere ser mayor de edad (18 años) según el artículo 68.5."
        },
        {
          id: "t2-q9",
          question: "¿Quién preside el Senado?",
          options: ["El Rey", "El Presidente del Gobierno", "Un Presidente elegido por el Senado", "El Presidente del Congreso"],
          correctAnswer: 2,
          explanation: "El Senado elige su propio Presidente y Mesa según el artículo 72."
        },
        {
          id: "t2-q10",
          question: "¿Cuánto dura el mandato del Presidente del Tribunal Constitucional?",
          options: ["3 años", "4 años", "6 años", "9 años"],
          correctAnswer: 0,
          explanation: "El Presidente del Tribunal Constitucional es elegido por 3 años."
        },
        {
          id: "t2-q11",
          question: "¿Qué mayoría se necesita para aprobar las leyes orgánicas?",
          options: ["Mayoría simple", "Mayoría absoluta", "Dos tercios", "Tres quintos"],
          correctAnswer: 1,
          explanation: "Las leyes orgánicas requieren mayoría absoluta del Congreso en votación final."
        },
        {
          id: "t2-q12",
          question: "¿Cuándo pueden las Cortes ser disueltas?",
          options: ["Solo al final del mandato", "Por el Rey a propuesta del Presidente", "Solo por moción de censura", "Nunca"],
          correctAnswer: 1,
          explanation: "El Rey puede disolver las Cortes a propuesta del Presidente del Gobierno."
        },
        {
          id: "t2-q13",
          question: "¿Qué institución ejerce el control de constitucionalidad?",
          options: ["Tribunal Supremo", "Tribunal Constitucional", "Consejo de Estado", "Tribunales ordinarios"],
          correctAnswer: 1,
          explanation: "El Tribunal Constitucional es el intérprete supremo de la Constitución."
        },
        {
          id: "t2-q14",
          question: "¿Cuál es la función principal del Consejo de Estado?",
          options: ["Legislar", "Juzgar", "Asesorar", "Ejecutar"],
          correctAnswer: 2,
          explanation: "El Consejo de Estado es el supremo órgano consultivo del Gobierno."
        },
        {
          id: "t2-q15",
          question: "¿Quién puede presentar proposiciones de ley?",
          options: ["Solo el Gobierno", "Solo los diputados", "Gobierno, diputados y senadores", "Solo las comunidades autónomas"],
          correctAnswer: 2,
          explanation: "Pueden presentar proposiciones de ley el Gobierno, los diputados, los senadores y las asambleas de las CC.AA."
        },
        {
          id: "t2-q16",
          question: "¿Cuál es la composición del Consejo General del Poder Judicial?",
          options: ["12 miembros", "15 miembros", "20 miembros", "21 miembros"],
          correctAnswer: 3,
          explanation: "El CGPJ está compuesto por 20 miembros más el Presidente del Tribunal Supremo."
        },
        {
          id: "t2-q17",
          question: "¿Quién elige a los magistrados del Tribunal Constitucional?",
          options: ["Solo el Rey", "El Congreso, Senado, Gobierno y CGPJ", "Solo las Cortes", "Solo el Gobierno"],
          correctAnswer: 1,
          explanation: "Cuatro los elige el Congreso, cuatro el Senado, dos el Gobierno y dos el CGPJ."
        },
        {
          id: "t2-q18",
          question: "¿Cuál es el plazo para promulgar las leyes?",
          options: ["8 días", "15 días", "30 días", "45 días"],
          correctAnswer: 1,
          explanation: "El Rey debe promulgar las leyes en el plazo de quince días."
        },
        {
          id: "t2-q19",
          question: "¿Qué es la sanción real?",
          options: ["Una multa", "La promulgación de las leyes", "Una pena judicial", "Un acto administrativo"],
          correctAnswer: 1,
          explanation: "La sanción real es el acto por el que el Rey promulga las leyes."
        },
        {
          id: "t2-q20",
          question: "¿Cuándo entra en vigor una ley?",
          options: ["Al ser aprobada", "Al ser promulgada", "20 días después de su publicación", "Al ser publicada"],
          correctAnswer: 2,
          explanation: "Las leyes entran en vigor a los 20 días de su completa publicación, salvo que dispongan otra cosa."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Administración Pública",
      tests: [
        {
          id: "t3-q1",
          question: "¿Qué principio rige la actuación de la Administración Pública?",
          options: ["Eficacia", "Legalidad", "Eficiencia", "Todos los anteriores"],
          correctAnswer: 3,
          explanation: "La Administración Pública se rige por los principios de eficacia, legalidad, eficiencia, entre otros."
        },
        {
          id: "t3-q2",
          question: "¿Qué ley regula el procedimiento administrativo común?",
          options: ["Ley 39/2015", "Ley 40/2015", "Ley 30/1992", "Ley 6/1997"],
          correctAnswer: 0,
          explanation: "La Ley 39/2015 regula el Procedimiento Administrativo Común de las Administraciones Públicas."
        },
        {
          id: "t3-q3",
          question: "¿Cuál es el plazo general para resolver un procedimiento administrativo?",
          options: ["1 mes", "3 meses", "6 meses", "1 año"],
          correctAnswer: 1,
          explanation: "El plazo máximo para resolver es de tres meses, salvo que una norma establezca otro plazo."
        },
        {
          id: "t3-q4",
          question: "¿Qué significa el silencio administrativo positivo?",
          options: ["Denegación presunta", "Estimación presunta", "Archivo del expediente", "Ninguna de las anteriores"],
          correctAnswer: 1,
          explanation: "El silencio administrativo positivo significa que se entiende estimada la solicitud por el transcurso del plazo."
        },
        {
          id: "t3-q5",
          question: "¿Cuándo es obligatorio el informe jurídico en un procedimiento?",
          options: ["Siempre", "Nunca", "En casos de responsabilidad patrimonial", "Solo en sanciones"],
          correctAnswer: 2,
          explanation: "El informe jurídico es preceptivo en los procedimientos de responsabilidad patrimonial."
        },
        {
          id: "t3-q6",
          question: "¿Qué principio garantiza la objetividad en la actuación administrativa?",
          options: ["Eficacia", "Imparcialidad", "Proporcionalidad", "Transparencia"],
          correctAnswer: 1,
          explanation: "El principio de imparcialidad garantiza la objetividad en la actuación de la Administración."
        },
        {
          id: "t3-q7",
          question: "¿Cuál es el plazo general para recurrir un acto administrativo?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El plazo general para interponer recurso de alzada es de un mes desde la notificación."
        },
        {
          id: "t3-q8",
          question: "¿Qué caracteriza a los actos administrativos de trámite?",
          options: ["Son definitivos", "Deciden el fondo del asunto", "No ponen fin al procedimiento", "Son ejecutivos"],
          correctAnswer: 2,
          explanation: "Los actos de trámite no deciden ni directa ni indirectamente el fondo del asunto."
        },
        {
          id: "t3-q9",
          question: "¿Cuándo produce efectos un acto administrativo?",
          options: ["Al dictarse", "Al notificarse", "Al publicarse", "Al ser firme"],
          correctAnswer: 1,
          explanation: "Los actos administrativos producen efectos desde su notificación o publicación."
        },
        {
          id: "t3-q10",
          question: "¿Qu�� es la potestad sancionadora?",
          options: ["Capacidad de multar", "Imposición de sanciones administrativas", "Control disciplinario", "Medidas cautelares"],
          correctAnswer: 1,
          explanation: "La potestad sancionadora permite a la Administración imponer sanciones por infracciones administrativas."
        },
        {
          id: "t3-q11",
          question: "¿Cuál es el órgano superior de la Administración General del Estado?",
          options: ["Consejo de Ministros", "Presidente del Gobierno", "Ministros", "Secretarios de Estado"],
          correctAnswer: 0,
          explanation: "El Consejo de Ministros es el órgano superior de la Administración General del Estado."
        },
        {
          id: "t3-q12",
          question: "¿Qué son los órganos colegiados?",
          options: ["Órganos unipersonales", "Órganos de varios miembros", "Solo comisiones", "Tribunales"],
          correctAnswer: 1,
          explanation: "Los órganos colegiados están integrados por tres o más personas."
        },
        {
          id: "t3-q13",
          question: "¿Cuál es el principio de jerarquía administrativa?",
          options: ["Igualdad", "Subordinación de órganos inferiores", "Coordinación", "Descentralización"],
          correctAnswer: 1,
          explanation: "La jerarquía implica la subordinación de los órganos inferiores a los superiores."
        },
        {
          id: "t3-q14",
          question: "¿Qué es la competencia administrativa?",
          options: ["Rivalidad entre órganos", "Aptitud legal para actuar", "Eficiencia", "Especialización"],
          correctAnswer: 1,
          explanation: "La competencia es la aptitud legal de un órgano para el ejercicio de sus funciones."
        },
        {
          id: "t3-q15",
          question: "¿Cuándo es nulo de pleno derecho un acto administrativo?",
          options: ["Cuando es irregular", "Por vicios graves de forma", "Por carecer de competencia", "Por falta de motivación"],
          correctAnswer: 2,
          explanation: "Son nulos los actos dictados por órgano manifiestamente incompetente."
        },
        {
          id: "t3-q16",
          question: "¿Qué es la responsabilidad patrimonial de la Administración?",
          options: ["Solo por dolo", "Por funcionamiento normal o anormal", "Solo por culpa grave", "Por actos dolosos"],
          correctAnswer: 1,
          explanation: "La Administración responde por daños causados por el funcionamiento normal o anormal de los servicios públicos."
        },
        {
          id: "t3-q17",
          question: "¿Cuál es el plazo para reclamar responsabilidad patrimonial?",
          options: ["6 meses", "1 año", "2 años", "4 años"],
          correctAnswer: 1,
          explanation: "El plazo para reclamar responsabilidad patrimonial es de un año desde el hecho o desde la manifestación del daño."
        },
        {
          id: "t3-q18",
          question: "¿Qué es la desconcentración administrativa?",
          options: ["Creación de entes públicos", "Traspaso de competencias a órganos inferiores", "Delegación temporal", "Descentralización territorial"],
          correctAnswer: 1,
          explanation: "La desconcentración es el traspaso permanente de competencias a órganos jerárquicamente dependientes."
        },
        {
          id: "t3-q19",
          question: "¿Cuándo debe motivarse un acto administrativo?",
          options: ["Siempre", "Solo si es desfavorable", "Cuando limite derechos", "Nunca"],
          correctAnswer: 2,
          explanation: "Deben motivarse los actos que limiten derechos subjetivos o intereses legítimos."
        },
        {
          id: "t3-q20",
          question: "¿Qué es la avocación?",
          options: ["Delegación hacia abajo", "Asunción de competencias por el superior", "Suplencia", "Sustitución"],
          correctAnswer: 1,
          explanation: "La avocación es la asunción por un órgano superior de competencias atribuidas a uno inferior."
        }
      ]
    },
    {
      themeId: "tema-4",
      themeName: "Derechos Fundamentales y Libertades Públicas",
      tests: [
        {
          id: "t4-q1",
          question: "¿En qué Título de la Constituci��n se regulan los derechos fundamentales?",
          options: ["Título I", "Título II", "Título III", "Título IV"],
          correctAnswer: 0,
          explanation: "Los derechos y deberes fundamentales se regulan en el Título I de la Constitución."
        },
        {
          id: "t4-q2",
          question: "¿Cuál es la edad de la mayoría de edad en España?",
          options: ["16 años", "17 años", "18 años", "21 años"],
          correctAnswer: 2,
          explanation: "La mayoría de edad se alcanza a los 18 años según el artículo 12 de la Constitución."
        },
        {
          id: "t4-q3",
          question: "¿Qué derecho protege el artículo 18.1 de la Constitución?",
          options: ["Libertad de expresión", "Derecho al honor", "Derecho a la intimidad", "Libertad de circulación"],
          correctAnswer: 2,
          explanation: "El artículo 18.1 garantiza el derecho al honor, a la intimidad personal y familiar y a la propia imagen."
        },
        {
          id: "t4-q4",
          question: "¿Qué procedimiento protege los derechos fundamentales?",
          options: ["Recurso de casación", "Recurso de amparo", "Recurso de suplicación", "Recurso contencioso"],
          correctAnswer: 1,
          explanation: "El recurso de amparo ante el Tribunal Constitucional protege los derechos fundamentales."
        },
        {
          id: "t4-q5",
          question: "¿Cuál es el principio de igualdad establecido en la Constitución?",
          options: ["Igualdad ante la ley", "Igualdad de oportunidades", "Igualdad social", "Igualdad económica"],
          correctAnswer: 0,
          explanation: "El artículo 14 establece la igualdad de todos los españoles ante la ley."
        },
        {
          id: "t4-q6",
          question: "¿Qué libertades comprende el artículo 16?",
          options: ["Libertad de expresión", "Libertad ideológica y religiosa", "Libertad de circulación", "Libertad de empresa"],
          correctAnswer: 1,
          explanation: "El artículo 16 garantiza la libertad ideológica, religiosa y de culto."
        },
        {
          id: "t4-q7",
          question: "¿Cuándo puede suspenderse el derecho de reunión?",
          options: ["Nunca", "En estado de excepción", "Siempre", "Solo de noche"],
          correctAnswer: 1,
          explanation: "El derecho de reunión puede suspenderse durante la declaración de los estados de excepción o sitio."
        },
        {
          id: "t4-q8",
          question: "¿Qué es la objeción de conciencia?",
          options: ["Negarse a declarar", "Negarse a cumplir deberes por motivos morales", "Resistencia civil", "Desobediencia"],
          correctAnswer: 1,
          explanation: "La objeción de conciencia es el derecho a negarse a cumplir deberes jurídicos por motivos de conciencia."
        },
        {
          id: "t4-q9",
          question: "¿Qué protege el secreto de las comunicaciones?",
          options: ["Solo correo postal", "Todas las comunicaciones", "Solo teléfono", "Solo internet"],
          correctAnswer: 1,
          explanation: "El artículo 18.3 protege el secreto de todas las comunicaciones, especialmente postales, telegráficas y telefónicas."
        },
        {
          id: "t4-q10",
          question: "¿Cuándo es inviolable el domicilio?",
          options: ["Siempre", "Solo de día", "Salvo consentimiento, resolución judicial o flagrante delito", "Solo con orden judicial"],
          correctAnswer: 2,
          explanation: "El domicilio es inviolable salvo consentimiento del titular, resolución judicial o flagrante delito."
        },
        {
          id: "t4-q11",
          question: "¿Qué limitaciones tiene la libertad de expresión?",
          options: ["Ninguna", "El derecho al honor y la intimidad", "Solo la censura previa", "El orden público"],
          correctAnswer: 1,
          explanation: "La libertad de expresión tiene como límites el derecho al honor, intimidad, propia imagen y protección de la juventud e infancia."
        },
        {
          id: "t4-q12",
          question: "¿Cuál es la diferencia entre derechos fundamentales y libertades públicas?",
          options: ["No hay diferencia", "Los fundamentales están en la Sección 1ª", "Solo el nombre", "La protección"],
          correctAnswer: 1,
          explanation: "Los derechos fundamentales están en la Sección 1ª del Capítulo II y tienen mayor protección."
        },
        {
          id: "t4-q13",
          question: "¿Qué es el derecho a la educación según la Constitución?",
          options: ["Solo primaria", "Derecho y deber fundamental", "Solo universitaria", "Opcional"],
          correctAnswer: 1,
          explanation: "El artículo 27 establece que todos tienen derecho a la educación, que es obligatoria y gratuita en la enseñanza básica."
        },
        {
          id: "t4-q14",
          question: "¿Quién garantiza el derecho a la información?",
          options: ["Solo el Gobierno", "Los medios de comunicación", "Los poderes públicos", "Las empresas"],
          correctAnswer: 2,
          explanation: "Los poderes públicos garantizarán el acceso a los medios de comunicación social relacionados con estas libertades."
        },
        {
          id: "t4-q15",
          question: "¿Qué es la libertad sindical?",
          options: ["Derecho a trabajar", "Derecho a constituir sindicatos", "Derecho a la huelga", "Negociación colectiva"],
          correctAnswer: 1,
          explanation: "La libertad sindical comprende el derecho a fundar sindicatos y a afiliarse al de su elección."
        },
        {
          id: "t4-q16",
          question: "¿Cuándo se puede limitar la libertad de circulación?",
          options: ["Nunca", "Por motivos políticos", "Por razones de salud o seguridad", "Solo en fronteras"],
          correctAnswer: 2,
          explanation: "La libertad de circulación puede limitarse por motivos de salud o seguridad pública."
        },
        {
          id: "t4-q17",
          question: "¿Qué protege el derecho a la tutela judicial efectiva?",
          options: ["Solo el acceso a tribunales", "El proceso completo hasta la ejecución", "Solo la sentencia", "La defensa"],
          correctAnswer: 1,
          explanation: "La tutela judicial efectiva protege todo el proceso, desde el acceso hasta la ejecución de la sentencia."
        },
        {
          id: "t4-q18",
          question: "¿Cuál es el contenido esencial de los derechos fundamentales?",
          options: ["Todo el derecho", "El núcleo indisponible", "Las garantías", "Los límites"],
          correctAnswer: 1,
          explanation: "El contenido esencial es el núcleo indisponible del derecho, que no puede ser afectado por el legislador."
        },
        {
          id: "t4-q19",
          question: "¿Qué son los derechos de configuración legal?",
          options: ["Derechos absolutos", "Derechos que requieren desarrollo legislativo", "Derechos limitados", "Derechos constitucionales"],
          correctAnswer: 1,
          explanation: "Son derechos cuyo contenido concreto se determina mediante la correspondiente ley de desarrollo."
        },
        {
          id: "t4-q20",
          question: "¿Puede limitarse el derecho de huelga?",
          options: ["No, es absoluto", "Sí, para garantizar servicios esenciales", "Solo en el sector público", "Solo temporalmente"],
          correctAnswer: 1,
          explanation: "El derecho de huelga puede regularse para garantizar el mantenimiento de los servicios esenciales de la comunidad."
        }
      ]
    },
    {
      themeId: "tema-6",
      themeName: "Ley 39/2015 de Procedimiento Administrativo Común",
      tests: [
        {
          id: "t6-q1",
          question: "¿Cuál es el ámbito de aplicación de la Ley 39/2015?",
          options: ["Solo AGE", "Sector público en sus relaciones con particulares", "Solo CC.AA.", "Solo entidades locales"],
          correctAnswer: 1,
          explanation: "La Ley 39/2015 se aplica al sector público en sus relaciones con los particulares."
        },
        {
          id: "t6-q2",
          question: "¿Cuáles son las fases del procedimiento administrativo?",
          options: ["Solo iniciación", "Iniciación, instrucción y terminación", "Solo instrucción", "Solo terminación"],
          correctAnswer: 1,
          explanation: "Las fases del procedimiento son iniciación, instrucción y terminación."
        },
        {
          id: "t6-q3",
          question: "¿Cuánto dura el silencio administrativo positivo?",
          options: ["1 mes", "3 meses", "6 meses", "Varía según el procedimiento"],
          correctAnswer: 3,
          explanation: "El plazo del silencio administrativo varía según cada procedimiento específico."
        },
        {
          id: "t6-q4",
          question: "¿Qué es un acto administrativo?",
          options: ["Solo resoluciones", "Declaración de voluntad de la Administración", "Solo decretos", "Solo órdenes"],
          correctAnswer: 1,
          explanation: "El acto administrativo es toda declaración de voluntad, de juicio, de conocimiento o de deseo realizada por la Administración."
        },
        {
          id: "t6-q5",
          question: "¿Cuándo es nulo de pleno derecho un acto?",
          options: ["Nunca", "Por vulnerar derechos fundamentales o carecer de competencia", "Siempre", "Solo por forma"],
          correctAnswer: 1,
          explanation: "Son nulos los actos que vulneren derechos fundamentales, carezcan de competencia, tengan contenido imposible o sean constitutivos de infracción penal."
        },
        {
          id: "t6-q6",
          question: "¿Cuál es el plazo para interponer recurso de alzada?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El recurso de alzada se interpone en el plazo de un mes."
        },
        {
          id: "t6-q7",
          question: "¿Qué es la caducidad del procedimiento?",
          options: ["Prescripción", "Paralización por inactividad del interesado", "Solo administrativa", "No existe"],
          correctAnswer: 1,
          explanation: "La caducidad se produce por la paralización del procedimiento por causa imputable al interesado."
        },
        {
          id: "t6-q8",
          question: "¿Cuándo opera el silencio administrativo?",
          options: ["Nunca", "Al vencer el plazo sin resolver", "Solo en recursos", "Siempre"],
          correctAnswer: 1,
          explanation: "El silencio administrativo opera cuando vence el plazo para resolver sin que se haya dictado resolución expresa."
        },
        {
          id: "t6-q9",
          question: "¿Qué es la revocación de actos administrativos?",
          options: ["Solo por tribunales", "Retirada de actos favorables por la Administración", "Solo por el tiempo", "Automática"],
          correctAnswer: 1,
          explanation: "La revocación es la retirada de actos administrativos favorables por razones de legalidad o por cambio de circunstancias."
        },
        {
          id: "t6-q10",
          question: "¿Cuáles son los principios del procedimiento administrativo?",
          options: ["Solo legalidad", "Transparencia, objetividad, eficacia, celeridad", "Solo eficacia", "Solo transparencia"],
          correctAnswer: 1,
          explanation: "Los principios incluyen transparencia, objetividad, eficacia, economía procesal, celeridad y simplificación."
        },
        {
          id: "t6-q11",
          question: "¿Qué es la audiencia al interesado?",
          options: ["Solo oral", "Trámite para conocer alegaciones antes de resolver", "Solo escrita", "No existe"],
          correctAnswer: 1,
          explanation: "La audiencia es el tr��mite que permite al interesado conocer el expediente y formular alegaciones."
        },
        {
          id: "t6-q12",
          question: "¿Cuándo se considera notificación válida?",
          options: ["Solo presencial", "Cuando llega a conocimiento del interesado", "Solo certificada", "Solo electrónica"],
          correctAnswer: 1,
          explanation: "La notificación se considera válida cuando llega a conocimiento del interesado por cualquier medio válido."
        },
        {
          id: "t6-q13",
          question: "¿Qué efectos tiene la falta de notificación?",
          options: ["Ninguno", "Imposibilita que produzca efectos el acto", "Solo retrasa", "Anula el acto"],
          correctAnswer: 1,
          explanation: "La falta de notificación impide que el acto administrativo produzca efectos, sin perjuicio de su validez."
        },
        {
          id: "t6-q14",
          question: "¿Cuál es el contenido mínimo de un acto administrativo?",
          options: ["Solo la decisión", "Motivación, parte dispositiva, recursos, autoridad", "Solo recursos", "Solo motivación"],
          correctAnswer: 1,
          explanation: "Debe contener motivación, parte dispositiva, indicación de recursos y autoridad que lo dicta."
        },
        {
          id: "t6-q15",
          question: "¿Qué es la instrucción del procedimiento?",
          options: ["Solo alegaciones", "Fase de obtención de datos y documentos", "Solo informes", "Solo pruebas"],
          correctAnswer: 1,
          explanation: "La instrucción comprende la realización de las actuaciones necesarias para determinar, conocer y comprobar los datos en virtud de los cuales debe pronunciarse la resolución."
        },
        {
          id: "t6-q16",
          question: "¿Cuándo se puede subsanar una solicitud?",
          options: ["Nunca", "Cuando tenga defectos subsanables", "Solo una vez", "Siempre automático"],
          correctAnswer: 1,
          explanation: "Se puede requerir subsanación cuando la solicitud no reúna los requisitos exigidos."
        },
        {
          id: "t6-q17",
          question: "¿Qué es la terminación convencional del procedimiento?",
          options: ["Solo desistimiento", "Acuerdos, convenios y contratos", "Solo renuncia", "No existe"],
          correctAnswer: 1,
          explanation: "Incluye terminación por acuerdo entre la Administración y los interesados, siempre que no sea contraria al ordenamiento jurídico."
        },
        {
          id: "t6-q18",
          question: "¿Cu��l es el plazo máximo para resolver?",
          options: ["Siempre 3 meses", "6 meses, salvo disposición expresa", "1 año", "No hay plazo"],
          correctAnswer: 1,
          explanation: "El plazo máximo es de seis meses, salvo que una disposición o la normativa comunitaria establezcan otro."
        },
        {
          id: "t6-q19",
          question: "¿Qué es la ejecutividad de los actos administrativos?",
          options: ["Solo por tribunales", "Producen efectos desde su notificación", "Solo si son firmes", "Solo con recursos"],
          correctAnswer: 1,
          explanation: "Los actos administrativos se presumen válidos y producen efectos desde la fecha en que se dicten, salvo disposición contraria."
        },
        {
          id: "t6-q20",
          question: "¿Cuándo procede la responsabilidad patrimonial de la Administración?",
          options: ["Solo por culpa", "Por daños que no tengan deber jurídico de soportar", "Solo por dolo", "Nunca"],
          correctAnswer: 1,
          explanation: "Procede por los daños que los particulares no tengan el deber jurídico de soportar, sean consecuencia del funcionamiento normal o anormal de los servicios públicos."
        }
      ]
    },
    {
      themeId: "tema-5",
      themeName: "Organización Territorial del Estado",
      tests: [
        {
          id: "t5-q1",
          question: "¿Cuántas Comunidades Autónomas hay en España?",
          options: ["15", "17", "19", "21"],
          correctAnswer: 1,
          explanation: "España está organizada en 17 Comunidades Autónomas y 2 Ciudades Autónomas."
        },
        {
          id: "t5-q2",
          question: "¿Qué artículo de la Constitución regula las Comunidades Autónomas?",
          options: ["Artículo 143", "Artículo 144", "Artículo 145", "Artículo 146"],
          correctAnswer: 0,
          explanation: "El artículo 143 establece el procedimiento ordinario para la constitución de las Comunidades Autónomas."
        },
        {
          id: "t5-q3",
          question: "¿Cuál es la provincia más extensa de España?",
          options: ["Madrid", "Sevilla", "Badajoz", "Cáceres"],
          correctAnswer: 2,
          explanation: "Badajoz es la provincia más extensa de España con 21.766 km²."
        },
        {
          id: "t5-q4",
          question: "¿Qué son las Diputaciones Provinciales?",
          options: ["Órganos autonómicos", "Entidades locales", "Delegaciones del Gobierno", "Tribunales provinciales"],
          correctAnswer: 1,
          explanation: "Las Diputaciones Provinciales son entidades locales supramunicipales."
        },
        {
          id: "t5-q5",
          question: "¿Cuál es el número mínimo de provincias para formar una Comunidad Autónoma?",
          options: ["Una", "Dos", "Tres", "Cuatro"],
          correctAnswer: 0,
          explanation: "Una sola provincia puede constituir una Comunidad Autónoma, como en el caso de Asturias."
        },
        {
          id: "t5-q6",
          question: "¿Qué vía siguió el País Vasco para acceder a la autonomía?",
          options: ["Artículo 143", "Artículo 151", "Disposición Transitoria 2ª", "Ley especial"],
          correctAnswer: 2,
          explanation: "El País Vasco accedió a la autonomía por la vía de la Disposición Transitoria Segunda."
        },
        {
          id: "t5-q7",
          question: "¿Cuántas provincias tiene Castilla y León?",
          options: ["7", "8", "9", "10"],
          correctAnswer: 2,
          explanation: "Castilla y León tiene 9 provincias: Ávila, Burgos, León, Palencia, Salamanca, Segovia, Soria, Valladolid y Zamora."
        },
        {
          id: "t5-q8",
          question: "¿Qué principio rige las relaciones entre el Estado y las CC.AA.?",
          options: ["Jerarquía", "Coordinación y colaboración", "Subordinación", "Independencia"],
          correctAnswer: 1,
          explanation: "Las relaciones entre el Estado y las CC.AA. se rigen por los principios de coordinación y colaboración."
        },
        {
          id: "t5-q9",
          question: "¿Quién nombra al Delegado del Gobierno en las CC.AA.?",
          options: ["El Rey", "El Consejo de Ministros", "El Presidente de la CA", "Las Cortes"],
          correctAnswer: 1,
          explanation: "El Delegado del Gobierno es nombrado por el Consejo de Ministros."
        },
        {
          id: "t5-q10",
          question: "¿Qué es el Fondo de Compensación Interterritorial?",
          options: ["Impuesto", "Mecanismo de solidaridad", "Préstamo", "Subvención"],
          correctAnswer: 1,
          explanation: "Es un fondo destinado a corregir desequilibrios económicos interterritoriales y hacer efectivo el principio de solidaridad."
        },
        {
          id: "t5-q11",
          question: "¿Cuándo pueden las CC.AA. celebrar convenios entre sí?",
          options: ["Nunca", "Con autorización de las Cortes Generales", "Libremente", "Solo para servicios"],
          correctAnswer: 1,
          explanation: "Los acuerdos de cooperación entre CC.AA. necesitan autorización de las Cortes Generales."
        },
        {
          id: "t5-q12",
          question: "¿Qué son las competencias concurrentes?",
          options: ["Exclusivas del Estado", "Exclusivas de las CC.AA.", "Compartidas entre Estado y CC.AA.", "No existen"],
          correctAnswer: 2,
          explanation: "Las competencias concurrentes son aquellas en las que tanto el Estado como las CC.AA. pueden legislar."
        },
        {
          id: "t5-q13",
          question: "¿Cuál es la capital de Extremadura?",
          options: ["Badajoz", "Cáceres", "Mérida", "No tiene capital única"],
          correctAnswer: 2,
          explanation: "Mérida es la capital de la Comunidad Autónoma de Extremadura."
        },
        {
          id: "t5-q14",
          question: "¿Qué provincias forman Castilla-La Mancha?",
          options: ["4", "5", "6", "7"],
          correctAnswer: 1,
          explanation: "Castilla-La Mancha est�� formada por 5 provincias: Albacete, Ciudad Real, Cuenca, Guadalajara y Toledo."
        },
        {
          id: "t5-q15",
          question: "¿Cuándo puede el Estado adoptar medidas coercitivas?",
          options: ["Nunca", "Cuando una CA incumpla gravemente", "Siempre", "Solo en estado de excepción"],
          correctAnswer: 1,
          explanation: "El Estado puede adoptar medidas cuando una CA no cumpla las obligaciones que la Constitución u otras leyes le impongan."
        },
        {
          id: "t5-q16",
          question: "¿Qué es una mancomunidad de municipios?",
          options: ["Provincia", "Asociación de municipios", "Comarca", "Diputación"],
          correctAnswer: 1,
          explanation: "Las mancomunidades son asociaciones voluntarias de municipios para la prestación conjunta de servicios."
        },
        {
          id: "t5-q17",
          question: "¿Cuál es el municipio más pequeño de España?",
          options: ["Frías (Burgos)", "Illán de Vacas (Toledo)", "Villaroya (La Rioja)", "Grazalema (Cádiz)"],
          correctAnswer: 1,
          explanation: "Illán de Vacas, en Toledo, es considerado uno de los municipios más pequeños de España."
        },
        {
          id: "t5-q18",
          question: "¿Qué son las entidades locales menores?",
          options: ["Municipios pequeños", "Entidades inframunicipales", "Diputaciones", "Comarcas"],
          correctAnswer: 1,
          explanation: "Son entidades de ámbito territorial inferior al municipal, como pedanías o parroquias."
        },
        {
          id: "t5-q19",
          question: "¿Cuántos concejales mínimos debe tener un ayuntamiento?",
          options: ["3", "5", "7", "9"],
          correctAnswer: 1,
          explanation: "Todo ayuntamiento debe tener un mínimo de 5 concejales según la legislación electoral."
        },
        {
          id: "t5-q20",
          question: "¿Qué es el principio de subsidiariedad en la organización territorial?",
          options: ["Ayuda económica", "Competencia del nivel más próximo al ciudadano", "Jerarquía territorial", "Solidaridad"],
          correctAnswer: 1,
          explanation: "El principio de subsidiariedad establece que las competencias deben ejercerse por el nivel administrativo m��s próximo al ciudadano."
        }
      ]
    },
    {
      themeId: "tema-7",
      themeName: "Ley 40/2015 de Régimen Jurídico del Sector Público",
      tests: [
        {
          id: "t7-q1",
          question: "¿Cuáles son los principios de actuación de las Administraciones Públicas?",
          options: ["Solo legalidad", "Legalidad, eficacia, jerarquía, descentralización", "Solo eficacia", "Solo jerarquía"],
          correctAnswer: 1,
          explanation: "Los principios incluyen legalidad, eficacia, jerarquía, descentralización, desconcentración y coordinación."
        },
        {
          id: "t7-q2",
          question: "¿Qué es la competencia administrativa?",
          options: ["Poder discrecional", "Medida de poder atribuida a un órgano", "Solo funciones", "Capacidad técnica"],
          correctAnswer: 1,
          explanation: "La competencia es la medida de poder atribuida a cada órgano para el cumplimiento de sus funciones."
        },
        {
          id: "t7-q3",
          question: "¿Puede delegarse la competencia?",
          options: ["Nunca", "Sí, salvo prohibición expresa", "Solo hacia arriba", "Solo hacia abajo"],
          correctAnswer: 1,
          explanation: "Las competencias pueden delegarse, salvo que se trate de competencias no delegables por disposición legal."
        },
        {
          id: "t7-q4",
          question: "¿Qué efectos tiene la delegación de competencias?",
          options: ["Ninguno", "El delegado actúa en nombre del delegante", "Solo internos", "Anula competencia"],
          correctAnswer: 1,
          explanation: "Los actos del delegado se consideran dictados por el órgano delegante."
        },
        {
          id: "t7-q5",
          question: "¿Cuándo hay conflicto de atribuciones?",
          options: ["Siempre", "Cuando dos órganos se consideran competentes o incompetentes", "Solo entre ministerios", "Solo territorial"],
          correctAnswer: 1,
          explanation: "Hay conflicto cuando dos órganos se consideran competentes para un mismo asunto o ambos se consideran incompetentes."
        },
        {
          id: "t7-q6",
          question: "¿Qué es la avocación de competencias?",
          options: ["Delegación", "El superior asume competencia del inferior", "Solo en urgencia", "No existe"],
          correctAnswer: 1,
          explanation: "La avocación permite al órgano superior asumir el conocimiento de un asunto cuya competencia está atribuida a un órgano inferior."
        },
        {
          id: "t7-q7",
          question: "¿Cuáles son los órganos colegiados básicos?",
          options: ["Solo consejos", "Consejos, comisiones, juntas y comités", "Solo comisiones", "Solo juntas"],
          correctAnswer: 1,
          explanation: "Los órganos colegiados pueden denominarse consejos, comisiones, juntas, comités u otros nombres similares."
        },
        {
          id: "t7-q8",
          question: "¿Cuándo es válida una sesión de órgano colegiado?",
          options: ["Con cualquier número", "Con asistencia de mayoría absoluta", "Solo con todos", "Con un tercio"],
          correctAnswer: 1,
          explanation: "Para la válida constitución se requiere la asistencia de la mayoría absoluta de sus miembros."
        },
        {
          id: "t7-q9",
          question: "¿Qué mayoría se requiere para adoptar acuerdos?",
          options: ["Unanimidad", "Mayoría simple de los presentes", "Dos tercios", "Mayoría absoluta"],
          correctAnswer: 1,
          explanation: "Los acuerdos se adoptan por mayoría simple de los miembros presentes."
        },
        {
          id: "t7-q10",
          question: "¿Qué es la coordinación administrativa?",
          options: ["Solo jerarquía", "Integración de criterios de actuación", "Solo territorial", "Subordinación"],
          correctAnswer: 1,
          explanation: "La coordinación busca la integración de la diversidad de las partes en el conjunto del sistema."
        },
        {
          id: "t7-q11",
          question: "¿Cuáles son las relaciones interadministrativas?",
          options: ["Solo cooperación", "Información mutua, colaboración, cooperación", "Solo información", "Solo colaboración"],
          correctAnswer: 1,
          explanation: "Las relaciones se basan en información mutua, colaboración, cooperación y respeto a las competencias."
        },
        {
          id: "t7-q12",
          question: "¿Qué son los convenios de colaboración?",
          options: ["Solo contratos", "Acuerdos para objetivos comunes", "Solo subvenciones", "Solo proyectos"],
          correctAnswer: 1,
          explanation: "Los convenios son acuerdos con efectos jurídicos para la consecución de objetivos comunes."
        },
        {
          id: "t7-q13",
          question: "¿Quién puede suscribir convenios?",
          options: ["Solo ministros", "Órganos competentes de cada Administración", "Solo secretarios de Estado", "Solo directores generales"],
          correctAnswer: 1,
          explanation: "Pueden suscribirlos los órganos que tengan atribuida la competencia correspondiente en cada Administración."
        },
        {
          id: "t7-q14",
          question: "¿Cuál es el contenido mínimo de un convenio?",
          options: ["Solo objeto", "Sujetos, objeto, vigencia, financiación", "Solo sujetos", "Solo financiación"],
          correctAnswer: 1,
          explanation: "Debe incluir sujetos, objeto y ámbito territorial, vigencia, financiación y régimen de modificación."
        },
        {
          id: "t7-q15",
          question: "¿Qué es la encomienda de gestión?",
          options: ["Delegación formal", "Encargo de actividades materiales o técnicas", "Solo contratos", "Transferencia competencial"],
          correctAnswer: 1,
          explanation: "La encomienda permite encargar actividades de carácter material, técnico o de servicios."
        },
        {
          id: "t7-q16",
          question: "¿Cuándo procede la responsabilidad de las autoridades?",
          options: ["Nunca", "Por dolo, culpa grave o negligencia grave", "Solo por dolo", "Siempre"],
          correctAnswer: 1,
          explanation: "Las autoridades y personal responden disciplinariamente por dolo, culpa o negligencia graves."
        },
        {
          id: "t7-q17",
          question: "¿Qué es el principio de eficacia administrativa?",
          options: ["Solo rapidez", "Consecución de objetivos con menores recursos", "Solo calidad", "Solo ahorro"],
          correctAnswer: 1,
          explanation: "La eficacia supone la consecución de los objetivos fijados, optimizando los recursos disponibles."
        },
        {
          id: "t7-q18",
          question: "¿Cuáles son las formas de terminación de convenios?",
          options: ["Solo vencimiento", "Cumplimiento, vencimiento, denuncia, mutuo acuerdo", "Solo denuncia", "Solo incumplimiento"],
          correctAnswer: 1,
          explanation: "Los convenios se extinguen por cumplimiento, vencimiento del plazo, denuncia o mutuo acuerdo."
        },
        {
          id: "t7-q19",
          question: "¿Qué es la descentralización funcional?",
          options: ["Solo territorial", "Creación de entes con personalidad jurídica", "Solo orgánica", "Solo competencial"],
          correctAnswer: 1,
          explanation: "La descentralización funcional crea entes con personalidad jurídica propia para gestión de servicios específicos."
        },
        {
          id: "t7-q20",
          question: "¿Cuándo hay incompatibilidad para participar en órganos colegiados?",
          options: ["Nunca", "Por interés personal directo en el asunto", "Solo por parentesco", "Solo por amistad"],
          correctAnswer: 1,
          explanation: "Existe incompatibilidad cuando concurra interés personal directo en el asunto o cualquier otra causa de abstención."
        }
      ]
    },
    {
      themeId: "tema-8",
      themeName: "Unión Europea",
      tests: [
        {
          id: "t8-q1",
          question: "¿Cuándo se fundó la Comunidad Económica Europea?",
          options: ["1955", "1957", "1960", "1962"],
          correctAnswer: 1,
          explanation: "La CEE se fundó en 1957 con el Tratado de Roma."
        },
        {
          id: "t8-q2",
          question: "¿Cuáles son las instituciones principales de la UE?",
          options: ["Solo Parlamento", "Parlamento, Consejo, Comisión, Tribunal", "Solo Consejo", "Solo Comisión"],
          correctAnswer: 1,
          explanation: "Las principales son Parlamento Europeo, Consejo Europeo, Consejo, Comisión y Tribunal de Justicia."
        },
        {
          id: "t8-q3",
          question: "¿Qué es el Consejo Europeo?",
          options: ["Ministros", "Jefes de Estado y de Gobierno", "Comisarios", "Diputados"],
          correctAnswer: 1,
          explanation: "El Consejo Europeo está compuesto por los jefes de Estado o de Gobierno de los Estados miembros."
        },
        {
          id: "t8-q4",
          question: "¿Cuántos comisarios tiene la Comisión Europea?",
          options: ["15", "27", "30", "35"],
          correctAnswer: 1,
          explanation: "La Comisión Europea tiene 27 comisarios, uno por cada Estado miembro."
        },
        {
          id: "t8-q5",
          question: "¿Cuáles son las libertades fundamentales de la UE?",
          options: ["Solo circulación", "Circulación de personas, mercancías, servicios, capitales", "Solo servicios", "Solo capitales"],
          correctAnswer: 1,
          explanation: "Las cuatro libertades son circulación de personas, mercancías, servicios y capitales."
        },
        {
          id: "t8-q6",
          question: "¿Qué es la ciudadanía europea?",
          options: ["Solo votar", "Estatus que se añade a la ciudadanía nacional", "Solo viajar", "Solo trabajar"],
          correctAnswer: 1,
          explanation: "La ciudadanía europea se añade a la ciudadanía nacional sin sustituirla."
        },
        {
          id: "t8-q7",
          question: "¿Cuál es la moneda única de la UE?",
          options: ["Marco", "Euro", "Libra", "Franco"],
          correctAnswer: 1,
          explanation: "El euro es la moneda única de la Unión Económica y Monetaria."
        },
        {
          id: "t8-q8",
          question: "¿Qué países no están en la eurozona?",
          options: ["Todos usan euro", "Algunos como Polonia, Hungría", "Solo Reino Unido", "Solo Dinamarca"],
          correctAnswer: 1,
          explanation: "Varios países de la UE como Polonia, Hungría y República Checa aún no han adoptado el euro."
        },
        {
          id: "t8-q9",
          question: "¿Qué es el espacio Schengen?",
          options: ["Solo comercio", "Zona de libre circulación de personas", "Solo estudiantes", "Solo trabajadores"],
          correctAnswer: 1,
          explanation: "Schengen es un espacio de libre circulación de personas sin controles fronterizos internos."
        },
        {
          id: "t8-q10",
          question: "¿Cuántos diputados tiene el Parlamento Europeo?",
          options: ["705", "751", "785", "800"],
          correctAnswer: 0,
          explanation: "El Parlamento Europeo tiene 705 diputados tras el Brexit."
        },
        {
          id: "t8-q11",
          question: "¿Cada cuánto se eligen los diputados europeos?",
          options: ["4 años", "5 años", "6 años", "7 años"],
          correctAnswer: 1,
          explanation: "Los diputados del Parlamento Europeo se eligen cada 5 años."
        },
        {
          id: "t8-q12",
          question: "¿Qué es la política agrícola común (PAC)?",
          options: ["Solo subvenciones", "Política común de agricultura", "Solo comercio", "Solo medio ambiente"],
          correctAnswer: 1,
          explanation: "La PAC es la política común que regula la agricultura y el desarrollo rural en la UE."
        },
        {
          id: "t8-q13",
          question: "¿Cuál es el presupuesto de la UE?",
          options: ["Anual", "Marco financiero plurianual de 7 años", "Bienal", "Trienal"],
          correctAnswer: 1,
          explanation: "La UE tiene un marco financiero plurianual que establece el presupuesto para 7 años."
        },
        {
          id: "t8-q14",
          question: "¿Qué es el procedimiento legislativo ordinario?",
          options: ["Solo Consejo", "Codecisión entre Parlamento y Consejo", "Solo Parlamento", "Solo Comisión"],
          correctAnswer: 1,
          explanation: "Es el procedimiento de codecisión donde Parlamento y Consejo deciden conjuntamente."
        },
        {
          id: "t8-q15",
          question: "¿Cuáles son los criterios de adhesión a la UE?",
          options: ["Solo económicos", "Criterios de Copenhague: políticos, económicos, adopción acquis", "Solo políticos", "Solo geográficos"],
          correctAnswer: 1,
          explanation: "Los criterios incluyen estabilidad democrática, economía de mercado y capacidad de adoptar el acquis."
        },
        {
          id: "t8-q16",
          question: "¿Qué es el Banco Central Europeo?",
          options: ["Banco comercial", "Institución que gestiona la política monetaria", "Solo alemán", "Solo francés"],
          correctAnswer: 1,
          explanation: "El BCE es la institución responsable de la política monetaria en la eurozona."
        },
        {
          id: "t8-q17",
          question: "¿Dónde tiene sede el Parlamento Europeo?",
          options: ["Bruselas", "Estrasburgo", "Luxemburgo", "Frankfurt"],
          correctAnswer: 1,
          explanation: "El Parlamento Europeo tiene su sede oficial en Estrasburgo."
        },
        {
          id: "t8-q18",
          question: "¿Qué es la política de cohesión?",
          options: ["Solo ayudas", "Política para reducir disparidades regionales", "Solo infraestructuras", "Solo empleo"],
          correctAnswer: 1,
          explanation: "La política de cohesión busca reducir las disparidades entre regiones europeas."
        },
        {
          id: "t8-q19",
          question: "¿Cuándo entró España en la CEE?",
          options: ["1985", "1986", "1987", "1988"],
          correctAnswer: 1,
          explanation: "España ingresó en la Comunidad Económica Europea el 1 de enero de 1986."
        },
        {
          id: "t8-q20",
          question: "¿Qué es el artículo 50 del Tratado de la UE?",
          options: ["Adhesión", "Procedimiento de retirada", "Suspensión", "Modificación"],
          correctAnswer: 1,
          explanation: "El artículo 50 establece el procedimiento para que un Estado miembro abandone la UE."
        }
      ]
    },
    {
      themeId: "tema-9",
      themeName: "Informática y Nuevas Tecnologías",
      tests: [
        {
          id: "t9-q1",
          question: "¿Qué es la administración electrónica?",
          options: ["Solo internet", "Uso de TIC en la gestión pública", "Solo ordenadores", "Solo móviles"],
          correctAnswer: 1,
          explanation: "La administración electrónica es el uso de las TIC para mejorar los servicios públicos y la gestión administrativa."
        },
        {
          id: "t9-q2",
          question: "¿Qué es la firma electrónica?",
          options: ["Solo contraseña", "Datos electrónicos para identificar al firmante", "Solo huella", "Solo PIN"],
          correctAnswer: 1,
          explanation: "La firma electrónica son datos en formato electrónico para identificar al firmante."
        },
        {
          id: "t9-q3",
          question: "¿Qué diferencia hay entre firma electrónica simple y avanzada?",
          options: ["Ninguna", "La avanzada permite identificar al firmante y detectar cambios", "Solo el coste", "Solo la velocidad"],
          correctAnswer: 1,
          explanation: "La firma avanzada permite identificar inequívocamente al firmante y detectar cambios posteriores."
        },
        {
          id: "t9-q4",
          question: "¿Qué es un certificado digital?",
          options: ["Solo documento", "Documento electrónico que identifica a personas o entidades", "Solo papel", "Solo clave"],
          correctAnswer: 1,
          explanation: "Es un documento electrónico que vincula los datos de verificación de firma a un signatario."
        },
        {
          id: "t9-q5",
          question: "¿Qué es el DNI electrónico?",
          options: ["Solo tarjeta", "Documento con certificados digitales incorporados", "Solo chip", "Solo código"],
          correctAnswer: 1,
          explanation: "Es el DNI que incorpora un chip con certificados digitales para identificación y firma electrónica."
        },
        {
          id: "t9-q6",
          question: "¿Qué es la interoperabilidad?",
          options: ["Solo conexión", "Capacidad de sistemas para intercambiar información", "Solo software", "Solo hardware"],
          correctAnswer: 1,
          explanation: "Es la capacidad de los sistemas de información para intercambiar datos y posibilitar el intercambio de información."
        },
        {
          id: "t9-q7",
          question: "¿Qué son los datos abiertos?",
          options: ["Solo públicos", "Datos accesibles sin restricciones técnicas o legales", "Solo gratuitos", "Solo gubernamentales"],
          correctAnswer: 1,
          explanation: "Son datos que pueden ser utilizados, reutilizados y redistribuidos libremente por cualquier persona."
        },
        {
          id: "t9-q8",
          question: "¿Qué es el cloud computing?",
          options: ["Solo internet", "Modelo de acceso bajo demanda a recursos informáticos", "Solo almacenamiento", "Solo software"],
          correctAnswer: 1,
          explanation: "Es un modelo que permite el acceso bajo demanda a un conjunto de recursos informáticos configurables."
        },
        {
          id: "t9-q9",
          question: "¿Qué es big data?",
          options: ["Solo tamaño", "Conjuntos de datos complejos que requieren tecnologías específicas", "Solo velocidad", "Solo variedad"],
          correctAnswer: 1,
          explanation: "Son conjuntos de datos tan grandes y complejos que requieren aplicaciones informáticas no tradicionales."
        },
        {
          id: "t9-q10",
          question: "¿Qué es la inteligencia artificial?",
          options: ["Solo robots", "Capacidad de máquinas para realizar tareas cognitivas", "Solo algoritmos", "Solo aprendizaje"],
          correctAnswer: 1,
          explanation: "Es la capacidad de las máquinas para realizar tareas que normalmente requieren inteligencia humana."
        },
        {
          id: "t9-q11",
          question: "¿Qué es la ciberseguridad?",
          options: ["Solo antivirus", "Protección de sistemas digitales contra amenazas", "Solo firewalls", "Solo contraseñas"],
          correctAnswer: 1,
          explanation: "Es la práctica de proteger sistemas, redes y programas de ataques digitales."
        },
        {
          id: "t9-q12",
          question: "¿Qué es el RGPD?",
          options: ["Solo español", "Reglamento General de Protección de Datos europeo", "Solo empresas", "Solo internet"],
          correctAnswer: 1,
          explanation: "Es el Reglamento (UE) 2016/679 relativo a la protección de las personas físicas en el tratamiento de datos personales."
        },
        {
          id: "t9-q13",
          question: "¿Qué derechos otorga el RGPD?",
          options: ["Solo acceso", "Acceso, rectificación, supresión, portabilidad", "Solo rectificación", "Solo supresión"],
          correctAnswer: 1,
          explanation: "Otorga derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición."
        },
        {
          id: "t9-q14",
          question: "¿Qué es el teletrabajo?",
          options: ["Solo casa", "Modalidad laboral usando TIC fuera del centro habitual", "Solo móvil", "Solo temporal"],
          correctAnswer: 1,
          explanation: "Es una modalidad de organización del trabajo que se realiza fuera del centro habitual usando TIC."
        },
        {
          id: "t9-q15",
          question: "¿Qué es la brecha digital?",
          options: ["Solo internet", "Desigualdad en el acceso y uso de TIC", "Solo ordenadores", "Solo móviles"],
          correctAnswer: 1,
          explanation: "Es la desigualdad entre personas que tienen acceso a las TIC y las que no."
        },
        {
          id: "t9-q16",
          question: "¿Qué es la agenda digital?",
          options: ["Solo calendario", "Estrategia para el desarrollo de la sociedad digital", "Solo apps", "Solo tecnología"],
          correctAnswer: 1,
          explanation: "Es la estrategia para el desarrollo de la sociedad de la información y el conocimiento."
        },
        {
          id: "t9-q17",
          question: "¿Qué es la ventanilla única?",
          options: ["Solo presencial", "Punto de acceso único para múltiples servicios", "Solo online", "Solo telefónica"],
          correctAnswer: 1,
          explanation: "Es un punto único donde los ciudadanos pueden acceder a múltiples servicios administrativos."
        },
        {
          id: "t9-q18",
          question: "¿Qué es el Internet de las Cosas (IoT)?",
          options: ["Solo web", "Interconexión de objetos cotidianos con internet", "Solo móviles", "Solo sensores"],
          correctAnswer: 1,
          explanation: "Es la interconexión digital de objetos cotidianos con internet."
        },
        {
          id: "t9-q19",
          question: "¿Qué es blockchain?",
          options: ["Solo bitcoin", "Tecnología de registro distribuido", "Solo criptomonedas", "Solo bancos"],
          correctAnswer: 1,
          explanation: "Es una tecnología de registro distribuido que permite el almacenamiento de datos de forma segura."
        },
        {
          id: "t9-q20",
          question: "¿Qué es la transformación digital?",
          options: ["Solo tecnología", "Proceso integral de cambio organizacional usando TIC", "Solo digitalizar", "Solo automatizar"],
          correctAnswer: 1,
          explanation: "Es el proceso integral de cambio en los modelos de negocio y organizacionales mediante las TIC."
        }
      ]
    },
    {
      themeId: "tema-10",
      themeName: "Prevención de Riesgos Laborales",
      tests: [
        {
          id: "t10-q1",
          question: "¿Qué ley regula la prevención de riesgos laborales?",
          options: ["Ley 30/1995", "Ley 31/1995", "Ley 32/1995", "Ley 33/1995"],
          correctAnswer: 1,
          explanation: "La Ley 31/1995 de Prevención de Riesgos Laborales regula esta materia."
        },
        {
          id: "t10-q2",
          question: "¿Cuáles son los principios de la acción preventiva?",
          options: ["Solo protección", "Evitar, evaluar, combatir, adaptar, sustituir", "Solo evaluar", "Solo combatir"],
          correctAnswer: 1,
          explanation: "Los principios incluyen evitar riesgos, evaluar los inevitables, combatir en origen, adaptar el trabajo a la persona."
        },
        {
          id: "t10-q3",
          question: "¿Cuáles son los derechos de los trabajadores?",
          options: ["Solo información", "Información, formación, consulta, participación", "Solo formación", "Solo participación"],
          correctAnswer: 1,
          explanation: "Los trabajadores tienen derecho a información, formación, consulta y participación en materia preventiva."
        },
        {
          id: "t10-q4",
          question: "¿Cuáles son las obligaciones del empresario?",
          options: ["Solo evaluar", "Garantizar seguridad y salud, evaluar riesgos, planificar", "Solo planificar", "Solo formar"],
          correctAnswer: 1,
          explanation: "Debe garantizar la seguridad y salud, evaluar riesgos, planificar la actividad preventiva y formar a los trabajadores."
        },
        {
          id: "t10-q5",
          question: "¿Qué es la evaluación de riesgos?",
          options: ["Solo lista", "Proceso dirigido a estimar la magnitud de riesgos", "Solo inspección", "Solo medición"],
          correctAnswer: 1,
          explanation: "Es el proceso dirigido a estimar la magnitud de los riesgos que no han podido evitarse."
        },
        {
          id: "t10-q6",
          question: "¿Cuándo debe realizarse la evaluación de riesgos?",
          options: ["Solo al inicio", "Inicialmente y cuando cambien las condiciones", "Solo anualmente", "Solo si hay accidentes"],
          correctAnswer: 1,
          explanation: "Debe realizarse inicialmente y revisarse cuando cambien las condiciones de trabajo."
        },
        {
          id: "t10-q7",
          question: "¿Qué es la planificación de la actividad preventiva?",
          options: ["Solo cronograma", "Conjunto de actividades para eliminar o reducir riesgos", "Solo presupuesto", "Solo objetivos"],
          correctAnswer: 1,
          explanation: "Es el conjunto coherente de actividades preventivas para eliminar o reducir y controlar riesgos."
        },
        {
          id: "t10-q8",
          question: "¿Cuáles son las modalidades de organización preventiva?",
          options: ["Solo interna", "Asunción personal, trabajadores designados, servicio propio, externo", "Solo externa", "Solo designados"],
          correctAnswer: 1,
          explanation: "Las modalidades son asunción personal, trabajadores designados, servicio de prevención propio y ajeno."
        },
        {
          id: "t10-q9",
          question: "¿Qué es un equipo de protección individual (EPI)?",
          options: ["Solo ropa", "Equipo destinado a proteger contra riesgos", "Solo casco", "Solo guantes"],
          correctAnswer: 1,
          explanation: "Es cualquier equipo destinado a ser llevado o sujetado por el trabajador para protegerle de riesgos."
        },
        {
          id: "t10-q10",
          question: "¿Cuándo se debe usar un EPI?",
          options: ["Siempre", "Cuando no se puedan evitar riesgos por otros medios", "Solo en emergencias", "Solo si se quiere"],
          correctAnswer: 1,
          explanation: "Los EPI deben utilizarse cuando los riesgos no se puedan evitar o limitar por otros medios."
        },
        {
          id: "t10-q11",
          question: "¿Qué es la vigilancia de la salud?",
          options: ["Solo médica", "Seguimiento del estado de salud de los trabajadores", "Solo psicológica", "Solo física"],
          correctAnswer: 1,
          explanation: "Es el seguimiento del estado de salud de los trabajadores para detectar precozmente alteraciones."
        },
        {
          id: "t10-q12",
          question: "¿Es obligatoria la vigilancia de la salud?",
          options: ["Siempre", "Solo en casos específicos previstos legalmente", "Nunca", "Solo si hay riesgos"],
          correctAnswer: 1,
          explanation: "Es voluntaria salvo en casos específicos previstos en la normativa o cuando sea imprescindible."
        },
        {
          id: "t10-q13",
          question: "¿Qué son las medidas de emergencia?",
          options: ["Solo evacuación", "Procedimientos para situaciones de riesgo grave e inminente", "Solo primeros auxilios", "Solo comunicación"],
          correctAnswer: 1,
          explanation: "Son procedimientos de actuación en caso de riesgo grave e inminente que no pueda evitarse."
        },
        {
          id: "t10-q14",
          question: "¿Cuáles son las especialidades preventivas?",
          options: ["Solo medicina", "Seguridad, higiene, ergonomía, medicina", "Solo higiene", "Solo ergonomía"],
          correctAnswer: 1,
          explanation: "Las especialidades son seguridad en el trabajo, higiene industrial, ergonomía y medicina del trabajo."
        },
        {
          id: "t10-q15",
          question: "¿Qué es un accidente de trabajo?",
          options: ["Solo en el puesto", "Lesión corporal por causa del trabajo", "Solo con baja", "Solo grave"],
          correctAnswer: 1,
          explanation: "Es toda lesión corporal que el trabajador sufra con ocasi��n o por consecuencia del trabajo."
        },
        {
          id: "t10-q16",
          question: "¿Qué es una enfermedad profesional?",
          options: ["Solo contagiosa", "Contraída por acción de elementos del trabajo", "Solo hereditaria", "Solo mental"],
          correctAnswer: 1,
          explanation: "Es la contraída a consecuencia del trabajo ejecutado por cuenta ajena en actividades específicas."
        },
        {
          id: "t10-q17",
          question: "¿Cuáles son las obligaciones de los trabajadores?",
          options: ["Solo obedecer", "Usar medios de protección, informar de riesgos", "Solo informar", "Solo protegerse"],
          correctAnswer: 1,
          explanation: "Deben usar adecuadamente medios de protección, informar de riesgos y cooperar en la prevención."
        },
        {
          id: "t10-q18",
          question: "¿Qué es el comité de seguridad y salud?",
          options: ["Solo consultivo", "Órgano paritario de consulta y participación", "Solo informativo", "Solo decisorio"],
          correctAnswer: 1,
          explanation: "Es el órgano paritario y colegiado de participación destinado a la consulta regular en materia preventiva."
        },
        {
          id: "t10-q19",
          question: "¿Cuándo debe constituirse el comité de seguridad y salud?",
          options: ["Siempre", "En empresas de 50 o más trabajadores", "Solo en industrias", "Solo si hay riesgos"],
          correctAnswer: 1,
          explanation: "Debe constituirse en todas las empresas o centros de trabajo que cuenten con 50 o más trabajadores."
        },
        {
          id: "t10-q20",
          question: "¿Qué son los delegados de prevención?",
          options: ["Solo sindicales", "Representantes de los trabajadores en prevención", "Solo técnicos", "Solo médicos"],
          correctAnswer: 1,
          explanation: "Son los representantes de los trabajadores con funciones específicas en materia de prevención de riesgos."
        }
      ]
    },
    {
      themeId: "tema-11",
      themeName: "Igualdad de Género",
      tests: [
        {
          id: "t11-q1",
          question: "¿Qué ley regula la igualdad efectiva entre mujeres y hombres?",
          options: ["Ley 2/2007", "Ley 3/2007", "Ley 4/2007", "Ley 5/2007"],
          correctAnswer: 1,
          explanation: "La Ley Orgánica 3/2007 para la igualdad efectiva de mujeres y hombres regula esta materia."
        },
        {
          id: "t11-q2",
          question: "¿Qué es la discriminación directa?",
          options: ["Solo laboral", "Trato desfavorable por razón de sexo", "Solo salarial", "Solo promocional"],
          correctAnswer: 1,
          explanation: "Es la situación en que se encuentra una persona que sea, haya sido o pudiera ser tratada de manera menos favorable por razón de sexo."
        },
        {
          id: "t11-q3",
          question: "¿Qué es la discriminación indirecta?",
          options: ["Solo sutil", "Disposición aparentemente neutra que perjudica más a un sexo", "Solo intencionada", "Solo evidente"],
          correctAnswer: 1,
          explanation: "Es una disposición, criterio o práctica aparentemente neutros que ponen a personas de un sexo en desventaja particular."
        },
        {
          id: "t11-q4",
          question: "¿Qué es el acoso sexual?",
          options: ["Solo físico", "Comportamiento de naturaleza sexual no deseado", "Solo verbal", "Solo laboral"],
          correctAnswer: 1,
          explanation: "Es cualquier comportamiento, verbal o físico, de naturaleza sexual que tenga el propósito o produzca el efecto de atentar contra la dignidad."
        },
        {
          id: "t11-q5",
          question: "¿Qué son las acciones positivas?",
          options: ["Solo cuotas", "Medidas específicas para corregir desigualdades", "Solo preferencias", "Solo promoción"],
          correctAnswer: 1,
          explanation: "Son medidas específicas a favor de las mujeres para corregir situaciones patentes de desigualdad de hecho."
        },
        {
          id: "t11-q6",
          question: "¿Qué es la representación equilibrada?",
          options: ["50% exacto", "Presencia de mujeres y hombres no inferior al 40%", "60% mujeres", "Solo paridad"],
          correctAnswer: 1,
          explanation: "Se considera representación equilibrada aquella situación que asegure la presencia de mujeres y hombres al menos en un 40%."
        },
        {
          id: "t11-q7",
          question: "¿Qué es el mainstreaming de género?",
          options: ["Solo política", "Integración de la perspectiva de género en todas las políticas", "Solo transversal", "Solo específica"],
          correctAnswer: 1,
          explanation: "Es la integración de la perspectiva de género en todas las políticas y acciones públicas."
        },
        {
          id: "t11-q8",
          question: "¿Qué es un plan de igualdad?",
          options: ["Solo documento", "Conjunto ordenado de medidas para alcanzar la igualdad", "Solo objetivos", "Solo diagnóstico"],
          correctAnswer: 1,
          explanation: "Es un conjunto ordenado de medidas, adoptadas después de realizar un diagnóstico de situación, tendentes a alcanzar la igualdad."
        },
        {
          id: "t11-q9",
          question: "¿Cuándo son obligatorios los planes de igualdad?",
          options: ["Siempre", "Empresas de más de 50 trabajadores", "Solo públicas", "Solo grandes"],
          correctAnswer: 1,
          explanation: "Son obligatorios en empresas de más de 50 trabajadores, tras convenio colectivo o resolución administrativa."
        },
        {
          id: "t11-q10",
          question: "¿Qué es la brecha salarial de género?",
          options: ["Solo diferencia", "Diferencia porcentual entre salarios de hombres y mujeres", "Solo discriminación", "Solo estadística"],
          correctAnswer: 1,
          explanation: "Es la diferencia porcentual entre los salarios medios de hombres y mujeres."
        },
        {
          id: "t11-q11",
          question: "¿Qué medidas de conciliación establece la ley?",
          options: ["Solo permisos", "Flexibilidad horaria, permisos, excedencias, reducciones", "Solo excedencias", "Solo reducciones"],
          correctAnswer: 1,
          explanation: "Incluye flexibilidad horaria, permisos parentales, excedencias por cuidado y reducciones de jornada."
        },
        {
          id: "t11-q12",
          question: "¿Qué es el permiso de paternidad?",
          options: ["Solo días", "Derecho del padre al nacer o adoptar un hijo", "Solo adopción", "Solo matrimonio"],
          correctAnswer: 1,
          explanation: "Es el derecho del padre a disfrutar de un permiso por nacimiento, adopción o acogimiento de un hijo."
        },
        {
          id: "t11-q13",
          question: "¿Qué es la violencia de género?",
          options: ["Solo física", "Violencia ejercida contra las mujeres por el hecho de serlo", "Solo psicológica", "Solo sexual"],
          correctAnswer: 1,
          explanation: "Es la violencia que se ejerce contra las mujeres por parte de quienes sean o hayan sido sus cónyuges o de quienes estén o hayan estado ligados a ellas por relaciones similares de afectividad."
        },
        {
          id: "t11-q14",
          question: "¿Qué protección tienen las víctimas de violencia de género?",
          options: ["Solo penal", "Integral: judicial, social, económica, laboral", "Solo social", "Solo económica"],
          correctAnswer: 1,
          explanation: "La protección es integral e incluye medidas judiciales, sociales, económicas, laborales y de asistencia."
        },
        {
          id: "t11-q15",
          question: "¿Qué es el lenguaje inclusivo?",
          options: ["Solo femenino", "Uso del lenguaje que no excluye por razón de sexo", "Solo masculino", "Solo neutro"],
          correctAnswer: 1,
          explanation: "Es la utilización de un lenguaje no sexista que incluye a mujeres y hombres de manera equilibrada."
        },
        {
          id: "t11-q16",
          question: "¿Qué son los presupuestos con perspectiva de género?",
          options: ["Solo gastos", "Presupuestos que analizan el impacto diferencial por sexo", "Solo ingresos", "Solo políticas"],
          correctAnswer: 1,
          explanation: "Son instrumentos que analizan el impacto diferencial de las políticas presupuestarias en mujeres y hombres."
        },
        {
          id: "t11-q17",
          question: "¿Qué es la corresponsabilidad?",
          options: ["Solo laboral", "Reparto equilibrado de responsabilidades familiares", "Solo doméstica", "Solo cuidados"],
          correctAnswer: 1,
          explanation: "Es el reparto equilibrado entre mujeres y hombres de las responsabilidades familiares y domésticas."
        },
        {
          id: "t11-q18",
          question: "¿Qué organismos velan por la igualdad?",
          options: ["Solo uno", "Instituto de la Mujer, Observatorio, Unidades de Igualdad", "Solo Instituto", "Solo Observatorio"],
          correctAnswer: 1,
          explanation: "Incluyen el Instituto de la Mujer, el Observatorio Estatal de Violencia y las Unidades de Igualdad."
        },
        {
          id: "t11-q19",
          question: "¿Qué es la discriminación múltiple?",
          options: ["Solo doble", "Discriminación por varios motivos incluido el sexo", "Solo triple", "Solo interseccional"],
          correctAnswer: 1,
          explanation: "Es la situación de discriminación que se produce por varios motivos, uno de los cuales es el sexo."
        },
        {
          id: "t11-q20",
          question: "¿Cuáles son los principios generales de igualdad?",
          options: ["Solo igualdad", "Igualdad de trato, ausencia de discriminación, transversalidad", "Solo transversalidad", "Solo no discriminación"],
          correctAnswer: 1,
          explanation: "Los principios son igualdad de trato y oportunidades, ausencia de discriminación y transversalidad del principio de igualdad."
        }
      ]
    },
    {
      themeId: "tema-12",
      themeName: "Transparencia y Acceso a la Información",
      tests: [
        {
          id: "t12-q1",
          question: "¿Qué ley regula la transparencia y el acceso a la información?",
          options: ["Ley 18/2013", "Ley 19/2013", "Ley 20/2013", "Ley 21/2013"],
          correctAnswer: 1,
          explanation: "La Ley 19/2013 de transparencia, acceso a la información pública y buen gobierno regula esta materia."
        },
        {
          id: "t12-q2",
          question: "¿Cuáles son los pilares de la ley de transparencia?",
          options: ["Solo transparencia", "Transparencia, acceso a información, buen gobierno", "Solo acceso", "Solo buen gobierno"],
          correctAnswer: 1,
          explanation: "Los tres pilares son transparencia activa, derecho de acceso a la información y buen gobierno."
        },
        {
          id: "t12-q3",
          question: "¿Qué es la transparencia activa?",
          options: ["Solo solicitar", "Publicación proactiva de información por las administraciones", "Solo responder", "Solo archivar"],
          correctAnswer: 1,
          explanation: "Es la obligación de publicar de forma proactiva información pública sin necesidad de solicitud previa."
        },
        {
          id: "t12-q4",
          question: "¿Qué información debe publicarse de forma activa?",
          options: ["Solo básica", "Institucional, organizativa, planificación, jurídica, económica", "Solo económica", "Solo jurídica"],
          correctAnswer: 1,
          explanation: "Debe publicarse información institucional, organizativa, de planificación, jurídica y económica, presupuestaria y estadística."
        },
        {
          id: "t12-q5",
          question: "¿Quién puede ejercer el derecho de acceso?",
          options: ["Solo españoles", "Todas las personas", "Solo residentes", "Solo ciudadanos UE"],
          correctAnswer: 1,
          explanation: "Todas las personas tienen derecho a acceder a la información pública sin necesidad de motivar la solicitud."
        },
        {
          id: "t12-q6",
          question: "¿Cuál es el plazo para resolver solicitudes de acceso?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El plazo máximo para resolver y notificar es de un mes desde la recepción de la solicitud."
        },
        {
          id: "t12-q7",
          question: "¿Cuándo se puede denegar el acceso a la información?",
          options: ["Nunca", "Cuando afecte a la seguridad, defensa, política económica", "Siempre", "Solo si es clasificada"],
          correctAnswer: 1,
          explanation: "Se puede denegar cuando afecte a seguridad nacional, defensa, relaciones exteriores, política económica, etc."
        },
        {
          id: "t12-q8",
          question: "¿Qué es el test de daño?",
          options: ["Solo evaluación", "Ponderación entre interés público y protección", "Solo análisis", "Solo comparación"],
          correctAnswer: 1,
          explanation: "Es la ponderación entre el interés público en la divulgación y la necesidad de protección de la información."
        },
        {
          id: "t12-q9",
          question: "¿Qué es el test de interés público?",
          options: ["Solo beneficio", "Evaluación si el interés público en conocer supera el daño", "Solo utilidad", "Solo conveniencia"],
          correctAnswer: 1,
          explanation: "Evalúa si existe un interés público en la divulgación que supere al daño que pueda causar."
        },
        {
          id: "t12-q10",
          question: "¿Qué organismo supervisa el cumplimiento de la ley?",
          options: ["Ministerio", "Consejo de Transparencia y Buen Gobierno", "Tribunal", "Defensor del Pueblo"],
          correctAnswer: 1,
          explanation: "El Consejo de Transparencia y Buen Gobierno es el organismo independiente que supervisa su cumplimiento."
        },
        {
          id: "t12-q11",
          question: "¿Qué recurso cabe contra la denegación de acceso?",
          options: ["Solo judicial", "Reclamación ante el Consejo de Transparencia", "Solo administrativo", "Solo parlamentario"],
          correctAnswer: 1,
          explanation: "Se puede presentar reclamación ante el Consejo de Transparencia y Buen Gobierno."
        },
        {
          id: "t12-q12",
          question: "¿Qué coste tiene el acceso a la información?",
          options: ["Siempre gratis", "Gratuito, salvo gastos de copia o envío", "Siempre de pago", "Según la información"],
          correctAnswer: 1,
          explanation: "El acceso es gratuito, aunque se pueden exigir tasas por la expedición de copias o envío."
        },
        {
          id: "t12-q13",
          question: "¿Qué es el buen gobierno?",
          options: ["Solo honestidad", "Principios éticos en el ejercicio de responsabilidades públicas", "Solo eficiencia", "Solo transparencia"],
          correctAnswer: 1,
          explanation: "Son los principios éticos que deben presidir el ejercicio de responsabilidades públicas."
        },
        {
          id: "t12-q14",
          question: "¿Cuáles son los principios del buen gobierno?",
          options: ["Solo uno", "Transparencia, eficacia, honradez, responsabilidad", "Solo transparencia", "Solo responsabilidad"],
          correctAnswer: 1,
          explanation: "Incluyen transparencia, eficacia, honradez, promoción del entorno económico, responsabilidad y ejemplaridad."
        },
        {
          id: "t12-q15",
          question: "¿Qué obligaciones tienen los altos cargos?",
          options: ["Solo declarar", "Declaración bienes, intereses, abstención en conflictos", "Solo abstenerse", "Solo informar"],
          correctAnswer: 1,
          explanation: "Deben hacer declaración de bienes e intereses y abstenerse en situaciones de conflicto de intereses."
        },
        {
          id: "t12-q16",
          question: "¿Qué es un conflicto de intereses?",
          options: ["Solo económico", "Situación que afecta al ejercicio imparcial de funciones", "Solo personal", "Solo profesional"],
          correctAnswer: 1,
          explanation: "Es una situación en que los intereses personales pueden afectar al ejercicio imparcial e independiente de las funciones públicas."
        },
        {
          id: "t12-q17",
          question: "¿Qué información está protegida?",
          options: ["Toda", "Datos personales, secretos oficiales, propiedad intelectual", "Ninguna", "Solo clasificada"],
          correctAnswer: 1,
          explanation: "Está protegida la información con datos personales, secretos oficiales, propiedad intelectual e industrial."
        },
        {
          id: "t12-q18",
          question: "¿Cuándo debe actualizarse la información publicada?",
          options: ["Anualmente", "Cuando se produzcan cambios", "Mensualmente", "Trimestralmente"],
          correctAnswer: 1,
          explanation: "La información debe mantenerse actualizada y debe actualizarse cuando se produzcan modificaciones."
        },
        {
          id: "t12-q19",
          question: "¿Qué formato debe tener la información publicada?",
          options: ["Solo PDF", "Reutilizable, accesible, interoperable", "Solo HTML", "Solo texto"],
          correctAnswer: 1,
          explanation: "La información debe publicarse en formatos reutilizables, accesibles e interoperables."
        },
        {
          id: "t12-q20",
          question: "¿Qué sanciones prevé la ley de transparencia?",
          options: ["Solo multas", "Disciplinarias para empleados públicos", "Solo penales", "Solo administrativas"],
          correctAnswer: 1,
          explanation: "Prevé régimen sancionador disciplinario para empleados p��blicos que incumplan las obligaciones."
        }
      ]
    },
    {
      themeId: "tema-13",
      themeName: "Protección de Datos Personales",
      tests: [
        {
          id: "t13-q1",
          question: "¿Qué normativa regula la protección de datos en España?",
          options: ["Solo LOPD", "RGPD y Ley Orgánica 3/2018", "Solo RGPD", "Solo Ley 3/2018"],
          correctAnswer: 1,
          explanation: "Se aplica el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos."
        },
        {
          id: "t13-q2",
          question: "¿Qué son los datos personales?",
          options: ["Solo nombre", "Información que identifica a una persona física", "Solo DNI", "Solo dirección"],
          correctAnswer: 1,
          explanation: "Son toda información sobre una persona física identificada o identificable."
        },
        {
          id: "t13-q3",
          question: "¿Cuáles son los principios del tratamiento de datos?",
          options: ["Solo legalidad", "Licitud, lealtad, transparencia, limitación finalidad", "Solo transparencia", "Solo minimización"],
          correctAnswer: 1,
          explanation: "Los principios incluyen licitud, lealtad, transparencia, limitación de finalidad, minimización, exactitud, limitación plazo."
        },
        {
          id: "t13-q4",
          question: "¿Cuáles son las bases legales para el tratamiento?",
          options: ["Solo consentimiento", "Consentimiento, ejecución contrato, obligación legal, interés vital, interés público, interés legítimo", "Solo contrato", "Solo ley"],
          correctAnswer: 1,
          explanation: "Las bases son consentimiento, ejecución de contrato, cumplimiento de obligación legal, protección de intereses vitales, misión de interés público e interés legítimo."
        },
        {
          id: "t13-q5",
          question: "¿Qué características debe tener el consentimiento?",
          options: ["Solo verbal", "Libre, específico, informado e inequívoco", "Solo escrito", "Solo tácito"],
          correctAnswer: 1,
          explanation: "El consentimiento debe ser libre, específico, informado e inequívoco."
        },
        {
          id: "t13-q6",
          question: "¿Cuáles son los derechos de los interesados?",
          options: ["Solo acceso", "Acceso, rectificación, supresión, limitación, portabilidad, oposición", "Solo rectificación", "Solo supresión"],
          correctAnswer: 1,
          explanation: "Los derechos son acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición."
        },
        {
          id: "t13-q7",
          question: "¿Cuál es el plazo para responder a ejercicio de derechos?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El responsable debe responder en el plazo de un mes desde la recepción de la solicitud."
        },
        {
          id: "t13-q8",
          question: "¿Qué es el derecho al olvido?",
          options: ["Solo borrar", "Derecho de supresión de datos", "Solo ocultar", "Solo modificar"],
          correctAnswer: 1,
          explanation: "Es el derecho del interesado a obtener la supresión de sus datos personales cuando concurran determinadas circunstancias."
        },
        {
          id: "t13-q9",
          question: "¿Qu�� es la portabilidad de datos?",
          options: ["Solo copiar", "Derecho a recibir datos en formato estructurado", "Solo transferir", "Solo exportar"],
          correctAnswer: 1,
          explanation: "Es el derecho a recibir los datos personales en un formato estructurado, de uso común y lectura mecánica."
        },
        {
          id: "t13-q10",
          question: "¿Qué son las categorías especiales de datos?",
          options: ["Solo sensibles", "Datos que revelan origen racial, opiniones políticas, salud", "Solo médicos", "Solo ideol��gicos"],
          correctAnswer: 1,
          explanation: "Son datos que revelan origen étnico o racial, opiniones políticas, convicciones religiosas, datos de salud, vida sexual."
        },
        {
          id: "t13-q11",
          question: "¿Cuándo se pueden tratar categorías especiales de datos?",
          options: ["Libremente", "Consentimiento explícito o excepciones específicas", "Solo con autorización", "Solo en emergencias"],
          correctAnswer: 1,
          explanation: "Requieren consentimiento explícito del interesado o que concurra alguna de las excepciones previstas."
        },
        {
          id: "t13-q12",
          question: "¿Qué es la evaluación de impacto?",
          options: ["Solo análisis", "Proceso para evaluar riesgos del tratamiento", "Solo informe", "Solo valoración"],
          correctAnswer: 1,
          explanation: "Es el proceso destinado a evaluar los riesgos que pueden derivarse del tratamiento de datos personales."
        },
        {
          id: "t13-q13",
          question: "¿Cuándo es obligatoria la evaluación de impacto?",
          options: ["Siempre", "Cuando el tratamiento pueda entrañar alto riesgo", "Nunca", "Solo categorías especiales"],
          correctAnswer: 1,
          explanation: "Es obligatoria cuando el tipo de tratamiento pueda entrañar un alto riesgo para los derechos y libertades."
        },
        {
          id: "t13-q14",
          question: "¿Qué es el delegado de protección de datos?",
          options: ["Solo responsable", "Experto que supervisa el cumplimiento", "Solo encargado", "Solo consultor"],
          correctAnswer: 1,
          explanation: "Es la persona designada para supervisar el cumplimiento de la normativa de protección de datos."
        },
        {
          id: "t13-q15",
          question: "¿Cuándo es obligatorio nombrar un DPD?",
          options: ["Siempre", "Autoridades públicas, seguimiento habitual, categorías especiales", "Solo públicos", "Solo privados"],
          correctAnswer: 1,
          explanation: "Es obligatorio para autoridades públicas, seguimiento habitual y sistemático, y tratamiento a gran escala de categorías especiales."
        },
        {
          id: "t13-q16",
          question: "¿Qué es una violación de seguridad?",
          options: ["Solo hackeo", "Destrucción, pérdida, alteración, divulgación no autorizada", "Solo robo", "Solo acceso"],
          correctAnswer: 1,
          explanation: "Es toda violación de la seguridad que ocasione destrucción, pérdida, alteración accidental o divulgación no autorizada."
        },
        {
          id: "t13-q17",
          question: "¿Cuándo debe notificarse una violación?",
          options: ["Inmediatamente", "72 horas a la autoridad, sin dilación al interesado si alto riesgo", "1 semana", "1 mes"],
          correctAnswer: 1,
          explanation: "Debe notificarse a la autoridad en 72 horas y al interesado sin dilación indebida si supone alto riesgo."
        },
        {
          id: "t13-q18",
          question: "¿Qué sanciones prevé el RGPD?",
          options: ["Solo multas", "Hasta 20 millones o 4% facturación anual", "Solo apercibimientos", "Solo prohibiciones"],
          correctAnswer: 1,
          explanation: "Las multas pueden ser de hasta 20 millones de euros o el 4% de la facturación anual total, lo que sea mayor."
        },
        {
          id: "t13-q19",
          question: "¿Quién es la autoridad de control en España?",
          options: ["Ministerio", "Agencia Española de Protección de Datos", "Tribunal", "Fiscalía"],
          correctAnswer: 1,
          explanation: "La Agencia Española de Protección de Datos (AEPD) es la autoridad de control independiente."
        },
        {
          id: "t13-q20",
          question: "¿Qué es la privacidad desde el diseño?",
          options: ["Solo técnica", "Integrar protección de datos desde el inicio", "Solo legal", "Solo organizativa"],
          correctAnswer: 1,
          explanation: "Es la integración de la protección de datos desde el diseño inicial y por defecto en los sistemas y procesos."
        }
      ]
    }
  ],

  "administrativo-estado": [
    {
      themeId: "tema-1",
      themeName: "Régimen Jurídico del Sector Público",
      tests: [
        {
          id: "t1-q1",
          question: "¿Qué ley regula el régimen jurídico del sector público?",
          options: ["Ley 39/2015", "Ley 40/2015", "Ley 19/2013", "Ley 30/1992"],
          correctAnswer: 1,
          explanation: "La Ley 40/2015 regula el Régimen Jurídico del Sector Público."
        },
        {
          id: "t1-q2",
          question: "¿Cuál es el principio de jerarquía normativa en España?",
          options: ["Constitución > Ley > Reglamento", "Ley > Constitución > Reglamento", "Reglamento > Ley > Constitución", "Todas tienen el mismo rango"],
          correctAnswer: 0,
          explanation: "La jerarquía normativa sitúa la Constitución en primer lugar, seguida de las leyes y después los reglamentos."
        },
        {
          id: "t1-q3",
          question: "¿Qué es una competencia exclusiva del Estado?",
          options: ["Educación", "Sanidad", "Defensa", "Cultura"],
          correctAnswer: 2,
          explanation: "La defensa es una competencia exclusiva del Estado según el artículo 149 de la Constitución."
        },
        {
          id: "t1-q4",
          question: "¿Cuándo entra en vigor una ley?",
          options: ["Al día siguiente de su publicación", "A los 20 días de su publicación", "Cuando lo determine la propia ley", "Inmediatamente tras su aprobación"],
          correctAnswer: 2,
          explanation: "Las leyes entran en vigor cuando lo determine su disposición final, o subsidiariamente a los 20 días."
        },
        {
          id: "t1-q5",
          question: "¿Qué es un Real Decreto-ley?",
          options: ["Una ley ordinaria", "Una norma con rango de ley dictada por el Gobierno", "Un reglamento", "Una directiva europea"],
          correctAnswer: 1,
          explanation: "El Real Decreto-ley es una norma con rango de ley dictada por el Gobierno en caso de extraordinaria y urgente necesidad."
        },
        {
          id: "t1-q6",
          question: "¿Cuáles son los sectores del sector público?",
          options: ["Solo Administración General", "Administración institucional y empresarial", "Sector público administrativo, empresarial y fundacional", "Solo empresas públicas"],
          correctAnswer: 2,
          explanation: "El sector público se divide en sectores administrativo, empresarial y fundacional."
        },
        {
          id: "t1-q7",
          question: "¿Qué principios rigen la actuación de las Administraciones Públicas?",
          options: ["Solo legalidad", "Eficacia y eficiencia", "Legalidad, eficacia, jerarquía, descentralización", "Solo jerarquía"],
          correctAnswer: 2,
          explanation: "Se rigen por los principios de legalidad, eficacia, jerarquía, descentralización, desconcentración y coordinación."
        },
        {
          id: "t1-q8",
          question: "¿Qué es la potestad reglamentaria?",
          options: ["Poder de hacer leyes", "Capacidad de dictar reglamentos", "Interpretar normas", "Aplicar sanciones"],
          correctAnswer: 1,
          explanation: "La potestad reglamentaria es la capacidad de las Administraciones para dictar reglamentos."
        },
        {
          id: "t1-q9",
          question: "¿Cuál es el límite temporal de los Reales Decretos-leyes?",
          options: ["Sin límite", "30 días", "60 días", "90 días"],
          correctAnswer: 0,
          explanation: "No tienen límite temporal específico, pero deben ser convalidados por el Congreso en 30 días."
        },
        {
          id: "t1-q10",
          question: "¿Qué materias no puede regular un Real Decreto-ley?",
          options: ["Ninguna limitación", "Ordenación institucional CC.AA.", "Solo materias urgentes", "Todas las materias"],
          correctAnswer: 1,
          explanation: "No puede afectar al ordenamiento de las instituciones básicas del Estado, derechos del Título I, régimen de las CC.AA. o Derecho electoral."
        },
        {
          id: "t1-q11",
          question: "¿Qué es la coordinación entre Administraciones?",
          options: ["Subordinación jerárquica", "Integración de actuaciones", "Control de legalidad", "Descentralización"],
          correctAnswer: 1,
          explanation: "La coordinación busca la integración de la actividad de las diferentes Administraciones en un resultado unitario."
        },
        {
          id: "t1-q12",
          question: "¿Cuándo es obligatoria la colaboración entre Administraciones?",
          options: ["Nunca", "Solo si hay convenio", "Cuando sea necesario", "Siempre"],
          correctAnswer: 2,
          explanation: "La colaboración es obligatoria cuando sea necesaria para la eficacia de la actuación administrativa."
        },
        {
          id: "t1-q13",
          question: "¿Qué son los convenios de colaboración?",
          options: ["Contratos privados", "Acuerdos entre Administraciones", "Normas reglamentarias", "Actos administrativos"],
          correctAnswer: 1,
          explanation: "Son acuerdos entre dos o más Administraciones Públicas para actuar de forma coordinada."
        },
        {
          id: "t1-q14",
          question: "¿Cuál es el principio de subsidiariedad?",
          options: ["Ayuda mutua", "Intervención del nivel superior solo si es necesario", "Jerarquía administrativa", "Descentralización total"],
          correctAnswer: 1,
          explanation: "Implica que la Administración superior solo debe intervenir cuando la inferior no pueda actuar eficazmente."
        },
        {
          id: "t1-q15",
          question: "¿Qué es un conflicto de competencias?",
          options: ["Disputa judicial", "Controversia sobre atribución competencial", "Recurso administrativo", "Procedimiento sancionador"],
          correctAnswer: 1,
          explanation: "Es la controversia entre dos o más Administraciones sobre a quién corresponde una determinada competencia."
        },
        {
          id: "t1-q16",
          question: "¿Quién resuelve los conflictos de competencias entre Estado y CC.AA.?",
          options: ["Tribunal Supremo", "Tribunal Constitucional", "Consejo de Estado", "Comisión mixta"],
          correctAnswer: 1,
          explanation: "Los conflictos de competencias entre Estado y CC.AA. se resuelven por el Tribunal Constitucional."
        },
        {
          id: "t1-q17",
          question: "¿Qué es la técnica de la encomienda de gestión?",
          options: ["Delegación de competencias", "Encargo de actividades materiales", "Transferencia competencial", "Descentralización"],
          correctAnswer: 1,
          explanation: "La encomienda de gestión es el encargo de actividades de carácter material, técnico o de servicios de la competencia propia."
        },
        {
          id: "t1-q18",
          question: "¿Cuál es la diferencia entre delegación y encomienda?",
          options: ["No hay diferencia", "La delegación transfiere competencias, la encomienda solo gestión", "Solo el órgano", "El plazo temporal"],
          correctAnswer: 1,
          explanation: "La delegación transfiere el ejercicio de competencias, mientras que la encomienda solo encarga actividades materiales."
        },
        {
          id: "t1-q19",
          question: "¿Qué es la supletoriedad del Derecho estatal?",
          options: ["Aplicación preferente", "Aplicación cuando no hay norma autonómica", "Aplicación subsidiaria", "No aplicación"],
          correctAnswer: 1,
          explanation: "El Derecho estatal es supletorio cuando no existe regulación autonómica en materias de competencia autonómica."
        },
        {
          id: "t1-q20",
          question: "¿Qué principio garantiza la autonomía de las entidades locales?",
          options: ["Descentralización", "Autonomía local", "Subsidiariedad", "Proporcionalidad"],
          correctAnswer: 1,
          explanation: "El principio de autonomía local garantiza que las entidades locales gestionen sus propios intereses."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Organización Administrativa",
      tests: [
        {
          id: "t2-q1",
          question: "¿Quién dirige la Administración General del Estado?",
          options: ["El Rey", "El Presidente del Gobierno", "El Consejo de Ministros", "El Ministro del Interior"],
          correctAnswer: 1,
          explanation: "El Presidente del Gobierno dirige la Administración General del Estado."
        },
        {
          id: "t2-q2",
          question: "¿Cuál es la estructura básica de un ministerio?",
          options: ["Secretarías de Estado, Subsecretarías y Direcciones Generales", "Solo Direcciones Generales", "Secretarías de Estado y Servicios", "Subsecretarías únicamente"],
          correctAnswer: 0,
          explanation: "Los ministerios se estructuran en Secretarías de Estado, Subsecretarías y Direcciones Generales."
        },
        {
          id: "t2-q3",
          question: "¿Qué son los organismos autónomos?",
          options: ["Entidades privadas", "Entidades de derecho público", "Sociedades mercantiles", "Fundaciones"],
          correctAnswer: 1,
          explanation: "Los organismos autónomos son entidades de derecho público con personalidad jurídica propia."
        },
        {
          id: "t2-q4",
          question: "¿Quién nombra a los Secretarios de Estado?",
          options: ["El Rey", "El Presidente del Gobierno", "El Consejo de Ministros", "El ministro correspondiente"],
          correctAnswer: 2,
          explanation: "Los Secretarios de Estado son nombrados por el Consejo de Ministros."
        },
        {
          id: "t2-q5",
          question: "¿Qué es la desconcentración administrativa?",
          options: ["Transferir competencias a otras Administraciones", "Atribuir competencias a órganos inferiores de la misma Administración", "Crear nuevos organismos", "Suprimir ��rganos administrativos"],
          correctAnswer: 1,
          explanation: "La desconcentración consiste en atribuir competencias a órganos inferiores jerárquicamente dentro de la misma Administración."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Función Pública",
      tests: [
        {
          id: "t3-q1",
          question: "¿Qué ley regula el Estatuto Básico del Empleado Público?",
          options: ["Ley 7/2007", "Ley 39/2015", "Ley 40/2015", "Ley 30/1984"],
          correctAnswer: 0,
          explanation: "La Ley 7/2007 aprueba el Estatuto Básico del Empleado Público."
        },
        {
          id: "t3-q2",
          question: "¿Cuáles son los principios de la función pública?",
          options: ["Igualdad, mérito y capacidad", "Solo mérito", "Mérito y antigüedad", "Capacidad y confianza"],
          correctAnswer: 0,
          explanation: "Los principios constitucionales de acceso a la función pública son igualdad, mérito y capacidad."
        },
        {
          id: "t3-q3",
          question: "¿Qué es un funcionario de carrera?",
          options: ["Un empleado temporal", "Un funcionario con relación estatutaria permanente", "Un contratado laboral", "Un becario"],
          correctAnswer: 1,
          explanation: "Los funcionarios de carrera tienen una relaci��n estatutaria permanente con la Administración."
        },
        {
          id: "t3-q4",
          question: "¿Cuál es la situación administrativa normal de un funcionario?",
          options: ["Servicio activo", "Excedencia", "Suspensión", "Expectativa"],
          correctAnswer: 0,
          explanation: "El servicio activo es la situación administrativa normal del funcionario de carrera."
        },
        {
          id: "t3-q5",
          question: "¿Qué es una falta disciplinaria grave?",
          options: ["Llegar tarde una vez", "Abandono del servicio", "No llevar uniforme", "Usar el teléfono personal"],
          correctAnswer: 1,
          explanation: "El abandono del servicio constituye una falta disciplinaria grave según la normativa."
        },
        {
          id: "t3-q6",
          question: "¿Cuándo se puede jubilizar forzosamente a un funcionario?",
          options: ["A los 60 años", "Al cumplir 65 años", "Nunca", "Solo por incapacidad"],
          correctAnswer: 1,
          explanation: "La jubilación forzosa se produce al cumplir la edad reglamentariamente establecida."
        },
        {
          id: "t3-q7",
          question: "¿Qué es la carrera administrativa?",
          options: ["Solo ascensos", "Progresión dentro del sistema retributivo y de puestos", "Solo antigüedad", "Solo méritos"],
          correctAnswer: 1,
          explanation: "La carrera administrativa es la progresión de los funcionarios dentro del sistema retributivo y de puestos de trabajo."
        },
        {
          id: "t3-q8",
          question: "¿Cuáles son los sistemas de selección de personal?",
          options: ["Solo oposición", "Oposición, concurso-oposición y concurso", "Solo concurso", "Solo entrevista"],
          correctAnswer: 1,
          explanation: "Los sistemas selectivos para el acceso a la función pública son oposición, concurso-oposición y concurso."
        },
        {
          id: "t3-q9",
          question: "¿Qué es la provisión de puestos de trabajo?",
          options: ["Solo concurso", "Asignación de funcionarios a puestos específicos", "Solo designación", "Solo sorteo"],
          correctAnswer: 1,
          explanation: "La provisión es el sistema mediante el cual los funcionarios obtienen destino en los puestos de trabajo."
        },
        {
          id: "t3-q10",
          question: "¿Cuándo procede la excedencia voluntaria?",
          options: ["Solo por enfermedad", "Por interés particular del funcionario", "Solo por familia", "Nunca"],
          correctAnswer: 1,
          explanation: "La excedencia voluntaria procede por interés particular del funcionario, sin derecho a retribución."
        },
        {
          id: "t3-q11",
          question: "¿Qué es la suspensión firme de funciones?",
          options: ["Vacaciones", "Sanción disciplinaria", "Permiso", "Jubilación"],
          correctAnswer: 1,
          explanation: "La suspensión firme es una sanción disciplinaria que impide el ejercicio de las funciones."
        },
        {
          id: "t3-q12",
          question: "¿Cuáles son los grupos de clasificación profesional?",
          options: ["A, B, C, D, E", "A1, A2, B, C1, C2", "I, II, III, IV", "Superior, medio, básico"],
          correctAnswer: 1,
          explanation: "Los grupos son A1, A2 (grupo A), B, C1, C2 (grupo C), según la titulación exigida."
        },
        {
          id: "t3-q13",
          question: "¿Qué es la evaluación del desempeño?",
          options: ["Solo exámenes", "Valoraci��n objetiva del rendimiento", "Solo informes", "Control de asistencia"],
          correctAnswer: 1,
          explanation: "Es el procedimiento mediante el cual se mide y valora la conducta profesional y el rendimiento."
        },
        {
          id: "t3-q14",
          question: "¿Cuándo prescribe una falta disciplinaria leve?",
          options: ["1 mes", "6 meses", "1 año", "2 años"],
          correctAnswer: 1,
          explanation: "Las faltas leves prescriben a los 6 meses desde que la Administración tuvo conocimiento."
        },
        {
          id: "t3-q15",
          question: "¿Qué derechos tienen los representantes sindicales?",
          options: ["Ninguno especial", "Crédito horario, garantías, información", "Solo información", "Solo reunirse"],
          correctAnswer: 1,
          explanation: "Tienen derecho a crédito horario, garantías frente a sanciones e información sobre materias de su competencia."
        },
        {
          id: "t3-q16",
          question: "¿Cuándo se puede declarar la situación de segunda actividad?",
          options: ["Nunca", "Por disminución de facultades", "Solo en policía", "Solo por edad"],
          correctAnswer: 1,
          explanation: "Se declara cuando se produce disminución de las facultades para el desempeño del puesto."
        },
        {
          id: "t3-q17",
          question: "¿Qué es la movilidad del personal funcionario?",
          options: ["Solo traslados", "Cambio de puesto, adscripción, comisión de servicios", "Solo ascensos", "Solo permutas"],
          correctAnswer: 1,
          explanation: "Incluye los cambios de puesto de trabajo mediante diversos procedimientos como concursos, comisiones de servicios, etc."
        },
        {
          id: "t3-q18",
          question: "¿Cuál es la duración máxima de la comisión de servicios?",
          options: ["6 meses", "2 años", "3 años", "5 años"],
          correctAnswer: 1,
          explanation: "La comisión de servicios tiene una duración máxima de dos años, prorrogable por otro año."
        },
        {
          id: "t3-q19",
          question: "¿Qué son las retribuciones complementarias?",
          options: ["Solo trienios", "Complementos específico, destino, productividad", "Solo productividad", "Solo destino"],
          correctAnswer: 1,
          explanation: "Incluyen complemento de destino, específico y productividad, además de otros complementos."
        },
        {
          id: "t3-q20",
          question: "¿Cuándo se pierde la condición de funcionario?",
          options: ["Por jubilación", "Por separación del servicio o pérdida de nacionalidad", "Por excedencia", "Por suspensión"],
          correctAnswer: 1,
          explanation: "Se pierde por renuncia, separación del servicio, pérdida de la nacionalidad española o sanción disciplinaria firme de separación."
        }
      ]
    },
    {
      themeId: "tema-4",
      themeName: "Contratos del Sector Público",
      tests: [
        {
          id: "t4-q1",
          question: "¿Qué ley regula los contratos del sector público?",
          options: ["Ley 9/2017", "Ley 30/2007", "Ley 39/2015", "Ley 40/2015"],
          correctAnswer: 0,
          explanation: "La Ley 9/2017 de Contratos del Sector Público transpone las directivas europeas en materia de contratación pública."
        },
        {
          id: "t4-q2",
          question: "¿Cuáles son los tipos de contratos administrativos?",
          options: ["Solo obras", "Obras, servicios, suministros, concesión", "Solo servicios", "Solo suministros"],
          correctAnswer: 1,
          explanation: "Los contratos administrativos típicos son de obras, servicios, suministros y concesión de obras y servicios."
        },
        {
          id: "t4-q3",
          question: "¿Cuándo es obligatorio el procedimiento abierto?",
          options: ["Siempre", "Por encima de determinados umbrales", "Solo en obras", "Solo en servicios"],
          correctAnswer: 1,
          explanation: "Es obligatorio para contratos que superen los umbrales establecidos en la normativa europea."
        },
        {
          id: "t4-q4",
          question: "¿Qué es el expediente de contratación?",
          options: ["Solo el contrato", "Conjunto de documentos del procedimiento", "Solo pliegos", "Solo ofertas"],
          correctAnswer: 1,
          explanation: "Es el conjunto ordenado de documentos que integran el procedimiento de adjudicación del contrato."
        },
        {
          id: "t4-q5",
          question: "��Cuáles son los órganos de contratación?",
          options: ["Solo ministros", "Órganos con competencia para contratar", "Solo secretarios", "Solo directores"],
          correctAnswer: 1,
          explanation: "Son los órganos administrativos a los que corresponde la competencia para adjudicar los contratos."
        },
        {
          id: "t4-q6",
          question: "¿Qué es la mesa de contratación?",
          options: ["El mobiliario", "Órgano colegiado de asistencia", "Solo para obras", "Tribunal económico"],
          correctAnswer: 1,
          explanation: "Es el órgano colegiado de asistencia al órgano de contratación para la adjudicación de contratos."
        },
        {
          id: "t4-q7",
          question: "¿Cuándo procede el procedimiento negociado?",
          options: ["Siempre", "En casos excepcionales previstos en la ley", "Solo en urgencia", "Solo en obras"],
          correctAnswer: 1,
          explanation: "Procede en los supuestos específicamente previstos en la ley, como casos excepcionales o de urgencia."
        },
        {
          id: "t4-q8",
          question: "¿Qué es la solvencia de los licitadores?",
          options: ["Solo económica", "Aptitud para ejecutar el contrato", "Solo técnica", "Solo experiencia"],
          correctAnswer: 1,
          explanation: "Es la aptitud del empresario para ejecutar la prestación objeto del contrato de forma adecuada."
        },
        {
          id: "t4-q9",
          question: "¿Cuáles son los criterios de adjudicación?",
          options: ["Solo precio", "Mejor relación calidad-precio", "Solo calidad", "Solo plazo"],
          correctAnswer: 1,
          explanation: "Los criterios deben basarse en la mejor relación calidad-precio, considerando aspectos cuantitativos y cualitativos."
        },
        {
          id: "t4-q10",
          question: "¿Qué es la garantía definitiva?",
          options: ["5% del precio", "Garantía del cumplimiento del contrato", "Solo dinero", "10% del precio"],
          correctAnswer: 1,
          explanation: "Es la garantía que debe constituir el adjudicatario para responder del cumplimiento del contrato."
        },
        {
          id: "t4-q11",
          question: "¿Cuándo se perfecciona el contrato administrativo?",
          options: ["Con la oferta", "Con la formalización", "Con la adjudicación", "Con el pago"],
          correctAnswer: 1,
          explanation: "Los contratos administrativos se perfeccionan con su formalización en documento administrativo."
        },
        {
          id: "t4-q12",
          question: "¿Qué son las modificaciones contractuales?",
          options: ["Solo ampliaciones", "Cambios en el objeto del contrato", "Solo reducciones", "Solo prórrogas"],
          correctAnswer: 1,
          explanation: "Son alteraciones en el contenido del contrato que deben estar previstas o justificadas por interés público."
        },
        {
          id: "t4-q13",
          question: "¿Cuándo procede la resolución del contrato?",
          options: ["Solo por incumplimiento", "Por causas previstas en la ley", "Solo por mutuo acuerdo", "Solo por finalización"],
          correctAnswer: 1,
          explanation: "Procede por las causas de resolución establecidas en la ley, como incumplimiento, imposibilidad de ejecución, etc."
        },
        {
          id: "t4-q14",
          question: "¿Qué es el equilibrio económico del contrato?",
          options: ["Solo beneficios", "Mantenimiento de la ecuación económica", "Solo pérdidas", "Precio fijo"],
          correctAnswer: 1,
          explanation: "Es el principio que busca mantener la equivalencia entre prestaciones durante la ejecución del contrato."
        },
        {
          id: "t4-q15",
          question: "¿Cuáles son las prerrogativas de la Administración?",
          options: ["Solo pagar", "Dirección, control, modificación, resolución", "Solo supervisar", "Solo sancionar"],
          correctAnswer: 1,
          explanation: "La Administración tiene prerrogativas de dirección, control, modificación y resolución de los contratos."
        },
        {
          id: "t4-q16",
          question: "¿Qué es la recepción del contrato?",
          options: ["Solo entrega", "Acto de conformidad con la prestación", "Solo pago", "Solo facturación"],
          correctAnswer: 1,
          explanation: "Es el acto por el cual la Administración declara su conformidad con la prestación realizada por el contratista."
        },
        {
          id: "t4-q17",
          question: "¿Cuándo se devuelve la garantía definitiva?",
          options: ["Al firmar", "Tras la recepción y periodo de garantía", "Al empezar", "Solo si hay problemas"],
          correctAnswer: 1,
          explanation: "Se devuelve una vez recibida la prestación y transcurrido el plazo de garantía sin incidencias."
        },
        {
          id: "t4-q18",
          question: "¿Qué son los pliegos de cláusulas administrativas?",
          options: ["Solo precios", "Documento con condiciones jurídicas", "Solo técnicos", "Solo plazos"],
          correctAnswer: 1,
          explanation: "Contienen las cláusulas relativas a los aspectos jurídicos, económicos y administrativos del contrato."
        },
        {
          id: "t4-q19",
          question: "¿Cuál es el plazo de garantía de las obras?",
          options: ["6 meses", "1 año", "2 años", "5 años"],
          correctAnswer: 1,
          explanation: "El plazo de garantía de las obras es de un año a contar desde la recepción."
        },
        {
          id: "t4-q20",
          question: "¿Qué es la revisión de precios en los contratos?",
          options: ["Siempre prohibida", "Actualización por variación de costes", "Solo rebajas", "Solo subidas"],
          correctAnswer: 1,
          explanation: "Es la actualización del precio del contrato por variación de los costes de los factores que lo integran."
        }
      ]
    },
    {
      themeId: "tema-5",
      themeName: "Subvenciones y Ayudas Públicas",
      tests: [
        {
          id: "t5-q1",
          question: "¿Qué ley regula las subvenciones?",
          options: ["Ley 37/2007", "Ley 38/2003", "Ley 39/2015", "Ley 40/2015"],
          correctAnswer: 1,
          explanation: "La Ley 38/2003 General de Subvenciones regula el régimen jurídico de las subvenciones públicas."
        },
        {
          id: "t5-q2",
          question: "¿Qué es una subvención?",
          options: ["Solo ayuda", "Disposición dineraria sin contraprestación directa", "Solo préstamo", "Solo donación"],
          correctAnswer: 1,
          explanation: "Es toda disposición dineraria realizada por cualquier administración pública a favor de personas públicas o privadas, sin contraprestación directa."
        },
        {
          id: "t5-q3",
          question: "¿Cuáles son los principios de las subvenciones?",
          options: ["Solo publicidad", "Publicidad, transparencia, concurrencia, objetividad, eficacia", "Solo concurrencia", "Solo eficacia"],
          correctAnswer: 1,
          explanation: "Los principios son publicidad, transparencia, concurrencia, objetividad, igualdad y no discriminación, eficacia y eficiencia."
        },
        {
          id: "t5-q4",
          question: "¿Qué son las bases reguladoras?",
          options: ["Solo normas", "Normas que establecen criterios de otorgamiento", "Solo convocatoria", "Solo procedimiento"],
          correctAnswer: 1,
          explanation: "Son las normas que en desarrollo de la ley establecen los criterios de otorgamiento de subvenciones."
        },
        {
          id: "t5-q5",
          question: "¿Cuáles son los procedimientos de concesión?",
          options: ["Solo concurrencia", "Concurrencia competitiva y concesión directa", "Solo directa", "Solo restringida"],
          correctAnswer: 1,
          explanation: "Los procedimientos son concurrencia competitiva (comparación de solicitudes) y concesión directa."
        },
        {
          id: "t5-q6",
          question: "¿Cuándo procede la concesión directa?",
          options: ["Siempre", "Casos específicos previstos en la ley", "Nunca", "Solo emergencias"],
          correctAnswer: 1,
          explanation: "Procede en casos específicos como subvenciones previstas nominativamente en presupuestos o razones de interés público, social, económico o humanitario."
        },
        {
          id: "t5-q7",
          question: "¿Cuáles son las obligaciones de los beneficiarios?",
          options: ["Solo justificar", "Realizar actividad, justificar, someterse a control", "Solo devolver", "Solo informar"],
          correctAnswer: 1,
          explanation: "Deben realizar la actividad subvencionada, justificar el cumplimiento, someterse a control y reintegrar si procede."
        },
        {
          id: "t5-q8",
          question: "¿Qué es la justificación de subvenciones?",
          options: ["Solo explicar", "Acreditar realización de actividad y cumplimiento de finalidad", "Solo documentar", "Solo informar"],
          correctAnswer: 1,
          explanation: "Es la acreditación por el beneficiario ante el órgano concedente de la realización de la actividad y cumplimiento de la finalidad."
        },
        {
          id: "t5-q9",
          question: "¿Cuándo procede el reintegro de subvenciones?",
          options: ["Nunca", "Incumplimiento, obtención sin requisitos, resistencia al control", "Siempre", "Solo si sobra dinero"],
          correctAnswer: 1,
          explanation: "Procede por incumplimiento de la finalidad, obtención sin requisitos, incumplimiento de obligaciones, resistencia al control."
        },
        {
          id: "t5-q10",
          question: "¿Qué intereses se aplican en el reintegro?",
          options: ["Ninguno", "Interés de demora desde el pago", "Solo bancario", "Solo legal"],
          correctAnswer: 1,
          explanation: "Se aplicará el interés de demora desde el momento del pago de la subvención hasta la fecha de reintegro."
        },
        {
          id: "t5-q11",
          question: "¿Qué es la Base de Datos Nacional de Subvenciones?",
          options: ["Solo registro", "Sistema de información de subvenciones públicas", "Solo control", "Solo estadística"],
          correctAnswer: 1,
          explanation: "Es el sistema integrado de información que garantiza la publicidad de las subvenciones y permite el control."
        },
        {
          id: "t5-q12",
          question: "¿Cuáles son las prohibiciones para obtener subvenciones?",
          options: ["Ninguna", "Sanciones firmes, deudas, no cumplir obligaciones tributarias", "Solo sanciones", "Solo deudas"],
          correctAnswer: 1,
          explanation: "Incluyen tener sanciones firmes, deudas con la Hacienda Pública, no estar al corriente de obligaciones tributarias y de Seguridad Social."
        },
        {
          id: "t5-q13",
          question: "¿Qué es el control financiero de subvenciones?",
          options: ["Solo contable", "Verificación del destino y aplicación de fondos", "Solo formal", "Solo documental"],
          correctAnswer: 1,
          explanation: "Es la verificación del destino y aplicación de los fondos públicos y el cumplimiento de las obligaciones."
        },
        {
          id: "t5-q14",
          question: "¿Quién ejerce el control financiero?",
          options: ["Solo IGAE", "IGAE y órganos de control de cada administración", "Solo Tribunal Cuentas", "Solo auditorías"],
          correctAnswer: 1,
          explanation: "Lo ejercen la IGAE y los órganos que tengan atribuido el control financiero en cada administración."
        },
        {
          id: "t5-q15",
          question: "¿Cuáles son las infracciones en materia de subvenciones?",
          options: ["Solo graves", "Leves, graves y muy graves", "Solo muy graves", "Solo leves"],
          correctAnswer: 1,
          explanation: "Las infracciones se clasifican en leves, graves y muy graves según su entidad y circunstancias."
        },
        {
          id: "t5-q16",
          question: "¿Cuáles son las sanciones por infracciones?",
          options: ["Solo multas", "Multa y prohibición obtener subvenciones", "Solo prohibición", "Solo apercibimiento"],
          correctAnswer: 1,
          explanation: "Las sanciones incluyen multa pecuniaria y prohibición para obtener subvenciones durante un tiempo determinado."
        },
        {
          id: "t5-q17",
          question: "¿Cuándo prescribe el reintegro?",
          options: ["2 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "El derecho a exigir el reintegro prescribe a los 4 años a partir del momento en que se produjo el incumplimiento."
        },
        {
          id: "t5-q18",
          question: "¿Qué es el Plan Estratégico de Subvenciones?",
          options: ["Solo documento", "Instrumento de planificación de política de subvenciones", "Solo presupuesto", "Solo control"],
          correctAnswer: 1,
          explanation: "Es un instrumento de planificación que determina los objetivos y efectos que se pretenden con la política de subvenciones."
        },
        {
          id: "t5-q19",
          question: "¿Qué son los convenios de colaboración con entidades colaboradoras?",
          options: ["Solo acuerdos", "Acuerdos para que entidades cooperen en gestión", "Solo contratos", "Solo subcontratos"],
          correctAnswer: 1,
          explanation: "Son acuerdos suscritos entre el órgano administrativo y entidades colaboradoras para que éstas cooperen en la gestión."
        },
        {
          id: "t5-q20",
          question: "¿Cuáles son las garantías en el procedimiento de reintegro?",
          options: ["Ninguna", "Audiencia al interesado, motivación, recursos", "Solo audiencia", "Solo recursos"],
          correctAnswer: 1,
          explanation: "El procedimiento debe garantizar audiencia al interesado, motivación de la resolución y posibilidad de interponer recursos."
        }
      ]
    },
    {
      themeId: "tema-6",
      themeName: "Hacienda Pública y Sistema Fiscal",
      tests: [
        {
          id: "t6-q1",
          question: "¿Cuáles son las funciones de la Hacienda Pública?",
          options: ["Solo recaudar", "Asignación, distribución, estabilización", "Solo gastar", "Solo controlar"],
          correctAnswer: 1,
          explanation: "Las funciones básicas son asignación de recursos, distribución de la renta y estabilización económica."
        },
        {
          id: "t6-q2",
          question: "¿Qué principios rigen el sistema tributario español?",
          options: ["Solo justicia", "Justicia, generalidad, igualdad, progresividad", "Solo igualdad", "Solo progresividad"],
          correctAnswer: 1,
          explanation: "El artículo 31 CE establece los principios de justicia, generalidad, igualdad, progresividad y no confiscatoriedad."
        },
        {
          id: "t6-q3",
          question: "¿Cuáles son los principales tributos del Estado?",
          options: ["Solo IRPF", "IRPF, Sociedades, IVA, Especiales", "Solo IVA", "Solo Sociedades"],
          correctAnswer: 1,
          explanation: "Los principales son IRPF, Impuesto sobre Sociedades, IVA e Impuestos Especiales."
        },
        {
          id: "t6-q4",
          question: "¿Qué es el IRPF?",
          options: ["Solo trabajo", "Impuesto sobre la renta de personas físicas", "Solo capital", "Solo empresas"],
          correctAnswer: 1,
          explanation: "Es un impuesto directo y progresivo que grava la renta obtenida por las personas físicas."
        },
        {
          id: "t6-q5",
          question: "¿Qué grava el Impuesto sobre Sociedades?",
          options: ["Solo beneficios", "Renta de las personas jurídicas", "Solo ventas", "Solo patrimonio"],
          correctAnswer: 1,
          explanation: "Grava la renta de las personas jurídicas y entidades sin personalidad jurídica."
        },
        {
          id: "t6-q6",
          question: "¿Qué es el IVA?",
          options: ["Impuesto directo", "Impuesto indirecto sobre el consumo", "Solo servicios", "Solo productos"],
          correctAnswer: 1,
          explanation: "Es un impuesto indirecto que grava el consumo de bienes y servicios."
        },
        {
          id: "t6-q7",
          question: "¿Cuáles son los tipos de IVA en España?",
          options: ["Solo uno", "Superreducido 4%, reducido 10%, general 21%", "Solo 21%", "5%, 15%, 25%"],
          correctAnswer: 1,
          explanation: "Los tipos son superreducido (4%), reducido (10%) y general (21%)."
        },
        {
          id: "t6-q8",
          question: "¿Qué son los Impuestos Especiales?",
          options: ["Solo alcohol", "Impuestos sobre consumos específicos", "Solo tabaco", "Solo combustibles"],
          correctAnswer: 1,
          explanation: "Son impuestos que gravan consumos específicos como alcohol, tabaco, hidrocarburos y electricidad."
        },
        {
          id: "t6-q9",
          question: "¿Qué organismos gestionan los tributos?",
          options: ["Solo AEAT", "AEAT, IGAE, Catastro", "Solo Hacienda", "Solo Catastro"],
          correctAnswer: 1,
          explanation: "Principalmente la AEAT, con apoyo de la IGAE, Catastro y otros órganos especializados."
        },
        {
          id: "t6-q10",
          question: "¿Qué es la capacidad económica?",
          options: ["Solo ingresos", "Aptitud para contribuir a las cargas públicas", "Solo patrimonio", "Solo gastos"],
          correctAnswer: 1,
          explanation: "Es la aptitud o idoneidad para contribuir al sostenimiento de las cargas públicas."
        },
        {
          id: "t6-q11",
          question: "¿Cuáles son los elementos del tributo?",
          options: ["Solo sujeto", "Hecho imponible, sujeto, base, tipo, cuota", "Solo base", "Solo cuota"],
          correctAnswer: 1,
          explanation: "Los elementos esenciales son hecho imponible, sujeto pasivo, base imponible, tipo de gravamen y cuota tributaria."
        },
        {
          id: "t6-q12",
          question: "¿Qué diferencia hay entre impuesto, tasa y contribución especial?",
          options: ["Ninguna", "Impuesto sin contraprestación, tasa por servicio, contribución por beneficio", "Solo el nombre", "Solo la cuantía"],
          correctAnswer: 1,
          explanation: "El impuesto no tiene contraprestación, la tasa se paga por un servicio, la contribución especial por un beneficio o aumento de valor."
        },
        {
          id: "t6-q13",
          question: "¿Cuándo prescriben las obligaciones tributarias?",
          options: ["3 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "Las obligaciones tributarias prescriben a los 4 años."
        },
        {
          id: "t6-q14",
          question: "¿Qué son los tributos cedidos?",
          options: ["Solo estatales", "Tributos estatales gestionados por CC.AA.", "Solo autonómicos", "Solo locales"],
          correctAnswer: 1,
          explanation: "Son tributos del Estado cuya gestión se ha cedido a las Comunidades Autónomas."
        },
        {
          id: "t6-q15",
          question: "¿Cuáles son los tributos locales principales?",
          options: ["Solo IBI", "IBI, IAE, IVTM, Plusvalías", "Solo IAE", "Solo IVTM"],
          correctAnswer: 1,
          explanation: "Los principales son Impuesto sobre Bienes Inmuebles (IBI), Actividades Económicas (IAE), Vehículos (IVTM) y Plusvalías."
        },
        {
          id: "t6-q16",
          question: "¿Qué es la financiación autonómica?",
          options: ["Solo transferencias", "Sistema de recursos para CC.AA.", "Solo impuestos", "Solo deuda"],
          correctAnswer: 1,
          explanation: "Es el conjunto de recursos financieros que permite a las CC.AA. financiar sus competencias."
        },
        {
          id: "t6-q17",
          question: "¿Qué es el principio de reserva de ley en materia tributaria?",
          options: ["Solo reglamentos", "Elementos esenciales del tributo deben regularse por ley", "Solo decretos", "Solo órdenes"],
          correctAnswer: 1,
          explanation: "Los elementos esenciales de los tributos deben ser establecidos por ley."
        },
        {
          id: "t6-q18",
          question: "¿Qué es la progresividad fiscal?",
          options: ["Tipo fijo", "Tipo de gravamen que aumenta con la base", "Tipo reducido", "Tipo variable"],
          correctAnswer: 1,
          explanation: "Es el principio por el cual el tipo de gravamen aumenta a medida que aumenta la base imponible."
        },
        {
          id: "t6-q19",
          question: "¿Qué son las deducciones fiscales?",
          options: ["Solo gastos", "Cantidades que se restan de la cuota", "Solo inversiones", "Solo donaciones"],
          correctAnswer: 1,
          explanation: "Son cantidades que, por diversos conceptos, se pueden restar de la cuota íntegra para obtener la cuota líquida."
        },
        {
          id: "t6-q20",
          question: "¿Qué es la economía sumergida en términos fiscales?",
          options: ["Solo evasión", "Actividades no declaradas que eluden la tributación", "Solo fraude", "Solo contrabando"],
          correctAnswer: 1,
          explanation: "Es el conjunto de actividades económicas que se desarrollan al margen del control fiscal y no se declaran."
        }
      ]
    },
    {
      themeId: "tema-7",
      themeName: "Derecho Constitucional",
      tests: [
        {
          id: "t7-q1",
          question: "¿Cuál es la forma política del Estado español?",
          options: ["República", "Monarquía parlamentaria", "Monarquía absoluta", "Estado federal"],
          correctAnswer: 1,
          explanation: "España se constituye en un Estado social y democrático de Derecho, que propugna como forma política la Monarquía parlamentaria."
        },
        {
          id: "t7-q2",
          question: "¿Qué artículo de la Constitución trata de los derechos fundamentales?",
          options: ["Título I", "Título II", "Título III", "Título IV"],
          correctAnswer: 0,
          explanation: "El Título I de la Constitución se refiere a los derechos y deberes fundamentales (artículos 10-55)."
        },
        {
          id: "t7-q3",
          question: "¿Cuántos senadores se eligen por cada provincia?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "Por cada provincia se eligen cuatro senadores por sufragio universal, libre, igual, directo y secreto."
        },
        {
          id: "t7-q4",
          question: "¿Qué mayoría se requiere para aprobar una ley orgánica?",
          options: ["Mayoría simple", "Mayoría absoluta", "Dos tercios", "Tres quintos"],
          correctAnswer: 1,
          explanation: "Las leyes orgánicas requerirán mayoría absoluta del Congreso en una votación final sobre el conjunto del proyecto."
        },
        {
          id: "t7-q5",
          question: "¿Cuál es el procedimiento ordinario de reforma constitucional?",
          options: ["Mayoría simple", "Mayoría de tres quintos", "Dos tercios", "Unanimidad"],
          correctAnswer: 1,
          explanation: "La reforma requerirá la aprobación por mayoría de tres quintos de cada una de las Cámaras."
        },
        {
          id: "t7-q6",
          question: "¿Quién nombra al Presidente del Gobierno?",
          options: ["El Congreso", "El Rey", "El Senado", "Las Cortes Generales"],
          correctAnswer: 1,
          explanation: "El Rey propone un candidato a Presidente del Gobierno y lo nombra si obtiene la confianza del Congreso."
        },
        {
          id: "t7-q7",
          question: "¿Cuántos miembros tiene el Tribunal Constitucional?",
          options: ["10", "12", "14", "16"],
          correctAnswer: 1,
          explanation: "El Tribunal Constitucional se compone de 12 miembros nombrados por el Rey."
        },
        {
          id: "t7-q8",
          question: "¿Cuál es el mandato de los magistrados del Tribunal Constitucional?",
          options: ["6 años", "8 años", "9 años", "12 años"],
          correctAnswer: 2,
          explanation: "Los magistrados del Tribunal Constitucional tienen un mandato de nueve años."
        },
        {
          id: "t7-q9",
          question: "¿Qué institución ejerce el control previo de constitucionalidad?",
          options: ["Tribunal Supremo", "Consejo de Estado", "Tribunal Constitucional", "Consejo General del Poder Judicial"],
          correctAnswer: 1,
          explanation: "El Consejo de Estado ejerce funciones consultivas y puede dictaminar sobre la constitucionalidad de proyectos normativos."
        },
        {
          id: "t7-q10",
          question: "¿Cuándo puede el Rey disolver las Cortes?",
          options: ["Libremente", "A propuesta del Presidente del Gobierno", "Nunca", "En estado de excepción"],
          correctAnswer: 1,
          explanation: "El Rey puede disolver las Cortes Generales a propuesta del Presidente del Gobierno."
        },
        {
          id: "t7-q11",
          question: "¿Qué es una cuestión de confianza?",
          options: ["Voto del Congreso al Gobierno", "Iniciativa del Gobierno para obtener apoyo parlamentario", "Moción de censura", "Interpelación parlamentaria"],
          correctAnswer: 1,
          explanation: "La cuestión de confianza es una iniciativa del Presidente del Gobierno para obtener el apoyo expreso del Congreso."
        },
        {
          id: "t7-q12",
          question: "¿Quién puede plantear una moción de censura?",
          options: ["El Gobierno", "Una décima parte de los diputados", "El Senado", "Los grupos parlamentarios"],
          correctAnswer: 1,
          explanation: "La moción de censura debe ser propuesta por una décima parte de los diputados."
        },
        {
          id: "t7-q13",
          question: "¿Cuál es la duración máxima del estado de alarma?",
          options: ["15 días", "30 días", "45 días", "60 días"],
          correctAnswer: 0,
          explanation: "El estado de alarma no podrá exceder de quince días, prorrogable con autorización del Congreso."
        },
        {
          id: "t7-q14",
          question: "¿Quién puede declarar el estado de sitio?",
          options: ["El Rey", "El Gobierno", "El Congreso", "Las Cortes Generales"],
          correctAnswer: 2,
          explanation: "El estado de sitio será declarado por el Congreso de los Diputados por mayoría absoluta."
        },
        {
          id: "t7-q15",
          question: "¿Cuál es el límite de edad para ser Presidente del Gobierno?",
          options: ["No hay límite", "65 años", "70 años", "75 años"],
          correctAnswer: 0,
          explanation: "La Constitución no establece límite de edad superior para ser Presidente del Gobierno."
        },
        {
          id: "t7-q16",
          question: "¿Qué mayoría requiere la moción de censura?",
          options: ["Mayoría simple", "Mayoría absoluta", "Dos tercios", "Tres quintos"],
          correctAnswer: 1,
          explanation: "La moción de censura debe ser aprobada por mayoría absoluta del Congreso de los Diputados."
        },
        {
          id: "t7-q17",
          question: "¿Cuándo entró en vigor la Constitución Española?",
          options: ["6 de diciembre de 1978", "29 de diciembre de 1978", "1 de enero de 1979", "27 de diciembre de 1978"],
          correctAnswer: 1,
          explanation: "La Constitución entró en vigor el 29 de diciembre de 1978, día de su publicación en el BOE."
        },
        {
          id: "t7-q18",
          question: "¿Cuál es el número mínimo de diputados por provincia?",
          options: ["1", "2", "3", "4"],
          correctAnswer: 0,
          explanation: "Cada provincia tendrá una representación mínima inicial que la ley determinará (actualmente es 1)."
        },
        {
          id: "t7-q19",
          question: "¿Qué órgano ostenta la representación del Estado?",
          options: ["El Gobierno", "Las Cortes Generales", "El Rey", "El Presidente del Gobierno"],
          correctAnswer: 2,
          explanation: "El Rey es el Jefe del Estado, símbolo de su unidad y permanencia, arbitra y modera el funcionamiento regular de las instituciones."
        },
        {
          id: "t7-q20",
          question: "¿Cuál es la duración de la legislatura?",
          options: ["3 años", "4 años", "5 a��os", "6 años"],
          correctAnswer: 1,
          explanation: "Las Cortes Generales son elegidas por cuatro años, aunque pueden disolverse anticipadamente."
        }
      ]
    },
    {
      themeId: "tema-8",
      themeName: "Unión Europea",
      tests: [
        {
          id: "t8-q1",
          question: "¿Cuándo se firmó el Tratado de Roma?",
          options: ["1955", "1957", "1958", "1960"],
          correctAnswer: 1,
          explanation: "El Tratado de Roma se firmó el 25 de marzo de 1957, creando la Comunidad Económica Europea."
        },
        {
          id: "t8-q2",
          question: "¿Cuáles son las instituciones principales de la UE?",
          options: ["Solo Consejo y Comisión", "Consejo, Comisión, Parlamento, Tribunal", "Solo Parlamento", "Consejo y Parlamento"],
          correctAnswer: 1,
          explanation: "Las principales instituciones son el Consejo Europeo, el Consejo, la Comisión, el Parlamento y el Tribunal de Justicia."
        },
        {
          id: "t8-q3",
          question: "¿Cuántos comisarios tiene la Comisión Europea?",
          options: ["25", "27", "28", "30"],
          correctAnswer: 1,
          explanation: "La Comisión Europea está compuesta por 27 comisarios, uno por cada Estado miembro."
        },
        {
          id: "t8-q4",
          question: "¿Quién preside el Consejo Europeo?",
          options: ["Presidente de la Comisión", "Presidente elegido", "Primer Ministro del país que ejerce la presidencia", "Canciller alemán"],
          correctAnswer: 1,
          explanation: "El Consejo Europeo tiene un Presidente permanente elegido por mayoría cualificada por un período de dos años y medio."
        },
        {
          id: "t8-q5",
          question: "¿Cuántos eurodiputados españoles hay en el Parlamento Europeo?",
          options: ["54", "59", "64", "69"],
          correctAnswer: 1,
          explanation: "España tiene 59 eurodiputados en el Parlamento Europeo tras el Brexit."
        },
        {
          id: "t8-q6",
          question: "¿Qué es el procedimiento legislativo ordinario?",
          options: ["Solo el Consejo decide", "Codecisión entre Parlamento y Consejo", "Solo el Parlamento decide", "Solo la Comisión"],
          correctAnswer: 1,
          explanation: "Es el procedimiento de codecisión entre el Parlamento Europeo y el Consejo, siendo el más utilizado."
        },
        {
          id: "t8-q7",
          question: "¿Cuándo entró España en la CEE?",
          options: ["1984", "1985", "1986", "1987"],
          correctAnswer: 2,
          explanation: "España ingresó en la Comunidad Económica Europea el 1 de enero de 1986."
        },
        {
          id: "t8-q8",
          question: "¿Qué es el Tribunal de Cuentas Europeo?",
          options: ["Tribunal de justicia", "Órgano de control financiero", "Banco central", "Institución monetaria"],
          correctAnswer: 1,
          explanation: "El Tribunal de Cuentas Europeo es la institución de auditoría externa de la UE."
        },
        {
          id: "t8-q9",
          question: "¿Cuál es la duración del mandato de los eurodiputados?",
          options: ["4 años", "5 años", "6 años", "7 años"],
          correctAnswer: 1,
          explanation: "Los eurodiputados son elegidos por un período de cinco años."
        },
        {
          id: "t8-q10",
          question: "¿Qué principio rige la relación entre Derecho europeo y nacional?",
          options: ["Subsidiariedad", "Primacía", "Proporcionalidad", "Cooperación"],
          correctAnswer: 1,
          explanation: "El principio de primacía establece que el Derecho europeo prevalece sobre el nacional."
        },
        {
          id: "t8-q11",
          question: "¿Cuándo entró en vigor el Tratado de Lisboa?",
          options: ["2007", "2008", "2009", "2010"],
          correctAnswer: 2,
          explanation: "El Tratado de Lisboa entró en vigor el 1 de diciembre de 2009."
        },
        {
          id: "t8-q12",
          question: "¿Qué es el Consejo de la Unión Europea?",
          options: ["Órgano ejecutivo", "Institución legislativa que representa a los Estados", "Tribunal", "Banco"],
          correctAnswer: 1,
          explanation: "El Consejo es la institución que representa a los gobiernos de los países de la UE en el proceso legislativo."
        },
        {
          id: "t8-q13",
          question: "¿Cuáles son las libertades fundamentales del mercado interior?",
          options: ["Solo libre circulación de personas", "Libre circulación de personas, mercancías, servicios y capitales", "Solo mercancías", "Solo servicios"],
          correctAnswer: 1,
          explanation: "Las cuatro libertades fundamentales son la libre circulación de personas, mercancías, servicios y capitales."
        },
        {
          id: "t8-q14",
          question: "¿Qué competencias tiene la UE en política exterior?",
          options: ["Competencia exclusiva", "Competencia compartida", "Competencia de apoyo", "No tiene competencias"],
          correctAnswer: 1,
          explanation: "La UE tiene competencia compartida con los Estados miembros en política exterior y de seguridad común."
        },
        {
          id: "t8-q15",
          question: "¿Cuándo se adoptó el euro como moneda única?",
          options: ["1998", "1999", "2000", "2001"],
          correctAnswer: 1,
          explanation: "El euro se adoptó como moneda única el 1 de enero de 1999, aunque las monedas y billetes circularon desde 2002."
        },
        {
          id: "t8-q16",
          question: "¿Qué es el Espacio Schengen?",
          options: ["Zona monetaria", "Área de libre circulación sin controles fronterizos", "Región económica", "Zona de libre comercio"],
          correctAnswer: 1,
          explanation: "El Espacio Schengen es un área de libre circulación donde se han suprimido los controles fronterizos internos."
        },
        {
          id: "t8-q17",
          question: "¿Cuál es el presupuesto máximo de la UE?",
          options: ["1% del PIB", "1,2% del PIB", "1,5% del PIB", "2% del PIB"],
          correctAnswer: 1,
          explanation: "El presupuesto de la UE no puede superar el 1,20% de la renta nacional bruta de la UE."
        },
        {
          id: "t8-q18",
          question: "¿Qué es el procedimiento del art��culo 7?",
          options: ["Procedimiento presupuestario", "Procedimiento sancionador por violación de valores", "Procedimiento legislativo", "Procedimiento judicial"],
          correctAnswer: 1,
          explanation: "El artículo 7 del TUE establece el procedimiento para casos de violación grave de los valores de la UE."
        },
        {
          id: "t8-q19",
          question: "¿Cuántos Estados miembros tiene actualmente la UE?",
          options: ["25", "26", "27", "28"],
          correctAnswer: 2,
          explanation: "Tras la salida del Reino Unido, la UE tiene 27 Estados miembros."
        },
        {
          id: "t8-q20",
          question: "¿Qué es la iniciativa ciudadana europea?",
          options: ["Derecho de voto", "Instrumento de participación directa", "Petición al Parlamento", "Consulta nacional"],
          correctAnswer: 1,
          explanation: "Es un instrumento que permite a los ciudadanos invitar a la Comisión a presentar propuestas legislativas."
        }
      ]
    },
    {
      themeId: "tema-9",
      themeName: "Organización Territorial del Estado",
      tests: [
        {
          id: "t9-q1",
          question: "¿Cuántas comunidades autónomas hay en España?",
          options: ["15", "17", "19", "21"],
          correctAnswer: 1,
          explanation: "España se organiza territorialmente en 17 comunidades autónomas y 2 ciudades autónomas."
        },
        {
          id: "t9-q2",
          question: "¿Qué artículo regula el derecho a la autonomía?",
          options: ["Artículo 2", "Artículo 137", "Artículo 143", "Artículo 151"],
          correctAnswer: 0,
          explanation: "El artículo 2 de la Constitución reconoce y garantiza el derecho a la autonomía de las nacionalidades y regiones."
        },
        {
          id: "t9-q3",
          question: "¿Cuáles son las vías de acceso a la autonomía?",
          options: ["Solo artículo 143", "Artículo 143 y 151", "Solo artículo 151", "Artículo 143, 151 y disposición transitoria"],
          correctAnswer: 3,
          explanation: "Las vías son el artículo 143 (vía lenta), artículo 151 (vía rápida) y disposiciones transitorias."
        },
        {
          id: "t9-q4",
          question: "¿Qué principio rige las relaciones entre el Estado y las CCAA?",
          options: ["Jerarquía", "Competencia", "Coordinación", "Subordinación"],
          correctAnswer: 1,
          explanation: "Las relaciones se rigen por el principio de competencia, no de jerarquía."
        },
        {
          id: "t9-q5",
          question: "¿Quién nombra al Presidente de una comunidad autónoma?",
          options: ["El Rey", "El Presidente del Gobierno", "La Asamblea legislativa", "Los ciudadanos"],
          correctAnswer: 0,
          explanation: "El Rey nombra al Presidente de la comunidad autónoma a propuesta de la Asamblea legislativa."
        },
        {
          id: "t9-q6",
          question: "¿Cuál es la institución de gobierno de la provincia?",
          options: ["Diputación Provincial", "Consejo Provincial", "Junta Provincial", "Gobierno Provincial"],
          correctAnswer: 0,
          explanation: "La Diputación Provincial es el órgano de gobierno y administración de la provincia."
        },
        {
          id: "t9-q7",
          question: "¿Cuántas provincias tiene España?",
          options: ["48", "50", "52", "54"],
          correctAnswer: 1,
          explanation: "España tiene 50 provincias más las ciudades autónomas de Ceuta y Melilla."
        },
        {
          id: "t9-q8",
          question: "¿Qué mayoría se requiere para aprobar un Estatuto de Autonomía?",
          options: ["Mayoría simple", "Mayoría absoluta", "Dos tercios", "Tres quintos"],
          correctAnswer: 1,
          explanation: "Los Estatutos de Autonomía deben ser aprobados por mayoría absoluta del Congreso y del Senado."
        },
        {
          id: "t9-q9",
          question: "¿Cuál es el órgano superior de la administración autonómica?",
          options: ["Presidente", "Consejo de Gobierno", "Parlamento", "Tribunal Superior"],
          correctAnswer: 1,
          explanation: "El Consejo de Gobierno es el órgano colegiado que dirige la política autonómica."
        },
        {
          id: "t9-q10",
          question: "¿Qué competencias son exclusivas del Estado?",
          options: ["Educación", "Defensa, relaciones internacionales", "Sanidad", "Cultura"],
          correctAnswer: 1,
          explanation: "Son competencias exclusivas del Estado la defensa, relaciones internacionales, sistema monetario, entre otras."
        },
        {
          id: "t9-q11",
          question: "¿Cuándo puede el Estado adoptar medidas para obligar al cumplimiento a una CCAA?",
          options: ["Libremente", "En caso de incumplimiento de obligaciones", "Nunca", "Solo en guerra"],
          correctAnswer: 1,
          explanation: "El artículo 155 permite al Estado adoptar medidas necesarias para obligar al cumplimiento de las obligaciones."
        },
        {
          id: "t9-q12",
          question: "¿Qué órgano resuelve los conflictos de competencias?",
          options: ["Tribunal Supremo", "Tribunal Constitucional", "Senado", "Consejo de Estado"],
          correctAnswer: 1,
          explanation: "El Tribunal Constitucional es competente para resolver los conflictos de competencias entre el Estado y las CCAA."
        },
        {
          id: "t9-q13",
          question: "¿Cuál es el principio de financiación autonómica?",
          options: ["Solidaridad", "Autonomía financiera y solidaridad", "Centralización", "Libre mercado"],
          correctAnswer: 1,
          explanation: "La financiación se basa en los principios de autonomía financiera y solidaridad entre territorios."
        },
        {
          id: "t9-q14",
          question: "¿Qué son las competencias compartidas?",
          options: ["Del Estado", "El Estado dicta principios, CCAA desarrollan", "De las CCAA", "No existen"],
          correctAnswer: 1,
          explanation: "En competencias compartidas, el Estado establece la legislación básica y las CCAA la desarrollan."
        },
        {
          id: "t9-q15",
          question: "¿Cuál es la representación territorial en el Senado?",
          options: ["No existe", "4 senadores por provincia", "Proporcional a población", "Igual para todos"],
          correctAnswer: 1,
          explanation: "Cada provincia elige 4 senadores, más los designados por las CCAA."
        },
        {
          id: "t9-q16",
          question: "¿Qué es la coordinación entre administraciones?",
          options: ["Jerarquía", "Colaboración en el ejercicio de competencias", "Subordinación", "Competencia"],
          correctAnswer: 1,
          explanation: "La coordinación implica colaboración y cooperación en el ejercicio de las respectivas competencias."
        },
        {
          id: "t9-q17",
          question: "¿Cuándo puede disolverse una Asamblea autonómica?",
          options: ["Por el Gobierno central", "Por decisión propia o moción de censura", "Nunca", "Solo por el Rey"],
          correctAnswer: 1,
          explanation: "Puede disolverse por decisión del Presidente autonómico o por moción de censura exitosa."
        },
        {
          id: "t9-q18",
          question: "¿Qué principio territorial consagra la Constitución?",
          options: ["Federalismo", "Estado autonómico", "Centralización", "Confederación"],
          correctAnswer: 1,
          explanation: "La Constitución establece un modelo de Estado autonómico único, ni federal ni centralista."
        },
        {
          id: "t9-q19",
          question: "¿Cuál es el plazo para impugnar disposiciones autonómicas?",
          options: ["1 mes", "2 meses", "3 meses", "6 meses"],
          correctAnswer: 1,
          explanation: "El Gobierno puede impugnar las disposiciones autonómicas en el plazo de dos meses."
        },
        {
          id: "t9-q20",
          question: "¿Qué institución representa al Estado en el territorio autonómico?",
          options: ["Delegado del Gobierno", "Presidente autonómico", "Prefecto", "Gobernador"],
          correctAnswer: 0,
          explanation: "El Delegado del Gobierno representa a la Administración General del Estado en el territorio autonómico."
        }
      ]
    },
    {
      themeId: "tema-10",
      themeName: "Función Pública",
      tests: [
        {
          id: "t10-q1",
          question: "¿Qué ley regula el Estatuto Básico del Empleado Público?",
          options: ["Ley 7/2007", "Ley 30/1984", "Ley 53/1984", "Ley 6/1997"],
          correctAnswer: 0,
          explanation: "La Ley 7/2007, de 12 de abril, del Estatuto Básico del Empleado Público regula la función pública."
        },
        {
          id: "t10-q2",
          question: "¿Cuáles son los principios de actuación de los empleados públicos?",
          options: ["Solo eficiencia", "Objetividad, integridad, neutralidad, responsabilidad", "Solo jerarquía", "Solo obediencia"],
          correctAnswer: 1,
          explanation: "Los principios incluyen objetividad, integridad, neutralidad, responsabilidad, imparcialidad, confidencialidad y dedicación al servicio público."
        },
        {
          id: "t10-q3",
          question: "¿Qué son los funcionarios de carrera?",
          options: ["Empleados temporales", "Personal vinculado por relación estatutaria permanente", "Solo altos cargos", "Personal laboral"],
          correctAnswer: 1,
          explanation: "Los funcionarios de carrera están vinculados por una relación estatutaria regulada por el Derecho Administrativo."
        },
        {
          id: "t10-q4",
          question: "¿Cuáles son los grupos de clasificación profesional?",
          options: ["A, B, C", "A1, A2, B, C1, C2", "I, II, III, IV", "Superior, Medio, Auxiliar"],
          correctAnswer: 1,
          explanation: "Los grupos son A1 (Grado universitario), A2 (Diplomado), B (Bachiller/FP), C1 (ESO), C2 (Certificado escolaridad)."
        },
        {
          id: "t10-q5",
          question: "¿Qué principio rige el acceso al empleo público?",
          options: ["Discrecionalidad", "Mérito, capacidad e igualdad", "Antigüedad", "Recomendación"],
          correctAnswer: 1,
          explanation: "El acceso se rige por los principios de igualdad, mérito, capacidad y publicidad."
        },
        {
          id: "t10-q6",
          question: "¿Cuáles son los sistemas selectivos?",
          options: ["Solo oposición", "Oposición, concurso, concurso-oposición", "Solo concurso", "Solo entrevista"],
          correctAnswer: 1,
          explanation: "Los sistemas selectivos son oposición, concurso y concurso-oposición."
        },
        {
          id: "t10-q7",
          question: "¿Qué es la promoción interna?",
          options: ["Cambio de destino", "Ascenso a grupo superior", "Solo horizontal", "Cambio de horario"],
          correctAnswer: 1,
          explanation: "La promoción interna es el ascenso desde un cuerpo o escala a otro de grupo superior."
        },
        {
          id: "t10-q8",
          question: "¿Cuándo se adquiere la condición de funcionario?",
          options: ["Al aprobar", "Al superar el período de prueba", "Al tomar posesión", "Al jurar el cargo"],
          correctAnswer: 1,
          explanation: "La condición de funcionario se adquiere por el cumplimiento sucesivo de los requisitos y la superación del período de prueba."
        },
        {
          id: "t10-q9",
          question: "¿Cuáles son las situaciones administrativas de los funcionarios?",
          options: ["Solo activo", "Servicio activo, servicios especiales, excedencia, suspensión", "Solo excedencia", "Activo y jubilado"],
          correctAnswer: 1,
          explanation: "Las situaciones son servicio activo, servicios especiales, excedencia voluntaria, excedencia forzosa y suspensión."
        },
        {
          id: "t10-q10",
          question: "¿Qué es la carrera administrativa?",
          options: ["Solo antigüedad", "Conjunto de expectativas de progreso profesional", "Solo promoción", "Solo formación"],
          correctAnswer: 1,
          explanation: "La carrera administrativa es el conjunto de expectativas de progreso profesional y de desarrollo personal en el ámbito laboral."
        },
        {
          id: "t10-q11",
          question: "¿Cuál es la duración máxima del período de prueba?",
          options: ["3 meses", "6 meses", "1 año", "2 años"],
          correctAnswer: 2,
          explanation: "El período de prueba no podrá exceder de un año, salvo disposiciones específicas."
        },
        {
          id: "t10-q12",
          question: "¿Qué derechos individuales tienen los empleados públicos?",
          options: ["Solo salario", "Inamovilidad, formación, promoci��n, participación", "Solo vacaciones", "Solo jubilación"],
          correctAnswer: 1,
          explanation: "Los derechos incluyen inamovilidad, formación continua, promoción profesional, participación y asociación."
        },
        {
          id: "t10-q13",
          question: "¿Cuáles son los deberes básicos de los empleados públicos?",
          options: ["Solo obediencia", "Cumplir Constitución, servir intereses generales, objetividad", "Solo puntualidad", "Solo secreto"],
          correctAnswer: 1,
          explanation: "Los deberes incluyen respetar la Constitución, servir con objetividad los intereses generales y actuar con transparencia."
        },
        {
          id: "t10-q14",
          question: "¿Qué es la responsabilidad disciplinaria?",
          options: ["Solo civil", "Obligación de responder por incumplimiento de deberes", "Solo penal", "Solo patrimonial"],
          correctAnswer: 1,
          explanation: "Es la obligación de los empleados públicos de responder por el incumplimiento de sus deberes y obligaciones."
        },
        {
          id: "t10-q15",
          question: "¿Cuáles son los tipos de faltas disciplinarias?",
          options: ["Solo graves", "Leves, graves y muy graves", "Solo muy graves", "Solo administrativas"],
          correctAnswer: 1,
          explanation: "Las faltas se clasifican en leves, graves y muy graves según su entidad y repercusión."
        },
        {
          id: "t10-q16",
          question: "¿Cuál es la sanción máxima en el régimen disciplinario?",
          options: ["Suspensión", "Separación del servicio", "Multa", "Apercibimiento"],
          correctAnswer: 1,
          explanation: "La separación del servicio es la sanción más grave en el régimen disciplinario de los funcionarios."
        },
        {
          id: "t10-q17",
          question: "¿Qué es la evaluación del desempeño?",
          options: ["Solo control", "Valoración estructurada del rendimiento", "Solo castigo", "Solo promoción"],
          correctAnswer: 1,
          explanation: "Es un procedimiento de valoración objetiva y sistemática de la actuación de los empleados públicos."
        },
        {
          id: "t10-q18",
          question: "¿Cuándo prescribe un procedimiento disciplinario?",
          options: ["6 meses para leves, 2 años para graves, 6 años para muy graves", "1 año para todas", "No prescriben", "5 años para todas"],
          correctAnswer: 0,
          explanation: "Prescriben a los 6 meses las leves, 2 años las graves y 6 a��os las muy graves."
        },
        {
          id: "t10-q19",
          question: "¿Qué es la jubilación forzosa?",
          options: ["Voluntaria", "Al cumplir la edad reglamentaria", "Por enfermedad", "Por sanción"],
          correctAnswer: 1,
          explanation: "La jubilación forzosa se produce al cumplir la edad establecida reglamentariamente."
        },
        {
          id: "t10-q20",
          question: "¿Cuál es el régimen de incompatibilidades de los empleados públicos?",
          options: ["Pueden trabajar libremente", "Incompatibilidad general con actividad privada", "Solo con el mismo sector", "No hay incompatibilidades"],
          correctAnswer: 1,
          explanation: "Existe un régimen de incompatibilidades que impide el ejercicio de actividades privadas salvo excepciones tasadas."
        }
      ]
    },
    {
      themeId: "tema-11",
      themeName: "Contratación del Sector Público",
      tests: [
        {
          id: "t11-q1",
          question: "¿Qué ley regula la contratación del sector público?",
          options: ["Ley 9/2017", "Ley 30/2007", "Ley 3/2011", "Ley 40/2015"],
          correctAnswer: 0,
          explanation: "La Ley 9/2017, de 8 de noviembre, de Contratos del Sector Público regula la contratación pública."
        },
        {
          id: "t11-q2",
          question: "¿Cuáles son los principios de la contratación pública?",
          options: ["Solo economía", "Transparencia, igualdad, no discriminación, eficiencia", "Solo rapidez", "Solo legalidad"],
          correctAnswer: 1,
          explanation: "Los principios incluyen libertad de acceso, no discriminación, igualdad de trato, transparencia, proporcionalidad e integridad."
        },
        {
          id: "t11-q3",
          question: "¿Cuáles son los tipos de contratos del sector público?",
          options: ["Solo obras", "Obras, suministro, servicios, concesión", "Solo servicios", "Solo suministro"],
          correctAnswer: 1,
          explanation: "Los tipos son contratos de obras, suministro, servicios y concesión de obras y servicios."
        },
        {
          id: "t11-q4",
          question: "¿Cuáles son los procedimientos de adjudicación?",
          options: ["Solo abierto", "Abierto, restringido, negociado, diálogo competitivo", "Solo negociado", "Solo restringido"],
          correctAnswer: 1,
          explanation: "Los procedimientos son abierto, restringido, negociado sin publicidad, diálogo competitivo y asociación para la innovación."
        },
        {
          id: "t11-q5",
          question: "¿Cuándo es obligatoria la licitación electrónica?",
          options: ["Nunca", "Siempre salvo excepciones", "Solo para grandes contratos", "Solo si lo decide el órgano"],
          correctAnswer: 1,
          explanation: "La licitación electrónica es obligatoria salvo en los casos excepcionales previstos en la ley."
        },
        {
          id: "t11-q6",
          question: "¿Cuál es el plazo mínimo para presentar ofertas en procedimiento abierto?",
          options: ["15 días", "25 días", "30 días", "35 días"],
          correctAnswer: 2,
          explanation: "El plazo mínimo para presentar ofertas en procedimiento abierto es de 30 días desde el envío del anuncio."
        },
        {
          id: "t11-q7",
          question: "¿Qué son los pliegos de cláusulas administrativas?",
          options: ["Documento técnico", "Documento con condiciones jurídicas y administrativas", "Solo precios", "Solo plazos"],
          correctAnswer: 1,
          explanation: "Los pliegos establecen las cláusulas administrativas particulares que han de regir el contrato."
        },
        {
          id: "t11-q8",
          question: "¿Cuándo debe constituirse la garantía definitiva?",
          options: ["Al licitar", "Antes de la formalización del contrato", "Al terminar", "No es obligatoria"],
          correctAnswer: 1,
          explanation: "La garantía definitiva debe constituirse antes de la formalización del contrato."
        },
        {
          id: "t11-q9",
          question: "¿Cuál es el porcentaje de la garantía definitiva?",
          options: ["3%", "5%", "10%", "15%"],
          correctAnswer: 1,
          explanation: "La garantía definitiva será del 5% del precio de adjudicación, IVA excluido."
        },
        {
          id: "t11-q10",
          question: "¿Qué es la Mesa de Contratación?",
          options: ["Mobiliario", "Órgano colegiado de asistencia t��cnica", "Solo para grandes contratos", "Órgano de control"],
          correctAnswer: 1,
          explanation: "La Mesa de Contratación es un órgano colegiado de asistencia técnica especializada al órgano de contratación."
        },
        {
          id: "t11-q11",
          question: "¿Cuándo es necesario dividir el objeto del contrato en lotes?",
          options: ["Nunca", "Siempre que sea posible técnica y económicamente", "Solo si lo solicita", "Solo en obras"],
          correctAnswer: 1,
          explanation: "El objeto del contrato deberá dividirse en lotes siempre que ello sea técnica y económicamente posible."
        },
        {
          id: "t11-q12",
          question: "¿Qué criterios pueden utilizarse para la adjudicación?",
          options: ["Solo precio", "Mejor relación calidad-precio", "Solo calidad", "Solo plazos"],
          correctAnswer: 1,
          explanation: "Los contratos se adjudicarán utilizando criterios basados en la mejor relación calidad-precio."
        },
        {
          id: "t11-q13",
          question: "¿Cuál es el plazo de garantía general de los contratos de obras?",
          options: ["1 año", "3 años", "5 años", "10 años"],
          correctAnswer: 0,
          explanation: "El plazo de garantía será de un año, salvo que se establezca otro en el pliego de cláusulas administrativas."
        },
        {
          id: "t11-q14",
          question: "¿Qué son las modificaciones contractuales?",
          options: ["Cambios libres", "Cambios previstos y justificados", "Solo mejoras", "Solo reducciones"],
          correctAnswer: 1,
          explanation: "Las modificaciones deben estar previstas en los pliegos o ser necesarias por razones de interés público."
        },
        {
          id: "t11-q15",
          question: "¿Cuándo puede resolverse un contrato?",
          options: ["Solo por incumplimiento", "Por las causas previstas en la ley", "Libremente", "Solo al vencimiento"],
          correctAnswer: 1,
          explanation: "Los contratos se resuelven por las causas establecidas en la ley, por mutuo acuerdo o por decisión unilateral."
        },
        {
          id: "t11-q16",
          question: "¿Qué es el perfil de contratante?",
          options: ["Descripción del órgano", "Plataforma de información contractual", "Lista de proveedores", "Base de datos"],
          correctAnswer: 1,
          explanation: "El perfil de contratante es la plataforma de información y comunicación de la actividad contractual."
        },
        {
          id: "t11-q17",
          question: "¿Cuáles son las prohibiciones para contratar?",
          options: ["Solo penales", "Administrativas, laborales, fiscales, penales", "Solo fiscales", "Solo laborales"],
          correctAnswer: 1,
          explanation: "Las prohibiciones abarcan aspectos penales, administrativos, laborales y de Seguridad Social, y tributarios."
        },
        {
          id: "t11-q18",
          question: "¿Qué es la subcontratación?",
          options: ["Prohibida", "Permitida con límites y condiciones", "Libre", "Solo en obras"],
          correctAnswer: 1,
          explanation: "La subcontratación está permitida con l��mites porcentuales y cumplimiento de condiciones específicas."
        },
        {
          id: "t11-q19",
          question: "¿Cuál es el régimen de revisión de precios?",
          options: ["Prohibida", "Permitida en contratos superiores a 2 años", "Obligatoria", "Solo en crisis"],
          correctAnswer: 1,
          explanation: "Procede la revisión de precios en contratos cuya duración sea superior a dos años."
        },
        {
          id: "t11-q20",
          question: "¿Qué recursos caben contra los actos de contratación?",
          options: ["Solo contencioso", "Recurso especial en materia contractual", "Solo administrativo", "No caben"],
          correctAnswer: 1,
          explanation: "Cabe recurso especial en materia de contratación antes de acudir a la jurisdicción contencioso-administrativa."
        }
      ]
    },
    {
      themeId: "tema-12",
      themeName: "Gestión Financiera y Presupuestaria",
      tests: [
        {
          id: "t12-q1",
          question: "¿Qué ley regula la Hacienda Pública estatal?",
          options: ["Ley General Presupuestaria", "Ley 47/2003, General Presupuestaria", "Ley 40/2015", "Ley 39/2015"],
          correctAnswer: 1,
          explanation: "La Ley 47/2003, de 26 de noviembre, General Presupuestaria, regula el régimen presupuestario del Estado."
        },
        {
          id: "t12-q2",
          question: "¿Cuáles son los principios presupuestarios clásicos?",
          options: ["Solo anualidad", "Anualidad, unidad, universalidad, especialidad", "Solo universalidad", "Solo especialidad"],
          correctAnswer: 1,
          explanation: "Los principios clásicos son anualidad, unidad, universalidad y especialidad cualitativa y cuantitativa."
        },
        {
          id: "t12-q3",
          question: "¿Quién elabora los Presupuestos Generales del Estado?",
          options: ["Las Cortes", "El Gobierno", "El Ministerio de Hacienda", "El Tribunal de Cuentas"],
          correctAnswer: 1,
          explanation: "El Gobierno elabora los Presupuestos Generales del Estado y los remite a las Cortes para su aprobación."
        },
        {
          id: "t12-q4",
          question: "¿Cuáles son las fases del procedimiento de gasto público?",
          options: ["Solo dos", "Autorización, compromiso, reconocimiento, ordenación", "Solo tres", "Solo una"],
          correctAnswer: 1,
          explanation: "Las fases son autorización del gasto, compromiso del gasto, reconocimiento de la obligación y ordenación del pago."
        },
        {
          id: "t12-q5",
          question: "¿Qué es la autorización del gasto?",
          options: ["El pago", "Acto que habilita para realizar gastos", "La liquidación", "El compromiso"],
          correctAnswer: 1,
          explanation: "Es el acto mediante el cual se acuerda la realización de gastos por una cuantía cierta o aproximada."
        },
        {
          id: "t12-q6",
          question: "¿Cuándo se produce el compromiso del gasto?",
          options: ["Al autorizar", "Al reservar crédito para obligación futura", "Al pagar", "Al liquidar"],
          correctAnswer: 1,
          explanation: "Se produce cuando se reserva la totalidad o parte del crédito para atender una obligación futura."
        },
        {
          id: "t12-q7",
          question: "¿Qué es el reconocimiento de la obligación?",
          options: ["Solo contable", "Acto que declara la existencia de deuda líquida", "Solo presupuestario", "Solo formal"],
          correctAnswer: 1,
          explanation: "Es el acto que declara la existencia de una deuda líquida y exigible contra la Hacienda Pública."
        },
        {
          id: "t12-q8",
          question: "¿Cuál es el período de pago voluntario?",
          options: ["10 días", "20 días naturales", "30 días", "1 mes"],
          correctAnswer: 1,
          explanation: "El período de pago voluntario es de 20 días naturales desde la notificación de la liquidación."
        },
        {
          id: "t12-q9",
          question: "¿Qué son las modificaciones presupuestarias?",
          options: ["Solo transferencias", "Cambios en dotaciones durante el ejercicio", "Solo ampliaciones", "Solo reducciones"],
          correctAnswer: 1,
          explanation: "Son alteraciones en las dotaciones presupuestarias inicialmente aprobadas durante el ejercicio."
        },
        {
          id: "t12-q10",
          question: "¿Qué tipos de transferencias presupuestarias existen?",
          options: ["Solo entre ministerios", "Dentro del mismo ministerio y entre ministerios", "Solo internas", "Solo externas"],
          correctAnswer: 1,
          explanation: "Pueden ser transferencias dentro del mismo ministerio o entre distintos ministerios."
        },
        {
          id: "t12-q11",
          question: "¿Cuándo proceden las ampliaciones de crédito?",
          options: ["Libremente", "Cuando se produzcan ingresos específicos", "Nunca", "Solo en emergencias"],
          correctAnswer: 1,
          explanation: "Proceden cuando se produzcan ingresos de naturaleza no tributaria superiores a los previstos."
        },
        {
          id: "t12-q12",
          question: "¿Qué es la liquidación del presupuesto?",
          options: ["Solo cierre", "Operación de cierre que determina derechos y obligaciones", "Solo cálculo", "Solo archivo"],
          correctAnswer: 1,
          explanation: "Es la operación contable de cierre que determina los derechos y obligaciones reconocidos."
        },
        {
          id: "t12-q13",
          question: "¿Cuándo caduca el ejercicio presupuestario?",
          options: ["30 de noviembre", "31 de diciembre", "31 de enero", "28 de febrero"],
          correctAnswer: 1,
          explanation: "El ejercicio presupuestario coincide con el año natural y caduca el 31 de diciembre."
        },
        {
          id: "t12-q14",
          question: "¿Qué son los gastos plurianuales?",
          options: ["Solo anuales", "Gastos que se extienden a varios ejercicios", "Solo de inversión", "Solo corrientes"],
          correctAnswer: 1,
          explanation: "Son gastos cuyos créditos se extienden a ejercicios posteriores al de su autorización."
        },
        {
          id: "t12-q15",
          question: "¿Cuál es el órgano superior de control interno?",
          options: ["Tribunal de Cuentas", "Intervención General del Estado", "Ministerio de Hacienda", "Consejo de Estado"],
          correctAnswer: 1,
          explanation: "La Intervención General del Estado ejerce el control interno de la gestión económico-financiera del Estado."
        },
        {
          id: "t12-q16",
          question: "¿Qué es el control financiero permanente?",
          options: ["Solo anual", "Verificación continua de actividad económico-financiera", "Solo presupuestario", "Solo contable"],
          correctAnswer: 1,
          explanation: "Es la verificación continua del cumplimiento de la normativa en la actividad económico-financiera."
        },
        {
          id: "t12-q17",
          question: "¿Cuáles son los tipos de control presupuestario?",
          options: ["Solo previo", "Previo, concomitante y posterior", "Solo posterior", "Solo simultáneo"],
          correctAnswer: 1,
          explanation: "El control puede ser previo (antes de la operación), concomitante (durante) y posterior (después)."
        },
        {
          id: "t12-q18",
          question: "¿Qué es la Cuenta General del Estado?",
          options: ["Solo balance", "Rendición anual de cuentas al Tribunal de Cuentas", "Solo liquidación", "Solo memoria"],
          correctAnswer: 1,
          explanation: "Es la rendición de cuentas anual que el Gobierno presenta al Tribunal de Cuentas."
        },
        {
          id: "t12-q19",
          question: "¿Cuál es el plazo de presentación de la Cuenta General del Estado?",
          options: ["31 de marzo", "31 de mayo", "30 de junio", "31 de julio"],
          correctAnswer: 1,
          explanation: "Debe presentarse al Tribunal de Cuentas antes del 31 de mayo del ejercicio siguiente."
        },
        {
          id: "t12-q20",
          question: "¿Qué contiene el estado de ingresos del presupuesto?",
          options: ["Solo impuestos", "Previsión de ingresos clasificados", "Solo tasas", "Solo transferencias"],
          correctAnswer: 1,
          explanation: "Contiene la previsión de ingresos clasificados por capítulos según su naturaleza económica."
        }
      ]
    },
    {
      themeId: "tema-13",
      themeName: "Organización de la Administración General del Estado",
      tests: [
        {
          id: "t13-q1",
          question: "¿Qué ley regula la organizaci��n de la Administración General del Estado?",
          options: ["Ley 40/2015", "Ley 39/2015", "Ley 6/1997", "Ley 30/1992"],
          correctAnswer: 0,
          explanation: "La Ley 40/2015 del Régimen Jurídico del Sector Público regula la organización de la AGE."
        },
        {
          id: "t13-q2",
          question: "¿Cuáles son los órganos superiores de la AGE?",
          options: ["Solo Ministros", "Presidente, Vicepresidentes y Ministros", "Solo Presidente", "Solo Secretarios"],
          correctAnswer: 1,
          explanation: "Son órganos superiores el Presidente del Gobierno, los Vicepresidentes y los Ministros."
        },
        {
          id: "t13-q3",
          question: "¿Cuáles son los órganos directivos?",
          options: ["Solo Secretarios", "Secretarios de Estado, Secretarios Generales, Directores Generales", "Solo Directores", "Solo Subsecretarios"],
          correctAnswer: 1,
          explanation: "Son órganos directivos los Secretarios de Estado, Secretarios Generales, Secretarios Generales Técnicos, Directores Generales y Subdirectores Generales."
        },
        {
          id: "t13-q4",
          question: "¿Qué es un Ministro?",
          options: ["Funcionario superior", "Órgano superior que dirige un departamento ministerial", "Director de área", "Secretario técnico"],
          correctAnswer: 1,
          explanation: "Los Ministros son los órganos superiores que, bajo la autoridad del Presidente, dirigen los departamentos ministeriales."
        },
        {
          id: "t13-q5",
          question: "¿Quién nombra a los Secretarios de Estado?",
          options: ["El Rey", "El Presidente del Gobierno", "El Ministro", "El Consejo de Ministros"],
          correctAnswer: 1,
          explanation: "Los Secretarios de Estado son nombrados por el Presidente del Gobierno a propuesta del Ministro correspondiente."
        },
        {
          id: "t13-q6",
          question: "¿Cuál es la función del Subsecretario?",
          options: ["Solo administrativa", "Órgano directivo superior del ministerio bajo el Ministro", "Solo técnica", "Solo de control"],
          correctAnswer: 1,
          explanation: "El Subsecretario es el órgano directivo superior del ministerio, bajo la inmediata autoridad del Ministro."
        },
        {
          id: "t13-q7",
          question: "¿Qué son los organismos públicos?",
          options: ["Solo empresas", "Entidades de derecho público con personalidad jurídica propia", "Solo fundaciones", "Solo asociaciones"],
          correctAnswer: 1,
          explanation: "Son entidades de derecho público con personalidad jurídica propia, creadas para la realización de actividades derivadas de la propia Administración."
        },
        {
          id: "t13-q8",
          question: "¿Cuáles son los tipos de organismos públicos?",
          options: ["Solo autónomos", "Organismos autónomos, entidades públicas empresariales, agencias", "Solo empresariales", "Solo fundaciones"],
          correctAnswer: 1,
          explanation: "Se clasifican en organismos autónomos, entidades públicas empresariales y agencias estatales."
        },
        {
          id: "t13-q9",
          question: "¿Qué característica tienen los organismos autónomos?",
          options: ["Ánimo de lucro", "Realizan actividades administrativas", "Solo actividades económicas", "Solo servicios"],
          correctAnswer: 1,
          explanation: "Los organismos autónomos realizan actividades de fomento, prestacionales o de gestión de servicios públicos."
        },
        {
          id: "t13-q10",
          question: "¿Cuál es el órgano colegiado de gobierno?",
          options: ["Consejo de Estado", "Consejo de Ministros", "Comisión General", "Junta Superior"],
          correctAnswer: 1,
          explanation: "El Consejo de Ministros es el órgano colegiado de gobierno, constituido por el Presidente y los Ministros."
        },
        {
          id: "t13-q11",
          question: "¿Qué es una Comisión Delegada del Gobierno?",
          options: ["Órgano consultivo", "Órgano colegiado para coordinación de políticas sectoriales", "Órgano de control", "Comisión parlamentaria"],
          correctAnswer: 1,
          explanation: "Son órganos colegiados para la coordinación de la política del Gobierno en áreas específicas."
        },
        {
          id: "t13-q12",
          question: "¿Quién dirige la Secretaría General Técnica?",
          options: ["Un Director General", "Un Secretario General Técnico", "Un Subsecretario", "Un funcionario"],
          correctAnswer: 1,
          explanation: "Cada ministerio tiene una Secretaría General Técnica dirigida por un Secretario General Técnico."
        },
        {
          id: "t13-q13",
          question: "¿Cuál es la función de la Inspección General de Servicios?",
          options: ["Solo auditoría", "Control interno y evaluación de servicios", "Solo disciplina", "Solo información"],
          correctAnswer: 1,
          explanation: "Ejerce el control interno sobre los servicios y unidades del ministerio y sus organismos."
        },
        {
          id: "t13-q14",
          question: "¿Qué es un Gabinete ministerial?",
          options: ["Órgano técnico", "Órgano de confianza para apoyo al Ministro", "Órgano permanente", "Órgano de carrera"],
          correctAnswer: 1,
          explanation: "Es un órgano de apoyo al Ministro, de naturaleza política y confianza personal."
        },
        {
          id: "t13-q15",
          question: "¿Cuántos miembros máximo puede tener un Gabinete?",
          options: ["5", "7", "10", "12"],
          correctAnswer: 1,
          explanation: "Los Gabinetes no podrán tener más de siete miembros, incluido su Director."
        },
        {
          id: "t13-q16",
          question: "¿Qué es una Delegación del Gobierno?",
          options: ["Órgano central", "Órgano territorial que representa al Estado en la CCAA", "Órgano local", "Órgano autonómico"],
          correctAnswer: 1,
          explanation: "Las Delegaciones del Gobierno representan a la Administración General del Estado en cada comunidad autónoma."
        },
        {
          id: "t13-q17",
          question: "¿Quién nombra al Delegado del Gobierno?",
          options: ["El Rey", "El Consejo de Ministros", "El Presidente autonómico", "Las Cortes"],
          correctAnswer: 1,
          explanation: "Los Delegados del Gobierno son nombrados por el Consejo de Ministros."
        },
        {
          id: "t13-q18",
          question: "¿Qué son las Subdelegaciones del Gobierno?",
          options: ["Órganos autonómicos", "Órganos territoriales en las provincias", "Órganos locales", "Órganos centrales"],
          correctAnswer: 1,
          explanation: "Son los órganos territoriales de la Administración General del Estado en las provincias."
        },
        {
          id: "t13-q19",
          question: "¿Cuál es el rango de los Secretarios de Estado?",
          options: ["Inferior a Ministro", "Superior a Director General", "Igual a Ministro", "Variable"],
          correctAnswer: 1,
          explanation: "Los Secretarios de Estado tienen rango superior a los Directores Generales e inferior a los Ministros."
        },
        {
          id: "t13-q20",
          question: "¿Qué es el régimen de suplencias?",
          options: ["Solo ausencias", "Sistema de sustitución temporal de órganos", "Solo vacantes", "Solo permisos"],
          correctAnswer: 1,
          explanation: "Es el sistema que regula la sustitución temporal de los titulares de órganos en casos de ausencia, enfermedad o vacante."
        }
      ]
    },
    {
      themeId: "tema-14",
      themeName: "Políticas de Igualdad de Género",
      tests: [
        {
          id: "t14-q1",
          question: "¿Qué ley regula la igualdad efectiva entre mujeres y hombres?",
          options: ["Ley Orgánica 1/2004", "Ley Orgánica 3/2007", "Ley 39/2015", "Ley 40/2015"],
          correctAnswer: 1,
          explanation: "La Ley Orgánica 3/2007, de 22 de marzo, para la igualdad efectiva de mujeres y hombres regula esta materia."
        },
        {
          id: "t14-q2",
          question: "¿Cuál es el principio de igualdad de trato?",
          options: ["Solo laboral", "Ausencia de discriminación directa o indirecta por razón de sexo", "Solo salarial", "Solo educativo"],
          correctAnswer: 1,
          explanation: "Supone la ausencia de toda discriminación directa o indirecta por razón de sexo en todos los ámbitos."
        },
        {
          id: "t14-q3",
          question: "¿Qué es la discriminación directa por razón de sexo?",
          options: ["Solo física", "Situación en que una persona es tratada de manera menos favorable por su sexo", "Solo laboral", "Solo verbal"],
          correctAnswer: 1,
          explanation: "Se considera discriminación directa cuando una persona es tratada de manera menos favorable que otra en situación comparable por razón de sexo."
        },
        {
          id: "t14-q4",
          question: "¿Qué son las acciones positivas?",
          options: ["Solo cuotas", "Medidas específicas para prevenir o compensar desventajas", "Solo becas", "Solo formación"],
          correctAnswer: 1,
          explanation: "Son medidas específicas a favor de las mujeres para prevenir o compensar desventajas y facilitar la participación en igualdad."
        },
        {
          id: "t14-q5",
          question: "¿Qué es el acoso sexual?",
          options: ["Solo físico", "Comportamiento de naturaleza sexual no deseado", "Solo verbal", "Solo visual"],
          correctAnswer: 1,
          explanation: "Es cualquier comportamiento de naturaleza sexual que se realice con el propósito de atentar contra la dignidad de una persona."
        },
        {
          id: "t14-q6",
          question: "¿Qué es el acoso por razón de sexo?",
          options: ["Solo laboral", "Comportamiento relacionado con el sexo que atenta contra la dignidad", "Solo escolar", "Solo familiar"],
          correctAnswer: 1,
          explanation: "Es cualquier comportamiento realizado en función del sexo de una persona que atenta contra su dignidad."
        },
        {
          id: "t14-q7",
          question: "¿Cuál es el objetivo de los planes de igualdad?",
          options: ["Solo información", "Alcanzar la igualdad real entre mujeres y hombres", "Solo sensibilización", "Solo estadísticas"],
          correctAnswer: 1,
          explanation: "Los planes de igualdad tienen como objetivo alcanzar la igualdad de trato y oportunidades eliminando la discriminación."
        },
        {
          id: "t14-q8",
          question: "¿Qué empresas están obligadas a tener plan de igualdad?",
          options: ["Todas", "Las de más de 50 trabajadores", "Solo públicas", "Solo grandes"],
          correctAnswer: 1,
          explanation: "Están obligadas las empresas de más de cincuenta trabajadores."
        },
        {
          id: "t14-q9",
          question: "¿Qué es la transversalidad de género?",
          options: ["Solo en políticas específicas", "Integración de la perspectiva de género en todas las políticas", "Solo en leyes", "Solo en presupuestos"],
          correctAnswer: 1,
          explanation: "Es la integración de la perspectiva de género en todas las políticas y acciones de los poderes públicos."
        },
        {
          id: "t14-q10",
          question: "¿Qué son los presupuestos con enfoque de género?",
          options: ["Solo para mujeres", "Análisis del impacto de género en políticas presupuestarias", "Solo gastos sociales", "Solo subvenciones"],
          correctAnswer: 1,
          explanation: "Implican la evaluación del impacto de género de las políticas presupuestarias y la aplicación de la perspectiva de género."
        },
        {
          id: "t14-q11",
          question: "¿Cuál es la composición del Consejo de Participación de la Mujer?",
          options: ["Solo administración", "Administración y organizaciones de mujeres", "Solo organizaciones", "Solo expertos"],
          correctAnswer: 1,
          explanation: "Es un órgano colegiado con representación de la Administración y las organizaciones de mujeres."
        },
        {
          id: "t14-q12",
          question: "¿Qué es la corresponsabilidad?",
          options: ["Solo laboral", "Reparto equilibrado de responsabilidades familiares", "Solo doméstica", "Solo cuidados"],
          correctAnswer: 1,
          explanation: "Es el reparto equilibrado entre mujeres y hombres de las responsabilidades familiares y domésticas."
        },
        {
          id: "t14-q13",
          question: "¿Cuál es el permiso de paternidad?",
          options: ["Solo 2 días", "16 semanas igual que la maternidad", "1 mes", "Variable"],
          correctAnswer: 1,
          explanation: "El permiso de paternidad es de 16 semanas, igual que el de maternidad, desde 2021."
        },
        {
          id: "t14-q14",
          question: "¿Qué medidas de conciliación establece la ley?",
          options: ["Solo flexibilidad", "Flexibilidad horaria, teletrabajo, reducción jornada", "Solo permisos", "Solo excedencias"],
          correctAnswer: 1,
          explanation: "Incluye flexibilidad horaria, teletrabajo, reducción de jornada, excedencias y adaptación del puesto."
        },
        {
          id: "t14-q15",
          question: "¿Qué es la violencia de género?",
          options: ["Solo física", "Violencia ejercida sobre las mujeres por ser mujeres", "Solo psicológica", "Solo sexual"],
          correctAnswer: 1,
          explanation: "Es aquella violencia que se ejerce sobre las mujeres por parte de quienes sean o hayan sido sus cónyuges o parejas."
        },
        {
          id: "t14-q16",
          question: "¿Cuál es el teléfono de atención a víctimas de violencia de género?",
          options: ["016", "112", "091", "062"],
          correctAnswer: 0,
          explanation: "El 016 es el teléfono nacional de información y asesoramiento a víctimas de violencia de género."
        },
        {
          id: "t14-q17",
          question: "¿Qué es la orden de protección?",
          options: ["Solo alejamiento", "Medida cautelar integral de protecci��n", "Solo económica", "Solo policial"],
          correctAnswer: 1,
          explanation: "Es una medida cautelar que comprende medidas penales, civiles y de asistencia social para la protección integral."
        },
        {
          id: "t14-q18",
          question: "¿Qué derechos laborales tienen las víctimas de violencia de género?",
          options: ["Solo excedencia", "Reducción jornada, movilidad geográfica, extinción contrato", "Solo permisos", "Solo cambio puesto"],
          correctAnswer: 1,
          explanation: "Tienen derecho a reducción o reordenación del tiempo de trabajo, movilidad geográfica y extinción del contrato con indemnización."
        },
        {
          id: "t14-q19",
          question: "¿Qué es la Renta Activa de Inserción para víctimas de violencia de género?",
          options: ["Solo laboral", "Ayuda económica específica para víctimas", "Solo formativa", "Solo temporal"],
          correctAnswer: 1,
          explanation: "Es una ayuda económica específica que facilita la inserción laboral de las víctimas de violencia de género."
        },
        {
          id: "t14-q20",
          question: "¿Cuál es el objetivo del Pacto de Estado contra la Violencia de Género?",
          options: ["Solo información", "Protección integral y prevención de la violencia", "Solo sanción", "Solo asistencia"],
          correctAnswer: 1,
          explanation: "Busca la protección integral de las víctimas, la prevención y la sensibilización contra la violencia de género."
        }
      ]
    },
    {
      themeId: "tema-15",
      themeName: "Prevención de Riesgos Laborales",
      tests: [
        {
          id: "t15-q1",
          question: "¿Qué ley regula la prevención de riesgos laborales?",
          options: ["Ley 30/1995", "Ley 31/1995", "Ley 32/1995", "Ley 29/1995"],
          correctAnswer: 1,
          explanation: "La Ley 31/1995, de 8 de noviembre, de Prevención de Riesgos Laborales regula esta materia."
        },
        {
          id: "t15-q2",
          question: "¿Cuál es el objeto de la Ley de Prevención de Riesgos Laborales?",
          options: ["Solo accidentes", "Promover seguridad y salud de los trabajadores", "Solo enfermedades", "Solo indemnizaciones"],
          correctAnswer: 1,
          explanation: "Su objeto es promover la seguridad y la salud de los trabajadores mediante la aplicación de medidas preventivas."
        },
        {
          id: "t15-q3",
          question: "¿Qué se entiende por prevención?",
          options: ["Solo protección", "Conjunto de actividades para evitar o disminuir riesgos", "Solo información", "Solo formación"],
          correctAnswer: 1,
          explanation: "Es el conjunto de actividades o medidas adoptadas o previstas para evitar o disminuir los riesgos derivados del trabajo."
        },
        {
          id: "t15-q4",
          question: "¿Cuáles son los principios de la acción preventiva?",
          options: ["Solo evitar riesgos", "Evitar, evaluar, combatir en origen, adaptar al trabajador", "Solo protección", "Solo control"],
          correctAnswer: 1,
          explanation: "Incluye evitar riesgos, evaluar los inevitables, combatir en origen, adaptar al trabajador y anteponer protección colectiva."
        },
        {
          id: "t15-q5",
          question: "¿Cuáles son los derechos de los trabajadores en materia preventiva?",
          options: ["Solo información", "Información, consulta, participación, formación, vigilancia salud", "Solo formación", "Solo protección"],
          correctAnswer: 1,
          explanation: "Los trabajadores tienen derecho a información, consulta y participación, formación en materia preventiva y vigilancia de la salud."
        },
        {
          id: "t15-q6",
          question: "¿Cuáles son las obligaciones de los trabajadores?",
          options: ["Solo cumplir órdenes", "Velar por su seguridad y la de otros trabajadores", "Solo usar EPIs", "Solo informar"],
          correctAnswer: 1,
          explanation: "Deben velar por su propia seguridad y salud y por la de otras personas afectadas por su actividad profesional."
        },
        {
          id: "t15-q7",
          question: "¿Qué es la evaluación de riesgos?",
          options: ["Solo inspección", "Proceso dirigido a estimar la magnitud de los riesgos", "Solo medición", "Solo observación"],
          correctAnswer: 1,
          explanation: "Es el proceso dirigido a estimar la magnitud de aquellos riesgos que no hayan podido evitarse."
        },
        {
          id: "t15-q8",
          question: "¿Cuándo debe realizarse la evaluación inicial de riesgos?",
          options: ["Al año", "Antes del inicio de la actividad", "Tras un accidente", "Cuando lo solicite"],
          correctAnswer: 1,
          explanation: "La evaluación inicial de los riesgos debe realizarse antes del inicio de la actividad."
        },
        {
          id: "t15-q9",
          question: "¿Qué es la planificación de la actividad preventiva?",
          options: ["Solo calendario", "Actividades para eliminar o controlar riesgos", "Solo presupuesto", "Solo objetivos"],
          correctAnswer: 1,
          explanation: "Es el conjunto de actividades preventivas necesarias para eliminar o controlar y reducir los riesgos."
        },
        {
          id: "t15-q10",
          question: "¿Cuáles son las modalidades de organización preventiva?",
          options: ["Solo externa", "Asunción personal, trabajadores designados, servicio prevención, externo", "Solo interna", "Solo mixta"],
          correctAnswer: 1,
          explanation: "Las modalidades son asunción personal por el empresario, designación de trabajadores, servicio de prevención propio o ajeno."
        },
        {
          id: "t15-q11",
          question: "¿Cuáles son las especialidades preventivas?",
          options: ["Solo 2", "Seguridad, higiene, ergonomía y medicina del trabajo", "Solo 3", "Solo seguridad"],
          correctAnswer: 1,
          explanation: "Las especialidades son seguridad en el trabajo, higiene industrial, ergonomía y psicosociología aplicada y medicina del trabajo."
        },
        {
          id: "t15-q12",
          question: "¿Qué formación mínima requiere el nivel básico en prevención?",
          options: ["10 horas", "50 horas", "100 horas", "200 horas"],
          correctAnswer: 1,
          explanation: "El nivel básico requiere una formación mínima de 50 horas."
        },
        {
          id: "t15-q13",
          question: "¿Qué es un delegado de prevención?",
          options: ["Solo información", "Representante de los trabajadores en materia preventiva", "Solo control", "Solo asesor"],
          correctAnswer: 1,
          explanation: "Son los representantes de los trabajadores con funciones específicas en materia de prevención de riesgos."
        },
        {
          id: "t15-q14",
          question: "¿Cuáles son las competencias de los delegados de prevención?",
          options: ["Solo vigilar", "Colaborar, promover y fomentar cooperación en prevención", "Solo informar", "Solo denunciar"],
          correctAnswer: 1,
          explanation: "Colaborar con la empresa en la mejora de la acción preventiva, promover y fomentar la cooperación en la prevención."
        },
        {
          id: "t15-q15",
          question: "¿Qué es el Comité de Seguridad y Salud?",
          options: ["Solo consultivo", "Órgano paritario y colegiado de participación", "Solo empresarial", "Solo sindical"],
          correctAnswer: 1,
          explanation: "Es el órgano paritario y colegiado de participación destinado a la consulta regular y periódica en materia preventiva."
        },
        {
          id: "t15-q16",
          question: "¿Cuándo es obligatorio constituir Comité de Seguridad y Salud?",
          options: ["Siempre", "En empresas de 50 o más trabajadores", "En empresas de 100 o más", "Solo si hay riesgos"],
          correctAnswer: 1,
          explanation: "Es obligatorio en empresas o centros de trabajo que cuenten con 50 o más trabajadores."
        },
        {
          id: "t15-q17",
          question: "¿Qué es la vigilancia de la salud?",
          options: ["Solo reconocimientos", "Conjunto de actuaciones sanitarias sobre los trabajadores", "Solo análisis", "Solo historiales"],
          correctAnswer: 1,
          explanation: "Comprende el conjunto de actuaciones sanitarias que permiten la detección precoz de daños a la salud."
        },
        {
          id: "t15-q18",
          question: "¿Cuándo son obligatorios los reconocimientos médicos?",
          options: ["Siempre", "Cuando sean imprescindibles para evaluar efectos de trabajo sobre salud", "Nunca", "Solo iniciales"],
          correctAnswer: 1,
          explanation: "Son obligatorios cuando sean imprescindibles para evaluar los efectos de las condiciones de trabajo sobre la salud."
        },
        {
          id: "t15-q19",
          question: "¿Qué son las medidas de emergencia?",
          options: ["Solo evacuación", "Actuaciones para control de situaciones de riesgo grave", "Solo primeros auxilios", "Solo avisos"],
          correctAnswer: 1,
          explanation: "Son las actuaciones para el control de las situaciones de riesgo grave e inminente y para la evacuación."
        },
        {
          id: "t15-q20",
          question: "¿Cuál es la responsabilidad del empresario en prevención?",
          options: ["Solo económica", "Garantizar la seguridad y salud de los trabajadores", "Solo informativa", "Solo formativa"],
          correctAnswer: 1,
          explanation: "El empresario tiene el deber de garantizar la seguridad y la salud de los trabajadores a su servicio en todos los aspectos."
        }
      ]
    },
    {
      themeId: "tema-16",
      themeName: "Modernización y Transparencia Administrativa",
      tests: [
        {
          id: "t16-q1",
          question: "¿Qué ley regula la transparencia y el acceso a la información?",
          options: ["Ley 19/2013", "Ley 39/2015", "Ley 40/2015", "Ley 3/2015"],
          correctAnswer: 0,
          explanation: "La Ley 19/2013, de 9 de diciembre, de transparencia, acceso a la información pública y buen gobierno."
        },
        {
          id: "t16-q2",
          question: "¿Cuáles son los pilares de la transparencia?",
          options: ["Solo publicidad", "Publicidad activa, acceso a información, buen gobierno", "Solo acceso", "Solo control"],
          correctAnswer: 1,
          explanation: "Los tres pilares son la publicidad activa, el derecho de acceso a la información pública y las normas de buen gobierno."
        },
        {
          id: "t16-q3",
          question: "¿Qué es la publicidad activa?",
          options: ["Solo campañas", "Publicación periódica de información sin solicitud previa", "Solo web", "Solo noticias"],
          correctAnswer: 1,
          explanation: "Es la publicación periódica y actualizada de información relevante sin necesidad de solicitud previa."
        },
        {
          id: "t16-q4",
          question: "¿Cuál es el plazo para resolver solicitudes de acceso a información?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El plazo máximo para resolver y notificar es de un mes desde la recepción de la solicitud."
        },
        {
          id: "t16-q5",
          question: "¿Qué información debe publicarse en el Portal de Transparencia?",
          options: ["Solo presupuestos", "Información institucional, organizativa, planificación, económica", "Solo normativa", "Solo estadísticas"],
          correctAnswer: 1,
          explanation: "Debe incluir información institucional, organizativa, de planificación, de relevancia jurídica y económica, presupuestaria y estadística."
        },
        {
          id: "t16-q6",
          question: "¿Cuáles son los límites al derecho de acceso?",
          options: ["No hay límites", "Seguridad, defensa, política exterior, investigación", "Solo clasificados", "Solo personales"],
          correctAnswer: 1,
          explanation: "Los límites incluyen seguridad nacional, defensa, relaciones exteriores, prevención de infracciones y protección de datos personales."
        },
        {
          id: "t16-q7",
          question: "¿Qué es la administración electrónica?",
          options: ["Solo ordenadores", "Uso de medios electrónicos en la actividad administrativa", "Solo internet", "Solo bases de datos"],
          correctAnswer: 1,
          explanation: "Es la utilización de las tecnologías de la información y comunicación en las Administraciones Públicas."
        },
        {
          id: "t16-q8",
          question: "¿Cuáles son los derechos de los ciudadanos en relaci��n con la administración electrónica?",
          options: ["Solo acceso", "Relacionarse electrónicamente, no aportar datos ya en poder de AAPP", "Solo firma", "Solo consulta"],
          correctAnswer: 1,
          explanation: "Los ciudadanos tienen derecho a relacionarse electrónicamente y a no aportar documentos que ya obren en poder de las Administraciones."
        },
        {
          id: "t16-q9",
          question: "¿Qué es la sede electrónica?",
          options: ["Una web cualquiera", "Dirección electrónica disponible para ciudadanos", "Solo intranet", "Solo extranet"],
          correctAnswer: 1,
          explanation: "Es la dirección electrónica, disponible para los ciudadanos a través de redes de telecomunicaciones, cuya titularidad corresponde a una Administración Pública."
        },
        {
          id: "t16-q10",
          question: "¿Qué sistemas de firma electrónica son válidos?",
          options: ["Solo DNI-e", "Cualquier sistema que identifique al signatario", "Solo certificados", "Solo biométricos"],
          correctAnswer: 1,
          explanation: "Son válidos los sistemas de firma electrónica que permitan acreditar la autenticidad de la identidad del signatario."
        },
        {
          id: "t16-q11",
          question: "¿Qué es la interoperabilidad?",
          options: ["Solo técnica", "Capacidad de sistemas para intercambiar información", "Solo organizativa", "Solo semántica"],
          correctAnswer: 1,
          explanation: "Es la capacidad de los sistemas de información para intercambiar datos y posibilitar el intercambio de información y conocimiento."
        },
        {
          id: "t16-q12",
          question: "¿Cuáles son los niveles de interoperabilidad?",
          options: ["Solo técnico", "Técnico, semántico y organizativo", "Solo semántico", "Solo organizativo"],
          correctAnswer: 1,
          explanation: "Los niveles son técnico (conexión sistemas), semántico (comprensión información) y organizativo (coordinación procesos)."
        },
        {
          id: "t16-q13",
          question: "¿Qué es el esquema nacional de seguridad?",
          options: ["Solo controles", "Principios y requisitos de seguridad en administración electrónica", "Solo certificados", "Solo firewalls"],
          correctAnswer: 1,
          explanation: "Establece la política de seguridad en la utilización de medios electrónicos y está constituido por principios básicos y requisitos mínimos."
        },
        {
          id: "t16-q14",
          question: "¿Cuáles son las dimensiones de la seguridad?",
          options: ["Solo confidencialidad", "Confidencialidad, integridad, disponibilidad", "Solo integridad", "Solo disponibilidad"],
          correctAnswer: 1,
          explanation: "Las dimensiones básicas son confidencialidad, integridad y disponibilidad de la información."
        },
        {
          id: "t16-q15",
          question: "¿Qué es la neutralidad tecnológica?",
          options: ["Solo hardware", "Independencia de elección tecnológica específica", "Solo software", "Solo proveedores"],
          correctAnswer: 1,
          explanation: "Principio por el que se garantiza la independencia en la elección de las alternativas tecnológicas y la libertad de los servicios."
        },
        {
          id: "t16-q16",
          question: "¿Qué son los servicios públicos digitales?",
          options: ["Solo webs", "Prestación electrónica de servicios públicos", "Solo apps", "Solo formularios"],
          correctAnswer: 1,
          explanation: "Son aquellos servicios públicos prestados a través de medios electrónicos."
        },
        {
          id: "t16-q17",
          question: "¿Qué es la política de datos abiertos?",
          options: ["Solo estadísticas", "Libre acceso y reutilización de información pública", "Solo bases datos", "Solo transparencia"],
          correctAnswer: 1,
          explanation: "Promueve el acceso libre y la reutilización de la información del sector público para fomentar la transparencia y la innovación."
        },
        {
          id: "t16-q18",
          question: "¿Cuál es el formato preferente para datos abiertos?",
          options: ["PDF", "Formatos abiertos y estándares", "Word", "Propietarios"],
          correctAnswer: 1,
          explanation: "Se deben utilizar formatos abiertos, estándares y reutilizables que permitan su procesamiento."
        },
        {
          id: "t16-q19",
          question: "¿Qué es la transformación digital?",
          options: ["Solo digitalizar", "Cambio integral usando tecnologías digitales", "Solo automatizar", "Solo informatizar"],
          correctAnswer: 1,
          explanation: "Es el proceso de cambio integral de la organización mediante el uso estratégico de tecnologías digitales."
        },
        {
          id: "t16-q20",
          question: "¿Qué principio rige la relación con el ciudadano en la era digital?",
          options: ["Solo eficiencia", "Orientación al ciudadano y simplificación", "Solo rapidez", "Solo automatización"],
          correctAnswer: 1,
          explanation: "El principio fundamental es la orientación al ciudadano, simplificando procedimientos y mejorando la experiencia de usuario."
        }
      ]
    },
    {
      themeId: "tema-17",
      themeName: "Hacienda Pública y Sistema Tributario",
      tests: [
        {
          id: "t17-q1",
          question: "¿Qué es el sistema tributario español?",
          options: ["Solo impuestos", "Conjunto ordenado de tributos vigentes", "Solo tasas", "Solo contribuciones"],
          correctAnswer: 1,
          explanation: "Es el conjunto ordenado de tributos vigentes en un país en un momento determinado."
        },
        {
          id: "t17-q2",
          question: "¿Cuáles son los tipos de tributos?",
          options: ["Solo impuestos", "Impuestos, tasas y contribuciones especiales", "Solo tasas", "Solo sanciones"],
          correctAnswer: 1,
          explanation: "Los tributos se clasifican en impuestos, tasas y contribuciones especiales."
        },
        {
          id: "t17-q3",
          question: "¿Qué es un impuesto?",
          options: ["Pago por servicio", "Tributo sin contraprestación directa", "Solo multa", "Solo contribución"],
          correctAnswer: 1,
          explanation: "Es un tributo exigido sin contraprestación cuyo hecho imponible está constituido por negocios, actos o hechos que ponen de manifiesto capacidad económica."
        },
        {
          id: "t17-q4",
          question: "¿Qué es una tasa?",
          options: ["Tributo sin contraprestación", "Tributo por utilización de servicios o realización de actividades", "Solo impuesto", "Solo sanción"],
          correctAnswer: 1,
          explanation: "Es un tributo cuyo hecho imponible consiste en la utilización privativa o aprovechamiento especial del dominio público, la prestación de servicios o la realización de actividades en régimen de derecho público."
        },
        {
          id: "t17-q5",
          question: "¿Cuáles son los impuestos estatales principales?",
          options: ["Solo IRPF", "IRPF, IS, IVA, Impuestos Especiales", "Solo IVA", "Solo IS"],
          correctAnswer: 1,
          explanation: "Los principales son el Impuesto sobre la Renta de las Personas Físicas, Impuesto sobre Sociedades, IVA e Impuestos Especiales."
        },
        {
          id: "t17-q6",
          question: "¿Qué grava el IRPF?",
          options: ["Solo salarios", "Renta de personas físicas", "Solo empresas", "Solo patrimonio"],
          correctAnswer: 1,
          explanation: "Grava la renta obtenida por las personas físicas residentes en territorio español."
        },
        {
          id: "t17-q7",
          question: "¿Cuáles son los rendimientos del IRPF?",
          options: ["Solo trabajo", "Trabajo, capital, actividades económicas, ganancias patrimonio", "Solo capital", "Solo empresariales"],
          correctAnswer: 1,
          explanation: "Se clasifican en rendimientos del trabajo, del capital mobiliario e inmobiliario, de actividades económicas y ganancias y pérdidas patrimoniales."
        },
        {
          id: "t17-q8",
          question: "¿Qué es el Impuesto sobre Sociedades?",
          options: ["Solo personas", "Tributo que grava la renta de sociedades", "Solo cooperativas", "Solo fundaciones"],
          correctAnswer: 1,
          explanation: "Es un tributo de carácter directo y naturaleza personal que grava la renta de las sociedades y demás entidades jurídicas."
        },
        {
          id: "t17-q9",
          question: "¿Cuál es el tipo general del IVA?",
          options: ["18%", "21%", "16%", "15%"],
          correctAnswer: 1,
          explanation: "El tipo general del IVA en España es del 21%."
        },
        {
          id: "t17-q10",
          question: "¿Cuáles son los tipos reducidos del IVA?",
          options: ["Solo 10%", "10% y 4%", "Solo 4%", "8% y 12%"],
          correctAnswer: 1,
          explanation: "Los tipos reducidos son del 10% (tipo reducido) y del 4% (tipo superreducido)."
        },
        {
          id: "t17-q11",
          question: "¿Qué son los Impuestos Especiales?",
          options: ["Solo IVA", "Tributos sobre consumos específicos", "Solo patrimonio", "Solo sociedades"],
          correctAnswer: 1,
          explanation: "Son tributos que gravan el consumo de determinados bienes como alcohol, tabaco, hidrocarburos y electricidad."
        },
        {
          id: "t17-q12",
          question: "¿Qué es el hecho imponible?",
          options: ["La multa", "Presupuesto fijado por la ley para configurar el tributo", "Solo el pago", "Solo la liquidación"],
          correctAnswer: 1,
          explanation: "Es el presupuesto fijado por la ley para configurar cada tributo y cuya realización origina el nacimiento de la obligación tributaria."
        },
        {
          id: "t17-q13",
          question: "¿Quién es el sujeto pasivo?",
          options: ["Solo Hacienda", "Obligado tributario que debe cumplir la prestación", "Solo el Estado", "Solo agente"],
          correctAnswer: 1,
          explanation: "Es la persona natural o jurídica que está obligada al cumplimiento de las prestaciones tributarias."
        },
        {
          id: "t17-q14",
          question: "¿Qué es la base imponible?",
          options: ["El tipo de gravamen", "Magnitud dineraria o de otra naturaleza que resulta de medir el hecho imponible", "Solo porcentaje", "Solo cantidad fija"],
          correctAnswer: 1,
          explanation: "Es la magnitud dineraria o de otra naturaleza que resulta de la medición del hecho imponible."
        },
        {
          id: "t17-q15",
          question: "¿Qué es la cuota tributaria?",
          options: ["La base", "Cantidad a ingresar resultante de aplicar el tipo sobre la base", "Solo intereses", "Solo recargos"],
          correctAnswer: 1,
          explanation: "Es la cantidad que resulta de aplicar el tipo de gravamen a la base liquidable."
        },
        {
          id: "t17-q16",
          question: "¿Cuándo nace la obligación tributaria?",
          options: ["Al liquidar", "Cuando se realiza el hecho imponible", "Al pagar", "Al declarar"],
          correctAnswer: 1,
          explanation: "La obligación tributaria nace cuando se realiza el hecho imponible previsto en la ley."
        },
        {
          id: "t17-q17",
          question: "¿Cuándo prescriben las deudas tributarias?",
          options: ["3 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "Prescriben a los cuatro años desde el día siguiente a aquel en que finaliza el plazo reglamentario para presentar la declaración o autoliquidación."
        },
        {
          id: "t17-q18",
          question: "¿Qué es una exención tributaria?",
          options: ["Reducción", "Supresión de la obligación tributaria por ley", "Solo aplazamiento", "Solo fraccionamiento"],
          correctAnswer: 1,
          explanation: "Es la dispensa total o parcial del pago del tributo establecida por ley cuando se realiza el hecho imponible."
        },
        {
          id: "t17-q19",
          question: "¿Qué son los beneficios fiscales?",
          options: ["Solo bonificaciones", "Medidas de apoyo o incentivo establecidas por ley", "Solo deducciones", "Solo exenciones"],
          correctAnswer: 1,
          explanation: "Son incentivos fiscales que establecen ventajas tributarias orientadas al logro de objetivos económicos o sociales."
        },
        {
          id: "t17-q20",
          question: "¿Qué es la gestión tributaria?",
          options: ["Solo recaudación", "Conjunto de actos dirigidos a la aplicación de los tributos", "Solo inspección", "Solo liquidación"],
          correctAnswer: 1,
          explanation: "Comprende todos los actos de la Administración tributaria dirigidos a la aplicación efectiva de los tributos."
        }
      ]
    },
    {
      themeId: "tema-18",
      themeName: "Informática Básica y Ofimática",
      tests: [
        {
          id: "t18-q1",
          question: "¿Qué es un sistema operativo?",
          options: ["Solo aplicación", "Software que gestiona hardware y recursos", "Solo antivirus", "Solo navegador"],
          correctAnswer: 1,
          explanation: "Es el software básico que gestiona los recursos del hardware y proporciona servicios a las aplicaciones."
        },
        {
          id: "t18-q2",
          question: "¿Cuáles son los componentes básicos de un ordenador?",
          options: ["Solo CPU", "CPU, memoria, almacenamiento, entrada/salida", "Solo memoria", "Solo disco duro"],
          correctAnswer: 1,
          explanation: "Los componentes básicos son la unidad central de proceso (CPU), memoria, dispositivos de almacenamiento y periféricos de entrada/salida."
        },
        {
          id: "t18-q3",
          question: "¿Qué es la memoria RAM?",
          options: ["Almacenamiento permanente", "Memoria de acceso aleatorio temporal", "Solo cache", "Solo ROM"],
          correctAnswer: 1,
          explanation: "La RAM es la memoria de acceso aleatorio que almacena temporalmente datos y programas en ejecución."
        },
        {
          id: "t18-q4",
          question: "¿Cuál es la diferencia entre hardware y software?",
          options: ["No hay diferencia", "Hardware es físico, software son programas", "Solo marcas", "Solo precios"],
          correctAnswer: 1,
          explanation: "Hardware son los componentes físicos del ordenador, software son los programas y aplicaciones."
        },
        {
          id: "t18-q5",
          question: "¿Qué es un archivo o fichero?",
          options: ["Solo carpeta", "Conjunto de datos almacenados con un nombre", "Solo programa", "Solo imagen"],
          correctAnswer: 1,
          explanation: "Es una colección de datos almacenados en el sistema con un nombre que permite su identificación."
        },
        {
          id: "t18-q6",
          question: "¿Cuáles son los principales tipos de archivos?",
          options: ["Solo texto", "Texto, imagen, audio, vídeo, ejecutables", "Solo imagen", "Solo ejecutables"],
          correctAnswer: 1,
          explanation: "Los tipos principales incluyen archivos de texto, imagen, audio, vídeo, ejecutables y documentos."
        },
        {
          id: "t18-q7",
          question: "¿Qué es una extensión de archivo?",
          options: ["El tamaño", "Sufijo que indica el tipo de archivo", "Solo nombre", "Solo ubicación"],
          correctAnswer: 1,
          explanation: "Es el sufijo del nombre del archivo que indica su tipo y formato (.txt, .doc, .pdf, etc.)."
        },
        {
          id: "t18-q8",
          question: "¿Qué es Microsoft Word?",
          options: ["Hoja de cálculo", "Procesador de textos", "Base de datos", "Presentaciones"],
          correctAnswer: 1,
          explanation: "Es un procesador de textos que permite crear, editar y formatear documentos."
        },
        {
          id: "t18-q9",
          question: "¿Cuáles son las funciones básicas de Word?",
          options: ["Solo escribir", "Escribir, formatear, insertar objetos, revisar", "Solo imprimir", "Solo guardar"],
          correctAnswer: 1,
          explanation: "Permite escribir texto, aplicar formato, insertar objetos como imágenes y tablas, y revisar ortografía."
        },
        {
          id: "t18-q10",
          question: "¿Qué es Microsoft Excel?",
          options: ["Procesador textos", "Hoja de cálculo", "Base datos", "Presentaciones"],
          correctAnswer: 1,
          explanation: "Es una aplicación de hoja de cálculo que permite organizar datos en filas y columnas y realizar cálculos."
        },
        {
          id: "t18-q11",
          question: "¿Qué es una celda en Excel?",
          options: ["Solo número", "Intersección de fila y columna", "Solo texto", "Solo fórmula"],
          correctAnswer: 1,
          explanation: "Es la intersección de una fila y una columna donde se pueden introducir datos, texto o fórmulas."
        },
        {
          id: "t18-q12",
          question: "¿Qué es una fórmula en Excel?",
          options: ["Solo texto", "Expresión que realiza cálculos", "Solo formato", "Solo gráfico"],
          correctAnswer: 1,
          explanation: "Es una expresión que comienza con = y realiza cálculos utilizando valores de celdas."
        },
        {
          id: "t18-q13",
          question: "¿Qué es Microsoft PowerPoint?",
          options: ["Hoja cálculo", "Programa para crear presentaciones", "Base datos", "Procesador texto"],
          correctAnswer: 1,
          explanation: "Es una aplicación para crear presentaciones con diapositivas que pueden incluir texto, imágenes y multimedia."
        },
        {
          id: "t18-q14",
          question: "¿Qué son los virus informáticos?",
          options: ["Solo errores", "Programas maliciosos que dañan sistemas", "Solo publicidad", "Solo spam"],
          correctAnswer: 1,
          explanation: "Son programas maliciosos diseñados para infectar, dañar o acceder sin autorización a sistemas informáticos."
        },
        {
          id: "t18-q15",
          question: "¿Qué es un antivirus?",
          options: ["Solo limpiador", "Software que detecta y elimina malware", "Solo firewall", "Solo backup"],
          correctAnswer: 1,
          explanation: "Es un software diseñado para detectar, prevenir y eliminar virus y otros tipos de malware."
        },
        {
          id: "t18-q16",
          question: "¿Qué es Internet?",
          options: ["Solo web", "Red mundial de ordenadores interconectados", "Solo email", "Solo redes sociales"],
          correctAnswer: 1,
          explanation: "Es una red global de ordenadores interconectados que permite la comunicación e intercambio de información."
        },
        {
          id: "t18-q17",
          question: "¿Qué es un navegador web?",
          options: ["Solo programa", "Software para acceder y visualizar páginas web", "Solo buscador", "Solo correo"],
          correctAnswer: 1,
          explanation: "Es una aplicación que permite acceder, navegar y visualizar páginas web en Internet."
        },
        {
          id: "t18-q18",
          question: "¿Qué es el correo electrónico?",
          options: ["Solo chat", "Sistema de envío y recepción de mensajes digitales", "Solo archivos", "Solo noticias"],
          correctAnswer: 1,
          explanation: "Es un servicio de red que permite el envío y recepción de mensajes entre usuarios de Internet."
        },
        {
          id: "t18-q19",
          question: "¿Qué es una copia de seguridad (backup)?",
          options: ["Solo duplicar", "Copia de datos para recuperación en caso de pérdida", "Solo archivo", "Solo carpeta"],
          correctAnswer: 1,
          explanation: "Es una copia de datos importantes almacenada por separado para poder recuperarla en caso de pérdida o daño."
        },
        {
          id: "t18-q20",
          question: "¿Qué es la nube (cloud computing)?",
          options: ["Solo internet", "Servicios informáticos a través de internet", "Solo almacenamiento", "Solo software"],
          correctAnswer: 1,
          explanation: "Es la entrega de servicios informáticos como almacenamiento, procesamiento y software a través de Internet."
        }
      ]
    },
    {
      themeId: "tema-19",
      themeName: "Atención al Ciudadano",
      tests: [
        {
          id: "t19-q1",
          question: "¿Cuáles son los principios básicos de la atención al ciudadano?",
          options: ["Solo rapidez", "Respeto, cortesía, eficacia, accesibilidad", "Solo eficiencia", "Solo legalidad"],
          correctAnswer: 1,
          explanation: "Los principios incluyen respeto, cortesía, eficacia, eficiencia, accesibilidad y orientación al ciudadano."
        },
        {
          id: "t19-q2",
          question: "¿Qué es la atención multicanal?",
          options: ["Solo presencial", "Diversos medios de contacto con la administración", "Solo telefónica", "Solo electrónica"],
          correctAnswer: 1,
          explanation: "Es la prestación de servicios a través de múltiples canales: presencial, telefónico, electrónico y postal."
        },
        {
          id: "t19-q3",
          question: "¿Cuáles son los derechos de los ciudadanos en su relación con la Administración?",
          options: ["Solo información", "Información, audiencia, participación, revisión actos", "Solo participación", "Solo quejas"],
          correctAnswer: 1,
          explanation: "Incluyen ser tratados con respeto, obtener información, audiencia en procedimientos, participación y revisión de actos."
        },
        {
          id: "t19-q4",
          question: "¿Qué información debe proporcionarse al ciudadano?",
          options: ["Solo normativa", "Requisitos, documentación, plazos, efectos silencio", "Solo plazos", "Solo contactos"],
          correctAnswer: 1,
          explanation: "Debe informarse sobre requisitos jurídicos y técnicos, documentación, plazos, efectos del silencio y recursos."
        },
        {
          id: "t19-q5",
          question: "¿Qué es el registro de entrada y salida?",
          options: ["Solo archivo", "Sistema de control de documentos", "Solo estadística", "Solo almacén"],
          correctAnswer: 1,
          explanation: "Es el sistema que controla la entrada y salida de documentos en las Administraciones Públicas."
        },
        {
          id: "t19-q6",
          question: "¿Cuáles son los datos obligatorios en un registro?",
          options: ["Solo fecha", "Número, fecha, hora, identificación interesado", "Solo número", "Solo identificación"],
          correctAnswer: 1,
          explanation: "Debe incluir número de entrada, fecha, hora de presentación, identificación del interesado y órgano destinatario."
        },
        {
          id: "t19-q7",
          question: "¿Qué es el silencio administrativo?",
          options: ["No responder", "Efectos que produce la falta de resolución expresa", "Solo retraso", "Solo archivo"],
          correctAnswer: 1,
          explanation: "Son los efectos jurídicos que se producen cuando la Administración no resuelve expresamente en plazo."
        },
        {
          id: "t19-q8",
          question: "¿Cuándo es positivo el silencio administrativo?",
          options: ["Siempre", "En procedimientos iniciados a solicitud del interesado", "Nunca", "Solo en recursos"],
          correctAnswer: 1,
          explanation: "Como regla general, es positivo en procedimientos iniciados a solicitud del interesado, salvo excepciones."
        },
        {
          id: "t19-q9",
          question: "¿Qué son las quejas y sugerencias?",
          options: ["Solo críticas", "Instrumentos de participación ciudadana", "Solo denuncias", "Solo propuestas"],
          correctAnswer: 1,
          explanation: "Son instrumentos de participación que permiten a los ciudadanos expresar disconformidad o proponer mejoras."
        },
        {
          id: "t19-q10",
          question: "¿Cuál es el plazo para responder a quejas y sugerencias?",
          options: ["15 días", "1 mes", "3 meses", "6 meses"],
          correctAnswer: 1,
          explanation: "Las quejas y sugerencias deben ser respondidas en el plazo máximo de un mes."
        },
        {
          id: "t19-q11",
          question: "¿Qué es un procedimiento administrativo?",
          options: ["Solo trámite", "Sucesión ordenada de actos dirigidos a resolver", "Solo documentos", "Solo reuniones"],
          correctAnswer: 1,
          explanation: "Es la sucesión ordenada de actos y trámites dirigidos a la emisión de un acto administrativo."
        },
        {
          id: "t19-q12",
          question: "¿Cuáles son las fases de un procedimiento?",
          options: ["Solo dos", "Iniciación, ordenación, instrucción, finalización", "Solo tres", "Solo iniciación"],
          correctAnswer: 1,
          explanation: "Las fases son iniciación, ordenación, instrucción (incluyendo audiencia) y finalización."
        },
        {
          id: "t19-q13",
          question: "¿Qué es la audiencia al interesado?",
          options: ["Solo información", "Trámite para alegaciones antes de resolver", "Solo citación", "Solo notificación"],
          correctAnswer: 1,
          explanation: "Es el trámite que permite a los interesados conocer el expediente y formular alegaciones antes de la resolución."
        },
        {
          id: "t19-q14",
          question: "¿Cuándo debe otorgarse trámite de audiencia?",
          options: ["Siempre", "Cuando la resolución pueda ser desfavorable", "Nunca", "Solo si se solicita"],
          correctAnswer: 1,
          explanation: "Debe darse cuando los hechos determinantes o la resolución puedan ser desfavorables para los interesados."
        },
        {
          id: "t19-q15",
          question: "¿Qué son las notificaciones administrativas?",
          options: ["Solo cartas", "Actos que ponen en conocimiento resoluciones", "Solo emails", "Solo SMS"],
          correctAnswer: 1,
          explanation: "Son actos administrativos que ponen en conocimiento de los interesados el contenido de resoluciones."
        },
        {
          id: "t19-q16",
          question: "¿Cuál es el plazo para notificar las resoluciones?",
          options: ["5 días", "10 días", "15 días", "20 días"],
          correctAnswer: 1,
          explanation: "Las resoluciones deben notificarse en el plazo máximo de diez días desde su dictado."
        },
        {
          id: "t19-q17",
          question: "¿Qué información debe contener una notificación?",
          options: ["Solo resolución", "Texto íntegro, recursos, plazo, órgano competente", "Solo recursos", "Solo fecha"],
          correctAnswer: 1,
          explanation: "Debe incluir el texto íntegro, los recursos que procedan, plazo para interponerlos y órgano ante el que hacerlo."
        },
        {
          id: "t19-q18",
          question: "¿Qué es la representación en procedimientos administrativos?",
          options: ["Solo abogados", "Actuación en nombre de otro mediante poder", "Solo familiares", "Solo funcionarios"],
          correctAnswer: 1,
          explanation: "Es la facultad de actuar en nombre de otra persona en un procedimiento mediante poder o autorización."
        },
        {
          id: "t19-q19",
          question: "¿Cuándo es obligatoria la asistencia de abogado?",
          options: ["Siempre", "En procedimientos sancionadores con multa superior a 3.005,06€", "Nunca", "Solo en recursos"],
          correctAnswer: 1,
          explanation: "Es obligatoria en procedimientos sancionadores cuando puedan imponerse multas superiores a 3.005,06 euros."
        },
        {
          id: "t19-q20",
          question: "¿Qué es la responsabilidad patrimonial de la Administración?",
          options: ["Solo por culpa", "Obligación de indemnizar daños causados", "Solo dolosa", "Solo contractual"],
          correctAnswer: 1,
          explanation: "Es la obligación de la Administración de indemnizar los daños que cause en sus bienes o derechos, salvo fuerza mayor."
        }
      ]
    },
    {
      themeId: "tema-20",
      themeName: "Gestión de Calidad y Mejora Continua",
      tests: [
        {
          id: "t20-q1",
          question: "¿Qué es la gestión de calidad total?",
          options: ["Solo control", "Filosofía de gestión orientada a satisfacer al cliente", "Solo inspección", "Solo certificación"],
          correctAnswer: 1,
          explanation: "Es una filosofía de gestión que orienta toda la organización hacia la satisfacción del cliente mediante la mejora continua."
        },
        {
          id: "t20-q2",
          question: "¿Cuáles son los principios de la gestión de calidad?",
          options: ["Solo uno", "Enfoque al cliente, liderazgo, participación, enfoque procesos", "Solo dos", "Solo control"],
          correctAnswer: 1,
          explanation: "Los principios incluyen enfoque al cliente, liderazgo, participación del personal, enfoque basado en procesos y mejora continua."
        },
        {
          id: "t20-q3",
          question: "¿Qué es la mejora continua?",
          options: ["Solo cambios grandes", "Actividad recurrente para aumentar la capacidad de cumplir requisitos", "Solo al final", "Solo si hay problemas"],
          correctAnswer: 1,
          explanation: "Es una actividad recurrente para aumentar la capacidad de cumplir los requisitos y mejorar el desempeño."
        },
        {
          id: "t20-q4",
          question: "¿Qué es el ciclo PDCA?",
          options: ["Solo planificar", "Planificar, Hacer, Verificar, Actuar", "Solo hacer", "Solo verificar"],
          correctAnswer: 1,
          explanation: "Es el ciclo de mejora continua: Plan (Planificar), Do (Hacer), Check (Verificar), Act (Actuar)."
        },
        {
          id: "t20-q5",
          question: "¿Qué son los indicadores de calidad?",
          options: ["Solo números", "Medidas cuantitativas del desempeño", "Solo opiniones", "Solo estadísticas"],
          correctAnswer: 1,
          explanation: "Son medidas cuantitativas que permiten evaluar y comparar el desempeño de procesos y servicios."
        },
        {
          id: "t20-q6",
          question: "¿Qué es un proceso?",
          options: ["Solo actividad", "Conjunto de actividades interrelacionadas que transforman entradas en salidas", "Solo procedimiento", "Solo tarea"],
          correctAnswer: 1,
          explanation: "Es un conjunto de actividades mutuamente relacionadas que transforman elementos de entrada en resultados."
        },
        {
          id: "t20-q7",
          question: "¿Cuáles son los tipos de procesos en una organización?",
          options: ["Solo uno", "Estratégicos, operativos, de apoyo", "Solo dos", "Solo operativos"],
          correctAnswer: 1,
          explanation: "Se clasifican en procesos estratégicos (dirección), operativos (misión) y de apoyo (soporte)."
        },
        {
          id: "t20-q8",
          question: "¿Qué es la satisfacción del cliente?",
          options: ["Solo vender", "Percepción del grado de cumplimiento de expectativas", "Solo calidad", "Solo precio"],
          correctAnswer: 1,
          explanation: "Es la percepción del cliente sobre el grado en que se han cumplido sus requisitos y expectativas."
        },
        {
          id: "t20-q9",
          question: "¿Cómo se mide la satisfacción del cliente?",
          options: ["Solo quejas", "Encuestas, entrevistas, análisis quejas, indicadores", "Solo ventas", "Solo tiempo"],
          correctAnswer: 1,
          explanation: "Se puede medir mediante encuestas, entrevistas, análisis de quejas y sugerencias, e indicadores de desempeño."
        },
        {
          id: "t20-q10",
          question: "¿Qué es un sistema de gestión de calidad?",
          options: ["Solo documentos", "Sistema para dirigir y controlar organización respecto a calidad", "Solo certificados", "Solo auditorías"],
          correctAnswer: 1,
          explanation: "Es un sistema de gestión para dirigir y controlar una organización con respecto a la calidad."
        },
        {
          id: "t20-q11",
          question: "¿Qué es la norma ISO 9001?",
          options: ["Solo certificación", "Estándar internacional para sistemas de gestión de calidad", "Solo auditoria", "Solo documentación"],
          correctAnswer: 1,
          explanation: "Es un estándar internacional que especifica los requisitos para un sistema de gestión de la calidad."
        },
        {
          id: "t20-q12",
          question: "¿Cuáles son los beneficios de la certificación ISO 9001?",
          options: ["Solo imagen", "Mejora procesos, satisfacción cliente, eficiencia", "Solo marketing", "Solo ventas"],
          correctAnswer: 1,
          explanation: "Incluye mejora de procesos, mayor satisfacción del cliente, eficiencia operativa y ventaja competitiva."
        },
        {
          id: "t20-q13",
          question: "¿Qué es una auditoría de calidad?",
          options: ["Solo inspección", "Proceso sistemático para obtener evidencias y evaluarlas", "Solo control", "Solo verificación"],
          correctAnswer: 1,
          explanation: "Es un proceso sistemático, independiente y documentado para obtener evidencias y evaluarlas objetivamente."
        },
        {
          id: "t20-q14",
          question: "¿Cuáles son los tipos de auditorías?",
          options: ["Solo interna", "Interna, externa, de certificación", "Solo externa", "Solo de producto"],
          correctAnswer: 1,
          explanation: "Se clasifican en auditorías internas (primera parte), externas a proveedores (segunda parte) y de certificación (tercera parte)."
        },
        {
          id: "t20-q15",
          question: "¿Qué es la gestión por procesos?",
          options: ["Solo documentar", "Enfoque de gestión que ve la organización como sistema de procesos", "Solo controlar", "Solo mejorar"],
          correctAnswer: 1,
          explanation: "Es un enfoque de gestión que considera la organización como un sistema de procesos interrelacionados."
        },
        {
          id: "t20-q16",
          question: "¿Qué es un mapa de procesos?",
          options: ["Solo diagrama", "Representación gráfica de procesos y sus interrelaciones", "Solo lista", "Solo flowchart"],
          correctAnswer: 1,
          explanation: "Es una representación gráfica de los procesos de la organización y sus interrelaciones."
        },
        {
          id: "t20-q17",
          question: "¿Qué son las no conformidades?",
          options: ["Solo errores", "Incumplimiento de requisitos especificados", "Solo defectos", "Solo problemas"],
          correctAnswer: 1,
          explanation: "Son incumplimientos de un requisito especificado en el sistema de gestión o en el producto/servicio."
        },
        {
          id: "t20-q18",
          question: "¿Qué es una acción correctiva?",
          options: ["Solo arreglar", "Acción para eliminar la causa de una no conformidad", "Solo reparar", "Solo cambiar"],
          correctAnswer: 1,
          explanation: "Es una acción tomada para eliminar la causa de una no conformidad detectada u otra situación indeseable."
        },
        {
          id: "t20-q19",
          question: "¿Qué es una acción preventiva?",
          options: ["Solo evitar", "Acción para eliminar la causa de una no conformidad potencial", "Solo proteger", "Solo planificar"],
          correctAnswer: 1,
          explanation: "Es una acción tomada para eliminar la causa de una no conformidad potencial u otra situación potencialmente indeseable."
        },
        {
          id: "t20-q20",
          question: "¿Qué es el benchmarking?",
          options: ["Solo comparar", "Proceso de comparación con mejores prácticas", "Solo medir", "Solo evaluar"],
          correctAnswer: 1,
          explanation: "Es el proceso continuo de comparar productos, servicios y prácticas con los mejores competidores o líderes reconocidos."
        }
      ]
    }
  ],

  "guardia-civil": [
    {
      themeId: "tema-1",
      themeName: "Organización de la Guardia Civil",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuándo se fundó la Guardia Civil?",
          options: ["1844", "1845", "1846", "1847"],
          correctAnswer: 0,
          explanation: "La Guardia Civil fue fundada el 13 de mayo de 1844 por el Duque de Ahumada."
        },
        {
          id: "t1-q2",
          question: "¿Quién fue el fundador de la Guardia Civil?",
          options: ["Francisco Javier Girón", "Duque de Ahumada", "General Narváez", "General Espartero"],
          correctAnswer: 1,
          explanation: "El Duque de Ahumada (Francisco Javier Girón) fue el fundador de la Guardia Civil."
        },
        {
          id: "t1-q3",
          question: "¿Cuál es el lema de la Guardia Civil?",
          options: ["Honor y Patria", "El honor es mi divisa", "Servir y proteger", "Guardia y custodia"],
          correctAnswer: 1,
          explanation: "El lema tradicional de la Guardia Civil es 'El honor es mi divisa'."
        },
        {
          id: "t1-q4",
          question: "¿De qué ministerio depende la Guardia Civil?",
          options: ["Ministerio de Defensa", "Ministerio del Interior", "Ministerio de Justicia", "Presidencia del Gobierno"],
          correctAnswer: 1,
          explanation: "La Guardia Civil depende del Ministerio del Interior para funciones de seguridad ciudadana."
        },
        {
          id: "t1-q5",
          question: "¿Cuál es la estructura territorial básica de la Guardia Civil?",
          options: ["Zonas, Comandancias y Puestos", "Regiones, Provincias y Municipios", "Áreas, Sectores y Unidades", "Demarcaciones, Jefaturas y Destacamentos"],
          correctAnswer: 0,
          explanation: "La Guardia Civil se estructura territorialmente en Zonas, Comandancias y Puestos."
        },
        {
          id: "t1-q6",
          question: "¿Cuántas Zonas de la Guardia Civil existen en España?",
          options: ["10", "11", "12", "13"],
          correctAnswer: 1,
          explanation: "España está dividida en 11 Zonas de la Guardia Civil para su organización territorial."
        },
        {
          id: "t1-q7",
          question: "¿Qué rango ostenta el Jefe de una Comandancia de la Guardia Civil?",
          options: ["Teniente Coronel", "Coronel", "General de Brigada", "Comandante"],
          correctAnswer: 1,
          explanation: "Las Comandancias de la Guardia Civil están al mando de un Coronel."
        },
        {
          id: "t1-q8",
          question: "¿Cuál fue el primer nombre de la Guardia Civil?",
          options: ["Cuerpo de Guardias Civiles", "Guardia Rural", "Fuerza Pública", "Cuerpo de Carabineros"],
          correctAnswer: 0,
          explanation: "Inicialmente se denominó Cuerpo de Guardias Civiles antes de adoptar el nombre actual."
        },
        {
          id: "t1-q9",
          question: "¿En qué año se creó la primera Escuela de la Guardia Civil?",
          options: ["1845", "1847", "1850", "1853"],
          correctAnswer: 1,
          explanation: "La primera Escuela de la Guardia Civil se estableció en 1847 en Valdemoro."
        },
        {
          id: "t1-q10",
          question: "¿Cuál es el himno oficial de la Guardia Civil?",
          options: ["El Novio de la Muerte", "Soy Soldado", "Himno de la Guardia Civil", "Marcha Granadera"],
          correctAnswer: 2,
          explanation: "El 'Himno de la Guardia Civil' es la canción oficial del cuerpo."
        },
        {
          id: "t1-q11",
          question: "¿Qué documento fundacional estableció la Guardia Civil?",
          options: ["Real Decreto del 13 de mayo de 1844", "Ley de 28 de marzo de 1844", "Real Orden de mayo de 1844", "Decreto-Ley de 1844"],
          correctAnswer: 0,
          explanation: "El Real Decreto del 13 de mayo de 1844 estableció oficialmente la Guardia Civil."
        },
        {
          id: "t1-q12",
          question: "¿Cuál era el objetivo principal al crear la Guardia Civil?",
          options: ["Defensa nacional", "Protección de caminos y despoblados", "Control urbano", "Vigilancia de costas"],
          correctAnswer: 1,
          explanation: "La Guardia Civil se creó principalmente para proteger los caminos y despoblados del bandolerismo."
        },
        {
          id: "t1-q13",
          question: "¿Cómo se denomina la unidad básica de la Guardia Civil?",
          options: ["Puesto", "Destacamento", "Compañía", "Escuadrón"],
          correctAnswer: 0,
          explanation: "El Puesto es la unidad básica y más pequeña de la Guardia Civil."
        },
        {
          id: "t1-q14",
          question: "¿Cuántos guardias civiles componían inicialmente el cuerpo?",
          options: ["5.000", "6.000", "7.000", "8.000"],
          correctAnswer: 0,
          explanation: "Inicialmente la Guardia Civil se componía de aproximadamente 5.000 guardias."
        },
        {
          id: "t1-q15",
          question: "¿Qué características tenía el uniforme original de la Guardia Civil?",
          options: ["Azul marino", "Verde oliva", "Gris con tricornio", "Marrón"],
          correctAnswer: 2,
          explanation: "El uniforme original era gris con el característico tricornio."
        },
        {
          id: "t1-q16",
          question: "¿Qué cargo ocupaba el Duque de Ahumada cuando fundó la Guardia Civil?",
          options: ["Ministro de Gobernación", "Inspector General", "Director General", "Capitán General"],
          correctAnswer: 2,
          explanation: "El Duque de Ahumada fue el primer Director General de la Guardia Civil."
        },
        {
          id: "t1-q17",
          question: "¿En qué siglo se estableció definitivamente el actual sistema organizativo?",
          options: ["XVIII", "XIX", "XX", "XXI"],
          correctAnswer: 1,
          explanation: "El sistema organizativo de la Guardia Civil se estableció en el siglo XIX."
        },
        {
          id: "t1-q18",
          question: "��Qué instrumento normativo regula actualmente la organización de la Guardia Civil?",
          options: ["Ley Orgánica 2/1986", "Real Decreto 1428/2003", "Ley 29/2014", "RD 1075/2015"],
          correctAnswer: 2,
          explanation: "La Ley 29/2014 de régimen del personal de la Guardia Civil regula su organización actual."
        },
        {
          id: "t1-q19",
          question: "¿Cuál es la divisa que caracteriza a los oficiales de la Guardia Civil?",
          options: ["Estrella", "Rombo", "Águila", "Corona"],
          correctAnswer: 1,
          explanation: "El rombo es la divisa característica de los oficiales de la Guardia Civil."
        },
        {
          id: "t1-q20",
          question: "¿Dónde tiene su sede la Dirección General de la Guardia Civil?",
          options: ["El Pardo", "Madrid", "Toledo", "Valdemoro"],
          correctAnswer: 1,
          explanation: "La Dirección General de la Guardia Civil tiene su sede en Madrid."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Funciones y Competencias",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuáles son las principales funciones de la Guardia Civil?",
          options: ["Solo seguridad ciudadana", "Seguridad ciudadana y tráfico", "Seguridad ciudadana, tráfico y medio ambiente", "Solo investigación criminal"],
          correctAnswer: 2,
          explanation: "La Guardia Civil tiene competencias en seguridad ciudadana, tráfico, medio ambiente, entre otras."
        },
        {
          id: "t2-q2",
          question: "¿Qué es el SEPRONA?",
          options: ["Servicio de Protección de la Naturaleza", "Servicio de Protección Naval", "Servicio Especial de Protección", "Servicio de Prevención de Accidentes"],
          correctAnswer: 0,
          explanation: "SEPRONA es el Servicio de Protección de la Naturaleza de la Guardia Civil."
        },
        {
          id: "t2-q3",
          question: "¿En qué ámbito geográfico actúa principalmente la Guardia Civil?",
          options: ["Solo en ciudades", "��mbito rural y carreteras", "Solo en fronteras", "Solo en puertos"],
          correctAnswer: 1,
          explanation: "La Guardia Civil actúa principalmente en el ámbito rural y en las carreteras."
        },
        {
          id: "t2-q4",
          question: "¿Qué es la UCO?",
          options: ["Unidad Central Operativa", "Unidad de Coordinación Operacional", "Unidad Central de Organización", "Unidad de Control Operativo"],
          correctAnswer: 0,
          explanation: "La UCO es la Unidad Central Operativa, especializada en investigación de delitos graves."
        },
        {
          id: "t2-q5",
          question: "¿Cuál es la función del GAR?",
          options: ["Guardia de Asalto y Rescate", "Grupo de Acción Rápida", "Guardia Aérea de Rescate", "Grupo de Apoyo Rural"],
          correctAnswer: 1,
          explanation: "El GAR es el Grupo de Acción Rápida, unidad de élite de la Guardia Civil."
        },
        {
          id: "t2-q6",
          question: "¿Qué es la ATGC?",
          options: ["Agrupación de Tráfico de la Guardia Civil", "Asociación de Técnicos de la Guardia Civil", "Agencia de Telecomunicaciones", "Archivo Técnico"],
          correctAnswer: 0,
          explanation: "La ATGC es la Agrupación de Tráfico de la Guardia Civil, encargada de la seguridad vial."
        },
        {
          id: "t2-q7",
          question: "¿En qué consiste el servicio de policía judicial de la Guardia Civil?",
          options: ["Solo investigación", "Auxilio a tribunales y juzgados", "Control de orden público", "Vigilancia urbana"],
          correctAnswer: 1,
          explanation: "Como policía judicial, la Guardia Civil auxilia a los tribunales y juzgados en la investigación de delitos."
        },
        {
          id: "t2-q8",
          question: "¿Qué función cumple la Guardia Civil en el control de armas?",
          options: ["Solo fabricación", "Intervención e investigación", "Solo importación", "Control de uso deportivo"],
          correctAnswer: 1,
          explanation: "La Guardia Civil interviene en el control, investigación e inspección relacionada con armas."
        },
        {
          id: "t2-q9",
          question: "¿Qué es la Unidad Fiscal?",
          options: ["Control de impuestos", "Lucha contra el contrabando", "Auditoría contable", "Gestión presupuestaria"],
          correctAnswer: 1,
          explanation: "La Unidad Fiscal de la Guardia Civil se dedica a la lucha contra el contrabando y delitos fiscales."
        },
        {
          id: "t2-q10",
          question: "¿En qué ámbito actúa la Guardia Civil como policía administrativa?",
          options: ["Solo sancionador", "Inspección y vigilancia del cumplimiento normativo", "Solo expedientes", "Gestión documental"],
          correctAnswer: 1,
          explanation: "Como policía administrativa inspecciona y vigila el cumplimiento de normativas específicas."
        },
        {
          id: "t2-q11",
          question: "¿Qué competencias tiene la Guardia Civil en puertos y aeropuertos?",
          options: ["Solo documentación", "Seguridad y control fronterizo", "Solo equipajes", "Gestión comercial"],
          correctAnswer: 1,
          explanation: "En puertos y aeropuertos ejerce funciones de seguridad y control fronterizo."
        },
        {
          id: "t2-q12",
          question: "¿Qué es el Servicio de Información?",
          options: ["Archivo documental", "Obtención y análisis de información para seguridad", "Comunicaciones", "Relaciones públicas"],
          correctAnswer: 1,
          explanation: "El Servicio de Información obtiene y analiza información relevante para la seguridad."
        },
        {
          id: "t2-q13",
          question: "¿En qué consisten las funciones de seguridad rural?",
          options: ["Solo agricultura", "Protección en despoblados y vías interurbanas", "Control ganadero", "Gestión forestal"],
          correctAnswer: 1,
          explanation: "La seguridad rural incluye la protección en despoblados y vías interurbanas."
        },
        {
          id: "t2-q14",
          question: "¿Qué papel juega la Guardia Civil en la protección civil?",
          options: ["Solo observación", "Participación activa en emergencias", "Solo coordinación", "Gestión administrativa"],
          correctAnswer: 1,
          explanation: "La Guardia Civil participa activamente en operaciones de protección civil y emergencias."
        },
        {
          id: "t2-q15",
          question: "¿Qué funciones desarrolla en materia de extranjería?",
          options: ["Solo fronteras", "Control, investigación y tramitación", "Solo deportaciones", "Gestión de visados"],
          correctAnswer: 1,
          explanation: "En extranjería realiza control, investigación y tramitación de expedientes."
        },
        {
          id: "t2-q16",
          question: "¿Cuál es el ámbito de actuación territorial preferente?",
          options: ["Urbano", "Rural y vías interurbanas", "Industrial", "Turístico"],
          correctAnswer: 1,
          explanation: "Su ámbito preferente es el rural y las vías interurbanas, aunque puede actuar en cualquier lugar."
        },
        {
          id: "t2-q17",
          question: "¿Qué función tiene en la custodia de edificios oficiales?",
          options: ["Solo limpieza", "Seguridad y protección", "Gestión administrativa", "Mantenimiento"],
          correctAnswer: 1,
          explanation: "La Guardia Civil proporciona seguridad y protección a determinados edificios oficiales."
        },
        {
          id: "t2-q18",
          question: "¿En qué casos puede actuar en núcleos urbanos?",
          options: ["Nunca", "Cuando lo solicite la autoridad competente", "Solo emergencias", "Solo delitos graves"],
          correctAnswer: 1,
          explanation: "Puede actuar en núcleos urbanos cuando lo solicite la autoridad competente o por necesidades del servicio."
        },
        {
          id: "t2-q19",
          question: "¿Qué es la Intervención de Armas?",
          options: ["Fabricación", "Control y supervisi��n del régimen de armas", "Venta", "Reparación"],
          correctAnswer: 1,
          explanation: "La Intervención de Armas se encarga del control y supervisión del régimen jurídico de armas."
        },
        {
          id: "t2-q20",
          question: "¿Cuál es su función en el Plan Nacional de Drogas?",
          options: ["Solo prevención", "Investigación y represión del tráfico", "Solo educación", "Gestión sanitaria"],
          correctAnswer: 1,
          explanation: "Participa en la investigación y represión del tráfico de drogas dentro del Plan Nacional."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Normativa y Procedimientos",
      tests: [
        {
          id: "t3-q1",
          question: "¿Qué ley orgánica regula las Fuerzas y Cuerpos de Seguridad?",
          options: ["LO 1/1992", "LO 2/1986", "LO 15/1999", "LO 4/2015"],
          correctAnswer: 1,
          explanation: "La Ley Orgánica 2/1986 regula las Fuerzas y Cuerpos de Seguridad del Estado."
        },
        {
          id: "t3-q2",
          question: "¿Cuándo se puede proceder a una identificación?",
          options: ["Solo con orden judicial", "Cuando existan indicios racionales de criminalidad", "Solo en flagrante delito", "Nunca sin autorización"],
          correctAnswer: 1,
          explanation: "Se puede identificar cuando existan indicios racionales de que la persona puede haber cometido un delito."
        },
        {
          id: "t3-q3",
          question: "¿Cuál es el plazo máximo de detención preventiva?",
          options: ["24 horas", "48 horas", "72 horas", "96 horas"],
          correctAnswer: 2,
          explanation: "El plazo máximo de detención preventiva es de 72 horas, salvo en casos de terrorismo."
        },
        {
          id: "t3-q4",
          question: "¿Qué es un atestado?",
          options: ["Un documento administrativo", "Un documento policial sobre hechos delictivos", "Una multa", "Un informe médico"],
          correctAnswer: 1,
          explanation: "El atestado es el documento policial que recoge la investigación de hechos delictivos."
        },
        {
          id: "t3-q5",
          question: "¿Cuándo es obligatorio informar de los derechos al detenido?",
          options: ["Solo si lo pide", "Inmediatamente tras la detención", "Al llegar al cuartel", "Solo ante el juez"],
          correctAnswer: 1,
          explanation: "Los derechos del detenido deben ser informados de forma inmediata tras la detención."
        }
      ]
    },
    {
      themeId: "tema-4",
      themeName: "Constitución Española de 1978",
      tests: [
        {
          id: "t4-q1",
          question: "¿En qué año se aprobó la Constitución Española?",
          options: ["1976", "1977", "1978", "1979"],
          correctAnswer: 2,
          explanation: "La Constitución Española fue aprobada en referéndum el 6 de diciembre de 1978."
        },
        {
          id: "t4-q2",
          question: "¿Cuántos artículos tiene la Constitución Española?",
          options: ["165", "169", "172", "175"],
          correctAnswer: 1,
          explanation: "La Constitución Española tiene 169 artículos distribuidos en un Preámbulo, un Título Preliminar y diez T��tulos."
        },
        {
          id: "t4-q3",
          question: "¿Cuál es la capital del Estado español según la Constitución?",
          options: ["Madrid", "Barcelona", "Sevilla", "Valencia"],
          correctAnswer: 0,
          explanation: "El artículo 5 de la Constitución establece que la capital del Estado es la villa de Madrid."
        },
        {
          id: "t4-q4",
          question: "¿Qué mayoría se requiere para reformar la Constitución por el procedimiento agravado?",
          options: ["Mayoría simple", "Mayoría absoluta", "Dos tercios", "Tres quintos"],
          correctAnswer: 2,
          explanation: "Para la reforma por el procedimiento agravado se requiere una mayoría de dos tercios de cada Cámara."
        },
        {
          id: "t4-q5",
          question: "¿Cuál es la forma política del Estado español?",
          options: ["República Federal", "Monarqu��a Absoluta", "Monarquía Parlamentaria", "República Parlamentaria"],
          correctAnswer: 2,
          explanation: "España se constituye en un Estado social y democrático de Derecho, que propugna como forma política la Monarquía parlamentaria."
        }
      ]
    },
    {
      themeId: "tema-5",
      themeName: "Código Penal - Parte General",
      tests: [
        {
          id: "t5-q1",
          question: "¿Cuándo entró en vigor el actual Código Penal?",
          options: ["1995", "1996", "1997", "1998"],
          correctAnswer: 0,
          explanation: "El Código Penal actual (Ley Orgánica 10/1995) entró en vigor el 24 de mayo de 1996."
        },
        {
          id: "t5-q2",
          question: "¿Cuáles son los elementos del delito?",
          options: ["Tipicidad y culpabilidad", "Tipicidad, antijuridicidad y culpabilidad", "Acción y resultado", "Dolo y culpa"],
          correctAnswer: 1,
          explanation: "Los elementos del delito son la tipicidad, antijuridicidad y culpabilidad."
        },
        {
          id: "t5-q3",
          question: "¿Qué es el dolo?",
          options: ["Error de tipo", "Conocimiento y voluntad", "Negligencia grave", "Caso fortuito"],
          correctAnswer: 1,
          explanation: "El dolo es el conocimiento y voluntad de realizar los elementos objetivos del tipo penal."
        },
        {
          id: "t5-q4",
          question: "¿A partir de qué edad se es responsable penalmente?",
          options: ["14 años", "16 años", "18 a��os", "21 años"],
          correctAnswer: 2,
          explanation: "La responsabilidad penal se adquiere a los 18 años de edad."
        },
        {
          id: "t5-q5",
          question: "¿Qué son las circunstancias atenuantes?",
          options: ["Eliminan la pena", "Reducen la pena", "Aumentan la pena", "No afectan la pena"],
          correctAnswer: 1,
          explanation: "Las circunstancias atenuantes permiten reducir la pena en grado."
        }
      ]
    },
    {
      themeId: "tema-6",
      themeName: "Delitos contra las Personas",
      tests: [
        {
          id: "t6-q1",
          question: "¿Cuál es la pena del delito de homicidio?",
          options: ["10 a 15 años", "15 a 20 años", "20 a 25 años", "15 años y un día a 20 años"],
          correctAnswer: 0,
          explanation: "El homicidio se castiga con pena de prisión de 10 a 15 años."
        },
        {
          id: "t6-q2",
          question: "¿Qué diferencia el asesinato del homicidio?",
          options: ["La pena", "La existencia de circunstancias agravantes específicas", "El resultado", "La víctima"],
          correctAnswer: 1,
          explanation: "El asesinato incluye circunstancias como alevosía, ensañamiento, precio o recompensa."
        },
        {
          id: "t6-q3",
          question: "¿Qué es la alevosía?",
          options: ["Actuar con crueldad", "Asegurar la ejecución sin riesgo", "Matar por dinero", "Causar sufrimiento"],
          correctAnswer: 1,
          explanation: "La alevosía consiste en emplear medios que tiendan a asegurar la ejecuci��n sin riesgo para el agresor."
        },
        {
          id: "t6-q4",
          question: "¿Cuándo se considera delito de lesiones?",
          options: ["Siempre que se cause daño", "Cuando se requiere tratamiento médico", "Solo si hay hospitalización", "Cuando se causa deformidad"],
          correctAnswer: 1,
          explanation: "Constituye delito de lesiones cuando se menoscaba la integridad corporal o salud física o mental."
        },
        {
          id: "t6-q5",
          question: "¿Qué es el delito de amenazas?",
          options: ["Causar daño físico", "Anunciar un mal futuro", "Intimidar con gestos", "Gritar a alguien"],
          correctAnswer: 1,
          explanation: "Las amenazas consisten en anunciar a alguien un mal constitutivo de delito."
        }
      ]
    },
    {
      themeId: "tema-7",
      themeName: "Delitos contra el Patrimonio",
      tests: [
        {
          id: "t7-q1",
          question: "¿Cu��l es el elemento distintivo del hurto?",
          options: ["Violencia", "Intimidación", "Furtividad", "Engaño"],
          correctAnswer: 2,
          explanation: "El hurto se caracteriza por tomar las cosas ajenas sin violencia o intimidaci��n."
        },
        {
          id: "t7-q2",
          question: "¿Qué diferencia el robo del hurto?",
          options: ["El valor", "La violencia o intimidación", "El lugar", "La víctima"],
          correctAnswer: 1,
          explanation: "El robo implica violencia o intimidación en las personas o fuerza en las cosas."
        },
        {
          id: "t7-q3",
          question: "¿Cuándo es delito el hurto?",
          options: ["Siempre", "Cuando supera 400 euros", "Cuando supera 1000 euros", "Solo en establecimientos"],
          correctAnswer: 1,
          explanation: "El hurto es delito cuando el valor de lo sustraído excede de 400 euros."
        },
        {
          id: "t7-q4",
          question: "¿Qué es la estafa?",
          options: ["Tomar algo sin permiso", "Engañar para obtener beneficio", "Amenazar para conseguir dinero", "Falsificar documentos"],
          correctAnswer: 1,
          explanation: "La estafa consiste en obtener beneficio patrimonial mediante engaño."
        },
        {
          id: "t7-q5",
          question: "¿Qué es la apropiación indebida?",
          options: ["Hurtar en casa", "No devolver lo recibido legítimamente", "Robar con violencia", "Engañar al vendedor"],
          correctAnswer: 1,
          explanation: "Apropiación indebida es apropiarse de dinero o cosas recibidas en depósito, comisión o administración."
        }
      ]
    },
    {
      themeId: "tema-8",
      themeName: "Ley de Seguridad Ciudadana",
      tests: [
        {
          id: "t8-q1",
          question: "¿Qué ley regula la seguridad ciudadana actualmente?",
          options: ["Ley 1/1992", "Ley 4/2015", "Ley 23/1992", "Ley 5/2014"],
          correctAnswer: 1,
          explanation: "La Ley Orgánica 4/2015 de Protección de la Seguridad Ciudadana regula esta materia."
        },
        {
          id: "t8-q2",
          question: "¿Cuándo se puede identificar a una persona?",
          options: ["Siempre", "Solo con orden judicial", "Cuando existan indicios racionales", "Solo en comisaría"],
          correctAnswer: 2,
          explanation: "Se puede identificar cuando existan indicios racionales de comisión de infracción."
        },
        {
          id: "t8-q3",
          question: "¿Qué es una infracción muy grave?",
          options: ["Multa de 100€", "Multa de 601 a 30.000€", "Multa de 30.001 a 600.000€", "Prisión"],
          correctAnswer: 2,
          explanation: "Las infracciones muy graves se sancionan con multa de 30.001 a 600.000 euros."
        },
        {
          id: "t8-q4",
          question: "¿Qué documentos sirven para identificarse?",
          options: ["Solo DNI", "DNI, pasaporte o permiso de conducir", "Cualquier documento", "Solo documentos oficiales"],
          correctAnswer: 1,
          explanation: "Sirven para identificarse el DNI, pasaporte, permiso de conducir o documento equivalente."
        },
        {
          id: "t8-q5",
          question: "¿Cuándo se puede cachear a una persona?",
          options: ["Siempre", "Con su consentimiento o indicios de peligro", "Solo con orden judicial", "Solo en comisaría"],
          correctAnswer: 1,
          explanation: "El cacheo requiere consentimiento de la persona o indicios de que porta objetos peligrosos."
        }
      ]
    },
    {
      themeId: "tema-9",
      themeName: "Código de la Circulación",
      tests: [
        {
          id: "t9-q1",
          question: "¿Qué real decreto aprueba el Código de la Circulación?",
          options: ["RD 1428/2003", "RD 1598/2004", "RD 6/2015", "RD 818/2009"],
          correctAnswer: 0,
          explanation: "El RD 1428/2003 aprueba el Reglamento General de Circulación."
        },
        {
          id: "t9-q2",
          question: "¿Cuál es la velocidad máxima en autopista?",
          options: ["100 km/h", "110 km/h", "120 km/h", "130 km/h"],
          correctAnswer: 2,
          explanation: "La velocidad máxima en autopistas es de 120 km/h para turismos."
        },
        {
          id: "t9-q3",
          question: "¿Cuándo es obligatorio el uso del cinturón?",
          options: ["Solo en autopista", "En vías urbanas", "Siempre", "Solo de noche"],
          correctAnswer: 2,
          explanation: "El uso del cinturón de seguridad es obligatorio en todas las vías."
        },
        {
          id: "t9-q4",
          question: "¿Qué tasa de alcohol máxima pueden tener los conductores noveles?",
          options: ["0,15 mg/l", "0,25 mg/l", "0,30 mg/l", "0,50 mg/l"],
          correctAnswer: 0,
          explanation: "Los conductores noveles no pueden superar 0,15 mg/l de alcohol en aire espirado."
        },
        {
          id: "t9-q5",
          question: "¿Cuántos puntos se pierden por conducir usando el móvil?",
          options: ["2 puntos", "3 puntos", "4 puntos", "6 puntos"],
          correctAnswer: 1,
          explanation: "Usar el teléfono móvil mientras se conduce supone la pérdida de 3 puntos."
        }
      ]
    },
    {
      themeId: "tema-10",
      themeName: "Ley de Extranjería",
      tests: [
        {
          id: "t10-q1",
          question: "¿Qué ley regula los derechos y libertades de los extranjeros?",
          options: ["LO 2/2009", "LO 4/2000", "LO 8/2015", "LO 14/2013"],
          correctAnswer: 1,
          explanation: "La LO 4/2000, reformada por LO 2/2009, regula los derechos y libertades de los extranjeros en España."
        },
        {
          id: "t10-q2",
          question: "¿Cuánto tiempo pueden permanecer los turistas extranjeros sin visado?",
          options: ["30 días", "60 días", "90 días", "180 días"],
          correctAnswer: 2,
          explanation: "Los extranjeros pueden permanecer en España como turistas hasta 90 días en un período de 180 días."
        },
        {
          id: "t10-q3",
          question: "¿Qué es el NIE?",
          options: ["Número de la Seguridad Social", "Número de Identificación de Extranjero", "Permiso de trabajo", "Tarjeta de residencia"],
          correctAnswer: 1,
          explanation: "El NIE es el Número de Identificación de Extranjero, necesario para cualquier gestión en España."
        },
        {
          id: "t10-q4",
          question: "¿Cuándo se puede expulsar a un extranjero?",
          options: ["Siempre", "Solo por delitos graves", "Por estancia irregular o infracciones graves", "Solo con orden judicial"],
          correctAnswer: 2,
          explanation: "Se puede expulsar por estancia irregular o comisión de infracciones graves previstas en la ley."
        },
        {
          id: "t10-q5",
          question: "¿Qué derechos tienen los extranjeros menores de edad?",
          options: ["Solo educación", "Los mismos que los españoles", "Solo sanidad", "Derechos limitados"],
          correctAnswer: 1,
          explanation: "Los extranjeros menores de edad tienen los mismos derechos que los menores españoles."
        }
      ]
    },
    {
      themeId: "tema-11",
      themeName: "Ley de Violencia de Género",
      tests: [
        {
          id: "t11-q1",
          question: "¿Qué ley regula la violencia de género?",
          options: ["LO 1/2004", "LO 3/2007", "LO 8/2015", "LO 10/2022"],
          correctAnswer: 0,
          explanation: "La LO 1/2004 de Medidas de Protección Integral contra la Violencia de Género."
        },
        {
          id: "t11-q2",
          question: "¿Qué es violencia de género según la ley?",
          options: ["Cualquier agresión", "Violencia del hombre hacia la mujer por su condición", "Solo violencia física", "Violencia en pareja"],
          correctAnswer: 1,
          explanation: "Es la violencia que se ejerce sobre las mujeres por parte de quienes sean o hayan sido sus cónyuges o parejas."
        },
        {
          id: "t11-q3",
          question: "¿Qué son las órdenes de protección?",
          options: ["Medidas policiales", "Medidas judiciales de protección", "Servicios sociales", "Ayudas económicas"],
          correctAnswer: 1,
          explanation: "Las órdenes de protección son medidas judiciales para proteger a las víctimas de violencia de g��nero."
        },
        {
          id: "t11-q4",
          question: "¿Cuándo se agravan las penas por violencia de género?",
          options: ["Nunca", "Siempre", "Cuando la víctima es esposa o pareja", "Solo en casos graves"],
          correctAnswer: 2,
          explanation: "Se agravan las penas cuando la víctima sea o haya sido esposa o mujer ligada por relación de afectividad."
        },
        {
          id: "t11-q5",
          question: "¿Qué teléfono de atenci��n existe para violencia de género?",
          options: ["112", "016", "091", "900123123"],
          correctAnswer: 1,
          explanation: "El teléfono 016 ofrece información y asesoramiento jurídico sobre violencia de género."
        }
      ]
    },
    {
      themeId: "tema-12",
      themeName: "Normativa de Armas",
      tests: [
        {
          id: "t12-q1",
          question: "¿Qué ley regula las armas en España?",
          options: ["Ley 23/1992", "RD 137/1993", "Ley 1/1992", "RD 563/2017"],
          correctAnswer: 0,
          explanation: "La Ley 23/1992 de Seguridad Privada incluye la normativa sobre armas, desarrollada por el RD 137/1993."
        },
        {
          id: "t12-q2",
          question: "¿Qué categorías de armas existen?",
          options: ["2 categorías", "4 categorías", "6 categorías", "8 categorías"],
          correctAnswer: 2,
          explanation: "Existen 6 categorías de armas: A, B, C, D, E y F según su peligrosidad y uso."
        },
        {
          id: "t12-q3",
          question: "¿Quién puede autorizar la tenencia de armas?",
          options: ["Alcalde", "Gobernador Civil", "Guardia Civil", "Jefe de Policía"],
          correctAnswer: 2,
          explanation: "La Guardia Civil es competente para autorizar la tenencia y porte de armas."
        },
        {
          id: "t12-q4",
          question: "¿Cuánto tiempo es válida la licencia de armas?",
          options: ["2 años", "3 años", "5 años", "10 años"],
          correctAnswer: 2,
          explanation: "La licencia de armas tipo B tiene una validez de 5 años."
        },
        {
          id: "t12-q5",
          question: "¿Qué requisitos se necesitan para obtener licencia de armas?",
          options: ["Solo ser mayor de edad", "Ser mayor, carecer de antecedentes y aptitud", "Solo carecer de antecedentes", "No hay requisitos"],
          correctAnswer: 1,
          explanation: "Se requiere ser mayor de edad, carecer de antecedentes penales y tener aptitud psicofísica."
        }
      ]
    },
    {
      themeId: "tema-13",
      themeName: "Drogas y Estupefacientes",
      tests: [
        {
          id: "t13-q1",
          question: "¿Qué ley regula los estupefacientes en España?",
          options: ["LO 1/1992", "Ley 17/1967", "LO 4/2015", "RD 75/1990"],
          correctAnswer: 1,
          explanation: "La Ley 17/1967 de Estupefacientes regula esta materia en España."
        },
        {
          id: "t13-q2",
          question: "¿Cuándo es delito el tráfico de drogas?",
          options: ["Siempre", "Solo grandes cantidades", "Cuando no es para consumo propio", "Solo drogas duras"],
          correctAnswer: 2,
          explanation: "Es delito el tráfico cuando no se destina al consumo propio, independientemente de la cantidad."
        },
        {
          id: "t13-q3",
          question: "¿Qué es el consumo en lugares públicos?",
          options: ["Delito", "Infracción administrativa grave", "Infracción leve", "No es infracción"],
          correctAnswer: 1,
          explanation: "El consumo de drogas en lugares públicos constituye infracción administrativa grave."
        },
        {
          id: "t13-q4",
          question: "¿Cuáles se consideran drogas duras?",
          options: ["Solo heroína", "Heroína, cocaína y derivados", "Todas menos cannabis", "Solo las sintéticas"],
          correctAnswer: 1,
          explanation: "Se consideran drogas duras las que causan grave daño a la salud como heroína, cocaína y sus derivados."
        },
        {
          id: "t13-q5",
          question: "¿Qué pena tiene el tráfico de drogas no duras?",
          options: ["1 a 3 años", "3 a 6 años", "6 a 9 años", "No hay pena"],
          correctAnswer: 0,
          explanation: "El tráfico de drogas que no causan grave da��o a la salud se pena con 1 a 3 años de prisión."
        }
      ]
    },
    {
      themeId: "tema-14",
      themeName: "Terrorismo y Delincuencia Organizada",
      tests: [
        {
          id: "t14-q1",
          question: "¿Cómo define el Código Penal el terrorismo?",
          options: ["Solo ataques con bomba", "Actos violentos para subvertir el orden", "Cualquier delito grave", "Solo secuestros"],
          correctAnswer: 1,
          explanation: "El terrorismo comprende actos violentos para subvertir el orden constitucional o alterar gravemente la paz pública."
        },
        {
          id: "t14-q2",
          question: "¿Qué es una organización criminal?",
          options: ["2 personas", "Grupo de 3 o más personas para cometer delitos", "Solo bandas armadas", "Grupos terroristas"],
          correctAnswer: 1,
          explanation: "Organización criminal es la agrupación de tres o más personas para realizar actividades delictivas."
        },
        {
          id: "t14-q3",
          question: "¿Cuál es la pena por pertenencia a organización terrorista?",
          options: ["5 a 10 años", "6 a 12 años", "8 a 14 años", "10 a 15 años"],
          correctAnswer: 2,
          explanation: "La pertenencia a organización terrorista se castiga con prisión de 8 a 14 años."
        },
        {
          id: "t14-q4",
          question: "¿Qué es el blanqueo de capitales?",
          options: ["Invertir dinero", "Ocultar origen ilícito de bienes", "Cambiar moneda", "Transferir dinero"],
          correctAnswer: 1,
          explanation: "Blanqueo es ocultar o encubrir el origen ilícito de bienes procedentes de actividades delictivas."
        },
        {
          id: "t14-q5",
          question: "¿Cuánto se extiende la detención en casos de terrorismo?",
          options: ["72 horas", "5 días", "13 días", "20 días"],
          correctAnswer: 2,
          explanation: "En delitos de terrorismo la detención puede prolongarse hasta 13 días con autorización judicial."
        }
      ]
    },
    {
      themeId: "tema-15",
      themeName: "Menores Infractores",
      tests: [
        {
          id: "t15-q1",
          question: "¿Qué ley regula la responsabilidad penal de los menores?",
          options: ["LO 8/2006", "LO 5/2000", "LO 10/2022", "LO 1/1996"],
          correctAnswer: 1,
          explanation: "La LO 5/2000 regula la responsabilidad penal de los menores, modificada por LO 8/2006."
        },
        {
          id: "t15-q2",
          question: "¿Entre qué edades se aplica la ley de menores?",
          options: ["12 a 16 años", "14 a 18 años", "16 a 21 años", "14 a 21 años"],
          correctAnswer: 1,
          explanation: "La ley se aplica a menores de 14 a 18 años, y excepcionalmente hasta 21 años."
        },
        {
          id: "t15-q3",
          question: "¿Cuál es el objetivo principal de las medidas de menores?",
          options: ["Castigo", "Reeducación y reinserción", "Ejemplaridad", "Retribución"],
          correctAnswer: 1,
          explanation: "Las medidas tienen finalidad educativa y de reinserción social del menor."
        },
        {
          id: "t15-q4",
          question: "¿Cuánto puede durar el internamiento de un menor?",
          options: ["6 meses", "1 año", "2 años", "5 años"],
          correctAnswer: 2,
          explanation: "El internamiento en régimen cerrado no puede exceder de 2 años."
        },
        {
          id: "t15-q5",
          question: "¿Quién juzga a los menores infractores?",
          options: ["Juzgado Penal", "Juzgado de Menores", "Audiencia Provincial", "Tribunal Supremo"],
          correctAnswer: 1,
          explanation: "Los Juzgados de Menores son competentes para juzgar a los menores infractores."
        }
      ]
    },
    {
      themeId: "tema-16",
      themeName: "Policía Científica y Criminalística",
      tests: [
        {
          id: "t16-q1",
          question: "¿Qué es la criminalística?",
          options: ["Estudio del delito", "Aplicación de ciencias auxiliares al esclarecimiento de delitos", "Investigación policial", "Derecho penal"],
          correctAnswer: 1,
          explanation: "La criminalística aplica conocimientos científicos al esclarecimiento de hechos delictivos."
        },
        {
          id: "t16-q2",
          question: "¿Qué son las huellas dactilares?",
          options: ["Marcas de dedos", "Impresiones de las crestas papilares", "Residuos de piel", "Marcas de sudor"],
          correctAnswer: 1,
          explanation: "Las huellas dactilares son impresiones dejadas por las crestas papilares de los dedos."
        },
        {
          id: "t16-q3",
          question: "¿Cuántos tipos básicos de huellas existen?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 1,
          explanation: "Existen tres tipos básicos: arco, presilla y verticilo."
        },
        {
          id: "t16-q4",
          question: "¿Qué es el ADN?",
          options: ["Ácido nucleico", "Código genético único", "Proteína", "Enzima"],
          correctAnswer: 1,
          explanation: "El ADN contiene la información genética única de cada individuo."
        },
        {
          id: "t16-q5",
          question: "¿Qué es la bal��stica forense?",
          options: ["Estudio de explosivos", "Estudio de armas y proyectiles", "Análisis de trayectorias", "Examen de pólvora"],
          correctAnswer: 1,
          explanation: "La balística forense estudia las armas de fuego, proyectiles y efectos de los disparos."
        }
      ]
    },
    {
      themeId: "tema-17",
      themeName: "Primeros Auxilios y Emergencias",
      tests: [
        {
          id: "t17-q1",
          question: "¿Cuál es la secuencia PAS en emergencias?",
          options: ["Proteger, Avisar, Socorrer", "Preguntar, Actuar, Salvar", "Proteger, Actuar, Socorrer", "Prevenir, Avisar, Socorrer"],
          correctAnswer: 0,
          explanation: "PAS significa Proteger, Avisar y Socorrer, en ese orden de prioridad."
        },
        {
          id: "t17-q2",
          question: "¿Cuándo NO se debe mover a un accidentado?",
          options: ["Nunca", "Cuando tenga lesiones graves", "Si hay riesgo de lesión medular", "Siempre se puede mover"],
          correctAnswer: 2,
          explanation: "No se debe mover si hay sospecha de lesión en columna vertebral."
        },
        {
          id: "t17-q3",
          question: "¿Cuál es la frecuencia de compresiones en RCP?",
          options: ["60 por minuto", "80-100 por minuto", "100-120 por minuto", "120-140 por minuto"],
          correctAnswer: 2,
          explanation: "La frecuencia recomendada es de 100-120 compresiones por minuto."
        },
        {
          id: "t17-q4",
          question: "¿Qué es la posición lateral de seguridad?",
          options: ["Boca arriba", "Posición para inconscientes que respiran", "Posición para heridos", "Posición de shock"],
          correctAnswer: 1,
          explanation: "Se utiliza para personas inconscientes que respiran para evitar la asfixia."
        },
        {
          id: "t17-q5",
          question: "¿Cómo se trata una hemorragia externa?",
          options: ["Torniquete inmediato", "Presión directa sobre la herida", "Elevar la zona", "Aplicar hielo"],
          correctAnswer: 1,
          explanation: "El tratamiento inicial es la presión directa sobre la herida con un apósito."
        }
      ]
    },
    {
      themeId: "tema-18",
      themeName: "Derechos Humanos",
      tests: [
        {
          id: "t18-q1",
          question: "¿Cuándo se aprobó la Declaración Universal de Derechos Humanos?",
          options: ["1945", "1948", "1950", "1953"],
          correctAnswer: 1,
          explanation: "La Declaración Universal fue aprobada por la ONU el 10 de diciembre de 1948."
        },
        {
          id: "t18-q2",
          question: "¿Cuántos artículos tiene la Declaración Universal?",
          options: ["25", "30", "35", "40"],
          correctAnswer: 1,
          explanation: "La Declaración Universal de Derechos Humanos tiene 30 artículos."
        },
        {
          id: "t18-q3",
          question: "¿Qué características tienen los derechos humanos?",
          options: ["Universales", "Universales, inalienables e indivisibles", "Solo universales", "Relativos y divisibles"],
          correctAnswer: 1,
          explanation: "Los derechos humanos son universales, inalienables, indivisibles e interdependientes."
        },
        {
          id: "t18-q4",
          question: "¿Qué es el Convenio Europeo de Derechos Humanos?",
          options: ["Declaración", "Tratado internacional vinculante", "Recomendación", "Protocolo"],
          correctAnswer: 1,
          explanation: "Es un tratado internacional vinculante firmado en 1950 en el marco del Consejo de Europa."
        },
        {
          id: "t18-q5",
          question: "¿Qué tribunal europeo protege los derechos humanos?",
          options: ["Tribunal de Justicia UE", "Tribunal Europeo de Derechos Humanos", "Corte Internacional", "Tribunal Constitucional"],
          correctAnswer: 1,
          explanation: "El Tribunal Europeo de Derechos Humanos de Estrasburgo protege estos derechos."
        }
      ]
    },
    {
      themeId: "tema-19",
      themeName: "Unión Europea",
      tests: [
        {
          id: "t19-q1",
          question: "¿Cuándo se constituyó la Unión Europea?",
          options: ["1957", "1992", "1993", "2009"],
          correctAnswer: 2,
          explanation: "La Unión Europea se constituyó el 1 de noviembre de 1993 con el Tratado de Maastricht."
        },
        {
          id: "t19-q2",
          question: "¿Cuántos países forman actualmente la UE?",
          options: ["25", "27", "28", "30"],
          correctAnswer: 1,
          explanation: "Tras el Brexit, la UE está compuesta por 27 países miembros."
        },
        {
          id: "t19-q3",
          question: "¿Cuáles son las principales instituciones de la UE?",
          options: ["Parlamento y Comisión", "Consejo, Parlamento y Comisión", "Solo el Consejo", "Tribunales únicamente"],
          correctAnswer: 1,
          explanation: "Las principales instituciones son el Consejo Europeo, Parlamento, Comisión y Tribunal de Justicia."
        },
        {
          id: "t19-q4",
          question: "¿Cuándo ingresó España en la UE?",
          options: ["1982", "1985", "1986", "1987"],
          correctAnswer: 2,
          explanation: "España ingresó en la Comunidad Económica Europea el 1 de enero de 1986."
        },
        {
          id: "t19-q5",
          question: "¿Qué es Europol?",
          options: ["Tribunal europeo", "Agencia policial europea", "Parlamento", "Banco central"],
          correctAnswer: 1,
          explanation: "Europol es la Agencia de Policía Europea para la cooperación policial."
        }
      ]
    },
    {
      themeId: "tema-20",
      themeName: "Inmigración y Asilo",
      tests: [
        {
          id: "t20-q1",
          question: "¿Qué es el derecho de asilo?",
          options: ["Protección temporal", "Protección a perseguidos por motivos políticos", "Ayuda económica", "Permiso de trabajo"],
          correctAnswer: 1,
          explanation: "El derecho de asilo protege a quienes huyen de persecución por motivos políticos, religiosos, etc."
        },
        {
          id: "t20-q2",
          question: "¿Qué diferencia hay entre refugiado y asilado?",
          options: ["No hay diferencia", "El refugiado está fuera de su país", "El asilado tiene más derechos", "Solo el procedimiento"],
          correctAnswer: 1,
          explanation: "El refugiado se encuentra fuera de su país de origen, el asilado puede estar en él."
        },
        {
          id: "t20-q3",
          question: "¿Qué es la protección subsidiaria?",
          options: ["Ayuda económica", "Protección cuando no se concede asilo", "Permiso temporal", "Reagrupación familiar"],
          correctAnswer: 1,
          explanation: "Es protección para quien no puede optar al asilo pero necesita protección internacional."
        },
        {
          id: "t20-q4",
          question: "¿Qué principio rige el derecho de asilo?",
          options: ["Reciprocidad", "Non-refoulement", "Subsidiariedad", "Proporcionalidad"],
          correctAnswer: 1,
          explanation: "El principio de non-refoulement prohíbe devolver a alguien donde pueda ser perseguido."
        },
        {
          id: "t20-q5",
          question: "¿Quién resuelve las solicitudes de asilo en España?",
          options: ["Gobierno", "Oficina de Asilo y Refugio", "Tribunales", "Ministerio Interior"],
          correctAnswer: 1,
          explanation: "La Oficina de Asilo y Refugio del Ministerio del Interior resuelve estas solicitudes."
        }
      ]
    },
    {
      themeId: "tema-21",
      themeName: "Seguridad Privada",
      tests: [
        {
          id: "t21-q1",
          question: "¿Qué ley regula la seguridad privada?",
          options: ["Ley 5/2014", "Ley 23/1992", "Ley 4/2015", "Ley 8/2011"],
          correctAnswer: 0,
          explanation: "La Ley 5/2014 de Seguridad Privada regula esta actividad en España."
        },
        {
          id: "t21-q2",
          question: "¿Qué pueden hacer los vigilantes de seguridad?",
          options: ["Detener", "Identificar y retener", "Interrogar", "Registrar personas"],
          correctAnswer: 1,
          explanation: "Los vigilantes pueden identificar y retener en casos de delito flagrante."
        },
        {
          id: "t21-q3",
          question: "¿Cuánto dura la habilitación de vigilante?",
          options: ["2 años", "3 años", "5 años", "10 años"],
          correctAnswer: 2,
          explanation: "La habilitación de vigilante de seguridad tiene una validez de 5 años."
        },
        {
          id: "t21-q4",
          question: "¿Qué es un detective privado?",
          options: ["Vigilante especial", "Investigador autorizado", "Policía privada", "Guardia especial"],
          correctAnswer: 1,
          explanation: "El detective privado es un investigador autorizado para realizar investigaciones privadas."
        },
        {
          id: "t21-q5",
          question: "¿Pueden los vigilantes portar armas?",
          options: ["Nunca", "Siempre", "Solo con autorización específica", "Solo de noche"],
          correctAnswer: 2,
          explanation: "Solo pueden portar armas con autorización específica y en determinados servicios."
        }
      ]
    },
    {
      themeId: "tema-22",
      themeName: "Ley de Enjuiciamiento Criminal",
      tests: [
        {
          id: "t22-q1",
          question: "¿Qué es la policía judicial?",
          options: ["Tribunales", "Auxiliar de la justicia", "Ministerio Fiscal", "Abogados"],
          correctAnswer: 1,
          explanation: "La policía judicial es auxiliar de los Juzgados y Tribunales para la investigación de delitos."
        },
        {
          id: "t22-q2",
          question: "¿Cuándo hay flagrante delito?",
          options: ["Al denunciarlo", "Al descubrirse", "Al cometerlo o inmediatamente después", "Al investigarlo"],
          correctAnswer: 2,
          explanation: "Hay flagrante delito cuando se está cometiendo o se acaba de cometer."
        },
        {
          id: "t22-q3",
          question: "¿Cuál es el plazo de detención preventiva?",
          options: ["24 horas", "48 horas", "72 horas", "96 horas"],
          correctAnswer: 2,
          explanation: "El plazo máximo de detención preventiva es de 72 horas."
        },
        {
          id: "t22-q4",
          question: "¿Qué es un atestado?",
          options: ["Sentencia", "Denuncia", "Documento policial", "Recurso"],
          correctAnswer: 2,
          explanation: "El atestado es el documento donde la policía judicial hace constar hechos delictivos."
        },
        {
          id: "t22-q5",
          question: "¿Quién puede ordenar registros domiciliarios?",
          options: ["Policía", "Fiscal", "Juez", "Alcalde"],
          correctAnswer: 2,
          explanation: "Solo el juez puede autorizar el registro de domicilio, salvo flagrante delito."
        }
      ]
    },
    {
      themeId: "tema-23",
      themeName: "Ley sobre Tráfico y Seguridad Vial",
      tests: [
        {
          id: "t23-q1",
          question: "¿Qué ley regula el tráfico y la seguridad vial?",
          options: ["RD Legislativo 339/1990", "RD Legislativo 6/2015", "Ley 47/2003", "Ley 17/2005"],
          correctAnswer: 1,
          explanation: "El RD Legislativo 6/2015 aprueba el texto refundido de la Ley sobre Tráfico, Circulación de Vehículos a Motor y Seguridad Vial."
        },
        {
          id: "t23-q2",
          question: "¿Cuántos puntos tiene inicialmente el permiso de conducir?",
          options: ["8 puntos", "12 puntos", "15 puntos", "20 puntos"],
          correctAnswer: 1,
          explanation: "El permiso de conducir se dota inicialmente con 12 puntos."
        },
        {
          id: "t23-q3",
          question: "¿Cuándo prescriben las infracciones leves?",
          options: ["3 meses", "6 meses", "1 año", "4 años"],
          correctAnswer: 0,
          explanation: "Las infracciones leves prescriben a los 3 meses."
        },
        {
          id: "t23-q4",
          question: "¿Qué es una infracción muy grave en materia de tráfico?",
          options: ["Multa hasta 100€", "Multa de 200 a 500€", "Multa de 500 a 600€", "Multa superior a 500€"],
          correctAnswer: 2,
          explanation: "Las infracciones muy graves se sancionan con multa de 500 a 600 euros."
        },
        {
          id: "t23-q5",
          question: "¿Qué velocidad mínima se debe mantener en autopista?",
          options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
          correctAnswer: 2,
          explanation: "En autopistas la velocidad mínima es de 60 km/h."
        }
      ]
    },
    {
      themeId: "tema-24",
      themeName: "Delitos contra la Seguridad del Tráfico",
      tests: [
        {
          id: "t24-q1",
          question: "¿A partir de qué tasa de alcohol es delito?",
          options: ["0,25 mg/l", "0,50 mg/l", "0,60 mg/l", "1,00 mg/l"],
          correctAnswer: 2,
          explanation: "Constituye delito conducir con una tasa de alcohol superior a 0,60 mg/l en aire espirado."
        },
        {
          id: "t24-q2",
          question: "¿Qué velocidades constituyen delito en vía urbana?",
          options: ["Más de 50 km/h", "80 km/h o más", "100 km/h o más", "120 km/h o más"],
          correctAnswer: 1,
          explanation: "Es delito superar en 80 km/h la velocidad permitida en vía urbana."
        },
        {
          id: "t24-q3",
          question: "¿Qué es el delito de negativa a las pruebas?",
          options: ["No colaborar", "Resistirse a la detención", "Negarse a soplar", "Huir del control"],
          correctAnswer: 2,
          explanation: "Constituye delito negarse a someterse a las pruebas de alcoholemia o drogas."
        },
        {
          id: "t24-q4",
          question: "¿Cuándo es delito la conducción temeraria?",
          options: ["Siempre", "Con manifiesto desprecio por la vida", "Solo si hay accidente", "En cualquier infracción"],
          correctAnswer: 1,
          explanation: "Es delito la conducción temeraria con manifiesto desprecio por la vida de otros."
        },
        {
          id: "t24-q5",
          question: "¿Qué pena tiene la conducción sin permiso?",
          options: ["Multa", "3 a 6 meses de prisión", "6 meses a 2 años", "1 a 4 años"],
          correctAnswer: 1,
          explanation: "Conducir sin permiso se castiga con prisión de 3 a 6 meses o multa de 12 a 24 meses."
        }
      ]
    },
    {
      themeId: "tema-25",
      themeName: "Organización Territorial del Estado",
      tests: [
        {
          id: "t25-q1",
          question: "¿Cuántas Comunidades Autónomas hay en España?",
          options: ["15", "17", "19", "21"],
          correctAnswer: 1,
          explanation: "España está organizada en 17 Comunidades Autónomas y 2 Ciudades Autónomas."
        },
        {
          id: "t25-q2",
          question: "¿Qué artículo de la Constitución regula las Comunidades Autónomas?",
          options: ["Artículo 143", "Artículo 144", "Artículo 145", "Artículo 146"],
          correctAnswer: 0,
          explanation: "El artículo 143 establece el procedimiento ordinario para la constitución de las Comunidades Autónomas."
        },
        {
          id: "t25-q3",
          question: "¿Cuál es la provincia más extensa de España?",
          options: ["Madrid", "Sevilla", "Badajoz", "Cáceres"],
          correctAnswer: 2,
          explanation: "Badajoz es la provincia más extensa de España con 21.766 km²."
        },
        {
          id: "t25-q4",
          question: "¿Qué son las Diputaciones Provinciales?",
          options: ["Órganos autonómicos", "Entidades locales", "Delegaciones del Gobierno", "Tribunales provinciales"],
          correctAnswer: 1,
          explanation: "Las Diputaciones Provinciales son entidades locales supramunicipales."
        },
        {
          id: "t25-q5",
          question: "¿Cuál es el número mínimo de provincias para formar una Comunidad Autónoma?",
          options: ["Una", "Dos", "Tres", "Cuatro"],
          correctAnswer: 0,
          explanation: "Una sola provincia puede constituir una Comunidad Autónoma, como en el caso de Asturias."
        }
      ]
    }
  ],

  "policia-nacional": [
    {
      themeId: "tema-1",
      themeName: "Organización del Cuerpo Nacional de Policía",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuándo se creó el Cuerpo Nacional de Policía?",
          options: ["1986", "1987", "1988", "1989"],
          correctAnswer: 0,
          explanation: "El Cuerpo Nacional de Policía se creó en 1986 con la fusión del Cuerpo General de Polic��a y la Policía Nacional."
        },
        {
          id: "t1-q2",
          question: "¿Cuál es la estructura orgánica básica de la Policía Nacional?",
          options: ["Direcciones Generales", "Comisarías Generales", "Jefaturas Superiores", "Todas las anteriores"],
          correctAnswer: 3,
          explanation: "La Policía Nacional se estructura en Direcciones Generales, Comisarías Generales y Jefaturas Superiores."
        },
        {
          id: "t1-q3",
          question: "¿Dónde tiene su ámbito de actuación principal la Policía Nacional?",
          options: ["Ámbito rural", "Núcleos urbanos", "Carreteras", "Fronteras únicamente"],
          correctAnswer: 1,
          explanation: "La Policía Nacional actúa principalmente en núcleos urbanos y capitales de provincia."
        },
        {
          id: "t1-q4",
          question: "¿Cuál es el distintivo de la Policía Nacional?",
          options: ["Tricornio", "Gorra de plato", "Boina", "Casco"],
          correctAnswer: 1,
          explanation: "La gorra de plato es el distintivo tradicional de la Policía Nacional."
        },
        {
          id: "t1-q5",
          question: "¿Qué significa CNP?",
          options: ["Cuerpo Nacional de Policía", "Centro Nacional Policial", "Comisaría Nacional de Policía", "Consejo Nacional de Policía"],
          correctAnswer: 0,
          explanation: "CNP significa Cuerpo Nacional de Policía."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Funciones Especializadas",
      tests: [
        {
          id: "t2-q1",
          question: "¿Qué es la UDYCO?",
          options: ["Unidad de Drogas y Crimen Organizado", "Unidad de Delitos y Cooperación", "Unidad de Documentos y Control", "Unidad de Defensa y Coordinación"],
          correctAnswer: 0,
          explanation: "UDYCO es la Unidad de Drogas y Crimen Organizado de la Policía Nacional."
        },
        {
          id: "t2-q2",
          question: "¿Cuál es la función principal de la Brigada de Policía Científica?",
          options: ["Investigaci��n tecnológica", "Análisis criminalístico", "Formación policial", "Coordinación operativa"],
          correctAnswer: 1,
          explanation: "La Policía Científica se encarga del análisis criminalístico y la investigación técnica."
        },
        {
          id: "t2-q3",
          question: "¿Qué es el GEO?",
          options: ["Grupo Especial de Operaciones", "Grupo de Elite Operacional", "Grupo Especial Orgánico", "Grupo de Emergencias Operativas"],
          correctAnswer: 0,
          explanation: "GEO es el Grupo Especial de Operaciones, unidad de élite antiterrorista."
        },
        {
          id: "t2-q4",
          question: "¿Cuál es la función de la UCRIF?",
          options: ["Control de fronteras", "Crimen organizado", "Inteligencia financiera", "Todas las anteriores"],
          correctAnswer: 3,
          explanation: "La UCRIF (Unidad Central de Redes de Inmigración y Falsedades) actúa en múltiples ámbitos."
        },
        {
          id: "t2-q5",
          question: "¿Qué competencia tiene la Policía Nacional en extranjería?",
          options: ["Solo control de fronteras", "Control de fronteras y expedientes de extranjería", "Solo deportaciones", "Ninguna competencia"],
          correctAnswer: 1,
          explanation: "La Policía Nacional tiene competencias en control de fronteras y tramitación de expedientes de extranjería."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Procedimientos Policiales",
      tests: [
        {
          id: "t3-q1",
          question: "¿Cuál es el procedimiento para una detención?",
          options: ["Informar derechos, comunicar al juez y familia", "Solo comunicar al juez", "Solo informar derechos", "Depende del delito"],
          correctAnswer: 0,
          explanation: "En toda detención se debe informar de los derechos y comunicar al juez y familia del detenido."
        },
        {
          id: "t3-q2",
          question: "¿Qué es una diligencia policial?",
          options: ["Un trámite administrativo", "Una actuación de investigación criminal", "Una sanción", "Un informe técnico"],
          correctAnswer: 1,
          explanation: "Las diligencias policiales son actuaciones de investigación criminal realizadas por la policía."
        },
        {
          id: "t3-q3",
          question: "��Cuándo se puede realizar un registro domiciliario?",
          options: ["Siempre", "Con autorización judicial o consentimiento", "Solo de noche", "Solo en flagrante delito"],
          correctAnswer: 1,
          explanation: "El registro domiciliario requiere autorización judicial o consentimiento del titular."
        },
        {
          id: "t3-q4",
          question: "¿Qué es el principio de oportunidad?",
          options: ["Actuar cuando se puede", "Discrecionalidad en la persecución", "Actuar inmediatamente", "Esperar órdenes superiores"],
          correctAnswer: 1,
          explanation: "El principio de oportunidad permite cierta discrecionalidad en la persecución de delitos menores."
        },
        {
          id: "t3-q5",
          question: "¿Cuál es la cadena de custodia?",
          options: ["Orden de detención", "Procedimiento de preservación de pruebas", "Lista de detenidos", "Control de armas"],
          correctAnswer: 1,
          explanation: "La cadena de custodia es el procedimiento para preservar la integridad de las pruebas."
        }
      ]
    }
  ],

  "policia-local": [
    {
      themeId: "tema-1",
      themeName: "Organización de la Policía Local",
      tests: [
        {
          id: "t1-q1",
          question: "¿De quién depende la Policía Local?",
          options: ["Del Estado", "De la Comunidad Autónoma", "Del Ayuntamiento", "De la Diputación"],
          correctAnswer: 2,
          explanation: "La Policía Local depende del Ayuntamiento correspondiente."
        },
        {
          id: "t1-q2",
          question: "¿Cuál es el ámbito territorial de actuación de la Policía Local?",
          options: ["Todo el territorio nacional", "La provincia", "El término municipal", "La comarca"],
          correctAnswer: 2,
          explanation: "La Policía Local actúa dentro de su término municipal."
        },
        {
          id: "t1-q3",
          question: "¿Quién nombra al Jefe de la Policía Local?",
          options: ["El Ministro del Interior", "El Alcalde", "El Pleno municipal", "El Delegado del Gobierno"],
          correctAnswer: 1,
          explanation: "El Alcalde nombra al Jefe de la Policía Local."
        },
        {
          id: "t1-q4",
          question: "¿Cuál es la categoría básica en la Polic��a Local?",
          options: ["Oficial", "Policía", "Cabo", "Subinspector"],
          correctAnswer: 1,
          explanation: "Policía es la categoría básica o de ingreso en la Policía Local."
        },
        {
          id: "t1-q5",
          question: "¿Qué normativa regula las Policías Locales?",
          options: ["Solo la ley estatal", "Solo las leyes autonómicas", "Ley estatal y autonómicas", "Solo ordenanzas municipales"],
          correctAnswer: 2,
          explanation: "Las Policías Locales se rigen por normativa estatal y autonómica."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Competencias y Funciones",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuáles son las principales funciones de la Policía Local?",
          options: ["Solo tráfico", "Tráfico y ordenanzas municipales", "Solo seguridad ciudadana", "Todas las funciones policiales"],
          correctAnswer: 1,
          explanation: "La Policía Local se encarga principalmente de tráfico urbano y cumplimiento de ordenanzas municipales."
        },
        {
          id: "t2-q2",
          question: "¿Puede la Policía Local realizar funciones de policía judicial?",
          options: ["Nunca", "S��, en todos los casos", "Solo como primera actuación", "Solo con autorización judicial"],
          correctAnswer: 2,
          explanation: "La Policía Local puede realizar funciones de polic��a judicial como primera actuación."
        },
        {
          id: "t2-q3",
          question: "¿En qué materias tiene competencia exclusiva la Policía Local?",
          options: ["Tráfico urbano", "Ordenanzas municipales", "Ambas anteriores", "Ninguna es exclusiva"],
          correctAnswer: 2,
          explanation: "La Policía Local tiene competencia preferente en tráfico urbano y ordenanzas municipales."
        },
        {
          id: "t2-q4",
          question: "¿Puede la Policía Local actuar fuera de su término municipal?",
          options: ["Nunca", "Solo en persecución", "Solo con autorización", "Siempre"],
          correctAnswer: 1,
          explanation: "La Policía Local puede actuar fuera de su término en casos de persecución ininterrumpida."
        },
        {
          id: "t2-q5",
          question: "¿Qué es una ordenanza municipal?",
          options: ["Una ley autonómica", "Una norma municipal", "Un reglamento estatal", "Una directiva europea"],
          correctAnswer: 1,
          explanation: "Las ordenanzas municipales son normas aprobadas por los ayuntamientos."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Tráfico y Seguridad Vial",
      tests: [
        {
          id: "t3-q1",
          question: "¿Cuál es la velocidad máxima en vías urbanas?",
          options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"],
          correctAnswer: 2,
          explanation: "La velocidad máxima genérica en vías urbanas es de 50 km/h."
        },
        {
          id: "t3-q2",
          question: "¿Quién tiene preferencia en un paso de peatones?",
          options: ["Los vehículos", "Los peatones", "Depende del semáforo", "El que llegue primero"],
          correctAnswer: 1,
          explanation: "Los peatones tienen preferencia de paso en los pasos de peatones."
        },
        {
          id: "t3-q3",
          question: "¿Cuál es la tasa máxima de alcoholemia para conductores profesionales?",
          options: ["0,15 mg/l", "0,25 mg/l", "0,50 mg/l", "0,30 mg/l"],
          correctAnswer: 0,
          explanation: "Para conductores profesionales la tasa máxima es de 0,15 mg/l en aire espirado."
        },
        {
          id: "t3-q4",
          question: "¿Cuántos puntos se pierden por usar el móvil conduciendo?",
          options: ["2 puntos", "3 puntos", "4 puntos", "6 puntos"],
          correctAnswer: 1,
          explanation: "Usar el teléfono móvil conduciendo supone la pérdida de 3 puntos."
        },
        {
          id: "t3-q5",
          question: "¿Dónde está prohibido estacionar?",
          options: ["En doble fila", "En pasos de peatones", "En curvas", "Todas las anteriores"],
          correctAnswer: 3,
          explanation: "Está prohibido estacionar en doble fila, pasos de peatones, curvas y otros lugares."
        }
      ]
    }
  ],

  "mossos-esquadra": [
    {
      themeId: "tema-1",
      themeName: "Historia y Organización",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuándo se crearon los Mossos d'Esquadra originalmente?",
          options: ["1719", "1720", "1721", "1722"],
          correctAnswer: 0,
          explanation: "Los Mossos d'Esquadra fueron creados en 1719 durante el reinado de Felipe V."
        },
        {
          id: "t1-q2",
          question: "¿Cuándo se restablecieron los Mossos d'Esquadra modernos?",
          options: ["1980", "1983", "1985", "1988"],
          correctAnswer: 1,
          explanation: "Los Mossos d'Esquadra modernos se restablecieron en 1983."
        },
        {
          id: "t1-q3",
          question: "¿De qué departamento de la Generalitat dependen?",
          options: ["Justicia", "Interior", "Presidencia", "Gobernación"],
          correctAnswer: 1,
          explanation: "Los Mossos d'Esquadra dependen del Departamento de Interior de la Generalitat."
        },
        {
          id: "t1-q4",
          question: "¿Cuál es el ámbito territorial de los Mossos d'Esquadra?",
          options: ["Barcelona", "Cataluña", "Área metropolitana", "Provincias catalanas"],
          correctAnswer: 1,
          explanation: "Los Mossos d'Esquadra actúan en todo el territorio de Cataluña."
        },
        {
          id: "t1-q5",
          question: "¿Qué significa 'Mossos d'Esquadra'?",
          options: ["Jóvenes de escuadra", "Mozos de escuadra", "Miembros de escuadra", "Guardias de escuadra"],
          correctAnswer: 1,
          explanation: "'Mossos d'Esquadra' significa literalmente 'mozos de escuadra' en catalán."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Competencias y Funciones",
      tests: [
        {
          id: "t2-q1",
          question: "��Cuáles son las competencias principales de los Mossos d'Esquadra?",
          options: ["Solo seguridad ciudadana", "Solo tráfico", "Seguridad ciudadana, orden público y tr��fico", "Solo orden público"],
          correctAnswer: 2,
          explanation: "Los Mossos tienen competencias en seguridad ciudadana, orden público y tráfico en Cataluña."
        },
        {
          id: "t2-q2",
          question: "¿Qué es la División de Investigación Criminal (DIC)?",
          options: ["Unidad de tráfico", "Unidad de investigación", "Unidad administrativa", "Unidad de formación"],
          correctAnswer: 1,
          explanation: "La DIC es la división especializada en investigación criminal de los Mossos."
        },
        {
          id: "t2-q3",
          question: "¿Tienen competencias en terrorismo los Mossos d'Esquadra?",
          options: ["No, es competencia estatal", "Sí, competencia plena", "Solo en colaboración", "Solo en prevención"],
          correctAnswer: 2,
          explanation: "Los Mossos colaboran con las fuerzas estatales en materia antiterrorista."
        },
        {
          id: "t2-q4",
          question: "¿Qué es el TEDAX de los Mossos?",
          options: ["Unidad de élite", "Unidad de desactivación de explosivos", "Unidad de tráfico", "Unidad científica"],
          correctAnswer: 1,
          explanation: "TEDAX es la unidad especializada en desactivación de explosivos y artificios."
        },
        {
          id: "t2-q5",
          question: "¿En qué idiomas deben atender los Mossos al público?",
          options: ["Solo catal��n", "Solo español", "Catalán y español", "Depende de la zona"],
          correctAnswer: 2,
          explanation: "Los Mossos deben atender al público tanto en catalán como en español."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Normativa y Procedimientos",
      tests: [
        {
          id: "t3-q1",
          question: "¿Qué ley regula los Mossos d'Esquadra?",
          options: ["Ley 10/1994", "Ley 4/2003", "Ley 8/2008", "Ley 5/2012"],
          correctAnswer: 1,
          explanation: "La Ley 4/2003 de Ordenación del Sistema de Seguridad Pública de Cataluña regula los Mossos."
        },
        {
          id: "t3-q2",
          question: "¿Cuál es el código deontológico básico de los Mossos?",
          options: ["Servir al ciudadano", "Proteger y servir", "Seguridad, servicio y proximidad", "Orden y protección"],
          correctAnswer: 2,
          explanation: "El lema de los Mossos es 'Seguridad, servicio y proximidad'."
        },
        {
          id: "t3-q3",
          question: "¿Pueden los Mossos realizar controles de alcoholemia?",
          options: ["No", "Solo preventivos", "Sí, con plenas competencias", "Solo en carreteras autonómicas"],
          correctAnswer: 2,
          explanation: "Los Mossos tienen plenas competencias en controles de alcoholemia y tráfico."
        },
        {
          id: "t3-q4",
          question: "¿Qué procedimiento siguen en caso de detención?",
          options: ["Procedimiento propio", "Mismo que otras policías españolas", "Depende del delito", "Solo procedimiento autonómico"],
          correctAnswer: 1,
          explanation: "Los Mossos siguen el mismo procedimiento de detención que otras fuerzas policiales españolas."
        },
        {
          id: "t3-q5",
          question: "¿Colaboran los Mossos con otras fuerzas de seguridad?",
          options: ["No", "Solo con Policía Local", "Sí, según protocolos establecidos", "Solo en casos excepcionales"],
          correctAnswer: 2,
          explanation: "Los Mossos colaboran con otras fuerzas según protocolos de coordinación establecidos."
        }
      ]
    }
  ],

  "ertzaintza": [
    {
      themeId: "tema-1",
      themeName: "Historia y Organización de la Ertzaintza",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuándo se creó la Ertzaintza moderna?",
          options: ["1982", "1983", "1984", "1985"],
          correctAnswer: 0,
          explanation: "La Ertzaintza moderna se creó en 1982 tras la aprobación de su ley fundacional."
        },
        {
          id: "t1-q2",
          question: "¿Qué significa 'Ertzaintza' en euskera?",
          options: ["Guardia del pueblo", "Policía vasca", "Protectores", "Guardianes"],
          correctAnswer: 0,
          explanation: "Ertzaintza significa literalmente 'guardia del pueblo' en euskera."
        },
        {
          id: "t1-q3",
          question: "¿Cuál es el símbolo identificativo de la Ertzaintza?",
          options: ["La ikurriña", "El lauburu", "El árbol de Gernika", "La cruz de Santiago"],
          correctAnswer: 1,
          explanation: "El lauburu (cruz vasca) es uno de los símbolos identificativos de la Ertzaintza."
        },
        {
          id: "t1-q4",
          question: "¿De qué departamento del Gobierno Vasco depende?",
          options: ["Justicia", "Seguridad", "Interior", "Presidencia"],
          correctAnswer: 1,
          explanation: "La Ertzaintza depende del Departamento de Seguridad del Gobierno Vasco."
        },
        {
          id: "t1-q5",
          question: "¿Cuál es el ámbito territorial de la Ertzaintza?",
          options: ["Solo Vizcaya", "Vizcaya y Guipúzcoa", "País Vasco", "País Vasco y Navarra"],
          correctAnswer: 2,
          explanation: "La Ertzaintza actúa en todo el territorio de la Comunidad Autónoma Vasca."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Competencias y Especialidades",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuáles son las competencias principales de la Ertzaintza?",
          options: ["Solo tráfico", "Seguridad ciudadana y tráfico", "Solo seguridad ciudadana", "Todas las competencias policiales"],
          correctAnswer: 1,
          explanation: "La Ertzaintza tiene competencias en seguridad ciudadana, orden público y tráfico."
        },
        {
          id: "t2-q2",
          question: "¿Qué es la UEI?",
          options: ["Unidad Especial de Intervención", "Unidad de Elite Investigadora", "Unidad Especial de Inteligencia", "Unidad de Emergencias e Incidentes"],
          correctAnswer: 0,
          explanation: "La UEI es la Unidad Especial de Intervención de la Ertzaintza."
        },
        {
          id: "t2-q3",
          question: "¿Tiene la Ertzaintza competencias en investigación criminal?",
          options: ["No", "Solo en faltas", "Sí, en todos los delitos", "Solo en delitos menores"],
          correctAnswer: 2,
          explanation: "La Ertzaintza tiene competencias plenas en investigación criminal en el País Vasco."
        },
        {
          id: "t2-q4",
          question: "��En qué idiomas debe atender la Ertzaintza?",
          options: ["Solo euskera", "Solo español", "Euskera y español", "Depende de la provincia"],
          correctAnswer: 2,
          explanation: "La Ertzaintza debe atender en euskera y español, respetando la cooficialidad."
        },
        {
          id: "t2-q5",
          question: "¿Qué especialidad tiene la Ertzaintza en materia medioambiental?",
          options: ["No tiene especialidad", "Seprona vasco", "Unidad de Medio Ambiente", "Protección de la Naturaleza"],
          correctAnswer: 2,
          explanation: "La Ertzaintza cuenta con una Unidad de Medio Ambiente especializada."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Marco Legal y Procedimientos",
      tests: [
        {
          id: "t3-q1",
          question: "¿Qué ley regula la Ertzaintza?",
          options: ["Ley 17/1981", "Ley 4/1992", "Ley 15/1998", "Ley 8/2000"],
          correctAnswer: 1,
          explanation: "La Ley 4/1992 de Policía del País Vasco regula la Ertzaintza."
        },
        {
          id: "t3-q2",
          question: "¿Aplica la Ertzaintza la normativa penal espa��ola?",
          options: ["No, tiene normativa propia", "Sí, la misma que el resto de España", "Solo en parte", "Depende del delito"],
          correctAnswer: 1,
          explanation: "La Ertzaintza aplica la misma normativa penal y procesal que el resto de España."
        },
        {
          id: "t3-q3",
          question: "¿Puede la Ertzaintza realizar detenciones?",
          options: ["No", "Solo por faltas", "Sí, con las mismas facultades que otras policías", "Solo con autorización judicial"],
          correctAnswer: 2,
          explanation: "La Ertzaintza tiene las mismas facultades de detención que otras fuerzas policiales."
        },
        {
          id: "t3-q4",
          question: "��Colabora la Ertzaintza con otras fuerzas de seguridad?",
          options: ["No", "Solo con la Policía Local", "Sí, según acuerdos de coordinación", "Solo en casos excepcionales"],
          correctAnswer: 2,
          explanation: "La Ertzaintza colabora con otras fuerzas según acuerdos y protocolos de coordinación."
        },
        {
          id: "t3-q5",
          question: "¿Cuál es el procedimiento de denuncia ciudadana?",
          options: ["Solo en euskera", "Solo en español", "En ambos idiomas oficiales", "Depende del agente"],
          correctAnswer: 2,
          explanation: "Las denuncias pueden presentarse en euskera o español, según prefiera el ciudadano."
        }
      ]
    }
  ],

  "bomberos": [
    {
      themeId: "tema-1",
      themeName: "Organización del Servicio de Bomberos",
      tests: [
        {
          id: "t1-q1",
          question: "¿De qui��n dependen principalmente los servicios de bomberos?",
          options: ["Del Estado", "De las Comunidades Autónomas", "De los Ayuntamientos", "De las Diputaciones"],
          correctAnswer: 2,
          explanation: "Los servicios de bomberos dependen principalmente de los Ayuntamientos."
        },
        {
          id: "t1-q2",
          question: "¿Cuál es la estructura jerárquica básica en un parque de bomberos?",
          options: ["Jefe, Cabos y Bomberos", "Director, Oficiales y Agentes", "Comandante, Sargentos y Soldados", "Capitán, Tenientes y Bomberos"],
          correctAnswer: 0,
          explanation: "La estructura básica es Jefe de Parque, Cabos y Bomberos."
        },
        {
          id: "t1-q3",
          question: "¿Qué es un consorcio de bomberos?",
          options: ["Una empresa privada", "Agrupación de administraciones públicas", "Un sindicato", "Una asociación profesional"],
          correctAnswer: 1,
          explanation: "Un consorcio es una agrupación de varias administraciones para prestar el servicio de bomberos."
        },
        {
          id: "t1-q4",
          question: "¿Cuál es el número de emergencias europeo?",
          options: ["061", "080", "112", "091"],
          correctAnswer: 2,
          explanation: "El 112 es el número de emergencias europeo único."
        },
        {
          id: "t1-q5",
          question: "¿Qué significa el término 'parque de bomberos'?",
          options: ["Zona verde", "Instalación donde se ubica el servicio", "Vehículo principal", "Equipo de intervención"],
          correctAnswer: 1,
          explanation: "El parque de bomberos es la instalación donde se ubican los medios y personal del servicio."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Prevención y Extinción de Incendios",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuáles son los elementos del triángulo del fuego?",
          options: ["Calor, oxígeno y combustible", "Calor, agua y aire", "Fuego, humo y ceniza", "Llama, chispa y brasa"],
          correctAnswer: 0,
          explanation: "Los tres elementos del fuego son calor, oxígeno y combustible."
        },
        {
          id: "t2-q2",
          question: "¿Qué tipo de fuego se clasifica como Clase A?",
          options: ["Líquidos inflamables", "Sólidos ordinarios", "Gases", "Metales"],
          correctAnswer: 1,
          explanation: "Los fuegos Clase A son de materiales sólidos ordinarios como madera, papel, tela."
        },
        {
          id: "t2-q3",
          question: "¿Cuál es el agente extintor más común?",
          options: ["Espuma", "CO2", "Agua", "Polvo químico"],
          correctAnswer: 2,
          explanation: "El agua es el agente extintor más común y versátil."
        },
        {
          id: "t2-q4",
          question: "¿Qué es el flashover?",
          options: ["Extinción súbita", "Ignición generalizada", "Enfriamiento rápido", "Ventilación autom��tica"],
          correctAnswer: 1,
          explanation: "El flashover es la ignición súbita y generalizada de todos los materiales combustibles en un recinto."
        },
        {
          id: "t2-q5",
          question: "¿A qué temperatura se produce la autoignici��n de la mayoría de materiales orgánicos?",
          options: ["100°C", "200°C", "300°C", "500°C"],
          correctAnswer: 3,
          explanation: "La mayoría de materiales orgánicos se autoencienden alrededor de los 500°C."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Rescate y Salvamento",
      tests: [
        {
          id: "t3-q1",
          question: "¿Cuál es la prioridad en cualquier intervención de rescate?",
          options: ["Rapidez", "Seguridad del personal", "Ahorro de medios", "Efectividad"],
          correctAnswer: 1,
          explanation: "La seguridad del personal interviniente es siempre la primera prioridad."
        },
        {
          id: "t3-q2",
          question: "¿Qué es el triaje en emergencias?",
          options: ["Técnica de rescate", "Clasificación de víctimas por gravedad", "Tipo de vehículo", "Procedimiento administrativo"],
          correctAnswer: 1,
          explanation: "El triaje es la clasificación de víctimas según su gravedad para priorizar la atención."
        },
        {
          id: "t3-q3",
          question: "¿Cuáles son las técnicas básicas de rescate en altura?",
          options: ["Solo escaleras", "Cuerdas y poleas", "Solo grúas", "Helicópteros únicamente"],
          correctAnswer: 1,
          explanation: "Las técnicas básicas incluyen el uso de cuerdas, poleas y sistemas de anclaje."
        },
        {
          id: "t3-q4",
          question: "¿Qué significa RCP?",
          options: ["Rescate con Protección", "Reanimación Cardiopulmonar", "Respuesta Coordenada Policial", "Registro de Comunicaciones"],
          correctAnswer: 1,
          explanation: "RCP significa Reanimación Cardiopulmonar."
        },
        {
          id: "t3-q5",
          question: "¿Cuándo se debe usar el DEA?",
          options: ["En cualquier emergencia", "Solo en paradas cardiacas", "En accidentes de tráfico", "En intoxicaciones"],
          correctAnswer: 1,
          explanation: "El DEA (Desfibrilador Externo Automático) se usa específicamente en paradas cardiacas."
        }
      ]
    }
  ],

  "mir": [
    {
      themeId: "tema-1",
      themeName: "Anatomía y Fisiología",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuántas cámaras tiene el corazón humano?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "El corazón humano tiene 4 cámaras: 2 aurículas y 2 ventrículos."
        },
        {
          id: "t1-q2",
          question: "����Cuál es la función principal de los riñones?",
          options: ["Digestión", "Filtración y excreción", "Respiración", "Circulación"],
          correctAnswer: 1,
          explanation: "Los riñones filtran la sangre y eliminan desechos a través de la orina."
        },
        {
          id: "t1-q3",
          question: "¿Qué hormona regula la glucosa en sangre?",
          options: ["Adrenalina", "Insulina", "Cortisol", "Tiroxina"],
          correctAnswer: 1,
          explanation: "La insulina es la hormona que regula los niveles de glucosa en sangre."
        },
        {
          id: "t1-q4",
          question: "¿Cuántos huesos tiene el cuerpo humano adulto aproximadamente?",
          options: ["206", "215", "220", "250"],
          correctAnswer: 0,
          explanation: "El cuerpo humano adulto tiene aproximadamente 206 huesos."
        },
        {
          id: "t1-q5",
          question: "¿Cuál es el órgano más grande del cuerpo humano?",
          options: ["Hígado", "Cerebro", "Piel", "Pulmones"],
          correctAnswer: 2,
          explanation: "La piel es el órgano más grande del cuerpo humano."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Farmacología",
      tests: [
        {
          id: "t2-q1",
          question: "¿Qué es la farmacocinética?",
          options: ["Efectos del fármaco", "Movimiento del fármaco en el organismo", "Interacciones medicamentosas", "Dosificación"],
          correctAnswer: 1,
          explanation: "La farmacocinética estudia el movimiento del fármaco en el organismo: absorción, distribución, metabolismo y excreción."
        },
        {
          id: "t2-q2",
          question: "¿Cuál es la vía de administración más rápida?",
          options: ["Oral", "Intramuscular", "Intravenosa", "Subcutánea"],
          correctAnswer: 2,
          explanation: "La vía intravenosa es la más rápida al acceder directamente a la circulación."
        },
        {
          id: "t2-q3",
          question: "¿Qué significa DL50?",
          options: ["Dosis letal 50%", "Dosis límite 50%", "Dosis libre 50%", "Dosis local 50%"],
          correctAnswer: 0,
          explanation: "DL50 es la dosis que causa la muerte al 50% de los animales de experimentación."
        },
        {
          id: "t2-q4",
          question: "¿Qué es un antagonista farmacológico?",
          options: ["Fármaco que potencia efectos", "Fármaco que bloquea efectos", "Fármaco sin efectos", "F��rmaco tóxico"],
          correctAnswer: 1,
          explanation: "Un antagonista es un fármaco que bloquea o reduce los efectos de otro."
        },
        {
          id: "t2-q5",
          question: "¿Cuál es el antídoto de la warfarina?",
          options: ["Vitamina K", "Vitamina C", "Protamina", "Naloxona"],
          correctAnswer: 0,
          explanation: "La vitamina K es el antídoto específico para la warfarina."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Patología General",
      tests: [
        {
          id: "t3-q1",
          question: "¿Qué es la inflamación?",
          options: ["Infección bacteriana", "Respuesta defensiva del organismo", "Muerte celular", "Crecimiento tumoral"],
          correctAnswer: 1,
          explanation: "La inflamación es una respuesta defensiva del organismo ante una agresión."
        },
        {
          id: "t3-q2",
          question: "¿Cuáles son los signos clásicos de la inflamación?",
          options: ["Dolor, calor, rubor, tumor y pérdida de función", "Solo dolor y fiebre", "Hinchazón únicamente", "Enrojecimiento y calor"],
          correctAnswer: 0,
          explanation: "Los cinco signos clásicos son dolor, calor, rubor (enrojecimiento), tumor (hinchazón) y pérdida de función."
        },
        {
          id: "t3-q3",
          question: "¿Qué es la necrosis?",
          options: ["Crecimiento celular", "Muerte celular patológica", "División celular", "Reparación celular"],
          correctAnswer: 1,
          explanation: "La necrosis es la muerte celular patológica por daño severo."
        },
        {
          id: "t3-q4",
          question: "¿Qué diferencia hay entre tumor benigno y maligno?",
          options: ["El tamaño", "La capacidad de invasión y metástasis", "El color", "La localización"],
          correctAnswer: 1,
          explanation: "Los tumores malignos tienen capacidad de invasión local y metástasis a distancia."
        },
        {
          id: "t3-q5",
          question: "¿Qué es la hipoxia?",
          options: ["Exceso de oxígeno", "Falta de oxígeno", "Exceso de CO2", "Falta de glucosa"],
          correctAnswer: 1,
          explanation: "La hipoxia es la disminución del suministro de oxígeno a los tejidos."
        }
      ]
    }
  ],

  "inspeccion-hacienda": [
    {
      themeId: "tema-1",
      themeName: "Sistema Tributario Español",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuál es el impuesto directo más importante en España?",
          options: ["IVA", "IRPF", "Impuestos Especiales", "Sociedades"],
          correctAnswer: 1,
          explanation: "El IRPF (Impuesto sobre la Renta de las Personas Físicas) es el impuesto directo más importante."
        },
        {
          id: "t1-q2",
          question: "¿Qué porcentaje de IVA general se aplica en España?",
          options: ["18%", "19%", "21%", "23%"],
          correctAnswer: 2,
          explanation: "El tipo general del IVA en España es del 21%."
        },
        {
          id: "t1-q3",
          question: "¿Cuál es el plazo general para la prescripción de las deudas tributarias?",
          options: ["3 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "El plazo general de prescripción de las deudas tributarias es de 4 años."
        },
        {
          id: "t1-q4",
          question: "¿Qué organismo gestiona el IRPF?",
          options: ["IGAE", "AEAT", "Seguridad Social", "Banco de España"],
          correctAnswer: 1,
          explanation: "La AEAT (Agencia Estatal de Administración Tributaria) gestiona el IRPF."
        },
        {
          id: "t1-q5",
          question: "¿Cuándo se presenta la declaración anual del IRPF?",
          options: ["De abril a junio", "De enero a marzo", "De mayo a julio", "Todo el año"],
          correctAnswer: 0,
          explanation: "La campaña de IRPF se realiza habitualmente de abril a junio."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Procedimientos de Inspección",
      tests: [
        {
          id: "t2-q1",
          question: "¿Qué es una actuación inspectora?",
          options: ["Solo comprobar documentos", "Verificar situación tributaria del obligado", "Cobrar impuestos", "Asesorar al contribuyente"],
          correctAnswer: 1,
          explanation: "La actuación inspectora verifica la situación tributaria del obligado tributario."
        },
        {
          id: "t2-q2",
          question: "¿Cuál es el plazo máximo de una actuación inspectora?",
          options: ["6 meses", "12 meses", "18 meses", "24 meses"],
          correctAnswer: 2,
          explanation: "El plazo máximo de las actuaciones inspectoras es de 18 meses."
        },
        {
          id: "t2-q3",
          question: "¿Qué es el acta de conformidad?",
          options: ["Documento de inicio", "Acuerdo del contribuyente con la propuesta", "Resolución final", "Recurso del obligado"],
          correctAnswer: 1,
          explanation: "El acta de conformidad refleja el acuerdo del contribuyente con la propuesta de regularización."
        },
        {
          id: "t2-q4",
          question: "¿Pueden los inspectores acceder a domicilios privados?",
          options: ["Siempre", "Nunca", "Solo con autorización judicial", "Solo de día"],
          correctAnswer: 2,
          explanation: "Para acceder a domicilios privados se requiere autorización judicial."
        },
        {
          id: "t2-q5",
          question: "¿Qué es una comprobación de valores?",
          options: ["Verificar el valor de bienes inmuebles", "Comprobar la identidad", "Verificar documentos", "Comprobar pagos"],
          correctAnswer: 0,
          explanation: "La comprobación de valores verifica el valor real de bienes, especialmente inmuebles."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Infracciones y Sanciones",
      tests: [
        {
          id: "t3-q1",
          question: "¿Cuáles son los tipos de infracciones tributarias?",
          options: ["Solo graves", "Leves y graves", "Leves, graves y muy graves", "Graves y muy graves"],
          correctAnswer: 2,
          explanation: "Las infracciones tributarias se clasifican en leves, graves y muy graves."
        },
        {
          id: "t3-q2",
          question: "¿Cuál es la sanción por no presentar declaraciones?",
          options: ["150€ fijos", "Entre 150€ y 600€", "10% de la cuota", "20% de la cuota"],
          correctAnswer: 1,
          explanation: "La sanción por no presentar declaraciones oscila entre 150€ y 600��."
        },
        {
          id: "t3-q3",
          question: "¿Qué es el recargo de apremio?",
          options: ["Un interés", "Una sanción por no pagar en plazo", "Un impuesto adicional", "Una tasa administrativa"],
          correctAnswer: 1,
          explanation: "El recargo de apremio es una sanción que se aplica por no pagar en el período voluntario."
        },
        {
          id: "t3-q4",
          question: "¿Cuándo prescribe una sanción tributaria?",
          options: ["2 años", "3 años", "4 años", "5 años"],
          correctAnswer: 2,
          explanation: "Las sanciones tributarias prescriben a los 4 años."
        },
        {
          id: "t3-q5",
          question: "¿Qué es la conformidad sancionadora?",
          options: ["Recurso contra sanción", "Aceptación de la sanción con reducción", "Aplazamiento de pago", "Anulación de sanción"],
          correctAnswer: 1,
          explanation: "La conformidad sancionadora permite aceptar la sanción con una reducción del 25%."
        }
      ]
    }
  ],

  "auxiliar-enfermeria": [
    {
      themeId: "tema-1",
      themeName: "Anatomía y Fisiología Básica",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuáles son los signos vitales básicos?",
          options: ["Solo temperatura y pulso", "Temperatura, pulso, respiración y tensión arterial", "Solo tensión arterial", "Temperatura y respiración"],
          correctAnswer: 1,
          explanation: "Los signos vitales básicos son temperatura, pulso, respiración y tensión arterial."
        },
        {
          id: "t1-q2",
          question: "¿Cuál es la frecuencia cardíaca normal en adultos?",
          options: ["40-60 lpm", "60-100 lpm", "100-120 lpm", "120-140 lpm"],
          correctAnswer: 1,
          explanation: "La frecuencia cardíaca normal en adultos es de 60-100 latidos por minuto."
        },
        {
          id: "t1-q3",
          question: "¿Cuál es la temperatura corporal normal?",
          options: ["35°C", "36-37°C", "38°C", "39°C"],
          correctAnswer: 1,
          explanation: "La temperatura corporal normal oscila entre 36-37°C."
        },
        {
          id: "t1-q4",
          question: "¿Cuántas respiraciones por minuto son normales en adultos?",
          options: ["8-12", "12-20", "20-30", "30-40"],
          correctAnswer: 1,
          explanation: "La frecuencia respiratoria normal en adultos es de 12-20 respiraciones por minuto."
        },
        {
          id: "t1-q5",
          question: "¿Qué es la tensión arterial sistólica?",
          options: ["Presión durante la relajación cardíaca", "Presión durante la contracción cardíaca", "Presión en las venas", "Presión en los capilares"],
          correctAnswer: 1,
          explanation: "La tensión sistólica es la presión máxima durante la contracción del corazón."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Cuidados Básicos de Enfermería",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuáles son las medidas de asepsia básicas?",
          options: ["Solo lavado de manos", "Lavado de manos y uso de guantes", "Lavado de manos, guantes y mascarilla", "Todas las medidas de protección"],
          correctAnswer: 3,
          explanation: "Las medidas de asepsia incluyen lavado de manos, guantes, mascarilla y otras medidas de protección según el caso."
        },
        {
          id: "t2-q2",
          question: "¿Cuánto tiempo debe durar el lavado de manos clínico?",
          options: ["10-15 segundos", "20-30 segundos", "40-60 segundos", "2 minutos"],
          correctAnswer: 2,
          explanation: "El lavado de manos clínico debe durar entre 40-60 segundos."
        },
        {
          id: "t2-q3",
          question: "¿Qué posición se recomienda para prevenir las úlceras por presión?",
          options: ["Cambios posturales cada 4 horas", "Cambios posturales cada 2 horas", "No mover al paciente", "Solo posición supina"],
          correctAnswer: 1,
          explanation: "Se recomienda realizar cambios posturales cada 2 horas para prevenir úlceras por presión."
        },
        {
          id: "t2-q4",
          question: "¿Cuál es la técnica correcta para tomar la tensión arterial?",
          options: ["Brazo por debajo del corazón", "Brazo a la altura del corazón", "Brazo por encima del corazón", "Posición indiferente"],
          correctAnswer: 1,
          explanation: "El brazo debe estar a la altura del corazón para una medición correcta."
        },
        {
          id: "t2-q5",
          question: "¿Qué es la escala de Norton?",
          options: ["Valoración del dolor", "Valoración del riesgo de úlceras por presión", "Valoración nutricional", "Valoración mental"],
          correctAnswer: 1,
          explanation: "La escala de Norton valora el riesgo de desarrollar úlceras por presión."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Higiene y Alimentación",
      tests: [
        {
          id: "t3-q1",
          question: "¿Cuál es el orden correcto para el aseo del paciente encamado?",
          options: ["Pies a cabeza", "Cabeza a pies", "Zona genital primero", "Orden indiferente"],
          correctAnswer: 1,
          explanation: "El aseo se realiza de la zona más limpia a la más sucia, de cabeza a pies."
        },
        {
          id: "t3-q2",
          question: "¿Con qué frecuencia se debe realizar la higiene bucal en pacientes dependientes?",
          options: ["Una vez al día", "Después de cada comida", "Solo si hay problemas", "Una vez a la semana"],
          correctAnswer: 1,
          explanation: "La higiene bucal debe realizarse después de cada comida y antes de dormir."
        },
        {
          id: "t3-q3",
          question: "¿Qué dieta se prescribe antes de una colonoscopia?",
          options: ["Dieta normal", "Dieta líquida", "Dieta sin residuos", "Ayuno absoluto"],
          correctAnswer: 2,
          explanation: "Antes de una colonoscopia se prescribe dieta sin residuos para limpiar el intestino."
        },
        {
          id: "t3-q4",
          question: "¿Cuáles son los signos de deshidratación?",
          options: ["Solo sed", "Sed, sequedad de mucosas y oliguria", "Solo disminución de la orina", "Sudoración excesiva"],
          correctAnswer: 1,
          explanation: "Los signos de deshidratación incluyen sed, sequedad de mucosas y oliguria (poca orina)."
        },
        {
          id: "t3-q5",
          question: "¿Qué es una sonda nasogástrica?",
          options: ["Tubo para respiración", "Tubo para alimentación o drenaje gástrico", "Catéter venoso", "Tubo para diálisis"],
          correctAnswer: 1,
          explanation: "La sonda nasogástrica es un tubo que se introduce por la nariz hasta el estómago para alimentación o drenaje."
        }
      ]
    }
  ],

  "tecnicos-auditoria-contabilidad": [
    {
      themeId: "tema-1",
      themeName: "Contabilidad General",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuál es la ecuación fundamental de la contabilidad?",
          options: ["Activo = Pasivo + Patrimonio", "Ingresos = Gastos + Beneficio", "Activo = Pasivo - Patrimonio", "Ventas = Costes + Margen"],
          correctAnswer: 0,
          explanation: "La ecuación fundamental es Activo = Pasivo + Patrimonio Neto."
        },
        {
          id: "t1-q2",
          question: "¿Qué es el principio del devengo?",
          options: ["Registrar cuando se cobra", "Registrar cuando se produce el hecho", "Registrar al final del ejercicio", "Registrar solo ingresos"],
          correctAnswer: 1,
          explanation: "El principio del devengo establece que se registren los hechos económicos cuando se producen, independientemente del cobro o pago."
        },
        {
          id: "t1-q3",
          question: "¿Cuáles son las masas patrimoniales básicas?",
          options: ["Solo activo y pasivo", "Activo, pasivo y patrimonio neto", "Ingresos y gastos", "Activo corriente y no corriente"],
          correctAnswer: 1,
          explanation: "Las masas patrimoniales básicas son Activo, Pasivo y Patrimonio Neto."
        },
        {
          id: "t1-q4",
          question: "¿Qué refleja la cuenta de pérdidas y ganancias?",
          options: ["Situación patrimonial", "Resultado del ejercicio", "Flujos de efectivo", "Cambios en el patrimonio"],
          correctAnswer: 1,
          explanation: "La cuenta de pérdidas y ganancias refleja el resultado (beneficio o pérdida) del ejercicio."
        },
        {
          id: "t1-q5",
          question: "¿Cuándo se considera un activo como corriente?",
          options: ["Siempre", "Si se espera realizar en más de un año", "Si se espera realizar en un año", "Solo si es efectivo"],
          correctAnswer: 2,
          explanation: "Un activo es corriente si se espera realizar, vender o consumir en el ciclo normal de explotación (generalmente un año)."
        },
        {
          id: "t1-q6",
          question: "¿Qué es el principio de prudencia en contabilidad?",
          options: ["Registrar solo beneficios", "Registrar pérdidas probables y beneficios realizados", "No registrar nada incierto", "Registrar todo optimista"],
          correctAnswer: 1,
          explanation: "El principio de prudencia establece que se registren las pérdidas cuando sean probables y los beneficios solo cuando estén realizados."
        },
        {
          id: "t1-q7",
          question: "¿Cuál es la diferencia entre gasto y pago?",
          options: ["Son lo mismo", "Gasto es cuando se consume, pago cuando se abona", "Gasto es menor que pago", "No hay diferencia"],
          correctAnswer: 1,
          explanation: "El gasto se registra cuando se consume el recurso, el pago cuando se desembolsa el dinero."
        },
        {
          id: "t1-q8",
          question: "¿Qué son las provisiones contables?",
          options: ["Reservas de beneficios", "Pasivos de importe o vencimiento incierto", "Activos futuros", "Gastos ya pagados"],
          correctAnswer: 1,
          explanation: "Las provisiones son pasivos de importe o vencimiento incierto."
        },
        {
          id: "t1-q9",
          question: "¿Cuándo se debe amortizar un activo?",
          options: ["Nunca", "Solo al final", "Sistemáticamente durante su vida útil", "Solo cuando se venda"],
          correctAnswer: 2,
          explanation: "La amortización debe realizarse sistemáticamente durante la vida útil del activo."
        },
        {
          id: "t1-q10",
          question: "¿Qué es el fondo de maniobra?",
          options: ["Activo corriente menos pasivo corriente", "Total activo", "Solo efectivo", "Pasivo total"],
          correctAnswer: 0,
          explanation: "El fondo de maniobra es la diferencia entre activo corriente y pasivo corriente."
        },
        {
          id: "t1-q11",
          question: "¿Cuál es el criterio de valoración inicial de activos?",
          options: ["Valor razonable", "Coste histórico", "Valor de mercado", "Precio de venta"],
          correctAnswer: 1,
          explanation: "Los activos se valoran inicialmente por su coste histórico o coste de adquisición."
        },
        {
          id: "t1-q12",
          question: "¿Qué son los activos intangibles?",
          options: ["Solo patentes", "Activos sin sustancia física identificables", "Gastos diferidos", "Inversiones financieras"],
          correctAnswer: 1,
          explanation: "Los activos intangibles son activos no monetarios sin sustancia física identificables."
        },
        {
          id: "t1-q13",
          question: "¿Cuándo se reconoce un activo por impuesto diferido?",
          options: ["Nunca", "Cuando sea probable su recuperación", "Siempre", "Solo en pérdidas"],
          correctAnswer: 1,
          explanation: "Se reconoce cuando sea probable que se generen ganancias fiscales futuras suficientes."
        },
        {
          id: "t1-q14",
          question: "¿Qué es el deterioro de valor de un activo?",
          options: ["Amortización", "Pérdida cuando el valor contable supera al recuperable", "Venta del activo", "Provisión"],
          correctAnswer: 1,
          explanation: "El deterioro es la pérdida de valor cuando el importe en libros supera al importe recuperable."
        },
        {
          id: "t1-q15",
          question: "¿Cuáles son los elementos de las cuentas anuales?",
          options: ["Solo balance", "Balance, PyG, patrimonio neto, flujos efectivo, memoria", "Solo PyG", "Balance y PyG"],
          correctAnswer: 1,
          explanation: "Las cuentas anuales incluyen balance, cuenta de PyG, estado de cambios en el patrimonio neto, estado de flujos de efectivo y memoria."
        },
        {
          id: "t1-q16",
          question: "¿Qué es una cuenta de orden?",
          options: ["Cuenta normal", "Registro de compromisos futuros", "Solo activos", "Cuenta de resultados"],
          correctAnswer: 1,
          explanation: "Las cuentas de orden registran hechos que no afectan al patrimonio pero crean compromisos futuros."
        },
        {
          id: "t1-q17",
          question: "¿Cuándo se considera que una empresa está en funcionamiento?",
          options: ["Solo el primer año", "Cuando puede continuar operando en futuro previsible", "Solo con beneficios", "Siempre"],
          correctAnswer: 1,
          explanation: "El principio de empresa en funcionamiento asume que la entidad continuará operando en el futuro previsible."
        },
        {
          id: "t1-q18",
          question: "¿Qué son los ajustes por periodificación?",
          options: ["Errores contables", "Ajustes para imputar ingresos y gastos al período correspondiente", "Solo al final del año", "Correcciones"],
          correctAnswer: 1,
          explanation: "Son ajustes para imputar correctamente ingresos y gastos al período que corresponden."
        },
        {
          id: "t1-q19",
          question: "¿Cuál es la diferencia entre reservas y resultados acumulados?",
          options: ["No hay diferencia", "Reservas son beneficios apropiados, resultados son pendientes", "Solo terminología", "Reservas son pérdidas"],
          correctAnswer: 1,
          explanation: "Las reservas son beneficios retenidos que han sido apropiados, los resultados acumulados están pendientes de aplicación."
        },
        {
          id: "t1-q20",
          question: "¿Qué información debe revelar la memoria de las cuentas anuales?",
          options: ["Solo criterios contables", "Información complementaria y aclaratoria", "Solo errores", "Previsiones futuras"],
          correctAnswer: 1,
          explanation: "La memoria debe contener información complementaria y aclaratoria de los otros documentos que componen las cuentas anuales."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Auditoría Pública",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuál es el objetivo principal de la auditoría pública?",
          options: ["Detectar fraudes", "Verificar la legalidad y eficiencia del gasto público", "Calcular impuestos", "Aprobar presupuestos"],
          correctAnswer: 1,
          explanation: "La auditoría pública verifica la legalidad, eficiencia y eficacia en el uso de los recursos públicos."
        },
        {
          id: "t2-q2",
          question: "¿Qué es el Tribunal de Cuentas?",
          options: ["Un juzgado", "Órgano supremo de fiscalización", "Banco central", "Ministerio de Hacienda"],
          correctAnswer: 1,
          explanation: "El Tribunal de Cuentas es el órgano supremo de fiscalización de las cuentas y gestión económica del Estado."
        },
        {
          id: "t2-q3",
          question: "¿Qué tipos de auditoría existen en el sector público?",
          options: ["Solo financiera", "Financiera y de cumplimiento", "Financiera, cumplimiento y operativa", "Solo operativa"],
          correctAnswer: 2,
          explanation: "En el sector público existen auditorías financiera, de cumplimiento y operativa (de gestión)."
        },
        {
          id: "t2-q4",
          question: "¿Qu�� es una auditoría de cumplimiento?",
          options: ["Verificar estados financieros", "Verificar cumplimiento de normas", "Medir eficiencia", "Calcular rentabilidad"],
          correctAnswer: 1,
          explanation: "La auditoría de cumplimiento verifica que las actividades se ajusten a las normas y procedimientos aplicables."
        },
        {
          id: "t2-q5",
          question: "¿Cuál es la diferencia entre eficiencia y eficacia?",
          options: ["Son lo mismo", "Eficiencia es hacer bien, eficacia es hacer lo correcto", "Eficiencia es rapidez, eficacia es calidad", "No hay diferencia práctica"],
          correctAnswer: 1,
          explanation: "Eficiencia es hacer las cosas bien (optimizar recursos), eficacia es hacer las cosas correctas (lograr objetivos)."
        },
        {
          id: "t2-q6",
          question: "¿Cuáles son las fases de una auditoría pública?",
          options: ["Solo ejecución", "Planificación, ejecución e informe", "Solo planificación", "Inicio y fin"],
          correctAnswer: 1,
          explanation: "Las fases principales son planificación, ejecución del trabajo de campo y elaboración del informe."
        },
        {
          id: "t2-q7",
          question: "¿Qué es la auditoría operativa o de gestión?",
          options: ["Solo verificar cuentas", "Evaluar economía, eficiencia y eficacia", "Control de personal", "Revisión legal"],
          correctAnswer: 1,
          explanation: "La auditoría operativa evalúa la economía, eficiencia y eficacia de las operaciones."
        },
        {
          id: "t2-q8",
          question: "¿Quién puede realizar auditorías en el sector público español?",
          options: ["Solo el Tribunal de Cuentas", "Tribunal de Cuentas, IGAE y órganos autonómicos", "Solo auditores privados", "Cualquier funcionario"],
          correctAnswer: 1,
          explanation: "Pueden realizarlas el Tribunal de Cuentas, la IGAE y los órganos de control externo autonómicos."
        },
        {
          id: "t2-q9",
          question: "¿Qué es el informe de auditoría?",
          options: ["Documento inicial", "Comunicación final con conclusiones y recomendaciones", "Solo errores encontrados", "Presupuesto de auditoría"],
          correctAnswer: 1,
          explanation: "Es el documento final que comunica los resultados, conclusiones y recomendaciones de la auditoría."
        },
        {
          id: "t2-q10",
          question: "¿Cuál es el papel de la IGAE en el control público?",
          options: ["Solo contabilidad", "Control interno de la gestión económico-financiera", "Solo auditoría externa", "Control de personal"],
          correctAnswer: 1,
          explanation: "La IGAE ejerce el control interno de la gestión económico-financiera del Estado."
        },
        {
          id: "t2-q11",
          question: "¿Qué son las evidencias de auditoría?",
          options: ["Solo documentos", "Información que sustenta las conclusiones", "Errores encontrados", "Recomendaciones"],
          correctAnswer: 1,
          explanation: "Las evidencias son toda la información que utiliza el auditor para sustentar sus conclusiones."
        },
        {
          id: "t2-q12",
          question: "¿Cuándo es independiente un auditor?",
          options: ["Siempre", "Cuando no tiene conflictos de interés", "Solo si es externo", "Nunca en el sector público"],
          correctAnswer: 1,
          explanation: "La independencia requiere ausencia de conflictos de interés que comprometan la objetividad."
        },
        {
          id: "t2-q13",
          question: "��Qué es el riesgo de auditoría?",
          options: ["Solo errores", "Probabilidad de emitir opinión inadecuada", "Riesgo del auditado", "Coste de la auditoría"],
          correctAnswer: 1,
          explanation: "Es el riesgo de que el auditor emita una opinión de auditor��a inadecuada."
        },
        {
          id: "t2-q14",
          question: "¿Cuáles son los estándares internacionales de auditoría pública?",
          options: ["Solo nacionales", "ISSAI emitidas por INTOSAI", "Solo europeos", "Cada país los suyos"],
          correctAnswer: 1,
          explanation: "Las ISSAI (International Standards of Supreme Audit Institutions) emitidas por INTOSAI."
        },
        {
          id: "t2-q15",
          question: "��Qué es la materialidad en auditoría?",
          options: ["Solo documentos f��sicos", "Magnitud de error que influye en decisiones", "Importancia legal", "Valor monetario total"],
          correctAnswer: 1,
          explanation: "La materialidad es la magnitud de las incorrecciones que podrían influir en las decisiones de los usuarios."
        },
        {
          id: "t2-q16",
          question: "¿Cuál es el seguimiento de las recomendaciones de auditoría?",
          options: ["No se hace seguimiento", "Verificar implementación de mejoras", "Solo informar", "Sancionar incumplimientos"],
          correctAnswer: 1,
          explanation: "El seguimiento verifica si se han implementado las recomendaciones y mejoras propuestas."
        },
        {
          id: "t2-q17",
          question: "¿Qué es una auditoría de sistemas de información?",
          options: ["Solo hardware", "Evaluaci��n de controles en sistemas informáticos", "Solo software", "Reparación de equipos"],
          correctAnswer: 1,
          explanation: "Evalúa los controles y la seguridad de los sistemas de información."
        },
        {
          id: "t2-q18",
          question: "¿Cuándo debe comunicarse un hallazgo de auditoría?",
          options: ["Solo al final", "Cuando sea significativo durante el proceso", "Nunca durante el proceso", "Solo si es fraude"],
          correctAnswer: 1,
          explanation: "Los hallazgos significativos deben comunicarse oportunamente durante el proceso de auditoría."
        },
        {
          id: "t2-q19",
          question: "¿Qu�� es la auditoría forense en el sector público?",
          options: ["Solo medicina legal", "Investigación de fraudes y corrupción", "Solo informática", "Auditoría normal"],
          correctAnswer: 1,
          explanation: "La auditoría forense investiga posibles fraudes, corrupción o irregularidades económicas."
        },
        {
          id: "t2-q20",
          question: "¿Cuál es la responsabilidad del gestor público ante la auditor��a?",
          options: ["Solo facilitar información", "Colaborar y responder a recomendaciones", "Rechazar la auditoría", "Solo pagar costes"],
          correctAnswer: 1,
          explanation: "Los gestores deben colaborar activamente y responder adecuadamente a las recomendaciones de auditoría."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Control Interno y Riesgos",
      tests: [
        {
          id: "t3-q1",
          question: "¿Qué es el control interno?",
          options: ["Solo procedimientos contables", "Sistema de verificación externa", "Proceso para asegurar objetivos organizacionales", "Control de inventarios"],
          correctAnswer: 2,
          explanation: "El control interno es un proceso diseñado para proporcionar seguridad razonable sobre el logro de objetivos organizacionales."
        },
        {
          id: "t3-q2",
          question: "¿Cuáles son los componentes del control interno según COSO?",
          options: ["3 componentes", "4 componentes", "5 componentes", "6 componentes"],
          correctAnswer: 2,
          explanation: "COSO establece 5 componentes: ambiente de control, evaluación de riesgos, actividades de control, información y comunicación, y monitoreo."
        },
        {
          id: "t3-q3",
          question: "¿Qué es la segregación de funciones?",
          options: ["Dividir el trabajo", "Separar funciones incompatibles", "Crear departamentos", "Asignar responsabilidades"],
          correctAnswer: 1,
          explanation: "La segregación de funciones separa tareas incompatibles para prevenir errores y fraudes."
        },
        {
          id: "t3-q4",
          question: "¿Qué es el riesgo inherente?",
          options: ["Riesgo después de controles", "Riesgo antes de controles", "Riesgo de detección", "Riesgo operativo"],
          correctAnswer: 1,
          explanation: "El riesgo inherente es la posibilidad de error material antes de considerar los controles internos."
        },
        {
          id: "t3-q5",
          question: "¿Cu��l es el objetivo de las pruebas de cumplimiento?",
          options: ["Detectar errores", "Evaluar la efectividad de los controles", "Calcular riesgos", "Medir rendimiento"],
          correctAnswer: 1,
          explanation: "Las pruebas de cumplimiento evalúan si los controles internos funcionan efectivamente durante el período."
        },
        {
          id: "t3-q6",
          question: "¿Qué es el ambiente de control?",
          options: ["Solo políticas", "Base de todos los demás componentes de control", "Control físico", "Solo procedimientos"],
          correctAnswer: 1,
          explanation: "El ambiente de control es la base de todos los demás componentes, estableciendo el tono organizacional."
        },
        {
          id: "t3-q7",
          question: "¿Cuáles son los tipos de riesgo en una organización?",
          options: ["Solo financieros", "Estratégicos, operacionales, información y cumplimiento", "Solo operacionales", "Solo de cumplimiento"],
          correctAnswer: 1,
          explanation: "Los riesgos se clasifican en estratégicos, operacionales, de información y de cumplimiento."
        },
        {
          id: "t3-q8",
          question: "¿Qué es la tolerancia al riesgo?",
          options: ["Aceptar todo riesgo", "Nivel aceptable de variación respecto a objetivos", "Rechazar todo riesgo", "Ignorar riesgos"],
          correctAnswer: 1,
          explanation: "La tolerancia al riesgo es el nivel aceptable de variación que la organización está dispuesta a aceptar."
        },
        {
          id: "t3-q9",
          question: "¿Cuáles son las respuestas posibles al riesgo?",
          options: ["Solo aceptar", "Evitar, reducir, compartir o aceptar", "Solo evitar", "Solo reducir"],
          correctAnswer: 1,
          explanation: "Las respuestas al riesgo son: evitar, reducir, compartir (transferir) o aceptar."
        },
        {
          id: "t3-q10",
          question: "¿Qué son los controles preventivos?",
          options: ["Detectan errores", "Previenen la ocurrencia de errores", "Corrigen errores", "Solo supervisan"],
          correctAnswer: 1,
          explanation: "Los controles preventivos están diseñados para prevenir la ocurrencia de errores o irregularidades."
        },
        {
          id: "t3-q11",
          question: "¿Qué son los controles detectivos?",
          options: ["Previenen errores", "Identifican errores después de ocurrir", "Solo corrigen", "Solo supervisan"],
          correctAnswer: 1,
          explanation: "Los controles detectivos identifican errores o irregularidades después de que han ocurrido."
        },
        {
          id: "t3-q12",
          question: "¿Qué es el monitoreo de controles?",
          options: ["Solo observar", "Evaluación continua de la efectividad", "Control final", "Solo al año"],
          correctAnswer: 1,
          explanation: "El monitoreo evalúa de forma continua la calidad y efectividad del sistema de control interno."
        },
        {
          id: "t3-q13",
          question: "¿Cuál es la responsabilidad del control interno?",
          options: ["Solo de auditores", "De toda la organización", "Solo de la dirección", "Solo del área financiera"],
          correctAnswer: 1,
          explanation: "El control interno es responsabilidad de todos los miembros de la organización."
        },
        {
          id: "t3-q14",
          question: "¿Qué es un mapa de riesgos?",
          options: ["Solo ubicación geográfica", "Representaci��n visual de riesgos y su impacto", "Lista de riesgos", "Solo riesgos financieros"],
          correctAnswer: 1,
          explanation: "Un mapa de riesgos es una representación visual que muestra los riesgos según su probabilidad e impacto."
        },
        {
          id: "t3-q15",
          question: "¿Qué son los indicadores de riesgo clave (KRI)?",
          options: ["Solo métricas financieras", "Métricas que señalan cambios en el perfil de riesgo", "Solo indicadores de control", "Métricas de desempeño"],
          correctAnswer: 1,
          explanation: "Los KRI son métricas que proporcionan señales tempranas de cambios en el perfil de riesgo."
        },
        {
          id: "t3-q16",
          question: "¿Qué es la gestión integral de riesgos?",
          options: ["Solo riesgos financieros", "Enfoque holístico de todos los riesgos", "Solo seguros", "Control específico"],
          correctAnswer: 1,
          explanation: "Es un enfoque holístico que considera todos los riesgos de forma integrada en la organización."
        },
        {
          id: "t3-q17",
          question: "¿Cuál es la diferencia entre riesgo residual y riesgo inherente?",
          options: ["No hay diferencia", "Residual es después de controles, inherente antes", "Solo terminología", "Residual es menor"],
          correctAnswer: 1,
          explanation: "El riesgo residual es el que permanece después de aplicar controles, el inherente es antes de controles."
        },
        {
          id: "t3-q18",
          question: "¿Qué es la línea de defensa en control interno?",
          options: ["Solo una línea", "Modelo de tres líneas de defensa", "Solo auditoría", "Control externo"],
          correctAnswer: 1,
          explanation: "El modelo establece tres líneas: gestión operacional, funciones de control y auditoría interna."
        },
        {
          id: "t3-q19",
          question: "¿Cuál es el rol de la auditoría interna en el control?",
          options: ["Primera línea", "Segunda línea", "Tercera línea de defensa", "Externa a las l��neas"],
          correctAnswer: 2,
          explanation: "La auditor��a interna constituye la tercera línea de defensa, proporcionando aseguramiento independiente."
        },
        {
          id: "t3-q20",
          question: "¿Qué es la cultura de riesgo en una organización?",
          options: ["Solo políticas", "Conjunto de valores y comportamientos hacia el riesgo", "Solo procedimientos", "Control estricto"],
          correctAnswer: 1,
          explanation: "La cultura de riesgo es el conjunto de valores, percepciones y comportamientos relacionados con la gestión de riesgos."
        }
      ]
    },
    {
      themeId: "tema-4",
      themeName: "Normas Internacionales de Contabilidad",
      tests: [
        {
          id: "t4-q1",
          question: "¿Qué organismo emite las NIIF?",
          options: ["FASB", "IASB", "AICPA", "SEC"],
          correctAnswer: 1,
          explanation: "El IASB (International Accounting Standards Board) es el organismo que emite las NIIF."
        },
        {
          id: "t4-q2",
          question: "¿Cuál es el objetivo de las NIIF?",
          options: ["Solo para grandes empresas", "Información financiera de alta calidad y comparable", "Reducir costes", "Solo para bancos"],
          correctAnswer: 1,
          explanation: "Las NIIF buscan que la información financiera sea de alta calidad, comprensible y comparable internacionalmente."
        },
        {
          id: "t4-q3",
          question: "¿Qué es el valor razonable según NIIF?",
          options: ["Coste histórico", "Precio de intercambio entre partes independientes", "Valor en libros", "Precio de compra"],
          correctAnswer: 1,
          explanation: "El valor razonable es el precio recibido por vender un activo o pagado por transferir un pasivo en una transacción ordenada."
        },
        {
          id: "t4-q4",
          question: "¿Cuándo debe aplicarse la NIC 36 sobre deterioro?",
          options: ["Solo al final del año", "Cuando hay indicios de deterioro", "Siempre", "Solo para activos financieros"],
          correctAnswer: 1,
          explanation: "La NIC 36 debe aplicarse cuando existen indicios de que un activo puede estar deteriorado."
        },
        {
          id: "t4-q5",
          question: "¿Qué establece la NIC 16 sobre activos fijos?",
          options: ["Solo valoración inicial", "Reconocimiento, valoración y información", "Solo amortización", "Solo venta"],
          correctAnswer: 1,
          explanation: "La NIC 16 establece el tratamiento contable del inmovilizado material: reconocimiento, valoración y revelación."
        },
        {
          id: "t4-q6",
          question: "¿Cuál es la diferencia entre NIC y NIIF?",
          options: ["No hay diferencia", "NIC son anteriores, NIIF posteriores a 2001", "Solo el nombre", "NIC son nacionales"],
          correctAnswer: 1,
          explanation: "Las NIC fueron emitidas antes de 2001, las NIIF después de esa fecha por el IASB."
        },
        {
          id: "t4-q7",
          question: "¿Qué regula la NIIF 15?",
          options: ["Inventarios", "Ingresos de actividades ordinarias con clientes", "Activos fijos", "Instrumentos financieros"],
          correctAnswer: 1,
          explanation: "La NIIF 15 establece los principios para el reconocimiento de ingresos de contratos con clientes."
        },
        {
          id: "t4-q8",
          question: "¿Cuáles son los componentes del resultado integral?",
          options: ["Solo resultado del período", "Resultado del período y otro resultado integral", "Solo ingresos", "Solo cambios patrimoniales"],
          correctAnswer: 1,
          explanation: "El resultado integral incluye el resultado del período y las partidas de otro resultado integral."
        },
        {
          id: "t4-q9",
          question: "¿Qué es una entidad de inversión según NIIF?",
          options: ["Cualquier empresa", "Entidad que obtiene fondos para invertir", "Solo fondos de inversión", "Solo bancos"],
          correctAnswer: 1,
          explanation: "Una entidad de inversión obtiene fondos de inversores para proporcionarles servicios de gestión de inversiones."
        },
        {
          id: "t4-q10",
          question: "¿Cuándo debe reconocerse un activo según el marco conceptual?",
          options: ["Siempre", "Cuando sea probable que genere beneficios futuros", "Solo si es tangible", "Al final del período"],
          correctAnswer: 1,
          explanation: "Un activo se reconoce cuando es probable que fluyan beneficios económicos futuros y tenga un coste que pueda medirse con fiabilidad."
        },
        {
          id: "t4-q11",
          question: "¿Qué establece la NIC 23 sobre costes por préstamos?",
          options: ["Siempre gastos", "Capitalización en activos aptos", "Solo intereses", "Nunca capitalizar"],
          correctAnswer: 1,
          explanation: "La NIC 23 requiere capitalizar los costes por préstamos directamente atribuibles a activos aptos."
        },
        {
          id: "t4-q12",
          question: "¿Cuál es el criterio de la NIC 2 para valorar inventarios?",
          options: ["Siempre FIFO", "Menor entre coste y valor neto realizable", "Solo coste", "Solo valor de mercado"],
          correctAnswer: 1,
          explanation: "Los inventarios se valoran al menor entre el coste y el valor neto realizable."
        },
        {
          id: "t4-q13",
          question: "¿Qué son los activos aptos según NIC 23?",
          options: ["Todos los activos", "Activos que requieren tiempo para estar listos", "Solo inmuebles", "Solo inventarios"],
          correctAnswer: 1,
          explanation: "Son activos que requieren necesariamente de un período sustancial antes de estar listos para su uso."
        },
        {
          id: "t4-q14",
          question: "¿Cuándo se debe reclasificar una inversión inmobiliaria?",
          options: ["Nunca", "Cuando cambie su uso", "Cada año", "Solo al vender"],
          correctAnswer: 1,
          explanation: "Se reclasifica cuando hay un cambio en el uso evidenciado por eventos específicos."
        },
        {
          id: "t4-q15",
          question: "¿Qué es una combinación de negocios según NIIF 3?",
          options: ["Cualquier compra", "Operación donde se obtiene control de un negocio", "Solo fusiones", "Compra de activos"],
          correctAnswer: 1,
          explanation: "Es una transacción en la que una adquirente obtiene el control de uno o más negocios."
        },
        {
          id: "t4-q16",
          question: "¿Cuál es el método de consolidación para filiales?",
          options: ["Proporcional", "Puesta en equivalencia", "Integración global", "Al coste"],
          correctAnswer: 2,
          explanation: "Las filiales se consolidan mediante el método de integración global."
        },
        {
          id: "t4-q17",
          question: "¿Qué establece la NIC 21 sobre efectos de variaciones en tipos de cambio?",
          options: ["Solo una moneda", "Conversión de moneda extranjera", "Solo al final del año", "No convertir"],
          correctAnswer: 1,
          explanation: "La NIC 21 establece cómo incluir las transacciones en moneda extranjera y los negocios en el extranjero."
        },
        {
          id: "t4-q18",
          question: "¿Cuándo debe revisarse la vida útil de un activo?",
          options: ["Solo al final del año", "Al menos al final de cada período anual", "Nunca", "Solo al comprarlo"],
          correctAnswer: 1,
          explanation: "La vida útil debe revisarse al menos al final de cada período anual sobre el que se informa."
        },
        {
          id: "t4-q19",
          question: "¿Qué son las NIIF para PYMES?",
          options: ["NIIF simplificadas", "Versión simplificada para pequeñas y medianas entidades", "Solo para España", "NIIF obligatorias"],
          correctAnswer: 1,
          explanation: "Es una versión simplificada de las NIIF desarrollada específicamente para pequeñas y medianas entidades."
        },
        {
          id: "t4-q20",
          question: "¿Cuál es el tratamiento de los errores fundamentales según NIC 8?",
          options: ["Ajustar resultado actual", "Ajuste retroactivo reexpresando comparativos", "No corregir", "Solo revelar"],
          correctAnswer: 1,
          explanation: "Los errores materiales de períodos anteriores se corrigen de forma retroactiva reexpresando la información comparativa."
        }
      ]
    },
    {
      themeId: "tema-5",
      themeName: "Presupuestos y Gestión Financiera Pública",
      tests: [
        {
          id: "t5-q1",
          question: "¿Cuáles son los principios presupuestarios básicos?",
          options: ["Solo anualidad", "Anualidad, unidad, universalidad y especialidad", "Solo universalidad", "Solo especialidad"],
          correctAnswer: 1,
          explanation: "Los principios básicos son anualidad, unidad, universalidad y especialidad cualitativa y cuantitativa."
        },
        {
          id: "t5-q2",
          question: "¿Qué es el principio de anualidad presupuestaria?",
          options: ["Duración indefinida", "El presupuesto tiene vigencia de un año", "Solo ingresos anuales", "Solo gastos anuales"],
          correctAnswer: 1,
          explanation: "El principio de anualidad establece que el presupuesto tiene vigencia temporal de un año."
        },
        {
          id: "t5-q3",
          question: "¿Cuándo se aprueba el presupuesto del Estado en España?",
          options: ["31 de diciembre", "Antes del 31 de diciembre", "31 de enero", "Durante el año"],
          correctAnswer: 1,
          explanation: "La Ley de Presupuestos debe aprobarse antes del 31 de diciembre del año anterior al de su aplicación."
        },
        {
          id: "t5-q4",
          question: "¿Qué órgano aprueba los Presupuestos Generales del Estado?",
          options: ["El Gobierno", "Las Cortes Generales", "El Senado", "El Tribunal de Cuentas"],
          correctAnswer: 1,
          explanation: "Las Cortes Generales examinan, enmiendan y aprueban los Presupuestos Generales del Estado."
        },
        {
          id: "t5-q5",
          question: "¿Qué es una transferencia de crédito?",
          options: ["Préstamo", "Traspaso de crédito entre partidas", "Nuevo gasto", "Ingreso adicional"],
          correctAnswer: 1,
          explanation: "Las transferencias de crédito permiten traspasar el importe de créditos disponibles entre partidas presupuestarias."
        },
        {
          id: "t5-q6",
          question: "¿Cuáles son las fases del gasto público?",
          options: ["Solo compromiso y pago", "Autorización, compromiso, reconocimiento y pago", "Solo autorización", "Solo pago"],
          correctAnswer: 1,
          explanation: "Las fases son autorización, compromiso del gasto, reconocimiento de la obligación y ordenación del pago."
        },
        {
          id: "t5-q7",
          question: "¿Qué es el compromiso de gasto?",
          options: ["Gasto realizado", "Acto que reserva la totalidad o parte del crédito", "Solo autorización", "Pago efectivo"],
          correctAnswer: 1,
          explanation: "El compromiso del gasto es el acto mediante el cual se reserva la totalidad o parte del crédito para financiar obligaciones futuras."
        },
        {
          id: "t5-q8",
          question: "¿Cuándo prescribe una obligación de pago del Estado?",
          options: ["2 años", "4 años", "5 años", "10 años"],
          correctAnswer: 1,
          explanation: "Las obligaciones del Estado prescriben a los 4 años desde su vencimiento."
        },
        {
          id: "t5-q9",
          question: "¿Qué es el remanente de crédito?",
          options: ["Crédito gastado", "Crédito disponible no utilizado", "Nuevo crédito", "Crédito anulado"],
          correctAnswer: 1,
          explanation: "El remanente de crédito es la parte de crédito disponible que no ha sido utilizada al final del ejercicio."
        },
        {
          id: "t5-q10",
          question: "¿Cuál es la estructura económica del presupuesto de gastos?",
          options: ["Solo por ministerios", "Por operaciones corrientes, capital y financieras", "Solo por programas", "Por territorios"],
          correctAnswer: 1,
          explanation: "La clasificación económica agrupa los gastos en operaciones corrientes, operaciones de capital y operaciones financieras."
        },
        {
          id: "t5-q11",
          question: "¿Qué son los créditos ampliables?",
          options: ["Créditos fijos", "Créditos que pueden incrementarse automáticamente", "Solo para emergencias", "Créditos reducibles"],
          correctAnswer: 1,
          explanation: "Los créditos ampliables pueden incrementarse automáticamente durante el ejercicio por recaudación de ingresos afectados."
        },
        {
          id: "t5-q12",
          question: "¿Cuándo puede realizarse una modificación presupuestaria?",
          options: ["Solo al inicio", "Durante el ejercicio presupuestario", "Solo al final", "Nunca"],
          correctAnswer: 1,
          explanation: "Las modificaciones presupuestarias pueden realizarse durante el ejercicio presupuestario seg��n procedimientos establecidos."
        },
        {
          id: "t5-q13",
          question: "��Qué es el déficit público?",
          options: ["Superávit", "Exceso de gastos sobre ingresos", "Solo deuda", "Equilibrio presupuestario"],
          correctAnswer: 1,
          explanation: "El déficit público es la situación en que los gastos públicos superan a los ingresos públicos."
        },
        {
          id: "t5-q14",
          question: "¿Cuál es el plazo de presentación de la Cuenta General del Estado?",
          options: ["31 de marzo", "Antes del 31 de mayo", "31 de diciembre", "31 de julio"],
          correctAnswer: 1,
          explanation: "La Cuenta General del Estado debe presentarse al Tribunal de Cuentas antes del 31 de mayo."
        },
        {
          id: "t5-q15",
          question: "¿Qué contiene la liquidación del presupuesto?",
          options: ["Solo gastos", "Derechos reconocidos y obligaciones contraídas", "Solo ingresos", "Solo previsiones"],
          correctAnswer: 1,
          explanation: "La liquidación muestra los derechos reconocidos netos y las obligaciones reconocidas netas del ejercicio."
        },
        {
          id: "t5-q16",
          question: "¿Qué son los fondos de contingencia?",
          options: ["Reservas normales", "Dotación para atender necesidades imprevistas", "Solo para emergencias", "Fondos privados"],
          correctAnswer: 1,
          explanation: "Los fondos de contingencia atienden necesidades inaplazables de carácter no discrecional y urgente."
        },
        {
          id: "t5-q17",
          question: "¿Cuál es el órgano competente para ejecutar el presupuesto?",
          options: ["Las Cortes", "El Gobierno", "El Tribunal de Cuentas", "Los ministerios"],
          correctAnswer: 1,
          explanation: "La ejecución del presupuesto corresponde al Gobierno y se realiza a través de los ministerios."
        },
        {
          id: "t5-q18",
          question: "¿Qué es el presupuesto base cero?",
          options: ["Sin ingresos", "Técnica que justifica cada gasto desde cero", "Presupuesto equilibrado", "Sin gastos"],
          correctAnswer: 1,
          explanation: "El presupuesto base cero es una técnica que requiere justificar cada partida de gasto desde cero cada año."
        },
        {
          id: "t5-q19",
          question: "¿Cuáles son los estados que integran la Cuenta General del Estado?",
          options: ["Solo liquidación", "Liquidación, resultado y situación patrimonial", "Solo deuda", "Solo ingresos"],
          correctAnswer: 1,
          explanation: "Integran la liquidación presupuestaria, cuenta del resultado económico-patrimonial y balance de situación."
        },
        {
          id: "t5-q20",
          question: "¿Qué es la regla de gasto público?",
          options: ["Gasto ilimitado", "Límite al crecimiento del gasto público", "Solo para inversión", "Reducción obligatoria"],
          correctAnswer: 1,
          explanation: "La regla de gasto establece un límite al crecimiento del gasto público coherente con la sostenibilidad fiscal."
        }
      ]
    },
    {
      themeId: "tema-6",
      themeName: "Análisis Financiero y de Estados Contables",
      tests: [
        {
          id: "t6-q1",
          question: "¿Cuáles son los principales ratios de liquidez?",
          options: ["Solo current ratio", "Current ratio, acid test, liquidez inmediata", "Solo acid test", "Solo cash ratio"],
          correctAnswer: 1,
          explanation: "Los principales ratios de liquidez son current ratio, acid test (prueba ácida) y ratio de liquidez inmediata."
        },
        {
          id: "t6-q2",
          question: "¿Qué mide el ratio de current ratio?",
          options: ["Solo efectivo", "Capacidad de pagar deudas a corto plazo", "Solo inventarios", "Solo cuentas por cobrar"],
          correctAnswer: 1,
          explanation: "El current ratio mide la capacidad de la empresa para hacer frente a sus obligaciones a corto plazo."
        },
        {
          id: "t6-q3",
          question: "¿Cómo se calcula el ROE?",
          options: ["Ventas/Activos", "Beneficio neto/Patrimonio neto", "EBIT/Activos", "Beneficio/Ventas"],
          correctAnswer: 1,
          explanation: "El ROE (Return on Equity) se calcula dividiendo el beneficio neto entre el patrimonio neto."
        },
        {
          id: "t6-q4",
          question: "¿Qué indica el ratio de endeudamiento?",
          options: ["Solo liquidez", "Proporción de deuda sobre activos totales", "Solo rentabilidad", "Solo solvencia"],
          correctAnswer: 1,
          explanation: "El ratio de endeudamiento indica la proporción de activos que están financiados con deuda."
        },
        {
          id: "t6-q5",
          question: "¿Cuáles son los componentes del análisis DuPont?",
          options: ["Solo rentabilidad", "Margen, rotación, apalancamiento", "Solo margen", "Solo rotación"],
          correctAnswer: 1,
          explanation: "El análisis DuPont descompone el ROE en margen neto, rotación de activos y apalancamiento financiero."
        },
        {
          id: "t6-q6",
          question: "¿Qué es el working capital?",
          options: ["Solo efectivo", "Activo corriente menos pasivo corriente", "Solo inventarios", "Total activos"],
          correctAnswer: 1,
          explanation: "El capital de trabajo es la diferencia entre activo corriente y pasivo corriente."
        },
        {
          id: "t6-q7",
          question: "¿Cómo se interpreta un ratio de rotación de inventarios alto?",
          options: ["Malo", "Gestión eficiente de inventarios", "Falta de stock", "Exceso de inventario"],
          correctAnswer: 1,
          explanation: "Un ratio alto indica una gestión eficiente de inventarios, convirtiendo rápidamente el stock en ventas."
        },
        {
          id: "t6-q8",
          question: "¿Qué mide el EBITDA?",
          options: ["Solo ventas", "Beneficio antes de intereses, impuestos, depreciación", "Solo costes", "Solo beneficio neto"],
          correctAnswer: 1,
          explanation: "EBITDA mide el beneficio operativo antes de intereses, impuestos, depreciación y amortización."
        },
        {
          id: "t6-q9",
          question: "¿Cuáles son las limitaciones del análisis de ratios?",
          options: ["Ninguna", "Datos históricos, diferencias contables, no considera contexto", "Solo históricas", "Solo contables"],
          correctAnswer: 1,
          explanation: "Las limitaciones incluyen que son datos históricos, diferencias en métodos contables y no consideran el contexto del mercado."
        },
        {
          id: "t6-q10",
          question: "¿Qué es el análisis horizontal?",
          options: ["Solo un año", "Comparación de datos en varios períodos", "Solo balance", "Solo PyG"],
          correctAnswer: 1,
          explanation: "El análisis horizontal compara los mismos datos financieros a lo largo de varios períodos para identificar tendencias."
        },
        {
          id: "t6-q11",
          question: "¿Qué es el análisis vertical?",
          options: ["Solo totales", "Cada partida como porcentaje de una base", "Solo ratios", "Solo diferencias"],
          correctAnswer: 1,
          explanation: "El análisis vertical expresa cada partida como un porcentaje de una cifra base (como ventas totales o activo total)."
        },
        {
          id: "t6-q12",
          question: "¿Qué indica un ratio precio/beneficio (P/E) alto?",
          options: ["Empresa barata", "Expectativas altas de crecimiento", "Empresa cara", "Malos resultados"],
          correctAnswer: 1,
          explanation: "Un P/E alto generalmente indica altas expectativas de crecimiento futuro por parte del mercado."
        },
        {
          id: "t6-q13",
          question: "¿Cómo se calcula el cash flow operativo?",
          options: ["Solo efectivo", "Beneficio neto + depreciación + cambios capital trabajo", "Solo ventas", "Solo beneficio"],
          correctAnswer: 1,
          explanation: "Se calcula ajustando el beneficio neto por partidas no monetarias y cambios en el capital de trabajo."
        },
        {
          id: "t6-q14",
          question: "¿Qué es el ratio de cobertura de intereses?",
          options: ["Solo deuda", "EBIT dividido entre gastos financieros", "Solo beneficio", "Solo intereses"],
          correctAnswer: 1,
          explanation: "Mide la capacidad de la empresa para pagar los intereses de su deuda dividiendo EBIT entre gastos financieros."
        },
        {
          id: "t6-q15",
          question: "¿Cuáles son las técnicas de valoración de empresas?",
          options: ["Solo una", "Descuento flujos, múltiplos, activo neto", "Solo flujos", "Solo múltiplos"],
          correctAnswer: 1,
          explanation: "Las principales técnicas son descuento de flujos de caja, múltiplos de mercado y valor del activo neto."
        },
        {
          id: "t6-q16",
          question: "¿Qué es el EVA (Economic Value Added)?",
          options: ["Solo beneficio", "Beneficio económico que supera el coste de capital", "Solo ventas", "Solo valor contable"],
          correctAnswer: 1,
          explanation: "EVA mide el valor económico agregado, es decir, el beneficio que supera el coste del capital empleado."
        },
        {
          id: "t6-q17",
          question: "¿Cómo se interpreta el Z-score de Altman?",
          options: ["Solo quiebra", "Predictor de dificultades financieras", "Solo liquidez", "Solo rentabilidad"],
          correctAnswer: 1,
          explanation: "El Z-score es un modelo que combina varios ratios para predecir la probabilidad de dificultades financieras."
        },
        {
          id: "t6-q18",
          question: "¿Qué información proporciona el estado de flujos de efectivo?",
          options: ["Solo pagos", "Origen y aplicación de efectivo por actividades", "Solo cobros", "Solo saldos"],
          correctAnswer: 1,
          explanation: "Muestra el origen y aplicación del efectivo clasificado por actividades operativas, de inversión y financiación."
        },
        {
          id: "t6-q19",
          question: "¿Qué es el análisis de sensibilidad?",
          options: ["Solo cambios", "Evaluación del impacto de cambios en variables clave", "Solo escenarios", "Solo riesgos"],
          correctAnswer: 1,
          explanation: "Evalúa cómo los cambios en variables clave afectan a los resultados financieros de la empresa."
        },
        {
          id: "t6-q20",
          question: "¿Cuándo se considera que una empresa tiene buena salud financiera?",
          options: ["Solo beneficios", "Equilibrio entre liquidez, solvencia y rentabilidad", "Solo liquidez", "Solo solvencia"],
          correctAnswer: 1,
          explanation: "Una empresa sana mantiene un equilibrio adecuado entre liquidez, solvencia y rentabilidad."
        }
      ]
    },
    {
      themeId: "tema-7",
      themeName: "Sector Público y Contabilidad Gubernamental",
      tests: [
        {
          id: "t7-q1",
          question: "¿Cuáles son las características de la contabilidad pública?",
          options: ["Solo presupuestaria", "Presupuestaria, financiera, patrimonial, analítica", "Solo financiera", "Solo patrimonial"],
          correctAnswer: 1,
          explanation: "La contabilidad pública integra contabilidad presupuestaria, financiera, patrimonial y analítica."
        },
        {
          id: "t7-q2",
          question: "¿Qué principios rigen la contabilidad pública?",
          options: ["Solo legalidad", "Gestión, uniformidad, integridad, importancia relativa", "Solo gestión", "Solo uniformidad"],
          correctAnswer: 1,
          explanation: "Los principios específicos incluyen gestión, uniformidad, integridad e importancia relativa, además de los generales."
        },
        {
          id: "t7-q3",
          question: "¿Cuáles son las fases del gasto presupuestario?",
          options: ["Solo dos", "Autorización, compromiso, reconocimiento, ordenación", "Solo tres", "Solo una"],
          correctAnswer: 1,
          explanation: "Las fases son autorización del gasto, compromiso del gasto, reconocimiento de la obligación y ordenación del pago."
        },
        {
          id: "t7-q4",
          question: "¿Qué es el Plan General de Contabilidad Pública?",
          options: ["Solo normas", "Marco normativo para contabilidad del sector público", "Solo cuentas", "Solo principios"],
          correctAnswer: 1,
          explanation: "Es el marco normativo que regula la contabilidad de las entidades del sector público español."
        },
        {
          id: "t7-q5",
          question: "¿Cuáles son los estados financieros en el sector público?",
          options: ["Solo balance", "Balance, cuenta resultado, estado liquidación presupuesto", "Solo PyG", "Solo presupuesto"],
          correctAnswer: 1,
          explanation: "Incluyen balance, cuenta del resultado económico-patrimonial, estado de liquidación del presupuesto y memoria."
        },
        {
          id: "t7-q6",
          question: "¿Qué diferencia hay entre contabilidad presupuestaria y patrimonial?",
          options: ["Ninguna", "Presupuestaria sigue ejecución presupuesto, patrimonial variaciones patrimonio", "Solo temporal", "Solo legal"],
          correctAnswer: 1,
          explanation: "La presupuestaria sigue la ejecución del presupuesto, la patrimonial registra variaciones en el patrimonio."
        },
        {
          id: "t7-q7",
          question: "¿Cómo se valoran los bienes de dominio público?",
          options: ["Valor mercado", "Coste de producción o adquisición", "Valor catastral", "Valor tasación"],
          correctAnswer: 1,
          explanation: "Se valoran por su coste de producción o adquisición, actualizado por las mejoras incorporadas."
        },
        {
          id: "t7-q8",
          question: "¿Qué es la cuenta general de la administración?",
          options: ["Solo resumen", "Rendición anual de cuentas al Tribunal de Cuentas", "Solo presupuesto", "Solo balance"],
          correctAnswer: 1,
          explanation: "Es la rendición de cuentas anual que la Administración presenta al Tribunal de Cuentas."
        },
        {
          id: "t7-q9",
          question: "¿Cuándo se reconocen los ingresos presupuestarios?",
          options: ["Al cobrar", "Cuando se produce el derecho a cobrar", "Al final del año", "Solo si se cobra"],
          correctAnswer: 1,
          explanation: "Se reconocen cuando nace el derecho de la Hacienda Pública a su percepción."
        },
        {
          id: "t7-q10",
          question: "¿Qué son los derechos anulados?",
          options: ["Solo errores", "Anulación de derechos reconocidos indebidamente", "Solo prescripción", "Solo fallidos"],
          correctAnswer: 1,
          explanation: "Son la anulación de derechos que fueron reconocidos indebidamente o que han perdido su fundamento jurídico."
        },
        {
          id: "t7-q11",
          question: "¿Qué es la contabilidad analítica en el sector público?",
          options: ["Solo costes", "Sistema de información sobre costes de servicios", "Solo ingresos", "Solo presupuestos"],
          correctAnswer: 1,
          explanation: "Proporciona información sobre los costes, rendimientos y resultados de los servicios públicos."
        },
        {
          id: "t7-q12",
          question: "¿Cómo se clasifican los gastos presupuestarios?",
          options: ["Solo por ministerio", "Orgánica, económica, funcional y por programas", "Solo económica", "Solo funcional"],
          correctAnswer: 1,
          explanation: "Se clasifican según criterios orgánico, económico, funcional y por programas."
        },
        {
          id: "t7-q13",
          question: "¿Qué son las operaciones no presupuestarias?",
          options: ["Solo extrapresupuestarias", "Movimientos de fondos que no afectan al presupuesto", "Solo internas", "Solo de caja"],
          correctAnswer: 1,
          explanation: "Son operaciones de movimiento de fondos que no tienen reflejo en la ejecución presupuestaria."
        },
        {
          id: "t7-q14",
          question: "¿Cuándo se considera ejecutado un gasto presupuestario?",
          options: ["Al autorizar", "Al reconocer la obligación", "Al pagar", "Al comprometer"],
          correctAnswer: 1,
          explanation: "Se considera ejecutado cuando se reconoce la obligación derivada de la prestación realizada."
        },
        {
          id: "t7-q15",
          question: "¿Qué es el resultado presupuestario?",
          options: ["Solo déficit", "Diferencia entre derechos reconocidos y obligaciones reconocidas", "Solo superávit", "Solo liquidación"],
          correctAnswer: 1,
          explanation: "Es la diferencia entre los derechos reconocidos netos y las obligaciones reconocidas netas."
        },
        {
          id: "t7-q16",
          question: "¿Qué información contiene la memoria de las cuentas anuales públicas?",
          options: ["Solo números", "Información complementaria de los estados financieros", "Solo explicaciones", "Solo análisis"],
          correctAnswer: 1,
          explanation: "Contiene información complementaria y aclaratoria de los datos incluidos en los otros estados financieros."
        },
        {
          id: "t7-q17",
          question: "¿Cómo se contabilizan las transferencias recibidas?",
          options: ["Solo como ingresos", "Según su naturaleza: corrientes o de capital", "Solo como subvenciones", "Solo patrimonialmente"],
          correctAnswer: 1,
          explanation: "Se contabilizan según su naturaleza, diferenciando entre transferencias corrientes y de capital."
        },
        {
          id: "t7-q18",
          question: "¿Qué son los compromisos de gastos con cargo a ejercicios futuros?",
          options: ["Solo plurianuales", "Gastos autorizados que afectan a varios ejercicios", "Solo de inversión", "Solo corrientes"],
          correctAnswer: 1,
          explanation: "Son gastos autorizados cuya imputación al presupuesto se realizará en ejercicios posteriores."
        },
        {
          id: "t7-q19",
          question: "¿Cómo se reflejan los avales concedidos?",
          options: ["No se reflejan", "En cuentas de orden", "En activo", "En pasivo"],
          correctAnswer: 1,
          explanation: "Los avales concedidos se reflejan en cuentas de orden por el riesgo contingente que representan."
        },
        {
          id: "t7-q20",
          question: "¿Qué es la central de información económico-financiera?",
          options: ["Solo base datos", "Sistema integrado de información del sector público", "Solo estadísticas", "Solo control"],
          correctAnswer: 1,
          explanation: "Es un sistema que integra la información económico-financiera de las entidades del sector público."
        }
      ]
    },
    {
      themeId: "tema-8",
      themeName: "Gestión de Riesgos y Control de Calidad",
      tests: [
        {
          id: "t8-q1",
          question: "¿Qué es la gestión de riesgos operacionales?",
          options: ["Solo riesgos financieros", "Identificación y gestión de riesgos en procesos", "Solo seguros", "Control de fraudes"],
          correctAnswer: 1,
          explanation: "La gestión de riesgos operacionales identifica, evalúa y gestiona los riesgos inherentes a los procesos operativos."
        },
        {
          id: "t8-q2",
          question: "¿Cuáles son las categorías principales de control de calidad?",
          options: ["Solo inspección", "Preventivo, detectivo y correctivo", "Solo correctivo", "Solo estadístico"],
          correctAnswer: 1,
          explanation: "Los controles de calidad se clasifican en preventivos (evitan errores), detectivos (identifican errores) y correctivos (solucionan errores)."
        },
        {
          id: "t8-q3",
          question: "¿Qué es el control estadístico de procesos?",
          options: ["Solo matemáticas", "Uso de técnicas estadísticas para controlar procesos", "Solo gráficos", "Control manual"],
          correctAnswer: 1,
          explanation: "Utiliza técnicas estadísticas para monitorear y controlar procesos, asegurando que operen dentro de límites establecidos."
        },
        {
          id: "t8-q4",
          question: "¿Cuál es el objetivo del muestreo en auditoría?",
          options: ["Reducir trabajo", "Obtener evidencia sobre población mediante muestra", "Ahorrar tiempo", "Evitar revisión completa"],
          correctAnswer: 1,
          explanation: "El muestreo busca obtener evidencia suficiente y apropiada sobre una población mediante el examen de una muestra representativa."
        },
        {
          id: "t8-q5",
          question: "¿Qué es el riesgo de muestreo?",
          options: ["Error de cálculo", "Diferencia entre conclusión muestra y población", "Solo error humano", "Falta de datos"],
          correctAnswer: 1,
          explanation: "Es el riesgo de que la conclusión del auditor basada en la muestra sea diferente de la que habría alcanzado examinando toda la población."
        },
        {
          id: "t8-q6",
          question: "¿Cuáles son los métodos de selección de muestras?",
          options: ["Solo aleatorio", "Aleatorio, sistemático, estratificado, por bloques", "Solo sistemático", "Solo estratificado"],
          correctAnswer: 1,
          explanation: "Los métodos incluyen selección aleatoria, sistemática, estratificada y por bloques o intervalos."
        },
        {
          id: "t8-q7",
          question: "¿Qué es la significatividad estadística?",
          options: ["Importancia material", "Probabilidad de que un resultado no sea debido al azar", "Solo números grandes", "Relevancia económica"],
          correctAnswer: 1,
          explanation: "Indica la probabilidad de que un resultado observado no sea debido al azar, sino a una causa real."
        },
        {
          id: "t8-q8",
          question: "¿Cuándo se utiliza el muestreo de atributos?",
          options: ["Solo variables cuantitativas", "Para evaluar características cualitativas", "Solo montos", "Solo errores"],
          correctAnswer: 1,
          explanation: "Se utiliza para evaluar características cualitativas como la presencia o ausencia de controles."
        },
        {
          id: "t8-q9",
          question: "¿Qué es el control de calidad total (TQM)?",
          options: ["Solo inspección final", "Filosofía de gestión centrada en calidad", "Control estadístico", "Solo certificaciones"],
          correctAnswer: 1,
          explanation: "Es una filosofía de gestión que involucra a toda la organización en el mejoramiento continuo de la calidad."
        },
        {
          id: "t8-q10",
          question: "¿Cuáles son los principios de la norma ISO 9001?",
          options: ["Solo documentación", "Enfoque al cliente, liderazgo, participación personal", "Solo procedimientos", "Solo auditorías"],
          correctAnswer: 1,
          explanation: "Los principios incluyen enfoque al cliente, liderazgo, participación del personal, enfoque basado en procesos y mejora continua."
        },
        {
          id: "t8-q11",
          question: "¿Qué es un plan de contingencia?",
          options: ["Plan normal", "Procedimientos para situaciones de emergencia", "Solo para desastres", "Plan de trabajo"],
          correctAnswer: 1,
          explanation: "Es un conjunto de procedimientos alternativos para mantener operaciones críticas durante situaciones de emergencia."
        },
        {
          id: "t8-q12",
          question: "¿Cuál es la diferencia entre eficacia y efectividad?",
          options: ["Son sinónimos", "Eficacia logra objetivos, efectividad logra impacto", "Solo terminología", "No hay diferencia"],
          correctAnswer: 1,
          explanation: "Eficacia es lograr los objetivos planteados, efectividad es lograr el impacto deseado en el entorno."
        },
        {
          id: "t8-q13",
          question: "¿Qué es la matriz de riesgos?",
          options: ["Solo lista de riesgos", "Herramienta que evalúa probabilidad e impacto", "Solo clasificación", "Registro histórico"],
          correctAnswer: 1,
          explanation: "Es una herramienta que evalúa los riesgos según su probabilidad de ocurrencia e impacto potencial."
        },
        {
          id: "t8-q14",
          question: "¿Cuáles son las fases del ciclo PDCA?",
          options: ["Solo dos fases", "Planificar, Hacer, Verificar, Actuar", "Solo planificar y ejecutar", "Inicio y fin"],
          correctAnswer: 1,
          explanation: "El ciclo PDCA comprende Planificar (Plan), Hacer (Do), Verificar (Check) y Actuar (Act) para mejora continua."
        },
        {
          id: "t8-q15",
          question: "¿Qué es la tolerancia al riesgo?",
          options: ["Aceptar todos los riesgos", "Nivel máximo de riesgo aceptable", "Rechazar riesgos", "Ignorar riesgos"],
          correctAnswer: 1,
          explanation: "Es el nivel máximo de riesgo que una organización está dispuesta a aceptar para lograr sus objetivos."
        },
        {
          id: "t8-q16",
          question: "¿Qué son los indicadores clave de rendimiento (KPI)?",
          options: ["Solo métricas financieras", "Métricas que evalúan éxito en objetivos clave", "Solo estadísticas", "Informes mensuales"],
          correctAnswer: 1,
          explanation: "Son métricas utilizadas para evaluar el éxito de una organización en el logro de objetivos clave."
        },
        {
          id: "t8-q17",
          question: "¿Cuándo se aplica el principio de materialidad?",
          options: ["Solo en inventarios", "Cuando errores pueden influir en decisiones", "Solo en auditoría", "Solo montos grandes"],
          correctAnswer: 1,
          explanation: "Se aplica cuando las incorrecciones podrían, individual o colectivamente, influir en las decisiones de los usuarios."
        },
        {
          id: "t8-q18",
          question: "¿Qué es la gestión por excepción?",
          options: ["Solo casos especiales", "Enfoque en desviaciones significativas", "Solo problemas", "Gestión irregular"],
          correctAnswer: 1,
          explanation: "Es un estilo de gestión que se centra ��nicamente en casos que se desvían significativamente de la norma."
        },
        {
          id: "t8-q19",
          question: "¿Cuál es el propósito de las pruebas de controles?",
          options: ["Detectar fraudes", "Evaluar efectividad operativa de controles", "Solo cumplimiento", "Encontrar errores"],
          correctAnswer: 1,
          explanation: "Las pruebas de controles evalúan la efectividad operativa de los controles durante el período."
        },
        {
          id: "t8-q20",
          question: "¿Qu�� es la mejora continua en procesos?",
          options: ["Cambios ocasionales", "Esfuerzo constante para mejorar productos y servicios", "Solo al final", "Cambios drásticos"],
          correctAnswer: 1,
          explanation: "Es un esfuerzo continuo para mejorar productos, servicios o procesos mediante pequeños incrementos."
        }
      ]
    },
    {
      themeId: "tema-9",
      themeName: "Sistemas de Información y Tecnología",
      tests: [
        {
          id: "t9-q1",
          question: "¿Cuáles son los componentes básicos de un sistema de información?",
          options: ["Solo hardware", "Hardware, software, datos, procedimientos, personas", "Solo software", "Solo datos"],
          correctAnswer: 1,
          explanation: "Un sistema de información comprende hardware, software, datos, procedimientos y personas que trabajan juntos."
        },
        {
          id: "t9-q2",
          question: "¿Qué es la integridad de los datos?",
          options: ["Solo seguridad", "Exactitud y consistencia de datos durante su ciclo de vida", "Solo backup", "Solo acceso"],
          correctAnswer: 1,
          explanation: "La integridad de datos se refiere a la exactitud y consistencia de los datos durante todo su ciclo de vida."
        },
        {
          id: "t9-q3",
          question: "¿Cuáles son los tipos de controles en sistemas de información?",
          options: ["Solo preventivos", "Preventivos, detectivos y correctivos", "Solo detectivos", "Solo automáticos"],
          correctAnswer: 1,
          explanation: "Los controles se clasifican en preventivos (evitan problemas), detectivos (identifican problemas) y correctivos (solucionan problemas)."
        },
        {
          id: "t9-q4",
          question: "¿Qué es la continuidad del negocio?",
          options: ["Solo backup", "Capacidad de mantener operaciones durante interrupciones", "Solo recuperación", "Trabajo 24/7"],
          correctAnswer: 1,
          explanation: "Es la capacidad de una organización para mantener operaciones esenciales durante y después de interrupciones."
        },
        {
          id: "t9-q5",
          question: "¿Cuál es la diferencia entre backup y recuperación?",
          options: ["Son lo mismo", "Backup copia datos, recuperación los restaura", "Solo terminología", "No hay diferencia"],
          correctAnswer: 1,
          explanation: "Backup es la copia de seguridad de datos, recuperación es el proceso de restaurar datos desde esas copias."
        },
        {
          id: "t9-q6",
          question: "¿Qué es la segregación de funciones en TI?",
          options: ["División del trabajo", "Separación de funciones incompatibles", "Solo especialización", "Organización por departamentos"],
          correctAnswer: 1,
          explanation: "Es la separación de funciones incompatibles para prevenir errores y fraudes en sistemas de información."
        },
        {
          id: "t9-q7",
          question: "¿Cuáles son los niveles de seguridad de la información?",
          options: ["Solo alto y bajo", "Físico, lógico y administrativo", "Solo físico", "Solo lógico"],
          correctAnswer: 1,
          explanation: "La seguridad comprende niveles físico (instalaciones), lógico (sistemas) y administrativo (procedimientos)."
        },
        {
          id: "t9-q8",
          question: "¿Qué es la autenticación en sistemas?",
          options: ["Solo contraseñas", "Verificación de identidad de usuarios", "Solo acceso", "Solo autorización"],
          correctAnswer: 1,
          explanation: "La autenticación es el proceso de verificar la identidad de un usuario o sistema."
        },
        {
          id: "t9-q9",
          question: "¿Cuál es la diferencia entre autenticación y autorización?",
          options: ["Son lo mismo", "Autenticación verifica identidad, autorización concede permisos", "Solo terminología", "No hay diferencia"],
          correctAnswer: 1,
          explanation: "Autenticación verifica quién eres, autorización determina qué puedes hacer."
        },
        {
          id: "t9-q10",
          question: "¿Qué es un plan de recuperación ante desastres?",
          options: ["Solo backup", "Procedimientos para restaurar operaciones tras desastre", "Solo seguros", "Manual de emergencia"],
          correctAnswer: 1,
          explanation: "Es un conjunto documentado de procedimientos para restaurar operaciones de TI después de un desastre."
        },
        {
          id: "t9-q11",
          question: "¿Cuáles son los tipos de auditoría de sistemas?",
          options: ["Solo técnica", "Técnica, operacional y administrativa", "Solo operacional", "Solo de cumplimiento"],
          correctAnswer: 1,
          explanation: "Incluyen auditoría técnica (infraestructura), operacional (procesos) y administrativa (procedimientos)."
        },
        {
          id: "t9-q12",
          question: "¿Qué es el control de cambios en sistemas?",
          options: ["Solo actualizaciones", "Proceso formal para gestionar modificaciones", "Solo instalaciones", "Cambio de personal"],
          correctAnswer: 1,
          explanation: "Es un proceso formal para gestionar, aprobar e implementar cambios en sistemas de información."
        },
        {
          id: "t9-q13",
          question: "¿Cuál es el propósito de los logs de auditoría?",
          options: ["Solo estadísticas", "Registrar actividades para revisión posterior", "Solo errores", "Solo accesos"],
          correctAnswer: 1,
          explanation: "Los logs registran actividades del sistema para permitir revisión, investigación y cumplimiento."
        },
        {
          id: "t9-q14",
          question: "¿Qué es la encriptación de datos?",
          options: ["Solo códigos", "Transformación de datos para proteger confidencialidad", "Solo contraseñas", "Solo archivos"],
          correctAnswer: 1,
          explanation: "Es la transformación de datos usando algoritmos para proteger su confidencialidad e integridad."
        },
        {
          id: "t9-q15",
          question: "¿Cuándo debe realizarse una prueba de penetración?",
          options: ["Solo cuando hay problemas", "Periódicamente para evaluar vulnerabilidades", "Solo una vez", "Solo si hay ataques"],
          correctAnswer: 1,
          explanation: "Debe realizarse periódicamente para identificar vulnerabilidades antes de que sean explotadas."
        },
        {
          id: "t9-q16",
          question: "¿Qué es la gestión de incidentes de seguridad?",
          options: ["Solo reporte", "Proceso para detectar, analizar y responder a incidentes", "Solo documentación", "Solo prevención"],
          correctAnswer: 1,
          explanation: "Es el proceso para detectar, analizar y responder eficazmente a incidentes de seguridad."
        },
        {
          id: "t9-q17",
          question: "¿Cuáles son los principios de la gobernanza de TI?",
          options: ["Solo control", "Alineación estratégica, entrega de valor, gestión de riesgo", "Solo eficiencia", "Solo cumplimiento"],
          correctAnswer: 1,
          explanation: "Incluyen alineación estratégica, entrega de valor, gestión de riesgo, gestión de recursos y medición del desempeño."
        },
        {
          id: "t9-q18",
          question: "¿Qué es COBIT en auditoría de sistemas?",
          options: ["Solo estándar", "Marco de gobierno y gestión de TI", "Solo metodología", "Solo certificación"],
          correctAnswer: 1,
          explanation: "COBIT es un marco de gobierno y gestión de TI que proporciona un conjunto de herramientas y habilitadores."
        },
        {
          id: "t9-q19",
          question: "¿Cuál es el objetivo de las pruebas de sistemas?",
          options: ["Solo encontrar errores", "Verificar que el sistema cumple requisitos", "Solo performance", "Solo seguridad"],
          correctAnswer: 1,
          explanation: "Las pruebas verifican que el sistema cumple con los requisitos especificados y funciona correctamente."
        },
        {
          id: "t9-q20",
          question: "¿Qué es la gestión de la configuración?",
          options: ["Solo instalación", "Control sistemático de cambios en configuración", "Solo documentación", "Solo inventario"],
          correctAnswer: 1,
          explanation: "Es el control sistemático de los cambios realizados en la configuración de sistemas durante su ciclo de vida."
        }
      ]
    },
    {
      themeId: "tema-10",
      themeName: "Auditoría de Estados Financieros",
      tests: [
        {
          id: "t10-q1",
          question: "¿Cuál es el objetivo de una auditoría de estados financieros?",
          options: ["Detectar fraudes", "Expresar opinión sobre fiabilidad de estados financieros", "Calcular impuestos", "Valorar la empresa"],
          correctAnswer: 1,
          explanation: "El objetivo es expresar una opinión sobre si los estados financieros están libres de incorrección material."
        },
        {
          id: "t10-q2",
          question: "¿Cuáles son los tipos de opinión de auditoría?",
          options: ["Solo favorable", "Favorable, con salvedades, desfavorable, denegada", "Solo desfavorable", "Buena y mala"],
          correctAnswer: 1,
          explanation: "Las opiniones son: favorable (limpia), con salvedades, desfavorable (adversa) y denegación de opinión."
        },
        {
          id: "t10-q3",
          question: "¿Qué son las aserciones de auditoría?",
          options: ["Solo afirmaciones", "Declaraciones de la dirección sobre elementos de estados financieros", "Solo números", "Conclusiones del auditor"],
          correctAnswer: 1,
          explanation: "Son declaraciones implícitas o explícitas de la dirección sobre reconocimiento, medición y presentación de elementos."
        },
        {
          id: "t10-q4",
          question: "¿Cuáles son las aserciones sobre transacciones?",
          options: ["Solo exactitud", "Ocurrencia, integridad, exactitud, corte, clasificación", "Solo integridad", "Solo corte"],
          correctAnswer: 1,
          explanation: "Incluyen ocurrencia, integridad, exactitud, corte y clasificación de transacciones."
        },
        {
          id: "t10-q5",
          question: "¿Qué es el riesgo de auditoría?",
          options: ["Solo riesgo del cliente", "Riesgo de emitir opinión inadecuada", "Solo riesgo del auditor", "Riesgo de mercado"],
          correctAnswer: 1,
          explanation: "Es el riesgo de que el auditor exprese una opinión de auditoría inadecuada cuando los estados financieros contienen incorrecciones materiales."
        },
        {
          id: "t10-q6",
          question: "¿Cuáles son los componentes del riesgo de auditoría?",
          options: ["Solo dos", "Riesgo inherente, de control y de detección", "Solo inherente", "Solo de detección"],
          correctAnswer: 1,
          explanation: "Se compone de riesgo inherente, riesgo de control y riesgo de detección."
        },
        {
          id: "t10-q7",
          question: "¿Qué son las pruebas sustantivas?",
          options: ["Solo analíticas", "Procedimientos para detectar incorrecciones materiales", "Solo de detalle", "Solo de cumplimiento"],
          correctAnswer: 1,
          explanation: "Son procedimientos de auditoría diseñados para detectar incorrecciones materiales a nivel de aserciones."
        },
        {
          id: "t10-q8",
          question: "¿Cuándo se realiza la planificación de auditoría?",
          options: ["Al final", "Al inicio de cada encargo", "Durante la ejecución", "Solo la primera vez"],
          correctAnswer: 1,
          explanation: "La planificación se realiza al inicio de cada encargo y se actualiza durante el proceso."
        },
        {
          id: "t10-q9",
          question: "¿Qué información contiene la carta de encargo?",
          options: ["Solo honorarios", "Objetivo, responsabilidades, limitaciones y términos", "Solo fechas", "Solo procedimientos"],
          correctAnswer: 1,
          explanation: "Documenta el objetivo, responsabilidades de cada parte, limitaciones y términos del encargo."
        },
        {
          id: "t10-q10",
          question: "¿Qué es la estrategia global de auditoría?",
          options: ["Solo procedimientos", "Enfoque general para dirigir y supervisar auditoría", "Solo cronograma", "Solo equipo"],
          correctAnswer: 1,
          explanation: "Establece el alcance, timing y dirección de la auditoría, guiando el desarrollo del plan detallado."
        },
        {
          id: "t10-q11",
          question: "¿Cuál es la diferencia entre exactitud y precisión en auditoría?",
          options: ["Son sinónimos", "Exactitud es corrección, precisión es detalle", "Solo terminología", "No hay diferencia"],
          correctAnswer: 1,
          explanation: "Exactitud se refiere a la corrección de los datos, precisión al grado de detalle o especificidad."
        },
        {
          id: "t10-q12",
          question: "¿Qué son los procedimientos analíticos?",
          options: ["Solo cálculos", "Evaluación de información mediante análisis de relaciones", "Solo comparaciones", "Solo ratios"],
          correctAnswer: 1,
          explanation: "Son evaluaciones de información financiera mediante análisis de relaciones plausibles entre datos."
        },
        {
          id: "t10-q13",
          question: "¿Cuándo deben comunicarse las deficiencias de control interno?",
          options: ["Solo al final", "Tan pronto como sea factible", "Solo si son materiales", "Solo por escrito"],
          correctAnswer: 1,
          explanation: "Las deficiencias significativas deben comunicarse por escrito tan pronto como sea factible."
        },
        {
          id: "t10-q14",
          question: "¿Qué es una revisión de control de calidad?",
          options: ["Solo supervisión", "Evaluación objetiva de juicios significativos", "Solo procedimientos", "Solo documentación"],
          correctAnswer: 1,
          explanation: "Es una evaluación objetiva de los juicios significativos del equipo y conclusiones alcanzadas."
        },
        {
          id: "t10-q15",
          question: "¿Cuáles son los elementos del informe de auditoría?",
          options: ["Solo opinión", "Título, destinatario, opinión, base, responsabilidades, firma", "Solo base", "Solo responsabilidades"],
          correctAnswer: 1,
          explanation: "Incluye título, destinatario, opinión del auditor, base para la opinión, responsabilidades y firma."
        },
        {
          id: "t10-q16",
          question: "¿Qué son las estimaciones contables?",
          options: ["Solo cálculos", "Aproximaciones de importes ante incertidumbre", "Solo provisiones", "Solo depreciación"],
          correctAnswer: 1,
          explanation: "Son aproximaciones de importes monetarios en ausencia de medios precisos de medición."
        },
        {
          id: "t10-q17",
          question: "¿Cuándo se considera que existe una incertidumbre material?",
          options: ["Siempre", "Cuando puede afectar significativamente a los estados financieros", "Solo en pérdidas", "Solo en el futuro"],
          correctAnswer: 1,
          explanation: "Existe cuando un asunto cuyo desenlace depende de acciones futuras puede afectar significativamente a los estados financieros."
        },
        {
          id: "t10-q18",
          question: "¿Qué es la representación escrita de la dirección?",
          options: ["Solo confirmación", "Declaración escrita sobre responsabilidades y hechos", "Solo opinión", "Solo datos"],
          correctAnswer: 1,
          explanation: "Es una declaración escrita de la dirección proporcionada al auditor para confirmar hechos o asuntos."
        },
        {
          id: "t10-q19",
          question: "¿Cuándo debe el auditor considerar la capacidad de la entidad para continuar como empresa en funcionamiento?",
          options: ["Solo cuando hay pérdidas", "En toda auditoría", "Solo cuando se solicita", "Solo en crisis"],
          correctAnswer: 1,
          explanation: "El auditor debe considerar en toda auditoría si existen incertidumbres materiales sobre la continuidad."
        },
        {
          id: "t10-q20",
          question: "¿Qué información debe incluir el párrafo de énfasis?",
          options: ["Solo problemas", "Asunto apropiadamente revelado que es fundamental", "Solo errores", "Solo salvedades"],
          correctAnswer: 1,
          explanation: "Incluye un asunto apropiadamente presentado o revelado que es de tal importancia que es fundamental para la comprensión de los usuarios."
        }
      ]
    },
    {
      themeId: "tema-11",
      themeName: "Contabilidad de Costes y Analítica",
      tests: [
        {
          id: "t11-q1",
          question: "¿Cuál es la diferencia entre coste y gasto?",
          options: ["Son sinónimos", "Coste es para producir, gasto es para operar", "Solo terminología", "No hay diferencia"],
          correctAnswer: 1,
          explanation: "El coste se relaciona con la producción de bienes/servicios, el gasto con las operaciones del período."
        },
        {
          id: "t11-q2",
          question: "¿Cuáles son los elementos del coste de producción?",
          options: ["Solo materiales", "Materiales directos, mano de obra directa, costes indirectos", "Solo mano de obra", "Solo indirectos"],
          correctAnswer: 1,
          explanation: "Los elementos son materiales directos, mano de obra directa y costes indirectos de fabricación."
        },
        {
          id: "t11-q3",
          question: "¿Qué son los costes fijos?",
          options: ["Costes que no cambian", "Costes que no varían con el nivel de actividad", "Solo alquileres", "Costes inmutables"],
          correctAnswer: 1,
          explanation: "Son costes que permanecen constantes independientemente del nivel de actividad en un rango relevante."
        },
        {
          id: "t11-q4",
          question: "¿Cuál es la diferencia entre costes directos e indirectos?",
          options: ["Solo ubicación", "Directos se asignan específicamente, indirectos se reparten", "Solo importancia", "Solo temporalidad"],
          correctAnswer: 1,
          explanation: "Los directos se pueden asignar específicamente a un objeto de coste, los indirectos requieren distribución."
        },
        {
          id: "t11-q5",
          question: "¿Qué es el punto de equilibrio?",
          options: ["Solo ventas", "Nivel donde ingresos igualan costes totales", "Solo costes", "Beneficio cero"],
          correctAnswer: 1,
          explanation: "Es el nivel de actividad donde los ingresos totales igualan a los costes totales."
        },
        {
          id: "t11-q6",
          question: "¿Cuáles son los métodos de valoración de inventarios?",
          options: ["Solo FIFO", "FIFO, LIFO, precio medio ponderado", "Solo LIFO", "Solo precio medio"],
          correctAnswer: 1,
          explanation: "Los principales métodos son FIFO (primero en entrar, primero en salir), LIFO y precio medio ponderado."
        },
        {
          id: "t11-q7",
          question: "¿Qué es el margen de contribución?",
          options: ["Solo ventas", "Diferencia entre ingresos y costes variables", "Solo beneficio", "Solo costes fijos"],
          correctAnswer: 1,
          explanation: "Es la diferencia entre los ingresos por ventas y los costes variables."
        },
        {
          id: "t11-q8",
          question: "¿Cuál es el objetivo del sistema ABC (Activity Based Costing)?",
          options: ["Reducir costes", "Asignar costes indirectos más precisamente", "Solo simplicidad", "Eliminar actividades"],
          correctAnswer: 1,
          explanation: "El ABC busca asignar los costes indirectos de forma más precisa usando inductores de coste."
        },
        {
          id: "t11-q9",
          question: "¿Qué son los costes de oportunidad?",
          options: ["Solo pérdidas", "Beneficio perdido de la mejor alternativa no elegida", "Costes adicionales", "Solo intereses"],
          correctAnswer: 1,
          explanation: "Es el beneficio que se pierde al elegir una alternativa en lugar de la mejor opción disponible."
        },
        {
          id: "t11-q10",
          question: "¿Cuándo se utiliza el costeo por órdenes?",
          options: ["Producción masiva", "Productos únicos o lotes específicos", "Solo servicios", "Producción continua"],
          correctAnswer: 1,
          explanation: "Se utiliza cuando se producen productos únicos o lotes específicos identificables."
        },
        {
          id: "t11-q11",
          question: "¿Qué es el costeo por procesos?",
          options: ["Solo servicios", "Asignación de costes a procesos de producción continua", "Solo manufactura", "Solo materiales"],
          correctAnswer: 1,
          explanation: "Es un sistema que asigna costes a procesos o departamentos en producción continua y masiva."
        },
        {
          id: "t11-q12",
          question: "¿Cuál es la diferencia entre coste estándar y real?",
          options: ["No hay diferencia", "Estándar es predeterminado, real es histórico", "Solo temporalidad", "Solo exactitud"],
          correctAnswer: 1,
          explanation: "El coste estándar es predeterminado para fines de control, el real es el coste histórico incurrido."
        },
        {
          id: "t11-q13",
          question: "¿Qué son las desviaciones en el sistema de costes estándar?",
          options: ["Solo errores", "Diferencias entre costes estándar y reales", "Solo problemas", "Solo mejoras"],
          correctAnswer: 1,
          explanation: "Las desviaciones son las diferencias entre los costes estándar predeterminados y los costes reales."
        },
        {
          id: "t11-q14",
          question: "¿Cuál es el propósito del análisis de variaciones?",
          options: ["Solo control", "Identificar causas de diferencias entre lo planificado y real", "Solo corrección", "Solo información"],
          correctAnswer: 1,
          explanation: "Busca identificar las causas de las diferencias entre resultados planificados y reales para tomar acciones correctivas."
        },
        {
          id: "t11-q15",
          question: "¿Qué es el coste de la calidad?",
          options: ["Solo defectos", "Costes de prevención, evaluación y fallos", "Solo inspección", "Solo mejoras"],
          correctAnswer: 1,
          explanation: "Incluye costes de prevención, evaluación (detección) y fallos (internos y externos)."
        },
        {
          id: "t11-q16",
          question: "¿Cuándo se usa el costeo variable?",
          options: ["Siempre", "Para decisiones internas y análisis", "Solo reporting externo", "Solo inventarios"],
          correctAnswer: 1,
          explanation: "Se utiliza principalmente para decisiones internas y análisis de gestión, no para reporting externo."
        },
        {
          id: "t11-q17",
          question: "¿Qué información proporciona el análisis CVU?",
          options: ["Solo ventas", "Relación entre costes, volumen y utilidades", "Solo costes", "Solo volumen"],
          correctAnswer: 1,
          explanation: "El análisis coste-volumen-utilidad estudia cómo los cambios en costes y volumen afectan a las utilidades."
        },
        {
          id: "t11-q18",
          question: "¿Cuál es la diferencia entre centro de coste y de beneficio?",
          options: ["Solo nombre", "Coste controla costes, beneficio controla ingresos y costes", "Solo responsabilidad", "Solo tamaño"],
          correctAnswer: 1,
          explanation: "Un centro de coste controla solo costes, un centro de beneficio controla tanto ingresos como costes."
        },
        {
          id: "t11-q19",
          question: "¿Qué son los inductores de coste en ABC?",
          options: ["Solo actividades", "Factores que causan o impulsan los costes", "Solo medidas", "Solo distribución"],
          correctAnswer: 1,
          explanation: "Son factores que causan o impulsan la incurrencia de costes en las actividades."
        },
        {
          id: "t11-q20",
          question: "¿Cuándo es relevante un coste para toma de decisiones?",
          options: ["Siempre", "Cuando es futuro y diferencial", "Solo si es alto", "Solo si es variable"],
          correctAnswer: 1,
          explanation: "Un coste es relevante para decisiones cuando es futuro y diferencial entre alternativas."
        }
      ]
    },
    {
      themeId: "tema-12",
      themeName: "Planificación y Control Presupuestario",
      tests: [
        {
          id: "t12-q1",
          question: "¿Cuál es el objetivo principal del presupuesto?",
          options: ["Solo control", "Planificación, coordinación y control", "Solo planificación", "Solo coordinación"],
          correctAnswer: 1,
          explanation: "El presupuesto sirve para planificar actividades, coordinar esfuerzos y controlar desempeño."
        },
        {
          id: "t12-q2",
          question: "¿Cuáles son los tipos de presupuesto según flexibilidad?",
          options: ["Solo rígidos", "Fijos y flexibles", "Solo flexibles", "Solo variables"],
          correctAnswer: 1,
          explanation: "Los presupuestos se clasifican en fijos (no cambian) y flexibles (se ajustan al nivel de actividad)."
        },
        {
          id: "t12-q3",
          question: "¿Qué es el presupuesto base cero?",
          options: ["Sin fondos", "Justificación completa de cada partida desde cero", "Presupuesto mínimo", "Solo para emergencias"],
          correctAnswer: 1,
          explanation: "Requiere justificar completamente cada partida presupuestaria como si fuera la primera vez."
        },
        {
          id: "t12-q4",
          question: "¿Cuál es la secuencia típica de preparación presupuestaria?",
          options: ["Cualquier orden", "Ventas, producción, compras, gastos, financiero", "Solo financiero", "Solo ventas"],
          correctAnswer: 1,
          explanation: "Típicamente se inicia con ventas, luego producción, compras, gastos operativos y finalmente el financiero."
        },
        {
          id: "t12-q5",
          question: "¿Qué es el presupuesto maestro?",
          options: ["Solo ventas", "Conjunto integrado de presupuestos operativos y financieros", "Solo gastos", "Solo principal"],
          correctAnswer: 1,
          explanation: "Es el conjunto integrado que incluye presupuestos operativos y financieros de toda la organización."
        },
        {
          id: "t12-q6",
          question: "¿Cuáles son las ventajas del presupuesto participativo?",
          options: ["Solo rapidez", "Mayor compromiso y conocimiento local", "Solo control", "Menos trabajo"],
          correctAnswer: 1,
          explanation: "Genera mayor compromiso del personal y aprovecha el conocimiento específico de cada área."
        },
        {
          id: "t12-q7",
          question: "¿Qué son las desviaciones presupuestarias?",
          options: ["Solo errores", "Diferencias entre presupuestado y real", "Solo problemas", "Solo mejoras"],
          correctAnswer: 1,
          explanation: "Son las diferencias entre los importes presupuestados y los resultados reales obtenidos."
        },
        {
          id: "t12-q8",
          question: "¿Cuándo se realiza el análisis de desviaciones?",
          options: ["Solo al final del año", "Periódicamente durante el período presupuestario", "Solo cuando hay problemas", "Una vez al mes"],
          correctAnswer: 1,
          explanation: "Se debe realizar periódicamente para permitir acciones correctivas oportunas."
        },
        {
          id: "t12-q9",
          question: "¿Qué es el presupuesto de capital?",
          options: ["Solo efectivo", "Planificación de inversiones a largo plazo", "Solo activos", "Solo deuda"],
          correctAnswer: 1,
          explanation: "Es la planificación y evaluación de inversiones en activos a largo plazo."
        },
        {
          id: "t12-q10",
          question: "¿Cuáles son los métodos de evaluación de inversiones?",
          options: ["Solo VAN", "VAN, TIR, período de recuperación, índice rentabilidad", "Solo TIR", "Solo payback"],
          correctAnswer: 1,
          explanation: "Incluyen VAN, TIR, período de recuperación e índice de rentabilidad."
        },
        {
          id: "t12-q11",
          question: "¿Qué es el presupuesto de efectivo?",
          options: ["Solo ingresos", "Planificación de flujos de efectivo", "Solo gastos", "Solo saldos"],
          correctAnswer: 1,
          explanation: "Planifica los flujos de entrada y salida de efectivo para gestionar la liquidez."
        },
        {
          id: "t12-q12",
          question: "¿Cuál es la diferencia entre presupuesto continuo y periódico?",
          options: ["Solo duración", "Continuo se actualiza constantemente, periódico por períodos fijos", "Solo frecuencia", "No hay diferencia"],
          correctAnswer: 1,
          explanation: "El continuo se actualiza constantemente añadiendo períodos, el periódico cubre períodos fijos."
        },
        {
          id: "t12-q13",
          question: "¿Qué son los centros de responsabilidad?",
          options: ["Solo departamentos", "Unidades organizacionales con responsabilidad específica", "Solo costes", "Solo beneficios"],
          correctAnswer: 1,
          explanation: "Son unidades organizacionales dirigidas por un responsable con autoridad sobre recursos específicos."
        },
        {
          id: "t12-q14",
          question: "��Cuáles son los tipos de centros de responsabilidad?",
          options: ["Solo dos tipos", "Coste, beneficio, inversión y ingresos", "Solo coste y beneficio", "Solo inversión"],
          correctAnswer: 1,
          explanation: "Se clasifican en centros de coste, beneficio, inversión e ingresos según su responsabilidad."
        },
        {
          id: "t12-q15",
          question: "¿Qué es el control por excepción?",
          options: ["Solo casos especiales", "Enfocar atención en desviaciones significativas", "Solo problemas", "Control esporádico"],
          correctAnswer: 1,
          explanation: "Se centra únicamente en las desviaciones que superan límites predeterminados de tolerancia."
        },
        {
          id: "t12-q16",
          question: "¿Cuál es la función del comité de presupuestos?",
          options: ["Solo aprobar", "Coordinar, revisar y aprobar el proceso presupuestario", "Solo ejecutar", "Solo controlar"],
          correctAnswer: 1,
          explanation: "Coordina el proceso, revisa propuestas, resuelve conflictos y aprueba el presupuesto final."
        },
        {
          id: "t12-q17",
          question: "¿Qué información debe incluir el informe de desviaciones?",
          options: ["Solo números", "Desviación, causa, responsable y acción correctiva", "Solo causas", "Solo responsables"],
          correctAnswer: 1,
          explanation: "Debe incluir la desviación, su causa, el responsable y las acciones correctivas propuestas."
        },
        {
          id: "t12-q18",
          question: "¿Cuándo es favorable una desviación?",
          options: ["Siempre", "Cuando mejora el resultado respecto a lo presupuestado", "Nunca", "Solo en ingresos"],
          correctAnswer: 1,
          explanation: "Una desviación es favorable cuando el resultado real es mejor que lo presupuestado."
        },
        {
          id: "t12-q19",
          question: "¿Qué es el presupuesto rolling?",
          options: ["Solo anual", "Presupuesto que se actualiza periódicamente", "Solo mensual", "Presupuesto fijo"],
          correctAnswer: 1,
          explanation: "Es un presupuesto que se actualiza periódicamente añadiendo nuevos períodos y eliminando los vencidos."
        },
        {
          id: "t12-q20",
          question: "¿Cuál es la importancia del presupuesto en el control de gestión?",
          options: ["Solo cumplimiento", "Herramienta clave para planificación y control", "Solo información", "Solo autorización"],
          correctAnswer: 1,
          explanation: "Es una herramienta fundamental que integra planificación, coordinaci��n, comunicación y control de gestión."
        }
      ]
    },
    {
      themeId: "tema-13",
      themeName: "Ética Profesional y Normativa Contable",
      tests: [
        {
          id: "t13-q1",
          question: "¿Cuáles son los principios fundamentales de ética profesional?",
          options: ["Solo honestidad", "Integridad, objetividad, competencia, confidencialidad, comportamiento profesional", "Solo competencia", "Solo confidencialidad"],
          correctAnswer: 1,
          explanation: "Los principios fundamentales son integridad, objetividad, competencia profesional, confidencialidad y comportamiento profesional."
        },
        {
          id: "t13-q2",
          question: "¿Qué significa independencia en auditoría?",
          options: ["Solo externa", "Ausencia de conflictos que comprometan objetividad", "Solo mental", "Solo económica"],
          correctAnswer: 1,
          explanation: "La independencia implica ausencia de conflictos de interés que puedan comprometer la objetividad profesional."
        },
        {
          id: "t13-q3",
          question: "¿Cuáles son los tipos de independencia?",
          options: ["Solo una", "Mental y aparente", "Solo mental", "Solo aparente"],
          correctAnswer: 1,
          explanation: "Existen dos tipos: independencia mental (actitud mental) e independencia aparente (percepción de terceros)."
        },
        {
          id: "t13-q4",
          question: "¿Cuándo existe una amenaza de autorrevisión?",
          options: ["Nunca", "Cuando se audita trabajo propio o de la firma", "Solo en consultoría", "Solo en valoraciones"],
          correctAnswer: 1,
          explanation: "Surge cuando el auditor tiene que evaluar trabajo realizado por él mismo o por su firma."
        },
        {
          id: "t13-q5",
          question: "¿Qué es una amenaza de abogacía?",
          options: ["Solo legal", "Actuar como defensor del cliente", "Solo representación", "Solo conflictos"],
          correctAnswer: 1,
          explanation: "Surge cuando el auditor actúa como defensor de un cliente de auditoría ante terceros."
        },
        {
          id: "t13-q6",
          question: "¿Cuáles son las salvaguardas contra amenazas a la independencia?",
          options: ["Solo rotación", "Creadas por la profesión, legislación y la firma", "Solo supervisión", "Solo formación"],
          correctAnswer: 1,
          explanation: "Incluyen salvaguardas creadas por la profesión, la legislación y las desarrolladas por la propia firma."
        },
        {
          id: "t13-q7",
          question: "¿Cuándo debe rotar el socio responsable de auditoría?",
          options: ["Nunca", "Después de máximo 7 años consecutivos", "Cada 3 años", "Cada 10 años"],
          correctAnswer: 1,
          explanation: "En entidades de interés público, el socio responsable debe rotar después de máximo 7 años consecutivos."
        },
        {
          id: "t13-q8",
          question: "¿Qué servicios están prohibidos para clientes de auditoría?",
          options: ["Solo contabilidad", "Contabilidad, valoraciones, consultoría fiscal interna", "Solo valoraciones", "Solo consultoría"],
          correctAnswer: 1,
          explanation: "Están prohibidos servicios de contabilidad, valoraciones, servicios de auditoría interna y cierta consultoría fiscal."
        },
        {
          id: "t13-q9",
          question: "¿Cuál es el período de reflexión o cooling-off?",
          options: ["No existe", "2 años antes de incorporarse al cliente auditado", "1 año", "3 años"],
          correctAnswer: 1,
          explanation: "Es un período de 2 años que debe transcurrir antes de que un auditor pueda incorporarse como directivo del cliente."
        },
        {
          id: "t13-q10",
          question: "¿Qué es el control de calidad de la firma?",
          options: ["Solo supervisión", "Sistema para asegurar cumplimiento de estándares", "Solo formación", "Solo revisión"],
          correctAnswer: 1,
          explanation: "Es un sistema diseñado para proporcionar seguridad razonable de que la firma cumple con estándares profesionales."
        },
        {
          id: "t13-q11",
          question: "¿Cuándo debe consultarse a un especialista?",
          options: ["Nunca", "Cuando se requiere conocimiento especializado", "Solo en auditorías grandes", "Solo si lo pide el cliente"],
          correctAnswer: 1,
          explanation: "Debe consultarse cuando se necesita conocimiento o experiencia especializada que el equipo no posee."
        },
        {
          id: "t13-q12",
          question: "¿Qué es la competencia profesional?",
          options: ["Solo títulos", "Conocimiento, habilidades y experiencia necesarios", "Solo experiencia", "Solo formación"],
          correctAnswer: 1,
          explanation: "Comprende el conocimiento técnico, habilidades profesionales y experiencia necesarios para la tarea."
        },
        {
          id: "t13-q13",
          question: "¿Cuál es el deber de confidencialidad?",
          options: ["Solo durante el encargo", "No revelar información del cliente", "Solo información financiera", "Solo hacia terceros"],
          correctAnswer: 1,
          explanation: "Es el deber de no revelar información confidencial del cliente obtenida durante la relación profesional."
        },
        {
          id: "t13-q14",
          question: "¿Cuándo puede revelarse información confidencial?",
          options: ["Nunca", "Con autorización del cliente o requerimiento legal", "Solo con autorización", "Solo requerimiento legal"],
          correctAnswer: 1,
          explanation: "Puede revelarse con autorización específica del cliente o cuando existe requerimiento legal o profesional."
        },
        {
          id: "t13-q15",
          question: "¿Qué es el comportamiento profesional?",
          options: ["Solo vestimenta", "Cumplir leyes y evitar actos que desacrediten la profesión", "Solo puntualidad", "Solo cortesía"],
          correctAnswer: 1,
          explanation: "Implica cumplir con leyes y regulaciones y evitar cualquier acto que pueda desacreditar la profesión."
        },
        {
          id: "t13-q16",
          question: "¿Cuándo existe conflicto de intereses?",
          options: ["Nunca", "Cuando los intereses compiten con el deber profesional", "Solo en auditoría", "Solo financieramente"],
          correctAnswer: 1,
          explanation: "Existe cuando los intereses del profesional compiten con sus deberes hacia el cliente."
        },
        {
          id: "t13-q17",
          question: "¿Qué es la diligencia profesional?",
          options: ["Solo rapidez", "Actuar con competencia y cuidado apropiados", "Solo perfección", "Solo experiencia"],
          correctAnswer: 1,
          explanation: "Implica actuar de acuerdo con los requisitos de un encargo con competencia y cuidado apropiados."
        },
        {
          id: "t13-q18",
          question: "¿Cuál es la responsabilidad ante presiones indebidas?",
          options: ["Ceder siempre", "No permitir que comprometan el juicio profesional", "Solo reportar", "Ignorarlas"],
          correctAnswer: 1,
          explanation: "El profesional no debe permitir que presiones de terceros comprometan su juicio profesional."
        },
        {
          id: "t13-q19",
          question: "¿Qué son las Normas Internacionales de Auditoría (NIA)?",
          options: ["Solo recomendaciones", "Estándares profesionales para auditorías", "Solo para España", "Solo para empresas grandes"],
          correctAnswer: 1,
          explanation: "Son estándares profesionales que establecen principios básicos y procedimientos esenciales para auditorías."
        },
        {
          id: "t13-q20",
          question: "¿Cuál es el papel del Código de Ética del IESBA?",
          options: ["Solo orientativo", "Establecer estándares éticos para profesionales contables", "Solo para auditores", "Solo internacional"],
          correctAnswer: 1,
          explanation: "Establece los estándares éticos fundamentales para todos los profesionales de la contabilidad a nivel internacional."
        }
      ]
    },
    {
      themeId: "tema-14",
      themeName: "Instrumentos Financieros y Derivados",
      tests: [
        {
          id: "t14-q1",
          question: "¿Qué es un instrumento financiero?",
          options: ["Solo acciones", "Contrato que da lugar a activo financiero y pasivo", "Solo bonos", "Solo derivados"],
          correctAnswer: 1,
          explanation: "Es cualquier contrato que dé lugar a un activo financiero en una entidad y a un pasivo financiero o instrumento de patrimonio en otra."
        },
        {
          id: "t14-q2",
          question: "¿Cuáles son las categorías de activos financieros?",
          options: ["Solo dos", "Coste amortizado, valor razonable con cambios en PyG, valor razonable con cambios en patrimonio", "Solo tres", "Solo coste"],
          correctAnswer: 1,
          explanation: "Se clasifican en coste amortizado, valor razonable con cambios en resultados y valor razonable con cambios en patrimonio."
        },
        {
          id: "t14-q3",
          question: "¿Qué son los derivados financieros?",
          options: ["Solo futuros", "Instrumentos cuyo valor deriva de activos subyacentes", "Solo opciones", "Solo swaps"],
          correctAnswer: 1,
          explanation: "Son instrumentos financieros cuyo valor se deriva del precio de otros activos subyacentes."
        },
        {
          id: "t14-q4",
          question: "¿Cuáles son las características de los derivados?",
          options: ["Solo una", "Valor deriva de subyacente, requiere poca inversión, liquidación futura", "Solo dos", "Múltiples"],
          correctAnswer: 1,
          explanation: "Su valor deriva de un subyacente, requieren poca o ninguna inversión inicial y se liquidan en fecha futura."
        },
        {
          id: "t14-q5",
          question: "¿Qué es la contabilidad de coberturas?",
          options: ["Solo reducir riesgos", "Tratamiento contable que refleja actividades de gestión de riesgo", "Solo derivados", "Solo seguros"],
          correctAnswer: 1,
          explanation: "Es un tratamiento contable que refleja las actividades de gestión de riesgo cuando se usan instrumentos financieros."
        },
        {
          id: "t14-q6",
          question: "¿Cuáles son los tipos de cobertura?",
          options: ["Solo una", "Valor razonable, flujos de efectivo, inversión neta", "Solo dos", "Solo valor razonable"],
          correctAnswer: 1,
          explanation: "Los tipos son cobertura de valor razonable, de flujos de efectivo y de inversión neta en negocio extranjero."
        },
        {
          id: "t14-q7",
          question: "¿Qué es el valor razonable?",
          options: ["Precio histórico", "Precio de venta en transacción ordenada en fecha de medición", "Valor en libros", "Coste de reposición"],
          correctAnswer: 1,
          explanation: "Es el precio que se recibiría por vender un activo o se pagaría por transferir un pasivo en una transacción ordenada."
        },
        {
          id: "t14-q8",
          question: "¿Cuáles son los niveles de jerarquía del valor razonable?",
          options: ["Solo dos", "Nivel 1: precios cotizados, Nivel 2: datos observables, Nivel 3: no observables", "Solo uno", "Múltiples"],
          correctAnswer: 1,
          explanation: "Nivel 1 usa precios cotizados, Nivel 2 datos observables distintos a precios, Nivel 3 datos no observables."
        },
        {
          id: "t14-q9",
          question: "¿Qué es el deterioro de activos financieros?",
          options: ["Solo pérdidas", "Reducción en flujos esperados por pérdidas crediticias", "Solo impagos", "Solo intereses"],
          correctAnswer: 1,
          explanation: "Es una reducción en los flujos de efectivo futuros estimados debido a pérdidas crediticias esperadas."
        },
        {
          id: "t14-q10",
          question: "¿Cuándo se reconocen las pérdidas crediticias esperadas?",
          options: ["Solo cuando ocurren", "Desde el reconocimiento inicial del instrumento", "Solo al vencimiento", "Solo si hay impago"],
          correctAnswer: 1,
          explanation: "Se reconocen desde el reconocimiento inicial, no solo cuando ocurren las pérdidas."
        },
        {
          id: "t14-q11",
          question: "¿Qué es un swap de tipos de interés?",
          options: ["Solo préstamo", "Intercambio de flujos de interés entre partes", "Solo inversión", "Solo cobertura"],
          correctAnswer: 1,
          explanation: "Es un acuerdo para intercambiar flujos de pagos de intereses basados en diferentes tipos de interés."
        },
        {
          id: "t14-q12",
          question: "¿Cuál es la diferencia entre futuros y forwards?",
          options: ["No hay diferencia", "Futuros se negocian en mercados organizados, forwards son privados", "Solo el nombre", "Solo el vencimiento"],
          correctAnswer: 1,
          explanation: "Los futuros se negocian en mercados organizados y están estandarizados, los forwards son contratos privados."
        },
        {
          id: "t14-q13",
          question: "¿Qué es una opción financiera?",
          options: ["Obligación de comprar", "Derecho pero no obligación de comprar/vender", "Solo compra", "Solo venta"],
          correctAnswer: 1,
          explanation: "Es un derecho, pero no una obligación, de comprar (call) o vender (put) un activo a precio determinado."
        },
        {
          id: "t14-q14",
          question: "¿Cuándo está una opción 'in the money'?",
          options: ["Nunca", "Cuando tiene valor intrínseco positivo", "Siempre", "Solo al vencimiento"],
          correctAnswer: 1,
          explanation: "Una opción está 'in the money' cuando tiene valor intrínseco positivo (call: precio > strike, put: strike > precio)."
        },
        {
          id: "t14-q15",
          question: "¿Qué es la prima de una opción?",
          options: ["Solo ganancia", "Precio pagado por adquirir el derecho", "Solo pérdida", "Valor final"],
          correctAnswer: 1,
          explanation: "Es el precio que paga el comprador de la opción por adquirir el derecho de ejercer la opción."
        },
        {
          id: "t14-q16",
          question: "¿Qué factores afectan el precio de una opción?",
          options: ["Solo uno", "Precio subyacente, strike, tiempo, volatilidad, tipos interés", "Solo dos", "Solo precio"],
          correctAnswer: 1,
          explanation: "Los factores incluyen precio del subyacente, precio de ejercicio, tiempo hasta vencimiento, volatilidad y tipos de interés."
        },
        {
          id: "t14-q17",
          question: "¿Qué es la volatilidad implícita?",
          options: ["Solo histórica", "Volatilidad esperada reflejada en precio de opciones", "Solo futura", "Solo actual"],
          correctAnswer: 1,
          explanation: "Es la volatilidad esperada del subyacente que está implícita en el precio actual de las opciones."
        },
        {
          id: "t14-q18",
          question: "¿Cuándo es efectiva una relación de cobertura?",
          options: ["Siempre", "Cuando existe relación económica y no domina el riesgo crediticio", "Nunca", "Solo al inicio"],
          correctAnswer: 1,
          explanation: "Es efectiva cuando existe relación económica entre partida cubierta e instrumento de cobertura y el riesgo crediticio no domina."
        },
        {
          id: "t14-q19",
          question: "¿Qué es el riesgo de crédito?",
          options: ["Solo impagos", "Riesgo de pérdida por incumplimiento de contraparte", "Solo tipos interés", "Solo mercado"],
          correctAnswer: 1,
          explanation: "Es el riesgo de que una contraparte incumpla sus obligaciones contractuales causando pérdidas financieras."
        },
        {
          id: "t14-q20",
          question: "¿Cómo se mide la eficacia de la cobertura?",
          options: ["Solo cualitativamente", "Comparando cambios en valor razonable o flujos", "Solo cuantitativamente", "Solo al vencimiento"],
          correctAnswer: 1,
          explanation: "Se mide comparando los cambios en valor razonable o flujos de efectivo del instrumento de cobertura y la partida cubierta."
        }
      ]
    },
    {
      themeId: "tema-15",
      themeName: "Consolidación y Combinaciones de Negocios",
      tests: [
        {
          id: "t15-q1",
          question: "¿Cuándo debe consolidarse una participación?",
          options: ["Siempre", "Cuando se tiene control sobre la entidad", "Solo si es mayoría", "Solo si es rentable"],
          correctAnswer: 1,
          explanation: "Debe consolidarse cuando una entidad controla a otra, independientemente del porcentaje de participación."
        },
        {
          id: "t15-q2",
          question: "¿Qué es el control según NIIF 10?",
          options: ["Solo participación", "Poder sobre la participada, exposición a rendimientos y capacidad de influir", "Solo mayoría", "Solo gestión"],
          correctAnswer: 1,
          explanation: "Control es tener poder sobre la participada, exposición a rendimientos variables y capacidad de influir en esos rendimientos."
        },
        {
          id: "t15-q3",
          question: "¿Cuáles son los métodos de consolidación?",
          options: ["Solo uno", "Integración global, proporcional y puesta en equivalencia", "Solo dos", "Solo global"],
          correctAnswer: 1,
          explanation: "Los métodos son integración global (subsidiarias), integración proporcional (negocios conjuntos) y puesta en equivalencia (asociadas)."
        },
        {
          id: "t15-q4",
          question: "¿Qué elimina en la consolidación por integración global?",
          options: ["Solo deudas", "Inversión vs patrimonio, transacciones intragrupo, resultados no realizados", "Solo inversiones", "Solo resultados"],
          correctAnswer: 1,
          explanation: "Se eliminan la inversión contra patrimonio, las transacciones intragrupo y los resultados no realizados."
        },
        {
          id: "t15-q5",
          question: "¿Qué son los intereses minoritarios?",
          options: ["Solo pequeños", "Participación en subsidiaria no atribuible a controladora", "Solo externos", "Solo accionistas"],
          correctAnswer: 1,
          explanation: "Son la participación en una subsidiaria no atribuible directa o indirectamente a la controladora."
        },
        {
          id: "t15-q6",
          question: "¿Cómo se valoran los intereses minoritarios?",
          options: ["Solo al coste", "A valor razonable o porción de activos netos identificables", "Solo valor en libros", "Solo nominal"],
          correctAnswer: 1,
          explanation: "Pueden valorarse a valor razonable o como porción de los activos netos identificables de la adquirida."
        },
        {
          id: "t15-q7",
          question: "¿Qué es una combinación de negocios?",
          options: ["Cualquier compra", "Transacción donde adquirente obtiene control de negocio", "Solo fusiones", "Solo escisiones"],
          correctAnswer: 1,
          explanation: "Es una transacción en la que una adquirente obtiene el control de uno o más negocios."
        },
        {
          id: "t15-q8",
          question: "¿Cuál es el método de contabilización de combinaciones?",
          options: ["Múltiples métodos", "Método de adquisición", "Método de unión", "Método proporcional"],
          correctAnswer: 1,
          explanation: "Todas las combinaciones de negocios se contabilizan aplicando el método de la adquisición."
        },
        {
          id: "t15-q9",
          question: "¿Cómo se distribuye el precio de adquisición?",
          options: ["Solo a activos", "Activos identificables, pasivos asumidos y fondo de comercio", "Solo a fondo comercio", "Por partes iguales"],
          correctAnswer: 1,
          explanation: "Se asigna a activos identificables adquiridos, pasivos asumidos y cualquier fondo de comercio resultante."
        },
        {
          id: "t15-q10",
          question: "¿Qué es el fondo de comercio?",
          options: ["Solo reputación", "Exceso de precio sobre valor razonable de activos netos", "Solo marca", "Solo clientes"],
          correctAnswer: 1,
          explanation: "Es el exceso del precio de adquisición sobre el valor razonable de los activos netos identificables adquiridos."
        },
        {
          id: "t15-q11",
          question: "¿Cómo se contabiliza posteriormente el fondo de comercio?",
          options: ["Se amortiza", "No se amortiza, se prueba deterioro anualmente", "Se revalúa", "Se elimina"],
          correctAnswer: 1,
          explanation: "No se amortiza, pero se somete a pruebas de deterioro al menos anualmente."
        },
        {
          id: "t15-q12",
          question: "¿Qué es una adquisición en etapas?",
          options: ["Solo una compra", "Obtener control mediante compras sucesivas", "Solo fusiones", "Solo canjes"],
          correctAnswer: 1,
          explanation: "Es cuando el adquirente obtiene control de una adquirida mediante compras sucesivas durante un período."
        },
        {
          id: "t15-q13",
          question: "¿Cuándo existe influencia significativa?",
          options: ["Solo con mayoría", "Generalmente con 20% o más de derechos de voto", "Solo con control", "Solo con gestión"],
          correctAnswer: 1,
          explanation: "Se presume influencia significativa cuando se posee el 20% o más de los derechos de voto."
        },
        {
          id: "t15-q14",
          question: "¿Qué es un negocio conjunto?",
          options: ["Solo sociedad", "Acuerdo donde partes tienen control conjunto", "Solo participación", "Solo cooperación"],
          correctAnswer: 1,
          explanation: "Es un acuerdo contractual donde dos o más partes ejercen control conjunto sobre la actividad."
        },
        {
          id: "t15-q15",
          question: "¿Cuáles son los tipos de negocios conjuntos?",
          options: ["Solo uno", "Operaciones conjuntas y negocios conjuntos", "Solo operaciones", "Solo sociedades"],
          correctAnswer: 1,
          explanation: "Se clasifican en operaciones conjuntas (derechos sobre activos y obligaciones) y negocios conjuntos (derechos sobre activos netos)."
        },
        {
          id: "t15-q16",
          question: "¿Cuándo se debe reexpresar información comparativa?",
          options: ["Nunca", "Solo en consolidación por primera vez", "Siempre", "Solo cuando cambia control"],
          correctAnswer: 1,
          explanation: "En consolidación por primera vez se debe reexpresar la información comparativa como si siempre se hubiera consolidado."
        },
        {
          id: "t15-q17",
          question: "¿Qué son las diferencias de cambio de consolidación?",
          options: ["Solo errores", "Diferencias por conversión de estados financieros de filiales extranjeras", "Solo ajustes", "Solo traducciones"],
          correctAnswer: 1,
          explanation: "Son diferencias que surgen al convertir los estados financieros de filiales extranjeras a la moneda de presentación."
        },
        {
          id: "t15-q18",
          question: "¿Cómo se tratan los dividendos intragrupo?",
          options: ["Se mantienen", "Se eliminan completamente", "Se reducen", "Se reclasifican"],
          correctAnswer: 1,
          explanation: "Los dividendos entre entidades del grupo se eliminan completamente en la consolidación."
        },
        {
          id: "t15-q19",
          question: "¿Qué es la pérdida de control?",
          options: ["Solo venta", "Cuando controladora deja de controlar subsidiaria", "Solo reducción", "Solo dilución"],
          correctAnswer: 1,
          explanation: "Ocurre cuando la controladora pierde el control de una subsidiaria, sin importar si mantiene participación."
        },
        {
          id: "t15-q20",
          question: "¿Cómo se contabiliza la pérdida de control?",
          options: ["Solo baja", "Baja de activos y pasivos, reconocimiento de participación retenida a valor razonable", "Solo resultado", "Solo reclasificación"],
          correctAnswer: 1,
          explanation: "Se dan de baja todos los activos y pasivos, se reconoce cualquier participación retenida a valor razonable y se reconoce ganancia o pérdida."
        }
      ]
    }
  ],

  "gestion-administracion-civil": [
    {
      themeId: "tema-1",
      themeName: "Gestión Pública y Modernización Administrativa",
      tests: [
        {
          id: "t1-q1",
          question: "¿Qué es la gestión por procesos en la administración?",
          options: ["Gestión tradicional", "Enfoque en actividades interrelacionadas", "Solo digitalización", "Gestión jerárquica"],
          correctAnswer: 1,
          explanation: "La gestión por procesos enfoca la administración en conjunto de actividades interrelacionadas que crean valor."
        },
        {
          id: "t1-q2",
          question: "¿Cuáles son los principios de la calidad en la gestión pública?",
          options: ["Solo eficiencia", "Orientación al ciudadano y mejora continua", "Solo ahorro", "Rapidez únicamente"],
          correctAnswer: 1,
          explanation: "Los principios incluyen orientación al ciudadano, mejora continua, liderazgo y participación del personal."
        },
        {
          id: "t1-q3",
          question: "¿Qué es la administración electrónica?",
          options: ["Solo ordenadores", "Uso de TIC para mejorar servicios públicos", "Internet únicamente", "Páginas web"],
          correctAnswer: 1,
          explanation: "La administración electrónica usa las TIC para mejorar los servicios públicos y la gestión interna."
        },
        {
          id: "t1-q4",
          question: "¿Qué significa el concepto de 'ventanilla única'?",
          options: ["Una sola oficina", "Punto único de acceso para múltiples trámites", "Solo online", "Servicio 24 horas"],
          correctAnswer: 1,
          explanation: "La ventanilla única permite realizar múltiples trámites desde un solo punto de acceso."
        },
        {
          id: "t1-q5",
          question: "¿Cuál es el objetivo del Plan de Modernización de la AGE?",
          options: ["Solo ahorrar", "Mejorar eficiencia y calidad", "Reducir personal", "Aumentar controles"],
          correctAnswer: 1,
          explanation: "El plan busca mejorar la eficiencia, calidad y orientación al ciudadano de la administración."
        },
        {
          id: "t1-q6",
          question: "¿Qué es la interoperabilidad administrativa?",
          options: ["Cooperación entre países", "Capacidad de sistemas para intercambiar información", "Jerarquía administrativa", "Control presupuestario"],
          correctAnswer: 1,
          explanation: "La interoperabilidad es la capacidad de los sistemas de intercambiar información y usar la información intercambiada."
        },
        {
          id: "t1-q7",
          question: "¿Cuáles son los niveles de madurez digital?",
          options: ["Solo básico y avanzado", "Inicial, gestionado, definido, cuantificado, optimizado", "Alto y bajo", "Manual y automático"],
          correctAnswer: 1,
          explanation: "Los niveles de madurez digital van desde inicial hasta optimizado, pasando por gestionado, definido y cuantificado."
        },
        {
          id: "t1-q8",
          question: "¿Qué es el Esquema Nacional de Interoperabilidad?",
          options: ["Una red informática", "Marco normativo para sistemas de información", "Base de datos", "Portal web"],
          correctAnswer: 1,
          explanation: "Es el conjunto de criterios y recomendaciones en materia de interoperabilidad de los sistemas de información."
        },
        {
          id: "t1-q9",
          question: "¿Qué significa 'once only' en administración digital?",
          options: ["Una sola vez", "Los datos se proporcionan una sola vez", "Un solo trámite", "Una sola administración"],
          correctAnswer: 1,
          explanation: "El principio 'once only' establece que los ciudadanos y empresas deben proporcionar sus datos una sola vez."
        },
        {
          id: "t1-q10",
          question: "¿Cuál es el papel de los datos abiertos en la administración?",
          options: ["Solo transparencia", "Transparencia, innovación y eficiencia", "Control ciudadano", "Ahorro de costes"],
          correctAnswer: 1,
          explanation: "Los datos abiertos promueven transparencia, facilitan innovación y mejoran la eficiencia administrativa."
        },
        {
          id: "t1-q11",
          question: "¿Qué es la gestión del conocimiento en la administración?",
          options: ["Solo formación", "Identificación, captura y uso del conocimiento organizacional", "Bibliotecas", "Archivos"],
          correctAnswer: 1,
          explanation: "La gestión del conocimiento identifica, captura, desarrolla y comparte el conocimiento organizacional."
        },
        {
          id: "t1-q12",
          question: "¿Cuáles son los beneficios de la simplificación administrativa?",
          options: ["Solo ahorro", "Reducción de cargas, mejora de servicios y eficiencia", "Menos personal", "Menos normas"],
          correctAnswer: 1,
          explanation: "La simplificación reduce cargas administrativas, mejora servicios y aumenta la eficiencia."
        },
        {
          id: "t1-q13",
          question: "¿Qué es la agenda digital española?",
          options: ["Un calendario", "Estrategia para la transformación digital", "Una aplicación", "Base de datos"],
          correctAnswer: 1,
          explanation: "Es la estrategia nacional para impulsar la transformación digital de España."
        },
        {
          id: "t1-q14",
          question: "¿Cuál es el rol de la inteligencia artificial en la administración?",
          options: ["Sustituir funcionarios", "Automatizar procesos y mejorar decisiones", "Solo estadísticas", "Control ciudadano"],
          correctAnswer: 1,
          explanation: "La IA ayuda a automatizar procesos, mejorar la toma de decisiones y personalizar servicios."
        },
        {
          id: "t1-q15",
          question: "¿Qué es la firma electrónica cualificada?",
          options: ["Cualquier firma digital", "Firma con certificado cualificado", "Solo DNI electrónico", "Contraseña compleja"],
          correctAnswer: 1,
          explanation: "Es una firma electrónica avanzada basada en un certificado cualificado y creada por un dispositivo seguro."
        },
        {
          id: "t1-q16",
          question: "¿Cuáles son los principios del gobierno abierto?",
          options: ["Solo transparencia", "Transparencia, participación y colaboración", "Eficiencia únicamente", "Control y supervisión"],
          correctAnswer: 1,
          explanation: "Los tres pilares del gobierno abierto son transparencia, participación ciudadana y colaboración."
        },
        {
          id: "t1-q17",
          question: "¿Qué es el teletrabajo en la administración pública?",
          options: ["Solo trabajo en casa", "Modalidad laboral usando TIC fuera del centro habitual", "Trabajo nocturno", "Trabajo de fin de semana"],
          correctAnswer: 1,
          explanation: "El teletrabajo es una modalidad de prestación de servicios usando TIC fuera del centro de trabajo habitual."
        },
        {
          id: "t1-q18",
          question: "¿Cuál es el objetivo de la evaluación de políticas públicas?",
          options: ["Solo control", "Mejorar eficacia y eficiencia de políticas", "Sancionar errores", "Justificar gastos"],
          correctAnswer: 1,
          explanation: "La evaluación busca mejorar la eficacia, eficiencia y utilidad de las políticas públicas."
        },
        {
          id: "t1-q19",
          question: "¿Qué es la gestión del cambio organizacional?",
          options: ["Cambio de personal", "Proceso para facilitar transiciones organizacionales", "Solo restructuración", "Cambio de ubicación"],
          correctAnswer: 1,
          explanation: "La gestión del cambio facilita las transiciones organizacionales para lograr objetivos estratégicos."
        },
        {
          id: "t1-q20",
          question: "¿Cuáles son los retos de la transformación digital pública?",
          options: ["Solo tecnológicos", "Tecnológicos, organizacionales y culturales", "Solo presupuestarios", "Solo legales"],
          correctAnswer: 1,
          explanation: "Los retos incluyen aspectos tecnológicos, organizacionales, culturales, legales y presupuestarios."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Políticas Públicas y Planificación Estratégica",
      tests: [
        {
          id: "t2-q1",
          question: "¿Qué es una política pública?",
          options: ["Solo normas", "Conjunto de decisiones y acciones para resolver problemas", "Solo presupuestos", "Solo programas"],
          correctAnswer: 1,
          explanation: "Una política pública es un conjunto coherente de decisiones y acciones dirigidas a resolver problemas públicamente reconocidos."
        },
        {
          id: "t2-q2",
          question: "¿Cuáles son las fases del ciclo de políticas públicas?",
          options: ["Solo diseño", "Agenda, formulación, implementación, evaluación", "Solo implementación", "Solo evaluación"],
          correctAnswer: 1,
          explanation: "El ciclo incluye formación de agenda, formulación, implementación y evaluación de políticas."
        },
        {
          id: "t2-q3",
          question: "¿Qué es la planificación estratégica en la administración?",
          options: ["Solo presupuesto", "Proceso de definición de objetivos y estrategias", "Solo organización", "Solo control"],
          correctAnswer: 1,
          explanation: "Es el proceso sistemático de definición de objetivos, estrategias y planes de acción a medio y largo plazo."
        },
        {
          id: "t2-q4",
          question: "¿Cuáles son los elementos de un plan estratégico?",
          options: ["Solo objetivos", "Misión, visión, objetivos, estrategias, indicadores", "Solo estrategias", "Solo indicadores"],
          correctAnswer: 1,
          explanation: "Incluye misión, visión, análisis estratégico, objetivos, estrategias e indicadores de seguimiento."
        },
        {
          id: "t2-q5",
          question: "¿Qué es el análisis DAFO en planificación?",
          options: ["Solo financiero", "Análisis de debilidades, amenazas, fortalezas, oportunidades", "Solo interno", "Solo externo"],
          correctAnswer: 1,
          explanation: "Es una herramienta que analiza factores internos (debilidades y fortalezas) y externos (amenazas y oportunidades)."
        },
        {
          id: "t2-q6",
          question: "¿Qué son los indicadores de gestión?",
          options: ["Solo números", "Herramientas para medir desempeño y resultados", "Solo estadísticas", "Solo informes"],
          correctAnswer: 1,
          explanation: "Son herramientas de medición que permiten evaluar el desempeño, eficacia y eficiencia de políticas y programas."
        },
        {
          id: "t2-q7",
          question: "¿Cuáles son los tipos de evaluación de políticas?",
          options: ["Solo final", "Ex ante, intermedia, ex post, de impacto", "Solo inicial", "Solo de proceso"],
          correctAnswer: 1,
          explanation: "Incluyen evaluación ex ante (previa), intermedia (durante), ex post (posterior) y de impacto."
        },
        {
          id: "t2-q8",
          question: "¿Qué es la gestión por resultados?",
          options: ["Solo control", "Enfoque centrado en logro de objetivos y resultados", "Solo proceso", "Solo eficiencia"],
          correctAnswer: 1,
          explanation: "Es un enfoque de gestión centrado en el logro de resultados y el impacto de las políticas públicas."
        },
        {
          id: "t2-q9",
          question: "¿Qué son los mapas de procesos?",
          options: ["Solo dibujos", "Representación gráfica de procesos organizacionales", "Solo organigramas", "Solo flujos"],
          correctAnswer: 1,
          explanation: "Son representaciones gráficas que muestran los procesos, sus interrelaciones y flujos de trabajo."
        },
        {
          id: "t2-q10",
          question: "¿Cuál es la diferencia entre eficacia y eficiencia?",
          options: ["No hay diferencia", "Eficacia logra objetivos, eficiencia optimiza recursos", "Solo terminología", "Depende del contexto"],
          correctAnswer: 1,
          explanation: "Eficacia es el grado de cumplimiento de objetivos, eficiencia es la relación entre resultados y recursos utilizados."
        },
        {
          id: "t2-q11",
          question: "¿Qué es la matriz de marco lógico?",
          options: ["Solo tabla", "Herramienta de planificación y evaluación de proyectos", "Solo presupuesto", "Solo cronograma"],
          correctAnswer: 1,
          explanation: "Es una herramienta que resume los aspectos clave de un proyecto: objetivos, actividades, supuestos e indicadores."
        },
        {
          id: "t2-q12",
          question: "¿Cuáles son los niveles de planificación?",
          options: ["Solo nacional", "Estratégico, táctico y operativo", "Solo sectorial", "Solo local"],
          correctAnswer: 1,
          explanation: "Se divide en niveles estratégico (largo plazo), táctico (medio plazo) y operativo (corto plazo)."
        },
        {
          id: "t2-q13",
          question: "¿Qué son los stakeholders en políticas públicas?",
          options: ["Solo funcionarios", "Todos los actores interesados o afectados", "Solo ciudadanos", "Solo empresas"],
          correctAnswer: 1,
          explanation: "Son todos los actores (individuos, grupos, organizaciones) que tienen interés o son afectados por la política."
        },
        {
          id: "t2-q14",
          question: "¿Qué es la teoría del cambio?",
          options: ["Solo hipótesis", "Descripción de cómo se espera que funcione una intervención", "Solo modelo", "Solo proceso"],
          correctAnswer: 1,
          explanation: "Describe cómo y por qué se espera que una intervención produzca los cambios deseados."
        },
        {
          id: "t2-q15",
          question: "¿Cuáles son los criterios de evaluación de la OCDE?",
          options: ["Solo eficacia", "Pertinencia, eficacia, eficiencia, impacto, sostenibilidad", "Solo impacto", "Solo sostenibilidad"],
          correctAnswer: 1,
          explanation: "Los criterios son pertinencia, eficacia, eficiencia, impacto y sostenibilidad."
        },
        {
          id: "t2-q16",
          question: "¿Qué es la gestión del conocimiento organizacional?",
          options: ["Solo datos", "Proceso de captura, almacenamiento y uso del conocimiento", "Solo información", "Solo archivos"],
          correctAnswer: 1,
          explanation: "Es el proceso sistemático de identificar, capturar, almacenar, compartir y usar el conocimiento organizacional."
        },
        {
          id: "t2-q17",
          question: "¿Qué son los tableros de control o cuadros de mando?",
          options: ["Solo gráficos", "Herramientas de seguimiento de indicadores clave", "Solo estadísticas", "Solo informes"],
          correctAnswer: 1,
          explanation: "Son herramientas que integran y presentan los indicadores clave para el seguimiento de la gestión."
        },
        {
          id: "t2-q18",
          question: "¿Cuál es el papel de la prospectiva en planificación?",
          options: ["Solo pasado", "Análisis de futuros posibles para la toma de decisiones", "Solo presente", "Solo tendencias"],
          correctAnswer: 1,
          explanation: "La prospectiva analiza futuros posibles y probables para informar la planificación estratégica."
        },
        {
          id: "t2-q19",
          question: "¿Qué es el benchmarking en la administración pública?",
          options: ["Solo comparación", "Proceso de comparación con mejores prácticas", "Solo estadísticas", "Solo ranking"],
          correctAnswer: 1,
          explanation: "Es el proceso de comparar prácticas y resultados con organizaciones líderes para identificar mejoras."
        },
        {
          id: "t2-q20",
          question: "¿Cuáles son las barreras típicas en la implementación de políticas?",
          options: ["Solo presupuesto", "Recursos, coordinación, resistencia al cambio, capacidades", "Solo personal", "Solo tiempo"],
          correctAnswer: 1,
          explanation: "Incluyen limitaciones de recursos, problemas de coordinación, resistencia al cambio y déficit de capacidades."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Organización y Gestión de Recursos Humanos",
      tests: [
        {
          id: "t3-q1",
          question: "¿Cuáles son las funciones básicas de la gestión de RRHH?",
          options: ["Solo contratar", "Planificación, selección, desarrollo, evaluación", "Solo formar", "Solo evaluar"],
          correctAnswer: 1,
          explanation: "Las funciones incluyen planificación de plantillas, selección, desarrollo profesional y evaluación del desempeño."
        },
        {
          id: "t3-q2",
          question: "¿Qué es la planificación estrat��gica de recursos humanos?",
          options: ["Solo organigrama", "Alineación de RRHH con objetivos organizacionales", "Solo presupuesto", "Solo contratación"],
          correctAnswer: 1,
          explanation: "Es el proceso de alinear la gestión de recursos humanos con los objetivos estratégicos de la organización."
        },
        {
          id: "t3-q3",
          question: "¿Cuáles son los sistemas de selección en la administración pública?",
          options: ["Solo oposición", "Oposición, concurso-oposición, concurso", "Solo concurso", "Solo entrevista"],
          correctAnswer: 1,
          explanation: "Los sistemas de acceso son oposición, concurso-oposición y concurso, basados en mérito y capacidad."
        },
        {
          id: "t3-q4",
          question: "¿Qué es la gestión por competencias?",
          options: ["Solo conocimientos", "Modelo basado en conocimientos, habilidades y actitudes", "Solo experiencia", "Solo títulos"],
          correctAnswer: 1,
          explanation: "Es un modelo de gestión que se basa en las competencias (conocimientos, habilidades y actitudes) necesarias para el puesto."
        },
        {
          id: "t3-q5",
          question: "¿Cuáles son los tipos de formación en la administración?",
          options: ["Solo inicial", "Inicial, continua, especializada, directiva", "Solo continua", "Solo especializada"],
          correctAnswer: 1,
          explanation: "Incluye formación inicial, continua, especializada y para directivos según las necesidades."
        },
        {
          id: "t3-q6",
          question: "¿Qué es la evaluación del desempeño?",
          options: ["Solo control", "Sistema para valorar rendimiento y competencias", "Solo sanción", "Solo premio"],
          correctAnswer: 1,
          explanation: "Es un sistema sistemático para valorar el rendimiento profesional y el desarrollo de competencias."
        },
        {
          id: "t3-q7",
          question: "¿Cuáles son los elementos de un sistema retributivo?",
          options: ["Solo sueldo", "Retribuciones básicas, complementarias y variables", "Solo complementos", "Solo incentivos"],
          correctAnswer: 1,
          explanation: "Incluye retribuciones básicas, complementarias (destino, específico) y variables (productividad)."
        },
        {
          id: "t3-q8",
          question: "¿Qué es la carrera administrativa horizontal?",
          options: ["Solo ascensos", "Progresión sin cambio de grupo profesional", "Solo vertical", "Solo traslados"],
          correctAnswer: 1,
          explanation: "Permite la progresión profesional dentro del mismo grupo sin necesidad de cambiar de categoría."
        },
        {
          id: "t3-q9",
          question: "¿Cuáles son las modalidades de provisión de puestos?",
          options: ["Solo concurso", "Concurso, libre designación, comisión servicios", "Solo designación", "Solo traslados"],
          correctAnswer: 1,
          explanation: "Los puestos se pueden proveer por concurso, libre designación, comisión de servicios o adscripción."
        },
        {
          id: "t3-q10",
          question: "¿Qué es la gestión del talento en el sector público?",
          options: ["Solo reclutamiento", "Identificación, desarrollo y retención del talento", "Solo formación", "Solo promoción"],
          correctAnswer: 1,
          explanation: "Comprende la identificación, desarrollo y retención del talento para mejorar el rendimiento organizacional."
        },
        {
          id: "t3-q11",
          question: "¿Cuáles son los principios de la igualdad en el empleo público?",
          options: ["Solo género", "No discriminación, igualdad de oportunidades, conciliación", "Solo edad", "Solo discapacidad"],
          correctAnswer: 1,
          explanation: "Incluyen no discriminación, igualdad de oportunidades, conciliación y medidas de acción positiva."
        },
        {
          id: "t3-q12",
          question: "¿Qué es la movilidad funcional?",
          options: ["Solo cambios", "Cambio de funciones dentro del mismo grupo", "Solo traslados", "Solo ascensos"],
          correctAnswer: 1,
          explanation: "Es el cambio de funciones dentro del mismo grupo profesional y área de conocimiento."
        },
        {
          id: "t3-q13",
          question: "¿Cuáles son las medidas de conciliación laboral?",
          options: ["Solo horarios", "Flexibilidad horaria, teletrabajo, permisos, excedencias", "Solo permisos", "Solo excedencias"],
          correctAnswer: 1,
          explanation: "Incluyen flexibilidad horaria, teletrabajo, permisos especiales y excedencias por motivos familiares."
        },
        {
          id: "t3-q14",
          question: "¿Qué es la gestión del conocimiento organizacional?",
          options: ["Solo información", "Captura, almacenamiento y transferencia del saber", "Solo datos", "Solo documentos"],
          correctAnswer: 1,
          explanation: "Es el proceso de capturar, almacenar, transferir y aplicar el conocimiento organizacional."
        },
        {
          id: "t3-q15",
          question: "¿Cuáles son los indicadores de gestión de RRHH?",
          options: ["Solo números", "Eficiencia, eficacia, calidad, satisfacción", "Solo costes", "Solo tiempo"],
          correctAnswer: 1,
          explanation: "Incluyen indicadores de eficiencia, eficacia, calidad del servicio y satisfacción del personal."
        },
        {
          id: "t3-q16",
          question: "¿Qué es el clima laboral?",
          options: ["Solo ambiente", "Percepción del entorno de trabajo por los empleados", "Solo temperatura", "Solo relaciones"],
          correctAnswer: 1,
          explanation: "Es la percepción que tienen los empleados sobre su entorno de trabajo y la organización."
        },
        {
          id: "t3-q17",
          question: "¿Cuáles son las competencias directivas básicas?",
          options: ["Solo mandar", "Liderazgo, comunicación, gestión equipos, toma decisiones", "Solo controlar", "Solo planificar"],
          correctAnswer: 1,
          explanation: "Incluyen liderazgo, comunicación, gestión de equipos, toma de decisiones y visión estratégica."
        },
        {
          id: "t3-q18",
          question: "¿Qué es la responsabilidad social en la gestión pública?",
          options: ["Solo cumplir", "Compromiso con impacto social y ambiental", "Solo legal", "Solo económico"],
          correctAnswer: 1,
          explanation: "Es el compromiso de la organización con el impacto social, ambiental y ético de sus actividades."
        },
        {
          id: "t3-q19",
          question: "¿Cuáles son las fases del proceso de cambio organizacional?",
          options: ["Solo implementar", "Diagnóstico, planificación, implementación, evaluación", "Solo planificar", "Solo evaluar"],
          correctAnswer: 1,
          explanation: "Las fases son diagnóstico de la situación, planificación del cambio, implementación y evaluación de resultados."
        },
        {
          id: "t3-q20",
          question: "¿Qué es la diversidad en el empleo público?",
          options: ["Solo variedad", "Inclusión de diferentes perfiles y perspectivas", "Solo multiculturalidad", "Solo género"],
          correctAnswer: 1,
          explanation: "Es la inclusión de personas con diferentes perfiles, perspectivas y características para enriquecer la organización."
        }
      ]
    },
    {
      themeId: "tema-4",
      themeName: "Gestión Económica y Financiera Pública",
      tests: [
        {
          id: "t4-q1",
          question: "¿Cuáles son los principios de la gestión financiera pública?",
          options: ["Solo equilibrio", "Legalidad, eficiencia, transparencia, sostenibilidad", "Solo eficiencia", "Solo transparencia"],
          correctAnswer: 1,
          explanation: "Los principios fundamentales incluyen legalidad, eficiencia, transparencia y sostenibilidad fiscal."
        },
        {
          id: "t4-q2",
          question: "¿Qué es la planificación financiera a medio plazo?",
          options: ["Solo anual", "Programación plurianual de recursos y gastos", "Solo bienal", "Solo quinquenal"],
          correctAnswer: 1,
          explanation: "Es la programación de recursos financieros y gastos para un período de varios años (generalmente 3-5 años)."
        },
        {
          id: "t4-q3",
          question: "¿Cuáles son las fases del ciclo presupuestario?",
          options: ["Solo ejecución", "Elaboración, aprobación, ejecución, control", "Solo control", "Solo aprobación"],
          correctAnswer: 1,
          explanation: "El ciclo comprende elaboración, aprobación parlamentaria, ejecución y control del presupuesto."
        },
        {
          id: "t4-q4",
          question: "¿Qué es la estabilidad presupuestaria?",
          options: ["Gastos fijos", "Equilibrio o superávit en las cuentas públicas", "Solo ingresos", "Solo déficit"],
          correctAnswer: 1,
          explanation: "Es la situación de equilibrio o superávit en términos de capacidad de financiación de las administraciones."
        },
        {
          id: "t4-q5",
          question: "¿Cuáles son los instrumentos de control financiero?",
          options: ["Solo auditoría", "Control interno, auditoría, intervención", "Solo intervención", "Solo inspección"],
          correctAnswer: 1,
          explanation: "Incluyen el control interno previo, la auditoría posterior y la intervención de operaciones."
        },
        {
          id: "t4-q6",
          question: "¿Qué es la gestión de tesorería?",
          options: ["Solo pagos", "Administración de flujos de cobros y pagos", "Solo cobros", "Solo préstamos"],
          correctAnswer: 1,
          explanation: "Es la gestión de los flujos de cobros y pagos para optimizar la liquidez y minimizar costes financieros."
        },
        {
          id: "t4-q7",
          question: "¿Cuáles son los tipos de ingresos públicos?",
          options: ["Solo impuestos", "Tributarios, patrimoniales, transferencias, endeudamiento", "Solo tasas", "Solo transferencias"],
          correctAnswer: 1,
          explanation: "Los ingresos se clasifican en tributarios, patrimoniales, transferencias y operaciones de endeudamiento."
        },
        {
          id: "t4-q8",
          question: "¿Qué es la sostenibilidad de la deuda pública?",
          options: ["Deuda cero", "Capacidad de servir la deuda sin comprometer servicios", "Solo reducir", "Solo aumentar"],
          correctAnswer: 1,
          explanation: "Es la capacidad de hacer frente al servicio de la deuda sin comprometer la prestación de servicios públicos."
        },
        {
          id: "t4-q9",
          question: "¿Cuáles son las modalidades de contratación pública?",
          options: ["Solo directa", "Abierto, restringido, negociado, diálogo competitivo", "Solo cerrado", "Solo negociado"],
          correctAnswer: 1,
          explanation: "Los procedimientos incluyen abierto, restringido, negociado y diálogo competitivo según la cuantía y características."
        },
        {
          id: "t4-q10",
          question: "¿Qué es la evaluación socioeconómica de proyectos?",
          options: ["Solo coste", "Análisis de beneficios y costes sociales", "Solo beneficio", "Solo financiero"],
          correctAnswer: 1,
          explanation: "Es el análisis que valora los beneficios y costes sociales de un proyecto más allá de los aspectos financieros."
        },
        {
          id: "t4-q11",
          question: "¿Cuáles son los criterios de eficiencia en el gasto?",
          options: ["Solo rapidez", "Economía, eficiencia, eficacia", "Solo calidad", "Solo cantidad"],
          correctAnswer: 1,
          explanation: "Los criterios fundamentales son economía (menor coste), eficiencia (mejor relación recursos/resultados) y eficacia (logro de objetivos)."
        },
        {
          id: "t4-q12",
          question: "¿Qué es la gestión por resultados en el sector público?",
          options: ["Solo proceso", "Enfoque centrado en el logro de objetivos", "Solo actividad", "Solo recursos"],
          correctAnswer: 1,
          explanation: "Es un enfoque de gestión que se centra en el logro de resultados y el impacto de las políticas públicas."
        },
        {
          id: "t4-q13",
          question: "¿Cuáles son los instrumentos de financiación autonómica?",
          options: ["Solo transferencias", "Tributos cedidos, transferencias, endeudamiento", "Solo impuestos", "Solo deuda"],
          correctAnswer: 1,
          explanation: "Incluyen tributos cedidos, transferencias del Estado, recursos propios y operaciones de endeudamiento."
        },
        {
          id: "t4-q14",
          question: "¿Qué es el análisis coste-beneficio?",
          options: ["Solo costes", "Comparación monetaria de beneficios y costes", "Solo beneficios", "Solo tiempo"],
          correctAnswer: 1,
          explanation: "Es una técnica que compara en términos monetarios los beneficios y costes de una inversión o política."
        },
        {
          id: "t4-q15",
          question: "¿Cuáles son las fuentes de financiación local?",
          options: ["Solo transferencias", "Tributos propios, transferencias, tasas, endeudamiento", "Solo impuestos", "Solo tasas"],
          correctAnswer: 1,
          explanation: "Incluyen tributos propios, transferencias estatales y autonómicas, tasas y precios públicos, y endeudamiento."
        },
        {
          id: "t4-q16",
          question: "¿Qué es la consolidación fiscal?",
          options: ["Solo equilibrio", "Proceso de reducción del déficit y deuda", "Solo aumento", "Solo estabilidad"],
          correctAnswer: 1,
          explanation: "Es el proceso de reducción gradual del déficit público y estabilización del ratio de deuda sobre PIB."
        },
        {
          id: "t4-q17",
          question: "¿Cuáles son los límites al endeudamiento público?",
          options: ["Sin límites", "Límites de volumen, destino y plazo", "Solo volumen", "Solo destino"],
          correctAnswer: 1,
          explanation: "Existen límites de volumen anual, destino de los recursos y plazo de amortización según la normativa."
        },
        {
          id: "t4-q18",
          question: "¿Qué es la regla de oro de las finanzas públicas?",
          options: ["Solo ahorrar", "El endeudamiento solo para inversión", "Solo gastar", "Solo equilibrar"],
          correctAnswer: 1,
          explanation: "Establece que el endeudamiento público solo debe destinarse a financiar inversiones productivas, no gasto corriente."
        },
        {
          id: "t4-q19",
          question: "¿Cuáles son los indicadores de sostenibilidad fiscal?",
          options: ["Solo déficit", "Déficit, deuda, gap fiscal, presión fiscal", "Solo deuda", "Solo gap"],
          correctAnswer: 1,
          explanation: "Incluyen ratios de déficit, deuda pública, gap fiscal intergeneracional y presión fiscal."
        },
        {
          id: "t4-q20",
          question: "¿Qué es la coordinación financiera intergubernamental?",
          options: ["Solo central", "Coordinación entre niveles de gobierno", "Solo autonómica", "Solo local"],
          correctAnswer: 1,
          explanation: "Es la coordinación de políticas fiscales y financieras entre los diferentes niveles de gobierno para asegurar coherencia."
        }
      ]
    },
    {
      themeId: "tema-5",
      themeName: "Derecho Administrativo y Procedimiento",
      tests: [
        {
          id: "t5-q1",
          question: "¿Cuáles son las fuentes del Derecho Administrativo?",
          options: ["Solo ley", "Constitución, ley, reglamento, principios", "Solo reglamento", "Solo principios"],
          correctAnswer: 1,
          explanation: "Las fuentes incluyen la Constitución, leyes, reglamentos, principios generales y jurisprudencia."
        },
        {
          id: "t5-q2",
          question: "¿Qué es la potestad reglamentaria?",
          options: ["Solo ejecutar", "Capacidad de dictar normas de rango inferior", "Solo aplicar", "Solo interpretar"],
          correctAnswer: 1,
          explanation: "Es la capacidad de la Administración para dictar normas jurídicas de rango inferior a la ley."
        },
        {
          id: "t5-q3",
          question: "¿Cuáles son los elementos del acto administrativo?",
          options: ["Solo contenido", "Subjetivos, objetivos y formales", "Solo forma", "Solo causa"],
          correctAnswer: 1,
          explanation: "Los elementos son subjetivos (competencia), objetivos (contenido, causa, fin) y formales (procedimiento, forma)."
        },
        {
          id: "t5-q4",
          question: "¿Cuándo es nulo de pleno derecho un acto administrativo?",
          options: ["Solo por forma", "Por vicios graves: competencia, contenido imposible", "Solo por fondo", "Nunca es nulo"],
          correctAnswer: 1,
          explanation: "Son nulos los actos que vulneren derechos fundamentales, carezcan de competencia o tengan contenido imposible."
        },
        {
          id: "t5-q5",
          question: "¿Qué es la ejecutividad del acto administrativo?",
          options: ["Solo firme", "Producir efectos desde su notificación", "Solo recurrible", "Solo válido"],
          correctAnswer: 1,
          explanation: "Los actos administrativos son inmediatamente ejecutivos y producen efectos desde su notificación."
        },
        {
          id: "t5-q6",
          question: "¿Cuáles son las fases del procedimiento administrativo común?",
          options: ["Solo dos", "Iniciación, instrucción y terminación", "Solo tres", "Solo una"],
          correctAnswer: 1,
          explanation: "El procedimiento se estructura en las fases de iniciación, instrucción y terminación."
        },
        {
          id: "t5-q7",
          question: "¿Cuál es el plazo máximo para resolver?",
          options: ["3 meses", "6 meses salvo norma específica", "1 año", "Sin plazo"],
          correctAnswer: 1,
          explanation: "El plazo máximo es de 6 meses, salvo que una disposición establezca plazo diferente."
        },
        {
          id: "t5-q8",
          question: "¿Qué efectos tiene el silencio administrativo?",
          options: ["Siempre negativo", "Estimatorio salvo casos específicos", "Siempre positivo", "Sin efectos"],
          correctAnswer: 1,
          explanation: "El silencio tiene efectos estimatorios, salvo en procedimientos específicos donde es desestimatorio."
        },
        {
          id: "t5-q9",
          question: "¿Cuándo procede la responsabilidad patrimonial?",
          options: ["Solo culpa", "Daños que no se tengan deber de soportar", "Solo dolo", "Nunca"],
          correctAnswer: 1,
          explanation: "Procede cuando se causen daños que los particulares no tengan el deber jurídico de soportar."
        },
        {
          id: "t5-q10",
          question: "¿Qué es la potestad sancionadora?",
          options: ["Solo penal", "Capacidad administrativa de imponer sanciones", "Solo disciplinaria", "Solo tributaria"],
          correctAnswer: 1,
          explanation: "Es la capacidad de la Administración para imponer sanciones por infracciones administrativas."
        },
        {
          id: "t5-q11",
          question: "¿Cuáles son los principios del procedimiento sancionador?",
          options: ["Solo legalidad", "Legalidad, tipicidad, responsabilidad, proporcionalidad", "Solo proporcionalidad", "Solo responsabilidad"],
          correctAnswer: 1,
          explanation: "Rigen los principios de legalidad, tipicidad, responsabilidad, proporcionalidad y non bis in idem."
        },
        {
          id: "t5-q12",
          question: "¿Qué es la revisión de oficio?",
          options: ["Solo recursos", "Procedimiento para anular actos nulos", "Solo tribunal", "Solo revisión"],
          correctAnswer: 1,
          explanation: "Es el procedimiento que permite a la Administración anular sus propios actos nulos de pleno derecho."
        },
        {
          id: "t5-q13",
          question: "¿Cuándo se puede revocar un acto favorable?",
          options: ["Siempre", "Cuando sea ilegal y no cree derechos", "Nunca", "Solo por tribunal"],
          correctAnswer: 1,
          explanation: "Se puede revocar cuando sea contrario al ordenamiento y no haya generado derechos subjetivos."
        },
        {
          id: "t5-q14",
          question: "¿Qué son los recursos administrativos?",
          options: ["Solo judiciales", "Medios de impugnación ante la propia Administración", "Solo políticos", "Solo parlamentarios"],
          correctAnswer: 1,
          explanation: "Son medios de impugnación que se interponen ante la propia Administración autora del acto."
        },
        {
          id: "t5-q15",
          question: "¿Cuál es el recurso ordinario por excelencia?",
          options: ["Reposición", "Alzada", "Extraordinario", "Revisión"],
          correctAnswer: 1,
          explanation: "El recurso de alzada es el recurso administrativo ordinario que se interpone ante el superior jerárquico."
        },
        {
          id: "t5-q16",
          question: "¿Qué es la ejecutoriedad del acto?",
          options: ["Solo válido", "Facultad de ejecutar forzosamente", "Solo eficaz", "Solo firme"],
          correctAnswer: 1,
          explanation: "Es la facultad de la Administración de ejecutar por sí misma sus actos sin acudir a los tribunales."
        },
        {
          id: "t5-q17",
          question: "¿Cu��ndo se interrumpe la prescripción?",
          options: ["Nunca", "Por actuaciones que impliquen ejercicio del derecho", "Solo por recursos", "Solo por denuncias"],
          correctAnswer: 1,
          explanation: "Se interrumpe por cualquier actuación administrativa o del interesado que implique ejercicio del derecho."
        },
        {
          id: "t5-q18",
          question: "¿Qué es la caducidad del procedimiento?",
          options: ["Solo tiempo", "Extinción por paralización imputable al interesado", "Solo desistimiento", "Solo archivo"],
          correctAnswer: 1,
          explanation: "Es la extinción del procedimiento por paralización durante tres meses por causa imputable al interesado."
        },
        {
          id: "t5-q19",
          question: "¿Cuándo hay desviación de poder?",
          options: ["Solo competencia", "Uso de potestad para fin distinto del legal", "Solo forma", "Solo procedimiento"],
          correctAnswer: 1,
          explanation: "Existe cuando se ejercita una potestad administrativa para un fin distinto de aquel para el que fue conferida."
        },
        {
          id: "t5-q20",
          question: "¿Qué garantías tienen los interesados?",
          options: ["Solo defensa", "Audiencia, defensa, información, representación", "Solo audiencia", "Solo información"],
          correctAnswer: 1,
          explanation: "Los interesados tienen derechos de audiencia, defensa, información, representación y asistencia."
        }
      ]
    },
    {
      themeId: "tema-6",
      themeName: "Contratación del Sector Público",
      tests: [
        {
          id: "t6-q1",
          question: "¿Qué ley regula la contratación del sector público?",
          options: ["Ley 30/2007", "Ley 9/2017", "Ley 39/2015", "Ley 40/2015"],
          correctAnswer: 1,
          explanation: "La Ley 9/2017 de Contratos del Sector Público regula la contratación pública española."
        },
        {
          id: "t6-q2",
          question: "¿Cuáles son los tipos de contratos administrativos?",
          options: ["Solo obras", "Obras, servicios, suministros, concesión", "Solo servicios", "Solo concesión"],
          correctAnswer: 1,
          explanation: "Los contratos administrativos típicos son de obras, servicios, suministros y concesión de obras y servicios."
        },
        {
          id: "t6-q3",
          question: "¿Cuáles son los principios de la contratación pública?",
          options: ["Solo economía", "Libertad acceso, no discriminación, igualdad, transparencia", "Solo transparencia", "Solo igualdad"],
          correctAnswer: 1,
          explanation: "Los principios incluyen libertad de acceso, no discriminación, igualdad de trato, transparencia y proporcionalidad."
        },
        {
          id: "t6-q4",
          question: "¿Qué es la mesa de contratación?",
          options: ["Solo administrativa", "Órgano colegiado de asistencia al órgano de contratación", "Solo técnica", "Solo económica"],
          correctAnswer: 1,
          explanation: "Es el órgano colegiado que asiste al órgano de contratación en la adjudicación de contratos."
        },
        {
          id: "t6-q5",
          question: "¿Cuándo es obligatorio el procedimiento abierto?",
          options: ["Siempre", "Cuando se superen determinados umbrales", "Nunca", "Solo obras"],
          correctAnswer: 1,
          explanation: "Es obligatorio para contratos que superen los umbrales establecidos en la normativa europea."
        },
        {
          id: "t6-q6",
          question: "¿Qué son los criterios de adjudicación?",
          options: ["Solo precio", "Parámetros para evaluar ofertas", "Solo calidad", "Solo plazo"],
          correctAnswer: 1,
          explanation: "Son los parámetros objetivos en base a los cuales se evalúan y comparan las ofertas."
        },
        {
          id: "t6-q7",
          question: "¿Cuál debe ser el criterio principal de adjudicación?",
          options: ["Menor precio", "Mejor relación calidad-precio", "Mayor calidad", "Menor plazo"],
          correctAnswer: 1,
          explanation: "El criterio principal debe ser la mejor relación calidad-precio o el coste, incluido el coste del ciclo de vida."
        },
        {
          id: "t6-q8",
          question: "¿Qué es la solvencia del contratista?",
          options: ["Solo económica", "Aptitud para ejecutar el contrato", "Solo técnica", "Solo experiencia"],
          correctAnswer: 1,
          explanation: "Es la aptitud del empresario para ejecutar la prestación objeto del contrato de forma adecuada."
        },
        {
          id: "t6-q9",
          question: "¿Cuándo se perfecciona el contrato administrativo?",
          options: ["Con la adjudicación", "Con la formalización", "Con la notificación", "Con el inicio"],
          correctAnswer: 1,
          explanation: "Los contratos administrativos se perfeccionan con su formalización en documento administrativo."
        },
        {
          id: "t6-q10",
          question: "¿Qué es la garantía definitiva?",
          options: ["Solo provisional", "Garantía del cumplimiento del contrato", "Solo de mantenimiento", "Solo de calidad"],
          correctAnswer: 1,
          explanation: "Es la garantía que debe constituir el adjudicatario para responder del cumplimiento del contrato."
        },
        {
          id: "t6-q11",
          question: "¿Cuáles son las prerrogativas de la Administración?",
          options: ["Solo pagar", "Dirección, inspección, modificación, resolución", "Solo dirigir", "Solo modificar"],
          correctAnswer: 1,
          explanation: "La Administración tiene prerrogativas de dirección, inspección, modificación unilateral y resolución."
        },
        {
          id: "t6-q12",
          question: "¿Cuándo se puede modificar un contrato?",
          options: ["Libremente", "Cuando esté previsto o por interés público", "Nunca", "Solo por mutuo acuerdo"],
          correctAnswer: 1,
          explanation: "Se puede modificar cuando esté previsto en los pliegos o por razones de interés público."
        },
        {
          id: "t6-q13",
          question: "¿Qué es el equilibrio económico del contrato?",
          options: ["Solo ganancias", "Mantenimiento de la ecuación financiera", "Solo pérdidas", "Solo costes"],
          correctAnswer: 1,
          explanation: "Es el principio que busca mantener la equivalencia entre las prestaciones de las partes."
        },
        {
          id: "t6-q14",
          question: "¿Cuándo procede la resolución del contrato?",
          options: ["Solo incumplimiento", "Por causas previstas en la ley", "Solo por mutuo acuerdo", "Solo al finalizar"],
          correctAnswer: 1,
          explanation: "Procede por las causas de resolución establecidas en la ley o en el contrato."
        },
        {
          id: "t6-q15",
          question: "¿Qué es la recepción del contrato?",
          options: ["Solo formal", "Acto de conformidad con la prestación", "Solo provisional", "Solo definitiva"],
          correctAnswer: 1,
          explanation: "Es el acto por el cual la Administración declara su conformidad con la prestación realizada."
        },
        {
          id: "t6-q16",
          question: "¿Cuál es el plazo de garantía en contratos de obras?",
          options: ["6 meses", "1 año", "2 años", "3 años"],
          correctAnswer: 1,
          explanation: "El plazo de garantía en contratos de obras es de un año desde la recepción."
        },
        {
          id: "t6-q17",
          question: "¿Qué son los pliegos de cláusulas administrativas?",
          options: ["Solo técnicos", "Documentos con condiciones jurídicas del contrato", "Solo económicos", "Solo de valoración"],
          correctAnswer: 1,
          explanation: "Contienen las cláusulas relativas a los aspectos jurídicos, económicos y administrativos."
        },
        {
          id: "t6-q18",
          question: "¿Cuándo procede el procedimiento negociado?",
          options: ["Siempre", "En casos excepcionales previstos", "Nunca", "Solo emergencias"],
          correctAnswer: 1,
          explanation: "Procede en los supuestos específicamente previstos en la ley como excepcionales."
        },
        {
          id: "t6-q19",
          question: "¿Qué es la revisión de precios?",
          options: ["Solo reducción", "Actualización por variación de costes", "Solo aumento", "Solo fija"],
          correctAnswer: 1,
          explanation: "Es la actualización del precio del contrato por variación de los costes de sus factores."
        },
        {
          id: "t6-q20",
          question: "¿Cuáles son los recursos en materia de contratación?",
          options: ["Solo administrativos", "Recurso especial y contencioso-administrativo", "Solo judiciales", "Solo especiales"],
          correctAnswer: 1,
          explanation: "Existe un recurso especial en materia de contratación y el recurso contencioso-administrativo."
        }
      ]
    }
  ],

  "tecnicos-hacienda": [
    {
      themeId: "tema-1",
      themeName: "Sistema Tributario Español",
      tests: [
        {
          id: "t1-q1",
          question: "��Cuáles son los principios constitucionales del sistema tributario?",
          options: ["Solo justicia", "Justicia, generalidad, igualdad, progresividad", "Solo igualdad", "Solo progresividad"],
          correctAnswer: 1,
          explanation: "El artículo 31 CE establece los principios de justicia, generalidad, igualdad, progresividad y no confiscatoriedad."
        },
        {
          id: "t1-q2",
          question: "¿Qué es el hecho imponible?",
          options: ["El pago del impuesto", "Presupuesto de hecho que origina la obligación tributaria", "La base imponible", "El tipo de gravamen"],
          correctAnswer: 1,
          explanation: "El hecho imponible es el presupuesto de hecho fijado por la ley para configurar cada tributo y cuya realización origina el nacimiento de la obligación tributaria."
        },
        {
          id: "t1-q3",
          question: "¿Cuándo nace la obligación tributaria?",
          options: ["Al pagar", "Al realizar el hecho imponible", "Al presentar declaración", "Al final del año"],
          correctAnswer: 1,
          explanation: "La obligación tributaria nace cuando se realiza el hecho imponible."
        },
        {
          id: "t1-q4",
          question: "¿Cuáles son los elementos de la obligación tributaria?",
          options: ["Solo sujeto y objeto", "Sujetos, hecho imponible, base, tipo y cuota", "Solo base y tipo", "Solo hecho imponible"],
          correctAnswer: 1,
          explanation: "Los elementos son: sujetos, hecho imponible, base imponible, tipo de gravamen y cuota tributaria."
        },
        {
          id: "t1-q5",
          question: "¿Quién es el sujeto pasivo principal?",
          options: ["La Administración", "Quien realiza el hecho imponible", "El responsable", "El retenedor"],
          correctAnswer: 1,
          explanation: "El sujeto pasivo principal es la persona física o jurídica que realiza el hecho imponible."
        },
        {
          id: "t1-q6",
          question: "¿Qué diferencia hay entre tasa e impuesto?",
          options: ["No hay diferencia", "La tasa se paga por un servicio específico", "Solo el nombre", "La tasa es opcional"],
          correctAnswer: 1,
          explanation: "La tasa se paga por la prestación de un servicio público específico o por la utilización del dominio público."
        },
        {
          id: "t1-q7",
          question: "¿Cuándo prescribe la obligación de pago tributaria?",
          options: ["2 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "La obligación de pago prescribe a los 4 años desde la finalización del plazo reglamentario de pago."
        },
        {
          id: "t1-q8",
          question: "¿Qué es la base imponible?",
          options: ["El tipo de gravamen", "Magnitud dineraria o de otra naturaleza que mide la capacidad económica", "La cuota", "El hecho imponible"],
          correctAnswer: 1,
          explanation: "La base imponible es la magnitud dineraria o de otra naturaleza que resulta de la medición del hecho imponible."
        },
        {
          id: "t1-q9",
          question: "¿Cuáles son los métodos de determinación de la base imponible?",
          options: ["Solo directo", "Estimación directa, objetiva e indirecta", "Solo objetivo", "Solo indirecto"],
          correctAnswer: 1,
          explanation: "Los métodos son: estimación directa, estimación objetiva y estimaci��n indirecta."
        },
        {
          id: "t1-q10",
          question: "¿Qué es la cuota tributaria?",
          options: ["La base imponible", "Cantidad a ingresar resultante de aplicar el tipo a la base", "El hecho imponible", "La deuda total"],
          correctAnswer: 1,
          explanation: "La cuota tributaria es la cantidad que resulta de aplicar el tipo de gravamen a la base imponible."
        },
        {
          id: "t1-q11",
          question: "¿Cuándo se considera domiciliado fiscalmente en España?",
          options: ["Solo nacionalidad", "Residencia habitual o núcleo principal de intereses", "Solo nacimiento", "Solo trabajo"],
          correctAnswer: 1,
          explanation: "Se considera cuando se tenga la residencia habitual en España o cuando radique en España el núcleo principal de actividades o intereses económicos."
        },
        {
          id: "t1-q12",
          question: "¿Qué son las contribuciones especiales?",
          options: ["Impuestos especiales", "Tributos por beneficio derivado de obra pública", "Tasas elevadas", "Solo multas"],
          correctAnswer: 1,
          explanation: "Son tributos que gravan el beneficio o aumento de valor de los bienes derivado de obras públicas o actividades administrativas."
        },
        {
          id: "t1-q13",
          question: "¿Cuál es el período de prescripción para comprobar e investigar?",
          options: ["2 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "El derecho de la Administración para comprobar e investigar prescribe a los 4 años."
        },
        {
          id: "t1-q14",
          question: "¿Qué es la solidaridad tributaria?",
          options: ["Ayuda entre contribuyentes", "Responsabilidad conjunta por la deuda", "Solo para empresas", "Opcional"],
          correctAnswer: 1,
          explanation: "La solidaridad implica que varios deudores responden por el total de la deuda tributaria."
        },
        {
          id: "t1-q15",
          question: "¿Cuándo se aplica la responsabilidad subsidiaria?",
          options: ["Siempre", "Cuando no se pueda cobrar del deudor principal", "Nunca", "Solo en fraude"],
          correctAnswer: 1,
          explanation: "La responsabilidad subsidiaria se exige cuando no se ha podido obtener el cobro del deudor principal."
        },
        {
          id: "t1-q16",
          question: "¿Qué es la capacidad económica?",
          options: ["Solo ingresos", "Aptitud para soportar cargas públicas", "Solo patrimonio", "Solo gastos"],
          correctAnswer: 1,
          explanation: "La capacidad económica es la aptitud para contribuir al sostenimiento de las cargas públicas."
        },
        {
          id: "t1-q17",
          question: "¿Cuáles son los tributos cedidos a las CC.AA.?",
          options: ["Solo IVA", "IRPF parcial, Transmisiones, Sucesiones, etc.", "Solo Patrimonio", "Todos los impuestos"],
          correctAnswer: 1,
          explanation: "Incluyen tramo autonómico del IRPF, Transmisiones Patrimoniales, Sucesiones y Donaciones, entre otros."
        },
        {
          id: "t1-q18",
          question: "¿Qué caracteriza a los impuestos directos?",
          options: ["Se trasladan", "Gravan manifestaciones directas de capacidad económica", "Solo sobre consumo", "Solo empresarios"],
          correctAnswer: 1,
          explanation: "Los impuestos directos gravan manifestaciones directas de capacidad económica como la renta o el patrimonio."
        },
        {
          id: "t1-q19",
          question: "¿Cuál es la diferencia entre devengo y exigibilidad?",
          options: ["No hay diferencia", "Devengo es cuando nace, exigibilidad cuando se puede reclamar", "Solo terminología", "Devengo es pago"],
          correctAnswer: 1,
          explanation: "El devengo es cuando nace la obligación, la exigibilidad cuando la Administración puede reclamar el pago."
        },
        {
          id: "t1-q20",
          question: "¿Qué es el régimen especial de grupo de entidades?",
          options: ["Solo grandes empresas", "Tributación consolidada de empresas vinculadas", "Solo multinacionales", "Régimen opcional"],
          correctAnswer: 1,
          explanation: "Permite la tributación consolidada en el Impuesto sobre Sociedades de entidades que formen un grupo fiscal."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "IRPF - Impuesto sobre la Renta de las Personas Físicas",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuál es el hecho imponible del IRPF?",
          options: ["Solo salarios", "Obtención de renta por personas físicas", "Solo empresarios", "Solo capital"],
          correctAnswer: 1,
          explanation: "El hecho imponible es la obtención de renta por el contribuyente durante el período impositivo."
        },
        {
          id: "t2-q2",
          question: "¿Quiénes son contribuyentes del IRPF?",
          options: ["Solo trabajadores", "Personas físicas residentes en España", "Solo empresarios", "Todas las personas"],
          correctAnswer: 1,
          explanation: "Son contribuyentes las personas físicas que tengan su residencia habitual en territorio español."
        },
        {
          id: "t2-q3",
          question: "¿Cuáles son los tipos de rendimientos en el IRPF?",
          options: ["Solo trabajo", "Trabajo, capital, actividades económicas", "Solo capital", "Solo inmobiliario"],
          correctAnswer: 1,
          explanation: "Los rendimientos se clasifican en del trabajo, del capital inmobiliario, del capital mobiliario y de actividades económicas."
        },
        {
          id: "t2-q4",
          question: "¿Qué es la base imponible general?",
          options: ["Solo salarios", "Suma de rendimientos y ganancias y pérdidas no sometidas a retención", "Solo empresarial", "Solo inmobiliaria"],
          correctAnswer: 1,
          explanation: "Está constituida por la totalidad de los rendimientos y las ganancias y pérdidas patrimoniales no sometidas a tarifa especial."
        },
        {
          id: "t2-q5",
          question: "¿Cuál es el mínimo personal y familiar?",
          options: ["5.550€", "Varía según circunstancias familiares desde 5.550€", "Fijo para todos", "No existe"],
          correctAnswer: 1,
          explanation: "El mínimo personal es de 5.550€, incrementándose por edad, discapacidad, descendientes y ascendientes."
        },
        {
          id: "t2-q6",
          question: "¿Cuándo se aplica tributación conjunta?",
          options: ["Siempre", "Opcionalmente entre cónyuges", "Solo separados", "Solo solteros"],
          correctAnswer: 1,
          explanation: "Los cónyuges pueden optar por tributación conjunta cuando resulte más favorable."
        },
        {
          id: "t2-q7",
          question: "¿Qué son las reducciones en la base imponible?",
          options: ["Impuestos", "Importes que disminuyen la base imponible", "Gastos", "Ingresos"],
          correctAnswer: 1,
          explanation: "Son importes que se restan de la base imponible como aportaciones a planes de pensiones, etc."
        },
        {
          id: "t2-q8",
          question: "¿Cuál es la escala de gravamen general?",
          options: ["Fija 19%", "Progresiva del 19% al 47%", "Solo 24%", "Variable anual"],
          correctAnswer: 1,
          explanation: "Es progresiva desde el 19% hasta el 47% según tramos de base liquidable."
        },
        {
          id: "t2-q9",
          question: "¿Qué es la base liquidable?",
          options: ["Base imponible", "Base imponible menos reducciones", "Solo rendimientos", "Solo ganancias"],
          correctAnswer: 1,
          explanation: "Es el resultado de disminuir la base imponible en las reducciones previstas legalmente."
        },
        {
          id: "t2-q10",
          question: "¿Cuáles son las deducciones en la cuota?",
          options: ["Solo vivienda", "Por inversión, donativos, familia numerosa, etc.", "Solo donativos", "Solo hijos"],
          correctAnswer: 1,
          explanation: "Incluyen deducciones por inversión en vivienda habitual, donativos, familia numerosa, etc."
        },
        {
          id: "t2-q11",
          question: "¿Qué es el gravamen autonómico?",
          options: ["Impuesto separado", "Parte de la tarifa aplicada por las CC.AA.", "Solo estatal", "Solo municipal"],
          correctAnswer: 1,
          explanation: "Es la parte de la tarifa del IRPF cuya recaudación corresponde a las comunidades autónomas."
        },
        {
          id: "t2-q12",
          question: "¿Cuándo están exentos los rendimientos del trabajo?",
          options: ["Nunca", "Indemnizaciones por despido hasta ciertos límites", "Siempre", "Solo funcionarios"],
          correctAnswer: 1,
          explanation: "Están exentas las indemnizaciones por despido hasta el importe establecido legalmente."
        },
        {
          id: "t2-q13",
          question: "¿Qué son las ganancias y pérdidas patrimoniales?",
          options: ["Solo venta casa", "Variaciones en el valor del patrimonio", "Solo acciones", "Solo inmobiliario"],
          correctAnswer: 1,
          explanation: "Son las variaciones en el valor del patrimonio que se pongan de manifiesto con ocasión de cualquier alteración en su composición."
        },
        {
          id: "t2-q14",
          question: "¿Cuál es el período impositivo del IRPF?",
          options: ["Mensual", "Año natural", "Trimestral", "Semestral"],
          correctAnswer: 1,
          explanation: "El período impositivo coincide con el año natural, salvo fallecimiento del contribuyente."
        },
        {
          id: "t2-q15",
          question: "¿Qué es la tributación por imputación?",
          options: ["Solo real", "Atribución de renta por titularidad de bienes", "Solo ficticia", "Solo empresarial"],
          correctAnswer: 1,
          explanation: "Se imputan rentas por la mera titularidad de determinados bienes o derechos."
        },
        {
          id: "t2-q16",
          question: "¿Cuándo se produce el devengo del IRPF?",
          options: ["Al pagar", "31 de diciembre", "Al presentar declaración", "Variable"],
          correctAnswer: 1,
          explanation: "El impuesto se devenga el 31 de diciembre de cada año."
        },
        {
          id: "t2-q17",
          question: "¿Qué es la compensación de bases imponibles negativas?",
          options: ["No existe", "Aplicación de pérdidas de años anteriores", "Solo del mismo año", "Solo empresarial"],
          correctAnswer: 1,
          explanation: "Permite compensar bases imponibles negativas de los cuatro años anteriores."
        },
        {
          id: "t2-q18",
          question: "¿Cuáles son las obligaciones formales del contribuyente?",
          options: ["Solo declarar", "Presentar declaración, llevar libros, conservar documentos", "Solo pagar", "Solo informar"],
          correctAnswer: 1,
          explanation: "Incluyen presentar declaración anual, llevar libros si es empresario y conservar documentos."
        },
        {
          id: "t2-q19",
          question: "¿Qué es el régimen de estimación directa?",
          options: ["Solo simplificada", "Determinación de rendimientos por datos reales", "Solo objetiva", "Solo forfait"],
          correctAnswer: 1,
          explanation: "Los rendimientos se determinan según los datos declarados por el contribuyente."
        },
        {
          id: "t2-q20",
          question: "¿Cuándo se aplica la retención en el IRPF?",
          options: ["Solo empresarios", "En pagos de rendimientos del trabajo y capital", "Solo funcionarios", "Solo intereses"],
          correctAnswer: 1,
          explanation: "Se aplica retención en rendimientos del trabajo, capital y determinadas ganancias patrimoniales."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "IVA - Impuesto sobre el Valor Añadido",
      tests: [
        {
          id: "t3-q1",
          question: "¿Cuál es el hecho imponible del IVA?",
          options: ["Solo ventas", "Entregas de bienes y prestaciones de servicios", "Solo servicios", "Solo importaciones"],
          correctAnswer: 1,
          explanation: "El hecho imponible incluye entregas de bienes, prestaciones de servicios y operaciones asimiladas."
        },
        {
          id: "t3-q2",
          question: "¿Cuáles son los tipos de gravamen del IVA?",
          options: ["Solo 21%", "4%, 10% y 21%", "Solo 10%", "5%, 15%, 25%"],
          correctAnswer: 1,
          explanation: "Los tipos son: superreducido (4%), reducido (10%) y general (21%)."
        },
        {
          id: "t3-q3",
          question: "¿Cuándo es exigible el IVA?",
          options: ["Al cobrar", "Al emitir factura o realizar operación", "Al final del año", "Al presentar declaración"],
          correctAnswer: 1,
          explanation: "El IVA es exigible cuando se emite la factura o se realiza la operación si es anterior."
        },
        {
          id: "t3-q4",
          question: "¿Qué es el derecho a deducción en el IVA?",
          options: ["Solo para empresas", "Derecho a deducir IVA soportado en actividad empresarial", "Solo para autónomos", "No existe"],
          correctAnswer: 1,
          explanation: "Es el derecho a deducir el IVA soportado en la adquisición de bienes y servicios para la actividad empresarial."
        },
        {
          id: "t3-q5",
          question: "¿Cuáles son las operaciones exentas de IVA?",
          options: ["Ninguna", "Sanidad, educación, seguros, servicios financieros", "Solo exportaciones", "Solo importaciones"],
          correctAnswer: 1,
          explanation: "Están exentas operaciones de sanidad, educación, seguros, servicios financieros, entre otras."
        },
        {
          id: "t3-q6",
          question: "¿Qué es el régimen especial del criterio de caja?",
          options: ["Para todos", "Exigibilidad del IVA al cobrar", "Solo grandes empresas", "Solo servicios"],
          correctAnswer: 1,
          explanation: "Permite que la exigibilidad del IVA coincida con el cobro efectivo de la operación."
        },
        {
          id: "t3-q7",
          question: "¿Cuándo se aplica el régimen especial de equivalencia?",
          options: ["A todos", "Solo a comerciantes minoristas", "Solo servicios", "Solo industria"],
          correctAnswer: 1,
          explanation: "Se aplica a comerciantes minoristas que no realizan actividades industriales ni servicios."
        },
        {
          id: "t3-q8",
          question: "¿Qué es la regla de prorrata en el IVA?",
          options: ["Solo para empresas grandes", "Cálculo de deducción cuando hay operaciones exentas", "Solo para servicios", "No existe"],
          correctAnswer: 1,
          explanation: "Permite calcular la deducción cuando se realizan tanto operaciones que dan derecho como que no dan derecho a deducción."
        },
        {
          id: "t3-q9",
          question: "¿Cuál es el período de liquidación del IVA?",
          options: ["Siempre mensual", "Mensual o trimestral según volumen", "Solo trimestral", "Solo anual"],
          correctAnswer: 1,
          explanation: "Es mensual para empresas con volumen superior a 6 millones de euros, trimestral para el resto."
        },
        {
          id: "t3-q10",
          question: "¿Qué documentos debe conservar el contribuyente?",
          options: ["Solo facturas", "Facturas, libros registro, documentos aduaneros", "Solo declaraciones", "Solo recibos"],
          correctAnswer: 1,
          explanation: "Debe conservar facturas, libros registro de IVA, documentos aduaneros y otros documentos justificativos."
        },
        {
          id: "t3-q11",
          question: "¿Cuándo se produce la inversión del sujeto pasivo?",
          options: ["Nunca", "En operaciones específicas como construcción, chatarra", "Siempre", "Solo exportaciones"],
          correctAnswer: 1,
          explanation: "Se produce en operaciones específicas como construcción, entrega de chatarra, prestaciones intracomunitarias, etc."
        },
        {
          id: "t3-q12",
          question: "¿Qué es el IVA intracomunitario?",
          options: ["Solo nacional", "Operaciones entre empresarios de la UE", "Solo importaciones", "Solo exportaciones"],
          correctAnswer: 1,
          explanation: "Regula las operaciones entre empresarios de diferentes Estados miembros de la Unión Europea."
        },
        {
          id: "t3-q13",
          question: "¿Cuándo se aplica el tipo superreducido del 4%?",
          options: ["A todo", "Pan, leche, libros, medicamentos", "Solo servicios", "Solo lujo"],
          correctAnswer: 1,
          explanation: "Se aplica a bienes de primera necesidad como pan, leche, libros, medicamentos, viviendas VPO."
        },
        {
          id: "t3-q14",
          question: "¿Qué es la devolución del IVA?",
          options: ["No existe", "Derecho cuando las deducciones superan las cuotas devengadas", "Solo para exportadores", "Solo al final del año"],
          correctAnswer: 1,
          explanation: "Procede cuando las cuotas de IVA deducible superan las cuotas devengadas en el período."
        },
        {
          id: "t3-q15",
          question: "¿Cuál es el lugar de realización del hecho imponible?",
          options: ["Siempre España", "Según reglas específicas por tipo de operación", "Solo domicilio fiscal", "Donde se pague"],
          correctAnswer: 1,
          explanation: "Se determina según reglas específicas: bienes donde estén, servicios según reglas particulares."
        },
        {
          id: "t3-q16",
          question: "¿Qué efectos tiene la renuncia a la exención?",
          options: ["Ninguno", "Convierte operación exenta en gravada", "Solo contables", "Solo formales"],
          correctAnswer: 1,
          explanation: "La renuncia convierte una operación exenta en gravada, permitiendo el derecho a deducción."
        },
        {
          id: "t3-q17",
          question: "¿Cuándo debe presentarse el modelo 303?",
          options: ["Anualmente", "Cada mes o trimestre según corresponda", "Solo al final", "Nunca"],
          correctAnswer: 1,
          explanation: "Se presenta mensualmente (grandes empresas) o trimestralmente (resto) en los primeros 20 días del período siguiente."
        },
        {
          id: "t3-q18",
          question: "¿Qué es el régimen especial de bienes usados?",
          options: ["Para todos", "Para comerciantes de antigüedades y obras de arte", "Solo nuevos", "Solo servicios"],
          correctAnswer: 1,
          explanation: "Aplicable a comerciantes de bienes usados, antigüedades, objetos de colección y obras de arte."
        },
        {
          id: "t3-q19",
          question: "¿Cuál es la base imponible en las operaciones con descuentos?",
          options: ["Precio total", "Precio después del descuento", "Solo el descuento", "Precio medio"],
          correctAnswer: 1,
          explanation: "La base imponible es el precio después de aplicar descuentos y bonificaciones concedidos."
        },
        {
          id: "t3-q20",
          question: "¿Qué obligaciones formales tiene el sujeto pasivo?",
          options: ["Solo pagar", "Llevar libros, emitir facturas, presentar declaraciones", "Solo facturas", "Solo declaraciones"],
          correctAnswer: 1,
          explanation: "Debe llevar libros registro, emitir y conservar facturas, presentar declaraciones y cumplir obligaciones de información."
        }
      ]
    },
    {
      themeId: "tema-4",
      themeName: "Impuesto sobre Sociedades",
      tests: [
        {
          id: "t4-q1",
          question: "¿Cuál es el hecho imponible del Impuesto sobre Sociedades?",
          options: ["Solo beneficios", "Obtención de renta por entidades", "Solo ventas", "Solo actividad"],
          correctAnswer: 1,
          explanation: "El hecho imponible es la obtención de renta, cualquiera que fuere su fuente u origen, por el sujeto pasivo."
        },
        {
          id: "t4-q2",
          question: "¿Cuál es el tipo de gravamen general?",
          options: ["21%", "25%", "30%", "35%"],
          correctAnswer: 1,
          explanation: "El tipo general del Impuesto sobre Sociedades es del 25%."
        },
        {
          id: "t4-q3",
          question: "¿Qué son los ajustes extracontables?",
          options: ["Errores", "Diferencias entre contabilidad y normativa fiscal", "Solo deducciones", "Solo gastos"],
          correctAnswer: 1,
          explanation: "Son las diferencias entre el resultado contable y la base imponible fiscal."
        },
        {
          id: "t4-q4",
          question: "¿Cuándo se aplica el tipo reducido del 15%?",
          options: ["Siempre", "Entidades de nueva creación en primeros años", "Solo PYMES", "Solo grandes empresas"],
          correctAnswer: 1,
          explanation: "Se aplica a entidades de nueva creación en los primeros períodos impositivos con ciertos requisitos."
        },
        {
          id: "t4-q5",
          question: "¿Qué es la reserva de capitalización?",
          options: ["Solo capital", "Deducción por incremento de fondos propios", "Solo beneficios", "Solo reservas"],
          correctAnswer: 1,
          explanation: "Es una deducción aplicable al incremento de fondos propios de la entidad."
        },
        {
          id: "t4-q6",
          question: "¿Cuál es el período impositivo?",
          options: ["Año natural", "Ejercicio económico", "Trimestral", "Semestral"],
          correctAnswer: 1,
          explanation: "Coincide con el ejercicio económico de la entidad, que puede no ser el año natural."
        },
        {
          id: "t4-q7",
          question: "¿Qué es la compensación de bases imponibles negativas?",
          options: ["No existe", "Aplicación de pérdidas fiscales anteriores", "Solo del año", "Ilimitada"],
          correctAnswer: 1,
          explanation: "Permite compensar bases imponibles negativas de ejercicios anteriores con ciertos límites."
        },
        {
          id: "t4-q8",
          question: "¿Cuáles son las deducciones por I+D+i?",
          options: ["No existen", "25% gastos I+D, 8% innovación tecnológica", "Solo 10%", "Solo grandes empresas"],
          correctAnswer: 1,
          explanation: "25% por gastos en I+D y 8% por innovación tecnológica, con incrementos según condiciones."
        },
        {
          id: "t4-q9",
          question: "¿Qué es el régimen especial de fusiones?",
          options: ["Tributación normal", "Diferimiento de gravamen en reestructuraciones", "Solo para PYMES", "No existe"],
          correctAnswer: 1,
          explanation: "Permite el diferimiento del gravamen en operaciones de reestructuración empresarial."
        },
        {
          id: "t4-q10",
          question: "¿Cuándo se aplica el régimen de consolidación fiscal?",
          options: ["Solo individuales", "Grupos de sociedades con participación mínima", "Solo multinacionales", "Nunca"],
          correctAnswer: 1,
          explanation: "Se aplica a grupos de sociedades con participación directa o indirecta de al menos 75%."
        },
        {
          id: "t4-q11",
          question: "¿Qué gastos son deducibles fiscalmente?",
          options: ["Todos", "Los necesarios para obtener ingresos", "Solo de personal", "Solo financieros"],
          correctAnswer: 1,
          explanation: "Son deducibles los gastos contabilizados que sean necesarios para la obtención de ingresos."
        },
        {
          id: "t4-q12",
          question: "¿Cuál es el límite de deducibilidad de gastos financieros?",
          options: ["Ilimitado", "30% del beneficio operativo o 1M€", "Solo 500.000€", "20% de ingresos"],
          correctAnswer: 1,
          explanation: "Los gastos financieros se limitan al 30% del beneficio operativo o 1 millón de euros."
        },
        {
          id: "t4-q13",
          question: "¿Qué es la amortización fiscal?",
          options: ["Solo contable", "Deducción por depreciación de activos", "Solo lineal", "Solo inmobiliario"],
          correctAnswer: 1,
          explanation: "Es la deducción correspondiente a la depreciación efectiva de los elementos del inmovilizado."
        },
        {
          id: "t4-q14",
          question: "¿Cuándo se consideran gastos no deducibles?",
          options: ["Nunca", "Multas, liberalidades, excesos en retribuciones", "Solo multas", "Todos los gastos"],
          correctAnswer: 1,
          explanation: "No son deducibles las multas, liberalidades y excesos en retribuciones de administradores."
        },
        {
          id: "t4-q15",
          question: "¿Qué es la tributación por transparencia fiscal?",
          options: ["Solo opaca", "Imputación directa a socios", "Solo sociedades", "No existe"],
          correctAnswer: 1,
          explanation: "Determinadas entidades imputan directamente sus resultados a los socios."
        },
        {
          id: "t4-q16",
          question: "¿Cuál es el tratamiento de dividendos recibidos?",
          options: ["Siempre gravados", "Exención con requisitos de participación", "Siempre exentos", "Tipo reducido"],
          correctAnswer: 1,
          explanation: "Los dividendos pueden estar exentos si se cumplen requisitos de participación y tenencia."
        },
        {
          id: "t4-q17",
          question: "¿Qué son los pagos a cuenta?",
          options: ["Pagos finales", "Ingresos fraccionados a cuenta del impuesto", "Solo retenciones", "Solo PYMES"],
          correctAnswer: 1,
          explanation: "Son ingresos fraccionados que se practican a cuenta de la liquidación final del ejercicio."
        },
        {
          id: "t4-q18",
          question: "¿Cuándo se presenta la declaración del Impuesto sobre Sociedades?",
          options: ["Marzo", "25 días naturales desde fin período impositivo", "Diciembre", "Cuando se quiera"],
          correctAnswer: 1,
          explanation: "En los 25 días naturales siguientes a los seis meses posteriores al final del período impositivo."
        },
        {
          id: "t4-q19",
          question: "¿Qué es el régimen especial de SICAV?",
          options: ["Tipo general", "Tipo especial del 1%", "Exención total", "No existe"],
          correctAnswer: 1,
          explanation: "Las SICAV tributan al tipo especial del 1% cumpliendo determinados requisitos."
        },
        {
          id: "t4-q20",
          question: "¿Cuál es el tratamiento de las provisiones?",
          options: ["Siempre deducibles", "Deducibles con límites específicos", "Nunca deducibles", "Solo grandes empresas"],
          correctAnswer: 1,
          explanation: "Las provisiones son deducibles cuando cumplan los requisitos específicos establecidos en la ley."
        }
      ]
    },
    {
      themeId: "tema-5",
      themeName: "Procedimiento de Gestión Tributaria",
      tests: [
        {
          id: "t5-q1",
          question: "¿Qué es el procedimiento de gestión tributaria?",
          options: ["Solo liquidación", "Conjunto de actuaciones para aplicar tributos", "Solo inspección", "Solo recaudación"],
          correctAnswer: 1,
          explanation: "Es el conjunto de actos y actuaciones dirigidos a la aplicación de los tributos."
        },
        {
          id: "t5-q2",
          question: "¿Cuáles son las formas de iniciación?",
          options: ["Solo declaración", "Declaración, comunicación, solicitud, de oficio", "Solo de oficio", "Solo comunicación"],
          correctAnswer: 1,
          explanation: "Puede iniciarse por declaración del obligado, comunicación de terceros, solicitud o de oficio."
        },
        {
          id: "t5-q3",
          question: "¿Qué es la autoliquidación?",
          options: ["Solo declarar", "Declaración donde el obligado calcula la deuda", "Solo informar", "Solo solicitar"],
          correctAnswer: 1,
          explanation: "Es la declaración en la que el obligado tributario determina la deuda tributaria e ingresa su importe."
        },
        {
          id: "t5-q4",
          question: "¿Cuándo procede la liquidación complementaria?",
          options: ["Siempre", "Cuando resulte mayor deuda", "Solo errores", "Nunca"],
          correctAnswer: 1,
          explanation: "Procede cuando de la comprobación de datos resulte una liquidación superior a la practicada."
        },
        {
          id: "t5-q5",
          question: "¿Qué efectos tiene la declaración tributaria?",
          options: ["Ninguno", "Inicia liquidación y puede tener efectos constitutivos", "Solo informativos", "Solo obligatorios"],
          correctAnswer: 1,
          explanation: "Inicia el procedimiento de liquidación y puede constituir el hecho imponible en ciertos casos."
        },
        {
          id: "t5-q6",
          question: "¿Cuál es el plazo para practicar liquidaciones?",
          options: ["1 año", "4 años desde presentación o vencimiento", "5 años", "Sin límite"],
          correctAnswer: 1,
          explanation: "4 años contados desde la presentación de la declaración o vencimiento del plazo."
        },
        {
          id: "t5-q7",
          question: "¿Qué es la conformidad del obligado?",
          options: ["Solo acuerdo", "Aceptación expresa de propuesta de liquidación", "Solo silencio", "Solo protesta"],
          correctAnswer: 1,
          explanation: "Es la aceptación expresa por el obligado de la propuesta de liquidación formulada."
        },
        {
          id: "t5-q8",
          question: "¿Cuándo se produce la caducidad del procedimiento?",
          options: ["Nunca", "Si no se notifica liquidación en plazo máximo", "Solo por inactividad", "Solo por renuncia"],
          correctAnswer: 1,
          explanation: "Se produce cuando no se notifica la liquidación en el plazo máximo establecido."
        },
        {
          id: "t5-q9",
          question: "¿Qué son las liquidaciones provisionales?",
          options: ["Definitivas", "Liquidaciones a cuenta del tributo", "Solo estimativas", "Solo mínimas"],
          correctAnswer: 1,
          explanation: "Son liquidaciones giradas a cuenta de la liquidación definitiva del período."
        },
        {
          id: "t5-q10",
          question: "¿Cuáles son los deberes de información?",
          options: ["Solo declarar", "Suministrar datos, facilitar inspección, conservar documentos", "Solo pagar", "Solo informar"],
          correctAnswer: 1,
          explanation: "Incluyen suministrar información, facilitar la inspección y conservar documentos justificativos."
        },
        {
          id: "t5-q11",
          question: "¿Qué es la comprobación de valores?",
          options: ["Solo tasación", "Verificación de valores declarados", "Solo pericial", "Solo catastral"],
          correctAnswer: 1,
          explanation: "Es la verificación de los valores declarados por los obligados tributarios."
        },
        {
          id: "t5-q12",
          question: "¿Cuándo procede la rectificación de autoliquidaciones?",
          options: ["Siempre", "Por errores aritméticos o de hecho", "Solo por errores graves", "Nunca"],
          correctAnswer: 1,
          explanation: "Procede cuando se aprecie error aritmético, material o de hecho en la autoliquidación."
        },
        {
          id: "t5-q13",
          question: "¿Qué es la gestión censal?",
          options: ["Solo estadística", "Registro y control de obligados tributarios", "Solo declaraciones", "Solo inspección"],
          correctAnswer: 1,
          explanation: "Comprende las actuaciones de registro, control y verificación del cumplimiento de obligaciones censales."
        },
        {
          id: "t5-q14",
          question: "¿Cuáles son las especialidades en tributos locales?",
          options: ["Iguales al Estado", "Procedimientos adaptados a la normativa local", "Solo diferente plazo", "Sin especialidades"],
          correctAnswer: 1,
          explanation: "Los procedimientos se adaptan a las especialidades de la normativa tributaria local."
        },
        {
          id: "t5-q15",
          question: "¿Qué efectos tiene la presentación extemporánea?",
          options: ["Nulos", "Recargo e intereses de demora", "Solo recargo", "Igual que en plazo"],
          correctAnswer: 1,
          explanation: "Comporta la aplicación de recargos e intereses de demora según el retraso."
        },
        {
          id: "t5-q16",
          question: "¿Qué es la gestión colaborativa?",
          options: ["Solo tradicional", "Cooperación entre Administración y contribuyentes", "Solo inspección", "Solo sancionadora"],
          correctAnswer: 1,
          explanation: "Fomenta la cooperación y transparencia entre la Administración y los contribuyentes."
        },
        {
          id: "t5-q17",
          question: "¿Cuándo se puede solicitar rectificación por la Administración?",
          options: ["Nunca", "Por errores propios evidentes", "Siempre", "Solo por terceros"],
          correctAnswer: 1,
          explanation: "La Administración puede rectificar sus propios errores cuando sean evidentes."
        },
        {
          id: "t5-q18",
          question: "¿Qué es la gestión automatizada?",
          options: ["Solo manual", "Procedimientos realizados por medios informáticos", "Solo presencial", "Solo telefónica"],
          correctAnswer: 1,
          explanation: "Son procedimientos realizados íntegramente por medios informáticos y telemáticos."
        },
        {
          id: "t5-q19",
          question: "¿Cuáles son los efectos de la paralización?",
          options: ["Continúa normal", "Suspensión de plazos", "Solo interrumpe", "Reinicia plazos"],
          correctAnswer: 1,
          explanation: "La paralización por causa no imputable al obligado suspende el cómputo de plazos."
        },
        {
          id: "t5-q20",
          question: "¿Qué es la regularización tributaria voluntaria?",
          options: ["Solo obligatoria", "Corrección espontánea de situaciones tributarias", "Solo en inspección", "No existe"],
          correctAnswer: 1,
          explanation: "Permite a los contribuyentes corregir voluntariamente su situación tributaria."
        }
      ]
    },
    {
      themeId: "tema-6",
      themeName: "Procedimiento de Inspección Tributaria",
      tests: [
        {
          id: "t6-q1",
          question: "¿Cuáles son las funciones de la inspección tributaria?",
          options: ["Solo investigar", "Investigar, comprobar, realizar valoraciones, informar", "Solo comprobar", "Solo sancionar"],
          correctAnswer: 1,
          explanation: "Las funciones incluyen investigación, comprobación, realización de valoraciones e información."
        },
        {
          id: "t6-q2",
          question: "¿Cuáles son las facultades de la inspección?",
          options: ["Solo examinar", "Examen, investigación, entrada, requerimiento", "Solo requerir", "Solo entrar"],
          correctAnswer: 1,
          explanation: "Incluyen examen de documentos, investigación, entrada en locales y requerimiento de información."
        },
        {
          id: "t6-q3",
          question: "¿Cuándo puede iniciarse una inspección?",
          options: ["Cuando se quiera", "Dentro del período de prescripción", "Solo con denuncia", "Solo por sorteo"],
          correctAnswer: 1,
          explanation: "Puede iniciarse en cualquier momento dentro del período de prescripción para comprobar."
        },
        {
          id: "t6-q4",
          question: "¿Qué es el acta de conformidad?",
          options: ["Solo desacuerdo", "Documento donde el inspeccionado acepta los hechos", "Solo informativa", "Solo propuesta"],
          correctAnswer: 1,
          explanation: "Es el documento en que el interesado manifiesta su conformidad con los hechos descritos."
        },
        {
          id: "t6-q5",
          question: "¿Cuáles son los tipos de actas de inspección?",
          options: ["Solo una", "Conformidad, disconformidad, con acuerdo", "Solo conformidad", "Solo disconformidad"],
          correctAnswer: 1,
          explanation: "Pueden ser de conformidad, disconformidad o con acuerdo según la posición del inspeccionado."
        },
        {
          id: "t6-q6",
          question: "¿Qué efectos tiene el acta de conformidad?",
          options: ["Solo informativa", "Permite liquidación inmediata", "Solo propuesta", "Ningún efecto"],
          correctAnswer: 1,
          explanation: "Habilita para dictar liquidación sin trámite de audiencia."
        },
        {
          id: "t6-q7",
          question: "¿Cuándo se realiza el trámite de audiencia?",
          options: ["Siempre", "En actas de disconformidad", "Solo si se solicita", "Nunca"],
          correctAnswer: 1,
          explanation: "Es preceptivo en las actas de disconformidad antes de dictar la liquidación."
        },
        {
          id: "t6-q8",
          question: "¿Qué es la paralización de la inspección?",
          options: ["Fin de actuaciones", "Suspensión temporal por causas justificadas", "Solo por vacaciones", "Solo por enfermedad"],
          correctAnswer: 1,
          explanation: "Es la suspensión temporal de las actuaciones por causas justificadas."
        },
        {
          id: "t6-q9",
          question: "¿Cuál es el plazo máximo del procedimiento inspector?",
          options: ["6 meses", "12 meses", "18 meses", "24 meses"],
          correctAnswer: 1,
          explanation: "El plazo máximo es de 12 meses desde la notificación del inicio de actuaciones."
        },
        {
          id: "t6-q10",
          question: "¿Qué documentos debe aportar el inspector?",
          options: ["Solo credencial", "Credencial acreditativa y comunicación del inicio", "Solo comunicación", "Ninguno"],
          correctAnswer: 1,
          explanation: "Debe presentar credencial acreditativa y comunicar el inicio de actuaciones inspectoras."
        },
        {
          id: "t6-q11",
          question: "¿Cuándo procede la entrada en domicilio?",
          options: ["Siempre", "Con autorización del titular o mandamiento judicial", "Solo con policía", "Nunca"],
          correctAnswer: 1,
          explanation: "Requiere autorización del titular o mandamiento judicial cuando se trate de domicilio constitucionalmente protegido."
        },
        {
          id: "t6-q12",
          question: "¿Qué es la comprobación abreviada?",
          options: ["Inspección normal", "Procedimiento simplificado para casos menores", "Solo grandes empresas", "No existe"],
          correctAnswer: 1,
          explanation: "Es un procedimiento simplificado para casos de menor cuantía o complejidad."
        },
        {
          id: "t6-q13",
          question: "¿Cuáles son las técnicas de investigación?",
          options: ["Solo interrogatorio", "Análisis contable, prueba pericial, investigación de terceros", "Solo documentos", "Solo testimonios"],
          correctAnswer: 1,
          explanation: "Incluyen análisis contable, prueba pericial, investigación de terceros y otras técnicas."
        },
        {
          id: "t6-q14",
          question: "¿Qué es el acuerdo de inspección?",
          options: ["Solo acta", "Pacto sobre hechos y valoración", "Solo conformidad", "Solo propuesta"],
          correctAnswer: 1,
          explanation: "Es el pacto entre la inspección y el contribuyente sobre hechos, valoración y liquidación."
        },
        {
          id: "t6-q15",
          question: "¿Cuándo se puede suspender la inspección?",
          options: ["Nunca", "Por presentación de recurso o reclamación", "Solo por enfermedad", "Solo por traslado"],
          correctAnswer: 1,
          explanation: "Se suspende por la presentación de determinados recursos o reclamaciones."
        },
        {
          id: "t6-q16",
          question: "¿Qué es la inspección parcial?",
          options: ["Completa", "Limitada a determinados tributos o períodos", "Solo superficial", "Solo profunda"],
          correctAnswer: 1,
          explanation: "Es la limitada a determinados tributos, períodos o aspectos de la posición fiscal."
        },
        {
          id: "t6-q17",
          question: "¿Cuáles son los efectos de la caducidad?",
          options: ["Continúa", "Imposibilidad de iniciar nuevo procedimiento por mismo objeto", "Solo suspende", "Solo demora"],
          correctAnswer: 1,
          explanation: "Impide iniciar un nuevo procedimiento por el mismo objeto durante un año."
        },
        {
          id: "t6-q18",
          question: "¿Qué es la regularización en inspección?",
          options: ["Solo sanción", "Ajuste de la situación tributaria", "Solo liquidación", "Solo propuesta"],
          correctAnswer: 1,
          explanation: "Es el ajuste de la situación tributaria como resultado de las actuaciones inspectoras."
        },
        {
          id: "t6-q19",
          question: "��Cuándo procede la estimación indirecta en inspección?",
          options: ["Siempre", "Cuando no se pueda determinar la base por directa", "Nunca", "Solo en fraude"],
          correctAnswer: 1,
          explanation: "Procede cuando no se pueda conocer la base imponible por estimación directa."
        },
        {
          id: "t6-q20",
          question: "¿Qué obligaciones tiene el inspeccionado?",
          options: ["Solo pagar", "Facilitar información, exhibir documentos, permitir actuaciones", "Solo declarar", "Solo colaborar"],
          correctAnswer: 1,
          explanation: "Debe facilitar información, exhibir documentos y permitir el desarrollo de las actuaciones."
        }
      ]
    },
    {
      themeId: "tema-7",
      themeName: "Procedimiento de Recaudación",
      tests: [
        {
          id: "t7-q1",
          question: "¿Cuándo se inicia el procedimiento de recaudación ejecutiva?",
          options: ["Inmediatamente", "Transcurrido plazo voluntario sin pago", "Solo con recargo", "Solo con aval"],
          correctAnswer: 1,
          explanation: "Se inicia una vez transcurrido el período voluntario de pago sin haber sido satisfecha la deuda."
        },
        {
          id: "t7-q2",
          question: "¿Qué documentos inician la vía ejecutiva?",
          options: ["Solo providencias", "Providencias de apremio", "Solo liquidaciones", "Solo requerimientos"],
          correctAnswer: 1,
          explanation: "La providencia de apremio es el documento que inicia el procedimiento de recaudación ejecutiva."
        },
        {
          id: "t7-q3",
          question: "¿Cuáles son los recargos del período ejecutivo?",
          options: ["Solo 5%", "5%, 10%, 15%, 20%", "Solo 10%", "Solo 20%"],
          correctAnswer: 1,
          explanation: "Los recargos son del 5%, 10%, 15% o 20% según el momento del pago en período ejecutivo."
        },
        {
          id: "t7-q4",
          question: "¿Qué es el embargo?",
          options: ["Solo retención", "Afección de bienes para garantizar la deuda", "Solo investigación", "Solo valoración"],
          correctAnswer: 1,
          explanation: "Es la afección de bienes del deudor para garantizar el pago de la deuda tributaria."
        },
        {
          id: "t7-q5",
          question: "¿Cuál es el orden de embargo?",
          options: ["Libre elección", "Dinero, créditos, sueldos, bienes muebles, inmuebles", "Solo inmuebles", "Solo dinero"],
          correctAnswer: 1,
          explanation: "El orden es: dinero efectivo, depósitos, créditos, sueldos, bienes muebles, bienes inmuebles."
        },
        {
          id: "t7-q6",
          question: "¿Qué bienes son inembargables?",
          options: ["Todos", "Mínimo vital, herramientas de trabajo, bienes públicos", "Ninguno", "Solo personales"],
          correctAnswer: 1,
          explanation: "Son inembargables el salario mínimo vital, herramientas de trabajo y bienes de dominio público."
        },
        {
          id: "t7-q7",
          question: "¿Qué es la adjudicación de bienes?",
          options: ["Solo venta", "Adquisición por la Hacienda de bienes embargados", "Solo subasta", "Solo tasación"],
          correctAnswer: 1,
          explanation: "Es la adquisición por la Hacienda Pública de los bienes embargados cuando no hay postor."
        },
        {
          id: "t7-q8",
          question: "¿Cuándo se declara fallida una deuda?",
          options: ["Nunca", "Cuando se agoten medios de cobro", "Solo por prescripción", "Solo por insolvencia"],
          correctAnswer: 1,
          explanation: "Se declara fallida cuando se agoten los medios de cobro sin resultado."
        },
        {
          id: "t7-q9",
          question: "¿Qué es la tercería de dominio?",
          options: ["Solo reclamación", "Reclamación de tercero sobre bien embargado", "Solo oposición", "Solo preferencia"],
          correctAnswer: 1,
          explanation: "Es la reclamación de un tercero alegando la propiedad de un bien embargado."
        },
        {
          id: "t7-q10",
          question: "¿Cuáles son las causas de suspensión del procedimiento?",
          options: ["Solo pago", "Recurso, aplazamiento, imposibilidad material", "Solo recurso", "Solo aplazamiento"],
          correctAnswer: 1,
          explanation: "Se suspende por interposición de recurso, concesión de aplazamiento o imposibilidad material."
        },
        {
          id: "t7-q11",
          question: "¿Qué es el derecho de retracto?",
          options: ["Solo venta", "Recuperación por el deudor del bien adjudicado", "Solo compra", "Solo rescate"],
          correctAnswer: 1,
          explanation: "Es el derecho del deudor a recuperar el bien adjudicado pagando el precio y costes."
        },
        {
          id: "t7-q12",
          question: "��Cuándo procede el embargo preventivo?",
          options: ["Siempre", "Cuando peligre el cobro de la deuda", "Nunca", "Solo grandes deudas"],
          correctAnswer: 1,
          explanation: "Procede cuando existan indicios racionales de que el cobro puede verse frustrado."
        },
        {
          id: "t7-q13",
          question: "¿Qué es la subasta de bienes embargados?",
          options: ["Solo adjudicación", "Procedimiento para enajenar bienes", "Solo valoración", "Solo exposición"],
          correctAnswer: 1,
          explanation: "Es el procedimiento para la enajenación de los bienes embargados al mejor postor."
        },
        {
          id: "t7-q14",
          question: "¿Cuáles son los efectos del embargo?",
          options: ["Solo retención", "Afección real, prohibición de disponer", "Solo anotación", "Solo investigación"],
          correctAnswer: 1,
          explanation: "Produce afección real del bien y prohibición de disposición por el deudor."
        },
        {
          id: "t7-q15",
          question: "¿Qué es la responsabilidad subsidiaria en recaudación?",
          options: ["Solo principal", "Exigencia cuando no se cobra del deudor principal", "Solo solidaria", "Solo personal"],
          correctAnswer: 1,
          explanation: "Se exige al responsable subsidiario cuando no se ha podido cobrar del deudor principal."
        },
        {
          id: "t7-q16",
          question: "¿Cuándo se practican medidas cautelares?",
          options: ["Nunca", "Cuando peligre la efectividad del embargo", "Siempre", "Solo al final"],
          correctAnswer: 1,
          explanation: "Se adoptan cuando peligre la efectividad del embargo o la ejecución."
        },
        {
          id: "t7-q17",
          question: "¿Qué documentos se notifican en recaudación ejecutiva?",
          options: ["Solo providencia", "Providencia, diligencia de embargo, valoración", "Solo embargo", "Solo valoración"],
          correctAnswer: 1,
          explanation: "Se notifican la providencia de apremio, diligencia de embargo y valoración de bienes."
        },
        {
          id: "t7-q18",
          question: "¿Cuándo prescribe la acción de cobro?",
          options: ["2 años", "4 años desde fin plazo voluntario", "5 años", "Nunca"],
          correctAnswer: 1,
          explanation: "La acción para exigir el pago prescribe a los 4 años desde la finalización del plazo voluntario."
        },
        {
          id: "t7-q19",
          question: "¿Qué es la compensación en recaudación?",
          options: ["Solo pago", "Extinción por existencia de deudas recíprocas", "Solo devolución", "Solo descuento"],
          correctAnswer: 1,
          explanation: "Es la extinción de obligaciones por existencia de deudas recíprocas, líquidas y vencidas."
        },
        {
          id: "t7-q20",
          question: "¿Cuáles son los costes del procedimiento ejecutivo?",
          options: ["Solo recargos", "Recargos, intereses, costas del procedimiento", "Solo intereses", "Solo costas"],
          correctAnswer: 1,
          explanation: "Incluyen recargos del período ejecutivo, intereses de demora y costas del procedimiento."
        }
      ]
    },
    {
      themeId: "tema-8",
      themeName: "Infracciones y Sanciones Tributarias",
      tests: [
        {
          id: "t8-q1",
          question: "¿Cuáles son los principios del régimen sancionador tributario?",
          options: ["Solo legalidad", "Legalidad, tipicidad, responsabilidad, proporcionalidad", "Solo tipicidad", "Solo proporcionalidad"],
          correctAnswer: 1,
          explanation: "Rigen los principios de legalidad, tipicidad, responsabilidad personal y proporcionalidad."
        },
        {
          id: "t8-q2",
          question: "¿Qué elementos configuran la infracción tributaria?",
          options: ["Solo acción", "Acción u omisión tipificada y sancionada", "Solo omisión", "Solo resultado"],
          correctAnswer: 1,
          explanation: "Es toda acción u omisión tipificada y sancionada en la ley tributaria."
        },
        {
          id: "t8-q3",
          question: "¿Cuáles son los grados de las infracciones?",
          options: ["Solo leves", "Leves, graves, muy graves", "Solo graves", "Solo muy graves"],
          correctAnswer: 1,
          explanation: "Las infracciones se clasifican en leves, graves y muy graves según su entidad."
        },
        {
          id: "t8-q4",
          question: "¿Qué es la culpabilidad en las infracciones tributarias?",
          options: ["Solo dolo", "Elemento subjetivo: dolo o culpa", "Solo culpa", "Solo negligencia"],
          correctAnswer: 1,
          explanation: "Es el elemento subjetivo que puede consistir en dolo, culpa o simple negligencia."
        },
        {
          id: "t8-q5",
          question: "¿Cuáles son las sanciones tributarias?",
          options: ["Solo multas", "Multas, pérdida del derecho, prohibiciones", "Solo prohibiciones", "Solo recargos"],
          correctAnswer: 1,
          explanation: "Pueden ser multas, pérdida del derecho a beneficios o prohibiciones temporales."
        },
        {
          id: "t8-q6",
          question: "¿Cuándo hay concurso de infracciones?",
          options: ["Nunca", "Cuando una acción u omisión constituye varias infracciones", "Siempre", "Solo en casos graves"],
          correctAnswer: 1,
          explanation: "Se produce cuando una misma acción u omisión constituye varias infracciones tributarias."
        },
        {
          id: "t8-q7",
          question: "¿Qué es la prescripción de infracciones?",
          options: ["No prescriben", "Extinción de responsabilidad por paso del tiempo", "Solo 1 año", "Solo 10 años"],
          correctAnswer: 1,
          explanation: "Es la extinción de la responsabilidad por infracciones por transcurso del tiempo establecido."
        },
        {
          id: "t8-q8",
          question: "¿Cuál es el plazo de prescripción de infracciones?",
          options: ["2 años", "4 años desde comisión", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "Las infracciones prescriben a los 4 años contados desde que se cometieron."
        },
        {
          id: "t8-q9",
          question: "¿Qué son las circunstancias agravantes?",
          options: ["Solo reducen", "Factores que aumentan la responsabilidad", "Solo mantienen", "No existen"],
          correctAnswer: 1,
          explanation: "Son circunstancias que incrementan la gravedad de la infracción y la sanción aplicable."
        },
        {
          id: "t8-q10",
          question: "¿Cuáles son las circunstancias atenuantes?",
          options: ["Solo agravan", "Factores que disminuyen la responsabilidad", "Solo mantienen", "No existen"],
          correctAnswer: 1,
          explanation: "Son circunstancias que disminuyen la gravedad de la infracción y la sanción."
        },
        {
          id: "t8-q11",
          question: "¿Qué es la responsabilidad de los sucesores?",
          options: ["No existe", "Transmisión de responsabilidad por sucesión", "Solo personal", "Solo empresarial"],
          correctAnswer: 1,
          explanation: "Los sucesores pueden responder de las sanciones pecuniarias impuestas al causante."
        },
        {
          id: "t8-q12",
          question: "¿Cuándo se puede reducir la sanción?",
          options: ["Nunca", "Por conformidad o pronto pago", "Siempre", "Solo por pronto pago"],
          correctAnswer: 1,
          explanation: "Se pueden aplicar reducciones por conformidad del sancionado o por pronto pago."
        },
        {
          id: "t8-q13",
          question: "¿Qué infracciones cometen los retenedores?",
          options: ["Ninguna", "No retener, no ingresar, no declarar retenciones", "Solo no retener", "Solo no ingresar"],
          correctAnswer: 1,
          explanation: "Pueden cometer infracciones por no retener, no ingresar o no presentar declaraciones de retenciones."
        },
        {
          id: "t8-q14",
          question: "¿Cuál es el procedimiento sancionador?",
          options: ["Solo multa", "Iniciación, instrucción, resolución", "Solo instrucción", "Solo resolución"],
          correctAnswer: 1,
          explanation: "Comprende las fases de iniciación, instrucción y resolución del expediente sancionador."
        },
        {
          id: "t8-q15",
          question: "¿Qué es la regularización voluntaria?",
          options: ["Solo obligatoria", "Corrección espontánea que puede excluir sanción", "Solo con sanción", "No existe"],
          correctAnswer: 1,
          explanation: "La corrección voluntaria de la situación tributaria puede excluir o reducir la sanción."
        },
        {
          id: "t8-q16",
          question: "¿Cuándo hay error excusable?",
          options: ["Nunca", "Cuando la Administración induce a error", "Siempre", "Solo en casos complejos"],
          correctAnswer: 1,
          explanation: "Se produce cuando la actuación de la Administración induce de modo directo al error."
        },
        {
          id: "t8-q17",
          question: "¿Qué es la infracción continuada?",
          options: ["Una sola", "Repetición de actos que infringen el mismo precepto", "Solo grave", "Solo muy grave"],
          correctAnswer: 1,
          explanation: "Se produce por la repetición de acciones u omisiones que infringen el mismo precepto."
        },
        {
          id: "t8-q18",
          question: "¿Cuáles son los efectos de la firmeza de las sanciones?",
          options: ["Solo pago", "Ejecutoriedad y anotación en registros", "Solo registro", "Solo archivo"],
          correctAnswer: 1,
          explanation: "Las sanciones firmes son ejecutorias y se anotan en los registros correspondientes."
        },
        {
          id: "t8-q19",
          question: "¿Qué es la responsabilidad solidaria en sanciones?",
          options: ["Solo individual", "Responsabilidad conjunta de varios sujetos", "Solo subsidiaria", "No existe"],
          correctAnswer: 1,
          explanation: "Varios sujetos pueden responder solidariamente de una misma sanción tributaria."
        },
        {
          id: "t8-q20",
          question: "¿Cuándo se suspende la ejecución de sanciones?",
          options: ["Nunca", "Por recurso con garantía suficiente", "Siempre", "Solo sin garantía"],
          correctAnswer: 1,
          explanation: "Se suspende por la interposición de recurso cuando se aporta garantía suficiente."
        }
      ]
    },
    {
      themeId: "tema-9",
      themeName: "Revisión en Vía Administrativa",
      tests: [
        {
          id: "t9-q1",
          question: "¿Cuáles son los procedimientos de revisión?",
          options: ["Solo recursos", "Recursos, revisión de oficio, devoluciones", "Solo revisión", "Solo devoluciones"],
          correctAnswer: 1,
          explanation: "Comprenden recursos administrativos, revisión de oficio y procedimientos de devolución."
        },
        {
          id: "t9-q2",
          question: "¿Qué recursos caben contra liquidaciones tributarias?",
          options: ["Solo reposición", "Reposición y reclamación económico-administrativa", "Solo reclamación", "Solo alzada"],
          correctAnswer: 1,
          explanation: "Caben recurso de reposición y reclamación económico-administrativa, alternativamente."
        },
        {
          id: "t9-q3",
          question: "¿Cuál es el plazo para interponer recurso de reposición?",
          options: ["15 días", "1 mes", "3 meses", "6 meses"],
          correctAnswer: 1,
          explanation: "El recurso de reposición debe interponerse en el plazo de un mes desde la notificación."
        },
        {
          id: "t9-q4",
          question: "¿Ante quién se presenta la reclamación económico-administrativa?",
          options: ["Mismo órgano", "Tribunales Económico-Administrativos", "Tribunal Supremo", "Audiencia Provincial"],
          correctAnswer: 1,
          explanation: "Se presenta ante los Tribunales Económico-Administrativos correspondientes."
        },
        {
          id: "t9-q5",
          question: "¿Cuál es el plazo de la reclamación económico-administrativa?",
          options: ["15 días", "1 mes", "3 meses", "6 meses"],
          correctAnswer: 1,
          explanation: "Debe interponerse en el plazo de un mes desde la notificación del acto."
        },
        {
          id: "t9-q6",
          question: "��Qué es la revisión de oficio?",
          options: ["Solo por recurso", "Procedimiento iniciado por la propia Administración", "Solo por terceros", "Solo por interesado"],
          correctAnswer: 1,
          explanation: "Es el procedimiento que inicia la propia Administración para revisar sus actos."
        },
        {
          id: "t9-q7",
          question: "¿Cuándo procede la revisión de oficio?",
          options: ["Siempre", "Por nulidad o anulabilidad", "Solo por error", "Solo por cambio normativo"],
          correctAnswer: 1,
          explanation: "Procede cuando concurran causas de nulidad de pleno derecho o anulabilidad."
        },
        {
          id: "t9-q8",
          question: "¿Qué efectos tiene la interposición de recursos?",
          options: ["Ninguno", "No suspende la ejecución salvo garantía", "Siempre suspende", "Solo suspende si es firme"],
          correctAnswer: 1,
          explanation: "No suspende la ejecución del acto recurrido salvo que se aporte garantía."
        },
        {
          id: "t9-q9",
          question: "¿Cuál es el procedimiento de devolución de ingresos indebidos?",
          options: ["Automático", "A instancia del interesado o de oficio", "Solo de oficio", "Solo a instancia"],
          correctAnswer: 1,
          explanation: "Puede iniciarse a instancia del interesado o de oficio por la Administración."
        },
        {
          id: "t9-q10",
          question: "¿Cuándo prescriben las devoluciones?",
          options: ["2 años", "4 años desde presentación o vencimiento", "5 años", "Nunca"],
          correctAnswer: 1,
          explanation: "El derecho a solicitar devolución prescribe a los 4 años."
        },
        {
          id: "t9-q11",
          question: "¿Qué es el silencio administrativo en recursos?",
          options: ["Estimación", "Desestimación", "Depende del caso", "No existe"],
          correctAnswer: 1,
          explanation: "En los recursos tributarios, el silencio administrativo tiene efectos desestimatorios."
        },
        {
          id: "t9-q12",
          question: "¿Cuándo se devengan intereses de demora en devoluciones?",
          options: ["Nunca", "Transcurridos 6 meses sin resolver", "Inmediatamente", "Al año"],
          correctAnswer: 1,
          explanation: "Se devengan cuando transcurren 6 meses sin resolver el procedimiento de devolución."
        },
        {
          id: "t9-q13",
          question: "¿Qué es la rectificación de errores?",
          options: ["Solo materiales", "Corrección de errores evidentes", "Solo aritméticos", "Solo de transcripción"],
          correctAnswer: 1,
          explanation: "Permite corregir errores materiales, de hecho o aritméticos evidentes."
        },
        {
          id: "t9-q14",
          question: "¿Cuál es la competencia de los TEA Regionales?",
          options: ["Solo estatales", "Tributos cedidos y locales", "Solo locales", "Todos los tributos"],
          correctAnswer: 1,
          explanation: "Conocen de reclamaciones sobre tributos cedidos y tributos locales en su ámbito territorial."
        },
        {
          id: "t9-q15",
          question: "¿Qué es la ejecución de resoluciones?",
          options: ["Solo cumplimiento", "Efectividad de lo resuelto en vía administrativa", "Solo notificación", "Solo archivo"],
          correctAnswer: 1,
          explanation: "Es dar efectividad a lo resuelto en los procedimientos de revisión administrativa."
        },
        {
          id: "t9-q16",
          question: "¿Cuándo cabe recurso contencioso-administrativo?",
          options: ["Siempre", "Tras agotar vía administrativa", "Inmediatamente", "Nunca"],
          correctAnswer: 1,
          explanation: "Cabe tras agotar la vía administrativa mediante los recursos correspondientes."
        },
        {
          id: "t9-q17",
          question: "¿Qué es la revocación de actos favorables?",
          options: ["Imposible", "Anulación de actos que otorgan derechos indebidamente", "Solo por error", "Solo por fraude"],
          correctAnswer: 1,
          explanation: "Permite anular actos que reconocen derechos cuando son contrarios al ordenamiento."
        },
        {
          id: "t9-q18",
          question: "¿Cuáles son los límites de la revisión de oficio?",
          options: ["Sin límites", "Respeto a derechos adquiridos de buena fe", "Solo temporales", "Solo competenciales"],
          correctAnswer: 1,
          explanation: "Debe respetar los derechos que hubieran adquirido de buena fe los particulares."
        },
        {
          id: "t9-q19",
          question: "¿Qué es la aclaración de resoluciones?",
          options: ["Nueva resolución", "Explicación de términos oscuros o ambiguos", "Solo corrección", "Solo ampliación"],
          correctAnswer: 1,
          explanation: "Permite aclarar conceptos oscuros o contradicciones en las resoluciones."
        },
        {
          id: "t9-q20",
          question: "¿Cuándo procede la suspensión de la ejecución?",
          options: ["Siempre", "Con garantía y cuando cause perjuicio irreparable", "Nunca", "Solo sin garantía"],
          correctAnswer: 1,
          explanation: "Procede cuando se aporte garantía suficiente y la ejecución cause perjuicio de difícil reparación."
        }
      ]
    },
    {
      themeId: "tema-10",
      themeName: "Aduanas e Impuestos Especiales",
      tests: [
        {
          id: "t10-q1",
          question: "¿Cuál es el ámbito de aplicación del régimen aduanero?",
          options: ["Solo nacional", "Territorio aduanero de la Unión Europea", "Solo Schengen", "Solo euro"],
          correctAnswer: 1,
          explanation: "Se aplica en el territorio aduanero de la Unión Europea según el Código Aduanero de la Unión."
        },
        {
          id: "t10-q2",
          question: "¿Qué son los derechos arancelarios?",
          options: ["Solo tasas", "Tributos sobre importación de mercancías", "Solo IVA", "Solo especiales"],
          correctAnswer: 1,
          explanation: "Son tributos que gravan la importación de mercancías en el territorio aduanero."
        },
        {
          id: "t10-q3",
          question: "¿Cuáles son los regímenes aduaneros?",
          options: ["Solo libre circulación", "Libre circulación, suspensivos, económicos", "Solo suspensivos", "Solo económicos"],
          correctAnswer: 1,
          explanation: "Incluyen libre circulación, regímenes suspensivos y regímenes económicos aduaneros."
        },
        {
          id: "t10-q4",
          question: "¿Qué es el despacho aduanero?",
          options: ["Solo control", "Formalidades para someter mercancías a régimen", "Solo declaración", "Solo pago"],
          correctAnswer: 1,
          explanation: "Comprende las formalidades aduaneras para someter las mercancías a un régimen aduanero."
        },
        {
          id: "t10-q5",
          question: "¿Cuáles son los Impuestos Especiales?",
          options: ["Solo alcohol", "Alcohol, hidrocarburos, electricidad, carbón, tabaco", "Solo tabaco", "Solo hidrocarburos"],
          correctAnswer: 1,
          explanation: "Gravan alcohol y bebidas alcohólicas, hidrocarburos, electricidad, carbón y tabacos labrados."
        },
        {
          id: "t10-q6",
          question: "¿Cuándo se devengan los Impuestos Especiales?",
          options: ["Al fabricar", "Al salir de fábrica o importar", "Al vender", "Al consumir"],
          correctAnswer: 1,
          explanation: "Se devengan en el momento de salida del régimen suspensivo o en la importación."
        },
        {
          id: "t10-q7",
          question: "¿Qué es un depósito fiscal?",
          options: ["Solo almacén", "Lugar donde productos están exentos de impuesto", "Solo fábrica", "Solo tienda"],
          correctAnswer: 1,
          explanation: "Es el lugar donde los productos están exentos del pago de Impuestos Especiales."
        },
        {
          id: "t10-q8",
          question: "¿Qué son los documentos administrativos de acompañamiento?",
          options: ["Solo facturas", "Documentos que amparan circulación en suspensivo", "Solo albaranes", "Solo guías"],
          correctAnswer: 1,
          explanation: "Son documentos que amparan la circulación de productos en régimen suspensivo."
        },
        {
          id: "t10-q9",
          question: "¿Cuál es el origen de las mercancías?",
          options: ["Solo fabricación", "País donde se obtuvieron o transformaron sustancialmente", "Solo venta", "Solo envío"],
          correctAnswer: 1,
          explanation: "Es el país donde las mercancías han sido enteramente obtenidas o han sufrido transformación sustancial."
        },
        {
          id: "t10-q10",
          question: "¿Qué es el valor en aduana?",
          options: ["Solo precio", "Base para aplicar derechos ad valorem", "Solo coste", "Solo transporte"],
          correctAnswer: 1,
          explanation: "Es la base imponible para la aplicación de los derechos arancelarios ad valorem."
        },
        {
          id: "t10-q11",
          question: "¿Cuándo se aplican medidas antidumping?",
          options: ["Siempre", "Cuando hay importaciones a precios inferiores al normal", "Nunca", "Solo a ciertos países"],
          correctAnswer: 1,
          explanation: "Se aplican cuando las importaciones se realizan a precios inferiores al valor normal."
        },
        {
          id: "t10-q12",
          question: "¿Qué es la nomenclatura arancelaria?",
          options: ["Solo códigos", "Sistema de clasificación de mercancías", "Solo descripciones", "Solo tipos"],
          correctAnswer: 1,
          explanation: "Es el sistema de clasificación de mercancías para aplicación de medidas arancelarias."
        },
        {
          id: "t10-q13",
          question: "¿Cuáles son las exenciones en Impuestos Especiales?",
          options: ["No existen", "Usos industriales, exportación, diplomáticos", "Solo exportación", "Solo industriales"],
          correctAnswer: 1,
          explanation: "Incluyen exenciones por destino industrial, exportación y uso diplomático."
        },
        {
          id: "t10-q14",
          question: "¿Qué es el régimen de perfeccionamiento activo?",
          options: ["Solo importación", "Transformación de mercancías con suspensión de derechos", "Solo exportación", "Solo tránsito"],
          correctAnswer: 1,
          explanation: "Permite la transformación de mercancías con suspensión temporal de derechos e IVA."
        },
        {
          id: "t10-q15",
          question: "¿Cuándo se aplica el régimen de depósito aduanero?",
          options: ["Siempre", "Para almacenar mercancías con suspensión de derechos", "Nunca", "Solo exportación"],
          correctAnswer: 1,
          explanation: "Permite almacenar mercancías no comunitarias con suspensión de derechos e impuestos."
        },
        {
          id: "t10-q16",
          question: "¿Qué es la garantía aduanera?",
          options: ["Solo fianza", "Asegurar pago de derechos y obligaciones", "Solo aval", "Solo depósito"],
          correctAnswer: 1,
          explanation: "Es la garantía que asegura el pago de derechos e impuestos y cumplimiento de obligaciones."
        },
        {
          id: "t10-q17",
          question: "¿Cuáles son las infracciones aduaneras?",
          options: ["Solo contrabando", "Contrabando, defraudación, infracciones administrativas", "Solo defraudación", "Solo administrativas"],
          correctAnswer: 1,
          explanation: "Se clasifican en contrabando, defraudación e infracciones meramente administrativas."
        },
        {
          id: "t10-q18",
          question: "¿Qué es el operador económico autorizado?",
          options: ["Solo importador", "Empresario fiable en operaciones aduaneras", "Solo exportador", "Solo transportista"],
          correctAnswer: 1,
          explanation: "Es el empresario establecido en la UE considerado fiable para operaciones aduaneras."
        },
        {
          id: "t10-q19",
          question: "¿Cuándo se aplica el sistema EMCS?",
          options: ["Solo aduanas", "Control circulación productos en suspensivo", "Solo IVA", "Solo declaraciones"],
          correctAnswer: 1,
          explanation: "Es el sistema informatizado de control y seguimiento de productos sujetos a Impuestos Especiales."
        },
        {
          id: "t10-q20",
          question: "¿Qué es la liquidación aduanera?",
          options: ["Solo cálculo", "Determinación y exigencia de derechos e impuestos", "Solo pago", "Solo declaración"],
          correctAnswer: 1,
          explanation: "Es la determinación de la cantidad a pagar en concepto de derechos e impuestos a la importación."
        }
      ]
    }
  ],

  "administradores-civiles-estado": [
    {
      themeId: "tema-1",
      themeName: "Organización y Funcionamiento de la Administración General del Estado",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuál es la estructura básica de la Administración General del Estado?",
          options: ["Solo ministerios", "Ministerios, secretarías de Estado, direcciones generales", "Solo direcciones", "Solo órganos territoriales"],
          correctAnswer: 1,
          explanation: "La AGE se estructura en ministerios, secretarías de Estado, subsecretarías y direcciones generales."
        },
        {
          id: "t1-q2",
          question: "¿Quién dirige cada ministerio?",
          options: ["Secretario de Estado", "Ministro", "Director General", "Subsecretario"],
          correctAnswer: 1,
          explanation: "Cada ministerio está dirigido por un ministro, que es nombrado y separado por el Rey a propuesta del Presidente del Gobierno."
        },
        {
          id: "t1-q3",
          question: "¿Cuáles son los órganos superiores de un ministerio?",
          options: ["Solo el ministro", "Ministro y secretarios de Estado", "Solo direcciones generales", "Ministro y subsecretario"],
          correctAnswer: 1,
          explanation: "Los órganos superiores son el ministro y los secretarios de Estado adscritos al ministerio."
        },
        {
          id: "t1-q4",
          question: "¿Qué función tienen las subsecretarías?",
          options: ["Solo administrativa", "Gestión de recursos humanos y servicios comunes", "Solo presupuestaria", "Solo normativa"],
          correctAnswer: 1,
          explanation: "Las subsecretarías se encargan de la gestión de recursos humanos, servicios comunes y otras funciones de apoyo."
        },
        {
          id: "t1-q5",
          question: "¿Cuál es el rango de las direcciones generales?",
          options: ["Órganos superiores", "Órganos directivos", "Órganos territoriales", "Unidades administrativas"],
          correctAnswer: 1,
          explanation: "Las direcciones generales son órganos directivos responsables de la ejecución de las competencias del ministerio."
        },
        {
          id: "t1-q6",
          question: "¿Qué son los órganos territoriales de la AGE?",
          options: ["Solo delegaciones", "Delegaciones y subdelegaciones del Gobierno", "Solo en capitales", "Solo subdelegaciones"],
          correctAnswer: 1,
          explanation: "Son las delegaciones del Gobierno en las comunidades autónomas y las subdelegaciones en las provincias."
        },
        {
          id: "t1-q7",
          question: "¿Quién representa al Gobierno en las comunidades autónomas?",
          options: ["Subdelegado", "Delegado del Gobierno", "Director territorial", "Secretario autonómico"],
          correctAnswer: 1,
          explanation: "El delegado del Gobierno representa al Gobierno en cada comunidad autónoma."
        },
        {
          id: "t1-q8",
          question: "¿Cuáles son los principios de organización administrativa?",
          options: ["Solo eficacia", "Eficacia, jerarquía, descentralización, desconcentración", "Solo jerarquía", "Solo descentralización"],
          correctAnswer: 1,
          explanation: "Los principios incluyen eficacia, jerarquía, descentralización, desconcentración y coordinación."
        },
        {
          id: "t1-q9",
          question: "¿Qué es la desconcentración administrativa?",
          options: ["Crear nuevos entes", "Transferir competencias a órganos jerárquicamente dependientes", "Solo territorial", "Eliminar jerarquía"],
          correctAnswer: 1,
          explanation: "La desconcentración transfiere el ejercicio de competencias a órganos jerárquicamente dependientes."
        },
        {
          id: "t1-q10",
          question: "¿Cuál es la diferencia entre descentralización y desconcentración?",
          options: ["No hay diferencia", "Descentralización crea entes independientes, desconcentración mantiene jerarquía", "Solo territorial", "Solo funcional"],
          correctAnswer: 1,
          explanation: "La descentralización transfiere competencias a entes con personalidad jurídica propia, la desconcentración mantiene la dependencia jerárquica."
        },
        {
          id: "t1-q11",
          question: "¿Qué órganos asisten al Presidente del Gobierno?",
          options: ["Solo vicepresidentes", "Vicepresidentes, ministros y órganos de apoyo", "Solo ministros", "Solo gabinete"],
          correctAnswer: 1,
          explanation: "Le asisten los vicepresidentes, ministros y diversos órganos de apoyo como el gabinete de la Presidencia."
        },
        {
          id: "t1-q12",
          question: "¿Cuál es la función del Consejo de Ministros?",
          options: ["Solo legislar", "Órgano colegiado de gobierno", "Solo nombramientos", "Solo presupuestos"],
          correctAnswer: 1,
          explanation: "El Consejo de Ministros es el órgano colegiado de gobierno que ejerce la función ejecutiva."
        },
        {
          id: "t1-q13",
          question: "¿Qué son las comisiones delegadas del Gobierno?",
          options: ["Órganos parlamentarios", "Órganos colegiados para coordinar políticas sectoriales", "Solo consultivos", "Órganos judiciales"],
          correctAnswer: 1,
          explanation: "Son órganos colegiados del Gobierno para coordinar la política del Gobierno en materias que afecten a varios ministerios."
        },
        {
          id: "t1-q14",
          question: "¿Cuál es el papel de los gabinetes ministeriales?",
          options: ["Solo protocolo", "Apoyo político y técnico al ministro", "Solo administrativo", "Solo presupuestario"],
          correctAnswer: 1,
          explanation: "Los gabinetes proporcionan apoyo político y técnico directo al ministro."
        },
        {
          id: "t1-q15",
          question: "¿Qué es la Administración institucional?",
          options: ["Solo ministerios", "Organismos públicos con personalidad jurídica propia", "Solo empresas", "Solo fundaciones"],
          correctAnswer: 1,
          explanation: "Comprende los organismos públicos vinculados o dependientes de la AGE con personalidad jurídica diferenciada."
        },
        {
          id: "t1-q16",
          question: "¿Cuáles son los tipos de organismos públicos?",
          options: ["Solo autónomos", "Autónomos, entidades públicas empresariales y agencias", "Solo empresariales", "Solo agencias"],
          correctAnswer: 1,
          explanation: "Se clasifican en organismos autónomos, entidades p��blicas empresariales y agencias estatales."
        },
        {
          id: "t1-q17",
          question: "¿Qué caracteriza a los organismos autónomos?",
          options: ["Actividad empresarial", "Realización de actividades administrativas", "Solo servicios", "Ánimo de lucro"],
          correctAnswer: 1,
          explanation: "Los organismos autónomos realizan principalmente actividades administrativas de fomento, prestacionales o de gestión."
        },
        {
          id: "t1-q18",
          question: "¿Cuál es la función de las entidades públicas empresariales?",
          options: ["Solo administrativa", "Realización de actividades prestacionales, gestión de servicios o producción", "Solo normativa", "Solo consultiva"],
          correctAnswer: 1,
          explanation: "Realizan actividades prestacionales, de gestión de servicios públicos o de producción de bienes de interés público."
        },
        {
          id: "t1-q19",
          question: "¿Qué es el principio de jerarquía administrativa?",
          options: ["Solo protocolo", "Ordenación vertical de órganos con poderes de dirección", "Solo territorial", "Solo funcional"],
          correctAnswer: 1,
          explanation: "El principio de jerarquía establece una ordenación vertical de los órganos administrativos con poderes de dirección y control."
        },
        {
          id: "t1-q20",
          question: "¿Cuál es el órgano de control interno de la AGE?",
          options: ["Tribunal de Cuentas", "Intervención General de la Administración del Estado", "Solo auditoría externa", "Ministerio de Hacienda"],
          correctAnswer: 1,
          explanation: "La IGAE ejerce el control interno de la gestión económico-financiera del sector público estatal."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Gestión Financiera y Presupuestaria",
      tests: [
        {
          id: "t2-q1",
          question: "¿Cuáles son las fases del ciclo presupuestario?",
          options: ["Solo elaboración", "Elaboración, aprobación, ejecución, control", "Solo ejecución", "Solo control"],
          correctAnswer: 1,
          explanation: "El ciclo presupuestario comprende elaboración, aprobación, ejecución y control del presupuesto."
        },
        {
          id: "t2-q2",
          question: "¿Qué es la gestión presupuestaria?",
          options: ["Solo gastos", "Administración de ingresos y gastos públicos", "Solo ingresos", "Solo control"],
          correctAnswer: 1,
          explanation: "Es la administración de los recursos financieros públicos conforme al presupuesto aprobado."
        },
        {
          id: "t2-q3",
          question: "¿Cuáles son los principios presupuestarios clásicos?",
          options: ["Solo anualidad", "Anualidad, unidad, universalidad, especialidad", "Solo unidad", "Solo especialidad"],
          correctAnswer: 1,
          explanation: "Los principios clásicos son anualidad, unidad, universalidad y especialidad cualitativa y cuantitativa."
        },
        {
          id: "t2-q4",
          question: "¿Qué es la autorización de gasto?",
          options: ["El pago", "Acto que habilita para realizar gastos", "La factura", "El compromiso"],
          correctAnswer: 1,
          explanation: "Es el acto mediante el cual se acuerda la realización de gastos por una cuantía cierta o aproximada."
        },
        {
          id: "t2-q5",
          question: "¿Cuándo se produce el compromiso del gasto?",
          options: ["Al autorizar", "Al reservar crédito para obligación futura", "Al pagar", "Al liquidar"],
          correctAnswer: 1,
          explanation: "Se produce cuando se reserva la totalidad o parte del crédito para financiar obligaciones futuras."
        },
        {
          id: "t2-q6",
          question: "¿Qué es el reconocimiento de la obligación?",
          options: ["Solo contable", "Acto que declara la existencia de deuda líquida", "Solo presupuestario", "Solo formal"],
          correctAnswer: 1,
          explanation: "Es el acto mediante el cual se declara la existencia de una deuda líquida y exigible contra la Hacienda Pública."
        },
        {
          id: "t2-q7",
          question: "¿Cuáles son las modificaciones presupuestarias?",
          options: ["Solo transferencias", "Transferencias, ampliaciones, generaciones, incorporaciones", "Solo ampliaciones", "Solo incorporaciones"],
          correctAnswer: 1,
          explanation: "Incluyen transferencias, ampliaciones, generaciones de crédito e incorporaciones de remanentes."
        },
        {
          id: "t2-q8",
          question: "¿Qué es la liquidación del presupuesto?",
          options: ["Solo cierre", "Operación de cierre que determina derechos y obligaciones", "Solo cálculo", "Solo archivo"],
          correctAnswer: 1,
          explanation: "Es la operación contable de cierre que determina los derechos reconocidos y obligaciones contraídas."
        },
        {
          id: "t2-q9",
          question: "¿Cuándo se consideran créditos disponibles?",
          options: ["Siempre", "Cuando no están comprometidos", "Nunca", "Solo autorizados"],
          correctAnswer: 1,
          explanation: "Son disponibles los créditos que no han sido objeto de autorización o compromiso de gasto."
        },
        {
          id: "t2-q10",
          question: "¿Qué es la prórroga presupuestaria?",
          options: ["Ampliación temporal", "Vigencia del presupuesto anterior hasta aprobación del nuevo", "Solo retraso", "Nuevo presupuesto"],
          correctAnswer: 1,
          explanation: "Permite la vigencia del presupuesto del ejercicio anterior hasta la aprobación del nuevo."
        },
        {
          id: "t2-q11",
          question: "¿Cuáles son los estados de la liquidación presupuestaria?",
          options: ["Solo gastos", "Liquidación presupuestaria, resultado presupuestario, remanente tesorería", "Solo ingresos", "Solo resultado"],
          correctAnswer: 1,
          explanation: "Comprende liquidación presupuestaria, resultado presupuestario y remanente de tesorería."
        },
        {
          id: "t2-q12",
          question: "¿Qué son los gastos plurianuales?",
          options: ["Solo anuales", "Gastos que se extienden a varios ejercicios", "Solo corrientes", "Solo inversión"],
          correctAnswer: 1,
          explanation: "Son gastos cuyos créditos se extienden a ejercicios posteriores al de su autorización."
        },
        {
          id: "t2-q13",
          question: "¿Cuándo procede la tramitación anticipada del gasto?",
          options: ["Siempre", "Cuando convenga al servicio público", "Solo en urgencia", "Solo al final del año"],
          correctAnswer: 1,
          explanation: "Procede cuando convenga al servicio público, permitiendo iniciar expedientes antes del ejercicio de ejecución."
        },
        {
          id: "t2-q14",
          question: "¿Qu�� es el control financiero permanente?",
          options: ["Solo anual", "Verificación continua de actividad económico-financiera", "Solo presupuestario", "Solo contable"],
          correctAnswer: 1,
          explanation: "Es la verificación continua del cumplimiento de la normativa en la actividad económico-financiera."
        },
        {
          id: "t2-q15",
          question: "¿Cuáles son los documentos contables básicos?",
          options: ["Solo facturas", "Documentos A, D, O, documentos contables", "Solo presupuesto", "Solo liquidación"],
          correctAnswer: 1,
          explanation: "Incluyen documentos A (autorización), D (compromiso), O (obligación) y otros documentos contables."
        },
        {
          id: "t2-q16",
          question: "¿Qué es la contabilidad analítica en el sector público?",
          options: ["Solo gastos", "Sistema que informa sobre costes de servicios", "Solo presupuestaria", "Solo financiera"],
          correctAnswer: 1,
          explanation: "Proporciona información sobre los costes de los servicios que presta la Administración."
        },
        {
          id: "t2-q17",
          question: "¿Cuándo se puede declarar la caducidad del crédito?",
          options: ["Nunca", "Al finalizar el ejercicio sin utilizar", "Solo en urgencia", "Solo con autorización"],
          correctAnswer: 1,
          explanation: "Los créditos no utilizados al final del ejercicio quedan anulados, salvo excepciones legales."
        },
        {
          id: "t2-q18",
          question: "¿Qué es el fondo de contingencia?",
          options: ["Reserva normal", "Dotación para atender necesidades urgentes", "Solo emergencias", "Solo inversión"],
          correctAnswer: 1,
          explanation: "Es una dotación presupuestaria para atender necesidades inaplazables de carácter no discrecional."
        },
        {
          id: "t2-q19",
          question: "¿Cuáles son los informes de control financiero?",
          options: ["Solo de cumplimiento", "Cumplimiento, sistemas, procedimientos, auditor���a", "Solo de auditoría", "Solo de sistemas"],
          correctAnswer: 1,
          explanation: "Incluyen informes de cumplimiento, de sistemas, de procedimientos y de auditoría."
        },
        {
          id: "t2-q20",
          question: "¿Qué es la gestión de tesorería?",
          options: ["Solo pagos", "Administración de flujos de cobros y pagos", "Solo cobros", "Solo préstamos"],
          correctAnswer: 1,
          explanation: "Es la gestión de los flujos de cobros y pagos para optimizar la liquidez de la Hacienda Pública."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Derecho Constitucional y Unión Europea",
      tests: [
        {
          id: "t3-q1",
          question: "¿Cuáles son los valores superiores del ordenamiento jurídico español?",
          options: ["Solo libertad", "Libertad, justicia, igualdad, pluralismo político", "Solo igualdad", "Solo justicia"],
          correctAnswer: 1,
          explanation: "El artículo 1.1 CE establece como valores superiores la libertad, justicia, igualdad y pluralismo político."
        },
        {
          id: "t3-q2",
          question: "¿Cuál es la forma política del Estado español?",
          options: ["República", "Monarquía parlamentaria", "Monarquía absoluta", "Estado federal"],
          correctAnswer: 1,
          explanation: "España se constituye en un Estado social y democrático de Derecho, que propugna como forma política la Monarquía parlamentaria."
        },
        {
          id: "t3-q3",
          question: "¿Cuáles son los principios rectores de la política social y económica?",
          options: ["Solo sociales", "Protección familia, pleno empleo, seguridad social, etc.", "Solo económicos", "Solo laborales"],
          correctAnswer: 1,
          explanation: "Incluyen protección a la familia, derecho al trabajo, seguridad social, protección de la salud, etc."
        },
        {
          id: "t3-q4",
          question: "¿Cuándo entra en vigor la Constitución Española?",
          options: ["6 diciembre 1978", "29 diciembre 1978", "1 enero 1979", "27 diciembre 1978"],
          correctAnswer: 1,
          explanation: "La Constitución Española entró en vigor el 29 de diciembre de 1978."
        },
        {
          id: "t3-q5",
          question: "¿Cuáles son las funciones del Rey?",
          options: ["Ejecutivas", "Arbitrar, moderar, símbolo unidad", "Legislativas", "Judiciales"],
          correctAnswer: 1,
          explanation: "El Rey arbitra y modera el funcionamiento regular de las instituciones y es símbolo de unidad y permanencia del Estado."
        },
        {
          id: "t3-q6",
          question: "¿Cuáles son los derechos fundamentales protegidos por recurso de amparo?",
          options: ["Todos", "Los del Capítulo Segundo, Sección Primera", "Solo libertades", "Solo igualdad"],
          correctAnswer: 1,
          explanation: "Los derechos del artículo 14 al 29 y la objeción de conciencia están protegidos por recurso de amparo."
        },
        {
          id: "t3-q7",
          question: "¿Qué instituciones integran las Cortes Generales?",
          options: ["Solo Congreso", "Congreso de los Diputados y Senado", "Solo Senado", "Tres cámaras"],
          correctAnswer: 1,
          explanation: "Las Cortes Generales representan al pueblo español y están formadas por el Congreso de los Diputados y el Senado."
        },
        {
          id: "t3-q8",
          question: "¿Cuál es la duración del mandato de las Cortes Generales?",
          options: ["3 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "Las Cortes Generales son elegidas por cuatro años."
        },
        {
          id: "t3-q9",
          question: "¿Cuáles son las funciones del Tribunal Constitucional?",
          options: ["Solo amparo", "Control constitucionalidad, amparo, conflictos", "Solo conflictos", "Solo control"],
          correctAnswer: 1,
          explanation: "Conoce del control de constitucionalidad, recurso de amparo y conflictos de competencia."
        },
        {
          id: "t3-q10",
          question: "¿Qué principios rigen las relaciones con la Unión Europea?",
          options: ["Solo soberanía", "Subsidiariedad, proporcionalidad, primacía", "Solo integración", "Solo cooperación"],
          correctAnswer: 1,
          explanation: "Los principios fundamentales son subsidiariedad, proporcionalidad y primacía del Derecho de la UE."
        },
        {
          id: "t3-q11",
          question: "¿Cuáles son las instituciones principales de la UE?",
          options: ["Solo Comisión", "Parlamento, Consejo, Comisión, Tribunal de Justicia", "Solo Parlamento", "Solo Consejo"],
          correctAnswer: 1,
          explanation: "Las instituciones principales son el Parlamento Europeo, el Consejo, la Comisión y el Tribunal de Justicia."
        },
        {
          id: "t3-q12",
          question: "¿Qué es la ciudadanía europea?",
          options: ["Independiente", "Complementaria de la nacional", "Sustitutiva", "Solo económica"],
          correctAnswer: 1,
          explanation: "La ciudadanía de la Unión se añade a la ciudadanía nacional sin sustituirla."
        },
        {
          id: "t3-q13",
          question: "¿Cuáles son las libertades fundamentales del mercado interior?",
          options: ["Solo mercancías", "Mercancías, personas, servicios, capitales", "Solo servicios", "Solo capitales"],
          correctAnswer: 1,
          explanation: "Las cuatro libertades son: libre circulación de mercancías, personas, servicios y capitales."
        },
        {
          id: "t3-q14",
          question: "¿Qué es el procedimiento legislativo ordinario?",
          options: ["Solo Consejo", "Codecisión Parlamento-Consejo", "Solo Parlamento", "Solo Comisión"],
          correctAnswer: 1,
          explanation: "Es el procedimiento de codecisión entre el Parlamento Europeo y el Consejo de la UE."
        },
        {
          id: "t3-q15",
          question: "¿Cuáles son los criterios de convergencia de la UEM?",
          options: ["Solo inflación", "Estabilidad precios, finanzas públicas, tipos interés, tipo cambio", "Solo déficit", "Solo deuda"],
          correctAnswer: 1,
          explanation: "Los criterios incluyen estabilidad de precios, finanzas públicas saneadas, estabilidad del tipo de cambio y convergencia de los tipos de interés."
        },
        {
          id: "t3-q16",
          question: "¿Qué es la cuestión prejudicial?",
          options: ["Solo nacional", "Consulta al Tribunal de Justicia UE", "Solo administrativa", "Solo penal"],
          correctAnswer: 1,
          explanation: "Es el mecanismo para que los tribunales nacionales consulten al TJUE sobre interpretación del Derecho de la UE."
        },
        {
          id: "t3-q17",
          question: "¿Cuáles son los derechos de los ciudadanos europeos?",
          options: ["Solo votar", "Circular, residir, votar, protección diplomática", "Solo residir", "Solo trabajar"],
          correctAnswer: 1,
          explanation: "Incluyen derecho a circular y residir, votar en elecciones europeas y municipales, y protección diplomática."
        },
        {
          id: "t3-q18",
          question: "¿Qué es el Consejo Europeo?",
          options: ["Legislativo", "Impulso político y orientaciones generales", "Ejecutivo", "Judicial"],
          correctAnswer: 1,
          explanation: "Da el impulso político necesario y define las orientaciones políticas generales de la UE."
        },
        {
          id: "t3-q19",
          question: "¿Cuáles son las competencias exclusivas de la UE?",
          options: ["Todas", "Unión aduanera, política monetaria, pesca", "Solo monetaria", "Solo aduanera"],
          correctAnswer: 1,
          explanation: "Incluyen unión aduanera, política monetaria, conservación recursos pesqueros y política comercial común."
        },
        {
          id: "t3-q20",
          question: "¿Qué es la Carta de Derechos Fundamentales?",
          options: ["Solo declaración", "Derecho vinculante de la UE", "Solo política", "Solo moral"],
          correctAnswer: 1,
          explanation: "Tiene el mismo valor jurídico que los Tratados y es vinculante para las instituciones de la UE."
        }
      ]
    },
    {
      themeId: "tema-4",
      themeName: "Derecho Administrativo General",
      tests: [
        {
          id: "t4-q1",
          question: "¿Cuáles son las fuentes del Derecho Administrativo?",
          options: ["Solo ley", "Constitución, ley, reglamento, costumbre, principios", "Solo reglamento", "Solo jurisprudencia"],
          correctAnswer: 1,
          explanation: "Las fuentes incluyen la Constitución, la ley, los reglamentos, la costumbre y los principios generales del Derecho."
        },
        {
          id: "t4-q2",
          question: "¿Cuál es el principio de jerarquía normativa?",
          options: ["Igualdad", "Norma superior prevalece sobre inferior", "Solo temporal", "Solo competencial"],
          correctAnswer: 1,
          explanation: "La norma jerárquicamente superior prevalece sobre la inferior en caso de conflicto."
        },
        {
          id: "t4-q3",
          question: "¿Qué es un acto administrativo?",
          options: ["Solo decisión", "Declaración de voluntad de la Administración", "Solo resolución", "Solo providencia"],
          correctAnswer: 1,
          explanation: "Es toda declaración de voluntad, deseo, conocimiento o juicio realizada por la Administración."
        },
        {
          id: "t4-q4",
          question: "¿Cuáles son los elementos del acto administrativo?",
          options: ["Solo subjetivos", "Subjetivos, objetivos, formales", "Solo objetivos", "Solo formales"],
          correctAnswer: 1,
          explanation: "Los elementos son subjetivos (órgano), objetivos (contenido) y formales (procedimiento)."
        },
        {
          id: "t4-q5",
          question: "¿Qué es la ejecutoriedad del acto administrativo?",
          options: ["Solo eficacia", "Capacidad de ejecución sin intervención judicial", "Solo validez", "Solo vigencia"],
          correctAnswer: 1,
          explanation: "Es la capacidad de los actos administrativos de ejecutarse por sí mismos sin necesidad de intervención judicial."
        },
        {
          id: "t4-q6",
          question: "¿Cuándo es nulo de pleno derecho un acto administrativo?",
          options: ["Nunca", "Por vicios muy graves: incompetencia, contenido imposible", "Solo por incompetencia", "Siempre anulable"],
          correctAnswer: 1,
          explanation: "Son nulos los actos que lesionen derechos fundamentales, dictados por órgano incompetente, con objeto imposible, etc."
        },
        {
          id: "t4-q7",
          question: "¿Qué diferencia hay entre nulidad y anulabilidad?",
          options: ["No hay diferencia", "Nulidad por vicios graves, anulabilidad por irregularidades", "Solo terminología", "Solo efectos"],
          correctAnswer: 1,
          explanation: "La nulidad se produce por vicios muy graves, la anulabilidad por irregularidades no invalidantes."
        },
        {
          id: "t4-q8",
          question: "¿Cuáles son los principios del procedimiento administrativo?",
          options: ["Solo celeridad", "Contradictorio, audiencia, instrucción de oficio", "Solo audiencia", "Solo oficialidad"],
          correctAnswer: 1,
          explanation: "Incluyen los principios contradictorio, de audiencia, instrucción de oficio y economía procesal."
        },
        {
          id: "t4-q9",
          question: "¿Cuáles son las fases del procedimiento administrativo?",
          options: ["Solo instrucción", "Iniciación, instrucción, terminación", "Solo terminación", "Solo iniciación"],
          correctAnswer: 1,
          explanation: "Las fases son iniciación, ordenación, instrucción, finalización y ejecución."
        },
        {
          id: "t4-q10",
          question: "¿Qué es el silencio administrativo?",
          options: ["Falta respuesta", "Ficción jurídica ante falta de resolución expresa", "Solo demora", "Solo incumplimiento"],
          correctAnswer: 1,
          explanation: "Es la ficción jurídica que atribuye efectos a la falta de resolución expresa en plazo."
        },
        {
          id: "t4-q11",
          question: "¿Cuándo el silencio es positivo o negativo?",
          options: ["Siempre positivo", "Depende de la naturaleza del procedimiento", "Siempre negativo", "Solo en recursos"],
          correctAnswer: 1,
          explanation: "Por regla general es negativo, salvo que una norma establezca lo contrario."
        },
        {
          id: "t4-q12",
          question: "¿Qué es la revisión de oficio?",
          options: ["Solo por recurso", "Revisión por la propia Administración", "Solo judicial", "Solo por terceros"],
          correctAnswer: 1,
          explanation: "Es la revisión que efectúa la propia Administración de sus actos nulos o anulables."
        },
        {
          id: "t4-q13",
          question: "¿Cuáles son los recursos administrativos?",
          options: ["Solo alzada", "Alzada, reposición, extraordinario de revisión", "Solo reposición", "Solo revisión"],
          correctAnswer: 1,
          explanation: "Los recursos ordinarios son alzada y reposición; extraordinario es el de revisión."
        },
        {
          id: "t4-q14",
          question: "¿Qué es la responsabilidad patrimonial de la Administración?",
          options: ["Solo por dolo", "Obligación de indemnizar daños por su actividad", "Solo por culpa", "Solo contractual"],
          correctAnswer: 1,
          explanation: "Es la obligación de indemnizar los daños causados en el funcionamiento de los servicios públicos."
        },
        {
          id: "t4-q15",
          question: "¿Cuáles son los requisitos de la responsabilidad patrimonial?",
          options: ["Solo daño", "Daño efectivo, evaluable económicamente, individualizado", "Solo relación causal", "Solo antijuridicidad"],
          correctAnswer: 1,
          explanation: "Requiere daño efectivo, evaluable económicamente, individualizado, antijurídico y en relación de causalidad."
        },
        {
          id: "t4-q16",
          question: "¿Qué es la potestad reglamentaria?",
          options: ["Solo ejecutar", "Facultad de dictar normas generales", "Solo interpretar", "Solo aplicar"],
          correctAnswer: 1,
          explanation: "Es la facultad de la Administración de dictar normas jurídicas generales."
        },
        {
          id: "t4-q17",
          question: "¿Cuáles son los límites de la potestad reglamentaria?",
          options: ["Sin límites", "Constitución, leyes, jerarquía, competencia", "Solo constitucionales", "Solo legales"],
          correctAnswer: 1,
          explanation: "Los reglamentos no pueden vulnerar la Constitución ni las leyes, ni invadir la reserva de ley."
        },
        {
          id: "t4-q18",
          question: "¿Qué es la invalidez del reglamento?",
          options: ["Solo nulidad", "Nulidad o anulabilidad seg��n el vicio", "Solo anulabilidad", "Sin invalidez"],
          correctAnswer: 1,
          explanation: "Los reglamentos pueden ser nulos o anulables según la gravedad del vicio que padezcan."
        },
        {
          id: "t4-q19",
          question: "¿Cuáles son las potestades administrativas?",
          options: ["Solo sancionadora", "Reglamentaria, sancionadora, expropiatoria, tributaria", "Solo tributaria", "Solo expropiatoria"],
          correctAnswer: 1,
          explanation: "Incluyen potestades reglamentaria, sancionadora, expropiatoria, tributaria y de policía."
        },
        {
          id: "t4-q20",
          question: "¿Qué es la discrecionalidad administrativa?",
          options: ["Arbitrariedad", "Margen de apreciación dentro de la legalidad", "Solo técnica", "Solo política"],
          correctAnswer: 1,
          explanation: "Es la facultad de elegir entre varias soluciones igualmente válidas en Derecho."
        }
      ]
    },
    {
      themeId: "tema-5",
      themeName: "Ley 39/2015 de Procedimiento Administrativo Común",
      tests: [
        {
          id: "t5-q1",
          question: "¿Cuál es el ámbito de aplicación de la Ley 39/2015?",
          options: ["Solo Estado", "Todas las Administraciones públicas", "Solo autonómicas", "Solo locales"],
          correctAnswer: 1,
          explanation: "Se aplica a la Administración General del Estado, autonómica, local e institucional."
        },
        {
          id: "t5-q2",
          question: "¿Cuáles son los derechos de los interesados?",
          options: ["Solo información", "Información, audiencia, representación, asistencia", "Solo audiencia", "Solo representación"],
          correctAnswer: 1,
          explanation: "Incluyen derechos a la información, audiencia, representación y asistencia de las Administraciones."
        },
        {
          id: "t5-q3",
          question: "¿Qué es la sede electrónica?",
          options: ["Solo web", "Dirección electrónica para relacionarse con la Administración", "Solo correo", "Solo portal"],
          correctAnswer: 1,
          explanation: "Es la dirección electrónica disponible para los ciudadanos a través de redes de telecomunicaciones."
        },
        {
          id: "t5-q4",
          question: "¿Cuándo es obligatoria la relación electrónica?",
          options: ["Nunca", "Para personas jurídicas y ciertos colectivos", "Siempre", "Solo empresas"],
          correctAnswer: 1,
          explanation: "Es obligatoria para personas jurídicas, entidades sin personalidad, empleados públicos y otros colectivos."
        },
        {
          id: "t5-q5",
          question: "¿Qué documentos tienen validez en el procedimiento?",
          options: ["Solo originales", "Originales, copias auténticas, electrónicos", "Solo electrónicos", "Solo copias"],
          correctAnswer: 1,
          explanation: "Tienen validez los documentos originales, copias auténticas y documentos electrónicos."
        },
        {
          id: "t5-q6",
          question: "¿Cuáles son las formas de iniciación del procedimiento?",
          options: ["Solo solicitud", "De oficio o a solicitud del interesado", "Solo de oficio", "Solo por denuncia"],
          correctAnswer: 1,
          explanation: "Los procedimientos se inician de oficio por la Administración o a solicitud del interesado."
        },
        {
          id: "t5-q7",
          question: "¿Qué contenido debe tener la solicitud?",
          options: ["Solo datos personales", "Datos, hechos, petición, lugar, fecha, firma", "Solo petición", "Solo firma"],
          correctAnswer: 1,
          explanation: "Debe incluir datos del interesado, hechos, razones, petición, lugar, fecha y firma."
        },
        {
          id: "t5-q8",
          question: "¿Cuándo se subsanan defectos en las solicitudes?",
          options: ["No se subsanan", "Requerimiento con 10 días para subsanar", "Automáticamente", "Solo si es grave"],
          correctAnswer: 1,
          explanation: "Se requiere al interesado para que subsane en el plazo de 10 días."
        },
        {
          id: "t5-q9",
          question: "¿Cuál es el plazo máximo para resolver procedimientos?",
          options: ["3 meses", "6 meses salvo norma específica", "1 año", "Sin límite"],
          correctAnswer: 1,
          explanation: "El plazo máximo es de 6 meses, salvo que una norma específica establezca otro plazo."
        },
        {
          id: "t5-q10",
          question: "¿Qué es el trámite de audiencia?",
          options: ["Solo informar", "Posibilidad de alegar y aportar documentos", "Solo vista oral", "Solo escrito"],
          correctAnswer: 1,
          explanation: "Permite a los interesados conocer el expediente y alegar lo que estimen conveniente."
        },
        {
          id: "t5-q11",
          question: "¿Cuándo no es necesario el trámite de audiencia?",
          options: ["Siempre necesario", "Cuando no figuran hechos distintos a los alegados", "Nunca", "Solo en procedimientos breves"],
          correctAnswer: 1,
          explanation: "No es necesario cuando no figuran en el expediente hechos distintos a los alegados por los interesados."
        },
        {
          id: "t5-q12",
          question: "¿Qué es la resolución administrativa?",
          options: ["Solo decisión", "Acto que decide todas las cuestiones planteadas", "Solo informe", "Solo propuesta"],
          correctAnswer: 1,
          explanation: "Es el acto administrativo que decide todas las cuestiones planteadas en el procedimiento."
        },
        {
          id: "t5-q13",
          question: "¿Qué contenido debe tener la resolución?",
          options: ["Solo decisión", "Decisión, motivación, recursos, firma", "Solo motivación", "Solo recursos"],
          correctAnswer: 1,
          explanation: "Debe ser motivada, decidir todas las cuestiones, expresar recursos posibles y estar firmada."
        },
        {
          id: "t5-q14",
          question: "¿Cuándo se produce caducidad del procedimiento?",
          options: ["Nunca", "Por paralización por causa imputable al interesado", "Siempre a los 6 meses", "Solo por renuncia"],
          correctAnswer: 1,
          explanation: "Se produce cuando el procedimiento se paraliza por causa imputable al interesado."
        },
        {
          id: "t5-q15",
          question: "¿Qué efectos tiene la caducidad?",
          options: ["Resolución desestimatoria", "Archivo del expediente", "Estimación silencio", "Continuación automática"],
          correctAnswer: 1,
          explanation: "Produce el archivo del expediente, sin perjuicio de que pueda volverse a iniciar."
        },
        {
          id: "t5-q16",
          question: "¿Qué es la ampliación de plazo?",
          options: ["Imposible", "Prórroga motivada hasta duplicar plazo máximo", "Solo un mes", "Sin límites"],
          correctAnswer: 1,
          explanation: "Permite ampliar los plazos hasta el doble del inicialmente previsto."
        },
        {
          id: "t5-q17",
          question: "¿Cuándo se suspende el procedimiento?",
          options: ["Nunca", "Por causas específicas: informe preceptivo, cuestión prejudicial", "Siempre por recurso", "Solo por petición"],
          correctAnswer: 1,
          explanation: "Se suspende por emisión de informes preceptivos, cuestiones prejudiciales o causas específicas."
        },
        {
          id: "t5-q18",
          question: "¿Qué es la terminación convencional?",
          options: ["Solo imposición", "Acuerdos, contratos y convenios", "Solo unilateral", "Solo judicial"],
          correctAnswer: 1,
          explanation: "Los procedimientos pueden terminar por acuerdos, contratos o convenios administrativos."
        },
        {
          id: "t5-q19",
          question: "¿Cuándo procede la ejecución forzosa?",
          options: ["Siempre", "Cuando no se cumple voluntariamente", "Nunca", "Solo con orden judicial"],
          correctAnswer: 1,
          explanation: "Procede cuando los actos administrativos no son cumplidos voluntariamente."
        },
        {
          id: "t5-q20",
          question: "¿Cuáles son los medios de ejecución forzosa?",
          options: ["Solo multa", "Apremio, ejecución subsidiaria, multas coercitivas", "Solo ejecución subsidiaria", "Solo compulsión"],
          correctAnswer: 1,
          explanation: "Incluyen apremio sobre el patrimonio, ejecución subsidiaria, multas coercitivas y compulsión sobre las personas."
        }
      ]
    },
    {
      themeId: "tema-6",
      themeName: "Régimen Jurídico del Sector Público",
      tests: [
        {
          id: "t6-q1",
          question: "¿Cuáles son los principios de actuación de las Administraciones?",
          options: ["Solo legalidad", "Legalidad, eficacia, jerarquía, objetividad", "Solo eficacia", "Solo jerarquía"],
          correctAnswer: 1,
          explanation: "Incluyen principios de legalidad, eficacia, jerarquía, descentralización, desconcentración y coordinación."
        },
        {
          id: "t6-q2",
          question: "¿Qué es la competencia administrativa?",
          options: ["Solo función", "Medida de poder atribuida a un órgano", "Solo capacidad", "Solo atribución"],
          correctAnswer: 1,
          explanation: "La competencia es la medida del poder atribuido a cada órgano administrativo."
        },
        {
          id: "t6-q3",
          question: "¿Cuáles son las características de la competencia?",
          options: ["Solo irrenunciable", "Irrenunciable, improrrogable, objetiva", "Solo improrrogable", "Solo objetiva"],
          correctAnswer: 1,
          explanation: "La competencia es irrenunciable, improrrogable, se ejerce por órganos que la tienen atribuida."
        },
        {
          id: "t6-q4",
          question: "¿Qué es la delegación de competencias?",
          options: ["Transferencia definitiva", "Transferencia temporal del ejercicio", "Solo colaboración", "Solo coordinación"],
          correctAnswer: 1,
          explanation: "Es la transferencia temporal del ejercicio de competencias propias a otros órganos."
        },
        {
          id: "t6-q5",
          question: "¿Cuáles son los órganos colegiados?",
          options: ["Solo unipersonales", "Órganos integrados por tres o más personas", "Solo dos personas", "Solo consultivos"],
          correctAnswer: 1,
          explanation: "Son órganos administrativos integrados por tres o más personas para adoptar decisiones conjuntas."
        },
        {
          id: "t6-q6",
          question: "¿Cómo funcionan los órganos colegiados?",
          options: ["Sin reglas", "Convocatoria, quórum, mayorías, actas", "Solo por unanimidad", "Solo presencialmente"],
          correctAnswer: 1,
          explanation: "Requieren convocatoria previa, quórum para sesiones válidas, adopción de acuerdos y levantamiento de actas."
        },
        {
          id: "t6-q7",
          question: "¿Qué es la abstención?",
          options: ["Solo ausencia", "Apartarse voluntariamente por conflicto de intereses", "Solo recusación", "Solo inhibición"],
          correctAnswer: 1,
          explanation: "Es el deber de apartarse del asunto cuando concurra alguna de las causas de abstención."
        },
        {
          id: "t6-q8",
          question: "¿Cuáles son las causas de abstención?",
          options: ["Solo interés personal", "Interés personal, parentesco, amistad íntima, enemistad", "Solo parentesco", "Solo enemistad"],
          correctAnswer: 1,
          explanation: "Incluyen interés personal, parentesco, amistad íntima, enemistad manifiesta y participación previa."
        },
        {
          id: "t6-q9",
          question: "¿Qué es la recusación?",
          options: ["Solo apartarse", "Solicitud para que un funcionario se aparte", "Solo abstención", "Solo inhibición"],
          correctAnswer: 1,
          explanation: "Es la solicitud formulada por los interesados para que un funcionario se aparte del asunto."
        },
        {
          id: "t6-q10",
          question: "¿Qué son las relaciones interadministrativas?",
          options: ["Solo cooperación", "Vínculos entre diferentes Administraciones", "Solo coordinación", "Solo colaboración"],
          correctAnswer: 1,
          explanation: "Son las relaciones de cooperación, colaboración y coordinación entre las distintas Administraciones."
        },
        {
          id: "t6-q11",
          question: "¿Cuáles son los principios de las relaciones interadministrativas?",
          options: ["Solo cooperación", "Cooperación, colaboración, coordinación, respeto competencial", "Solo coordinación", "Solo respeto"],
          correctAnswer: 1,
          explanation: "Se basan en cooperación, colaboración, coordinación y respeto a las competencias respectivas."
        },
        {
          id: "t6-q12",
          question: "¿Qué son los convenios de colaboración?",
          options: ["Solo contratos", "Instrumentos de cooperación entre Administraciones", "Solo coordinación", "Solo acuerdos"],
          correctAnswer: 1,
          explanation: "Son instrumentos para formalizar la cooperación entre diferentes Administraciones públicas."
        },
        {
          id: "t6-q13",
          question: "¿Qué es la coordinación administrativa?",
          options: ["Solo subordinación", "Integración de la diversidad en la unidad", "Solo cooperación", "Solo colaboración"],
          correctAnswer: 1,
          explanation: "Es la integración de la diversidad de las partes o elementos en el conjunto del sistema."
        },
        {
          id: "t6-q14",
          question: "¿Cuáles son los conflictos de competencias?",
          options: ["Solo positivos", "Positivos, negativos, de atribuciones", "Solo negativos", "Solo de atribuciones"],
          correctAnswer: 1,
          explanation: "Pueden ser conflictos positivos, negativos o de atribuciones entre órganos de la misma Administración."
        },
        {
          id: "t6-q15",
          question: "¿Qué es el control interno?",
          options: ["Solo externo", "Verificación interna del cumplimiento normativo", "Solo político", "Solo judicial"],
          correctAnswer: 1,
          explanation: "Es la verificación del cumplimiento de la legalidad y eficiencia en la gestión administrativa."
        },
        {
          id: "t6-q16",
          question: "¿Qué son los organismos públicos?",
          options: ["Solo ministerios", "Entidades con personalidad jurídica propia vinculadas", "Solo empresas", "Solo fundaciones"],
          correctAnswer: 1,
          explanation: "Son entidades de derecho público con personalidad jurídica propia creadas para realizar actividades específicas."
        },
        {
          id: "t6-q17",
          question: "¿Cuáles son los tipos de organismos públicos?",
          options: ["Solo autónomos", "Organismos autónomos, entidades públicas empresariales, agencias", "Solo empresariales", "Solo agencias"],
          correctAnswer: 1,
          explanation: "Se clasifican en organismos autónomos, entidades públicas empresariales y agencias estatales."
        },
        {
          id: "t6-q18",
          question: "¿Qué caracteriza a las agencias estatales?",
          options: ["Solo administrativa", "Mayor autonomía funcional y de gestión", "Solo empresarial", "Solo consultiva"],
          correctAnswer: 1,
          explanation: "Se caracterizan por una mayor autonomía de funcionamiento y gestión que otros organismos."
        },
        {
          id: "t6-q19",
          question: "¿Qué es la transparencia administrativa?",
          options: ["Solo información", "Derecho acceso información y buen gobierno", "Solo publicidad", "Solo participación"],
          correctAnswer: 1,
          explanation: "Comprende el derecho de acceso a la información pública y las obligaciones de buen gobierno."
        },
        {
          id: "t6-q20",
          question: "¿Cuáles son las obligaciones de publicidad activa?",
          options: ["Solo presupuestos", "Información relevante publicada sin solicitud previa", "Solo normativa", "Solo organismos"],
          correctAnswer: 1,
          explanation: "Las Administraciones deben publicar de forma proactiva información de relevancia jurídica."
        }
      ]
    },
    {
      themeId: "tema-7",
      themeName: "Función Pública y Estatuto Básico del Empleado Público",
      tests: [
        {
          id: "t7-q1",
          question: "¿Cuáles son las clases de personal al servicio de las Administraciones?",
          options: ["Solo funcionarios", "Funcionarios de carrera, interinos, laborales", "Solo laborales", "Solo interinos"],
          correctAnswer: 1,
          explanation: "El personal comprende funcionarios de carrera, funcionarios interinos, personal laboral y personal eventual."
        },
        {
          id: "t7-q2",
          question: "¿Qué caracteriza a los funcionarios de carrera?",
          options: ["Solo temporales", "Ocupan puestos clasificados como tales", "Solo laborales", "Solo eventuales"],
          correctAnswer: 1,
          explanation: "Los funcionarios de carrera ocupan los puestos clasificados como tales en las relaciones de puestos de trabajo."
        },
        {
          id: "t7-q3",
          question: "¿Cuándo se puede nombrar funcionarios interinos?",
          options: ["Siempre", "Por vacante, sustitución, exceso de trabajo, urgente necesidad", "Solo por vacante", "Solo por sustitución"],
          correctAnswer: 1,
          explanation: "Se nombran para ocupar plaza vacante, sustituir funcionarios, atender exceso de trabajo o urgente necesidad."
        },
        {
          id: "t7-q4",
          question: "¿Cuáles son los derechos de los empleados públicos?",
          options: ["Solo económicos", "Inamovilidad, carrera, retribuciones, formación", "Solo carrera", "Solo formación"],
          correctAnswer: 1,
          explanation: "Incluyen inamovilidad, promoción profesional, formación, retribuciones justas y participación."
        },
        {
          id: "t7-q5",
          question: "¿Cuáles son los deberes de los empleados públicos?",
          options: ["Solo obediencia", "Cumplir constitución, leyes, servir intereses generales", "Solo lealtad", "Solo secreto"],
          correctAnswer: 1,
          explanation: "Deben respetar la Constitución, cumplir las leyes, servir los intereses generales y actuar con objetividad."
        },
        {
          id: "t7-q6",
          question: "¿Qué es la carrera profesional?",
          options: ["Solo ascensos", "Progresión en grados, categorías o escalas", "Solo promoción", "Solo antigüedad"],
          correctAnswer: 1,
          explanation: "Es el conjunto ordenado de oportunidades de ascenso y expectativas de progreso profesional."
        },
        {
          id: "t7-q7",
          question: "¿Cuáles son las modalidades de carrera?",
          options: ["Solo horizontal", "Horizontal, vertical, promoción interna", "Solo vertical", "Solo promoción"],
          correctAnswer: 1,
          explanation: "Incluye carrera horizontal (grados), vertical (categorías/escalas) y promoción interna."
        },
        {
          id: "t7-q8",
          question: "¿Qué es la provisión de puestos?",
          options: ["Solo concurso", "Procedimientos para ocupar puestos", "Solo libre designación", "Solo oposición"],
          correctAnswer: 1,
          explanation: "Son los procedimientos para la ocupación de puestos de trabajo: concurso, libre designación, etc."
        },
        {
          id: "t7-q9",
          question: "¿Cuándo procede el concurso de méritos?",
          options: ["Solo para directivos", "Para puestos no reservados a libre designación", "Solo para técnicos", "Solo para base"],
          correctAnswer: 1,
          explanation: "Es el procedimiento ordinario para la provisión de puestos no reservados a libre designación."
        },
        {
          id: "t7-q10",
          question: "¿Qué puestos se proveen por libre designación?",
          options: ["Todos", "Puestos de especial responsabilidad y confianza", "Ninguno", "Solo directivos"],
          correctAnswer: 1,
          explanation: "Los puestos de especial responsabilidad y confianza que se determinen en las relaciones de puestos."
        },
        {
          id: "t7-q11",
          question: "¿Cuáles son las situaciones administrativas?",
          options: ["Solo activo", "Servicio activo, servicios especiales, excedencia", "Solo excedencia", "Solo especiales"],
          correctAnswer: 1,
          explanation: "Las situaciones son servicio activo, servicios especiales, servicio en otras Administraciones y excedencia."
        },
        {
          id: "t7-q12",
          question: "¿Qué es la excedencia voluntaria?",
          options: ["Solo forzosa", "Situación sin reserva de puesto ni retribución", "Con reserva puesto", "Con retribución"],
          correctAnswer: 1,
          explanation: "Es la situación sin derecho a reserva de puesto ni a retribución, con posibilidad de reingreso."
        },
        {
          id: "t7-q13",
          question: "¿Cuáles son los tipos de retribuciones?",
          options: ["Solo básicas", "Básicas y complementarias", "Solo complementarias", "Solo variables"],
          correctAnswer: 1,
          explanation: "Las retribuciones comprenden las básicas (iguales por grupos) y complementarias (específicas del puesto)."
        },
        {
          id: "t7-q14",
          question: "¿Qué son las retribuciones básicas?",
          options: ["Variables", "Sueldo, trienios, pagas extraordinarias", "Solo sueldo", "Solo trienios"],
          correctAnswer: 1,
          explanation: "Comprenden el sueldo asignado al grupo, trienios por antigüedad y pagas extraordinarias."
        },
        {
          id: "t7-q15",
          question: "¿Qué son las retribuciones complementarias?",
          options: ["Básicas", "Complemento destino, específico, productividad", "Solo destino", "Solo productividad"],
          correctAnswer: 1,
          explanation: "Incluyen complemento de destino, específico y de productividad según el puesto y rendimiento."
        },
        {
          id: "t7-q16",
          question: "¿Qué es el régimen disciplinario?",
          options: ["Solo premios", "Sistema de infracciones y sanciones", "Solo faltas", "Solo sanciones"],
          correctAnswer: 1,
          explanation: "Es el conjunto de infracciones y sanciones aplicables a los empleados públicos."
        },
        {
          id: "t7-q17",
          question: "¿Cuáles son los tipos de faltas disciplinarias?",
          options: ["Solo graves", "Leves, graves, muy graves", "Solo leves", "Solo muy graves"],
          correctAnswer: 1,
          explanation: "Las faltas se clasifican en leves, graves y muy graves según su entidad y consecuencias."
        },
        {
          id: "t7-q18",
          question: "¿Cuáles son las sanciones disciplinarias?",
          options: ["Solo separación", "Advertencia, suspensión, separación del servicio", "Solo suspensión", "Solo advertencia"],
          correctAnswer: 1,
          explanation: "Van desde la advertencia hasta la separación del servicio según la gravedad de la falta."
        },
        {
          id: "t7-q19",
          question: "¿Qué es la incompatibilidad?",
          options: ["Solo económica", "Prohibición de realizar otras actividades", "Solo temporal", "Solo pública"],
          correctAnswer: 1,
          explanation: "Es la prohibición de realizar actividades privadas incompatibles con el ejercicio de la función pública."
        },
        {
          id: "t7-q20",
          question: "¿Cuándo procede la jubilación forzosa?",
          options: ["Nunca", "Al cumplir la edad establecida", "Solo voluntaria", "Solo por incapacidad"],
          correctAnswer: 1,
          explanation: "Los funcionarios cesan al cumplir los 65 años de edad, salvo prolongación hasta los 67 años."
        }
      ]
    },
    {
      themeId: "tema-8",
      themeName: "Contratación del Sector Público",
      tests: [
        {
          id: "t8-q1",
          question: "¿Cuál es el ámbito de aplicación de la LCSP?",
          options: ["Solo Estado", "Sector público: Administraciones y organismos", "Solo empresas", "Solo entidades"],
          correctAnswer: 1,
          explanation: "Se aplica a las Administraciones públicas y entidades del sector público."
        },
        {
          id: "t8-q2",
          question: "¿Cuáles son los tipos de contratos del sector público?",
          options: ["Solo obras", "Obras, servicios, suministros, concesión", "Solo servicios", "Solo suministros"],
          correctAnswer: 1,
          explanation: "Los contratos típicos son de obras, servicios, suministros y concesión de obras o servicios."
        },
        {
          id: "t8-q3",
          question: "¿Qué es el expediente de contratación?",
          options: ["Solo documentos", "Conjunto de documentos que justifican el contrato", "Solo propuesta", "Solo informes"],
          correctAnswer: 1,
          explanation: "Es el conjunto de documentos en que se materializa la preparación del contrato."
        },
        {
          id: "t8-q4",
          question: "¿Cuáles son los procedimientos de adjudicación?",
          options: ["Solo abierto", "Abierto, restringido, licitación con negociación", "Solo restringido", "Solo negociado"],
          correctAnswer: 1,
          explanation: "Los principales son abierto, restringido, licitación con negociación y diálogo competitivo."
        },
        {
          id: "t8-q5",
          question: "¿Qué es el procedimiento abierto?",
          options: ["Solo invitados", "Pueden concurrir todos los interesados", "Solo adjudicación directa", "Solo restringido"],
          correctAnswer: 1,
          explanation: "Puede presentar proposiciones cualquier empresario interesado sin limitación."
        },
        {
          id: "t8-q6",
          question: "¿Cu��les son los criterios de adjudicación?",
          options: ["Solo precio", "Mejor relación calidad-precio", "Solo calidad", "Solo plazo"],
          correctAnswer: 1,
          explanation: "Se adjudica conforme al criterio de mejor relación calidad-precio."
        },
        {
          id: "t8-q7",
          question: "¿Qué son los pliegos de condiciones?",
          options: ["Solo técnicos", "Documentos que rigen la licitación", "Solo económicos", "Solo jurídicos"],
          correctAnswer: 1,
          explanation: "Son los documentos que contienen las prescripciones técnicas y cláusulas administrativas."
        },
        {
          id: "t8-q8",
          question: "¿Cuándo se puede modificar un contrato?",
          options: ["Siempre", "Por causas previstas o razones de interés público", "Nunca", "Solo por acuerdo"],
          correctAnswer: 1,
          explanation: "Solo cuando esté previsto en los pliegos o por razones de interés público imprevistas."
        },
        {
          id: "t8-q9",
          question: "¿Qué es la garantía definitiva?",
          options: ["Solo provisional", "Asegura cumplimiento del contrato", "Solo de participación", "Solo de mantenimiento"],
          correctAnswer: 1,
          explanation: "Es la garantía que asegura el cumplimiento del contrato adjudicado."
        },
        {
          id: "t8-q10",
          question: "¿Cuál es el importe de la garantía definitiva?",
          options: ["5%", "5% del precio adjudicación IVA excluido", "10%", "3%"],
          correctAnswer: 1,
          explanation: "La garantía definitiva es del 5% del precio de adjudicación, IVA excluido."
        },
        {
          id: "t8-q11",
          question: "¿Qué es la subcontratación?",
          options: ["Prohibida", "Encargo a terceros de parte de la prestación", "Solo total", "Solo parcial"],
          correctAnswer: 1,
          explanation: "Es el encargo por parte del contratista a terceros de la realización de determinadas partes del contrato."
        },
        {
          id: "t8-q12",
          question: "¿Cuáles son las causas de resolución contractual?",
          options: ["Solo incumplimiento", "Muerte, incapacidad, incumplimiento, mutuo acuerdo", "Solo mutuo acuerdo", "Solo quiebra"],
          correctAnswer: 1,
          explanation: "Incluyen muerte o incapacidad del contratista, incumplimiento, mutuo acuerdo, etc."
        },
        {
          id: "t8-q13",
          question: "¿Qué es la recepción del contrato?",
          options: ["Solo entrega", "Acto formal de conformidad con la prestación", "Solo pago", "Solo firma"],
          correctAnswer: 1,
          explanation: "Es el acto por el que el órgano de contratación reconoce la conformidad de la prestación."
        },
        {
          id: "t8-q14",
          question: "¿Cuándo comienza el plazo de garantía?",
          options: ["Al firmar", "Desde la recepción del contrato", "Al pagar", "Al adjudicar"],
          correctAnswer: 1,
          explanation: "El plazo de garantía comienza a partir de la recepción o conformidad del contrato."
        },
        {
          id: "t8-q15",
          question: "¿Qué es el equilibrio económico del contrato?",
          options: ["Solo beneficios", "Mantenimiento de las condiciones económicas", "Solo pérdidas", "Solo costes"],
          correctAnswer: 1,
          explanation: "Es el mantenimiento de la ecuación económica del contrato ante circunstancias imprevistas."
        },
        {
          id: "t8-q16",
          question: "¿Qué son las prestaciones adicionales?",
          options: ["Prohibidas", "Ampliaciones del objeto contractual", "Solo reducciones", "Solo mejoras"],
          correctAnswer: 1,
          explanation: "Son ampliaciones del objeto contractual que pueden acordarse bajo ciertas condiciones."
        },
        {
          id: "t8-q17",
          question: "¿Cuáles son los medios de impugnación?",
          options: ["Solo recursos", "Recurso especial y cuestión de nulidad", "Solo nulidad", "Solo alzada"],
          correctAnswer: 1,
          explanation: "Los actos de contratación pueden impugnarse mediante recurso especial o cuestión de nulidad."
        },
        {
          id: "t8-q18",
          question: "¿Qué es la mesa de contratación?",
          options: ["Solo administrativa", "Órgano colegiado para evaluar proposiciones", "Solo técnica", "Solo económica"],
          correctAnswer: 1,
          explanation: "Es el órgano colegiado encargado de la calificación de la documentación y evaluación de proposiciones."
        },
        {
          id: "t8-q19",
          question: "¿Cuándo se aplica la tramitación de urgencia?",
          options: ["Siempre", "Por razones de interés público", "Nunca", "Solo obras"],
          correctAnswer: 1,
          explanation: "Cuando se justifique la necesidad de acelerar la tramitación por razones de interés público."
        },
        {
          id: "t8-q20",
          question: "��Qué es la centralización de compras?",
          options: ["Prohibida", "Concentración de contratación en órganos especializados", "Solo descentralizada", "Solo local"],
          correctAnswer: 1,
          explanation: "Es la concentración de la contratación de determinados suministros en órganos especializados."
        }
      ]
    }
  ],

  "agentes-hacienda-publica": [
    {
      themeId: "tema-1",
      themeName: "Gestión Tributaria y Procedimientos",
      tests: [
        {
          id: "t1-q1",
          question: "¿Cuáles son las funciones principales de la AEAT?",
          options: ["Solo recaudación", "Gestión, inspección, recaudación y aduanas", "Solo inspección", "Solo aduanas"],
          correctAnswer: 1,
          explanation: "La AEAT tiene funciones de gestión tributaria, inspección, recaudación y control aduanero."
        },
        {
          id: "t1-q2",
          question: "¿Qué es la gestión tributaria?",
          options: ["Solo cobrar", "Conjunto de actividades para aplicar el sistema tributario", "Solo sancionar", "Solo informar"],
          correctAnswer: 1,
          explanation: "La gestión tributaria comprende todas las actividades dirigidas a la aplicación de los tributos."
        },
        {
          id: "t1-q3",
          question: "¿Cuándo comienza el período de pago voluntario?",
          options: ["Al presentar declaración", "Tras la notificación de la liquidación", "Al final del año", "Al realizar el hecho imponible"],
          correctAnswer: 1,
          explanation: "El período de pago voluntario comienza al d��a siguiente de la notificación de la liquidación."
        },
        {
          id: "t1-q4",
          question: "¿Cuánto dura el período de pago voluntario?",
          options: ["15 días", "20 días naturales desde la notificación", "30 días", "1 mes"],
          correctAnswer: 1,
          explanation: "El período de pago voluntario es de 20 días naturales desde la notificación si vence entre los días 1 al 15, o hasta el día 5 del mes siguiente si vence entre los días 16 al 31."
        },
        {
          id: "t1-q5",
          question: "¿Qué sucede si no se paga en período voluntario?",
          options: ["Nada", "Se inicia el período ejecutivo", "Se anula la deuda", "Solo se aplican intereses"],
          correctAnswer: 1,
          explanation: "Si no se paga en período voluntario, se inicia el período ejecutivo con recargo e intereses de demora."
        },
        {
          id: "t1-q6",
          question: "¿Cuáles son los recargos del período ejecutivo?",
          options: ["Solo 5%", "5%, 10%, 15% y 20% según el momento del pago", "Solo 20%", "Fijo 10%"],
          correctAnswer: 1,
          explanation: "Los recargos van del 5% (pago antes de la providencia de apremio) al 20% (después de 12 meses)."
        },
        {
          id: "t1-q7",
          question: "¿Qué es la providencia de apremio?",
          options: ["Una sanción", "Acto que inicia la ejecución forzosa", "Una liquidación", "Un recurso"],
          correctAnswer: 1,
          explanation: "La providencia de apremio es el acto administrativo que inicia el procedimiento de apremio para el cobro de las deudas."
        },
        {
          id: "t1-q8",
          question: "¿Cuándo se puede aplazar o fraccionar una deuda?",
          options: ["Siempre", "Por dificultades económicas del deudor", "Nunca", "Solo empresas"],
          correctAnswer: 1,
          explanation: "Se puede solicitar cuando el obligado acredite dificultades económicas para el pago en plazo."
        },
        {
          id: "t1-q9",
          question: "¿Qué garantías se pueden exigir para aplazar el pago?",
          options: ["Ninguna", "Aval, hipoteca, fianza o embargo preventivo", "Solo dinero", "Solo avales"],
          correctAnswer: 1,
          explanation: "Las garantías pueden ser aval solidario, hipoteca, fianza, embargo preventivo o depósito de dinero."
        },
        {
          id: "t1-q10",
          question: "¿Cuál es el orden de prelación en el embargo?",
          options: ["Libre elección", "Dinero, créditos, valores, bienes muebles, inmuebles", "Solo inmuebles", "Solo dinero"],
          correctAnswer: 1,
          explanation: "El orden de prelación es: dinero efectivo, créditos y valores realizables, valores negociables, bienes muebles, bienes inmuebles."
        },
        {
          id: "t1-q11",
          question: "¿Qué bienes son inembargables?",
          options: ["Todos", "Bienes básicos para la subsistencia", "Ninguno", "Solo la vivienda"],
          correctAnswer: 1,
          explanation: "Son inembargables los bienes necesarios para la subsistencia del deudor y su familia, como el salario mínimo interprofesional."
        },
        {
          id: "t1-q12",
          question: "¿Cuándo procede la suspensión del procedimiento de recaudación?",
          options: ["Nunca", "Al interponer recurso con garantía suficiente", "Solo con recurso", "Siempre autom���tica"],
          correctAnswer: 1,
          explanation: "La suspensión procede cuando se interpone recurso y se aporta garantía suficiente o en casos especiales previstos en la ley."
        },
        {
          id: "t1-q13",
          question: "¿Qué es la derivación de responsabilidad?",
          options: ["Una sanción", "Declaración de responsable subsidiario o solidario", "Un recurso", "Una liquidación"],
          correctAnswer: 1,
          explanation: "Es el procedimiento para declarar responsable de la deuda tributaria a personas distintas del deudor principal."
        },
        {
          id: "t1-q14",
          question: "¿Cuándo se declara fallida una deuda?",
          options: ["Inmediatamente", "Cuando se agoten infructuosamente las medidas de cobro", "Al año", "Nunca"],
          correctAnswer: 1,
          explanation: "Se declara fallida cuando se han agotado infructuosamente todas las medidas de investigación y cobro."
        },
        {
          id: "t1-q15",
          question: "¿Qué efectos tiene la declaración de fallido?",
          options: ["Extingue la deuda", "Suspende el procedimiento pero mantiene la deuda", "Solo archiva", "Cancela todo"],
          correctAnswer: 1,
          explanation: "La declaración de fallido suspende el procedimiento pero no extingue la deuda, que puede reanudarse si aparecen bienes."
        },
        {
          id: "t1-q16",
          question: "¿Cuáles son las formas de extinción de la deuda tributaria?",
          options: ["Solo pago", "Pago, prescripción, compensación, condonación", "Solo prescripción", "Solo compensación"],
          correctAnswer: 1,
          explanation: "Las formas de extinción son: pago, prescripción, compensación, condonación e insolvencia probada del deudor."
        },
        {
          id: "t1-q17",
          question: "¿Qué es la compensación de deudas tributarias?",
          options: ["Un descuento", "Extinción de deudas y créditos recíprocos", "Solo para empresas", "Un aplazamiento"],
          correctAnswer: 1,
          explanation: "La compensación extingue las obligaciones tributarias mediante la aplicación de créditos a favor del obligado."
        },
        {
          id: "t1-q18",
          question: "¿Cuándo se puede solicitar la devolución de ingresos indebidos?",
          options: ["En 1 año", "En 4 años desde el pago", "En 2 años", "No se puede"],
          correctAnswer: 1,
          explanation: "El derecho a la devolución de ingresos indebidos prescribe a los 4 años desde la fecha del pago."
        },
        {
          id: "t1-q19",
          question: "¿Qué intereses se abonan en las devoluciones?",
          options: ["Ninguno", "Interés de demora desde el pago hasta la propuesta de devolución", "Solo bancarios", "Fijos anuales"],
          correctAnswer: 1,
          explanation: "Se abona el interés de demora desde la fecha del pago hasta la fecha de la propuesta de devolución."
        },
        {
          id: "t1-q20",
          question: "¿Cuál es el procedimiento para la devolución?",
          options: ["Automática", "Solicitud del interesado o propuesta de oficio", "Solo si pide", "Solo de oficio"],
          correctAnswer: 1,
          explanation: "La devolución puede iniciarse por solicitud del interesado o por propuesta de oficio de la Administración."
        }
      ]
    },
    {
      themeId: "tema-2",
      themeName: "Procedimiento de Inspección Tributaria",
      tests: [
        {
          id: "t2-q1",
          question: "¿Qué es la inspección tributaria?",
          options: ["Solo control", "Actividad administrativa de comprobación", "Solo sanción", "Solo liquidación"],
          correctAnswer: 1,
          explanation: "La inspección es la actividad administrativa encaminada a la comprobación e investigación de los hechos, actos y situaciones tributarias."
        },
        {
          id: "t2-q2",
          question: "¿Cuáles son las funciones de la inspección?",
          options: ["Solo comprobar", "Investigación, comprobación, práctica de liquidaciones", "Solo sancionar", "Solo informar"],
          correctAnswer: 1,
          explanation: "Las funciones incluyen investigación, comprobación e inspección, práctica de liquidaciones, y propuesta de sanciones."
        },
        {
          id: "t2-q3",
          question: "¿Qué es el acta de inspección?",
          options: ["Solo informe", "Documento que refleja hechos y propuestas", "Solo liquidación", "Solo sanción"],
          correctAnswer: 1,
          explanation: "Es el documento en que se hacen constar los hechos y circunstancias con trascendencia tributaria."
        },
        {
          id: "t2-q4",
          question: "¿Cuándo se firma el acta de conformidad?",
          options: ["Nunca", "Cuando el obligado acepta los hechos y propuesta", "Siempre", "Solo si hay error"],
          correctAnswer: 1,
          explanation: "Se firma cuando el obligado tributario acepta los hechos y la propuesta de regularización."
        },
        {
          id: "t2-q5",
          question: "¿Qué efectos tiene el acta de conformidad?",
          options: ["Ninguno", "Termina el procedimiento inspector", "Solo informativo", "Solo propuesta"],
          correctAnswer: 1,
          explanation: "El acta de conformidad pone fin al procedimiento inspector respecto de los hechos reflejados."
        },
        {
          id: "t2-q6",
          question: "¿Cuál es el plazo máximo de las actuaciones inspectoras?",
          options: ["6 meses", "12 meses", "18 meses", "24 meses"],
          correctAnswer: 2,
          explanation: "El plazo máximo de duración de las actuaciones inspectoras es de 18 meses."
        },
        {
          id: "t2-q7",
          question: "¿Qué es el plan anual de inspección?",
          options: ["Solo estadística", "Programa de actuaciones inspectoras", "Solo objetivos", "Solo recursos"],
          correctAnswer: 1,
          explanation: "Es el documento que establece los criterios, objetivos y directrices de las actuaciones inspectoras."
        },
        {
          id: "t2-q8",
          question: "¿Cuándo pueden iniciarse actuaciones inspectoras?",
          options: ["En cualquier momento", "Dentro del plazo de prescripción", "Solo al final del año", "Solo con denuncia"],
          correctAnswer: 1,
          explanation: "Pueden iniciarse en cualquier momento dentro del plazo de prescripción del derecho a comprobar."
        },
        {
          id: "t2-q9",
          question: "¿Qué es la comprobación limitada?",
          options: ["Solo parcial", "Verificación de conceptos específicos", "Solo general", "Solo formal"],
          correctAnswer: 1,
          explanation: "Es la verificación de la declaración del obligado limitada a determinados aspectos."
        },
        {
          id: "t2-q10",
          question: "¿Cuáles son los deberes del obligado en la inspección?",
          options: ["Solo pagar", "Exhibir documentos, facilitar información, comparecer", "Solo documentos", "Solo comparecer"],
          correctAnswer: 1,
          explanation: "Debe exhibir documentos, libros, facilitar información y comparecer ante la inspección."
        },
        {
          id: "t2-q11",
          question: "¿Qué es la entrada y registro?",
          options: ["Solo inspección", "Medida excepcional con autorización judicial", "Solo administrativa", "Solo voluntaria"],
          correctAnswer: 1,
          explanation: "Es una medida excepcional que requiere autorización judicial para acceder a domicilios."
        },
        {
          id: "t2-q12",
          question: "¿Qué documentos puede requerir la inspección?",
          options: ["Solo facturas", "Toda documentación con trascendencia tributaria", "Solo declaraciones", "Solo contratos"],
          correctAnswer: 1,
          explanation: "Puede requerir toda la documentación con trascendencia tributaria en poder del obligado."
        },
        {
          id: "t2-q13",
          question: "¿Cuándo se produce la paralización de actuaciones?",
          options: ["Nunca", "Por causas no imputables a la inspección", "Siempre", "Solo por el contribuyente"],
          correctAnswer: 1,
          explanation: "Se produce cuando concurren circunstancias que impiden el desarrollo de las actuaciones por causas no imputables a la inspección."
        },
        {
          id: "t2-q14",
          question: "¿Qué es el acta de disconformidad?",
          options: ["Solo desacuerdo", "Acta cuando no hay aceptación de hechos o propuesta", "Solo rechazo", "Solo protesta"],
          correctAnswer: 1,
          explanation: "Se extiende cuando el obligado no acepta los hechos o no presta conformidad a la propuesta."
        },
        {
          id: "t2-q15",
          question: "¿Cuáles son las garantías del contribuyente?",
          options: ["Ninguna", "Derecho a ser oído, representación, información", "Solo silencio", "Solo recurrir"],
          correctAnswer: 1,
          explanation: "Tiene derecho a ser oído, representación y defensa, informaci��n sobre sus derechos y obligaciones."
        },
        {
          id: "t2-q16",
          question: "¿Qué es la comprobación de valores?",
          options: ["Solo precios", "Verificación del valor de transmisiones", "Solo tasaciones", "Solo estimaciones"],
          correctAnswer: 1,
          explanation: "Es la actividad dirigida a comprobar el valor de las transmisiones de bienes y derechos."
        },
        {
          id: "t2-q17",
          question: "¿Cuándo procede la estimación indirecta?",
          options: ["Siempre", "Cuando no se puede determinar la base por otros métodos", "Nunca", "Solo en fraude"],
          correctAnswer: 1,
          explanation: "Procede cuando no se puede conocer o comprobar la base imponible por otros métodos."
        },
        {
          id: "t2-q18",
          question: "¿Qué es el libro registro de facturas?",
          options: ["Solo IVA", "Registro cronológico de facturas emitidas y recibidas", "Solo ventas", "Solo compras"],
          correctAnswer: 1,
          explanation: "Es el registro cronológico de las facturas emitidas y recibidas por el empresario."
        },
        {
          id: "t2-q19",
          question: "¿Cuál es el deber de colaboración de terceros?",
          options: ["Voluntario", "Suministrar información sobre obligados tributarios", "Solo bancos", "Solo notarios"],
          correctAnswer: 1,
          explanation: "Los terceros deben suministrar datos, informes o antecedentes con trascendencia tributaria."
        },
        {
          id: "t2-q20",
          question: "¿Qué efectos tiene la regularización inspectora?",
          options: ["Solo información", "Liquidación de deuda y posible sanción", "Solo advertencia", "Solo estadística"],
          correctAnswer: 1,
          explanation: "Puede dar lugar a liquidaciones tributarias, recargos, intereses y propuestas de sanción."
        }
      ]
    },
    {
      themeId: "tema-3",
      themeName: "Infracciones y Sanciones Tributarias",
      tests: [
        {
          id: "t3-q1",
          question: "¿Qué es una infracción tributaria?",
          options: ["Solo error", "Acción u omisión contraria a la normativa tributaria", "Solo retraso", "Solo olvido"],
          correctAnswer: 1,
          explanation: "Es toda acción u omisión tipificada y sancionada en la normativa tributaria."
        },
        {
          id: "t3-q2",
          question: "¿Cuáles son los tipos de infracciones tributarias?",
          options: ["Solo graves", "Leves, graves y muy graves", "Solo leves", "Solo muy graves"],
          correctAnswer: 1,
          explanation: "Las infracciones se clasifican en leves, graves y muy graves según su entidad."
        },
        {
          id: "t3-q3",
          question: "¿Cuál es la sanción por no presentar declaraciones?",
          options: ["50€", "150€ a 600€", "1000€", "10% de la cuota"],
          correctAnswer: 1,
          explanation: "La sanción por no presentar declaraciones oscila entre 150€ y 600€."
        },
        {
          id: "t3-q4",
          question: "¿Qué es el recargo por declaración extemporánea?",
          options: ["Sanción", "Recargo por presentar fuera de plazo sin requerimiento", "Interés", "Multa"],
          correctAnswer: 1,
          explanation: "Es el recargo aplicable cuando se presenta declaración fuera de plazo sin requerimiento previo."
        },
        {
          id: "t3-q5",
          question: "¿Cuándo prescribe una infracción tributaria?",
          options: ["3 años", "4 años", "5 años", "6 años"],
          correctAnswer: 1,
          explanation: "Las infracciones tributarias prescriben a los 4 años."
        },
        {
          id: "t3-q6",
          question: "¿Qué es la conformidad en el procedimiento sancionador?",
          options: ["Reconocimiento", "Aceptación de la sanción con reducción", "Solo pago", "Solo acuerdo"],
          correctAnswer: 1,
          explanation: "Permite la reducción del 25% de la sanción si se acepta la propuesta."
        },
        {
          id: "t3-q7",
          question: "¿Cuáles son las circunstancias agravantes?",
          options: ["Solo reincidencia", "Reincidencia, resistencia, obstrucción", "Solo resistencia", "Solo ocultación"],
          correctAnswer: 1,
          explanation: "Incluyen reincidencia, resistencia, negativa, obstrucción a la inspección."
        },
        {
          id: "t3-q8",
          question: "¿Qué son las circunstancias atenuantes?",
          options: ["Solo colaboración", "Colaboración, confesión, reparación del perjuicio", "Solo confesión", "Solo reparación"],
          correctAnswer: 1,
          explanation: "Incluyen colaboración con la inspección, confesión de la infracción y reparación del perjuicio."
        },
        {
          id: "t3-q9",
          question: "¿Cuándo hay resistencia a la inspección?",
          options: ["Solo negativa", "Negativa a exhibir documentos o facilitar información", "Solo retraso", "Solo error"],
          correctAnswer: 1,
          explanation: "Se produce cuando se niega a exhibir documentos, libros o a facilitar información requerida."
        },
        {
          id: "t3-q10",
          question: "¿Qué es la infracción de defraudación?",
          options: ["Solo error", "Eludir pago mediante ocultación o engaño", "Solo retraso", "Solo olvido"],
          correctAnswer: 1,
          explanation: "Consiste en eludir el pago de tributos mediante ocultación o engaño."
        },
        {
          id: "t3-q11",
          question: "¿Cuál es la sanción por defraudación simple?",
          options: ["50%", "50% al 100% de la cuota defraudada", "100%", "25%"],
          correctAnswer: 1,
          explanation: "La sanción oscila entre el 50% y el 100% de la cuota defraudada."
        },
        {
          id: "t3-q12",
          question: "¿Qué agrava la defraudación?",
          options: ["Solo cantidad", "Utilización de medios fraudulentos", "Solo reincidencia", "Solo ocultación"],
          correctAnswer: 1,
          explanation: "Se agrava por utilización de medios fraudulentos o falsificación de documentos."
        },
        {
          id: "t3-q13",
          question: "¿Cuándo hay obstrucción a la inspección?",
          options: ["Solo negativa", "Impedir o dificultar las actuaciones inspectoras", "Solo retraso", "Solo error"],
          correctAnswer: 1,
          explanation: "Se produce cuando se impide o dificulta el ejercicio de las funciones inspectoras."
        },
        {
          id: "t3-q14",
          question: "¿Qué es el delito fiscal?",
          options: ["Solo infracción", "Defraudación superior a 120.000€", "Solo sanción", "Solo multa"],
          correctAnswer: 1,
          explanation: "Es la defraudación a la Hacienda Pública superior a 120.000 euros en el período de un año."
        },
        {
          id: "t3-q15",
          question: "¿Cuándo se suspende el procedimiento sancionador?",
          options: ["Nunca", "Cuando haya indicios de delito fiscal", "Siempre", "Solo con recurso"],
          correctAnswer: 1,
          explanation: "Se suspende cuando existan indicios de que la infracción pueda ser constitutiva de delito."
        },
        {
          id: "t3-q16",
          question: "¿Qué es la responsabilidad solidaria en sanciones?",
          options: ["Individual", "Varios responden por la sanción", "Solo del infractor", "Solo subsidiaria"],
          correctAnswer: 1,
          explanation: "Varios obligados pueden responder solidariamente de la sanción impuesta."
        },
        {
          id: "t3-q17",
          question: "¿Cuál es el principio non bis in idem?",
          options: ["Doble sanción", "Prohibición de doble sanción por el mismo hecho", "Doble procedimiento", "Doble infracción"],
          correctAnswer: 1,
          explanation: "Prohíbe sancionar dos veces por el mismo hecho cuando hay identidad de sujeto, hecho y fundamento."
        },
        {
          id: "t3-q18",
          question: "¿Qué efectos tiene la regularización voluntaria?",
          options: ["Ninguno", "Exclusión de sanción si es antes de actuaciones", "Solo reducción", "Solo advertencia"],
          correctAnswer: 1,
          explanation: "La regularización voluntaria antes de cualquier actuación excluye la imposición de sanciones."
        },
        {
          id: "t3-q19",
          question: "¿Cuándo hay infracción por no llevanza de libros?",
          options: ["Solo pérdida", "Incumplimiento de obligaciones contables", "Solo retraso", "Solo error"],
          correctAnswer: 1,
          explanation: "Se produce por el incumplimiento sustancial de las obligaciones contables y registrales."
        },
        {
          id: "t3-q20",
          question: "¿Qué es la graduación de sanciones?",
          options: ["Solo mínimo", "Determinación de sanción entre mínimo y máximo", "Solo máximo", "Solo medio"],
          correctAnswer: 1,
          explanation: "Es la determinación de la sanción concreta dentro de los límites mínimo y máximo establecidos."
        }
      ]
    },
    {
      themeId: "tema-4",
      themeName: "Procedimientos de Recaudación",
      tests: [
        {
          id: "t4-q1",
          question: "¿Cuáles son las fases del procedimiento de recaudación?",
          options: ["Solo ejecutiva", "Voluntaria y ejecutiva", "Solo voluntaria", "Administrativa y judicial"],
          correctAnswer: 1,
          explanation: "El procedimiento de recaudación comprende los períodos voluntario y ejecutivo."
        },
        {
          id: "t4-q2",
          question: "¿Cuándo comienza el período ejecutivo?",
          options: ["Inmediatamente", "Al día siguiente del fin del período voluntario", "Al mes", "A los seis meses"],
          correctAnswer: 1,
          explanation: "El período ejecutivo se inicia el día siguiente al del vencimiento del plazo de pago voluntario."
        },
        {
          id: "t4-q3",
          question: "¿Qué es el embargo preventivo?",
          options: ["Definitivo", "Medida cautelar antes de liquidación firme", "Solo bancario", "Solo inmobiliario"],
          correctAnswer: 1,
          explanation: "Es una medida cautelar para asegurar el cobro de deudas no firmes cuando peligre su cobro."
        },
        {
          id: "t4-q4",
          question: "¿Cuál es el orden de prelación para el embargo?",
          options: ["Libre", "Dinero, depósitos, valores, sueldos, bienes muebles, inmuebles", "Solo inmuebles", "Solo dinero"],
          correctAnswer: 1,
          explanation: "Existe un orden legal: dinero, depósitos, valores realizables, sueldos, bienes muebles, inmuebles."
        },
        {
          id: "t4-q5",
          question: "¿Qué son los bienes inembargables?",
          options: ["No existen", "Bienes necesarios para la subsistencia", "Solo la vivienda", "Todos los bienes"],
          correctAnswer: 1,
          explanation: "Son bienes indispensables para la subsistencia del deudor y su familia."
        },
        {
          id: "t4-q6",
          question: "¿Cuándo procede la subasta de bienes embargados?",
          options: ["Inmediatamente", "Cuando no se pague tras el embargo", "Solo inmuebles", "Solo muebles"],
          correctAnswer: 1,
          explanation: "Se procede a subasta cuando no se satisface la deuda tras la traba del embargo."
        },
        {
          id: "t4-q7",
          question: "¿Qué es la adjudicación directa?",
          options: ["Venta normal", "Adjudicación a la Hacienda cuando no hay postores", "Solo subastas", "Solo remates"],
          correctAnswer: 1,
          explanation: "Permite adjudicar bienes a la Hacienda Pública cuando no hay postores en subasta."
        },
        {
          id: "t4-q8",
          question: "¿Cuál es el tipo mínimo en primera subasta?",
          options: ["50% del valor", "75% del valor de tasación", "100% del valor", "25% del valor"],
          correctAnswer: 1,
          explanation: "En primera subasta el tipo mínimo es el 75% del valor de tasación."
        },
        {
          id: "t4-q9",
          question: "¿Qué es la tercería de dominio?",
          options: ["Embargo", "Reclamación de propiedad por tercero", "Solo judicial", "Solo administrativa"],
          correctAnswer: 1,
          explanation: "Es la reclamación de un tercero que alega ser propietario de bienes embargados."
        },
        {
          id: "t4-q10",
          question: "¿Cuándo se puede solicitar aplazamiento o fraccionamiento?",
          options: ["Siempre", "Por dificultades económicas transitorias", "Solo empresas", "Solo particulares"],
          correctAnswer: 1,
          explanation: "Se puede solicitar cuando se acrediten dificultades económicas para el pago."
        },
        {
          id: "t4-q11",
          question: "¿Qué garantías se exigen para aplazamiento?",
          options: ["Ninguna", "Según el importe y riesgo", "Solo bancarias", "Solo reales"],
          correctAnswer: 1,
          explanation: "Las garantías se determinan según el importe de la deuda y el riesgo de cobro."
        },
        {
          id: "t4-q12",
          question: "¿Cuándo se declara crédito incobrable?",
          options: ["Nunca", "Cuando se declare la insolvencia del deudor", "Siempre", "Solo empresas"],
          correctAnswer: 1,
          explanation: "Se declara cuando se acredite la insolvencia total del obligado al pago."
        },
        {
          id: "t4-q13",
          question: "¿Qué efectos tiene la declaración de fallido?",
          options: ["Extingue la deuda", "Suspende el procedimiento", "Solo contable", "Solo estadístico"],
          correctAnswer: 1,
          explanation: "Suspende el procedimiento pero no extingue la deuda, que podrá reanudarse."
        },
        {
          id: "t4-q14",
          question: "¿Cuál es el procedimiento para tercerías?",
          options: ["Solo judicial", "Administrativo con posible recurso judicial", "Solo administrativo", "Solo arbitraje"],
          correctAnswer: 1,
          explanation: "Es un procedimiento administrativo con posibilidad de recurso contencioso-administrativo."
        },
        {
          id: "t4-q15",
          question: "¿Qué es la enajenación por gestión?",
          options: ["Venta directa", "Encargo a entidad especializada", "Solo subastas", "Solo adjudicación"],
          correctAnswer: 1,
          explanation: "Es el encargo de la venta a entidades especializadas en enajenación de bienes."
        },
        {
          id: "t4-q16",
          question: "¿Cuándo se puede embargar el salario?",
          options: ["Siempre", "Respetando el mínimo inembargable", "Nunca", "Solo la mitad"],
          correctAnswer: 1,
          explanation: "Se puede embargar el salario respetando las escalas del mínimo inembargable."
        },
        {
          id: "t4-q17",
          question: "¿Qué son las medidas cautelares?",
          options: ["Definitivas", "Provisionales para asegurar el cobro", "Solo embargo", "Solo fianzas"],
          correctAnswer: 1,
          explanation: "Son medidas provisionales para asegurar el cobro de la deuda tributaria."
        },
        {
          id: "t4-q18",
          question: "¿Cuándo prescribe el derecho de cobro?",
          options: ["3 años", "4 años desde que es exigible", "5 años", "No prescribe"],
          correctAnswer: 1,
          explanation: "Prescribe a los 4 años desde que la liquidación es ejecutiva."
        },
        {
          id: "t4-q19",
          question: "¿Qué es el concurso de acreedores en recaudación?",
          options: ["Solo civil", "Procedimiento cuando hay múltiples acreedores", "Solo mercantil", "Solo tributario"],
          correctAnswer: 1,
          explanation: "Es el procedimiento cuando concurren varios acreedores sobre el patrimonio del deudor."
        },
        {
          id: "t4-q20",
          question: "¿Cuáles son los privilegios de la Hacienda?",
          options: ["Ninguno", "Privilegio general y especiales sobre ciertos bienes", "Solo especiales", "Solo general"],
          correctAnswer: 1,
          explanation: "La Hacienda tiene privilegio general sobre bienes del deudor y especiales sobre determinados bienes."
        }
      ]
    },
    {
      themeId: "tema-5",
      themeName: "Revisión en Vía Administrativa",
      tests: [
        {
          id: "t5-q1",
          question: "¿Cuáles son los procedimientos de revisión?",
          options: ["Solo recurso", "Recurso de reposición y reclamación económico-administrativa", "Solo reclamación", "Solo alzada"],
          correctAnswer: 1,
          explanation: "Los procedimientos de revisión son el recurso de reposición y la reclamación económico-administrativa."
        },
        {
          id: "t5-q2",
          question: "¿Cuándo se puede interponer recurso de reposición?",
          options: ["Siempre", "Contra actos administrativos en vía de gestión", "Solo sanciones", "Solo liquidaciones"],
          correctAnswer: 1,
          explanation: "Se interpone contra actos de aplicaci��n de los tributos dictados en vía de gestión recaudatoria."
        },
        {
          id: "t5-q3",
          question: "¿Cuál es el plazo para recurso de reposición?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El recurso de reposición debe interponerse en el plazo de un mes."
        },
        {
          id: "t5-q4",
          question: "¿Qué órgano resuelve las reclamaciones económico-administrativas?",
          options: ["Ministro", "Tribunales Económico-Administrativos", "Director General", "Subdirector"],
          correctAnswer: 1,
          explanation: "Las resuelven los Tribunales Económico-Administrativos Regionales y Central."
        },
        {
          id: "t5-q5",
          question: "¿Cuál es el plazo para reclamación económico-administrativa?",
          options: ["15 días", "1 mes", "3 meses", "6 meses"],
          correctAnswer: 1,
          explanation: "Debe interponerse en el plazo de un mes desde la notificación del acto."
        },
        {
          id: "t5-q6",
          question: "¿Qué efectos tiene la interposición de recurso?",
          options: ["Suspende siempre", "Suspende solo si se aporta garantía", "No suspende nunca", "Suspende automáticamente"],
          correctAnswer: 1,
          explanation: "La interposición del recurso no suspende la ejecución, salvo que se aporte garantía."
        },
        {
          id: "t5-q7",
          question: "¿Cuándo se puede solicitar suspensión de ejecución?",
          options: ["Nunca", "Al interponer el recurso aportando garantía", "Solo después", "Solo antes"],
          correctAnswer: 1,
          explanation: "Se puede solicitar al tiempo de interponer el recurso, aportando garantía suficiente."
        },
        {
          id: "t5-q8",
          question: "¿Qué garantías se admiten para suspensión?",
          options: ["Solo dinero", "Aval, depósito, fianza, hipoteca", "Solo avales", "Solo hipotecas"],
          correctAnswer: 1,
          explanation: "Se admiten aval solidario de entidad de crédito, depósito de dinero, fianza personal o hipoteca."
        },
        {
          id: "t5-q9",
          question: "¿Cuándo se considera desistido el recurso?",
          options: ["Nunca", "Por inactividad del recurrente", "Siempre", "Solo con escrito"],
          correctAnswer: 1,
          explanation: "Se considera desistido cuando el recurrente no realiza las actuaciones necesarias."
        },
        {
          id: "t5-q10",
          question: "¿Qué es la reclamación previa a la vía judicial civil?",
          options: ["Recurso", "Requisito para demandar responsabilidad patrimonial", "Solicitud", "Petición"],
          correctAnswer: 1,
          explanation: "Es el requisito previo para ejercitar en vía judicial civil la responsabilidad patrimonial."
        },
        {
          id: "t5-q11",
          question: "¿Cuál es el plazo para resolver recurso de reposición?",
          options: ["15 días", "1 mes", "3 meses", "6 meses"],
          correctAnswer: 1,
          explanation: "Debe resolverse en el plazo de un mes desde su interposición."
        },
        {
          id: "t5-q12",
          question: "¿Qué efectos tiene el silencio en recurso de reposición?",
          options: ["Estimatorio", "Desestimatorio", "Nulo", "Caducidad"],
          correctAnswer: 1,
          explanation: "El silencio administrativo tiene efectos desestimatorios del recurso."
        },
        {
          id: "t5-q13",
          question: "¿Cuándo procede la revocación de oficio?",
          options: ["Siempre", "Cuando el acto sea anulable y cause perjuicio", "Nunca", "Solo si es nulo"],
          correctAnswer: 1,
          explanation: "Procede cuando el acto sea anulable, cause perjuicio al interés público y no sea constitutivo de derechos."
        },
        {
          id: "t5-q14",
          question: "¿Qué es la rectificación de errores?",
          options: ["Recurso", "Corrección de errores materiales o de hecho", "Revisión", "Anulación"],
          correctAnswer: 1,
          explanation: "Es la corrección de errores materiales, de hecho o aritméticos en cualquier momento."
        },
        {
          id: "t5-q15",
          question: "¿Cuándo se puede interponer recurso extraordinario de revisión?",
          options: ["Siempre", "En casos específicos muy graves", "Nunca", "Solo nulidad"],
          correctAnswer: 1,
          explanation: "Solo procede en casos específicos como documentos falsos, sentencias penales, etc."
        },
        {
          id: "t5-q16",
          question: "¿Qué tribunal conoce del recurso contencioso-administrativo?",
          options: ["Supremo", "Juzgados y Tribunales Superiores de Justicia", "Audiencia", "Central"],
          correctAnswer: 1,
          explanation: "Conocen los Juzgados de lo Contencioso-Administrativo y los TSJ según la cuantía."
        },
        {
          id: "t5-q17",
          question: "¿Cuál es el plazo para recurso contencioso-administrativo?",
          options: ["1 mes", "2 meses", "3 meses", "6 meses"],
          correctAnswer: 1,
          explanation: "El plazo es de dos meses desde la notificación del acto o resolución."
        },
        {
          id: "t5-q18",
          question: "¿Qué son las medidas provisionalísimas?",
          options: ["Definitivas", "Urgentes anteriores al recurso", "Solo cautelares", "Solo ejecutivas"],
          correctAnswer: 1,
          explanation: "Son medidas urgentes que se pueden adoptar antes de la interposición del recurso."
        },
        {
          id: "t5-q19",
          question: "¿Cuándo se puede pedir ejecución provisional?",
          options: ["Nunca", "En casos de perjuicio irreparable", "Siempre", "Solo con fianza"],
          correctAnswer: 1,
          explanation: "Se puede pedir cuando la ejecución pudiera hacer perder la finalidad del recurso."
        },
        {
          id: "t5-q20",
          question: "¿Qué efectos tiene la sentencia firme estimatoria?",
          options: ["Solo declarativa", "Obliga a anular el acto y restituir la situación", "Solo económica", "Solo moral"],
          correctAnswer: 1,
          explanation: "La sentencia estimatoria firme obliga a la Administración a anular el acto y restituir la situación jurídica."
        }
      ]
    },
    {
      themeId: "tema-6",
      themeName: "Régimen Jurídico del Sector Público",
      tests: [
        {
          id: "t6-q1",
          question: "¿Qué principios rigen la actuación de las Administraciones Públicas?",
          options: ["Solo legalidad", "Legalidad, eficacia, jerarquía, descentralización", "Solo eficacia", "Solo jerarquía"],
          correctAnswer: 1,
          explanation: "Rigen los principios de legalidad, eficacia, jerarquía, descentralización, desconcentración y coordinación."
        },
        {
          id: "t6-q2",
          question: "¿Qué es la competencia administrativa?",
          options: ["Poder general", "Medida de poder atribuida a un órgano", "Solo funciones", "Capacidad total"],
          correctAnswer: 1,
          explanation: "La competencia es la medida de poder legalmente atribuida a un órgano administrativo."
        },
        {
          id: "t6-q3",
          question: "¿Cuándo es posible la delegación de competencias?",
          options: ["Nunca", "Salvo prohibición legal expresa", "Siempre", "Solo entre iguales"],
          correctAnswer: 1,
          explanation: "Es posible salvo cuando se trate de competencias ejercidas por delegación o prohibidas por norma."
        },
        {
          id: "t6-q4",
          question: "��Qué efectos produce la delegación?",
          options: ["Transfiere competencia", "Los actos se consideran del delegante", "Solo formales", "Anula jerarquía"],
          correctAnswer: 1,
          explanation: "Los actos del delegado se consideran dictados por el órgano delegante."
        },
        {
          id: "t6-q5",
          question: "¿Qué es la avocación de competencias?",
          options: ["Delegación", "Asunción por superior de competencia del inferior", "Solo urgencia", "Transferencia"],
          correctAnswer: 1,
          explanation: "Permite al órgano superior avocar para sí el conocimiento de un asunto de su subordinado."
        },
        {
          id: "t6-q6",
          question: "¿Cuándo es válida una sesión de órgano colegiado?",
          options: ["Con cualquier número", "Con mayoría absoluta de miembros", "Con todos", "Con el presidente"],
          correctAnswer: 1,
          explanation: "Se requiere la asistencia de la mayoría absoluta de sus miembros."
        },
        {
          id: "t6-q7",
          question: "¿Qué mayoría se requiere para adoptar acuerdos?",
          options: ["Unanimidad", "Mayoría simple de presentes", "Dos tercios", "Mayoría absoluta total"],
          correctAnswer: 1,
          explanation: "Los acuerdos se adoptan por mayoría simple de los miembros presentes."
        },
        {
          id: "t6-q8",
          question: "¿Quién puede convocar sesiones extraordinarias?",
          options: ["Solo el presidente", "Presidente o 1/3 de miembros", "Solo secretario", "Cualquier miembro"],
          correctAnswer: 1,
          explanation: "Puede convocarlas el presidente o un tercio de los miembros del órgano."
        },
        {
          id: "t6-q9",
          question: "¿Qué son los convenios de colaboración?",
          options: ["Solo contratos", "Acuerdos para objetivos comunes", "Solo subvenciones", "Solo normas"],
          correctAnswer: 1,
          explanation: "Son acuerdos con efectos jurídicos para la consecución de objetivos comunes."
        },
        {
          id: "t6-q10",
          question: "¿Cuál es el contenido mínimo de un convenio?",
          options: ["Solo objeto", "Sujetos, objeto, vigencia, financiación", "Solo financiación", "Solo vigencia"],
          correctAnswer: 1,
          explanation: "Debe incluir sujetos, objeto, vigencia, financiación y régimen de modificación."
        },
        {
          id: "t6-q11",
          question: "¿Qué es la encomienda de gestión?",
          options: ["Delegación formal", "Encargo de actividades materiales", "Solo contratos", "Transferencia total"],
          correctAnswer: 1,
          explanation: "Es el encargo de actividades de carácter material, técnico o de servicios."
        },
        {
          id: "t6-q12",
          question: "¿Cuándo procede responsabilidad patrimonial?",
          options: ["Solo por culpa", "Por daños que no se tengan deber de soportar", "Solo por dolo", "Nunca"],
          correctAnswer: 1,
          explanation: "Procede por daños que los particulares no tengan el deber jurídico de soportar."
        },
        {
          id: "t6-q13",
          question: "¿Cuál es el plazo para reclamar responsabilidad patrimonial?",
          options: ["6 meses", "1 año", "2 años", "3 años"],
          correctAnswer: 1,
          explanation: "El plazo es de un año desde la producción del hecho o el conocimiento del daño."
        },
        {
          id: "t6-q14",
          question: "¿Qué requisitos debe cumplir el daño indemnizable?",
          options: ["Solo económico", "Efectivo, evaluable económicamente, individualizado", "Solo físico", "Solo moral"],
          correctAnswer: 1,
          explanation: "Debe ser efectivo, evaluable económicamente e individualizado."
        },
        {
          id: "t6-q15",
          question: "¿Cuándo hay relación de causalidad?",
          options: ["Siempre", "Cuando el daño sea consecuencia del funcionamiento", "Nunca", "Solo por culpa"],
          correctAnswer: 1,
          explanation: "Debe existir nexo causal entre el funcionamiento del servicio y el daño producido."
        },
        {
          id: "t6-q16",
          question: "¿Qué es la fuerza mayor?",
          options: ["Caso fortuito", "Evento extraordinario e imprevisible", "Solo natural", "Solo humano"],
          correctAnswer: 1,
          explanation: "Es un evento extraordinario, imprevisible e inevitable que exonera de responsabilidad."
        },
        {
          id: "t6-q17",
          question: "¿Cuándo puede la Administración repetir contra funcionarios?",
          options: ["Siempre", "Por dolo o culpa grave", "Nunca", "Solo por dolo"],
          correctAnswer: 1,
          explanation: "Puede repetir cuando el daño se haya producido por dolo o culpa grave del funcionario."
        },
        {
          id: "t6-q18",
          question: "¿Qué son las relaciones interadministrativas?",
          options: ["Solo conflictos", "Cooperación, colaboración, coordinación", "Solo competencia", "Solo jerarquía"],
          correctAnswer: 1,
          explanation: "Se basan en los principios de cooperación, colaboración y coordinación."
        },
        {
          id: "t6-q19",
          question: "¿Cuándo hay conflicto de competencias?",
          options: ["Siempre", "Cuando dos órganos se atribuyen la misma competencia", "Nunca", "Solo territorial"],
          correctAnswer: 1,
          explanation: "Surge cuando dos órganos se consideran competentes para el mismo asunto."
        },
        {
          id: "t6-q20",
          question: "¿Qué efectos tiene la resolución de conflictos?",
          options: ["Solo declarativos", "Determina el órgano competente", "Solo informativos", "Solo consultivos"],
          correctAnswer: 1,
          explanation: "La resolución determina a qué órgano corresponde el ejercicio de la competencia controvertida."
        }
      ]
    },
    {
      themeId: "tema-7",
      themeName: "Ley 39/2015 de Procedimiento Administrativo Común",
      tests: [
        {
          id: "t7-q1",
          question: "¿Cuál es el ámbito de aplicación de la Ley 39/2015?",
          options: ["Solo AGE", "Sector público en relaciones con particulares", "Solo autonómico", "Solo local"],
          correctAnswer: 1,
          explanation: "Se aplica al sector público en sus relaciones con los particulares."
        },
        {
          id: "t7-q2",
          question: "¿Cuáles son las fases del procedimiento administrativo?",
          options: ["Solo iniciación", "Iniciación, instrucción y terminación", "Solo terminación", "Iniciación y fin"],
          correctAnswer: 1,
          explanation: "El procedimiento comprende las fases de iniciación, instrucción y terminación."
        },
        {
          id: "t7-q3",
          question: "¿Cómo se puede iniciar un procedimiento?",
          options: ["Solo de oficio", "De oficio o a solicitud del interesado", "Solo por solicitud", "Solo por denuncia"],
          correctAnswer: 1,
          explanation: "Los procedimientos se inician de oficio o a solicitud del interesado."
        },
        {
          id: "t7-q4",
          question: "¿Qué debe contener una solicitud?",
          options: ["Solo petición", "Datos del interesado, hechos, petición, lugar y fecha", "Solo firma", "Solo datos"],
          correctAnswer: 1,
          explanation: "Debe contener datos del interesado, hechos, razones y petición, lugar, fecha y firma."
        },
        {
          id: "t7-q5",
          question: "¿Cuándo se puede subsanar una solicitud?",
          options: ["Nunca", "Cuando tenga defectos subsanables", "Siempre", "Solo una vez"],
          correctAnswer: 1,
          explanation: "Se puede requerir subsanación cuando no reúna los requisitos o no se acompañen documentos."
        },
        {
          id: "t7-q6",
          question: "¿Cuál es el plazo para subsanar?",
          options: ["5 d��as", "10 días", "15 días", "1 mes"],
          correctAnswer: 1,
          explanation: "El plazo para subsanar es de 10 días desde la notificación del requerimiento."
        },
        {
          id: "t7-q7",
          question: "¿Qué comprende la fase de instrucción?",
          options: ["Solo alegaciones", "Pruebas, informes, audiencia", "Solo informes", "Solo pruebas"],
          correctAnswer: 1,
          explanation: "Comprende la práctica de pruebas, emisión de informes y trámite de audiencia."
        },
        {
          id: "t7-q8",
          question: "¿Cuándo es obligatorio el trámite de audiencia?",
          options: ["Siempre", "Cuando aparezcan hechos distintos a los alegados", "Nunca", "Solo en sanciones"],
          correctAnswer: 1,
          explanation: "Es obligatorio cuando aparezcan hechos distintos a los alegados por el interesado."
        },
        {
          id: "t7-q9",
          question: "¿Cuál es el plazo para resolver?",
          options: ["3 meses", "6 meses salvo norma especial", "1 año", "No hay plazo"],
          correctAnswer: 1,
          explanation: "El plazo máximo es de 6 meses, salvo que una disposición establezca otro distinto."
        },
        {
          id: "t7-q10",
          question: "¿Qué efectos tiene el silencio administrativo?",
          options: ["Siempre positivo", "Positivo salvo casos específicos", "Siempre negativo", "No tiene efectos"],
          correctAnswer: 1,
          explanation: "Los actos presuntos tendrán efecto estimatorio salvo casos específicos."
        },
        {
          id: "t7-q11",
          question: "¿Cuándo se produce la caducidad?",
          options: ["Por tiempo", "Por paralización imputable al interesado", "Automáticamente", "Por desistimiento"],
          correctAnswer: 1,
          explanation: "Se produce por paralización del procedimiento por causa imputable al interesado."
        },
        {
          id: "t7-q12",
          question: "¿Qué es la terminación convencional?",
          options: ["Solo acuerdos", "Pactos, acuerdos o convenios", "Solo desistimiento", "Solo renuncia"],
          correctAnswer: 1,
          explanation: "La terminación puede producirse por acuerdo entre la Administración y los interesados."
        },
        {
          id: "t7-q13",
          question: "¿Cuándo es nulo de pleno derecho un acto?",
          options: ["Nunca", "Por vulnerar derechos fundamentales", "Siempre", "Solo por forma"],
          correctAnswer: 1,
          explanation: "Son nulos los actos que vulneren derechos fundamentales, carezcan de competencia, etc."
        },
        {
          id: "t7-q14",
          question: "¿Qué diferencia hay entre nulidad y anulabilidad?",
          options: ["Ninguna", "Los nulos no producen efectos, los anulables sí hasta anulación", "Solo terminología", "Solo procedimiento"],
          correctAnswer: 1,
          explanation: "Los actos nulos no producen efectos, los anulables sí hasta que se declara su nulidad."
        },
        {
          id: "t7-q15",
          question: "¿Cuál es el plazo para recurso de alzada?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El recurso de alzada debe interponerse en el plazo de un mes."
        },
        {
          id: "t7-q16",
          question: "¿Qué órgano resuelve el recurso de alzada?",
          options: ["El mismo", "El superior jerárquico", "Un tribunal", "El ministro"],
          correctAnswer: 1,
          explanation: "Lo resuelve el superior jerárquico del órgano que dictó el acto."
        },
        {
          id: "t7-q17",
          question: "¿Cuándo procede la revocación de actos?",
          options: ["Siempre", "Cuando sean desfavorables o favorables ilegales", "Nunca", "Solo anulables"],
          correctAnswer: 1,
          explanation: "Procede para actos desfavorables o favorables que sean ilegales."
        },
        {
          id: "t7-q18",
          question: "¿Qué es la rectificación de errores?",
          options: ["Anulación", "Corrección de errores materiales", "Revocación", "Modificación"],
          correctAnswer: 1,
          explanation: "Es la corrección de errores materiales, de hecho o aritméticos."
        },
        {
          id: "t7-q19",
          question: "¿Cuándo prescriben las infracciones administrativas?",
          options: ["1 año", "3 años", "5 años", "No prescriben"],
          correctAnswer: 1,
          explanation: "Las infracciones prescriben a los tres años."
        },
        {
          id: "t7-q20",
          question: "¿Qué garantías tiene el procedimiento sancionador?",
          options: ["Ninguna especial", "Presunción de inocencia, audiencia, non bis in idem", "Solo audiencia", "Solo proporción"],
          correctAnswer: 1,
          explanation: "Se aplican las garantías de presunción de inocencia, audiencia al interesado y non bis in idem."
        }
      ]
    },
    {
      themeId: "tema-8",
      themeName: "Función Pública y Estatuto del Empleado Público",
      tests: [
        {
          id: "t8-q1",
          question: "¿Qué regula el Estatuto Básico del Empleado Público?",
          options: ["Solo funcionarios", "Fundamentos del empleo público", "Solo laborales", "Solo directivos"],
          correctAnswer: 1,
          explanation: "Regula los fundamentos de la ordenación de los recursos humanos al servicio de las Administraciones Públicas."
        },
        {
          id: "t8-q2",
          question: "¿Cuáles son los principios de acceso al empleo público?",
          options: ["Solo mérito", "Igualdad, mérito, capacidad y publicidad", "Solo igualdad", "Solo capacidad"],
          correctAnswer: 1,
          explanation: "Los principios rectores son igualdad, mérito, capacidad y publicidad."
        },
        {
          id: "t8-q3",
          question: "¿Qué tipos de personal público existen?",
          options: ["Solo funcionarios", "Funcionarios, laborales, eventual y directivo", "Solo laborales", "Solo directivo"],
          correctAnswer: 1,
          explanation: "El personal se clasifica en funcionarios de carrera, interinos, laborales y eventual."
        },
        {
          id: "t8-q4",
          question: "¿Cuáles son los sistemas de selección?",
          options: ["Solo oposición", "Oposición, concurso-oposición y concurso", "Solo concurso", "Solo entrevista"],
          correctAnswer: 1,
          explanation: "Los sistemas selectivos son oposición, concurso-oposición y excepcionalmente concurso."
        },
        {
          id: "t8-q5",
          question: "¿Qué es la carrera profesional?",
          options: ["Solo ascensos", "Progresión en grados, categorías o escalas", "Solo antigüedad", "Solo méritos"],
          correctAnswer: 1,
          explanation: "Es el conjunto ordenado de oportunidades de ascenso y expectativas de progreso profesional."
        },
        {
          id: "t8-q6",
          question: "¿Cuáles son los grupos de clasificación profesional?",
          options: ["A, B, C, D", "A1, A2, B, C1, C2", "I, II, III", "Superior, medio, básico"],
          correctAnswer: 1,
          explanation: "Los grupos son A1, A2 (grupo A), B, C1, C2 (grupo C) según la titulación exigida."
        },
        {
          id: "t8-q7",
          question: "¿Cuáles son las situaciones administrativas básicas?",
          options: ["Solo activo", "Servicio activo, servicios especiales, excedencia, suspensión", "Solo excedencia", "Solo suspensión"],
          correctAnswer: 1,
          explanation: "Las situaciones son servicio activo, servicios especiales, servicios en otras administraciones, excedencia y suspensión."
        },
        {
          id: "t8-q8",
          question: "¿Qué derechos tienen los empleados públicos?",
          options: ["Solo retribución", "Inamovilidad, carrera, formación, participación", "Solo formación", "Solo participación"],
          correctAnswer: 1,
          explanation: "Tienen derechos a inamovilidad, carrera profesional, formación, participación y protección social."
        },
        {
          id: "t8-q9",
          question: "¿Cuáles son los deberes básicos?",
          options: ["Solo obediencia", "Cumplir funciones, guardar secreto, tratar correctamente", "Solo secreto", "Solo puntualidad"],
          correctAnswer: 1,
          explanation: "Incluyen cumplir las funciones, guardar secreto, tratar con corrección al público y mantener formación."
        },
        {
          id: "t8-q10",
          question: "¿Qué es la evaluación del desempeño?",
          options: ["Solo exámenes", "Procedimiento para valorar conducta y rendimiento", "Solo informes", "Solo estadísticas"],
          correctAnswer: 1,
          explanation: "Es el procedimiento mediante el cual se mide y valora la conducta profesional y el rendimiento."
        },
        {
          id: "t8-q11",
          question: "¿Cuáles son los tipos de faltas disciplinarias?",
          options: ["Solo graves", "Muy graves, graves y leves", "Solo leves", "Solo muy graves"],
          correctAnswer: 1,
          explanation: "Las faltas se clasifican en muy graves, graves y leves según su entidad y circunstancias."
        },
        {
          id: "t8-q12",
          question: "¿Cuándo prescribe una falta disciplinaria grave?",
          options: ["6 meses", "2 años", "3 años", "5 años"],
          correctAnswer: 1,
          explanation: "Las faltas graves prescriben a los dos años desde que la Administración tuvo conocimiento."
        },
        {
          id: "t8-q13",
          question: "¿Qué sanciones se pueden imponer?",
          options: ["Solo apercibimiento", "Separación, suspensión, traslado forzoso, apercibimiento", "Solo suspensión", "Solo separación"],
          correctAnswer: 1,
          explanation: "Las sanciones van desde apercibimiento hasta separación del servicio según la gravedad."
        },
        {
          id: "t8-q14",
          question: "¿Qué es la incompatibilidad del empleado público?",
          options: ["Solo ética", "Prohibición de actividad privada incompatible", "Solo horaria", "Solo económica"],
          correctAnswer: 1,
          explanation: "El ejercicio de función pública es incompatible con cualquier actividad privada, salvo excepciones."
        },
        {
          id: "t8-q15",
          question: "¿Cuándo se puede autorizar compatibilidad?",
          options: ["Siempre", "Para actividades privadas que no comprometan imparcialidad", "Nunca", "Solo docencia"],
          correctAnswer: 1,
          explanation: "Se puede autorizar para actividades que no comprometan la imparcialidad o independencia."
        },
        {
          id: "t8-q16",
          question: "¿Qué es la jubilación forzosa?",
          options: ["Voluntaria", "Cese al cumplir edad reglamentaria", "Por incapacidad", "Por sanción"],
          correctAnswer: 1,
          explanation: "Es el cese en el servicio al cumplir la edad de jubilación forzosa establecida."
        },
        {
          id: "t8-q17",
          question: "¿Qué órganos representan al personal funcionario?",
          options: ["Solo sindicatos", "Juntas de Personal y Delegados", "Solo comités", "Solo delegados"],
          correctAnswer: 1,
          explanation: "La representación se ejerce a través de Juntas de Personal y Delegados de Personal."
        },
        {
          id: "t8-q18",
          question: "¿Qué es la mesa de negociación?",
          options: ["Solo información", "Órgano de negociación colectiva", "Solo consulta", "Solo conflictos"],
          correctAnswer: 1,
          explanation: "Es el órgano a través del cual se canaliza la negociación colectiva del personal funcionario."
        },
        {
          id: "t8-q19",
          question: "¿Cuándo se puede declarar la excedencia voluntaria?",
          options: ["Solo enfermedad", "Por interés particular cumpliendo requisitos", "Solo familia", "Solo estudios"],
          correctAnswer: 1,
          explanation: "Se puede declarar por interés particular cuando se cumplan los requisitos de tiempo de servicio."
        },
        {
          id: "t8-q20",
          question: "¿Qué efectos tiene la excedencia voluntaria?",
          options: ["Mantiene sueldo", "Sin derecho a retribución ni reserva de puesto", "Solo reduce sueldo", "Mantiene todo"],
          correctAnswer: 1,
          explanation: "No da derecho a retribución ni a la reserva del puesto de trabajo."
        }
      ]
    },
    {
      themeId: "tema-9",
      themeName: "Organización de la AEAT",
      tests: [
        {
          id: "t9-q1",
          question: "¿Qué es la AEAT?",
          options: ["Ministerio", "Organismo autónomo", "Empresa pública", "Fundación"],
          correctAnswer: 1,
          explanation: "La Agencia Estatal de Administración Tributaria es un organismo autónomo."
        },
        {
          id: "t9-q2",
          question: "¿De qué ministerio depende la AEAT?",
          options: ["Justicia", "Hacienda y Función Pública", "Interior", "Presidencia"],
          correctAnswer: 1,
          explanation: "La AEAT está adscrita al Ministerio de Hacienda y Función Pública."
        },
        {
          id: "t9-q3",
          question: "¿Cuáles son las funciones principales de la AEAT?",
          options: ["Solo recaudar", "Gestión, inspección, recaudación y aduanas", "Solo inspeccionar", "Solo aduanas"],
          correctAnswer: 1,
          explanation: "Sus funciones son la gestión, inspección y recaudación de tributos, y la gestión aduanera."
        },
        {
          id: "t9-q4",
          question: "¿Quién dirige la AEAT?",
          options: ["Un ministro", "Director General", "Un consejo", "Un presidente"],
          correctAnswer: 1,
          explanation: "La AEAT está dirigida por un Director General."
        },
        {
          id: "t9-q5",
          question: "¿Cómo se estructura territorialmente la AEAT?",
          options: ["Solo central", "Delegaciones y administraciones", "Solo delegaciones", "Solo administraciones"],
          correctAnswer: 1,
          explanation: "Se estructura en Delegaciones Especiales y Delegaciones, con Administraciones dependientes."
        },
        {
          id: "t9-q6",
          question: "¿Qué son las Delegaciones Especiales?",
          options: ["Todas iguales", "Órganos territoriales de Madrid, Cataluña y País Vasco", "Solo Madrid", "Solo autónomas"],
          correctAnswer: 1,
          explanation: "Son órganos territoriales específicos para Madrid, Cataluña y País Vasco."
        },
        {
          id: "t9-q7",
          question: "¿Qué competencias tienen las Administraciones de la AEAT?",
          options: ["Solo información", "Gestión, recaudación e inspección en su ámbito", "Solo recaudación", "Solo gestión"],
          correctAnswer: 1,
          explanation: "Ejercen las competencias de gestión, recaudación e inspección en su ámbito territorial."
        },
        {
          id: "t9-q8",
          question: "¿Qué es el Departamento de Aduanas e II.EE.?",
          options: ["Solo aduanas", "Órgano de gestión aduanera e impuestos especiales", "Solo impuestos", "Solo comercio"],
          correctAnswer: 1,
          explanation: "Es el órgano directivo responsable de la gestión aduanera e impuestos especiales."
        },
        {
          id: "t9-q9",
          question: "¿Cuáles son los órganos centrales de la AEAT?",
          options: ["Solo dirección", "Departamentos, subdirecciones y servicios", "Solo departamentos", "Solo servicios"],
          correctAnswer: 1,
          explanation: "Los órganos centrales son departamentos, subdirecciones generales y servicios."
        },
        {
          id: "t9-q10",
          question: "¿Qué función tiene el Departamento de Gestión Tributaria?",
          options: ["Solo liquidar", "Aplicación de tributos y procedimientos", "Solo informar", "Solo sancionar"],
          correctAnswer: 1,
          explanation: "Se encarga de la aplicación de los tributos y la gestión de procedimientos tributarios."
        },
        {
          id: "t9-q11",
          question: "¿Cómo se organiza la inspección en la AEAT?",
          options: ["Solo central", "Equipos de inspección en distintos niveles", "Solo regional", "Solo local"],
          correctAnswer: 1,
          explanation: "Se organiza en equipos de inspección a nivel central, regional y local."
        },
        {
          id: "t9-q12",
          question: "¿Qué es el Departamento de Recaudación?",
          options: ["Solo cobros", "Órgano responsable de recaudación ejecutiva", "Solo voluntaria", "Solo apremios"],
          correctAnswer: 1,
          explanation: "Es el órgano directivo responsable de la gestión recaudatoria en vía ejecutiva."
        },
        {
          id: "t9-q13",
          question: "¿Quién nombra al Director General de la AEAT?",
          options: ["El Rey", "El Consejo de Ministros", "El Ministro", "El Congreso"],
          correctAnswer: 1,
          explanation: "Es nombrado por el Consejo de Ministros a propuesta del Ministro de Hacienda."
        },
        {
          id: "t9-q14",
          question: "¿Qué son las Unidades de Valoración?",
          options: ["Solo tasaciones", "Órganos especializados en valoración de bienes", "Solo inmuebles", "Solo empresas"],
          correctAnswer: 1,
          explanation: "Son unidades especializadas en la valoración de bienes y derechos para fines tributarios."
        },
        {
          id: "t9-q15",
          question: "¿Cómo se estructura la atención al contribuyente?",
          options: ["Solo presencial", "Múltiples canales: presencial, telefónico, electrónico", "Solo teléfono", "Solo internet"],
          correctAnswer: 1,
          explanation: "Se estructura en múltiples canales: atención presencial, telefónica y electrónica."
        },
        {
          id: "t9-q16",
          question: "¿Qué es el Plan de Control Tributario?",
          options: ["Solo inspección", "Programa anual de actuaciones de control", "Solo gestión", "Solo recaudación"],
          correctAnswer: 1,
          explanation: "Es el programa anual que establece los objetivos y directrices de las actuaciones de control."
        },
        {
          id: "t9-q17",
          question: "¿Quién aprueba el Plan de Control Tributario?",
          options: ["Las Cortes", "El Consejo de Ministros", "El Ministro", "El Director General"],
          correctAnswer: 1,
          explanation: "Es aprobado por el Consejo de Ministros a propuesta del Ministro de Hacienda."
        },
        {
          id: "t9-q18",
          question: "¿Qué son las Dependencias Regionales de Aduanas?",
          options: ["Solo fronteras", "Órganos de gestión aduanera regional", "Solo puertos", "Solo aeropuertos"],
          correctAnswer: 1,
          explanation: "Son órganos territoriales responsables de la gestión aduanera en su ámbito regional."
        },
        {
          id: "t9-q19",
          question: "¿Cómo se coordina la AEAT con otras administraciones?",
          options: ["No se coordina", "Mediante convenios y protocolos de colaboración", "Solo información", "Solo estadísticas"],
          correctAnswer: 1,
          explanation: "Se coordina mediante convenios de colaboración y protocolos de intercambio de información."
        },
        {
          id: "t9-q20",
          question: "¿Qué papel juegan las nuevas tecnologías en la AEAT?",
          options: ["Ninguno", "Fundamental para modernización y eficiencia", "Solo informativo", "Solo estadístico"],
          correctAnswer: 1,
          explanation: "Las TIC son fundamentales para la modernización, eficiencia y mejora de servicios de la AEAT."
        }
      ]
    },
    {
      themeId: "tema-10",
      themeName: "Derechos y Garantías de los Contribuyentes",
      tests: [
        {
          id: "t10-q1",
          question: "¿Cuáles son los derechos básicos de los contribuyentes?",
          options: ["Solo pagar", "Información, asistencia, defensa, intimidad", "Solo defensa", "Solo intimidad"],
          correctAnswer: 1,
          explanation: "Los contribuyentes tienen derechos a información, asistencia, defensa y respeto a la intimidad."
        },
        {
          id: "t10-q2",
          question: "¿Qué es el derecho a la información tributaria?",
          options: ["Solo normativa", "Conocer normativa, procedimientos y criterios", "Solo procedimientos", "Solo criterios"],
          correctAnswer: 1,
          explanation: "Incluye el derecho a conocer la normativa, procedimientos y criterios de actuación."
        },
        {
          id: "t10-q3",
          question: "¿En qué idiomas se puede atender al contribuyente?",
          options: ["Solo castellano", "Castellano y lenguas cooficiales en su territorio", "Solo local", "Cualquier idioma"],
          correctAnswer: 1,
          explanation: "Se puede atender en castellano y en las lenguas que sean cooficiales en el territorio."
        },
        {
          id: "t10-q4",
          question: "¿Qué es el derecho de representación?",
          options: ["Solo abogados", "Actuar por medio de representante", "Solo procuradores", "Solo familiares"],
          correctAnswer: 1,
          explanation: "Es el derecho a actuar por medio de representante debidamente acreditado."
        },
        {
          id: "t10-q5",
          question: "¿Cuándo se debe guardar el secreto tributario?",
          options: ["Nunca", "Siempre, salvo excepciones legales", "Solo datos personales", "Solo empresas"],
          correctAnswer: 1,
          explanation: "Los datos tributarios son confidenciales, salvo las excepciones previstas en la ley."
        },
        {
          id: "t10-q6",
          question: "¿Quién puede acceder a los datos tributarios?",
          options: ["Cualquiera", "El interesado y quien tenga autorización", "Solo familia", "Solo abogados"],
          correctAnswer: 1,
          explanation: "Solo pueden acceder el propio interesado y quienes tengan autorización legal o del interesado."
        },
        {
          id: "t10-q7",
          question: "¿Qué es el derecho al mantenimiento de la unidad familiar?",
          options: ["Solo convivencia", "Tributación conjunta en IRPF", "Solo matrimonios", "Solo con hijos"],
          correctAnswer: 1,
          explanation: "Permite la opción de tributación conjunta en el IRPF para las unidades familiares."
        },
        {
          id: "t10-q8",
          question: "¿Cuál es el horario de atención al público?",
          options: ["Solo mañanas", "Establecido por cada administración", "24 horas", "Solo tardes"],
          correctAnswer: 1,
          explanation: "Cada administración establece su horario de atención dentro de los límites legales."
        },
        {
          id: "t10-q9",
          question: "¿Qué medios de pago se pueden utilizar?",
          options: ["Solo efectivo", "Efectivo, transferencia, tarjeta, otros medios", "Solo transferencia", "Solo tarjeta"],
          correctAnswer: 1,
          explanation: "Se admiten diversos medios: efectivo, transferencia, tarjeta y otros medios autorizados."
        },
        {
          id: "t10-q10",
          question: "¿Cuándo se puede solicitar certificación?",
          options: ["Nunca", "Cuando se solicite por el interesado", "Solo para terceros", "Solo oficial"],
          correctAnswer: 1,
          explanation: "Los interesados pueden solicitar certificación de sus datos tributarios."
        },
        {
          id: "t10-q11",
          question: "¿Qué es el derecho a conocer el estado de tramitación?",
          options: ["Solo al final", "Conocer en qué fase está el procedimiento", "Solo si hay problemas", "Solo por escrito"],
          correctAnswer: 1,
          explanation: "Los interesados pueden conocer en cualquier momento el estado de tramitación de sus expedientes."
        },
        {
          id: "t10-q12",
          question: "¿Cuándo se debe motivar una resolución?",
          options: ["Nunca", "Siempre, especialmente si es desfavorable", "Solo si es favorable", "Solo en recursos"],
          correctAnswer: 1,
          explanation: "Las resoluciones deben ser motivadas, especialmente las que limiten derechos o sean desfavorables."
        },
        {
          id: "t10-q13",
          question: "¿Qué es el derecho de audiencia?",
          options: ["Solo oral", "Conocer expediente y formular alegaciones", "Solo escrito", "Solo testigos"],
          correctAnswer: 1,
          explanation: "Es el derecho a conocer el contenido del expediente y formular alegaciones."
        },
        {
          id: "t10-q14",
          question: "¿Cuándo procede indemnización por funcionamiento anormal?",
          options: ["Siempre", "Cuando cause daños no soportables", "Nunca", "Solo por culpa"],
          correctAnswer: 1,
          explanation: "Procede cuando el funcionamiento cause daños que no se tengan el deber jurídico de soportar."
        },
        {
          id: "t10-q15",
          question: "¿Qué son los derechos de información previa?",
          options: ["Solo consultas", "Conocer consecuencias antes de actuar", "Solo normativa", "Solo criterios"],
          correctAnswer: 1,
          explanation: "Permiten conocer las consecuencias tributarias de las actuaciones antes de realizarlas."
        },
        {
          id: "t10-q16",
          question: "¿Cuándo se puede obtener copia de documentos?",
          options: ["Nunca", "Cuando formen parte del expediente", "Solo originales", "Solo resúmenes"],
          correctAnswer: 1,
          explanation: "Se puede obtener copia de los documentos que formen parte del expediente administrativo."
        },
        {
          id: "t10-q17",
          question: "¿Qué es el derecho a utilizar las lenguas oficiales?",
          options: ["Solo castellano", "Usar cualquier lengua oficial del territorio", "Solo catalán", "Solo euskera"],
          correctAnswer: 1,
          explanation: "Los ciudadanos pueden dirigirse a la Administración en cualquier lengua oficial de su territorio."
        },
        {
          id: "t10-q18",
          question: "¿Cuándo se puede rectificar datos personales?",
          options: ["Solo si hay error", "Cuando sean inexactos o incompletos", "Solo una vez", "Nunca"],
          correctAnswer: 1,
          explanation: "Se puede solicitar rectificación cuando los datos sean inexactos, incompletos o no actualizados."
        },
        {
          id: "t10-q19",
          question: "¿Qué garantías existen en la inspección?",
          options: ["Ninguna", "Identificación, información de derechos, acta", "Solo identificación", "Solo acta"],
          correctAnswer: 1,
          explanation: "Los inspectores deben identificarse, informar de derechos y levantar acta de actuaciones."
        },
        {
          id: "t10-q20",
          question: "¿Cuándo se vulnera el derecho a la intimidad?",
          options: ["Nunca", "Cuando se accede sin autorización a datos privados", "Solo empresas", "Solo particulares"],
          correctAnswer: 1,
          explanation: "Se vulnera cuando se accede sin autorización legal a datos de carácter personal o reservado."
        }
      ]
    },
    {
      themeId: "tema-11",
      themeName: "Régimen Sancionador en Materia Tributaria",
      tests: [
        {
          id: "t11-q1",
          question: "¿Cuáles son los principios del régimen sancionador?",
          options: ["Solo legalidad", "Legalidad, tipicidad, responsabilidad, proporcionalidad", "Solo tipicidad", "Solo proporcionalidad"],
          correctAnswer: 1,
          explanation: "Rigen los principios de legalidad, tipicidad, responsabilidad y proporcionalidad."
        },
        {
          id: "t11-q2",
          question: "¿Qué es el principio de culpabilidad?",
          options: ["Responsabilidad objetiva", "No hay sanción sin dolo o culpa", "Solo dolo", "Solo negligencia"],
          correctAnswer: 1,
          explanation: "No puede imponerse sanción sin que medie dolo, culpa o negligencia."
        },
        {
          id: "t11-q3",
          question: "¿Cuándo se aplica el principio non bis in idem?",
          options: ["Nunca", "Identidad de sujeto, hecho y fundamento", "Solo mismo sujeto", "Solo mismo hecho"],
          correctAnswer: 1,
          explanation: "Se aplica cuando hay identidad de sujeto, hecho y fundamento jurídico."
        },
        {
          id: "t11-q4",
          question: "¿Qué son las circunstancias modificativas de responsabilidad?",
          options: ["Solo agravantes", "Agravantes y atenuantes", "Solo atenuantes", "No existen"],
          correctAnswer: 1,
          explanation: "Son circunstancias que agravan o atenúan la responsabilidad por infracciones."
        },
        {
          id: "t11-q5",
          question: "¿Cuál es el efecto de la reincidencia?",
          options: ["Ninguno", "Agrava la sanción", "La atenúa", "Solo informa"],
          correctAnswer: 1,
          explanation: "La reincidencia es una circunstancia agravante que incrementa la sanción."
        },
        {
          id: "t11-q6",
          question: "¿Qu�� es la colaboración con la Administración?",
          options: ["Obligación", "Circunstancia atenuante", "Solo información", "Deber legal"],
          correctAnswer: 1,
          explanation: "La colaboración activa con la Administración es una circunstancia atenuante."
        },
        {
          id: "t11-q7",
          question: "¿Cuándo hay error invencible de hecho?",
          options: ["Siempre", "Cuando el error no sea superable con diligencia", "Nunca", "Solo por ignorancia"],
          correctAnswer: 1,
          explanation: "Existe cuando el error de hecho no sea superable mediante el empleo de la diligencia ordinaria."
        },
        {
          id: "t11-q8",
          question: "¿Qué es la graduación de sanciones?",
          options: ["Cantidad fija", "Determinación entre mínimo y máximo", "Solo mínimo", "Solo máximo"],
          correctAnswer: 1,
          explanation: "Es la determinación de la sanción concreta dentro de los límites legal establecidos."
        },
        {
          id: "t11-q9",
          question: "¿Cuáles son los criterios de graduación?",
          options: ["Solo cuantía", "Cuantía, transcendencia, beneficios, reincidencia", "Solo reincidencia", "Solo beneficios"],
          correctAnswer: 1,
          explanation: "Se consideran la cuantía defraudada, transcendencia, beneficios obtenidos y reincidencia."
        },
        {
          id: "t11-q10",
          question: "¿Qué efectos tiene la declaración de nulidad?",
          options: ["Ninguno", "Extinción de responsabilidad administrativa", "Solo modifica", "Solo reduce"],
          correctAnswer: 1,
          explanation: "La declaración de nulidad de la infracción extingue la responsabilidad administrativa."
        },
        {
          id: "t11-q11",
          question: "¿Cuándo se puede suspender el procedimiento sancionador?",
          options: ["Nunca", "Cuando haya indicios de delito", "Siempre", "Solo con recurso"],
          correctAnswer: 1,
          explanation: "Se suspende cuando existan indicios de que la infracción pueda constituir delito."
        },
        {
          id: "t11-q12",
          question: "¿Qué es la responsabilidad solidaria en sanciones?",
          options: ["Individual", "Varios obligados responden de la sanción", "Solo principal", "Solo subsidiaria"],
          correctAnswer: 1,
          explanation: "Varios obligados pueden ser declarados responsables solidarios de la sanción."
        },
        {
          id: "t11-q13",
          question: "¿Cuándo procede la responsabilidad subsidiaria en sanciones?",
          options: ["Siempre", "Cuando no se pueda exigir del responsable principal", "Nunca", "Solo con garantía"],
          correctAnswer: 1,
          explanation: "Procede cuando no se pueda hacer efectiva la sanción del responsable principal."
        },
        {
          id: "t11-q14",
          question: "¿Qué garantías se exigen para suspender ejecución de sanciones?",
          options: ["Ninguna", "Aval, depósito o garantía equivalente", "Solo palabra", "Solo promesa"],
          correctAnswer: 1,
          explanation: "Se requiere aval solidario, depósito de dinero o garantía equivalente."
        },
        {
          id: "t11-q15",
          question: "¿Cuál es el plazo para ejecutar una sanción?",
          options: ["Inmediato", "Según el tipo de sanción", "1 año", "5 años"],
          correctAnswer: 1,
          explanation: "El plazo de ejecución depende del tipo de sanción y puede variar."
        },
        {
          id: "t11-q16",
          question: "¿Qué es la prescripción de la ejecutoria?",
          options: ["De la infracción", "Del derecho a ejecutar la sanción firme", "Del procedimiento", "De la denuncia"],
          correctAnswer: 1,
          explanation: "Es la extinción del derecho a ejecutar una sanción ya firme por el transcurso del tiempo."
        },
        {
          id: "t11-q17",
          question: "¿Cuándo hay concurso de infracciones?",
          options: ["Una sola infracción", "Varios hechos constitutivos de infracción", "Solo reincidencia", "Solo continuada"],
          correctAnswer: 1,
          explanation: "Se produce cuando una persona realiza varios hechos constitutivos de infracción."
        },
        {
          id: "t11-q18",
          question: "¿Qué es la infracción continuada?",
          options: ["Varias infracciones", "Una infracción con varios actos", "Solo tributaria", "Solo administrativa"],
          correctAnswer: 1,
          explanation: "Es una infracción única integrada por varios actos parciales."
        },
        {
          id: "t11-q19",
          question: "¿Cuándo se puede aplicar el régimen simplificado de sanciones?",
          options: ["Siempre", "En infracciones leves con criterios objetivos", "Nunca", "Solo graves"],
          correctAnswer: 1,
          explanation: "Se aplica a infracciones leves cuando se puedan aplicar criterios objetivos de graduación."
        },
        {
          id: "t11-q20",
          question: "¿Qué efectos tiene la muerte del presunto responsable?",
          options: ["Continúa el procedimiento", "Extinción de la responsabilidad", "Traslado a herederos", "Suspensión temporal"],
          correctAnswer: 1,
          explanation: "La muerte del presunto responsable extingue la responsabilidad por infracciones administrativas."
        }
      ]
    },
    {
      themeId: "tema-12",
      themeName: "Procedimientos Especiales en Materia Tributaria",
      tests: [
        {
          id: "t12-q1",
          question: "¿Qué son los procedimientos especiales?",
          options: ["Procedimientos normales", "Procedimientos con especialidades", "Solo urgentes", "Solo complejos"],
          correctAnswer: 1,
          explanation: "Son procedimientos que presentan especialidades respecto al régimen general."
        },
        {
          id: "t12-q2",
          question: "¿Cuándo se aplica el procedimiento de gestión censal?",
          options: ["Solo empresas", "Altas, bajas y modificaciones en censos", "Solo autónomos", "Solo declaraciones"],
          correctAnswer: 1,
          explanation: "Se aplica para altas, bajas y modificaciones de datos en los censos tributarios."
        },
        {
          id: "t12-q3",
          question: "¿Qué es la gestión catastral?",
          options: ["Solo valoraciones", "Formación y mantenimiento del catastro", "Solo urbano", "Solo rústico"],
          correctAnswer: 1,
          explanation: "Comprende la formación, mantenimiento y actualización del catastro inmobiliario."
        },
        {
          id: "t12-q4",
          question: "¿Cuál es el plazo para alegaciones en gestión catastral?",
          options: ["15 días", "1 mes", "2 meses", "3 meses"],
          correctAnswer: 1,
          explanation: "El plazo para formular alegaciones es de un mes desde la notificación."
        },
        {
          id: "t12-q5",
          question: "¿Qué son los procedimientos de valoración?",
          options: ["Solo tasaciones", "Determinación del valor de bienes y derechos", "Solo inmuebles", "Solo empresas"],
          correctAnswer: 1,
          explanation: "Tienen por objeto determinar el valor de bienes y derechos para efectos tributarios."
        },
        {
          id: "t12-q6",
          question: "¿Cuándo procede la comprobación limitada?",
          options: ["Siempre", "Para verificar datos específicos", "Solo empresas", "Solo particulares"],
          correctAnswer: 1,
          explanation: "Procede para la verificación de datos específicos de la declaración."
        },
        {
          id: "t12-q7",
          question: "¿Qué es el procedimiento de estimación indirecta?",
          options: ["Solo directo", "Determinación de base cuando no se conoce", "Solo objetivo", "Solo simple"],
          correctAnswer: 1,
          explanation: "Se aplica cuando no se puede conocer o comprobar la base imponible."
        },
        {
          id: "t12-q8",
          question: "¿Cuáles son los signos, índices o módulos?",
          options: ["Solo externos", "Elementos para determinar la base indirectamente", "Solo internos", "Solo físicos"],
          correctAnswer: 1,
          explanation: "Son elementos utilizados para determinar la base imponible por estimación indirecta."
        },
        {
          id: "t12-q9",
          question: "¿Qué garantías tiene el obligado en estimación indirecta?",
          options: ["Ninguna", "Audiencia, alegaciones, prueba", "Solo audiencia", "Solo alegaciones"],
          correctAnswer: 1,
          explanation: "Tiene derecho a audiencia, presentar alegaciones y proponer pruebas."
        },
        {
          id: "t12-q10",
          question: "¿Cuándo se puede aplicar el método del conjunto de signos?",
          options: ["Siempre", "Cuando ningún signo aislado sea suficiente", "Solo empresas", "Solo particulares"],
          correctAnswer: 1,
          explanation: "Se aplica cuando ningún signo, índice o módulo aislado permita la estimación."
        },
        {
          id: "t12-q11",
          question: "¿Qué es la base de datos de valores?",
          options: ["Solo catastro", "Sistema de información sobre valores inmobiliarios", "Solo precios", "Solo tasaciones"],
          correctAnswer: 1,
          explanation: "Es un sistema de información sobre valores de bienes inmuebles."
        },
        {
          id: "t12-q12",
          question: "¿Cuándo procede revisión de valores catastrales?",
          options: ["Cada año", "Cuando cambien circunstancias", "Nunca", "Solo por error"],
          correctAnswer: 1,
          explanation: "Procede cuando cambien las circunstancias que determinaron la valoración."
        },
        {
          id: "t12-q13",
          question: "¿Qué es la ponencia de valores?",
          options: ["Solo documento", "Estudio técnico para valoración catastral", "Solo informe", "Solo propuesta"],
          correctAnswer: 1,
          explanation: "Es el estudio técnico que justifica los valores catastrales."
        },
        {
          id: "t12-q14",
          question: "¿Cuál es el procedimiento para recursos catastrales?",
          options: ["Solo judicial", "Reposición y económico-administrativo", "Solo administrativo", "Solo reposición"],
          correctAnswer: 1,
          explanation: "Se pueden interponer recursos de reposición y reclamación económico-administrativa."
        },
        {
          id: "t12-q15",
          question: "¿Qué efectos tiene la inscripción en censo?",
          options: ["Solo informativos", "Habilita para ejercer actividades", "Solo estadísticos", "Solo de control"],
          correctAnswer: 1,
          explanation: "La inscripción censal habilita para el ejercicio de actividades empresariales."
        },
        {
          id: "t12-q16",
          question: "¿Cuándo se debe comunicar el cese de actividad?",
          options: ["Al año siguiente", "En el plazo establecido reglamentariamente", "Nunca", "Solo si se solicita"],
          correctAnswer: 1,
          explanation: "Debe comunicarse en el plazo establecido en las disposiciones reglamentarias."
        },
        {
          id: "t12-q17",
          question: "¿Qué datos contiene el censo de empresarios?",
          options: ["Solo nombre", "Identificación, actividad, domicilio, otros datos", "Solo actividad", "Solo domicilio"],
          correctAnswer: 1,
          explanation: "Contiene datos de identificación, actividad económica, domicilio y otros relevantes."
        },
        {
          id: "t12-q18",
          question: "¿Cuándo se actualiza el catastro?",
          options: ["Cada 10 años", "Periódicamente y cuando cambien circunstancias", "Solo por petición", "Nunca"],
          correctAnswer: 1,
          explanation: "Se actualiza periódicamente y cuando cambien las circunstancias que afecten a la valoración."
        },
        {
          id: "t12-q19",
          question: "¿Qué es el procedimiento de corrección de errores?",
          options: ["Solo judicial", "Subsanación de errores materiales", "Solo administrativo", "Solo técnico"],
          correctAnswer: 1,
          explanation: "Permite subsanar errores materiales, de hecho o aritméticos."
        },
        {
          id: "t12-q20",
          question: "¿Cuál es el ámbito temporal de los procedimientos especiales?",
          options: ["Ilimitado", "Sujeto a plazos de prescripción", "Solo un año", "Solo cinco años"],
          correctAnswer: 1,
          explanation: "Están sujetos a los plazos generales de prescripción de cuatro años."
        }
      ]
    },
    {
      themeId: "tema-13",
      themeName: "Impuestos Especiales",
      tests: [
        {
          id: "t13-q1",
          question: "¿Qué son los impuestos especiales?",
          options: ["Impuestos generales", "Impuestos sobre consumos específicos", "Solo sobre alcohol", "Solo sobre tabaco"],
          correctAnswer: 1,
          explanation: "Son impuestos indirectos que gravan consumos específicos considerados de lujo o nocivos."
        },
        {
          id: "t13-q2",
          question: "¿Cuáles son los impuestos especiales principales?",
          options: ["Solo alcohol", "Alcohol, tabaco, hidrocarburos, electricidad", "Solo tabaco", "Solo combustibles"],
          correctAnswer: 1,
          explanation: "Los principales son sobre alcohol y bebidas derivadas, tabaco, hidrocarburos y electricidad."
        },
        {
          id: "t13-q3",
          question: "¿Cuándo se devenga el impuesto especial?",
          options: ["Al vender", "Al salir del régimen suspensivo", "Al fabricar", "Al consumir"],
          correctAnswer: 1,
          explanation: "Se devenga cuando los productos salen del régimen suspensivo o se importan."
        },
        {
          id: "t13-q4",
          question: "¿Qué es un depósito fiscal?",
          options: ["Almacén normal", "Lugar autorizado donde se suspende el impuesto", "Solo aduanas", "Solo fábricas"],
          correctAnswer: 1,
          explanation: "Es un lugar autorizado donde se pueden fabricar, transformar o almacenar productos en suspensión."
        },
        {
          id: "t13-q5",
          question: "¿Quién es el depositario autorizado?",
          options: ["Cualquiera", "Persona autorizada para operar depósito fiscal", "Solo fabricantes", "Solo importadores"],
          correctAnswer: 1,
          explanation: "Es la persona física o jurídica autorizada para explotar un depósito fiscal."
        },
        {
          id: "t13-q6",
          question: "¿Qué es el documento administrativo de acompañamiento?",
          options: ["Solo factura", "Documento que ampara circulación en suspensión", "Solo albarán", "Solo guía"],
          correctAnswer: 1,
          explanation: "Es el documento que debe acompañar a los productos que circulan en régimen suspensivo."
        },
        {
          id: "t13-q7",
          question: "¿Cuándo se aplican tipos específicos en hidrocarburos?",
          options: ["Nunca", "Según el tipo de producto", "Siempre iguales", "Solo gasolina"],
          correctAnswer: 1,
          explanation: "Se aplican tipos específicos diferentes según el tipo de hidrocarburo."
        },
        {
          id: "t13-q8",
          question: "¿Qué productos están exentos de impuestos especiales?",
          options: ["Ninguno", "Productos desnaturalizados, uso industrial específico", "Todos", "Solo exportación"],
          correctAnswer: 1,
          explanation: "Están exentos productos desnaturalizados y destinados a usos industriales específicos."
        },
        {
          id: "t13-q9",
          question: "¿Qué es el régimen de tenencia ilícita?",
          options: ["Solo legal", "Posesión sin cumplir requisitos legales", "Solo comercio", "Solo consumo"],
          correctAnswer: 1,
          explanation: "Es la posesión para venta de productos sin haber satisfecho el impuesto."
        },
        {
          id: "t13-q10",
          question: "¿Cuáles son las obligaciones del depositario?",
          options: ["Solo pagar", "Llevar contabilidad, presentar declaraciones", "Solo almacenar", "Solo vender"],
          correctAnswer: 1,
          explanation: "Debe llevar contabilidad de productos, presentar declaraciones y cumplir requisitos de control."
        },
        {
          id: "t13-q11",
          question: "¿Qué es la devolución en impuestos especiales?",
          options: ["No existe", "Restitución del impuesto en casos específicos", "Solo exportación", "Solo errores"],
          correctAnswer: 1,
          explanation: "Procede la devolución en exportación, destrucción y otros supuestos específicos."
        },
        {
          id: "t13-q12",
          question: "¿Cómo se controla la circulaci��n de productos gravados?",
          options: ["No se controla", "Mediante documentos de acompañamiento", "Solo facturas", "Solo visualmente"],
          correctAnswer: 1,
          explanation: "Se controla mediante documentos administrativos de acompañamiento y precintos."
        },
        {
          id: "t13-q13",
          question: "¿Qué sanciones se aplican por tenencia ilícita?",
          options: ["Solo advertencia", "Decomiso y multa", "Solo multa", "Solo decomiso"],
          correctAnswer: 1,
          explanation: "Se aplican sanciones de decomiso del producto y multa pecuniaria."
        },
        {
          id: "t13-q14",
          question: "¿Cuándo se puede autorizar una fábrica?",
          options: ["Libremente", "Cumpliendo requisitos técnicos y financieros", "Solo a empresas grandes", "Solo públicas"],
          correctAnswer: 1,
          explanation: "Se requiere cumplir requisitos técnicos, financieros y de control establecidos."
        },
        {
          id: "t13-q15",
          question: "¿Qué es el precinto en impuestos especiales?",
          options: ["Solo estético", "Sistema de control físico", "Solo informativo", "Solo publicitario"],
          correctAnswer: 1,
          explanation: "Es un sistema de control que certifica el pago del impuesto."
        },
        {
          id: "t13-q16",
          question: "¿Cuál es el ámbito territorial de los impuestos especiales?",
          options: ["Solo península", "Todo el territorio español", "Solo aduanero", "Solo nacional"],
          correctAnswer: 1,
          explanation: "Se aplican en todo el territorio español, incluyendo Canarias con especialidades."
        },
        {
          id: "t13-q17",
          question: "¿Qué es el Impuesto Especial sobre Determinados Medios de Transporte?",
          options: ["Solo coches", "Impuesto sobre vehículos nuevos", "Solo motos", "Solo barcos"],
          correctAnswer: 1,
          explanation: "Grava la primera matriculación de vehículos automóviles y otros medios de transporte."
        },
        {
          id: "t13-q18",
          question: "¿Cuándo se consideran productos desnaturalizados?",
          options: ["Siempre", "Cuando se añaden sustancias que impiden consumo", "Nunca", "Solo industriales"],
          correctAnswer: 1,
          explanation: "Cuando se añaden sustancias que los hacen impropios para consumo humano."
        },
        {
          id: "t13-q19",
          question: "¿Qué controles se ejercen sobre los productos gravados?",
          options: ["Solo fiscales", "Fiscales, sanitarios y de calidad", "Solo sanitarios", "Solo de calidad"],
          correctAnswer: 1,
          explanation: "Se ejercen controles fiscales, sanitarios y de calidad comercial."
        },
        {
          id: "t13-q20",
          question: "¿Cuál es el tratamiento de los productos defectuosos?",
          options: ["Se gravan igual", "Pueden ser destruidos sin pagar impuesto", "Se gravan más", "No se pueden destruir"],
          correctAnswer: 1,
          explanation: "Los productos defectuosos pueden ser destruidos bajo control sin devengo del impuesto."
        }
      ]
    },
    {
      themeId: "tema-14",
      themeName: "Régimen Aduanero",
      tests: [
        {
          id: "t14-q1",
          question: "¿Qué es la unión aduanera europea?",
          options: ["Solo comercio", "Territorio aduanero único con arancel común", "Solo frontera", "Solo impuestos"],
          correctAnswer: 1,
          explanation: "Es un territorio aduanero único con arancel aduanero común frente a terceros países."
        },
        {
          id: "t14-q2",
          question: "¿Cuál es el ámbito territorial aduanero español?",
          options: ["Solo península", "Península, Baleares y Canarias con especialidades", "Solo nacional", "Solo europeo"],
          correctAnswer: 1,
          explanation: "Comprende todo el territorio español, con especialidades para Canarias, Ceuta y Melilla."
        },
        {
          id: "t14-q3",
          question: "¿Qué son los derechos de importación?",
          options: ["Solo tasas", "Tributos sobre mercancías importadas", "Solo impuestos", "Solo aranceles"],
          correctAnswer: 1,
          explanation: "Son los tributos establecidos en el arancel aduanero común sobre las importaciones."
        },
        {
          id: "t14-q4",
          question: "¿Cuándo se devengan los derechos de importación?",
          options: ["Al comprar", "Al admitir la declaración de importación", "Al vender", "Al usar"],
          correctAnswer: 1,
          explanation: "Se devengan cuando se admite la declaración aduanera de importación."
        },
        {
          id: "t14-q5",
          question: "¿Qué es la declaración aduanera?",
          options: ["Solo documento", "Acto por el cual se indica régimen aduanero", "Solo formulario", "Solo trámite"],
          correctAnswer: 1,
          explanation: "Es el acto por el cual una persona indica el régimen aduanero aplicable a las mercancías."
        },
        {
          id: "t14-q6",
          question: "¿Quién puede presentar declaración aduanera?",
          options: ["Cualquiera", "El declarante autorizado", "Solo importador", "Solo transportista"],
          correctAnswer: 1,
          explanation: "Debe presentarla el declarante, que puede ser el importador o un representante aduanero."
        },
        {
          id: "t14-q7",
          question: "¿Qué son los regímenes aduaneros?",
          options: ["Solo importación", "Diferentes tratamientos aduaneros posibles", "Solo exportación", "Solo tránsito"],
          correctAnswer: 1,
          explanation: "Son los diferentes tratamientos aduaneros que se pueden aplicar a las mercancías."
        },
        {
          id: "t14-q8",
          question: "¿Qué es el despacho a libre pr��ctica?",
          options: ["Solo nacional", "Régimen que permite libre circulación en UE", "Solo importación", "Solo exportación"],
          correctAnswer: 1,
          explanation: "Permite que mercancías no comunitarias circulen libremente en el territorio aduanero de la UE."
        },
        {
          id: "t14-q9",
          question: "¿Qué es un depósito aduanero?",
          options: ["Solo almacén", "Régimen suspensivo de derechos de importación", "Solo temporal", "Solo público"],
          correctAnswer: 1,
          explanation: "Es un régimen que permite almacenar mercancías suspendiendo derechos e impuestos."
        },
        {
          id: "t14-q10",
          question: "¿Cuál es la duración máxima del depósito aduanero?",
          options: ["6 meses", "3 años", "1 año", "5 años"],
          correctAnswer: 1,
          explanation: "Las mercancías pueden permanecer en depósito aduanero hasta 3 años."
        },
        {
          id: "t14-q11",
          question: "¿Qué es el tránsito aduanero?",
          options: ["Solo transporte", "Régimen que permite circulación suspendiendo derechos", "Solo paso", "Solo temporal"],
          correctAnswer: 1,
          explanation: "Permite la circulación de mercancías entre dos puntos suspendiendo derechos e impuestos."
        },
        {
          id: "t14-q12",
          question: "¿Qué garantías se exigen en tr��nsito aduanero?",
          options: ["Ninguna", "Garantía que cubra derechos e impuestos", "Solo fianza", "Solo aval"],
          correctAnswer: 1,
          explanation: "Se exige garantía que cubra los derechos e impuestos que podrían adeudarse."
        },
        {
          id: "t14-q13",
          question: "¿Qué es la importación temporal?",
          options: ["Solo corta", "Régimen para uso temporal con suspensión parcial", "Solo larga", "Solo exenta"],
          correctAnswer: 1,
          explanation: "Permite el uso temporal de mercancías con suspensión total o parcial de derechos."
        },
        {
          id: "t14-q14",
          question: "¿Cuándo procede la devolución de derechos?",
          options: ["Nunca", "Exportación tras importación o destrucción", "Siempre", "Solo errores"],
          correctAnswer: 1,
          explanation: "Procede cuando las mercancías se exportan después de importación o se destruyen."
        },
        {
          id: "t14-q15",
          question: "¿Qué es el valor en aduana?",
          options: ["Precio de venta", "Valor de transacción más ajustes", "Solo coste", "Solo precio"],
          correctAnswer: 1,
          explanation: "Es el valor de transacción ajustado conforme a las normas de valoración aduanera."
        },
        {
          id: "t14-q16",
          question: "¿Cuáles son los métodos de valoración aduanera?",
          options: ["Solo uno", "Valor de transacción y métodos subsidiarios", "Solo precio", "Solo coste"],
          correctAnswer: 1,
          explanation: "El principal es el valor de transacción, con métodos subsidiarios si no es aplicable."
        },
        {
          id: "t14-q17",
          question: "¿Qué es el origen preferencial?",
          options: ["Cualquier origen", "Origen que permite trato arancelario favorable", "Solo europeo", "Solo nacional"],
          correctAnswer: 1,
          explanation: "Es el origen que permite aplicar un trato arancelario preferencial por acuerdos comerciales."
        },
        {
          id: "t14-q18",
          question: "¿Cómo se determina el origen no preferencial?",
          options: ["Libremente", "Según normas específicas de transformación", "Solo fabricación", "Solo montaje"],
          correctAnswer: 1,
          explanation: "Se determina según normas que establecen el país donde se efectuó la última transformación sustancial."
        },
        {
          id: "t14-q19",
          question: "¿Qué son las mercancías equivalentes?",
          options: ["Idénticas", "De misma clasificación y características", "Solo similares", "Solo iguales"],
          correctAnswer: 1,
          explanation: "Son mercancías de la misma clasificación arancelaria, calidad y características técnicas."
        },
        {
          id: "t14-q20",
          question: "¿Cuál es el plazo de prescripción en materia aduanera?",
          options: ["2 años", "3 años", "4 años", "5 años"],
          correctAnswer: 1,
          explanation: "El plazo general de prescripción en materia aduanera es de 3 años."
        }
      ]
    },
    {
      themeId: "tema-15",
      themeName: "Derecho Financiero y Presupuestario",
      tests: [
        {
          id: "t15-q1",
          question: "¿Qué es el Derecho Financiero?",
          options: ["Solo contabilidad", "Rama del Derecho que regula la actividad financiera pública", "Solo presupuestos", "Solo impuestos"],
          correctAnswer: 1,
          explanation: "Es la rama del Derecho que regula la actividad financiera del Estado y demás entes públicos."
        },
        {
          id: "t15-q2",
          question: "¿Cuáles son las funciones de la Hacienda Pública?",
          options: ["Solo recaudar", "Asignación, distribución y estabilización", "Solo gastar", "Solo controlar"],
          correctAnswer: 1,
          explanation: "Las funciones básicas son asignación de recursos, distribución de renta y estabilización económica."
        },
        {
          id: "t15-q3",
          question: "¿Qué principios rigen el gasto público?",
          options: ["Solo eficiencia", "Legalidad, eficiencia, econom��a, eficacia", "Solo legalidad", "Solo economía"],
          correctAnswer: 1,
          explanation: "Rigen los principios de legalidad, eficiencia, economía y eficacia."
        },
        {
          id: "t15-q4",
          question: "¿Cuál es la naturaleza jurídica del presupuesto?",
          options: ["Solo contable", "Ley formal y acto administrativo", "Solo ley", "Solo acto administrativo"],
          correctAnswer: 1,
          explanation: "Tiene naturaleza de ley formal y constituye un acto de administración."
        },
        {
          id: "t15-q5",
          question: "��Qué contiene la Ley de Presupuestos?",
          options: ["Solo gastos", "Previsión de ingresos y autorización de gastos", "Solo ingresos", "Solo deuda"],
          correctAnswer: 1,
          explanation: "Contiene la previsión de ingresos y la autorización de gastos para el ejercicio."
        },
        {
          id: "t15-q6",
          question: "¿Cuándo entra en vigor el presupuesto?",
          options: ["Al aprobar", "1 de enero del ejercicio correspondiente", "Al publicar", "Al elaborar"],
          correctAnswer: 1,
          explanation: "Entra en vigor el 1 de enero del ejercicio al que se refiere."
        },
        {
          id: "t15-q7",
          question: "¿Qué es la estabilidad presupuestaria?",
          options: ["Equilibrio perfecto", "Situación de equilibrio o superávit", "Solo superávit", "Solo déficit"],
          correctAnswer: 1,
          explanation: "Es la situación de equilibrio o superávit en términos de capacidad de financiación."
        },
        {
          id: "t15-q8",
          question: "¿Qué es la sostenibilidad financiera?",
          options: ["Solo actual", "Capacidad para financiar compromisos presentes y futuros", "Solo futuro", "Solo pasado"],
          correctAnswer: 1,
          explanation: "Es la capacidad para financiar compromisos de gasto presentes y futuros dentro de límites de déficit y deuda."
        },
        {
          id: "t15-q9",
          question: "¿Cuál es el límite de déficit estructural?",
          options: ["Sin límite", "0,4% del PIB para el conjunto de Administraciones", "1% del PIB", "2% del PIB"],
          correctAnswer: 1,
          explanation: "El límite de déficit estructural es del 0,4% del PIB para el conjunto de Administraciones Públicas."
        },
        {
          id: "t15-q10",
          question: "¿Qué es la regla del gasto?",
          options: ["Gasto libre", "Límite al crecimiento del gasto público", "Solo reducción", "Solo aumento"],
          correctAnswer: 1,
          explanation: "Establece que el gasto público no puede crecer por encima de la tasa de crecimiento de referencia del PIB."
        },
        {
          id: "t15-q11",
          question: "¿Cuál es el límite de deuda pública?",
          options: ["50% del PIB", "60% del PIB", "70% del PIB", "Sin límite"],
          correctAnswer: 1,
          explanation: "El límite de deuda pública es del 60% del PIB para el conjunto de Administraciones Públicas."
        },
        {
          id: "t15-q12",
          question: "¿Qué son los marcos presupuestarios a medio plazo?",
          options: ["Solo anuales", "Planificación plurianual de ingresos y gastos", "Solo trianuales", "Solo quinquenales"],
          correctAnswer: 1,
          explanation: "Son instrumentos de planificación plurianual que establecen límites de gasto por tres años."
        },
        {
          id: "t15-q13",
          question: "¿Qué es el mecanismo de corrección automática?",
          options: ["Solo manual", "Medidas automáticas ante incumplimiento de objetivos", "Solo voluntario", "Solo excepcional"],
          correctAnswer: 1,
          explanation: "Son medidas que se activan automáticamente cuando se produce un incumplimiento de los objetivos."
        },
        {
          id: "t15-q14",
          question: "¿Cuándo se pueden superar los objetivos de estabilidad?",
          options: ["Nunca", "En circunstancias excepcionales", "Siempre", "Solo con autorización"],
          correctAnswer: 1,
          explanation: "Solo en circunstancias excepcionales como catástrofes naturales o recesión económica severa."
        },
        {
          id: "t15-q15",
          question: "¿Qué es el Consejo de Política Fiscal y Financiera?",
          options: ["Solo central", "Órgano de coordinación entre Estado y CC.AA.", "Solo autonómico", "Solo consultivo"],
          correctAnswer: 1,
          explanation: "Es el órgano de coordinación de la política fiscal y financiera entre el Estado y las Comunidades Autónomas."
        },
        {
          id: "t15-q16",
          question: "¿Qué funciones tiene la AIReF?",
          options: ["Solo controlar", "Supervisión del cumplimiento de las reglas fiscales", "Solo asesorar", "Solo informar"],
          correctAnswer: 1,
          explanation: "La Autoridad Independiente de Responsabilidad Fiscal supervisa el cumplimiento de las reglas fiscales."
        },
        {
          id: "t15-q17",
          question: "¿Qué es un plan económico-financiero?",
          options: ["Solo económico", "Plan de corrección ante incumplimiento", "Solo financiero", "Solo de emergencia"],
          correctAnswer: 1,
          explanation: "Es un plan que deben aprobar las administraciones que incumplan los objetivos para corregir la situación."
        },
        {
          id: "t15-q18",
          question: "¿Cuáles son las medidas coercitivas por incumplimiento?",
          options: ["Solo multas", "Retención de transferencias, multas, intervención", "Solo retención", "Solo intervención"],
          correctAnswer: 1,
          explanation: "Incluyen retención de transferencias, multas coercitivas y envío de comisión de expertos."
        },
        {
          id: "t15-q19",
          question: "��Qué es el principio de transparencia presupuestaria?",
          options: ["Solo publicar", "Información clara, completa y accesible", "Solo datos", "Solo resumen"],
          correctAnswer: 1,
          explanation: "Exige que la información presupuestaria sea clara, completa y accesible para los ciudadanos."
        },
        {
          id: "t15-q20",
          question: "¿Cuándo se debe aprobar el objetivo de estabilidad?",
          options: ["Cada mes", "Antes del 1 de abril del año anterior", "Cada trimestre", "Cada semestre"],
          correctAnswer: 1,
          explanation: "Los objetivos de estabilidad deben aprobarse antes del 1 de abril del año anterior al que se refieren."
        }
      ]
    }
  ],

  "auxilio-judicial": [
};
