# 05 - Backlog

## Objetivo

Este documento reúne todas las tareas pendientes del proyecto.

Las tareas podrán cambiar de prioridad durante el desarrollo.

---

# Fase 1 - Infraestructura

## Proyecto

- [x] Crear repositorio en GitHub.
- [x] Crear proyecto React + Vite.
- [x] Configurar Tailwind CSS.
- [x] Crear proyecto en Supabase.
- [x] Configurar conexión con Supabase.
- [x] Definir la estructura del proyecto.
- [x] Crear la documentación inicial.
- [x] Crear la estructura de la carpeta `database`.
- [x] Crear `001_schema.sql`.
- [x] Crear `001_seed.sql`.

---

# Fase 2 - Base de datos

## Modelo de datos

- [ ] Crear tabla Roles.
- [ ] Crear tabla Empresas.
- [ ] Crear tabla Usuarios.
- [ ] Crear tabla Rotiserías.
- [ ] Crear tabla Publicaciones.
- [ ] Crear tabla Publicación Imágenes.
- [ ] Crear tabla Pedidos.
- [ ] Crear claves foráneas.
- [ ] Crear índices.
- [ ] Ejecutar el esquema en Supabase.
- [ ] Cargar datos iniciales (`seed`).
- [ ] Crear tabla Configuración.
- [ ] Crear tabla Ausencias.

---

# Fase 3 - Autenticación

- [ ] Crear pantalla de inicio de sesión.
- [ ] Implementar autenticación con Google Workspace mediante Supabase Auth.
- [ ] Sincronizar usuarios desde Google Workspace.
- [ ] Implementar cierre de sesión.
- [ ] Proteger rutas privadas.
- [ ] Redireccionar según el rol del usuario.

---

# Fase 4 - Administración

## Usuarios

- [ ] Listar usuarios.
- [ ] Editar usuario.
- [ ] Activar usuario.
- [ ] Desactivar usuario.
- [ ] Asignar rol.
- [ ] Asignar empresa.
- [ ] Sincronizar usuarios desde Google Workspace.
- [ ] Buscar usuarios.

## Empresas

- [ ] Listar empresas.
- [ ] Crear empresa.
- [ ] Editar empresa.
- [ ] Eliminar empresa.

## Roles

- [ ] Listar roles.
- [ ] Crear rol.
- [ ] Editar rol.
- [ ] Eliminar rol.

## Rotiserías

- [ ] Listar rotiserías.
- [ ] Crear rotisería.
- [ ] Editar rotisería.
- [ ] Eliminar rotisería.

## Configuración

- [ ] Configurar hora límite para pedidos.

---

# Fase 5 - Publicaciones

- [ ] Crear publicación.
- [ ] Editar publicación.
- [ ] Eliminar publicación.
- [ ] Subir una o varias imágenes.
- [ ] Agregar menú escrito.
- [ ] Agregar aclaraciones.
- [ ] Mostrar publicaciones del día.
- [ ] Enviar correo electrónico al publicar los menús.

---

# Fase 6 - Pedidos

- [ ] Crear pedido.
- [ ] Modificar pedido.
- [ ] Eliminar pedido.
- [ ] Mostrar listado de pedidos del día.
- [ ] Mostrar usuarios que aún no realizaron el pedido del día.
- [ ] Mostrar pedidos agrupados por rotisería.
- [ ] Buscar pedidos.
- [ ] Filtrar pedidos por empresa.
- [ ] Exportar listado a Excel.
- [ ] Imprimir listado general.
- [ ] Imprimir listado por rotisería.
- [ ] Registrar múltiples pedidos por usuario.
- [ ] Registrar pedidos para otros usuarios.
- [ ] Registrar pedidos adicionales.
- [ ] Deshabilitar pedidos al alcanzar la hora límite.
- [ ] Visualizar usuarios ausentes.
- [ ] Marcar "No asistiré a la oficina".

---

# Fase 7 - Perfil

- [ ] Mostrar datos del usuario.
- [ ] Cerrar sesión.

---

# Fase 8 - Responsive

- [ ] Adaptar pantalla de inicio de sesión.
- [ ] Adaptar Dashboard.
- [ ] Adaptar Publicaciones.
- [ ] Adaptar Menús del día.
- [ ] Adaptar Panel de Administración.
- [ ] Adaptar Gestión de Usuarios.
- [ ] Adaptar Gestión de Rotiserías.
- [ ] Adaptar Configuración.

---

# Fase 9 - Automatización

- [ ] Eliminar automáticamente pedidos con más de 48 horas.
- [ ] Eliminar automáticamente publicaciones con más de 48 horas.
- [ ] Eliminar automáticamente imágenes asociadas a publicaciones eliminadas.

---

# Fase 10 - Pruebas

- [ ] Probar autenticación.
- [ ] Probar permisos por rol.
- [ ] Probar publicación de menús.
- [ ] Probar pedidos.
- [ ] Probar listado por rotisería.
- [ ] Probar exportación a Excel.
- [ ] Probar impresión.
- [ ] Probar funcionamiento en dispositivos móviles.
- [ ] Probar autenticación con Google.
- [ ] Probar sincronización de usuarios.
- [ ] Probar múltiples pedidos por usuario.
- [ ] Probar registro de pedidos por Operador.
- [ ] Probar hora límite de pedidos.
- [ ] Probar envío de correos electrónicos.
- [ ] Probar registro de ausencias.

---

# Fase 11 - Despliegue

- [ ] Configurar variables de entorno de producción.
- [ ] Publicar el frontend.
- [ ] Configurar dominio.
- [ ] Documentar el proceso de despliegue.

---

# Mejoras futuras

- [ ] Convertir la plataforma en PWA.
- [ ] Implementar notificaciones Push.
- [ ] Notificar cuando el pedido esté listo.
- [ ] Agregar estadísticas.
- [ ] Historial de pedidos.
- [ ] Historial de publicaciones.
- [ ] Auditoría de acciones.
- [ ] Dashboard con estadísticas.
- [ ] Reportes por empresa.