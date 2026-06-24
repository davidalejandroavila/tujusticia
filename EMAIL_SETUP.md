# Guía de Configuración de Correo - Restablecer Entrega para @tujusticia.org

Este documento explica por qué dejaron de llegar los correos a `jessica.gerente@tujusticia.org` tras el cambio de Wix a Coolify y proporciona las instrucciones precisas para solucionarlo.

---

## 🔍 Diagnóstico del Problema

Cuando los correos se envían a `jessica.gerente@tujusticia.org`, los servidores de origen (como Gmail) buscan en el DNS del dominio un registro de tipo **MX (Mail Exchange)**, que indica cuál es el servidor encargado de recibir los correos.

### ¿Qué pasó durante la migración?
1. **Desconexión de Wix:** Anteriormente, los servidores de nombres (Nameservers) del dominio apuntaban a Wix (`ns1.wixdns.net` / `ns2.wixdns.net`), por lo que Wix gestionaba toda la zona DNS, incluyendo el correo.
2. **Cambio de DNS a Hostinger:** Al migrar el hosting a Coolify, se configuró el dominio utilizando los servidores de nombres por defecto de Hostinger (`ns1.dns-parking.com` / `ns2.dns-parking.com`).
3. **Ausencia de Registros MX:** La zona DNS en Hostinger no tiene configurados los registros **MX**.
4. **Error de Entrega (Timeout):** Al no haber registros MX, Gmail intenta enviar el correo a la dirección IP del servidor web principal (el servidor de Coolify: `72.60.214.175`). Como ese servidor no está configurado para recibir correos (puerto 25 cerrado/inactivo), la conexión expira (**Timed Out**) y el correo rebota.

---

## 🛠️ Cómo Solucionarlo (Paso a Paso)

Debes agregar los registros MX correctos en el panel de control de tu registrador de dominio (en este caso, **Hostinger**). 

### Paso 1: Identifica quién es tu proveedor de correo actual
Dependiendo de dónde tengas contratado tu buzón de correo, debes elegir **una** de las siguientes configuraciones:

### Opción A: Si usas Google Workspace / Gmail (Lo más común al migrar desde Wix)
Si compraste tu correo a través de Wix o directamente en Google Workspace, debes añadir los siguientes registros en Hostinger:

| Tipo | Nombre | Servidor de correo (Apunta a) | Prioridad | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **MX** | `@` | `ASPMX.L.GOOGLE.COM.` | 1 | 3600 |
| **MX** | `@` | `ALT1.ASPMX.L.GOOGLE.COM.` | 5 | 3600 |
| **MX** | `@` | `ALT2.ASPMX.L.GOOGLE.COM.` | 5 | 3600 |
| **MX** | `@` | `ASPMX2.GOOGLEMAIL.COM.` | 10 | 3600 |
| **MX** | `@` | `ASPMX3.GOOGLEMAIL.COM.` | 10 | 3600 |

*Nota: En cuentas más recientes de Google Workspace, a veces solo se requiere un único registro MX apuntando a `SMTP.GOOGLE.COM` con prioridad `1`.*

### Opción B: Si usas el Correo de Hostinger (Titan Email)
Si tienes el correo contratado directamente en Hostinger a través del servicio de Titan, agrega estos registros:

| Tipo | Nombre | Servidor de correo (Apunta a) | Prioridad | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **MX** | `@` | `mx1.titan.email` | 10 | 3600 |
| **MX** | `@` | `mx2.titan.email` | 20 | 3600 |

### Opción C: Si usas el Correo Estándar/Gratuito de Hostinger (hPanel)
Si usas el correo estándar que viene incluido con tu hosting de Hostinger:

| Tipo | Nombre | Servidor de correo (Apunta a) | Prioridad | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **MX** | `@` | `mx1.hostinger.com` | 10 | 3600 |
| **MX** | `@` | `mx2.hostinger.com` | 20 | 3600 |

---

### Paso 2: Configurar los registros en el panel de Hostinger

1. **Inicia sesión** en tu cuenta de Hostinger (hPanel).
2. Ve a la sección **Dominios** (en el menú superior o lateral) y selecciona **`tujusticia.org`**.
3. En el menú de la izquierda, haz clic en **DNS / Servidores de nombres** (Editor de Zona DNS).
4. **MUY IMPORTANTE:** Si ves algún registro de tipo **MX** ya existente, elimínalo haciendo clic en "Borrar" para evitar conflictos.
5. En la sección **Administrar registros DNS** (Crear nuevo registro):
   * Selecciona el **Tipo:** `MX`
   * En **Nombre / Host:** Escribe `@` (o déjalo en blanco si no te lo permite).
   * En **Apunta a / Servidor de correo:** Pega la dirección correspondiente de la tabla (ej. `ASPMX.L.GOOGLE.COM.` para Google).
   * En **Prioridad:** Escribe el número correspondiente (ej. `1`, `5` o `10`).
   * En **TTL:** Puedes dejar el valor por defecto (ej. `14400` o `3600`).
6. Haz clic en **Añadir registro**.
7. Repite el proceso para cada uno de los registros del proveedor que te corresponda.

---

## ⏳ Tiempo de Propagación y Verificación

* **Propagación:** Los cambios en los registros DNS no son instantáneos. Pueden tardar entre **10 minutos y 24 horas** en propagarse por todo el internet, aunque con Hostinger suele tardar menos de 1 hora.
* **Verificación:** Puedes revisar si los registros ya se actualizaron usando herramientas gratuitas como [MXToolbox](https://mxtoolbox.com/) o [DNS Checker](https://dnschecker.org/) buscando el dominio `tujusticia.org` con el tipo `MX`.
