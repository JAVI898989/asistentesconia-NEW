# Sistema de Control de Accesos Implementado

## Resumen

Se ha implementado un sistema completo de control de accesos basado en roles que organiza la gestión de usuarios y restringe el acceso según el tipo de usuario y estado de suscripción.

## Estructura de Roles

### 1. Administrador (`admin`)
- **Email por defecto:** `admin@admin.com`
- **Contraseña por defecto:** `administrador123`
- **Permisos:**
  - Acceso completo al panel de administración
  - Gestión de usuarios y roles
  - Configuración de asistentes y contenido
  - Acceso sin restricciones a todas las funcionalidades
  - No necesita suscripción para acceder a ninguna parte

### 2. Academia (`academy`)
- **Permisos:**
  - Crear grupos de alumnos
  - Asignar asistentes a los alumnos
  - Añadir profesores/tutores
  - Ver y gestionar el progreso de los alumnos
  - Configurar precios y suscripciones según tramos

### 3. Estudiante (`student`)
- **Con suscripción activa:**
  - Chat con asistente especializado
  - Acceso completo al temario
  - Tests y evaluaciones
  - Flashcards de repaso
  - Seguimiento de progreso y motivación
- **Sin suscripción:**
  - Solo información pública del asistente
  - Descripción y requisitos
  - Información sobre sueldo
  - Fechas de examen
  - No puede usar chat, temario, tests ni flashcards

## Archivos Implementados

### 1. Control de Acceso Central
- `client/lib/accessControl.ts` - Utilidades de control de accesos
- `client/hooks/useUserRole.ts` - Hook para gestión de roles y permisos
- `client/components/AccessControl.tsx` - Componente de control de accesos

### 2. Paneles Organizados
- `client/components/panels/StudentPanel.tsx` - Panel de estudiante con restricciones de pago
- `client/components/panels/AcademyPanel.tsx` - Panel de gestión de academias
- `client/pages/RoleBasedRouter.tsx` - Enrutador automático por rol

### 3. Configuración de Admin
- `client/components/AdminInit.tsx` - Configuración de usuario administrador
- Credenciales por defecto configuradas
- Setup automático de permisos

### 4. Rutas Protegidas
- `client/App.tsx` actualizado con control de accesos
- Rutas organizadas por tipo de usuario
- Redirección automática según rol

## Funcionalidades por Panel

### Panel de Administrador
- Gestión completa del sistema
- Administrar usuarios, roles y permisos
- Configurar asistentes y contenido
- Ver todas las estadísticas
- Acceso sin restricciones

### Panel de Estudiante
- **Tabs disponibles:** Dashboard, Chat, Temario, Tests, Flashcards, Progreso
- **Con suscripción:** Acceso completo a todas las funcionalidades
- **Sin suscripción:** 
  - Solo información pública
  - Botones para suscribirse
  - Vista restringida con mensajes de "contenido premium"

### Panel de Academia
- **Tabs disponibles:** Panel, Alumnos, Profesores, Configuración
- Gestión de estudiantes y profesores
- Asignación de asistentes
- Seguimiento de progreso
- Configuración de suscripciones

## Verificación de Pagos

### Sistema de Suscripciones
- Verificación en tiempo real del estado de suscripción
- Integración con Stripe para verificar pagos
- Estados: `active`, `trialing`, `inactive`
- Los administradores tienen acceso completo sin suscripción

### Restricciones de Contenido
- Chat: Solo usuarios con suscripción activa
- Temario: Solo usuarios con suscripción activa
- Tests: Solo usuarios con suscripción activa
- Flashcards: Solo usuarios con suscripción activa
- Información pública: Todos los usuarios

## Seguridad

### Autenticación
- Verificación de roles en Firebase
- Tokens JWT con claims personalizados
- Verificación en Firestore como respaldo

### Autorización
- Control de acceso a nivel de ruta
- Verificación de permisos por funcionalidad
- Redirección automática si no hay permisos

### Validación de Pagos
- Verificación de suscripción en tiempo real
- Sincronización con Stripe
- Estados de suscripción actualizados automáticamente

## Flujo de Usuario

### 1. Login/Registro
1. Usuario se registra o inicia sesión
2. Sistema determina el rol automáticamente
3. Redirección al panel apropiado

### 2. Navegación
1. Control de accesos verifica permisos en cada ruta
2. Redirección automática si no hay acceso
3. Mensajes informativos sobre restricciones

### 3. Contenido Premium
1. Verificación de suscripción en tiempo real
2. Bloqueo de contenido premium sin suscripción
3. Llamadas a la acción para suscribirse

## Configuración Inicial

### Crear Administrador por Defecto
1. Ir a `/admin/init`
2. Usar "Crear Administrador por Defecto"
3. O usar configuración manual con credenciales personalizadas

### Credenciales por Defecto
- Email: `admin@admin.com`
- Contraseña: `administrador123`

## Rutas Principales

- `/admin` - Panel de administrador
- `/estudiante` - Panel de estudiante
- `/academia-panel` - Panel de academia
- `/mi-panel` - Redirección automática por rol
- `/admin/init` - Configuración inicial de administrador

Este sistema garantiza que cada usuario solo pueda acceder a las funcionalidades apropiadas para su rol y estado de suscripción, manteniendo la seguridad y organización del acceso a contenido premium.
