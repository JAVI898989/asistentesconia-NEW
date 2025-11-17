import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGuardiaCivilTopic } from "@/hooks/useGuardiaCivilSyllabus";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PrintViewProps {}

export default function PrintView({}: PrintViewProps) {
  const { assistantId, topicSlug } = useParams<{ assistantId: string; topicSlug: string }>();
  const { topic, loading, error } = useGuardiaCivilTopic(assistantId || null, topicSlug || null);

  // Apply print-specific styles
  useEffect(() => {
    // Add print-specific CSS
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      /* Print-specific styles for PDF generation */
      @media print, screen {
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        @page {
          size: A4;
          margin: 2.5cm 2cm;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #000;
          background: #fff;
          margin: 0;
          padding: 0;
        }

        /* Typography */
        h1 {
          font-size: 18pt;
          font-weight: 700;
          margin: 24pt 0 12pt 0;
          color: #1e40af;
          break-after: avoid;
          page-break-after: avoid;
        }

        h2 {
          font-size: 16pt;
          font-weight: 600;
          margin: 20pt 0 10pt 0;
          color: #1e40af;
          break-inside: avoid;
          page-break-inside: avoid;
          break-after: avoid;
          page-break-after: avoid;
        }

        h3 {
          font-size: 14pt;
          font-weight: 600;
          margin: 16pt 0 8pt 0;
          color: #374151;
          break-inside: avoid;
          page-break-inside: avoid;
          break-after: avoid;
          page-break-after: avoid;
        }

        h4, h5, h6 {
          font-size: 12pt;
          font-weight: 600;
          margin: 12pt 0 6pt 0;
          color: #374151;
          break-inside: avoid;
          page-break-inside: avoid;
          break-after: avoid;
          page-break-after: avoid;
        }

        p {
          margin: 8pt 0;
          text-align: justify;
          orphans: 2;
          widows: 2;
        }

        /* Lists */
        ul, ol {
          margin: 8pt 0;
          padding-left: 20pt;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        li {
          margin: 4pt 0;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 12pt 0;
          break-inside: avoid;
          page-break-inside: avoid;
          font-size: 10pt;
        }

        th, td {
          border: 1pt solid #d1d5db;
          padding: 6pt;
          text-align: left;
          vertical-align: top;
        }

        th {
          background-color: #f3f4f6;
          font-weight: 600;
        }

        /* Code blocks */
        pre {
          background-color: #f8f9fa;
          border: 1pt solid #e9ecef;
          border-radius: 4pt;
          padding: 12pt;
          margin: 12pt 0;
          font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
          font-size: 9pt;
          overflow-wrap: break-word;
          white-space: pre-wrap;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        code {
          background-color: #f1f5f9;
          padding: 2pt 4pt;
          border-radius: 2pt;
          font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
          font-size: 10pt;
        }

        /* Blockquotes */
        blockquote {
          border-left: 3pt solid #3b82f6;
          padding-left: 12pt;
          margin: 12pt 0;
          font-style: italic;
          color: #4b5563;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* Images */
        img {
          max-width: 100%;
          height: auto;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* Page breaks */
        .page-break {
          break-after: page;
          page-break-after: always;
        }

        /* Strong and emphasis */
        strong {
          font-weight: 600;
          color: #111827;
        }

        em {
          font-style: italic;
          color: #4b5563;
        }

        /* Hide interactive elements */
        button, .no-print {
          display: none !important;
        }

        /* Header styling */
        .print-header {
          border-bottom: 2pt solid #3b82f6;
          margin-bottom: 20pt;
          padding-bottom: 12pt;
        }

        .print-title {
          font-size: 20pt;
          font-weight: 700;
          color: #1e40af;
          margin: 0 0 8pt 0;
        }

        .print-subtitle {
          font-size: 12pt;
          color: #6b7280;
          margin: 0;
        }

        /* Footer for page numbering */
        @page {
          @bottom-right {
            content: "Página " counter(page) " de " counter(pages);
            font-size: 9pt;
            color: #6b7280;
          }
          @bottom-left {
            content: "Guardia Civil - Temario Oficial";
            font-size: 9pt;
            color: #6b7280;
          }
        }

        /* Ensure content flows properly */
        .print-content {
          orphans: 2;
          widows: 2;
        }
      }
    `;
    
    document.head.appendChild(printStyles);

    return () => {
      if (printStyles.parentNode) {
        printStyles.parentNode.removeChild(printStyles);
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <p>Cargando contenido para impresión...</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <h1>Error</h1>
        <p>{error || "Tema no encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="print-content">
      {/* Print Header */}
      <div className="print-header">
        <h1 className="print-title">{topic.title}</h1>
        <p className="print-subtitle">
          Tema {topic.order} - Guardia Civil | {topic.wordCount ? `${topic.wordCount} palabras` : ''} | Versión {topic.version || 1}
        </p>
      </div>

      {/* Main Content */}
      <div 
        style={{ 
          fontFamily: 'Inter, sans-serif', 
          fontSize: '11pt', 
          lineHeight: '1.5',
          color: '#000'
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children, ...props }) => (
              <h1 {...props} style={{ 
                fontSize: '18pt', 
                fontWeight: '700', 
                margin: '24pt 0 12pt 0', 
                color: '#1e40af',
                breakAfter: 'avoid',
                pageBreakAfter: 'avoid'
              }}>
                {children}
              </h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 {...props} style={{ 
                fontSize: '16pt', 
                fontWeight: '600', 
                margin: '20pt 0 10pt 0', 
                color: '#1e40af',
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
                breakAfter: 'avoid',
                pageBreakAfter: 'avoid'
              }}>
                {children}
              </h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 {...props} style={{ 
                fontSize: '14pt', 
                fontWeight: '600', 
                margin: '16pt 0 8pt 0', 
                color: '#374151',
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
                breakAfter: 'avoid',
                pageBreakAfter: 'avoid'
              }}>
                {children}
              </h3>
            ),
            h4: ({ children, ...props }) => (
              <h4 {...props} style={{ 
                fontSize: '12pt', 
                fontWeight: '600', 
                margin: '12pt 0 6pt 0', 
                color: '#374151',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }}>
                {children}
              </h4>
            ),
            h5: ({ children, ...props }) => (
              <h5 {...props} style={{ 
                fontSize: '12pt', 
                fontWeight: '600', 
                margin: '12pt 0 6pt 0', 
                color: '#374151',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }}>
                {children}
              </h5>
            ),
            h6: ({ children, ...props }) => (
              <h6 {...props} style={{ 
                fontSize: '12pt', 
                fontWeight: '600', 
                margin: '12pt 0 6pt 0', 
                color: '#374151',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }}>
                {children}
              </h6>
            ),
            p: ({ children, ...props }) => (
              <p {...props} style={{ 
                margin: '8pt 0', 
                textAlign: 'justify',
                orphans: 2,
                widows: 2
              }}>
                {children}
              </p>
            ),
            ul: ({ children, ...props }) => (
              <ul {...props} style={{ 
                margin: '8pt 0', 
                paddingLeft: '20pt',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }}>
                {children}
              </ul>
            ),
            ol: ({ children, ...props }) => (
              <ol {...props} style={{ 
                margin: '8pt 0', 
                paddingLeft: '20pt',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }}>
                {children}
              </ol>
            ),
            li: ({ children, ...props }) => (
              <li {...props} style={{ 
                margin: '4pt 0',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }}>
                {children}
              </li>
            ),
            table: ({ children, ...props }) => (
              <table {...props} style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                margin: '12pt 0',
                breakInside: 'avoid',
                pageBreakInside: 'avoid',
                fontSize: '10pt'
              }}>
                {children}
              </table>
            ),
            th: ({ children, ...props }) => (
              <th {...props} style={{ 
                border: '1pt solid #d1d5db', 
                padding: '6pt', 
                backgroundColor: '#f3f4f6',
                fontWeight: '600',
                textAlign: 'left'
              }}>
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td {...props} style={{ 
                border: '1pt solid #d1d5db', 
                padding: '6pt',
                textAlign: 'left',
                verticalAlign: 'top'
              }}>
                {children}
              </td>
            ),
            pre: ({ children, ...props }) => (
              <pre {...props} style={{ 
                backgroundColor: '#f8f9fa', 
                border: '1pt solid #e9ecef', 
                borderRadius: '4pt', 
                padding: '12pt', 
                margin: '12pt 0',
                fontFamily: 'Fira Code, Consolas, Monaco, monospace',
                fontSize: '9pt',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }}>
                {children}
              </pre>
            ),
            code: ({ children, inline, ...props }) => 
              inline ? (
                <code {...props} style={{ 
                  backgroundColor: '#f1f5f9', 
                  padding: '2pt 4pt', 
                  borderRadius: '2pt',
                  fontFamily: 'Fira Code, Consolas, Monaco, monospace',
                  fontSize: '10pt'
                }}>
                  {children}
                </code>
              ) : (
                <code {...props}>{children}</code>
              ),
            blockquote: ({ children, ...props }) => (
              <blockquote {...props} style={{ 
                borderLeft: '3pt solid #3b82f6', 
                paddingLeft: '12pt', 
                margin: '12pt 0',
                fontStyle: 'italic',
                color: '#4b5563',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }}>
                {children}
              </blockquote>
            ),
            img: ({ ...props }) => (
              <img {...props} style={{ 
                maxWidth: '100%', 
                height: 'auto',
                breakInside: 'avoid',
                pageBreakInside: 'avoid'
              }} />
            ),
            strong: ({ children, ...props }) => (
              <strong {...props} style={{ 
                fontWeight: '600',
                color: '#111827'
              }}>
                {children}
              </strong>
            ),
            em: ({ children, ...props }) => (
              <em {...props} style={{ 
                fontStyle: 'italic',
                color: '#4b5563'
              }}>
                {children}
              </em>
            ),
          }}
        >
          {topic.contentMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
