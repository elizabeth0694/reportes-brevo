# Bitacora de Aprendizaje - Dashboard Brevo

Este documento resume todos los conocimientos, comandos y trucos aprendidos durante esta sesion de desarrollo.

## 1. Logica del Dashboard
- **Filtros de Fecha:** Aprendimos a usar `useState` para capturar fechas y filtrar un arreglo de datos (`datosFiltrados`).
- **Validacion:** Implementamos una regla de oro: la fecha "Desde" no puede ser posterior a la fecha "Hasta".
- **Alertas UX:** Creamos un mensaje de error que desaparece solo a los 20 segundos para no molestar al usuario.

## 2. El Arte de Tailwind CSS
- **Concepto:** Tailwind funciona como "bloques de Lego" (`className`). No necesitas archivos CSS externos.
- **Bordes y Marcos:**
    - `border`: Activa la linea.
    - `border-gray-500`: Cambia el color.
    - `rounded-xl`: Redondea las esquinas.
    - `overflow-hidden`: Obliga al contenido a respetar las curvas del marco.

## 3. Flujo de Trabajo Profesional (Git y Vercel)
Aprendimos el "Ritual de los 3 Pasos" para subir cambios a internet:
1. `git add .` - Metes los cambios en la caja.
2. `git commit -m "mensaje"` - Cierras la caja y le pones etiqueta.
3. `git push` - Envias la caja a GitHub.

**Sincronizacion Automatica:** Al subir a GitHub, Vercel detecta el cambio y actualiza tu pagina web en vivo sin que tengas que hacer nada extra.

## 4. Estilo de Tablas
- Para marcos generales, es mejor envolver la tabla en un `div` con bordes.
- Usamos `border-collapse` para que las lineas internas de la tabla se vean limpias.

---

## Sesión 2: Módulo de Reportes SMS y Modularidad

Hoy logramos expandir la arquitectura del dashboard al integrar un servicio completamente nuevo: **Reportes SMS** (conectado en el futuro a la API v5 de **Hablame.co**).

### 1. Arquitectura de Datos y Modularidad
*   **Separación de Responsabilidades:** Aprendimos que para mantener el código limpio y mantenible, es una pésima práctica amontonar servicios diferentes en el mismo archivo. Creamos un archivo de datos independiente (`app/lib/hablame.ts`) y un componente de interfaz separado (`app/sms/DashboardSmsClient.tsx`).
*   **El Ensamblador Central (page.tsx):** La página principal actúa como un director de orquesta asíncrono, solicitando los datos en paralelo de Brevo y de Hablame, y entregándolos a sus respectivas interfaces.

### 2. Mapeo y Analítica de SMS
*   Aprendimos a traducir los términos nativos de la plataforma de mensajería a estándares de analítica digital profesional:
    *   *Sms solicitados* ➡️ **Total Enviados**
    *   *Sms enviados* ➡️ **Total Entregados**
    *   *Visitas de URL Shorter* ➡️ **Clics en Link** (que representa la interacción real del usuario con el enlace `hab.me`).

### 3. Seguridad Multi-marca
*   **Segregación de API Keys:** En lugar de diseñar una variable genérica, decidimos usar el sufijo de marca (`HABLAME_API_KEY_CASA_CANDELA`) para permitir que el sistema escale limpiamente cuando agreguemos más marcas en el futuro.

---
**Firmado:** Tu asistente de programacion (Antigravity). ¡Un salto de arquitectura espectacular hoy!

