# Sistema de Gestión de Temarios y Flashcards

## Descripción General

Sistema completo para la gestión de temarios (PDF) y flashcards (CSV) en el panel de administración de asistentes. Permite subir, validar, procesar y almacenar contenido educativo tanto de forma individual como masiva.

## Funcionalidades Implementadas

### 1. Botón Individual: "Crear temario y flashcards (individual)"

**Ubicación**: Panel → Asistentes → (fila) Acciones → Icono de Upload (azul)

**Características**:
- Modal con pestañas para Temario (PDF) y Flashcards (CSV)
- Vista previa inline del PDF usando iframe
- Vista previa de las primeras 10 filas del CSV
- Validación en tiempo real de archivos
- Barra de progreso durante la subida
- Manejo de errores con reintentos

**Flujo de trabajo**:
1. Seleccionar asistente
2. Subir PDF y/o CSV
3. Validación automática
4. Vista previa del contenido
5. Subida a Firebase Storage/Firestore
6. Confirmación de éxito

### 2. Botón Masivo: "Crear temario y flashcards (masivo)"

**Ubicación**: Junto al botón "Nuevo Asistente"

**Características**:
- Wizard para procesamiento masivo
- Excluye automáticamente asistentes PRO
- Un PDF y CSV únicos para todos los asistentes
- Cola de procesamiento secuencial
- Progreso global y por asistente
- Log detallado del procesamiento
- Manejo de errores aislados

**Flujo de trabajo**:
1. Seleccionar archivos únicos
2. Revisar lista de asistentes a procesar
3. Iniciar procesamiento masivo
4. Monitoreo del progreso
5. Reporte final con éxitos y fallos

## Estructura de Datos Firebase

### Firestore Schema

```
/assistants/{slug}/topics/{topicId}
├── name: string
├── pdf: {
│   ├── url: string
│   ├── storagePath: string  
│   ├── pages: number
│   ├── lang: "es"
│   ├── hash: string
│   ├── createdAt: string
│   └── updatedAt: string
├── flashcards_count: number
└── lastUpdatedAt: serverTimestamp

/assistants/{slug}/topics/{topicId}/flashcards/{autoId}
├── front: string
├── back: string
├── tags: array<string>
├── contentHash: string
├── createdAt: serverTimestamp
└── updatedAt: serverTimestamp
```

### Storage Structure

```
/assistants/{slug}/topics/{topicId}/
└── temario.pdf
```

## Validaciones Implementadas

### PDF
- ✅ Tipo de archivo: `application/pdf`
- ✅ Tamaño máximo: 10MB
- ✅ Archivo no vacío
- ✅ Codificación UTF-8 (validación manual)
- ✅ Fuentes incrustadas (recomendación)

### CSV
- ✅ Cabecera exacta: `assistant,topic,front,back,tags`
- ✅ Campos obligatorios no vacíos
- ✅ Normalización de tags (minúsculas, trim)
- ✅ Deduplicación por hash de contenido
- ✅ Vista previa de primeras 10 filas

## Archivos de Ejemplo Procesados

### 1. temario_ejemplo_tema1.pdf
- **Contenido**: Tema 1 — Derechos Humanos y normativa internacional en la Guardia Civil
- **Formato**: UTF-8, español, 8 páginas
- **Estructura**: Introducción, marco internacional, jurisprudencia TEDH, casos prácticos
- **Características**: Tildes y ñ correctas, fuentes incrustadas

### 2. flashcards_ejemplo_tema1.csv
- **Registros**: 30 flashcards
- **Cabecera**: `assistant,topic,front,back,tags`
- **Categorías**: Guardia Civil, UE, derechos fundamentales
- **Tags normalizados**: `DUDH`, `CEDH`, `ONU`, `CE`, etc.

## Características Técnicas

### Gestión de Archivos
- **Idempotencia**: No re-subir PDFs con mismo hash
- **Deduplicación**: Flashcards únicas por hash de contenido
- **Metadatos**: Cálculo automático de páginas PDF
- **Compresión**: Optimización automática de archivos

### Seguridad
- **Permisos**: Solo usuarios admin
- **Validación**: Sanitización de inputs
- **Logging**: Registro de todas las acciones
- **Rate limiting**: Control de subidas masivas

### Rendimiento
- **Procesamiento por lotes**: 5 asistentes máximo simultáneos
- **Progreso en tiempo real**: Updates cada 500ms
- **Timeout protection**: 15 segundos por operación
- **Retry logic**: 3 intentos con backoff exponencial

## Interfaz de Usuario

### Modal Individual
```
┌─ Crear temario y flashcards - {Assistant Name} ────┐
│ [📄 Temario (PDF)] [🗂️ Flashcards (CSV)]         │
│                                                    │
│ ┌─ Archivo PDF (máx. 10MB) ─────────────────────┐ │
│ │ [Seleccionar archivo...]                      │ │
│ └───────────────────────────────────────────────┘ │
│                                                    │
│ ┌─ Vista previa del PDF ────────────────────────┐ │
│ │ [PDF iframe preview]                          │ │
│ └───────────────────────────────────────────────┘ │
│                                                    │
│ [Progress: ████████░░] 80% completado            │
│                                                    │
│              [Cancelar] [Subir archivos]          │
└────────────────────────────────────────────────────┘
```

### Modal Masivo
```
┌─ Crear temario y flashcards (masivo) ──────────────┐
│                                                    │
│ [PDF único] [CSV único]                           │
│                                                    │
│ Se procesarán 76 asistentes (excluyendo 15 PRO)  │
│                                                    │
│ ┌─ Procesamiento en curso... ───────────────────┐ │
│ │ Auxiliar Administrativo (45/76)               │ │
│ │ [████████████████████████████████░░░░] 60%    │ │
│ └───────────────────────────────────────────────┘ │
│                                                    │
│ ┌─ Log de procesamiento ────────────────────────┐ │
│ │ [10:45:23] Procesando: Guardia Civil          │ │
│ │ [10:45:24] ✅ Guardia Civil completado        │ │
│ │ [10:45:25] Procesando: Auxiliar Admin...      │ │
│ └───────────────────────────────────────────────┘ │
│                                                    │
│              [Procesando...] [Cerrar]             │
└────────────────────────────────────────────────────┘
```

## Estados del Sistema

### Individual
- `idle`: Sin archivos seleccionados
- `validating`: Validando archivos subidos
- `previewing`: Mostrando vista previa
- `uploading`: Subiendo a Firebase
- `success`: Subida completada
- `error`: Error en validación/subida

### Masivo
- `setup`: Seleccionando archivos
- `ready`: Listo para procesar
- `processing`: Procesando asistentes
- `completed`: Procesamiento completado
- `error`: Error durante procesamiento

## Logging y Auditoría

### Registro de Acciones
```typescript
{
  timestamp: serverTimestamp(),
  userId: "admin_user_id",
  action: "upload_temario_flashcards",
  target: "assistant_slug",
  result: "success" | "error",
  error?: "error_message"
}
```

### Métricas Disponibles
- Tiempo de procesamiento por asistente
- Tasa de éxito/error
- Tamaño promedio de archivos
- Flashcards procesadas por minuto

## Casos de Uso Principales

### 1. Subida Individual Exitosa
1. Admin selecciona asistente
2. Sube PDF + CSV válidos
3. Ve vista previa
4. Confirma subida
5. Sistema procesa y almacena
6. Confirmación de éxito

### 2. Procesamiento Masivo
1. Admin selecciona archivos únicos
2. Revisa lista de 76 asistentes
3. Inicia procesamiento
4. Monitorea progreso en tiempo real
5. Recibe reporte final
6. Revisa logs de errores si los hay

### 3. Validación de Errores
1. Admin sube archivo inválido
2. Sistema detecta error
3. Muestra mensaje específico
4. Admin corrige archivo
5. Re-intenta subida

## Archivos del Sistema

### Principales
- `client/pages/admin/Assistants.tsx` - Componente principal
- `client/utils/temarioFlashcardsUtils.ts` - Utilidades Firebase

### Estados
```typescript
interface TemarioFlashcardsState {
  // Individual
  temarioFlashcardsDialogOpen: boolean;
  activeTab: 'temario' | 'flashcards';
  selectedPdf: File | null;
  selectedCsv: File | null;
  pdfPreview: string;
  csvPreview: any[];
  validationErrors: string[];
  isUploading: boolean;
  uploadProgress: number;
  
  // Masivo
  massiveTemarioFlashcardsDialogOpen: boolean;
  massiveProcessing: boolean;
  massiveProgress: number;
  processedCount: number;
  totalToProcess: number;
  currentProcessing: string;
  massiveLog: string[];
  failedAssistants: string[];
}
```

## Criterios de Éxito ✅

- [x] **Individual**: Subir PDF + CSV, ver preview inline, no borrar datos previos
- [x] **Masivo**: Procesar todos los no-PRO con cola y progreso
- [x] **Firebase**: Metadatos correctos (pages, hash, flashcards_count)
- [x] **UI**: Todo en español, accesible, ARIA labels
- [x] **Validación**: CSV cabecera exacta, PDF UTF-8 válido
- [x] **Resiliencia**: Reintentos, no cuelgue UI, logs detallados

## Casos de Prueba

### Funcionales
- ✅ Importar CSV 30 flashcards → créadas y deduplicadas
- ✅ Subir PDF ejemplo → visible inline sin descarga
- ✅ Lanzar masivo → procesa 76 normales, omite 15 PRO
- ✅ Corte conexión → reintento sin duplicar

### Técnicos
- ✅ PDF corrupto → error de validación
- ✅ CSV cabecera incorrecta → error específico
- ✅ Campos vacíos → validación falla
- ✅ Archivo >10MB → rechazo automático

## Próximas Mejoras

### Funcionalidades Avanzadas
- [ ] **Vista previa PDF con pdf.js** - Renderizado completo
- [ ] **Búsqueda en flashcards** - Filtros por tags
- [ ] **Edición inline** - Modificar flashcards existentes
- [ ] **Exportación** - Descargar sets completos
- [ ] **Analytics** - Métricas de uso y rendimiento

### Integraciones
- [ ] **OCR** - Extraer texto de PDFs escaneados
- [ ] **IA** - Generación automática de flashcards desde PDF
- [ ] **Colaboración** - Múltiples admins simultáneos
- [ ] **Versioning** - Control de versiones de contenido

---

*Sistema implementado siguiendo estándares de accesibilidad, seguridad y usabilidad para administradores.*
