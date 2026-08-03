# 02 - Base de Datos

## Objetivo

La base de datos será la encargada de almacenar toda la información necesaria para el funcionamiento de la plataforma.

Su diseño deberá ser escalable, permitiendo incorporar nuevas funcionalidades sin modificar la estructura principal del sistema.

La autenticación de los usuarios será administrada mediante Supabase Auth, mientras que la información propia de la aplicación se almacenará en tablas PostgreSQL.

---

# Entidades principales

La plataforma estará compuesta por las siguientes entidades:

- Roles
- Empresas
- Usuarios
- Rotiserías
- Publicaciones
- Publicación Imágenes
- Pedidos

---

# Roles

Define el tipo de acceso de cada usuario dentro del sistema.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador único |
| nombre | VARCHAR | Nombre del rol |
| descripcion | TEXT | Descripción del rol |

### Valores iniciales

- Administrador
- Operador
- Empleado

---

# Empresas

Representa la empresa a la que pertenece un usuario.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador único |
| nombre | VARCHAR | Nombre de la empresa |

### Valores iniciales

- Nasini
- Mutual
- Market Hub

---

# Usuarios

Almacena la información de los usuarios que podrán acceder a la plataforma.

La autenticación será administrada mediante Supabase Auth.

Los usuarios podrán encontrarse en dos estados:

- Activo.
- Inactivo.

Solo los usuarios activos podrán iniciar sesión en la plataforma.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador interno |
| auth_user_id | UUID | Identificador del usuario en Supabase Auth |
| nombre | VARCHAR | Nombre |
| apellido | VARCHAR | Apellido |
| email | VARCHAR | Correo electrónico |
| empresa_id | UUID | Empresa a la que pertenece |
| rol_id | UUID | Rol del usuario |
| activo | BOOLEAN | Indica si el usuario puede iniciar sesión |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_modificacion | TIMESTAMP | Última modificación |

---

# Rotiserías

Contiene las rotiserías que envían diariamente los menús.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador único |
| nombre | VARCHAR | Nombre de la rotisería |

---

# Publicaciones

Representa la publicación diaria realizada por una rotisería.

Cada publicación podrá contener:

- Ninguna, una o varias imágenes.
- Un menú escrito (opcional).
- Aclaraciones u observaciones (opcional).

Cada rotisería podrá tener una única publicación por día.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador de la publicación |
| rotiseria_id | UUID | Rotisería que envía el menú |
| fecha | DATE | Fecha correspondiente a la publicación |
| menu_texto | TEXT | Menú recibido por texto (opcional) |
| aclaraciones | TEXT | Observaciones generales (opcional) |
| publicado_por | UUID | Usuario Operador que realizó la publicación |
| fecha_publicacion | TIMESTAMP | Fecha y hora de publicación |
| fecha_modificacion | TIMESTAMP | Última modificación |

---

# Publicación Imágenes

Almacena las imágenes asociadas a una publicación.

Cada publicación podrá contener ninguna, una o varias imágenes.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador único |
| publicacion_id | UUID | Publicación a la que pertenece |
| url | TEXT | Ruta de la imagen almacenada |
| orden | INTEGER | Orden de visualización |

---

# Pedidos

Almacena los pedidos realizados por los usuarios.

Los pedidos solo podrán ser realizados por usuarios con rol **Operador** o **Empleado**.

Cada usuario podrá tener un único pedido por día.

Cada pedido estará asociado a una única rotisería.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador del pedido |
| usuario_id | UUID | Usuario que realizó el pedido |
| rotiseria_id | UUID | Rotisería seleccionada por el usuario |
| pedido | TEXT | Plato solicitado |
| observaciones | TEXT | Observaciones del usuario |
| fecha | DATE | Fecha correspondiente al pedido |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_modificacion | TIMESTAMP | Última modificación |

---

# Relaciones

- Un usuario pertenece a una empresa.
- Un usuario posee un único rol.
- Una rotisería puede tener muchas publicaciones.
- Una publicación pertenece a una única rotisería.
- Una publicación puede contener varias imágenes.
- Cada imagen pertenece a una única publicación.
- Un usuario puede realizar muchos pedidos.
- Cada pedido pertenece a un único usuario.
- Cada pedido pertenece a una única rotisería.
- Una rotisería puede tener muchos pedidos.

---

# Reglas de la base de datos

- Un usuario solo podrá tener un pedido por día.
- Solo los usuarios activos podrán iniciar sesión.
- Solo los usuarios con rol **Operador** o **Empleado** podrán registrar pedidos.
- Todo pedido deberá estar asociado a una única rotisería.
- Una publicación corresponderá a una única rotisería y una única fecha.
- Cada rotisería podrá tener una única publicación por día.
- Una publicación podrá contener imágenes, texto o ambos.
- El pedido almacenará exactamente el texto ingresado por el usuario.

---

# Política de retención

La plataforma almacenará únicamente la información necesaria para la operación diaria.

Los pedidos, las publicaciones y las imágenes asociadas se eliminarán automáticamente una vez transcurridas **48 horas** desde su creación.

---

# Consideraciones técnicas

- La autenticación será administrada mediante Supabase Auth.
- Las imágenes serán almacenadas en Supabase Storage.
- Las relaciones entre tablas se implementarán mediante claves foráneas (Foreign Keys).
- Todas las tablas utilizarán identificadores UUID.
- Se crearán índices sobre los campos más consultados para optimizar el rendimiento.

---

# Diagrama conceptual

```text
ROLES
   │
   ▼
USUARIOS ─────────────► EMPRESAS
   │
   ▼
PEDIDOS ◄──────────── ROTISERIAS
                           │
                           ▼
                    PUBLICACIONES
                           │
                           ▼
                 PUBLICACION_IMAGENES
```