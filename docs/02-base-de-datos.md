# 02 - Base de Datos

## Objetivo

La base de datos será la encargada de almacenar toda la información necesaria para el funcionamiento de la plataforma.

Su diseño deberá ser escalable, permitiendo incorporar nuevas funcionalidades sin modificar la estructura principal del sistema.

---

# Entidades principales

La plataforma estará compuesta por las siguientes entidades:

- Roles
- Empresas
- Usuarios
- Rotiserías
- Menús
- Pedidos

---

# Roles

Define el tipo de acceso de cada usuario dentro del sistema.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador único |
| nombre | VARCHAR | Nombre del rol |

### Valores iniciales

- Administrador
- Empleado

---

# Empresas

Representa la empresa o sector al que pertenece un empleado.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador único |
| nombre | VARCHAR | Nombre de la empresa |

### Valores iniciales

- Nasini - Piso 1
- Nasini - Piso 2
- Market Hub - Piso 4

---

# Usuarios

Almacena la información de los usuarios que podrán acceder a la plataforma.

La autenticación será gestionada mediante Supabase Auth.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador del usuario |
| nombre | VARCHAR | Nombre |
| apellido | VARCHAR | Apellido |
| email | VARCHAR | Correo electrónico |
| empresa_id | UUID | Empresa a la que pertenece |
| rol_id | UUID | Rol del usuario |
| activo | BOOLEAN | Indica si el usuario puede iniciar sesión |
| fecha_creacion | TIMESTAMP | Fecha de creación |

---

# Rotiserías

Contiene la información de las rotiserías que proveen los menús diarios.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador único |
| nombre | VARCHAR | Nombre de la rotisería |
| telefono | VARCHAR | Teléfono de contacto (opcional) |
| activo | BOOLEAN | Indica si la rotisería continúa trabajando con la empresa |
| observaciones | TEXT | Información adicional (opcional) |

---

# Menús

Representa los menús publicados diariamente.

Cada menú pertenece a una rotisería y a una fecha determinada.

Los menús podrán publicarse mediante imágenes, texto o ambos.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador del menú |
| rotiseria_id | UUID | Rotisería que envía el menú |
| imagen_url | TEXT | Ruta de la imagen almacenada |
| texto_menu | TEXT | Texto del menú (opcional) |
| fecha | DATE | Fecha del menú |
| publicado_por | UUID | Usuario administrador que publicó el menú |
| fecha_creacion | TIMESTAMP | Fecha de publicación |

---

# Pedidos

Almacena los pedidos realizados por los empleados.

Cada pedido pertenece a un usuario y corresponde a una única fecha.

## Campos

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | UUID | Identificador del pedido |
| usuario_id | UUID | Usuario que realizó el pedido |
| pedido | TEXT | Plato solicitado |
| observaciones | TEXT | Observaciones del empleado |
| fecha | DATE | Fecha del pedido |
| fecha_creacion | TIMESTAMP | Fecha de creación |
| fecha_modificacion | TIMESTAMP | Última modificación |

---

# Relaciones

- Un usuario pertenece a una empresa.
- Un usuario posee un único rol.
- Una rotisería puede publicar muchos menús.
- Un menú pertenece a una única rotisería.
- Un usuario puede realizar muchos pedidos a lo largo del tiempo.
- Cada pedido pertenece a un único usuario.

---

# Reglas de la base de datos

La base de datos deberá cumplir las siguientes reglas:

- Un usuario solo podrá tener un pedido por día.
- Solo los usuarios activos podrán iniciar sesión.
- Un menú corresponderá a una única fecha.
- Una rotisería podrá publicar un menú por día.
- El pedido almacenará exactamente el texto ingresado por el empleado.
- El sistema conservará el historial de pedidos y menús.

---

# Consideraciones técnicas

- La autenticación será administrada mediante Supabase Auth.
- Las imágenes de los menús serán almacenadas en Supabase Storage.
- Las relaciones entre tablas se implementarán mediante claves foráneas (Foreign Keys).
- Todas las tablas utilizarán identificadores UUID.
- Se crearán índices sobre los campos más consultados para optimizar el rendimiento.

---

# Diagrama conceptual

Roles
│
├──────── Usuarios ─────── Empresas
│
└──────── Pedidos

Rotiserías
│
└──────── Menús