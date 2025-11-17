# Migración de Firebase a Nhost - Guía Completa

## Estado de la migración

✅ Frontend actualizado para usar Nhost Auth y GraphQL  
✅ Base de datos schema SQL creado (NHOST_SCHEMA.sql)  
✅ Variables de entorno configuradas  
✅ Cliente Nhost implementado  

## Pasos a seguir:

### 1. Ejecutar el Schema SQL en Nhost

1. Accede a tu consola de Nhost: https://console.nhost.io
2. Selecciona tu proyecto
3. Ve a SQL Editor
4. Copia y pega el contenido de **NHOST_SCHEMA.sql**
5. Ejecuta todo el SQL

Esto creará:
- Tablas de usuario, asistentes, temario, tests, flashcards
- Chat history, progreso de usuario
- Suscripciones y referrales
- Índices y triggers automáticos

### 2. Crear el Usuario Admin

Opción A - Via interfaz del app (recomendado):
1. Accede a la aplicación
2. Busca el componente AdminInit (normalmente en el footer o header)
3. Click en "Create Admin User"
4. Se creará automáticamente: **admin@admin.com / admin123**

Opción B - Via SQL directo:
1. En Nhost Console → SQL Editor
2. Ejecuta lo siguiente DESPUÉS de haber creado el auth user:

```sql
-- NOTA: Primero debes crear el usuario via Auth, luego obtener su ID y ejecutar esto:
-- INSERT INTO public.users (auth_id, email, display_name, role) VALUES 
-- ('AUTH_ID_AQUI', 'admin@admin.com', 'Admin', 'admin');
```

### 3. Variables de Entorno Frontend

Asegúrate de que estas variables estén en tu `.env` o `.env.local`:

```
VITE_NHOST_SUBDOMAIN=xxxhgktsthejyofspck
VITE_NHOST_REGION=eu-central-1
```

### 4. Variables de Entorno Backend

Para el servidor, asegúrate de tener:

```
NHOST_SUBDOMAIN=xxxhgktsthejyofspck
NHOST_REGION=eu-central-1
NHOST_ADMIN_SECRET=admin_secret_asistentesconia_2025
NHOST_JWT_SECRET=jwt_secret_asistentesconia_2025
NHOST_WEBHOOK_SECRET=webhook_secret_asistentesconia_2025
```

### 5. Actualizar las Rutas del Servidor

Las siguientes rutas aún necesitan actualización (usaremos GraphQL en lugar de Firestore):

**Rutas a actualizar:**
- ❌ `/api/checkout/family-pack` → ✅ (usar Nhost GraphQL)
- ❌ `/api/stripe/webhook` → ✅ (usar Nhost GraphQL)
- ❌ Otras rutas que usan Firestore

Ver archivo: `server/lib/nhost.ts` para las funciones helper

### 6. Poblar Asistentes (opcional)

Para que la aplicación tenga asistentes disponibles:

```sql
INSERT INTO public.assistants (assistant_id, name, description, price_monthly, price_annual) VALUES
('guardia-civil', 'Guardia Civil', 'Preparación para oposiciones Guardia Civil', 30, 300),
('auxiliar-administrativo-estado', 'Auxiliar Administrativo', 'Preparación para oposiciones', 25, 250),
-- ... agregar más asistentes según necesites
ON CONFLICT (assistant_id) DO NOTHING;
```

### 7. Verificar Funcionamiento

1. Accede a la aplicación
2. Intenta iniciar sesión con: **admin@admin.com / admin123**
3. Intenta enviar un mensaje en el chat
4. Verifica que se guarde el historial correctamente

## Archivos Modificados

- `client/lib/nhost.ts` - Cliente Nhost (nuevo)
- `client/lib/simpleAuth.ts` - Configuración de auth (actualizado)
- `client/components/Chat.tsx` - Chat con Nhost (actualizado)
- `client/components/AdminInit.tsx` - Init admin (actualizado)
- `client/lib/firebase.ts` - Stub de compatibilidad (para evitar errores de import)
- `server/lib/nhost.ts` - Funciones GraphQL para servidor (nuevo)
- `package.json` - Agregado axios, removido Firebase

## Firebase Removido

- ❌ Firebase authentication
- ❌ Firestore database
- ❌ Firebase storage
- ❌ react-firebase-hooks

Todos reemplazados con Nhost Auth + PostgreSQL + Nhost Storage

## Próximos Pasos (si necesario)

1. Migrar datos históricos de Firebase a PostgreSQL
2. Actualizar todas las rutas del servidor para usar GraphQL
3. Implementar webhooks de Stripe con Nhost
4. Probar todas las funcionalidades

## Soporte

Si encuentras errores, verifica:
1. Variables de entorno correctas
2. El schema SQL se ejecutó completamente
3. El usuario admin fue creado correctamente
4. La conexión a Nhost es accesible (CORS configurado si es necesario)

Para ver logs de GraphQL, abre la consola del navegador (F12) y busca "GraphQL Request"
