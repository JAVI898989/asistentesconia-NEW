import { ExtensiveTemarioData } from './extensiveTemarioGenerator';

// PDF generation utilities for temario content
export const generateTemarioPDF = async (temarioData: ExtensiveTemarioData): Promise<string> => {
  // For now, we'll return a formatted HTML that can be converted to PDF
  // In a full implementation, you'd use libraries like jsPDF or Puppeteer
  
  const htmlContent = generateTemarioHTML(temarioData);
  
  // Convert HTML to PDF (simplified approach)
  // In production, you'd use a proper PDF library
  const pdfContent = await convertHTMLToPDF(htmlContent);
  
  return pdfContent;
};

const generateTemarioHTML = (temarioData: ExtensiveTemarioData): string => {
  const { assistantName, themeName, sections, totalPages } = temarioData;
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${themeName} - ${assistantName}</title>
        <style>
            @page {
                size: A4;
                margin: 2.5cm 2cm;
            }
            
            body {
                font-family: 'Times New Roman', serif;
                font-size: 12pt;
                line-height: 1.6;
                color: #333;
                max-width: 100%;
            }
            
            .header {
                text-align: center;
                border-bottom: 2px solid #1e40af;
                padding-bottom: 1em;
                margin-bottom: 2em;
            }
            
            .header h1 {
                color: #1e40af;
                font-size: 24pt;
                margin-bottom: 0.5em;
            }
            
            .header h2 {
                color: #666;
                font-size: 14pt;
                font-weight: normal;
            }
            
            .section {
                margin-bottom: 2em;
                page-break-inside: avoid;
            }
            
            .section-title {
                color: #1e40af;
                font-size: 16pt;
                font-weight: bold;
                border-bottom: 1px solid #1e40af;
                padding-bottom: 0.2em;
                margin-bottom: 1em;
            }
            
            .subsection-title {
                color: #374151;
                font-size: 14pt;
                font-weight: bold;
                margin-top: 1.5em;
                margin-bottom: 0.8em;
            }
            
            .objectives {
                background-color: #eff6ff;
                border-left: 4px solid #1e40af;
                padding: 1em;
                margin: 1em 0;
            }
            
            .example {
                background-color: #f0fdf4;
                border-left: 4px solid #16a34a;
                padding: 1em;
                margin: 1em 0;
            }
            
            .key-data {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 1em;
                margin: 1em 0;
            }
            
            .diagram {
                font-family: 'Courier New', monospace;
                background-color: #f8fafc;
                border: 1px solid #e2e8f0;
                padding: 1em;
                margin: 1em 0;
                white-space: pre-line;
            }
            
            p {
                text-align: justify;
                margin-bottom: 1em;
            }
            
            ul, ol {
                margin-bottom: 1em;
                padding-left: 2em;
            }
            
            li {
                margin-bottom: 0.5em;
            }
            
            .page-break {
                page-break-before: always;
            }
            
            .footer {
                position: fixed;
                bottom: 1cm;
                right: 2cm;
                font-size: 10pt;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${themeName}</h1>
            <h2>Temario para ${assistantName}</h2>
            <p><strong>Páginas generadas:</strong> ${totalPages} | <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
        
        ${sections.map((section, index) => `
            <div class="section ${index > 0 ? 'page-break' : ''}">
                <h2 class="section-title">${section.title}</h2>
                <div class="content">
                    ${formatSectionContent(section.content)}
                </div>
            </div>
        `).join('')}
        
        <div class="footer">
            Generado automáticamente - ${new Date().toLocaleDateString('es-ES')}
        </div>
    </body>
    </html>
  `;
};

const formatSectionContent = (content: string): string => {
  // Format content with proper HTML structure
  let formatted = content
    // Convert markdown-style headers
    .replace(/^### (.+)$/gm, '<h3 class="subsection-title">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="subsection-title">$1</h2>')
    
    // Convert objectives sections
    .replace(/\*\*Objetivos de aprendizaje\*\*:?\s*\n([\s\S]*?)(?=\n\n|\*\*|$)/gi, 
      '<div class="objectives"><strong>Objetivos de aprendizaje:</strong><br>$1</div>')
    
    // Convert examples
    .replace(/\*\*Ejemplo práctico\*\*:?\s*\n([\s\S]*?)(?=\n\n|\*\*|$)/gi,
      '<div class="example"><strong>Ejemplo práctico:</strong><br>$1</div>')
    
    // Convert key data
    .replace(/\*\*Datos clave a memorizar\*\*:?\s*\n([\s\S]*?)(?=\n\n|\*\*|$)/gi,
      '<div class="key-data"><strong>Datos clave a memorizar:</strong><br>$1</div>')
    
    // Convert diagrams (anything between ``` marks)
    .replace(/```([\s\S]*?)```/g, '<div class="diagram">$1</div>')
    
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Convert lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    
    // Convert paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.)/gm, '<p>$1')
    .replace(/(.)\n$/gm, '$1</p>');
  
  return formatted;
};

const convertHTMLToPDF = async (htmlContent: string): Promise<string> => {
  // In a real implementation, you would use:
  // - jsPDF library
  // - Puppeteer for server-side rendering
  // - PDF-lib for client-side generation
  // - Or a cloud service like PDFShift
  
  // For now, return the HTML content as base64
  // This can be opened in browser and printed to PDF
  return btoa(unescape(encodeURIComponent(htmlContent)));
};

export const downloadTemarioPDF = (temarioData: ExtensiveTemarioData) => {
  const htmlContent = generateTemarioHTML(temarioData);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${temarioData.themeName}_${temarioData.assistantName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const openTemarioPDFPreview = (temarioData: ExtensiveTemarioData) => {
  const htmlContent = generateTemarioHTML(temarioData);
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  }
};
