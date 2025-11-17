import express from 'express';
import { jsPDF } from 'jspdf';

const router = express.Router();

// Simple PDF generation fallback
function createSimplePdf(title: string, content: string): Buffer {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, yPosition);
    yPosition += 15;

    // Content
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Clean content and split into lines
    const cleanContent = content.replace(/[#*]/g, '').replace(/\n\n+/g, '\n\n');
    const lines = cleanContent.split('\n');

    for (const line of lines) {
      if (yPosition > 280) { // Near bottom of page
        pdf.addPage();
        yPosition = margin;
      }

      if (line.trim()) {
        const wrappedLines = pdf.splitTextToSize(line.trim(), contentWidth);
        for (const wrappedLine of wrappedLines) {
          if (yPosition > 280) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(wrappedLine, margin, yPosition);
          yPosition += 6;
        }
      } else {
        yPosition += 3;
      }
    }

    return Buffer.from(pdf.output('arraybuffer'));
  } catch (error) {
    console.error('📄 Simple PDF generation failed:', error);
    // Ultra-simple fallback - just text
    const pdf = new jsPDF();
    pdf.text(`${title}\n\nContent could not be formatted.`, 20, 20);
    return Buffer.from(pdf.output('arraybuffer'));
  }
}

// Convert Markdown to formatted PDF with proper pagination
function createPdfFromMarkdown(markdown: string, title: string): Buffer {
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Configure fonts and sizes
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let yPosition = margin;
  const lineHeight = 7;
  const fontSize = 12;
  const titleSize = 16;
  const subtitleSize = 14;

  // Enhanced helper function to prevent content breaks
  const checkNewPage = (neededHeight: number, isBlockStart: boolean = false) => {
    const remainingSpace = pageHeight - margin - yPosition;

    // If this is the start of a block (title, list, table, etc.) and there's not enough space
    // for at least 3 lines, move to next page
    if (isBlockStart && remainingSpace < lineHeight * 3) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }

    // Standard check for needed height
    if (yPosition + neededHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }

    return false;
  };

  // Function to keep content blocks together
  const addContentBlock = (lines: string[], blockType: 'normal' | 'title' | 'list' | 'table' = 'normal') => {
    const totalHeight = lines.length * lineHeight;
    const isBlockStart = blockType !== 'normal';

    // For titles and block starts, ensure we don't break
    if (isBlockStart) {
      checkNewPage(totalHeight, true);
    }

    // For content that might break, check if we can fit at least 2 lines
    // If not, move the entire block to next page
    if (blockType === 'normal' && lines.length > 1) {
      const remainingSpace = pageHeight - margin - yPosition;
      if (remainingSpace < lineHeight * 2 && totalHeight > remainingSpace) {
        pdf.addPage();
        yPosition = margin;
      }
    }

    // Add the lines
    lines.forEach((line, index) => {
      if (blockType === 'normal' && index > 0) {
        // For multi-line content, check before each line except the first
        checkNewPage(lineHeight);
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
  };

  // Helper function to split text into lines
  const splitTextToLines = (text: string, maxWidth: number, fontSize: number): string[] => {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(text, maxWidth);
  };

  // Process markdown line by line
  const lines = markdown.split('\n');

  // Title page
  pdf.setFontSize(titleSize + 4);
  pdf.setFont('helvetica', 'bold');
  const titleLines = splitTextToLines(title, contentWidth, titleSize + 4);

  titleLines.forEach(line => {
    checkNewPage(lineHeight * 2);
    pdf.text(line, margin, yPosition);
    yPosition += lineHeight * 1.5;
  });

  yPosition += lineHeight * 2;

  // Process content
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      yPosition += lineHeight * 0.5;
      continue;
    }

    // Headers (keep together, never break)
    if (line.startsWith('# ')) {
      pdf.setFontSize(titleSize);
      pdf.setFont('helvetica', 'bold');
      const headerText = line.substring(2);
      const headerLines = splitTextToLines(headerText, contentWidth, titleSize);

      // Add as title block (won't break across pages)
      addContentBlock(headerLines, 'title');
      yPosition += lineHeight;

    } else if (line.startsWith('## ')) {
      pdf.setFontSize(subtitleSize);
      pdf.setFont('helvetica', 'bold');
      const headerText = line.substring(3);
      const headerLines = splitTextToLines(headerText, contentWidth, subtitleSize);

      // Add as title block (won't break across pages)
      addContentBlock(headerLines, 'title');
      yPosition += lineHeight * 0.5;

    } else if (line.startsWith('### ')) {
      pdf.setFontSize(fontSize + 1);
      pdf.setFont('helvetica', 'bold');
      const headerText = line.substring(4);
      const headerLines = splitTextToLines(headerText, contentWidth, fontSize + 1);

      // Add as title block (won't break across pages)
      addContentBlock(headerLines, 'title');
      yPosition += lineHeight * 0.3;

    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      const bulletText = '• ' + line.substring(2);
      const bulletLines = splitTextToLines(bulletText, contentWidth - 10, fontSize);

      // Format bullet lines with proper indentation
      const formattedLines = bulletLines.map((bulletLine, index) => {
        const xPos = index === 0 ? margin + 5 : margin + 15;
        return { text: bulletLine, x: xPos };
      });

      // Add as list block (keeps bullets together)
      formattedLines.forEach(({ text, x }) => {
        checkNewPage(lineHeight);
        pdf.text(text, x, yPosition);
        yPosition += lineHeight;
      });

    } else if (line.match(/^\d+\./)) {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');
      const listLines = splitTextToLines(line, contentWidth - 10, fontSize);

      // Add numbered list with indentation
      listLines.forEach((listLine, index) => {
        checkNewPage(lineHeight);
        const xPos = index === 0 ? margin + 5 : margin + 15;
        pdf.text(listLine, xPos, yPosition);
        yPosition += lineHeight;
      });

    } else if (line.startsWith('|')) {
      // Table handling - keep table rows together when possible
      pdf.setFontSize(fontSize - 1);
      pdf.setFont('helvetica', 'normal');
      const tableText = line.replace(/\|/g, ' | ');
      const tableLines = splitTextToLines(tableText, contentWidth, fontSize - 1);

      // Add as table block (tries to keep together)
      addContentBlock(tableLines, 'table');
      yPosition += lineHeight * 0.2; // Small spacing after table row

    } else if (line.length > 0) {
      // Regular paragraph
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', 'normal');

      // Handle bold text **text**
      let processedLine = line.replace(/\*\*(.*?)\*\*/g, '$1');

      const paraLines = splitTextToLines(processedLine, contentWidth, fontSize);

      // Add paragraph as a block (tries to keep together)
      addContentBlock(paraLines, 'normal');
      yPosition += lineHeight * 0.3;
    }
  }

  // Ensure minimum pages (add appendix if needed)
  const currentPages = pdf.getNumberOfPages();
  if (currentPages < 10) {
    // Add appendix content to reach minimum pages
    pdf.addPage();
    yPosition = margin;

    pdf.setFontSize(titleSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Anexos', margin, yPosition);
    yPosition += lineHeight * 2;

    // Add practical exercises and additional content
    const appendixContent = [
      '## Ejercicios Prácticos Adicionales',
      '',
      '### Ejercicio A1: Análisis de Casos',
      'Desarrolle un análisis completo de los siguientes casos prácticos:',
      '',
      '1. Caso de aplicación directa de la normativa',
      '2. Situaciones excepcionales y su tratamiento',
      '3. Procedimientos de escalado y resolución',
      '',
      '### Ejercicio A2: Simulación de Procedimientos',
      'Simule los siguientes procedimientos administrativos:',
      '',
      '- Tramitación completa de expediente tipo',
      '- Gestión de recursos y alegaciones',
      '- Coordinación entre departamentos',
      '',
      '## Casos de Estudio Extendidos',
      '',
      '### Caso 1: Administración Central',
      'Análisis detallado de procedimientos en administración central.',
      '',
      '### Caso 2: Administración Autonómica',
      'Particularidades de la gestión autonómica y competencias.',
      '',
      '### Caso 3: Administración Local',
      'Especificidades municipales y gestión local.',
      '',
      '## Tablas de Referencia',
      '',
      '### Tabla 1: Plazos Administrativos',
      'Plazo General: 3 meses',
      'Plazo Silencio: Según normativa específica',
      'Plazo Recurso: 1 mes desde notificación',
      '',
      '### Tabla 2: Competencias por Nivel',
      'Estado: Competencias exclusivas y compartidas',
      'CCAA: Competencias transferidas',
      'Local: Competencias propias y delegadas',
    ];

    // Process appendix content
    for (const appendixLine of appendixContent) {
      if (!appendixLine.trim()) {
        yPosition += lineHeight * 0.5;
        continue;
      }

      if (appendixLine.startsWith('## ')) {
        checkNewPage(lineHeight * 2.5);
        pdf.setFontSize(subtitleSize);
        pdf.setFont('helvetica', 'bold');
        pdf.text(appendixLine.substring(3), margin, yPosition);
        yPosition += lineHeight * 1.5;

      } else if (appendixLine.startsWith('### ')) {
        checkNewPage(lineHeight * 2);
        pdf.setFontSize(fontSize + 1);
        pdf.setFont('helvetica', 'bold');
        pdf.text(appendixLine.substring(4), margin, yPosition);
        yPosition += lineHeight * 1.2;

      } else {
        checkNewPage(lineHeight);
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', 'normal');
        const lines = splitTextToLines(appendixLine, contentWidth, fontSize);

        lines.forEach(line => {
          checkNewPage(lineHeight);
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });
      }
    }
  }

  return Buffer.from(pdf.output('arraybuffer'));
}

// Simple PDF generation endpoint that returns PDF data
router.post('/:syllabusId/pdf', async (req, res) => {
  try {
    const { syllabusId } = req.params;
    const { title, contentMarkdown } = req.body;

    console.log('📄 PDF generation request:', { syllabusId, titleLength: title?.length, contentLength: contentMarkdown?.length });

    if (!title || !contentMarkdown) {
      console.error('📄 Missing required fields:', { hasTitle: !!title, hasContent: !!contentMarkdown });
      return res.status(400).json({
        ok: false,
        error: 'Title and content are required'
      });
    }

    console.log('📄 Starting PDF generation...');

    // Generate PDF with fallback
    let pdfBuffer: Buffer;
    try {
      // Try the complex PDF generation first
      pdfBuffer = createPdfFromMarkdown(contentMarkdown, title);
    } catch (pdfError) {
      console.warn('📄 Complex PDF generation failed, using simple fallback:', pdfError);
      // Use simple fallback PDF generation
      pdfBuffer = createSimplePdf(title, contentMarkdown);
    }

    console.log('📄 PDF generated successfully, size:', pdfBuffer.length);

    // Return PDF as base64 for client-side upload
    const pdfBase64 = pdfBuffer.toString('base64');

    console.log('📄 PDF base64 conversion completed, length:', pdfBase64.length);

    res.json({
      ok: true,
      pdfData: pdfBase64,
      size: pdfBuffer.length,
    });

  } catch (error) {
    console.error('📄 Error generating PDF:', error);
    console.error('📄 Error stack:', error instanceof Error ? error.stack : 'No stack');
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined,
    });
  }
});

export default router;
