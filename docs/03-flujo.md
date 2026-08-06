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

Al finalizar la publicación de los menús del día, la plataforma enviará una notificación por correo electrónico a todos los usuarios activos, informando que ya pueden realizar sus pedidos.

---

## 3. Visualización

Los usuarios con rol Operador y Empleado iniciarán sesión.

La plataforma mostrará todas las publicaciones correspondientes al día.

Sobre cada publicación se mostrará un campo de texto para registrar el pedido correspondiente a esa rotisería.

Los usuarios podrán registrar uno o más pedidos, incluso en distintas rotiserías.

Cada publicación mostrará:

- Nombre de la rotisería.
- Imágenes.
- Menú escrito.
- Aclaraciones.

---

## 4. Realización del pedido

Los usuarios con rol Operador y Empleado podrán registrar uno o más pedidos durante el día.

Cada publicación dispondrá de un campo de texto donde el usuario ingresará libremente el pedido.

No será obligatorio solicitar un plato publicado.

El sistema permitirá escribir libremente cualquier pedido.

Mientras no se alcance la hora límite configurada, los Empleados podrán crear, modificar y eliminar sus propios pedidos.

Una vez alcanzada la hora límite, los campos de ingreso quedarán deshabilitados para los Empleados.

Los Operadores podrán seguir administrando los pedidos en cualquier momento.

---

## 5. Administración de pedidos

Los Operadores podrán consultar el listado completo de pedidos del día.

Los Operadores podrán registrar pedidos en nombre de cualquier usuario.

También podrán modificar o eliminar cualquier pedido.

Los Operadores podrán registrar pedidos adicionales cuando sea necesario.

El listado mostrará, como mínimo:

- Nombre y apellido.
- Empresa.
- Rotisería.
- Pedido.
- Observaciones.

También podrán visualizar automáticamente los pedidos agrupados por rotisería para facilitar el envío de cada listado.

Los Operadores también podrán registrar, modificar y eliminar su propio pedido.

El Operador podrá seguir modificando el listado de pedidos incluso después de la hora límite, para contemplar correcciones, pedidos olvidados o pedidos adicionales.

---

## 6. Exportación

Los Operadores podrán:

- Exportar el listado completo en formato Excel (.xlsx).
- Imprimir el listado general.
- Imprimir el listado agrupado por rotisería.

---

## 7. Ausencias

Los usuarios con rol Empleado podrán indicar que no asistirán a la oficina durante el día.

Cuando un usuario informe su ausencia:

- No podrá registrar pedidos.
- Los campos de ingreso quedarán deshabilitados.
- El Operador visualizará el listado de usuarios ausentes.

---

# Reglas de negocio

## Usuarios

- Todo usuario deberá iniciar sesión utilizando su cuenta corporativa de Google Workspace.
- Cada usuario tendrá un único rol.
- Cada usuario pertenecerá a una única empresa.
- Solo los usuarios activos podrán iniciar sesión.
- La nómina de usuarios será sincronizada desde Google Workspace.

---

## Administrador

Será un usuario técnico destinado exclusivamente a la administración de la plataforma.

Podrá:

- Administrar empresas.
- Administrar roles.

No puede

- Usuarios.
- Rotiserías.
- Pedidos.
- Publicaciones.

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
- Administrar usuarios.
- Administrar rotiserías.
- Registrar pedidos para cualquier usuario.
- Registrar pedidos adicionales.
- Configurar la hora límite para pedidos.

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
- Realizar un pedido.
- Modificar su propio pedido.
- Eliminar su propio pedido.
- Agregar observaciones.
- Registrar uno o más pedidos.
- Informar que no asistirá a la oficina.

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

- Solo Operadores y Empleados podrán registrar pedidos.
- Un usuario podrá registrar múltiples pedidos durante el mismo día.
- Cada pedido pertenecerá a una única rotisería.
- El pedido almacenará exactamente el texto ingresado.
- El Operador podrá crear, modificar y eliminar cualquier pedido.
- Los Empleados solo podrán administrar sus propios pedidos hasta la hora límite configurada.

---

## Retención de datos

La plataforma almacenará únicamente la información necesaria para la operación diaria.

Los pedidos, las publicaciones y las imágenes asociadas se eliminarán automáticamente una vez transcurridas **48 horas** desde su creación.

---

## Seguridad

- Todas las operaciones requerirán un usuario autenticado.
- Cada usuario solo podrá acceder a la información permitida por su rol.
- Los permisos estarán determinados por el rol asignado al usuario.

---

## Notificaciones

- Al publicarse los menús del día se enviará un correo electrónico a todos los usuarios activos.
- La notificación indicará que los pedidos ya pueden realizarse desde la plataforma.

---

## Ausencias

- Un usuario podrá informar una única ausencia por día.
- Los usuarios ausentes no podrán registrar pedidos.
- Los Operadores podrán visualizar el listado de ausencias del día.