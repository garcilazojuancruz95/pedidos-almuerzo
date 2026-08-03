# 01 - Objetivo del Proyecto

## Nombre del proyecto

**Plataforma Web de Gestión de Pedidos de Almuerzo**

---

# Objetivo

Desarrollar una plataforma web responsive que permita gestionar de forma simple, rápida y organizada los pedidos diarios de almuerzo de los empleados de la empresa.

La plataforma deberá funcionar correctamente tanto en computadoras como en dispositivos móviles, permitiendo que los empleados realicen sus pedidos desde cualquier dispositivo y que los Operadores administren las publicaciones diarias y obtengan el listado final de pedidos.

---

# Alcance del proyecto

La plataforma permitirá:

- Publicar diariamente los menús enviados por las rotiserías.
- Permitir que cada empleado realice un único pedido por día.
- Centralizar todos los pedidos del día en un único lugar.
- Evitar pedidos mediante WhatsApp o mensajes individuales.
- Generar un listado de pedidos agrupado por rotisería.
- Exportar e imprimir los pedidos para enviarlos a cada rotisería.

---

# Roles del sistema

La plataforma contará con tres tipos de usuarios.

## Administrador

Será un usuario técnico destinado exclusivamente a la administración de la plataforma.

Podrá:

- Crear usuarios.
- Editar usuarios.
- Activar o desactivar usuarios.
- Restablecer contraseñas.
- Asignar roles.
- Crear empresas.
- Editar empresas.
- Eliminar empresas.
- Crear rotiserías.
- Editar rotiserías.
- Eliminar rotiserías.

No podrá:

- Publicar menús.
- Ver pedidos.
- Gestionar pedidos.
- Exportar pedidos.
- Imprimir pedidos.
- Realizar pedidos.

---

## Operador

Será el responsable de la gestión diaria de los pedidos.

Podrá:

- Publicar los menús diarios.
- Crear publicaciones.
- Editar publicaciones.
- Eliminar publicaciones.
- Subir una o varias imágenes por publicación.
- Cargar el menú cuando sea recibido en formato texto.
- Agregar aclaraciones.
- Visualizar las publicaciones del día.
- Ver el listado completo de pedidos del día.
- Ver los pedidos agrupados por rotisería.
- Exportar el listado a Excel.
- Imprimir los pedidos.
- Realizar, modificar y eliminar su propio pedido.

No podrá:

- Administrar usuarios.
- Administrar empresas.
- Administrar rotiserías.
- Asignar permisos.
- Restablecer contraseñas.

---

## Empleado

Cada empleado deberá iniciar sesión con su usuario y contraseña.

Podrá:

- Visualizar las publicaciones del día.
- Seleccionar la rotisería desde la que desea realizar el pedido.
- Escribir libremente el nombre del plato que desea solicitar.
- Solicitar comidas que no figuren en las publicaciones.
- Agregar observaciones.
- Modificar su pedido.
- Eliminar su pedido.

Los empleados únicamente podrán visualizar y administrar su propio pedido.

---

# Matriz de permisos

| Funcionalidad                        | Administrador | Operador | Empleado |
|--------------------------------------|:-------------:|:--------:|:--------:|
| Iniciar sesión                       |      ✅       |    ✅    |    ✅    |
| Administrar usuarios                 |      ✅       |    ❌    |    ❌    |
| Administrar empresas                 |      ✅       |    ❌    |    ❌    |
| Administrar rotiserías               |      ✅       |    ❌    |    ❌    |
| Asignar permisos                     |      ✅       |    ❌    |    ❌    |
| Restablecer contraseñas              |      ✅       |    ❌    |    ❌    |
| Publicar menús                       |      ❌       |    ✅    |    ❌    |
| Editar publicaciones                 |      ❌       |    ✅    |    ❌    |
| Eliminar publicaciones               |      ❌       |    ✅    |    ❌    |
| Ver publicaciones del día            |      ❌       |    ✅    |    ✅    |
| Ver listado de pedidos del día       |      ❌       |    ✅    |    ❌    |
| Ver pedidos por rotisería            |      ❌       |    ✅    |    ❌    |
| Exportar pedidos a Excel             |      ❌       |    ✅    |    ❌    |
| Imprimir pedidos                     |      ❌       |    ✅    |    ❌    |
| Realizar su propio pedido            |      ❌       |    ✅    |    ✅    |
| Modificar su propio pedido           |      ❌       |    ✅    |    ✅    |
| Eliminar su propio pedido            |      ❌       |    ✅    |    ✅    |

---

# Requisitos generales

La plataforma deberá cumplir con los siguientes requisitos:

- Ser completamente responsive.
- Funcionar correctamente en computadoras y dispositivos móviles.
- Requerir autenticación para acceder.
- Diferenciar permisos según el rol del usuario.
- Permitir un único pedido por usuario y por día.
- Mantener una interfaz simple, rápida e intuitiva.
- Centralizar toda la información en una base de datos.
- Mostrar automáticamente los pedidos agrupados por rotisería.

---

# Documentación relacionada

La información detallada del proyecto se encuentra organizada en los siguientes documentos:

- **02 - Base de Datos:** Modelo de datos y estructura de la base.
- **03 - Flujo del Sistema y Reglas de Negocio:** Funcionamiento de la plataforma y reglas de negocio.
- **04 - Pantallas:** Descripción de las pantallas de la aplicación.
- **05 - Backlog:** Tareas pendientes y planificación del desarrollo.
- **06 - Mejoras Futuras:** Funcionalidades previstas para versiones posteriores.

---

# Objetivo de la primera versión (MVP)

La primera versión deberá incluir:

- Inicio de sesión.
- Administración de usuarios.
- Administración de empresas.
- Administración de rotiserías.
- Publicación de menús.
- Visualización de las publicaciones del día.
- Registro, modificación y eliminación de pedidos.
- Visualización del listado de pedidos del día.
- Visualización de pedidos agrupados por rotisería.
- Exportación del listado a Excel.
- Impresión del listado de pedidos.