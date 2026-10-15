# Sistema de Gestión de Mantenimiento Industrial

Aplicación web para gestionar equipos industriales y órdenes de mantenimiento, con seguimiento de estados, asignación de técnicos y control de acceso según roles de usuario.

El proyecto está desarrollado con **Node.js, Express y MongoDB**, aplicando arquitectura por capas, APIs REST, autenticación mediante sesiones y JWT, validaciones y reglas de negocio.

## Tecnologías principales

- **Backend:** Node.js y Express
- **Base de datos:** MongoDB Atlas y Mongoose
- **Vistas:** Express Handlebars
- **Autenticación:** Express Session y JSON Web Token (JWT)
- **Seguridad:** bcrypt y autorización basada en roles
- **Pruebas:** Node.js Test Runner
- **Desarrollo:** Nodemon

## Funcionalidades principales

- Gestión de equipos y órdenes de mantenimiento.
- Asignación de técnicos y seguimiento de tareas.
- Historial de cambios de estado.
- Autenticación y autorización mediante roles: admin, supervisor y technician.
- API REST con filtros, búsqueda, paginación y validaciones.
- Dashboard con indicadores de equipos y órdenes.
- Reglas de negocio para proteger la integridad de los datos.

## Gestión de equipos

- Crear equipos.
- Consultar equipos.
- Consultar el detalle de un equipo.
- Editar equipos.
- Eliminar equipos.
- Controlar el estado del equipo:
  - Operativo
  - En mantenimiento
  - Fuera de servicio

## Gestión de órdenes de mantenimiento

- Crear órdenes.
- Consultar órdenes.
- Consultar el detalle de una orden.
- Editar órdenes.
- Eliminar órdenes.
- Asignar un técnico a una orden.
- Filtrar órdenes por estado, prioridad y tipo.
- Buscar órdenes por título, descripción o nombre del equipo.
- Paginación y ordenamiento.
- Control de estados.

## Estados de las órdenes

Las órdenes utilizan un flujo controlado:

```text
pending
   ↓
in_progress
   ↓
completed
```

También se permite:

- `pending` → `cancelled`
- `in_progress` → `cancelled`

Una orden `completed` o `cancelled` no puede volver a un estado anterior.

## Historial de estados

Cada cambio de estado genera un registro histórico que almacena:

- Estado anterior.
- Estado nuevo.
- Fecha del cambio.

Además:

- `startedAt` se registra cuando la orden pasa a `in_progress`.
- `completedAt` se registra cuando la orden pasa a `completed`.

## Asignación de técnicos

Las órdenes de mantenimiento pueden tener un técnico asignado.

El sistema valida que el usuario seleccionado tenga el rol `technician`.

La información del técnico asignado se obtiene mediante la relación entre las órdenes y los usuarios.

## Reglas de negocio

### Eliminación de equipos

Un equipo no puede eliminarse si tiene una orden de mantenimiento en estado `pending` o `in_progress`.

En ese caso, el sistema devuelve un error `409 Conflict` y muestra al usuario la orden que está bloqueando la eliminación.

Cuando no existen órdenes activas, el equipo puede eliminarse.

Las órdenes asociadas que se encuentran en estado `completed` o `cancelled` también se eliminan al eliminar el equipo.

### Edición de órdenes

La edición normal de una orden permite modificar:

- Equipo.
- Técnico asignado.
- Título.
- Descripción.
- Tipo.
- Prioridad.
- Fecha programada.

El estado de la orden no se modifica desde la edición.

Los cambios de estado se realizan mediante el flujo específico de estados para mantener las reglas de negocio y registrar el historial.

## Autenticación y autorización

El sistema implementa autenticación mediante sesiones y JSON Web Token (JWT).

### Login

La API dispone de un endpoint para iniciar sesión:

```http
POST /api/auth/login
```

El login recibe las credenciales del usuario y devuelve:

- Token JWT.
- Datos básicos del usuario.
- Rol del usuario.

Además, se crea una sesión para utilizar la autenticación en las vistas web.

### JWT

El token JWT contiene la siguiente información:

- `id`
- `role`

El token tiene una duración de **1 hora**.

Para acceder a rutas protegidas mediante JWT, el token debe enviarse en el encabezado `Authorization` utilizando el formato:

```http
Authorization: Bearer <token>
```

El middleware de autenticación verifica el token y, si es válido, guarda la información decodificada en `req.user`.

Si el token no existe, tiene un formato incorrecto, es inválido o está expirado, la API devuelve un error `401 Unauthorized`.

### Roles

El sistema utiliza tres roles:

- `admin`
- `supervisor`
- `technician`

Los permisos se controlan mediante autorización basada en roles.

### Permisos principales

| Funcionalidad | Admin | Supervisor | Técnico |
|---|:---:|:---:|:---:|
| Consultar equipos | ✓ | ✓ | ✓ |
| Crear equipos | ✓ | | |
| Editar equipos | ✓ | | |
| Eliminar equipos | ✓ | | |
| Consultar órdenes | ✓ | ✓ | ✓ |
| Crear órdenes | ✓ | ✓ | |
| Editar órdenes | ✓ | ✓ | |
| Eliminar órdenes | ✓ | | |
| Cambiar estado de órdenes | ✓ | ✓ | ✓ |
| Gestionar usuarios | ✓ | | |

El sistema verifica los permisos directamente en las rutas protegidas, evitando que un usuario pueda acceder mediante una URL o petición directa a una función que no tiene autorizada.

## Gestión de usuarios

Los usuarios pueden ser gestionados desde la aplicación web por usuarios con rol `admin`.

Las funcionalidades incluyen:

- Consultar usuarios.
- Consultar el detalle de un usuario.
- Crear usuarios.
- Editar usuarios.
- Asignar roles.

Las contraseñas no se muestran en las consultas de usuarios.

Las contraseñas se almacenan utilizando `bcrypt` para su hash.

## Dashboard

La página principal muestra un resumen del sistema.

### Equipos

- Total de equipos.
- Equipos operativos.
- Equipos en mantenimiento.
- Equipos fuera de servicio.

### Órdenes

- Total de órdenes.
- Pendientes.
- En progreso.
- Completadas.
- Canceladas.

## Validaciones

El sistema valida los datos de entrada antes de crear o actualizar registros.

Entre otras validaciones:

- Campos obligatorios.
- Tipos de mantenimiento válidos.
- Prioridades válidas.
- Estados de equipos válidos.
- Estados de órdenes válidos.
- Parámetros de paginación.
- Usuario asignado con rol de técnico.

## Manejo de errores

La aplicación diferencia entre las peticiones de la API y las vistas web.

- Las rutas de API devuelven respuestas JSON.
- Las rutas web muestran una vista de error en caso de fallo.

Ejemplo:

```text
409 Conflict

No se puede eliminar el equipo porque tiene una orden de mantenimiento activa
```

La vista de error permite acceder directamente a la orden que está provocando el bloqueo.

## API

### Autenticación

| Método | Endpoint |
|---|---|
| POST | `/api/auth/login` |

### Equipos

| Método | Endpoint |
|---|---|
| GET | `/api/equipment` |
| GET | `/api/equipment/:id` |
| POST | `/api/equipment` |
| PATCH | `/api/equipment/:id` |
| DELETE | `/api/equipment/:id` |

### Órdenes de mantenimiento

| Método | Endpoint |
|---|---|
| GET | `/api/maintenance-orders` |
| GET | `/api/maintenance-orders/:id` |
| POST | `/api/maintenance-orders` |
| PATCH | `/api/maintenance-orders/:id` |
| DELETE | `/api/maintenance-orders/:id` |
| PATCH | `/api/maintenance-orders/:id/status` |

### Usuarios

| Método | Endpoint |
|---|---|
| GET | `/api/users` |
| GET | `/api/users/:id` |
| POST | `/api/users` |
| PATCH | `/api/users/:id` |

### Filtros y paginación

La consulta de órdenes admite los siguientes parámetros:

- `status`
- `priority`
- `type`
- `search`
- `page`
- `limit`
- `sort`

Ejemplo:

```http
GET /api/maintenance-orders?status=pending&priority=high&page=1&limit=10
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/martinsebastian1980/industrial-maintenance-system.git
```

### 2. Entrar al proyecto

```bash
cd industrial-maintenance-system
```

### 3. Instalar dependencias

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
MONGO_URI=tu_cadena_de_conexion
SESSION_SECRET=tu_clave_secreta
JWT_SECRET=tu_clave_secreta_jwt
```

El archivo `.env` no debe subirse al repositorio.

## Ejecución

### Modo desarrollo

```bash
npm run dev
```

### Modo normal

```bash
npm start
```

La aplicación se ejecuta en:

```text
http://localhost:3000
```

## Arquitectura

El proyecto está organizado separando responsabilidades:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

Para la interfaz web:

```text
Routes
   ↓
View Controllers
   ↓
Services
   ↓
Handlebars
```

Las reglas de negocio se mantienen principalmente en la capa de servicios.

## Seguridad y autorización

El proyecto utiliza diferentes mecanismos de seguridad:

- Hash de contraseñas mediante `bcrypt`.
- Sesiones mediante `express-session`.
- Autenticación mediante JWT.
- Middleware de autenticación.
- Middleware de autorización basado en roles.
- Protección de rutas según permisos.
- Validación del técnico asignado a las órdenes.

## Objetivo del proyecto

Este proyecto fue desarrollado como práctica de backend utilizando Node.js, Express, MongoDB y Mongoose, con el objetivo de aplicar conceptos de:

- Arquitectura por capas.
- APIs REST.
- Autenticación.
- Autorización basada en roles.
- Sesiones.
- JWT.
- Validaciones.
- Relaciones entre entidades.
- Reglas de negocio.
- Manejo de errores.
- Persistencia con MongoDB.
- Renderizado del lado del servidor con Handlebars.

El proyecto está orientado a demostrar conocimientos prácticos de desarrollo backend y servir como proyecto de portfolio.

## Autor

**Martin Espindola**
