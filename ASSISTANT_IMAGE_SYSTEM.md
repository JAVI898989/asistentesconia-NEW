# Sistema de Gestión de Imágenes de Asistentes

## 📋 Resumen del Sistema

Sistema completo para gestionar imágenes de asistentes con almacenamiento persistente en Firebase Storage, metadatos en Firestore, y actualización en tiempo real.

## 🏗️ Arquitectura

### 1. **Storage (Firebase Storage)**
```
assistants/
  {assistantId}/
    images/
      {timestamp}-original.{ext}    # Imagen original
      {timestamp}-thumb.webp        # Miniatura WebP 512px
```

### 2. **Firestore (Metadatos)**
```typescript
// En assistants/{assistantId}
avatar: {
  downloadURL: string;           // URL imagen original
  thumbURL: string;             // URL miniatura WebP
  storagePath: string;          // Ruta Storage original
  thumbPath: string;            // Ruta Storage miniatura
  width: number;                // Ancho miniatura
  height: number;               // Alto miniatura
  format: "webp";               // Formato miniatura
  alt: string;                  // Texto alternativo
  version: number;              // Versión para cache busting
  updatedAt: serverTimestamp(); // Timestamp servidor
  updatedAtMs: number;          // Timestamp cliente
}
```

### 3. **Cache Busting**
```typescript
// URLs con versioning automático
https://storage.googleapis.com/...image.webp?v=3
```

## 🔧 Componentes Principales

### 1. **AssistantImageEditor.tsx**
- Dropzone drag & drop
- Vista previa instantánea
- Validación (JPG/PNG/WebP, máx 5MB)
- Barra de progreso
- Campo ALT opcional
- Botones: Reemplazar, Quitar, Guardar

### 2. **assistantImageUploadService.ts**
- `uploadAssistantImage()` - Subida completa con miniatura
- `deleteAssistantImage()` - Borrado seguro
- `createWebPThumbnail()` - Generación miniatura canvas
- `getImageWithCacheBusting()` - URLs con versioning

### 3. **useAssistantAvatar.ts**
- Hook tiempo real con onSnapshot
- `useAssistantAvatar(id)` - Un asistente
- `useMultipleAssistantAvatars(ids)` - Múltiples asistentes

## 🚀 Uso del Sistema

### En el Panel Admin
```typescript
// Importar editor
import AssistantImageEditor from "@/components/admin/AssistantImageEditor";

// Usar en diálogo
<AssistantImageEditor
  assistantId={assistant.id}
  assistantName={assistant.name}
  currentAvatar={assistant.avatar || null}
  onImageUpdated={(avatar) => {
    // Actualizar estado local
    updateAssistantAvatar(assistant.id, avatar);
  }}
/>
```

### En Componentes Públicos
```typescript
// Importar hook
import { useAssistantAvatar } from "@/hooks/useAssistantAvatar";

// Usar en componente
const { avatar, imageUrl, thumbUrl, loading } = useAssistantAvatar(assistantId);

// Mostrar imagen con cache busting
<img 
  src={thumbUrl || fallbackImage} 
  alt={avatar?.alt || assistantName}
/>
```

### Actualizar múltiples asistentes
```typescript
const avatarData = useMultipleAssistantAvatars(['assistant1', 'assistant2']);

// Acceder a cada avatar
const avatar1 = avatarData['assistant1'];
const avatar2 = avatarData['assistant2'];
```

## 🔒 Reglas de Seguridad

### Firebase Storage (storage.rules)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /assistants/{assistantId}/images/{imageFile} {
      // Lectura pública
      allow read: if true;
      
      // Escritura solo admins
      allow write, delete: if request.auth != null 
        && (
          request.auth.token.email == 'javier@cursosgratis.ai' ||
          request.auth.token.admin == true
        )
        && request.resource.size <= 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### Firestore (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /assistants/{assistantId} {
      // Lectura pública
      allow read: if true;
      
      // Solo admins pueden actualizar avatar
      allow update: if request.auth != null 
        && request.auth.token.admin == true
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['avatar']);
    }
  }
}
```

## 📱 Flujo de Usuario

### 1. **Subir Nueva Imagen**
1. Admin arrastra imagen al dropzone
2. Vista previa instantánea
3. Opcional: añadir texto ALT
4. Click "Guardar"
5. Sistema sube original + genera miniatura WebP
6. Actualiza Firestore con metadatos
7. UI se actualiza en tiempo real

### 2. **Reemplazar Imagen**
1. Click "Reemplazar" en imagen existente
2. Seleccionar nueva imagen
3. Sistema incrementa versión automáticamente
4. Borra versión anterior del Storage
5. Actualiza todas las vistas con cache busting

### 3. **Eliminar Imagen**
1. Click "Quitar"
2. Sistema borra archivos del Storage
3. Limpia campo avatar en Firestore
4. Vuelve a mostrar placeholder por defecto

## 🎯 Funcionalidades Clave

### ✅ **Características Implementadas**
- ✅ Subida con drag & drop
- ✅ Generación automática de miniaturas WebP
- ✅ Almacenamiento persistente Firebase Storage
- ✅ Metadatos en Firestore
- ✅ Cache busting automático con versioning
- ✅ Actualización tiempo real (onSnapshot)
- ✅ Validación tamaño/formato (5MB, JPG/PNG/WebP)
- ✅ Texto ALT para accesibilidad
- ✅ Borrado seguro con cleanup
- ✅ Reglas de seguridad admin-only
- ✅ Vista previa instantánea
- ✅ Barra de progreso
- ✅ Manejo de errores robusto
- ✅ Fallback a imágenes estáticas
- ✅ Integración en admin panel
- ✅ Integración en vistas públicas

### 🎨 **UX/UI**
- Dropzone visual con efectos hover
- Vista previa con overlay de versión
- Indicadores de estado (cargando, error, éxito)
- Botones contextuales (Reemplazar/Quitar/Guardar)
- Feedback visual con toasts
- Responsive design

### 🔄 **Tiempo Real**
- Cambios de imagen se propagan instantáneamente
- Hook personalizado para suscripciones automáticas
- Cleanup automático de suscripciones
- Optimización para múltiples asistentes

## 🧪 Testing & QA

### ✅ **Casos de Prueba**
1. **Subida exitosa**: Imagen se guarda y persiste tras recarga
2. **Reemplazo**: Imagen cambia en toda la app sin Ctrl+F5
3. **Eliminación**: Imagen desaparece y muestra placeholder
4. **Validación**: Rechaza archivos grandes/formatos incorrectos
5. **Permisos**: Solo admins pueden subir/modificar
6. **Tiempo real**: Cambios se ven en múltiples ventanas
7. **Cache busting**: Versiones nuevas se cargan inmediatamente

### 🐛 **Debugging**
```typescript
// Console logs automáticos
// 📡 Real-time update for assistant-id: {...}
// 📷 Avatar loaded with version: 3
// ✅ Upload completed: original + thumbnail
// 🔗 Cache busting URL: ...?v=3
```

## 📦 **Archivos del Sistema**

```
client/
├── lib/
│   └── assistantImageUploadService.ts    # Core upload logic
├── hooks/
│   └── useAssistantAvatar.ts            # Real-time hooks
├── components/
│   └── admin/
│       └── AssistantImageEditor.tsx     # UI editor
└── pages/
    └── admin/
        └── Assistants.tsx               # Integration

firestore.rules                          # Firestore security
storage.rules                           # Storage security
```

## 🚀 **Despliegue**

### 1. **Subir Reglas**
```bash
# Firebase CLI
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 2. **Verificar Permisos**
- Comprobar que admins tienen custom claims
- Verificar emails de admin en reglas
- Testear subida/eliminación

### 3. **Monitoreo**
- Firebase Console > Storage > Verificar uploads
- Firestore > assistants > Verificar metadatos avatar
- Cloud Functions logs si hay triggers

## 💡 **Próximas Mejoras**

- [ ] Compresión automática de imágenes grandes
- [ ] Múltiples tamaños (original, large, medium, thumb)
- [ ] Optimización WebP con fallback
- [ ] Bulk upload para múltiples asistentes
- [ ] Historial de versiones de imágenes
- [ ] Analytics de uso de imágenes
- [ ] CDN integration para mejor performance
