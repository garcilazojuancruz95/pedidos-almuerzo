# 04 - Pantallas

## Objetivo

Este documento describe las pantallas que compondrán la plataforma y las funcionalidades disponibles en cada una.

El acceso a cada pantalla dependerá del rol del usuario autenticado.

---

# 1. Inicio de sesión

## Descripción

Será la pantalla de acceso a la plataforma.

Todos los usuarios deberán autenticarse mediante correo electrónico y contraseña.

## Funcionalidades

- Ingresar correo electrónico.
- Ingresar contraseña.
- Iniciar sesión.
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

- Gestión de Usuarios.
- Gestión de Empresas.
- Gestión de Rotiserías.

## Operador

Podrá acceder a:

- Publicaciones.
- Pedidos del día.
- Mi pedido.

## Empleado

Podrá acceder a:

- Menús del día.
- Mi pedido.

---

# 3. Gestión de Usuarios

## Descripción

Permitirá administrar los usuarios de la plataforma.

## Funcionalidades

- Crear usuario.
- Editar usuario.
- Activar usuario.
- Desactivar usuario.
- Restablecer contraseña.
- Asignar rol.
- Cambiar empresa.

## Acceso

Solo Administrador.

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

Solo Administrador.

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

# 8. Mi pedido

## Descripción

Permitirá registrar y administrar el pedido correspondiente al día.

## Funcionalidades

- Seleccionar la rotisería.
- Escribir el pedido.
- Agregar observaciones.
- Guardar pedido.
- Modificar pedido.
- Eliminar pedido.

## Acceso

- Operador.
- Empleado.

---

# 9. Pedidos del día

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

## Acceso

Solo Operador.

---

# 10. Perfil

## Descripción

Permitirá al usuario consultar su información personal.

## Funcionalidades

- Buscar.
- Filtrar por empresa.
- Ver pedidos agrupados por rotisería.
- Visualizar usuarios pendientes de realizar el pedido.
- Exportar a Excel.
- Imprimir listado general.
- Imprimir listado por rotisería.

## Acceso

- Administrador.
- Operador.
- Empleado.

---

# Pantallas futuras

Estas pantallas no formarán parte de la primera versión (MVP).

- Configuración general.
- Estadísticas.
- Centro de notificaciones.