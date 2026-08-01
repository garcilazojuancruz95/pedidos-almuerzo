# 01 - Objetivo del Proyecto

## Nombre del proyecto

**Plataforma Web de Gestión de Pedidos de Almuerzo**

---

# Objetivo

Desarrollar una plataforma web responsive que permita gestionar de forma simple y organizada los pedidos diarios de almuerzo de los empleados de la empresa.

La plataforma deberá funcionar correctamente tanto en computadoras como en dispositivos móviles, permitiendo que los empleados realicen sus pedidos de manera rápida y que el personal de Front Desk pueda administrar los menús diarios y obtener el listado final de pedidos.

---

# Alcance del proyecto

La plataforma permitirá:

- Publicar diariamente los menús enviados por las rotiserías.
- Permitir que cada empleado realice un único pedido por día.
- Centralizar todos los pedidos en un único lugar.
- Evitar pedidos por WhatsApp o mensajes individuales.
- Exportar el listado final de pedidos para realizar el encargo a cada rotisería.

---

# Usuarios del sistema

El sistema contará con dos tipos de usuarios.

## Administrador

Inicialmente el rol de administrador será utilizado por **Gabriela Abello (Front Desk)**.

El administrador tendrá acceso a todas las funciones del sistema.

Podrá:

- Iniciar sesión.
- Crear, modificar y deshabilitar usuarios.
- Publicar los menús diarios.
- Cargar imágenes de los menús enviados por las rotiserías.
- Cargar texto cuando alguna rotisería envíe el menú por WhatsApp.
- Editar o eliminar menús publicados.
- Visualizar todos los pedidos realizados.
- Modificar o eliminar pedidos si fuera necesario.
- Exportar el listado de pedidos en formato Excel (.xlsx).
- Imprimir el listado de pedidos.

---

## Empleados

La plataforma será utilizada por empleados pertenecientes a:

- Nasini - Piso 1
- Nasini - Piso 2
- Market Hub - Piso 4

Cada empleado deberá iniciar sesión con su usuario y contraseña.

Podrá:

- Ver los menús publicados para el día.
- Escribir el nombre del plato que desea solicitar.
- Solicitar comidas que no aparezcan en los menús publicados.
- Agregar observaciones sobre su pedido.
- Modificar su pedido mientras el período de pedidos permanezca abierto.
- Consultar el pedido realizado durante el día.

---

# Flujo general del sistema

## 1. Recepción de los menús

Las rotiserías envían diariamente sus menús mediante WhatsApp.

Los menús pueden recibirse en distintos formatos:

- Imagen.
- Texto.
- Imagen y texto.

Los menús serán publicados en la plataforma en el mismo formato en que fueron recibidos, sin necesidad de convertir las imágenes a texto.

Los empleados visualizarán el menú publicado y escribirán manualmente el nombre del plato que desean solicitar.

El sistema también permitirá que los empleados soliciten comidas que no figuren en el menú publicado.

---

## 2. Publicación

El administrador inicia sesión en la plataforma.

Carga los menús recibidos y los publica para que estén disponibles para todos los empleados.

---

## 3. Realización del pedido

Cada empleado inicia sesión.

Visualiza los menús publicados.

Escribe el plato que desea solicitar.

Opcionalmente puede agregar observaciones.

Mientras el período de pedidos permanezca abierto, podrá modificar su pedido.

---

## 4. Administración de pedidos

El administrador podrá visualizar un listado con todos los pedidos realizados.

El listado mostrará, como mínimo:

- Nombre y apellido del empleado.
- Empresa o sector al que pertenece.
- Pedido realizado.
- Observaciones.

---

## 5. Exportación

Una vez finalizado el período de pedidos, el administrador podrá:

- Exportar el listado en formato Excel (.xlsx).
- Imprimir el listado para realizar el pedido a las rotiserías.

---

# Requisitos generales

La plataforma deberá cumplir con los siguientes requisitos:

- Ser completamente responsive.
- Funcionar correctamente desde computadoras y teléfonos celulares.
- Requerir inicio de sesión para acceder.
- Diferenciar permisos entre administradores y empleados.
- Permitir un único pedido activo por usuario y por día.
- Mantener una interfaz simple, rápida e intuitiva.
- Centralizar toda la información en una base de datos.

---

# Reglas de negocio

La plataforma deberá cumplir las siguientes reglas:

- Cada empleado podrá tener un único pedido activo por día.
- Todos los usuarios deberán iniciar sesión para utilizar la plataforma.
- Los administradores tendrán acceso a todas las funciones del sistema.
- Los empleados únicamente podrán visualizar los menús y gestionar su propio pedido.
- Los menús serán publicados en el formato en que fueron recibidos (imagen y/o texto).
- El sistema permitirá al empleado ingresar libremente el nombre del plato que desea solicitar.
- El sistema permitirá solicitar comidas que no figuren en los menús publicados.
- Los empleados podrán modificar su pedido únicamente mientras el período de pedidos permanezca abierto.
- El administrador podrá exportar el listado de pedidos en formato Excel (.xlsx).

---

# Objetivo de la primera versión (MVP)

La primera versión del sistema deberá permitir:

- Inicio de sesión.
- Administración de usuarios.
- Publicación de menús diarios.
- Visualización de los menús por parte de los empleados.
- Registro y modificación de pedidos.
- Visualización del listado de pedidos.
- Exportación del listado a Excel.