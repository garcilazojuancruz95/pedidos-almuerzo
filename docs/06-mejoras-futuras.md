# 06 - Mejoras Futuras

Este documento reúne funcionalidades que no formarán parte de la primera versión (MVP), pero que podrán implementarse en futuras actualizaciones de la plataforma.

---

# 1. Notificaciones de nuevos menús

## Objetivo

Notificar a todos los empleados cuando los menús del día hayan sido publicados por un Operador.

## Funcionamiento esperado

1. Un Operador publica los menús del día.
2. La plataforma guarda la información.
3. El sistema envía una notificación a todos los empleados.
4. El empleado puede ingresar directamente a la plataforma para realizar su pedido.

---

## Posibles medios de notificación

### Opción 1 - Notificaciones Push (Recomendada)

La plataforma podrá convertirse en una Progressive Web App (PWA).

Esto permitirá que los empleados reciban notificaciones tanto en computadoras como en teléfonos celulares, sin necesidad de instalar una aplicación desde una tienda.

Ejemplo:

```
🍽️ Ya están disponibles los menús de hoy.

Ingresá a la plataforma para realizar tu pedido.
```

### Ventajas

- No requiere desarrollar una aplicación móvil.
- Funciona en Android, Windows y otros sistemas compatibles.
- Los usuarios pueden agregar la plataforma a la pantalla principal de su dispositivo.
- La experiencia es similar a una aplicación nativa.

---

### Opción 2 - Correo electrónico

Enviar un correo electrónico cuando se publiquen los menús.

Ejemplo:

Asunto:
```
Menú disponible
```

Contenido:

```
Hola Juan.

Ya podés ingresar a la plataforma para realizar tu pedido de almuerzo.
```

---

### Opción 3 - WhatsApp

Enviar un mensaje mediante WhatsApp Business API.

Actualmente esta opción no se considera prioritaria debido a que requiere una integración adicional y puede generar costos.

---

# 2. Notificación cuando el pedido esté listo

## Objetivo

Permitir que un Operador informe a los empleados que los pedidos ya fueron entregados por la rotisería y están disponibles para retirar.

Ejemplo de notificación:

```
🍽️ Tu pedido ya está disponible para retirar.
```

Esta funcionalidad dependerá del sistema de notificaciones implementado.

---

# 3. Conversión en PWA

## Objetivo

Permitir que la plataforma pueda instalarse como una aplicación.

Beneficios:

- Acceso directo desde el escritorio o pantalla principal.
- Apertura en ventana propia.
- Mejor experiencia en dispositivos móviles.
- Posibilidad de utilizar notificaciones Push.

---

# Observaciones

Estas funcionalidades no forman parte del alcance inicial del proyecto (MVP).

Se evaluarán una vez que la plataforma cuente con:

- Inicio de sesión.
- Gestión de usuarios.
- Publicación de menús.
- Registro de pedidos.
- Exportación del listado de pedidos.