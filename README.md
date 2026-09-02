Sistema de Gestión de Mantenimiento Industrial
Aplicación web para la gestión y seguimiento del mantenimiento de equipos industriales.
El sistema permite registrar equipos, crear órdenes de mantenimiento, controlar sus estados, consultar el historial de cambios y aplicar reglas de negocio relacionadas con la eliminación de equipos y órdenes.
Tecnologías
Node.js
Express
MongoDB Atlas
Mongoose
Express Handlebars
Nodemon
Funcionalidades
Gestión de equipos
Crear equipos.
Consultar equipos.
Consultar el detalle de un equipo.
Editar equipos.
Eliminar equipos.
Controlar el estado del equipo:
Operativo
En mantenimiento
Fuera de servicio
Gestión de órdenes de mantenimiento
Crear órdenes.
Consultar órdenes.
Consultar el detalle de una orden.
Editar órdenes.
Eliminar órdenes.
Filtrar órdenes por estado, prioridad y tipo.
Buscar órdenes por título, descripción o nombre del equipo.
Paginación y ordenamiento.
Control de estados.
Estados de las órdenes
Las órdenes utilizan un flujo controlado:
pending
   ↓
in_progress
   ↓
completed
También se permite:
pending → cancelled
in_progress → cancelled
Una orden completed o cancelled no puede volver a un estado anterior.
Historial de estados
Cada cambio de estado genera un registro histórico que almacena:
Estado anterior.
Estado nuevo.
Fecha del cambio.
Además:
startedAt se registra cuando la orden pasa a in_progress.
completedAt se registra cuando la orden pasa a completed.
Reglas de negocio
Eliminación de equipos
Un equipo no puede eliminarse si tiene una orden de mantenimiento:
pending
o:
in_progress
En ese caso, el sistema devuelve un error 409 Conflict y muestra al usuario la orden que está bloqueando la eliminación.
Cuando no existen órdenes activas, el equipo puede eliminarse.
Las órdenes asociadas que se encuentran en estado:
completed
cancelled
también se eliminan al eliminar el equipo.
Edición de órdenes
La edición normal de una orden permite modificar:
Equipo
Título
Descripción
Tipo
Prioridad
Fecha programada
El estado de la orden no se modifica desde la edición. Los cambios de estado se realizan mediante el flujo específico de estados para mantener las reglas de negocio y registrar el historial.
Dashboard
La página principal muestra un resumen del sistema:
Equipos
Total de equipos.
Equipos operativos.
Equipos en mantenimiento.
Equipos fuera de servicio.
Órdenes
Total de órdenes.
Pendientes.
En progreso.
Completadas.
Canceladas.
Validaciones
El sistema valida los datos de entrada antes de crear o actualizar registros.
Entre otras validaciones:
Campos obligatorios.
Tipos de mantenimiento válidos.
Prioridades válidas.
Estados de equipos válidos.
Parámetros de paginación.
Manejo de errores
La aplicación diferencia entre las peticiones de la API y las vistas web.
Las rutas de API devuelven respuestas JSON.
Las rutas web muestran una vista de error en caso de fallo.
Ejemplo:
409 Conflict
No se puede eliminar el equipo porque tiene una orden de mantenimiento activa
La vista de error permite acceder directamente a la orden que está provocando el bloqueo.
API
Equipos
GET    /api/equipment
GET    /api/equipment/:id
POST   /api/equipment
PATCH  /api/equipment/:id
DELETE /api/equipment/:id
Órdenes de mantenimiento
GET    /api/maintenance-orders
GET    /api/maintenance-orders/:id
POST   /api/maintenance-orders
PATCH  /api/maintenance-orders/:id
DELETE /api/maintenance-orders/:id
PATCH  /api/maintenance-orders/:id/status
Filtros y paginación
La consulta de órdenes admite:
status
priority
type
search
page
limit
sort
Ejemplo:
GET /api/maintenance-orders?status=pending&priority=high&page=1&limit=10
Instalación
Clonar el repositorio:
git clone URL_DEL_REPOSITORIO
Entrar al proyecto:
cd maintenance-system-VSC
Instalar dependencias:
npm install
Variables de entorno
Crear un archivo .env en la raíz del proyecto:
MONGODB_URI=tu_cadena_de_conexion
El archivo .env no debe subirse al repositorio.
Ejecución
Modo desarrollo:
npm run dev
Modo normal:
npm start
La aplicación se ejecuta en:
http://localhost:3000
Arquitectura
El proyecto está organizado separando responsabilidades:
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
Para la interfaz web:
Routes
   ↓
View Controllers
   ↓
Handlebars
Las reglas de negocio se mantienen principalmente en la capa de servicios.
Objetivo del proyecto
Este proyecto fue desarrollado como práctica de backend utilizando Node.js, Express, MongoDB y Mongoose, con el objetivo de aplicar conceptos de arquitectura, APIs REST, validaciones, relaciones entre entidades, reglas de negocio, manejo de errores y renderizado del lado del servidor.
Autor
Martin Espindola