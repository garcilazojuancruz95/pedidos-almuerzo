# 03 - Reglas de Negocio

## Objetivo

Este documento define las reglas que deberán cumplirse durante el funcionamiento de la plataforma.

Estas reglas representan el comportamiento esperado del sistema y deberán respetarse independientemente de la tecnología utilizada.

---

# Usuarios

- Todo usuario deberá iniciar sesión para acceder a la plataforma.
- Un usuario podrá tener un único rol.
- Un usuario podrá estar asociado a una única empresa.
- Solo los usuarios activos podrán iniciar sesión.

---

# Administradores

Los administradores podrán:

- Crear usuarios.
- Modificar usuarios.
- Deshabilitar usuarios.
- Publicar menús.
- Editar menús.
- Eliminar menús.
- Visualizar todos los pedidos.
- Modificar cualquier pedido.
- Eliminar cualquier pedido.
- Exportar pedidos.
- Imprimir pedidos.

---

# Empleados

Los empleados podrán:

- Visualizar los menús publicados.
- Crear un pedido.
- Modificar su propio pedido.
- Consultar su pedido.
- Agregar observaciones.

Los empleados no podrán:

- Crear usuarios.
- Editar usuarios.
- Eliminar usuarios.
- Ver pedidos de otros empleados.
- Modificar pedidos ajenos.
- Acceder al panel de administración.

---

# Menús

- Los menús serán publicados por un administrador.
- Los menús podrán contener imágenes, texto o ambos.
- Un mismo día podrán existir varios menús.
- Cada menú pertenecerá a una única rotisería.

---

# Pedidos

- Cada empleado podrá tener un único pedido por día.
- El pedido almacenará exactamente el texto ingresado por el empleado.
- El sistema permitirá solicitar comidas que no figuren en el menú.
- El empleado podrá agregar observaciones.
- El empleado podrá modificar su pedido únicamente mientras el período de pedidos permanezca abierto.

---

# Exportación

El administrador podrá:

- Exportar el listado de pedidos en formato Excel (.xlsx).
- Imprimir el listado.

---

# Historial

La plataforma conservará el historial de:

- Menús publicados.
- Pedidos realizados.

---

# Seguridad

- Los usuarios solo podrán acceder a la información correspondiente a sus permisos.
- Todas las operaciones deberán realizarse con un usuario autenticado.