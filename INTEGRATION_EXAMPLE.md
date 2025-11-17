# Ejemplo de Integración del Sistema de API Key

## Opción 1: Añadir tab "Configuración" en AssistantContentManager

Edita `client/components/admin/AssistantContentManager.tsx`:

```tsx
import ApiKeyConfiguration from "./ApiKeyConfiguration";
import { Key } from "lucide-react";

// Dentro del componente, en la sección de Tabs:

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="overview">
      <Home className="w-4 h-4 mr-2" />
      Panorama
    </TabsTrigger>
    <TabsTrigger value="temario">
      <BookOpen className="w-4 h-4 mr-2" />
      Generar Temario
    </TabsTrigger>
    
    {/* NUEVA TAB: Configuración de API Key */}
    <TabsTrigger value="api-config">
      <Key className="w-4 h-4 mr-2" />
      Configuración
    </TabsTrigger>
  </TabsList>

  <TabsContent value="overview">
    {/* ... contenido existente ... */}
  </TabsContent>

  <TabsContent value="temario">
    <TemarioGeneratorTab assistant={selectedAssistant} />
  </TabsContent>

  {/* NUEVO CONTENIDO: Configuración de API Key */}
  <TabsContent value="api-config">
    <ApiKeyConfiguration />
  </TabsContent>
</Tabs>
```

## Opción 2: Crear página dedicada de Configuración

Crea `client/pages/admin/Settings.tsx`:

```tsx
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ApiKeyConfiguration from "@/components/admin/ApiKeyConfiguration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, User, Bell, Shield } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("api-keys");

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona tus preferencias y configuración de la plataforma
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="api-keys">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-4">
            <ApiKeyConfiguration />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>
                  Gestiona tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Contenido de perfil */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Contenido de notificaciones */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>
                  Gestiona la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Contenido de seguridad */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
```

Y añade la ruta en tu router:

```tsx
// En tu archivo de rutas (ej: App.tsx)
import Settings from "@/pages/admin/Settings";

<Route path="/admin/settings" element={<Settings />} />
```

## Opción 3: Modal flotante desde cualquier lugar

Crea un componente wrapper:

```tsx
// client/components/admin/ApiKeyModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import ApiKeyConfiguration from "./ApiKeyConfiguration";

export function ApiKeyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Key className="w-4 h-4" />
        Configurar API Key
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuración de API Key</DialogTitle>
          </DialogHeader>
          <ApiKeyConfiguration />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

Úsalo en cualquier página:

```tsx
import { ApiKeyModal } from "@/components/admin/ApiKeyModal";

// En tu componente:
<ApiKeyModal />
```

## Opción 4: Banner superior permanente

Si no hay API key, muestra un banner en todas las páginas de admin:

```tsx
// client/components/admin/ApiKeyBanner.tsx
import { useUserApiKey } from "@/hooks/useUserApiKey";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Key } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ApiKeyConfiguration from "./ApiKeyConfiguration";

export function ApiKeyBanner() {
  const { hasKey, isLoading } = useUserApiKey();
  const [showConfig, setShowConfig] = useState(false);

  if (isLoading || hasKey) {
    return null;
  }

  return (
    <>
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <strong>⚠️ API Key no configurada.</strong> Necesitas configurar tu API key de OpenAI para generar contenido.
          </span>
          <Button 
            size="sm" 
            onClick={() => setShowConfig(true)}
            className="ml-4"
          >
            <Key className="w-4 h-4 mr-2" />
            Configurar ahora
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="max-w-4xl">
          <ApiKeyConfiguration />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

Úsalo en AdminLayout:

```tsx
// client/components/admin/AdminLayout.tsx
import { ApiKeyBanner } from "./ApiKeyBanner";

export default function AdminLayout({ children }) {
  return (
    <div>
      <Header />
      <ApiKeyBanner /> {/* Banner permanente */}
      <main>{children}</main>
    </div>
  );
}
```

## Recomendación

**Mejor opción: Combinación de Opción 1 + Opción 4**

1. **Tab de Configuración** en AssistantContentManager para acceso fácil
2. **Banner superior** cuando no hay API key para recordatorio persistente

Esto garantiza que:
- ✅ El usuario siempre ve si falta la API key
- ✅ Puede configurarla fácilmente desde el banner
- ✅ Puede editarla/gestionarla desde la tab de Configuración
- ✅ No es intrusivo pero tampoco pasa desapercibido

## Configuración de Firestore Rules

Añade a tu archivo `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... otras reglas existentes ...
    
    // User private data - API keys
    match /users/{userId}/private/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Luego despliega:

```bash
firebase deploy --only firestore:rules
```

## Despliegue Completo

1. **Código ya implementado** ✅
2. **Añadir integración UI** (elige opción)
3. **Desplegar reglas de Firestore**:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. **Comunicar a usuarios**:
   - Enviar email explicando el cambio
   - Incluir enlace a instrucciones
   - Dar plazo razonable (ej: 1 semana)

## Mensaje para Usuarios

> **🔔 Cambio Importante: API Key Personal**
> 
> A partir del [FECHA], necesitarás configurar tu propia API key de OpenAI para generar contenido (temarios, tests, flashcards, juegos).
> 
> **¿Por qué?**
> - Control total sobre tus gastos de API
> - Transparencia en el consumo
> - Independencia de la plataforma
> 
> **¿Cómo?**
> 1. Obtén tu API key en https://platform.openai.com/api-keys
> 2. Ve a Configuración en el panel admin
> 3. Pega tu API key y guárdala
> 
> **Costo estimado:** ~$0.006 por tema completo (con GPT-4o-mini)
> 
> **¿Tienes dudas?** Contacta con soporte.

## Testing

Antes de desplegar a producción:

```bash
# 1. Prueba en local
npm run dev

# 2. Verifica:
# - Que puedes guardar API key
# - Que se valida correctamente
# - Que la generación funciona
# - Que sin API key se desactiva generación
# - Que los consumos aparecen en tu cuenta de OpenAI

# 3. Revisa Firebase Console
# - Que se crea el documento en users/{uid}/private/apiKeys
# - Que solo el usuario puede leerlo

# 4. Despliega
npm run build
# Sube a tu hosting
```

---

**¿Necesitas ayuda con la integración?** Revisa `USER_API_KEY_IMPLEMENTATION.md` para más detalles.
