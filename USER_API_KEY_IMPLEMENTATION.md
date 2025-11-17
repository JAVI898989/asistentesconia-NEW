# Sistema de API Key Personal - Implementación Completa

## 📋 Resumen

Se ha implementado un sistema completo para que los administradores usen su propia API key de OpenAI en lugar de la clave de la plataforma. Esto garantiza que:

✅ **Todos los consumos se cargan a TU cuenta de OpenAI**  
✅ **Control total sobre los gastos de API**  
✅ **Sin dependencia de claves de la plataforma**  
✅ **Seguridad**: La API key se guarda en Firebase en una subcolección privada  

## 🏗️ Arquitectura

### Componentes Creados

#### 1. **`client/lib/userApiKeyService.ts`**
Servicio para gestionar la API key del usuario en Firebase.

**Funciones principales:**
- `getUserApiKey(userId)` - Obtiene la API key del usuario
- `saveUserApiKey(userId, apiKey)` - Guarda la API key
- `deleteUserApiKey(userId)` - Elimina la API key
- `validateApiKey(apiKey, test?)` - Valida formato y opcionalmente prueba la key
- `hasUserApiKey(userId?)` - Verifica si el usuario tiene API key configurada
- `getCurrentUserApiKey()` - Obtiene la API key del usuario actual
- `maskApiKey(apiKey)` - Enmascara la key para mostrarla

#### 2. **`client/components/admin/ApiKeyConfiguration.tsx`**
Componente UI para configurar la API key.

**Características:**
- Formulario para introducir/editar API key
- Validación de formato (sk-...)
- Validación con API real de OpenAI
- Mostrar/ocultar API key
- Guardar/Eliminar API key
- Alertas de estado
- Instrucciones para obtener API key

#### 3. **`client/hooks/useUserApiKey.ts`**
Hook React para obtener automáticamente la API key del usuario.

**Retorna:**
```typescript
{
  apiKey: string | null,
  hasKey: boolean,
  isLoading: boolean,
  error: string | null,
  refresh: () => Promise<void>
}
```

### Modificaciones en el Servidor

#### 1. **`server/routes/openai.ts`**
- Acepta `userApiKey` opcional en el body
- Usa la API key del usuario si está presente
- Fallback a key del servidor (deprecated)
- Validación de API key antes de hacer llamadas

#### 2. **`server/routes/generate-tests-advanced.ts`**
- Acepta `userApiKey` en `TestGenerationRequest`
- Crea instancia de OpenAI con la key del usuario
- Valida que hay API key antes de generar

#### 3. **`server/routes/generate-flashcards-advanced.ts`**
- Acepta `userApiKey` en `FlashcardGenerationRequest`
- Crea instancia de OpenAI con la key del usuario
- Valida que hay API key antes de generar

### Modificaciones en Generadores

#### 1. **`client/lib/professionalTemarioGenerator.ts`**
- Acepta parámetro `userApiKey` opcional
- Envía la API key al servidor en el body

#### 2. **`client/lib/testFlashcardAdvancedGenerator.ts`**
- `generateTestBatch()` acepta `userApiKey`
- `generateFlashcardBatch()` acepta `userApiKey`
- Envía la API key en requests a `/api/generate-tests-advanced` y `/api/generate-flashcards-advanced`

#### 3. **`client/lib/gamesGenerator.ts`**
- `generateGamesFromContent()` acepta `userApiKey`
- Envía la API key al servidor

#### 4. **`client/components/admin/TemarioGeneratorTab.tsx`**
- Usa `useUserApiKey()` hook
- Muestra alerta si no hay API key configurada
- Deshabilita generación si no hay API key
- Pasa la API key a todos los generadores

## 📂 Estructura de Datos en Firebase

```
users/
  {userId}/
    private/
      apiKeys/
        openaiApiKey: "sk-..."
        encrypted: false
        createdAt: Timestamp
        updatedAt: Timestamp
        lastValidated: Timestamp
        isValid: boolean
```

**Seguridad:**
- La subcolección `private/` solo es accesible por el usuario propietario
- Las reglas de Firestore deben proteger esta ruta

## 🔧 Cómo Integrar

### Paso 1: Añadir pestaña de configuración en el panel admin

En `client/components/admin/AssistantContentManager.tsx` o donde tengas el panel:

```tsx
import ApiKeyConfiguration from "@/components/admin/ApiKeyConfiguration";

// Dentro de tus Tabs:
<TabsContent value="api-config">
  <ApiKeyConfiguration />
</TabsContent>
```

O crear una página dedicada:

```tsx
// client/pages/admin/Settings.tsx
import ApiKeyConfiguration from "@/components/admin/ApiKeyConfiguration";

export default function Settings() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1>Configuración</h1>
        <ApiKeyConfiguration />
      </div>
    </AdminLayout>
  );
}
```

### Paso 2: Actualizar reglas de Firestore

Añadir a `firestore.rules`:

```
match /users/{userId}/private/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### Paso 3: Verificar el flujo

1. Usuario va a "Configuración"
2. Introduce su API key de OpenAI
3. Click "Guardar API Key"
4. El sistema valida formato
5. Se guarda en Firebase (users/{uid}/private/apiKeys)
6. Ahora puede generar contenido
7. Todos los consumos se cargan a su cuenta de OpenAI

## 🎯 Uso del Sistema

### Para el Administrador

1. **Obtener API Key de OpenAI:**
   - Ir a https://platform.openai.com/api-keys
   - Crear nueva secret key
   - Copiar la key (empieza con `sk-`)

2. **Configurar en la plataforma:**
   - Ir a panel admin → Configuración (o pestaña configurada)
   - Pegar la API key
   - Click "Guardar API Key"
   - Opcionalmente "Validar" para probar con OpenAI

3. **Generar contenido:**
   - Ir a "Generar Temario"
   - Ver alerta verde: "✅ API Key configurada"
   - Generar temarios/tests/flashcards/juegos
   - Todos los consumos van a tu cuenta

4. **Ver consumo:**
   - Ir a https://platform.openai.com/usage
   - Ver detalles de consumo por fecha/modelo

### Ventajas para el Usuario

✅ **Control total**: Decides cuánto gastar  
✅ **Transparencia**: Ves exactamente qué se consume  
✅ **Sin sorpresas**: Los cargos van directo a tu tarjeta  
✅ **Privacidad**: Tu API key está protegida en Firebase  
✅ **Flexibilidad**: Puedes cambiar/eliminar la key cuando quieras  

## 🔒 Seguridad

### Almacenamiento
- API keys se guardan en subcolección `private/` en Firestore
- Solo el usuario propietario puede leer/escribir
- No se almacena en localStorage ni cookies

### Transmisión
- API key se envía en el body de requests POST (HTTPS)
- Nunca se expone en URLs ni query params
- El servidor la usa temporalmente y no la almacena

### Validación
- Validación de formato antes de guardar (sk-...)
- Opcional: validación con API real de OpenAI
- Mensajes de error claros si la key es inválida

## 🐛 Solución de Problemas

### Error: "API key no configurada"

**Causa**: No has introducido tu API key  
**Solución**: Ve a Configuración y añade tu API key de OpenAI

### Error: "API Key inválida o sin permisos"

**Causa**: La key no es válida o no tiene acceso a Chat Completions  
**Solución**: 
1. Verifica que copiaste la key completa
2. Asegúrate de que empieza con `sk-`
3. Verifica en OpenAI Platform que la key existe
4. Comprueba que tienes créditos en tu cuenta de OpenAI

### Error: "No se pudo guardar la API key"

**Causa**: Error de Firebase o permisos  
**Solución**:
1. Verifica que estás autenticado
2. Comprueba las reglas de Firestore
3. Revisa la consola del navegador

### El consumo no aparece en mi cuenta de OpenAI

**Causa**: Puede tardar unos minutos en reflejarse  
**Solución**: Espera 5-10 minutos y recarga https://platform.openai.com/usage

## 📊 Costos Estimados

Con GPT-4o-mini (modelo usado por defecto):

| Operación | Tokens aprox. | Costo aprox. |
|-----------|---------------|--------------|
| Temario (2500 palabras) | ~4,000 | $0.0024 |
| Test (20 preguntas) | ~2,000 | $0.0012 |
| Flashcard (15 tarjetas) | ~1,500 | $0.0009 |
| Juegos (4 tipos) | ~2,500 | $0.0015 |
| **Total por tema** | **~10,000** | **~$0.006** |

**Ejemplo:** Generar 10 temas completos ≈ $0.06 USD

## 🔄 Migración desde Sistema Antiguo

Si ya tienes contenido generado con la key del servidor:

1. **No se pierde nada**: Todo el contenido existente permanece
2. **Nueva generación**: Usa tu API key desde ahora
3. **Sin cambios**: Los usuarios finales no notan diferencia
4. **Coexistencia**: Puedes tener ambos sistemas temporalmente

## 📝 Próximas Mejoras

- [ ] Encriptación de API keys en Firebase
- [ ] Límites de uso por usuario
- [ ] Dashboard de consumo integrado
- [ ] Alertas de límite de gasto
- [ ] Soporte para múltiples providers (Anthropic, etc.)
- [ ] API keys a nivel de organización/academia

## 🎓 Recursos

- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [OpenAI Usage Dashboard](https://platform.openai.com/usage)
- [OpenAI Pricing](https://openai.com/pricing)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## ✅ Checklist de Implementación

- [x] Servicio de gestión de API keys (`userApiKeyService.ts`)
- [x] Componente de configuración UI (`ApiKeyConfiguration.tsx`)
- [x] Hook para obtener API key (`useUserApiKey.ts`)
- [x] Servidor: Aceptar API key del usuario (`server/routes/openai.ts`)
- [x] Servidor: Tests avanzados (`server/routes/generate-tests-advanced.ts`)
- [x] Servidor: Flashcards avanzados (`server/routes/generate-flashcards-advanced.ts`)
- [x] Cliente: Generador de temarios (`professionalTemarioGenerator.ts`)
- [x] Cliente: Generador de tests/flashcards (`testFlashcardAdvancedGenerator.ts`)
- [x] Cliente: Generador de juegos (`gamesGenerator.ts`)
- [x] UI: Integrar en TemarioGeneratorTab (`TemarioGeneratorTab.tsx`)
- [x] UI: Alertas de estado de API key
- [x] UI: Deshabilitar generación sin API key
- [ ] Reglas de Firestore (pendiente configurar)
- [ ] Integrar componente de configuración en panel admin
- [ ] Documentar para usuarios finales

## 📄 Licencia

Propietario - Todos los derechos reservados
