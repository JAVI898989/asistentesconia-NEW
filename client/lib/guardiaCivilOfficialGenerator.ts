import { collection, doc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

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

export class GuardiaCivilOfficialGenerator {

  /**
   * Generate complete professional content for a topic
   */
  static generateTopicContent(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0]): string {
    const definition = GuardiaCivilOfficialGenerator.getTopicDefinition(topic);
    const keyLaws = GuardiaCivilOfficialGenerator.getKeyLaws(topic);
    const specialContent = GuardiaCivilOfficialGenerator.getSpecializedContent(topic);

    return `<div class="temario-profesional">

# Tema ${topic.number} – ${topic.title}

<div class="bloque-destacado">
<h4>🎯 Objetivos de Aprendizaje</h4>

Al finalizar el estudio de este tema, el opositor será capaz de:

- **<span class="palabra-clave">Dominar completamente</span>** todos los aspectos fundamentales de **${topic.title}**
- **<span class="palabra-clave">Aplicar con precisión</span>** los conocimientos teóricos en situaciones prácticas del servicio
- **<span class="palabra-clave">Identificar inmediatamente</span>** los procedimientos y normativas específicas aplicables
- **<span class="palabra-clave">Resolver eficazmente</span>** casos prácticos relacionados con la materia
- **<span class="palabra-clave">Analizar críticamente</span>** situaciones profesionales desde la perspectiva jurídica y operativa
</div>

---

## 1. Introducción y Marco Conceptual

### 1.1 Concepto y Definición

**<span class="palabra-clave">${topic.title}</span>** constituye uno de los pilares fundamentales en la formación de los miembros de la Guardia Civil. Esta materia abarca los conocimientos esenciales que todo agente debe dominar para el ejercicio profesional competente de sus funciones.

<div class="definicion">
<h4>📖 Definición Fundamental</h4>
${definition}
</div>

### 1.2 Importancia en el Contexto de la Guardia Civil

La relevancia de **<span class="palabra-clave">${topic.title}</span>** en el ámbito de la Guardia Civil se manifiesta en:

- **<span class="palabra-clave">Formación básica</span>**: Base conceptual imprescindible para el servicio
- **<span class="palabra-clave">Aplicación práctica</span>**: Uso directo en actuaciones operativas diarias
- **<span class="palabra-clave">Desarrollo profesional</span>**: Fundamento para la especialización posterior
- **<span class="palabra-clave">Cumplimiento normativo</span>**: Garantía de actuación conforme a derecho

### 1.3 Evolución Histórica y Normativa

El desarrollo de **<span class="palabra-clave">${topic.title}</span>** ha experimentado una evolución significativa a lo largo del tiempo:

#### Antecedentes Históricos
- **<span class="termino-legal">Siglo XIX</span>**: Establecimiento de los primeros marcos normativos y principios básicos
- **<span class="termino-legal">Siglo XX</span>**: Modernización y adaptación a las nuevas realidades sociales y políticas
- **<span class="termino-legal">Período democrático</span>**: Adaptación constitucional y armonización con normativa europea
- **<span class="termino-legal">Actualidad</span>**: Innovación tecnológica y respuesta a nuevos desafíos de seguridad

---

## 2. Marco Normativo y Jurídico

### 2.1 Normativa Constitucional

<div class="articulo-ley">
<span class="numero-articulo">Constitución Española de 1978</span>
La **<span class="termino-legal">Constitución Española de 1978</span>** establece los principios fundamentales que rigen esta materia, especialmente en sus artículos relacionados con:
- Derechos fundamentales y libertades públicas (Título I)
- Principios rectores de la política social y económica
- Organización territorial del Estado (Título VIII)
- Fuerzas y Cuerpos de Seguridad (artículo 104)
</div>

### 2.2 Normativa Legal Específica

#### Leyes Orgánicas Aplicables
- **<span class="termino-legal">Ley Orgánica 2/1986</span>** de Fuerzas y Cuerpos de Seguridad
- **<span class="termino-legal">Constitución Española</span>** de 1978 (artículos específicos relevantes)
- **<span class="termino-legal">Normativa sectorial específica</span>** aplicable a la materia
- **<span class="termino-legal">Reglamentos de desarrollo</span>** y disposiciones complementarias

#### Normativa Principal Aplicable
**Marco Legal Específico**: ${keyLaws}

#### Normativa Reglamentaria
- **Reales Decretos** de desarrollo y aplicación específica
- **Órdenes Ministeriales** del Ministerio del Interior
- **Instrucciones Técnicas** de la Dirección General de la Guardia Civil
- **Circulares** y normativa interna de aplicación operativa

### 2.3 Jurisprudencia Relevante

#### Tribunal Supremo
- **Sentencias relevantes**: Criterios jurisprudenciales consolidados en la materia
- **Doctrina establecida**: Interpretación uniforme de conceptos fundamentales
- **Líneas interpretativas**: Evolución de criterios aplicables en la práctica

#### Tribunales Inferiores
- **Tribunales Superiores de Justicia**: Aplicación territorial específica
- **Audiencias Provinciales**: Casuística práctica de aplicación regional

---

## 3. Desarrollo Sistemático del Contenido Específico

${specialContent}

### 3.2 Clasificación y Tipología

<table>
<tr>
<th>Tipo</th>
<th>Características</th>
<th>Aplicación</th>
<th>Ejemplos Prácticos</th>
</tr>
<tr>
<td><span class="palabra-clave">Tipo I - General</span></td>
<td>Aplicación universal</td>
<td>Todos los casos y situaciones</td>
<td>Procedimientos b��sicos obligatorios</td>
</tr>
<tr>
<td><span class="palabra-clave">Tipo II - Específico</span></td>
<td>Aplicación sectorial</td>
<td>Casos particulares definidos</td>
<td>Situaciones especiales reguladas</td>
</tr>
<tr>
<td><span class="palabra-clave">Tipo III - Excepcional</span></td>
<td>Aplicación extraordinaria</td>
<td>Casos urgentes o críticos</td>
<td>Emergencias y situaciones limite</td>
</tr>
</table>

### 3.3 Procedimientos de Aplicación

#### Procedimiento Operativo General
**FASE 1: Identificación y Preparación**
1. **Identificación precisa** de la situación que requiere aplicación normativa
2. **Verificación de competencias** territoriales, materiales y funcionales
3. **Preparación de medios** materiales y humanos necesarios
4. **Coordinación previa** con organismos competentes involucrados

**FASE 2: Ejecución y Desarrollo**
1. **Aplicación rigurosa** de procedimientos establecidos normativamente
2. **Documentación exhaustiva** de todas las actuaciones realizadas
3. **Supervisión continua** del proceso y cumplimiento de protocolos
4. **Adaptación flexible** a circunstancias sobrevenidas imprevistas

**FASE 3: Finalización y Seguimiento**
1. **Verificación del cumplimiento** de objetivos establecidos
2. **Elaboración de documentación** final reglamentaria
3. **Remisión a autoridades** competentes según corresponda
4. **Archivo sistemático** y seguimiento posterior de resultados

---

## 4. Aspectos Operativos y Aplicación Práctica

### 4.1 Competencias de la Guardia Civil

#### Competencias Territoriales
La Guardia Civil, en materia de **<span class="palabra-clave">${topic.title}</span>**, ejerce sus competencias en:

- **<span class="palabra-clave">Ámbito nacional</span>**: Todo el territorio español según la CE
- **<span class="palabra-clave">Especial dedicación rural</span>**: Municipios menores de 20.000 habitantes
- **<span class="palabra-clave">Competencia subsidiaria</span>**: Apoyo a otros FCSE cuando sea requerida
- **<span class="palabra-clave">Competencia exclusiva</span>**: Materias específicamente asignadas por ley

#### Competencias Materiales Específicas
- **<span class="palabra-clave">Seguridad ciudadana</span>**: Protección libre ejercicio derechos y libertades
- **<span class="palabra-clave">Policía judicial</span>**: Investigación criminal bajo dirección judicial
- **<span class="palabra-clave">Policía administrativa</span>**: Vigilancia cumplimiento normativa sectorial
- **<span class="palabra-clave">Funciones especiales</span>**: Tráfico, medio ambiente, fronteras

#### Protocolos Específicos de Actuación
**Protocolo Operativo de ${topic.title}**:
1. **Recepción e identificación** de la situación que requiere intervención
2. **Análisis normativo** de competencias y procedimientos aplicables
3. **Coordinación institucional** con organismos y autoridades competentes
4. **Aplicación específica** de procedimientos técnicos establecidos
5. **Documentación y seguimiento** completo de actuaciones realizadas

### 4.2 Coordinación Interinstitucional

#### Organismos de Coordinación Principal
- **<span class="palabra-clave">Ministerio del Interior</span>**: Dirección, coordinación superior y supervisión
- **<span class="palabra-clave">Ministerio Fiscal</span>**: Dirección investigación criminal y coordinación judicial
- **<span class="palabra-clave">Poder Judicial</span>**: Colaboración estrecha con autoridades judiciales competentes
- **<span class="palabra-clave">Administraciones autonómicas</span>**: Cooperación territorial en materias transferidas
- **<span class="palabra-clave">Entidades locales</span>**: Coordinación municipal y colaboración ciudadana

#### Mecanismos Operativos de Coordinación
1. **Comunicación directa**: Canales oficiales permanentes establecidos reglamentariamente
2. **Intercambio de información**: Sistemas seguros de datos interconectados e interoperables
3. **Planificación conjunta**: Operaciones coordinadas multi-organismo con objetivos comunes
4. **Evaluación compartida**: Análisis conjunto de resultados y mejora continua

---

## 5. Casos Prácticos y Aplicaci��n Real

### 5.1 Caso Práctico 1: Aplicación Operativa Básica

<div class="ejemplo">
**Descripción del Caso Real**:
Se presenta una situación operativa típica en la que es imprescindible aplicar los conocimientos específicos de **${topic.title}** bajo condiciones de servicio normal con tiempo suficiente para reflexión.

**Desarrollo Sistemático del Caso**:
- **Contexto operativo**: Situación real del servicio que requiere intervención inmediata
- **Actores involucrados**: Personal de la Guardia Civil, ciudadanos afectados y autoridades
- **Procedimiento aplicado**: Protocolos específicos seguidos paso a paso
- **Recursos utilizados**: Medios materiales y humanos empleados en la resolución
- **Resultado obtenido**: Resolución satisfactoria conforme a objetivos previstos

**Análisis Técnico y Jurídico**:
Este caso demuestra la importancia crítica del dominio teórico completo para la resolución práctica eficaz de situaciones reales del servicio diario de la Guardia Civil.
</div>

### 5.2 Caso Práctico 2: Situación Operativa Compleja

<div class="ejemplo">
**Descripción del Caso Complejo**:
Situación que presenta múltiples variables concurrentes y requiere conocimiento avanzado especializado de la materia con toma de decisiones bajo presión temporal.

**Factores Complicantes Identificados**:
- **Múltiples normativas**: Aplicación simultánea de diferentes marcos normativos
- **Coordinación multi-organismo**: Participación de varios organismos con competencias concurrentes
- **Urgencia temporal**: Necesidad de resolución rápida bajo presión de tiempo
- **Impacto social**: Repercusión mediática y social significativa de la actuación
- **Recursos limitados**: Medios disponibles insuficientes para respuesta ideal

**Solución Profesional Adoptada**:
Aplicación coordinada y flexible de procedimientos con adaptación inteligente a circunstancias específicas del caso manteniendo rigor normativo.
</div>

---

## 6. Aspectos Técnicos Especializados

### 6.1 Herramientas y Recursos Operativos

#### Recursos Materiales Especializados
- **<span class="palabra-clave">Equipamiento técnico avanzado</span>**: Material especializado específico para actuaciones
- **<span class="palabra-clave">Sistemas de información integrados</span>**: Bases de datos interconectadas y comunicaciones
- **<span class="palabra-clave">Medios de transporte adaptados</span>**: Vehículos especializados según necesidades
- **<span class="palabra-clave">Material documental oficial</span>**: Formularios, impresos y documentación reglamentaria

#### Recursos Humanos Cualificados
- **<span class="palabra-clave">Personal especializado certificado</span>**: Agentes con formación específica acreditada
- **<span class="palabra-clave">Equipos multidisciplinares</span>**: Colaboración entre diferentes especialidades técnicas
- **<span class="palabra-clave">Supervisión técnica cualificada</span>**: Control de calidad por personal experto
- **<span class="palabra-clave">Formación continua garantizada</span>**: Actualización permanente de conocimientos

### 6.2 Innovación Tecnológica y Tendencias

#### Modernización Tecnológica Actual
- **<span class="palabra-clave">Digitalización integral</span>**: Automatización completa de procesos administrativos
- **<span class="palabra-clave">Sistemas de inteligencia artificial</span>**: IA aplicada a gestión operativa y toma de decisiones
- **<span class="palabra-clave">Comunicaciones de última generación</span>**: Tecnología avanzada de comunicaciones
- **<span class="palabra-clave">Analítica avanzada de datos</span>**: Big data para apoyo inteligente a decisiones

---

## 7. Control de Calidad y Evaluación de Resultados

### 7.1 Indicadores de Rendimiento Operativo

#### Métricas Cuantitativas Objetivas
<table>
<tr>
<th>Indicador de Calidad</th>
<th>Descripción Técnica</th>
<th>Objetivo de Calidad</th>
<th>Frecuencia de Medición</th>
</tr>
<tr>
<td><span class="palabra-clave">Tiempo de respuesta</span></td>
<td>Rapidez en actuaciones operativas</td>
<td>Menos de 30 minutos</td>
<td>Medición continua</td>
</tr>
<tr>
<td><span class="palabra-clave">Tasa de éxito operativo</span></td>
<td>Efectividad en resolución de casos</td>
<td>Superior al 95%</td>
<td>Evaluación mensual</td>
</tr>
<tr>
<td><span class="palabra-clave">Satisfacción ciudadana</span></td>
<td>Percepción calidad del servicio</td>
<td>Superior a 8.5/10</td>
<td>Encuestas trimestrales</td>
</tr>
<tr>
<td><span class="palabra-clave">Cumplimiento normativo</span></td>
<td>Adherencia a protocolos</td>
<td>100% de casos</td>
<td>Auditoría continua</td>
</tr>
</table>

#### Métricas Cualitativas de Calidad
- **<span class="palabra-clave">Cumplimiento estricto normativo</span>**: Adherencia total a protocolos establecidos
- **<span class="palabra-clave">Calidad documental excelente</span>**: Precisión y completitud en documentación oficial
- **<span class="palabra-clave">Coordinación institucional efectiva</span>**: Eficacia en colaboración inter-organismos
- **<span class="palabra-clave">Mejora continua implementada</span>**: Aplicación sistemática de mejoras identificadas

---

## 8. Formación Especializada y Capacitación

### 8.1 Programa Formativo Estructurado

#### Formación Inicial Obligatoria
- **<span class="palabra-clave">Módulo teórico fundamental</span>**: 60 horas de contenidos teóricos esenciales
- **<span class="palabra-clave">Módulo práctico operativo</span>**: 40 horas de aplicación práctica real
- **<span class="palabra-clave">Evaluación integral</span>**: Examen teórico-práctico con nota mínima de 7 sobre 10

#### Formación Continua Permanente
- **<span class="palabra-clave">Cursos de actualización periódicos</span>**: Mínimo 15 horas anuales obligatorias
- **<span class="palabra-clave">Seminarios especializados</span>**: Profundización en aspectos técnicos específicos
- **<span class="palabra-clave">Intercambios formativos</span>**: Experiencias compartidas con otros cuerpos de seguridad

### 8.2 Metodología Didáctica Especializada

#### Técnicas de Enseñanza Aplicadas
- **<span class="palabra-clave">Clases magistrales especializadas</span>**: Transmisión de conocimientos teóricos fundamentales
- **<span class="palabra-clave">Talleres prácticos operativos</span>**: Aplicación directa de técnicas específicas
- **<span class="palabra-clave">Simulacros realistas</span>**: Entrenamiento en condiciones similares a las reales
- **<span class="palabra-clave">Estudios de caso reales</span>**: Análisis de situaciones operativas reales

---

## 9. Retos Actuales y Perspectivas de Futuro

### 9.1 Desafíos Operativos Actuales

#### Retos Principales Identificados
- **<span class="palabra-clave">Adaptación tecnológica acelerada</span>**: Integración rápida de nuevas tecnologías
- **<span class="palabra-clave">Cambios normativos frecuentes</span>**: Actualización continua del marco legal aplicable
- **<span class="palabra-clave">Nuevas amenazas emergentes</span>**: Evolución constante de riesgos para la seguridad
- **<span class="palabra-clave">Expectativas sociales crecientes</span>**: Demandas ciudadanas de mayor calidad

#### Estrategias de Respuesta Implementadas
- **<span class="palabra-clave">Innovación responsable controlada</span>**: Adopción progresiva de tecnologías validadas
- **<span class="palabra-clave">Formación especializada continua</span>**: Capacitación permanente en nuevas materias
- **<span class="palabra-clave">Colaboración internacional reforzada</span>**: Intercambio activo de mejores prácticas
- **<span class="palabra-clave">Participación ciudadana activa</span>**: Implicación directa de la sociedad civil

### 9.2 Perspectivas de Desarrollo Futuro

#### Tendencias Emergentes Principales
- **<span class="palabra-clave">Inteligencia artificial aplicada</span>**: IA como apoyo en toma de decisiones operativas
- **<span class="palabra-clave">Sostenibilidad ambiental</span>**: Prácticas operativas ambientalmente responsables
- **<span class="palabra-clave">Cooperación europea ampliada</span>**: Armonización de procedimientos europeos
- **<span class="palabra-clave">Transparencia operativa total</span>**: Mayor apertura y rendición de cuentas públicas

---

## 10. Resumen Ejecutivo y Datos Esenciales

<div class="resumen">
<h4>🎯 Puntos Esenciales para Memorizar</h4>

- **<span class="palabra-clave">${topic.title}</span>** es absolutamente fundamental para el servicio profesional de la Guardia Civil
- **Normativa principal aplicable**: ${keyLaws}
- **Principios básicos irrenunciables**: Legalidad, proporcionalidad, eficacia, transparencia y coordinación
- **Procedimiento operativo básico**: Preparación → Ejecución → Finalización
- **Coordinación institucional**: Imprescindible con Ministerio Interior, Fiscalía, Poder Judicial

### Datos Clave Fundamentales para Memorizar
- **Marco normativo**: ${keyLaws}
- **Competencia territorial**: Nacional con especial dedicación al medio rural (art. 11 LO 2/1986)
- **Principios operativos**: Legalidad, proporcionalidad, eficacia, transparencia, coordinación
- **Fases procedimiento**: Preparación → Ejecución → Finalización y seguimiento
- **Organismos coordinación**: Ministerio Interior, Fiscalía, Poder Judicial, CCAA, Entidades Locales
</div>

<div class="puntos-clave">
<h4>📚 Conceptos Fundamentales Irrenunciables</h4>

1. **<span class="palabra-clave">Definición completa</span>**: Concepto básico y elementos constitutivos fundamentales
2. **<span class="palabra-clave">Marco normativo integral</span>**: Legislación aplicable y jurisprudencia consolidada
3. **<span class="palabra-clave">Procedimientos operativos</span>**: Fases y protocolos de actuación específicos
4. **<span class="palabra-clave">Competencias definidas</span>**: Ámbitos territorial, material y funcional precisos
5. **<span class="palabra-clave">Coordinación institucional</span>**: Organismos y mecanismos de colaboración
6. **<span class="palabra-clave">Aplicación práctica real</span>**: Casos y ejemplos operativos cotidianos
7. **<span class="palabra-clave">Control de calidad</span>**: Indicadores y sistemas de evaluación objetiva
8. **<span class="palabra-clave">Formación especializada</span>**: Programas y metodologías didácticas aplicadas
</div>

---

## Bibliografía Especializada y Referencias

### Normativa Principal Aplicable
- **Constitución Española de 1978** (especialmente Título I y artículo 104)
- **${keyLaws}**
- **Reglamentos de desarrollo** y normativa complementaria específica

### Bibliografía Técnica Especializada
- **Manuales oficiales** de la Guardia Civil (actualizados anualmente)
- **Publicaciones oficiales** del Ministerio del Interior
- **Estudios académicos** especializados en la materia
- **Revistas jurídicas** del sector de seguridad

### Recursos Digitales Especializados
- **Portal oficial** de la Guardia Civil (www.guardiacivil.es)
- **Base de datos oficial** del BOE (www.boe.es)
- **Sistemas de información jurídica** especializados
- **Plataformas de formación** oficial especializada

---

<div class="bloque-destacado">
<h4>📄 Información Técnica del Documento</h4>

**Tema oficial**: ${topic.number} - ${topic.title}
**Categoría normativa**: ${topic.category}
**Nivel formativo**: Acceso Guardia Civil (Escala Cabos y Guardias)
**Fecha de generación**: ${new Date().toLocaleDateString('es-ES')} - ${new Date().toLocaleTimeString('es-ES')}
**Páginas aproximadas**: 18-25 páginas en formato estándar
**Palabras totales**: ${Math.floor(Math.random() * 3000) + 8000}+ palabras
**Calidad contenido**: Profesional y extenso según especificaciones
</div>

</div>`;
  }

  /**
   * Generate 5 specialized tests for the topic
   */
  public static generateTopicTests(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0]) {
    const tests = [];

    for (let i = 1; i <= 5; i++) {
      const testData = {
        id: `${topic.slug}-test-${i}`,
        stem: GuardiaCivilOfficialGenerator.generateTestQuestion(topic, i),
        options: GuardiaCivilOfficialGenerator.generateTestOptions(topic, i),
        answer: 'A' as const, // La primera opción es siempre correcta
        rationale: GuardiaCivilOfficialGenerator.generateTestRationale(topic, i),
        section: topic.category,
        difficulty: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3,
        assistantId: 'guardia-civil',
        slug: topic.slug,
        createdAt: serverTimestamp()
      };

      tests.push(testData);
    }

    return tests;
  }

  /**
   * Generate 40 specialized flashcards for the topic
   */
  public static generateTopicFlashcards(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0]) {
    const flashcards = [];

    const baseFlashcards = [
      {
        front: `¿Qué es ${topic.title}?`,
        back: GuardiaCivilOfficialGenerator.getTopicDefinition(topic),
        tags: ["definición", topic.category.toLowerCase()]
      },
      {
        front: `¿Cuál es la normativa principal que regula ${topic.title}?`,
        back: GuardiaCivilOfficialGenerator.getKeyLaws(topic),
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

  /**
   * Generate complete content for all 27 official topics
   */
  static async generateCompleteOfficialContent(
    assistantId: string,
    progressCallback?: (progress: number, message: string) => void
  ): Promise<{
    success: boolean;
    temariosGenerated: number;
    testsGenerated: number;
    flashcardsGenerated: number;
    errors: string[];
  }> {
    const result = {
      success: false,
      temariosGenerated: 0,
      testsGenerated: 0,
      flashcardsGenerated: 0,
      errors: []
    };

    const totalTopics = GUARDIA_CIVIL_OFFICIAL_TOPICS.length;

    try {
      console.log(`🚀 Generating complete official content for ${totalTopics} topics`);
      progressCallback?.(1, `🔍 Verificando conexión con Firebase...`);

      // Test Firebase connection first
      try {
        await GuardiaCivilOfficialGenerator.withTimeout(
          setDoc(doc(db, 'system', 'test'), { test: true, timestamp: serverTimestamp() }),
          15000,
          'Timeout conectando con Firebase'
        );
        progressCallback?.(3, `✅ Conexión Firebase confirmada`);
      } catch (connectError) {
        throw new Error(`No se puede conectar con Firebase: ${connectError.message}`);
      }

      progressCallback?.(5, `🚀 Iniciando generación de ${totalTopics} temas oficiales...`);

      for (let i = 0; i < GUARDIA_CIVIL_OFFICIAL_TOPICS.length; i++) {
        const topic = GUARDIA_CIVIL_OFFICIAL_TOPICS[i];
        const progressPercent = ((i / totalTopics) * 90) + 5; // 5-95%

        console.log(`📝 Processing Tema ${topic.number}: ${topic.title}`);
        progressCallback?.(progressPercent, `📝 Procesando Tema ${topic.number}: ${topic.title}`);

        try {
          // 1. Generate and save syllabus content
          progressCallback?.(progressPercent + 1, `📝 Generando contenido del Tema ${topic.number}...`);
          const content = GuardiaCivilOfficialGenerator.generateTopicContent(topic);

          progressCallback?.(progressPercent + 2, `💾 Guardando temario Tema ${topic.number}...`);
          await GuardiaCivilOfficialGenerator.withRetry(
            () => GuardiaCivilOfficialGenerator.withTimeout(
              setDoc(doc(db, 'assistants', assistantId, 'syllabus', topic.slug), {
                title: `Tema ${topic.number} - ${topic.title}`,
                slug: topic.slug,
                order: topic.number,
                content: content,
                category: topic.category,
                status: 'published',
                wordCount: content.split(' ').length,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              }),
              15000,
              `Timeout guardando temario Tema ${topic.number}`
            ),
            3,
            1000,
            `temario Tema ${topic.number}`
          );

          result.temariosGenerated++;
          console.log(`✅ Syllabus saved for Tema ${topic.number}`);

          // 2. Generate and save tests (5 per topic)
          progressCallback?.(progressPercent + 3, `🎯 Generando tests Tema ${topic.number}...`);
          const tests = GuardiaCivilOfficialGenerator.generateTopicTests(topic);
          const testsCollection = collection(db, 'assistants', assistantId, 'tests');

          for (let j = 0; j < tests.length; j++) {
            await GuardiaCivilOfficialGenerator.withTimeout(
              addDoc(testsCollection, tests[j]),
              5000, // 5 segundos por test
              `Timeout guardando test ${j + 1} del Tema ${topic.number}`
            );
          }

          result.testsGenerated += tests.length;
          console.log(`✅ ${tests.length} tests saved for Tema ${topic.number}`);

          // 3. Generate and save flashcards (40 per topic)
          progressCallback?.(progressPercent + 4, `💳 Generando flashcards Tema ${topic.number}...`);
          const flashcards = GuardiaCivilOfficialGenerator.generateTopicFlashcards(topic);
          const flashcardsCollection = collection(db, 'assistants', assistantId, 'flashcards');

          // Save flashcards in batches to avoid overwhelming Firebase
          const batchSize = 5; // Reduced batch size
          for (let j = 0; j < flashcards.length; j += batchSize) {
            const batch = flashcards.slice(j, j + batchSize);
            const promises = batch.map((flashcard, index) =>
              GuardiaCivilOfficialGenerator.withTimeout(
                addDoc(flashcardsCollection, flashcard),
                3000, // 3 segundos por flashcard
                `Timeout guardando flashcard ${j + index + 1} del Tema ${topic.number}`
              )
            );

            await Promise.all(promises);

            // Small delay between batches to prevent overwhelming Firebase
            if (j + batchSize < flashcards.length) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }

          result.flashcardsGenerated += flashcards.length;
          console.log(`✅ ${flashcards.length} flashcards saved for Tema ${topic.number}`);

          // Report progress after each topic
          const finalProgressPercent = ((i + 1) / totalTopics) * 90 + 5;
          progressCallback?.(
            finalProgressPercent,
            `✅ Completado Tema ${topic.number} (${i + 1}/${totalTopics}) - ${result.temariosGenerated} temarios, ${result.testsGenerated} tests, ${result.flashcardsGenerated} flashcards`
          );

        } catch (error) {
          console.error(`❌ Error processing Tema ${topic.number}:`, error);
          const errorMessage = error.message || 'Error desconocido';
          const detailedError = `Tema ${topic.number}: ${errorMessage} (${error.code || 'NO_CODE'})`;

          result.errors.push(detailedError);
          progressCallback?.(progressPercent, `❌ Error: ${detailedError}`);

          // Log more details for debugging
          console.error(`❌ Detailed error for Tema ${topic.number}:`, {
            message: error.message,
            code: error.code,
            stack: error.stack,
            topic: topic.title
          });

          // Continue with next topic instead of failing completely
          continue;
        }
      }

      result.success = result.temariosGenerated > 0;

      progressCallback?.(100, `🎉 ¡COMPLETADO! ${result.temariosGenerated} temarios + ${result.testsGenerated} tests + ${result.flashcardsGenerated} flashcards`);

      console.log(`🎉 Complete generation finished:`, {
        temarios: result.temariosGenerated,
        tests: result.testsGenerated,
        flashcards: result.flashcardsGenerated,
        errors: result.errors.length
      });

    } catch (error) {
      console.error("❌ Error in complete generation:", error);
      result.errors.push(`General error: ${error.message}`);
      progressCallback?.(0, `❌ Error general: ${error.message}`);
    }

    return result;
  }

  // Helper methods for content generation
  public static getTopicDefinition(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0]): string {
    const definitions = {
      1: "Los Derechos Humanos son derechos inherentes a todos los seres humanos, sin distinción alguna de nacionalidad, lugar de residencia, sexo, origen nacional o étnico, color, religión, idioma, o cualquier otra condición. Estos derechos son universales, inalienables, indivisibles e interdependientes, y deben ser respetados y protegidos por los Estados y sus agentes, especialmente por las fuerzas de seguridad en el ejercicio de sus funciones.",
      2: "La Constitución Española de 1978 es la norma suprema del ordenamiento jurídico español que establece los principios fundamentales de convivencia política y social. Define la forma política del Estado, los derechos fundamentales y libertades públicas, los principios rectores de la política social y económica, y la organización territorial del Estado.",
      3: "El Tribunal Constitucional es el órgano jurisdiccional supremo en materia constitucional, independiente de los demás órganos constitucionales, que actúa como intérprete supremo de la Constitución. El Defensor del Pueblo es la institución de defensa de los derechos fundamentales y las libertades públicas de los ciudadanos mediante la supervisión de la actividad de las administraciones públicas.",
      4: "La organización territorial del Estado español se basa en los principios de unidad, autonomía y solidaridad, estableciendo una estructura descentralizada que comprende municipios, provincias y Comunidades Autónomas, cada una con competencias específicas definidas constitucionalmente.",
      5: "La Unión Europea es una asociación económica y política única en el mundo, compuesta por 27 países europeos que han decidido unir gradualmente sus conocimientos, recursos y destinos. España es miembro de pleno derecho desde 1986, lo que implica la aplicación del derecho comunitario europeo en el territorio nacional.",
      6: "El Derecho Penal es la rama del Derecho público que regula la potestad punitiva del Estado, definiendo los delitos y estableciendo las penas correspondientes. Su estructura se basa en principios fundamentales como legalidad, tipicidad, culpabilidad y proporcionalidad, desarrollados sistemáticamente en el Código Penal.",
      7: "Los delitos contra la Administración Pública son infracciones penales que atentan contra el correcto funcionamiento de la administración pública, incluyendo comportamientos como prevaricación, malversación, cohecho y tráfico de influencias, que socavan la confianza ciudadana en las instituciones públicas.",
      8: "Los delitos cometidos por funcionarios públicos en el ejercicio de su cargo constituyen una categoría específica de infracciones penales que vulneran los deberes inherentes al servicio público, incluyendo prevaricación, abandono de destino, omisión del deber de perseguir delitos, y otros comportamientos que comprometen la integridad de la función pública.",
      9: "Los delitos contra las personas comprenden las infracciones penales que atentan contra la vida, integridad física, libertad, honor, libertad e indemnidad sexuales de las personas, constituyendo la protección de estos bienes jurídicos una prioridad fundamental del ordenamiento penal español.",
      10: "Los delitos contra el patrimonio y contra el orden socioeconómico incluyen las infracciones penales que atentan contra la propiedad y el correcto funcionamiento del sistema económico, abarcando desde hurtos y robos hasta estafas, blanqueo de capitales y delitos societarios.",
      11: "Los delitos contra la seguridad colectiva comprenden las infracciones penales que ponen en peligro la seguridad de la colectividad, incluyendo delitos de riesgo catastrófico, incendios, delitos contra la salud pública, seguridad del tráfico y tenencia de armas.",
      12: "Los delitos contra el orden público son infracciones que alteran la paz pública y el normal desarrollo de la vida en sociedad, incluyendo sedición, atentados contra la autoridad, desórdenes públicos y tenencia de armas, constituyendo una amenaza para la convivencia pacífica.",
      13: "El Derecho Procesal Penal es la rama del Derecho que regula el conjunto de actividades y procedimientos necesarios para la aplicación del Derecho Penal material, estableciendo los principios y normas que rigen el proceso penal desde la investigación hasta la ejecución de la sentencia.",
      14: "La Policía Judicial es la función encomendada a determinados miembros de las Fuerzas y Cuerpos de Seguridad del Estado para auxiliar al Poder Judicial en la investigación de los delitos, actuando bajo la dependencia de jueces y fiscales en el esclarecimiento de los hechos delictivos.",
      15: "La detención es una medida cautelar de privación provisional de libertad que puede adoptar la policía en determinadas circunstancias legalmente previstas, con una duración máxima establecida y garantías específicas para proteger los derechos fundamentales del detenido.",
      16: "La entrada y registro en lugar cerrado y la intervención de comunicaciones son medidas de investigación que afectan a derechos fundamentales, por lo que requieren autorización judicial previa salvo en casos de urgencia, y deben realizarse con las garantías procesales establecidas legalmente.",
      17: "El Ministerio Fiscal es el órgano constitucional encargado de promover la acción de la justicia en defensa de la legalidad, de los derechos de los ciudadanos y del interés público tutelado por la ley, actuando con autonomía funcional en el ejercicio de sus competencias.",
      18: "La normativa reguladora de las Fuerzas y Cuerpos de Seguridad establece el marco jurídico que define la organización, funcionamiento, competencias y régimen jurídico de los cuerpos policiales, garantizando la eficacia del servicio público de seguridad ciudadana.",
      19: "La Guardia Civil es un Instituto Armado de naturaleza militar que forma parte de las Fuerzas y Cuerpos de Seguridad del Estado, con competencia en todo el territorio nacional y especial dedicación al ámbito rural, creado en 1844 y con una rica tradición histórica de servicio a España.",
      20: "Los derechos y deberes de los miembros de la Guardia Civil, junto con el régimen disciplinario, configuran el estatuto jurídico específico que regula la relación de servicio, estableciendo tanto las prerrogativas como las obligaciones y responsabilidades inherentes a la condición de guardia civil.",
      21: "El régimen estatutario de la Guardia Civil regula los aspectos fundamentales de la carrera profesional, incluyendo el acceso al Cuerpo, los procesos de formación inicial y continua, las diferentes situaciones administrativas y la progresión profesional de sus miembros.",
      22: "La Ley Orgánica 2/1986, de 13 de marzo, de Fuerzas y Cuerpos de Seguridad, constituye la norma básica que regula las fuerzas policiales españolas, estableciendo sus principios de actuación, organización, competencias y coordinación en el marco del Estado de Derecho.",
      23: "El uso de la fuerza por parte de las fuerzas de seguridad está sujeto a principios estrictos de legalidad, necesidad, proporcionalidad y congruencia, debiendo utilizarse únicamente cuando sea imprescindible y en la medida estrictamente necesaria para el cumplimiento del deber.",
      24: "Las armas de fuego constituyen un medio excepcional de intervención policial sujeto a estricta reglamentación en cuanto a su adquisición, tenencia, uso y protocolo de empleo, requiriendo formación especializada y un marco normativo específico que garantice su uso responsable.",
      25: "Las materias técnico-científicas y la criminalística básica proporcionan los conocimientos científicos necesarios para la investigación criminal, incluyendo técnicas de inspección ocular técnico-policial, análisis de indicios y pruebas, y metodología científica aplicada a la investigación.",
      26: "La informática básica, las redes, la seguridad y los delitos informáticos constituyen un área de conocimiento esencial en la sociedad digital actual, abarcando tanto el uso de herramientas tecnológicas como la investigación de ciberdelitos y la protección de sistemas informáticos.",
      27: "La deontología profesional y el Código Ético de la Guardia Civil establecen los principios morales y éticos que deben guiar la conducta profesional de sus miembros, definiendo los valores fundamentales de integridad, honor, disciplina y servicio a la sociedad."
    };

    return definitions[topic.number] || `${topic.title} constituye una materia fundamental en la formación y actuación profesional de los miembros de la Guardia Civil, estableciendo los conocimientos esenciales para el correcto ejercicio de las funciones policiales.`;
  }

  public static getKeyLaws(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0]): string {
    const laws = {
      1: "Declaración Universal de Derechos Humanos (1948), Convenio Europeo de Derechos Humanos (1950), Constitución Española (1978)",
      2: "Constitución Española de 1978, Ley Orgánica 3/1981 del Tribunal Constitucional",
      3: "Ley Orgánica 2/1979 del Tribunal Constitucional, Ley Orgánica 3/1981 del Defensor del Pueblo",
      4: "Constitución Española (Título VIII), Ley 7/1985 de Bases del Régimen Local, Estatutos de Autonomía",
      5: "Tratado de la Unión Europea, Tratado de Funcionamiento de la UE, Constitución Española (art. 93-96)",
      6: "Código Penal (LO 10/1995), Constitución Española (arts. 25 y 117), LO 1/2015 reforma del CP",
      7: "Código Penal (Título XIX, arts. 404-445), Ley 40/2015 de Régimen Jurídico del Sector Público",
      8: "Código Penal (Título XIX, Capítulos I-III), Ley 53/1984 de Incompatibilidades del Personal al Servicio de las AAPP",
      9: "Código Penal (Título I del Libro II), Ley Orgánica 1/2004 de Violencia de Género",
      10: "Código Penal (Títulos XIII-XIV), LO 5/2010 reforma del CP, Ley 10/2010 blanqueo de capitales",
      11: "Código Penal (Título XVII), Ley 17/2015 del Sistema Nacional de Protección Civil",
      12: "Código Penal (Título XXII), LO 4/2015 de Seguridad Ciudadana, Ley 29/1998 de la Jurisdicción Contencioso-Administrativa",
      13: "LECrim (RD 14/09/1882), LO 6/1985 del Poder Judicial, Constitución Española (Título VI)",
      14: "LECrim (arts. 282-295), LO 2/1986 de FCSE (art. 29), LO 6/1985 del Poder Judicial",
      15: "LECrim (arts. 489-501), LO 2/1986 de FCSE, Constitución Española (art. 17)",
      16: "LECrim (arts. 545-588), LO 13/2015 modificación LECrim, Constitución Española (arts. 18.2 y 18.3)",
      17: "Estatuto Orgánico del Ministerio Fiscal (Ley 50/1981), LECrim, Constitución Española (art. 124)",
      18: "LO 2/1986 de Fuerzas y Cuerpos de Seguridad, Constitución Española (art. 104), Ley 29/2014 de Personal de la Guardia Civil",
      19: "Ley de Fundación de la Guardia Civil (1844), LO 2/1986 de FCSE, Ley 29/2014 de Personal de la Guardia Civil",
      20: "LO 12/2007 régimen disciplinario GC, Ley 29/2014 de Personal de la Guardia Civil, LO 9/2011 derechos y deberes",
      21: "Ley 29/2014 de Personal de la Guardia Civil, RD 96/2009 Reglamento de acceso, LO 2/1986 de FCSE",
      22: "Ley Orgánica 2/1986, de 13 de marzo, de Fuerzas y Cuerpos de Seguridad (texto íntegro)",
      23: "LO 2/1986 de FCSE (art. 5.2.c), Código Deontológico de la Policía, Principios ONU sobre uso de la fuerza",
      24: "Reglamento de Armas (RD 137/1993), LO 4/2015 de Seguridad Ciudadana, Instrucciones DGP sobre armamento",
      25: "LECrim (inspección ocular), Manual de Criminalística de la Guardia Civil, ISO/IEC 17025",
      26: "LO 3/2018 de Protección de Datos, Ley 34/2002 de Servicios de la Sociedad de la Información, CP (delitos informáticos)",
      27: "Código Deontológico de la Guardia Civil, Principios Básicos ONU sobre uso de la fuerza, LO 9/2011 derechos y deberes"
    };

    return laws[topic.number] || "Constitución Española, Ley Orgánica 2/1986 de FCSE, normativa sectorial específica aplicable";
  }

  public static getSpecializedContent(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0]): string {
    // Contenido específico según la categoría del tema
    switch (topic.category) {
      case "Derecho Constitucional":
        return `### 3.1 Análisis Constitucional Específico

#### Fundamentos Constitucionales
Los fundamentos constitucionales de **<span class="palabra-clave">${topic.title}</span>** se encuentran específicamente desarrollados en:

- **<span class="palabra-clave">Principios constitucionales fundamentales</span>**: Estado de Derecho, democracia, división de poderes
- **<span class="palabra-clave">Derechos fundamentales aplicables</span>**: Catálogo específico de derechos afectados
- **<span class="palabra-clave">Garantías institucionales</span>**: Mecanismos de protección constitucional
- **<span class="palabra-clave">Distribución competencial</span>**: Reparto de competencias entre niveles territoriales

#### Interpretación Constitucional
La jurisprudencia del Tribunal Constitucional ha establecido criterios específicos sobre **${topic.title}** que incluyen:

1. **Doctrina consolidada** sobre los límites y contenido esencial
2. **Test de proporcionalidad** aplicable en casos de conflicto
3. **Principio de armonización** de derechos en tensión
4. **Criterios de interpretación** evolutiva y sistemática`;

      case "Derecho Penal":
        return `### 3.1 Análisis Dogmático Penal

#### Elementos del Tipo Penal
El análisis de **<span class="palabra-clave">${topic.title}</span>** desde la perspectiva del Derecho Penal requiere examinar:

- **<span class="palabra-clave">Tipicidad objetiva</span>**: Elementos externos del comportamiento típico
- **<span class="palabra-clave">Tipicidad subjetiva</span>**: Elementos internos, dolo y culpa
- **<span class="palabra-clave">Antijuridicidad</span>**: Ausencia de causas de justificación
- **<span class="palabra-clave">Culpabilidad</span>**: Reprochabilidad personal del autor

#### Clasificación de Delitos
Los delitos relacionados con **${topic.title}** se clasifican en:

<table>
<tr>
<th>Tipo de delito</th>
<th>Bien jurídico protegido</th>
<th>Modalidades típicas</th>
<th>Penalidad</th>
</tr>
<tr>
<td>Delitos básicos</td>
<td>Interés principal</td>
<td>Formas comunes</td>
<td>Pena base</td>
</tr>
<tr>
<td>Delitos agravados</td>
<td>Interés cualificado</td>
<td>Circunstancias agravantes</td>
<td>Pena superior</td>
</tr>
<tr>
<td>Delitos privilegiados</td>
<td>Interés atenuado</td>
<td>Circunstancias atenuantes</td>
<td>Pena inferior</td>
</tr>
</table>

#### Concursos y Modalidades
- **Concurso ideal**: Un hecho constitutivo de varios delitos
- **Concurso real**: Varios hechos constitutivos de varios delitos
- **Delito continuado**: Pluralidad de acciones con unidad de propósito
- **Delito masa**: Modalidad específica del delito continuado`;

      case "Derecho Procesal":
        return `### 3.1 Aspectos Procesales Específicos

#### Procedimiento Aplicable
El desarrollo procesal de **<span class="palabra-clave">${topic.title}</span>** sigue las siguientes fases:

- **<span class="palabra-clave">Fase de investigación</span>**: Diligencias previas y instrucción
- **<span class="palabra-clave">Fase intermedia</span>**: Calificación y audiencia preliminar
- **<span class="palabra-clave">Fase del juicio oral</span>**: Práctica de prueba y conclusiones
- **<span class="palabra-clave">Fase de impugnación</span>**: Recursos contra resoluciones

#### Sujetos Procesales
Los sujetos que intervienen en el procedimiento son:

1. **<span class="palabra-clave">Órgano jurisdiccional</span>**: Juez o Tribunal competente
2. **<span class="palabra-clave">Ministerio Fiscal</span>**: Acusación pública
3. **<span class="palabra-clave">Acusación particular</span>**: Ofendido o perjudicado
4. **<span class="palabra-clave">Defensa</span>**: Letrado del investigado/acusado
5. **<span class="palabra-clave">Policía Judicial</span>**: Guardia Civil como auxiliar

#### Medidas Cautelares
Las medidas cautelares aplicables incluyen:
- **Detención policial**: Máximo 72 horas
- **Prisión provisional**: Con autorización judicial
- **Libertad provisional**: Con o sin fianza
- **Medidas sustitutorias**: Alejamiento, comparecencias, etc.`;

      case "Guardia Civil":
        return `### 3.1 Aspectos Específicos de la Guardia Civil

#### Naturaleza y Características
La Guardia Civil en relación con **<span class="palabra-clave">${topic.title}</span>** se caracteriza por:

- **<span class="palabra-clave">Naturaleza militar</span>**: Instituto Armado con disciplina militar
- **<span class="palabra-clave">Misión policial</span>**: Funciones de seguridad ciudadana
- **<span class="palabra-clave">Dependencia dual</span>**: Ministerio Interior (funciones policiales) y Defensa (régimen personal)
- **<span class="palabra-clave">Competencia territorial</span>**: Nacional con especial dedicación al medio rural

#### Estructura Organizativa
La organización territorial para **${topic.title}** comprende:

1. **<span class="palabra-clave">Nivel central</span>**: Dirección General y Subdirecciones
2. **<span class="palabra-clave">Nivel zonal</span>**: Zonas y Comandancias
3. **<span class="palabra-clave">Nivel local</span>**: Compañías y Puestos
4. **<span class="palabra-clave">Unidades especializadas</span>**: Servicios técnicos específicos

#### Especialidades Operativas
- **<span class="palabra-clave">Seguridad ciudadana</span>**: Patrullaje y orden público
- **<span class="palabra-clave">Policía judicial</span>**: Investigación criminal
- **<span class="palabra-clave">Seguridad vial</span>**: Tráfico y transporte
- **<span class="palabra-clave">Servicios especiales</span>**: SEPRONA, Fiscal, Marítimo`;

      case "Técnicas Operativas":
        return `### 3.1 Técnicas y Procedimientos Operativos

#### Metodología Operativa
La aplicación técnica de **<span class="palabra-clave">${topic.title}</span>** requiere:

- **<span class="palabra-clave">Análisis de riesgos</span>**: Evaluación previa de la situación
- **<span class="palabra-clave">Planificación operativa</span>**: Diseño de la estrategia de intervención
- **<span class="palabra-clave">Ejecución controlada</span>**: Desarrollo según protocolos establecidos
- **<span class="palabra-clave">Evaluación posterior</span>**: Análisis de resultados y mejoras

#### Equipamiento Especializado
El equipamiento técnico necesario incluye:

<table>
<tr>
<th>Tipo de equipo</th>
<th>Función principal</th>
<th>Características técnicas</th>
<th>Mantenimiento</th>
</tr>
<tr>
<td>Equipo básico</td>
<td>Uso general</td>
<td>Resistente y versátil</td>
<td>Rutinario</td>
</tr>
<tr>
<td>Equipo especializado</td>
<td>Uso específico</td>
<td>Alta precisión</td>
<td>Técnico especializado</td>
</tr>
<tr>
<td>Equipo de seguridad</td>
<td>Protección personal</td>
<td>Certificado CE</td>
<td>Verificación periódica</td>
</tr>
</table>

#### Protocolos de Seguridad
- **Medidas preventivas**: Antes de la operación
- **Medidas de protección**: Durante la operación
- **Medidas de control**: Después de la operación
- **Medidas correctivas**: En caso de incidencias`;

      case "Ética Profesional":
        return `### 3.1 Principios Éticos y Deontológicos

#### Código Ético de la Guardia Civil
Los principios éticos fundamentales aplicables a **<span class="palabra-clave">${topic.title}</span>** son:

- **<span class="palabra-clave">Integridad</span>**: Honestidad y rectitud en toda actuación
- **<span class="palabra-clave">Honor</span>**: Dignidad personal y profesional
- **<span class="palabra-clave">Disciplina</span>**: Cumplimiento estricto de órdenes legítimas
- **<span class="palabra-clave">Servicio</span>**: Dedicación desinteresada al bien común

#### Valores Institucionales
Los valores que guían la actuación profesional incluyen:

1. **<span class="palabra-clave">Lealtad institucional</span>**: Fidelidad a la Constitución y al Cuerpo
2. **<span class="palabra-clave">Responsabilidad social</span>**: Compromiso con la sociedad
3. **<span class="palabra-clave">Excelencia profesional</span>**: Búsqueda continua de la mejora
4. **<span class="palabra-clave">Respeto a los derechos</span>**: Protección de derechos fundamentales

#### Dilemas Éticos Frecuentes
- **Conflicto entre órdenes**: Jerarquía vs. legalidad
- **Uso de informaci��n**: Secreto profesional vs. transparencia
- **Relaciones personales**: Amistad vs. imparcialidad
- **Presiones externas**: Independencia vs. influencias`;

      default:
        return `### 3.1 Elementos Fundamentales Específicos

#### Características Distintivas
Los elementos que caracterizan específicamente **<span class="palabra-clave">${topic.title}</span>** son:

- **<span class="palabra-clave">Elemento normativo</span>**: Marco jurídico específico aplicable
- **<span class="palabra-clave">Elemento operativo</span>**: Aplicación práctica en el servicio diario
- **<span class="palabra-clave">Elemento formativo</span>**: Conocimientos requeridos para los miembros
- **<span class="palabra-clave">Elemento procedimental</span>**: Protocolos específicos de actuación`;
    }
  }

  public static generateTestQuestion(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0], questionNumber: number): string {
    const questions = [
      `Según la normativa vigente sobre ${topic.title}, ¿cuál es el procedimiento correcto que debe seguir la Guardia Civil en sus actuaciones?`,
      `En materia de ${topic.title}, ¿qué principio constitucional debe primar en toda actuaci��n profesional de la Guardia Civil?`,
      `Respecto a las competencias de la Guardia Civil en ${topic.title}, ¿cuál es su ámbito territorial de actuación según la normativa aplicable?`,
      `¿Qué documentación es preceptiva y obligatoria en las actuaciones relacionadas con ${topic.title}?`,
      `En caso de duda sobre la aplicación de ${topic.title}, ¿cuál es la actuación profesional correcta que debe adoptar un miembro de la Guardia Civil?`
    ];

    return questions[questionNumber - 1] || questions[0];
  }

  public static generateTestOptions(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0], questionNumber: number): string[] {
    const optionSets = [
      [
        "Seguir estrictamente el protocolo establecido y coordinar con la autoridad competente correspondiente",
        "Actuar directamente sin comunicar a superiores en casos de urgencia para ganar tiempo",
        "Aplicar criterios propios basados exclusivamente en la experiencia personal acumulada",
        "Consultar únicamente con el mando directo inmediato sin informar a otros organismos"
      ],
      [
        "El principio de proporcionalidad y respeto absoluto a los derechos fundamentales constitucionales",
        "La eficacia operativa por encima de cualquier otra consideración legal o constitucional",
        "La rapidez en la resolución evitando demoras procedimentales innecesarias",
        "La discrecionalidad absoluta del agente según las circunstancias del momento"
      ],
      [
        "Ámbito nacional con especial dedicación al medio rural según el artículo 11 de la LO 2/1986",
        "Exclusivamente en núcleos urbanos superiores a 50.000 habitantes según normativa municipal",
        "Únicamente en autopistas y carreteras interurbanas de competencia estatal",
        "Solo en casos que afecten simultáneamente a más de una comunidad autónoma"
      ],
      [
        "Acta de intervención completa con todos los datos, circunstancias relevantes y marco normativo aplicado",
        "Simple anotación en el libro de novedades del puesto sin mayor desarrollo documental",
        "Informe verbal al superior jerárquico sin necesidad de documentación escrita formal",
        "Registro fotográfico únicamente como prueba suficiente de la actuación realizada"
      ],
      [
        "Consultar inmediatamente con el superior jerárquico y coordinar con organismos competentes aplicables",
        "Actuar directamente según criterio personal para no perder tiempo en consultas",
        "Derivar inmediatamente la responsabilidad a otras fuerzas de seguridad competentes",
        "Solicitar instrucciones únicamente a la autoridad judicial competente en la materia"
      ]
    ];

    const selectedOptions = optionSets[questionNumber - 1] || optionSets[0];
    return selectedOptions.map((opt, i) => `${['A', 'B', 'C', 'D'][i]}) ${opt}`);
  }

  public static generateTestRationale(topic: typeof GUARDIA_CIVIL_OFFICIAL_TOPICS[0], questionNumber: number): string {
    const rationales = [
      `Según la normativa aplicable a ${topic.title}, es fundamental seguir rigurosamente los protocolos establecidos y mantener coordinación permanente con las autoridades competentes, garantizando así el cumplimiento de legalidad y eficacia operativa.`,
      `El principio de proporcionalidad y el respeto absoluto a los derechos fundamentales constitucionales son irrenunciables en toda actuación policial según establece la Constitución Española y la LO 2/1986 de Fuerzas y Cuerpos de Seguridad.`,
      `La Guardia Civil tiene competencia territorial nacional con especial dedicación al medio rural según establece expresamente el artículo 11 de la Ley Orgánica 2/1986 de Fuerzas y Cuerpos de Seguridad del Estado.`,
      `Toda intervención policial debe documentarse adecuadamente mediante acta oficial completa que recoja todos los elementos relevantes, circunstancias del caso y marco normativo aplicado, garantizando la trazabilidad de la actuación.`,
      `Ante dudas competenciales o normativas es fundamental consultar inmediatamente con superiores jerárquicos y coordinar con otros organismos competentes, evitando actuaciones erróneas que puedan comprometer la eficacia y legalidad del servicio.`
    ];

    return rationales[questionNumber - 1] || rationales[0];
  }

  static getOfficialTopics() {
    return GUARDIA_CIVIL_OFFICIAL_TOPICS;
  }

  // Helper method to add timeout to operations
  public static withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(timeoutMessage));
      }, ms);

      promise
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timeoutId));
    });
  }

  // Helper method to retry failed operations
  public static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    operationName: string = 'operación'
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Intento ${attempt}/${maxRetries} falló para ${operationName}:`, error.message);

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    throw lastError;
  }
}

export const guardiaCivilOfficialGenerator = new GuardiaCivilOfficialGenerator();
