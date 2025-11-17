// Generador de PDFs profesionales de máxima calidad
// Diseño académico-profesional con tipografía y formato excelente

export interface PDFContent {
  title: string;
  content: string;
  metadata: {
    pages: number;
    wordCount: number;
    generatedAt: string;
    assistant: string;
  };
}

export class ProfessionalPDFGenerator {
  
  public generateHighQualityPDF(themeName: string, assistantName: string, themeNumber: number): PDFContent {
    const content = this.generateAcademicContent(themeName, assistantName, themeNumber);
    const htmlContent = this.createProfessionalHTML(content, themeName, assistantName, themeNumber);
    
    return {
      title: `${themeName} - ${assistantName}`,
      content: htmlContent,
      metadata: {
        pages: Math.ceil(content.split(' ').length / 300), // ~300 palabras por página
        wordCount: content.split(' ').length,
        generatedAt: new Date().toISOString(),
        assistant: assistantName
      }
    };
  }

  private generateAcademicContent(themeName: string, assistantName: string, themeNumber: number): string {
    const contentSections = this.getContentByTheme(themeName, assistantName);
    
    return `
# ${themeName}

## Objetivos de Aprendizaje

Al finalizar el estudio de este tema, el candidato será capaz de:

• Comprender los fundamentos teóricos de ${themeName}
• Aplicar los conocimientos adquiridos en situaciones prácticas
• Analizar casos reales relacionados con la materia
• Resolver ejercicios y problemas específicos del área
• Integrar los conceptos con otras materias del temario

## 1. Introducción y Marco Conceptual

${contentSections.introduction}

La importancia de ${themeName} en el contexto de ${assistantName} radica en su aplicación práctica y su relevancia en el ejercicio profesional. Los conceptos aquí desarrollados constituyen la base fundamental para la comprensión de materias más avanzadas y para el desempeño competente en el ámbito laboral.

## 2. Desarrollo Teórico

### 2.1 Fundamentos Básicos

${contentSections.fundamentals}

### 2.2 Principios Operativos

Los principios que rigen ${themeName} se basan en:

1. **Principio de Legalidad**: Toda actuación debe estar respaldada por la normativa vigente
2. **Principio de Eficacia**: Las acciones deben orientarse al logro de objetivos específicos
3. **Principio de Transparencia**: Los procedimientos deben ser claros y accesibles
4. **Principio de Responsabilidad**: Cada actuación conlleva responsabilidades definidas

### 2.3 Marco Normativo

${contentSections.legalFramework}

## 3. Aspectos Prácticos y Procedimentales

### 3.1 Procedimientos Estándar

Los procedimientos relacionados con ${themeName} siguen una estructura definida:

**Fase Inicial:**
- Identificación de la situación
- Análisis de requisitos
- Planificación de actuaciones

**Fase de Desarrollo:**
- Ejecución de procedimientos
- Seguimiento y control
- Documentación de actuaciones

**Fase Final:**
- Evaluación de resultados
- Elaboración de informes
- Archivo de documentación

### 3.2 Casos Prácticos

${contentSections.practicalCases}

## 4. Normativa Específica

### 4.1 Legislación Básica

${contentSections.legislation}

### 4.2 Reglamentación de Desarrollo

La normativa reglamentaria desarrolla los aspectos técnicos y procedimentales, estableciendo:

• Criterios específicos de aplicación
• Procedimientos detallados
• Formularios y documentación
• Plazos y términos
• Responsabilidades y competencias

## 5. Jurisprudencia Relevante

${contentSections.jurisprudence}

## 6. Aspectos Controvertidos y Debate Académico

${contentSections.controversies}

## 7. Mejores Prácticas Profesionales

### 7.1 Recomendaciones Generales

Para una aplicación efectiva de ${themeName}, se recomienda:

1. Mantenerse actualizado en la normativa vigente
2. Aplicar criterios de proporcionalidad y equidad
3. Documentar adecuadamente todas las actuaciones
4. Buscar la coordinación con otros profesionales
5. Priorizar el interés general y el servicio público

### 7.2 Herramientas y Recursos

${contentSections.tools}

## 8. Tendencias Futuras y Innovación

${contentSections.trends}

## 9. Resumen Ejecutivo

${contentSections.summary}

## 10. Puntos Clave para Recordar

• **Concepto central**: ${themeName} como elemento fundamental
• **Aplicación práctica**: Integración en procedimientos operativos
• **Marco legal**: Sustento normativo y jurisprudencial
• **Mejores prácticas**: Criterios de excelencia profesional
• **Tendencias**: Evolución y perspectivas de futuro

## 11. Bibliografía y Referencias

### Legislación
- Constitución Española de 1978
- Normativa específica de ${assistantName}
- Reglamentación de desarrollo

### Doctrina
- Manuales especializados
- Artículos de revistas jurídicas
- Estudios monográficos

### Jurisprudencia
- Sentencias del Tribunal Constitucional
- Resoluciones del Tribunal Supremo
- Jurisprudencia menor relevante

---

*Documento elaborado para la preparación de oposiciones de ${assistantName}*
*Tema ${themeNumber}: ${themeName}*
*Fecha de elaboración: ${new Date().toLocaleDateString('es-ES')}*
    `.trim();
  }

  private getContentByTheme(themeName: string, assistantName: string) {
    // Contenido específico por tema - mucho más detallado
    const contentDatabase = {
      "Constitución Española": {
        introduction: `La Constitución Española de 1978 constituye la norma suprema del ordenamiento jurídico español. Su estudio resulta fundamental para cualquier profesional del ámbito público, especialmente en ${assistantName}, donde sus principios y preceptos constituyen el marco de referencia obligatorio para toda actuación profesional.`,
        
        fundamentals: `La Constitución establece los principios fundamentales del Estado español: soberanía nacional, monarquía parlamentaria, Estado social y democrático de Derecho, y unidad indivisible de la Nación española. Estos principios se desarrollan a lo largo de sus 169 artículos, organizados en un Título Preliminar y diez Títulos adicionales.`,
        
        legalFramework: `El marco normativo constitucional se articula en torno a varios elementos clave: la organización territorial del Estado (Título VIII), el sistema de derechos fundamentales y libertades públicas (Título I), la organización de los poderes del Estado (Títulos II a VI), y los mecanismos de reforma constitucional (Título X).`,
        
        practicalCases: `En la práctica profesional de ${assistantName}, la aplicación constitucional se manifiesta en: respeto a los derechos fundamentales en todas las actuaciones, aplicación del principio de legalidad, garantía del debido proceso, y coordinación con las diferentes administraciones territoriales según el reparto competencial establecido.`,
        
        legislation: `La legislación básica comprende la propia Constitución (BOE 29/12/1978), las Leyes Orgánicas de desarrollo de derechos fundamentales, los Estatutos de Autonomía, y la legislación específica de ${assistantName} que debe ajustarse en todo caso al marco constitucional.`,
        
        jurisprudence: `La jurisprudencia del Tribunal Constitucional ha perfilado la interpretación de numerosos preceptos constitucionales, estableciendo doctrina consolidada sobre aspectos como el principio de proporcionalidad, el contenido esencial de los derechos fundamentales, y los límites del ejercicio de las competencias autonómicas.`,
        
        controversies: `Los principales debates doctrinales giran en torno a la interpretación del Estado autonómico, los límites entre las competencias estatales y autonómicas, la evolución del concepto de nación, y la adaptación de los derechos fundamentales a las nuevas realidades tecnológicas y sociales.`,
        
        tools: `Las herramientas principales incluyen: bases de datos jurisprudenciales (CENDOJ, Aranzadi), repertorios legislativos actualizados, comentarios doctrinales especializados, y manuales académicos de referencia. Es fundamental disponer de versiones actualizadas de la Constitución con las reformas incorporadas.`,
        
        trends: `Las tendencias futuras apuntan hacia una mayor integración europea que puede afectar al marco constitucional, la digitalización de los procedimientos administrativos, y la necesidad de adaptar los derechos fundamentales a los retos del siglo XXI como la inteligencia artificial y la sostenibilidad ambiental.`,
        
        summary: `La Constitución Española establece el marco jurídico fundamental del Estado, consagrando principios democráticos, derechos fundamentales y la organización territorial. Su conocimiento profundo es imprescindible para el ejercicio profesional en ${assistantName}, siendo la referencia normativa suprema para toda actuación pública.`
      },

      "Organización del Estado": {
        introduction: `La organización del Estado español responde al modelo de monarquía parlamentaria establecido en la Constitución de 1978. Su comprensión es esencial para los profesionales de ${assistantName}, ya que determina el marco institucional en el que se desarrolla su actividad profesional.`,
        
        fundamentals: `El Estado se organiza en torno a tres poderes: Legislativo (Cortes Generales), Ejecutivo (Gobierno) y Judicial (Poder Judicial), con la Corona como institución arbitral y moderadora. Esta división de poderes garantiza el equilibrio democrático y el Estado de Derecho.`,
        
        legalFramework: `La organización estatal se rige por la Constitución, desarrollada por leyes orgánicas específicas como la del Tribunal Constitucional, del Poder Judicial, del Consejo General del Poder Judicial, del Tribunal de Cuentas, y del Defensor del Pueblo.`,
        
        practicalCases: `En ${assistantName}, la organización estatal se refleja en: jerarquía administrativa, competencias ministeriales, coordinación interadministrativa, y procedimientos de relación con otros poderes del Estado. Es crucial entender las vías de comunicación y coordinación institucional.`,
        
        legislation: `Marco normativo: Constitución Española (Títulos II-VI), Ley del Gobierno, Ley de Organización y Funcionamiento de la Administración General del Estado, Ley Orgánica del Poder Judicial, y legislación específica de ${assistantName}.`,
        
        jurisprudence: `La jurisprudencia ha precisado aspectos como la separación de poderes, los límites del control parlamentario, la responsabilidad gubernamental, y los mecanismos de control jurisdiccional de la actividad administrativa.`,
        
        controversies: `Debates actuales: equilibrio entre eficacia y control democrático, coordinación entre niveles territoriales, independencia del poder judicial, y modernización de las instituciones ante los retos contemporáneos.`,
        
        tools: `Recursos fundamentales: organigramas institucionales actualizados, directorio de instituciones, bases normativas, y canales oficiales de comunicación interinstitucional.`,
        
        trends: `Evolución hacia una mayor transparencia institucional, digitalización de procedimientos, participación ciudadana en las decisiones públicas, y adaptación a los estándares europeos de buena administración.`,
        
        summary: `La organización del Estado español garantiza la separación de poderes y el funcionamiento democrático. Para ${assistantName}, supone el marco institucional de referencia que determina competencias, procedimientos y relaciones interadministrativas.`
      }
    };

    return contentDatabase[themeName] || contentDatabase["Constitución Española"];
  }

  private createProfessionalHTML(content: string, themeName: string, assistantName: string, themeNumber: number): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${themeName} - ${assistantName}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
        
        :root {
            --primary-color: #1e3a8a;
            --secondary-color: #1e40af;
            --accent-color: #3b82f6;
            --text-color: #1f2937;
            --light-bg: #f8fafc;
            --border-color: #e5e7eb;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: A4;
            margin: 2.5cm 2cm 2cm 2cm;
            @bottom-center {
                content: "Página " counter(page) " de " counter(pages);
                font-family: 'Source Sans Pro', sans-serif;
                font-size: 10pt;
                color: #6b7280;
            }
            @top-right {
                content: "${themeName} - ${assistantName}";
                font-family: 'Source Sans Pro', sans-serif;
                font-size: 9pt;
                color: #6b7280;
            }
        }

        @page:first {
            @top-right { content: none; }
            @bottom-center { content: none; }
        }

        body {
            font-family: 'Crimson Text', serif;
            font-size: 12pt;
            line-height: 1.6;
            color: var(--text-color);
            background: white;
            text-align: justify;
            text-justify: inter-word;
        }

        .cover-page {
            text-align: center;
            padding: 4cm 0;
            page-break-after: always;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            margin: -2.5cm -2cm -2cm -2cm;
            padding: 4cm 2cm;
        }

        .cover-title {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 28pt;
            font-weight: 700;
            margin-bottom: 1.5cm;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .cover-subtitle {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 18pt;
            font-weight: 300;
            margin-bottom: 2cm;
            opacity: 0.9;
        }

        .cover-theme {
            font-size: 16pt;
            font-weight: 600;
            margin-bottom: 1cm;
            padding: 0.5cm 1cm;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            display: inline-block;
        }

        .cover-footer {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 12pt;
            font-weight: 400;
            position: absolute;
            bottom: 2cm;
            left: 2cm;
            right: 2cm;
            opacity: 0.8;
        }

        h1 {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 24pt;
            font-weight: 700;
            color: var(--primary-color);
            margin: 1.5em 0 0.8em 0;
            padding-bottom: 0.3em;
            border-bottom: 3px solid var(--accent-color);
            page-break-before: always;
        }

        h1:first-of-type {
            page-break-before: avoid;
        }

        h2 {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 18pt;
            font-weight: 600;
            color: var(--secondary-color);
            margin: 1.2em 0 0.6em 0;
            padding-left: 0.3em;
            border-left: 4px solid var(--accent-color);
        }

        h3 {
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 14pt;
            font-weight: 600;
            color: var(--text-color);
            margin: 1em 0 0.5em 0;
        }

        p {
            margin-bottom: 1em;
            text-indent: 1.2em;
        }

        .objectives, .summary, .key-points {
            background: var(--light-bg);
            padding: 1.5em;
            border-radius: 8px;
            border-left: 5px solid var(--accent-color);
            margin: 1.5em 0;
        }

        .objectives h2, .summary h2, .key-points h2 {
            margin-top: 0;
            border-left: none;
            padding-left: 0;
        }

        ul, ol {
            margin: 1em 0 1em 2em;
        }

        li {
            margin-bottom: 0.5em;
            line-height: 1.5;
        }

        .highlighted-box {
            background: #fef7cd;
            border: 1px solid #f59e0b;
            border-radius: 6px;
            padding: 1em;
            margin: 1em 0;
        }

        .legal-reference {
            font-style: italic;
            color: var(--secondary-color);
            font-weight: 600;
        }

        .bibliography {
            page-break-before: always;
            margin-top: 2em;
        }

        .bibliography h2 {
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 0.5em;
        }

        .document-footer {
            margin-top: 3em;
            padding-top: 1em;
            border-top: 2px solid var(--border-color);
            font-family: 'Source Sans Pro', sans-serif;
            font-size: 10pt;
            color: #6b7280;
            text-align: center;
        }

        .page-break {
            page-break-before: always;
        }

        @media print {
            body { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
    </style>
</head>
<body>
    <div class="cover-page">
        <div class="cover-title">${assistantName}</div>
        <div class="cover-subtitle">Material de Estudio Profesional</div>
        <div class="cover-theme">Tema ${themeNumber}: ${themeName}</div>
        <div class="cover-footer">
            <div>Documento elaborado para la preparación de oposiciones</div>
            <div>${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
    </div>

    <div class="content">
        ${this.convertMarkdownToHTML(content)}
    </div>

    <div class="document-footer">
        <p><strong>${themeName}</strong> | ${assistantName}</p>
        <p>Material de preparación profesional | ${new Date().getFullYear()}</p>
    </div>
</body>
</html>`;
  }

  private convertMarkdownToHTML(markdown: string): string {
    return markdown
      // Títulos
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      
      // Texto en negrita
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      
      // Listas con viñetas
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      
      // Listas numeradas
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      
      // Párrafos
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hl]|<ul|<ol|<li)(.+)$/gm, '<p>$1</p>')
      
      // Limpiar HTML malformado
      .replace(/<p><h([1-3])>/g, '<h$1>')
      .replace(/<\/h([1-3])><\/p>/g, '</h$1>')
      .replace(/<p><ul>/g, '<ul>')
      .replace(/<\/ul><\/p>/g, '</ul>')
      .replace(/<p><\/p>/g, '')
      
      // Cajas especiales
      .replace(/<p>## Objetivos de Aprendizaje<\/p>/g, '<div class="objectives"><h2>Objetivos de Aprendizaje</h2>')
      .replace(/<p>## 9\. Resumen Ejecutivo<\/p>/g, '</div><div class="summary"><h2>Resumen Ejecutivo</h2>')
      .replace(/<p>## 10\. Puntos Clave para Recordar<\/p>/g, '</div><div class="key-points"><h2>Puntos Clave para Recordar</h2>')
      .replace(/<p>## 11\. Bibliografía y Referencias<\/p>/g, '</div><div class="bibliography"><h2>Bibliografía y Referencias</h2>');
  }
}

// Función principal para generar PDFs profesionales
export const generateProfessionalPDF = (themeName: string, assistantName: string, themeNumber: number): PDFContent => {
  const generator = new ProfessionalPDFGenerator();
  return generator.generateHighQualityPDF(themeName, assistantName, themeNumber);
};
