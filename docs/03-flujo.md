# 03 - Flujo del Sistema y Reglas de Negocio

## Objetivo

Este documento describe el funcionamiento de la plataforma desde la recepción de los menús hasta la obtención del listado final de pedidos.

También define las reglas de negocio que deberán respetarse durante el funcionamiento del sistema, independientemente de la tecnología utilizada.

---

# Flujo del sistema

## 1. Recepción de los menús

Las rotiserías enviarán diariamente sus menús mediante WhatsApp.

Los menús podrán recibirse en distintos formatos:

- Imagen.
- Texto.
- Imagen y texto.

El Operador publicará el contenido respetando el formato recibido.

No será necesario convertir automáticamente las imágenes a texto.

---

## 2. Publicación

Un Operador iniciará sesión en la plataforma.

Para cada rotisería podrá crear una publicación que podrá contener:

- Una o varias imágenes.
- Un menú escrito.
- Aclaraciones generales.

Cada rotisería podrá tener una única publicación por día.

Una vez publicada, los usuarios con rol Operador y Empleado podrán visualizarla.

---

## 3. Visualización

Los usuarios con rol Operador y Empleado iniciarán sesión.

La plataforma mostrará todas las publicaciones correspondientes al día.

Cada publicación mostrará:

- Nombre de la rotisería.
- Imágenes.
- Menú escrito.
- Aclaraciones.

---

## 4. Realización del pedido

Los usuarios con rol Operador y Empleado podrán realizar un único pedido por día.

Para ello deberán:

- Seleccionar la rotisería.
- Escribir el plato que desean solicitar.
- Agregar observaciones (opcional).

No será obligatorio solicitar una comida publicada.

El sistema permitirá escribir libremente el nombre del plato.

---

## 5. Administración de pedidos

Los Operadores podrán consultar el listado completo de pedidos del día.

El listado mostrará, como mínimo:

- Nombre y apellido.
- Empresa.
- Rotisería.
- Pedido.
- Observaciones.

También podrán visualizar automáticamente los pedidos agrupados por rotisería para facilitar el envío de cada listado.

Los Operadores también podrán registrar, modificar y eliminar su propio pedido.

---

## 6. Exportación

Los Operadores podrán:

- Exportar el listado completo en formato Excel (.xlsx).
- Imprimir el listado general.
- Imprimir el listado agrupado por rotisería.

---

# Reglas de negocio

## Usuarios

- Todo usuario deberá iniciar sesión para acceder a la plataforma.
- Cada usuario tendrá un único rol.
- Cada usuario pertenecerá a una única empresa.
- Solo los usuarios activos podrán iniciar sesión.

---

## Administrador

Será un usuario técnico destinado exclusivamente a la administración de la plataforma.

Podrá:

- Crear usuarios.
- Editar usuarios.
- Activar o desactivar usuarios.
- Restablecer contraseñas.
- Asignar roles.
- Crear, editar y eliminar empresas.
- Crear, editar y eliminar rotiserías.

No podrá:

- Publicar menús.
- Ver pedidos.
- Gestionar pedidos.
- Exportar pedidos.
- Imprimir pedidos.
- Realizar pedidos.

---

## Operador

Podrá:

- Publicar menús.
- Editar publicaciones.
- Eliminar publicaciones.
- Consultar las publicaciones del día.
- Visualizar el listado completo de pedidos.
- Visualizar los pedidos agrupados por rotisería.
- Exportar pedidos.
- Imprimir pedidos.
- Realizar, modificar y eliminar su propio pedido.

No podrá:

- Administrar usuarios.
- Administrar empresas.
- Administrar rotiserías.
- Asignar permisos.
- Restablecer contraseñas.

---

## Empleado

Podrá:

- Visualizar las publicaciones del día.
- Seleccionar una rotisería.
- Realizar un pedido.
- Modificar su propio pedido.
- Eliminar su propio pedido.
- Agregar observaciones.

No podrá:

- Administrar usuarios.
- Publicar menús.
- Ver pedidos de otros usuarios.
- Acceder al panel de administración.

---

## Publicaciones

- Cada publicación pertenecerá a una única rotisería.
- Cada publicación corresponderá a una única fecha.
- Cada rotisería podrá tener una única publicación por día.
- Una publicación podrá contener:
  - Ninguna, una o varias imágenes.
  - Un menú escrito.
  - Aclaraciones.
- El contenido se publicará respetando el formato en que fue recibido.

---

## Pedidos

- Solo los usuarios con rol Operador o Empleado podrán registrar pedidos.
- Cada usuario podrá tener un único pedido por día.
- Todo pedido deberá estar asociado a una única rotisería.
- El pedido almacenará exactamente el texto ingresado por el usuario.
- El usuario podrá agregar observaciones.
- El usuario podrá modificar o eliminar su pedido en cualquier momento.

---

## Retención de datos

La plataforma almacenará únicamente la información necesaria para la operación diaria.

Los pedidos, las publicaciones y las imágenes asociadas se eliminarán automáticamente una vez transcurridas **48 horas** desde su creación.

---

## Seguridad

- Todas las operaciones requerirán un usuario autenticado.
- Cada usuario solo podrá acceder a la información permitida por su rol.
- Los permisos estarán determinados por el rol asignado al usuario.