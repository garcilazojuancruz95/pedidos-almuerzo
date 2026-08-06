# 04 - Pantallas

## Objetivo

Este documento describe las pantallas que compondrán la plataforma y las funcionalidades disponibles en cada una.

El acceso a cada pantalla dependerá del rol del usuario autenticado.

---

# 1. Inicio de sesión

## Descripción

Será la pantalla de acceso a la plataforma.

Todos los usuarios deberán autenticarse utilizando su cuenta corporativa de Google Workspace mediante "Iniciar sesión con Google".

## Funcionalidades

- Iniciar sesión con Google.
- Cerrar sesión.

## Acceso

- Administrador
- Operador
- Empleado

---

# 2. Dashboard

## Descripción

Será la pantalla principal luego de iniciar sesión.

Mostrará las opciones disponibles según el rol del usuario autenticado.

## Administrador

Podrá acceder a:

- Gestión de Empresas.
- Gestión de Roles.

## Operador

Podrá acceder a:

- Publicaciones.
- Pedidos del día.
- Mi pedido.
- Gestión de Usuarios.
- Gestión de Rotiserías.
- Configuración.

## Empleado

Podrá acceder a:

- Publicaciones.

---

# 3. Gestión de Usuarios

## Descripción

Permitirá administrar los usuarios de la plataforma.

## Funcionalidades

- Editar usuario.
- Activar usuario.
- Desactivar usuario.
- Asignar rol.
- Cambiar empresa.
- Visualizar usuarios sincronizados desde Google Workspace.
- Habilitar usuario.
- Deshabilitar usuario.
- Asignar empresa.
- Asignar rol.

## Acceso

Solo Operador.

---

# 4. Gestión de Empresas

## Descripción

Permitirá administrar las empresas registradas en la plataforma.

## Funcionalidades

- Crear empresa.
- Editar empresa.
- Eliminar empresa.

## Acceso

Solo Administrador.

---

# 5. Gestión de Rotiserías

## Descripción

Permitirá administrar las rotiserías disponibles.

## Funcionalidades

- Crear rotisería.
- Editar rotisería.
- Eliminar rotisería.

## Acceso

Solo Operador.

---

# 6. Publicaciones

## Descripción

Permitirá publicar los menús diarios enviados por las rotiserías.

Cada publicación podrá contener:

- Una o varias imágenes.
- Un menú escrito.
- Aclaraciones.

## Funcionalidades

- Crear publicación.
- Editar publicación.
- Eliminar publicación.
- Subir imágenes.
- Escribir el menú.
- Agregar aclaraciones.
- Enviar notificación por correo al finalizar la publicación.

## Acceso

Solo Operador.

---

# 7. Menús del día

## Descripción

Mostrará todas las publicaciones correspondientes a la fecha actual.

Cada publicación mostrará:

- Nombre de la rotisería.
- Imágenes.
- Menú escrito.
- Aclaraciones.

## Funcionalidades

- Visualizar publicaciones.

## Acceso

- Operador.
- Empleado.

---

# 8. Pedidos del día

## Descripción

Mostrará todos los pedidos registrados para la fecha actual.

Permitirá visualizar los pedidos de forma general o agrupados por rotisería.

## Información mostrada

- Nombre.
- Apellido.
- Empresa.
- Rotisería.
- Pedido.
- Observaciones.

## Funcionalidades

- Buscar.
- Filtrar por empresa.
- Ver pedidos agrupados por rotisería.
- Exportar a Excel.
- Imprimir listado general.
- Imprimir listado por rotisería.
- Crear pedido manual.
- Registrar pedido para otro usuario.
- Registrar pedidos adicionales.
- Editar cualquier pedido.
- Eliminar cualquier pedido.
- Visualizar usuarios ausentes.

## Acceso

Solo Operador.

---

# 9. Perfil

## Descripción

Permitirá al usuario consultar su información personal.

## Funcionalidades

- Visualizar nombre.
- Visualizar correo electrónico.
- Visualizar empresa.
- Visualizar rol.
- Cerrar sesión.

## Acceso

- Administrador.
- Operador.
- Empleado.

---

# Pantallas futuras

Estas pantallas no formarán parte de la primera versión (MVP).

- Estadísticas.
- Centro de notificaciones.