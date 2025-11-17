# Sistema de Generación de Contenido con GPT-5 Mini

## 📋 Descripción General

Sistema completo de generación automática de contenido educativo para asistentes IA de oposiciones, utilizando GPT-5 Mini (mapeado a GPT-4o-mini) con las siguientes capacidades:

### ✨ Características Principales

1. **Generación Automática Completa**
   - ✅ Temarios extensos estilo academia (2500+ palabras)
   - ✅ Tests interactivos (5 baterías × 20 preguntas = 100 tests por tema)
   - ✅ Flashcards (5 lotes × 15 tarjetas = 75 flashcards por tema)
   - ✅ Juegos educativos (quiz rápido, emparejar, trivial, sopa de letras)

2. **Gestión CRUD Completa**
   - ✅ Añadir/Editar/Eliminar tests
   - ✅ Añadir/Editar/Eliminar flashcards
   - ✅ Gestión de juegos (próximamente)

3. **UI Moderna e Interactiva**
   - ✅ Pestañas con diseño moderno
   - ✅ Colores suaves y elementos interactivos
   - ✅ Feedback inmediato en tests
   - ✅ Flip interactivo en flashcards
   - ✅ Juegos jugables dentro de la pestaña

## 🏗️ Arquitectura

### Archivos Principales

#### 1. Generadores de Contenido

**`client/lib/gamesGenerator.ts`** - Generador de juegos con IA
- Genera 4 tipos de juegos usando GPT-5 Mini
- Quiz rápido (10 preguntas)
- Emparejar conceptos (12 pares)
- Trivial (15 preguntas)
- Sopa de letras (grid 15×15 con 10 palabras)

**`client/lib/professionalTemarioGenerator.ts`** - Generador de temarios
- Temarios extensos (2500+ palabras)
- Estructura académica profesional
- HTML visual con portadas, tablas, esquemas

**`client/lib/testFlashcardAdvancedGenerator.ts`** - Generador de tests/flashcards
- Tests con anti-duplicación
- Flashcards organizadas
- Validación de calidad

**`client/lib/temarioPipeline.ts`** - Pipeline de generación
- Orquesta todo el proceso
- Guarda en Firebase
- Maneja errores y reintentos

#### 2. Componentes de UI

**`client/components/curso/GamesPanel.tsx`** - Panel de juegos interactivo
- 4 tipos de juegos jugables
- Sistema de puntuación
- Interfaz moderna y atractiva

**`client/components/admin/ContentCRUDManager.tsx`** - Gestión de contenido
- CRUD completo para tests
- CRUD completo para flashcards
- Editor con validación

**`client/components/admin/TemarioGeneratorTab.tsx`** - Generador en panel admin
- Generación por lotes
- Control de pausa/resume
- Logs en tiempo real

#### 3. Rutas de API

**`server/routes/generate-tests-advanced.ts`** - API de tests
- Parsing robusto de JSON
- Normalización de datos
- Manejo de errores mejorado

**`server/routes/generate-flashcards-advanced.ts`** - API de flashcards
- Parsing robusto de JSON
- Normalización de datos
- Manejo de errores mejorado

**`server/routes/openai.ts`** - Endpoint OpenAI
- Mapeo de GPT-5 Mini a GPT-4o-mini
- Fallbacks automáticos
- Gestión de tokens

## 🚀 Flujo de Generación

### Proceso Completo (Un Solo Clic)

```
1. Usuario pega lista de temas
   ↓
2. Sistema genera para cada tema:
   ├─ Temario HTML (GPT-5 Mini)
   ├─ 100 Tests (GPT-5 Mini)
   ├─ 75 Flashcards (GPT-5 Mini)
   └─ 4 Tipos de Juegos (GPT-5 Mini)
   ↓
3. Todo se guarda en Firebase:
   ├─ assistants/{id}/syllabus/{topicId}/ (temario)
   ├─ assistants/{id}/syllabus/{topicId}/tests/ (tests)
   ├─ assistants/{id}/syllabus/{topicId}/flashcards/ (flashcards)
   └─ assistants/{id}/syllabus/{topicId}/games/ (juegos)
   ↓
4. Contenido visible inmediatamente en pestañas del asistente
```

## 📊 Estructura de Datos en Firebase

### Temario (Syllabus)
```typescript
{
  topicId: string,
  title: string,
  content: string, // HTML
  wordCount: number,
  createdAt: Timestamp,
  status: "published",
  testsCount: number,
  flashcardsCount: number,
  gamesCount: number
}
```

### Tests
```typescript
{
  testNumber: number,
  questions: [
    {
      id: string,
      question: string,
      options: string[],
      correctIndex: number,
      explanation: string,
      difficulty: "easy" | "medium" | "hard"
    }
  ]
}
```

### Flashcards
```typescript
{
  id: string,
  front: string,
  back: string,
  block: number,
  index: number,
  createdAt: Timestamp
}
```

### Games
```typescript
{
  quickQuiz: {
    title: string,
    questions: QuickQuizQuestion[]
  },
  matching: {
    title: string,
    pairs: MatchingPair[]
  },
  trivia: {
    title: string,
    questions: TriviaQuestion[]
  },
  wordSearch: {
    grid: string[][],
    words: string[],
    solution: Array<...>
  }
}
```

## 🎮 Tipos de Juegos Implementados

### 1. Quiz Rápido
- 10 preguntas con 4 opciones
- Feedback inmediato
- Explicación de respuestas
- Sistema de puntuación

### 2. Emparejar Conceptos
- 12 pares concepto-definición
- Arrastre y emparejamiento
- Validación automática
- Progreso visual

### 3. Trivial de Conocimientos
- 15 preguntas por categorías
- Dificultad variable (fácil/medio/difícil)
- Respuestas reveladoras
- Navegación secuencial

### 4. Sopa de Letras
- Grid 15×15
- 10 palabras clave del tema
- Interfaz interactiva
- Lista de palabras a encontrar

## 🛠️ Cómo Usar el Sistema

### Para Administradores

1. **Acceder al Panel Admin**
   - Ir a sección "Asistentes IA"
   - Click en asistente deseado

2. **Generar Contenido**
   - Tab "Generar Temario"
   - Pegar lista de temas (uno por línea)
   - Click "Generar Todo"
   - Esperar (proceso automático)

3. **Gestionar Contenido Existente**
   - Tab "Gestión de Contenido"
   - Seleccionar tema
   - Añadir/Editar/Eliminar tests o flashcards

### Para Usuarios

1. **Ver Temario**
   - Pestaña "Temario"
   - Navegación por índice lateral
   - HTML visual estilo academia

2. **Hacer Tests**
   - Pestaña "Tests"
   - Seleccionar batería (1-5)
   - Responder interactivamente
   - Ver corrección inmediata

3. **Repasar Flashcards**
   - Pestaña "Flashcards"
   - Click para voltear
   - Navegación secuencial

4. **Jugar Minijuegos**
   - Pestaña "Juegos"
   - Seleccionar tipo de juego
   - Jugar directamente en navegador

## ⚙️ Configuración

### Variables de Entorno Necesarias

```env
OPENAI_API_KEY=sk-xxx
```

### Mapeo de Modelos

```typescript
// En server/routes/openai.ts
"gpt-5-mini" → "gpt-4o-mini"
"gpt-4-nano" → "gpt-4o-mini"
"gpt-4" → "gpt-4o-mini"
```

## 🔧 Personalización

### Cambiar Número de Tests por Tema

Editar `client/lib/temarioPipeline.ts`:
```typescript
// Cambiar de 5 a X
for (let testNumber = 0; testNumber < X; testNumber++) {
  // ...
}
```

### Cambiar Número de Flashcards

Editar `client/lib/temarioPipeline.ts`:
```typescript
// Cambiar slice(0, 15) a slice(0, X)
const uniqueCards = uniqueByFlashcard(params.cards).slice(0, X);
```

### Personalizar Tipos de Juegos

Editar `client/lib/gamesGenerator.ts` - función `buildGamesPrompt`:
```typescript
// Añadir nuevos tipos de juegos al prompt
// Actualizar interface GameBundle
```

## 📝 Próximas Mejoras

- [ ] Editor WYSIWYG para temarios
- [ ] Importar/Exportar contenido (JSON/CSV)
- [ ] Análisis de calidad automático
- [ ] Sugerencias de mejora con IA
- [ ] Más tipos de juegos (crucigramas, ahorcado, etc.)
- [ ] Estadísticas de uso por usuario
- [ ] Rankings y gamificación

## 🐛 Solución de Problemas

### Error: "Invalid response from test generation API"

**Causa**: El modelo OpenAI no devolvió JSON válido

**Solución**:
1. Verificar que OPENAI_API_KEY está configurada
2. Revisar logs del servidor para ver respuesta cruda
3. Aumentar timeout si es necesario

### Error: "No hay suficientes preguntas únicas"

**Causa**: El contenido generado no tiene suficiente variedad

**Solución**:
1. Aumentar minWords en generación de temario
2. Mejorar el prompt de generación
3. Revisar calidad del contenido base

### Juegos no se cargan

**Causa**: Estructura de datos incorrecta en Firebase

**Solución**:
1. Verificar que existe documento `games/bundle`
2. Revisar estructura con Firebase Console
3. Regenerar juegos para el tema

## 📚 Referencias

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)

## 👥 Contribuir

Para añadir nuevas características:

1. Crear branch: `git checkout -b feature/nueva-caracteristica`
2. Implementar cambios
3. Probar exhaustivamente
4. Crear PR con descripción detallada

## 📄 Licencia

Propietario - Todos los derechos reservados
