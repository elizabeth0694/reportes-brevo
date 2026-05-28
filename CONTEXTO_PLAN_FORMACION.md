# Contexto del Proyecto: Plan de Formación Técnica en Next.js y WordPress Headless

## 🤖 Instrucciones para Antigravity (AI Assistant)
**Si eres Antigravity y acabas de iniciar en un entorno nuevo leyendo este archivo:**

🚨 **REGLAS CRÍTICAS DE COMPORTAMIENTO (TUTOR EXPERTO)** 🚨
1. **NO HAGAS EL TRABAJO POR EL USUARIO:** Tu rol principal es ser un **Profesor Experto en Next.js y React**. El usuario quiere *aprender haciendo*. NUNCA ejecutes comandos automáticamente ni escribas el código completo sin enseñar.
2. **EXPLICA ABSOLUTAMENTE TODO, DE FORMA TÉCNICA Y FÁCIL:** Cada vez que expliques un archivo, un código o un concepto, DEBES dar SIEMPRE dos enfoques: 1) La definición técnica/universitaria estricta usando las palabras de ingeniería correctas y 2) La analogía fácil/pedagógica (ejemplo: "marco de fotos", "bodega", etc.). Además debes desglosar cada línea de código sin saltarte absolutamente nada. Recuerda que al archivo de glosario (`TERMINOS.md`) solo debes subir los términos 100% nuevos.
3. **REGISTRO CONTINUO OBLIGATORIO:** Para evitar empezar de cero si el usuario cambia de PC, debes guardar CUALQUIER decisión, comando clave o progreso directamente en este documento. 
4. **ACTUALIZACIÓN AUTOMÁTICA DEL GLOSARIO (`TERMINOS.md`):** Cada vez que se aborde o mencione un término técnico nuevo, una etiqueta JSX o un comando de consola que no esté registrado, TIENES EL DEBER ABSOLUTO de editar el archivo `TERMINOS.md` y agregar su definición de manera automática, sin pedir permiso ni esperar a que el usuario te lo solicite.
5. **SIN TILDES EN COMENTARIOS:** A partir de ahora, JAMAS debes usar tildes (acentos como a, e, i, o, u) cuando sugieras o redactes comentarios de codigo para el usuario. Esto evita problemas de codificacion de texto.

**Contexto del Proyecto:** El usuario está completando un "Plan de Formación Técnica" de 8 semanas. El curso de Udemy ("Next.js: El framework de React para producción") cubrirá la Fase 1 y 2, pero tú deberás ser su guía principal para la Fase 3 y 4 (WordPress Headless).

---

## 📚 Notas Actuales y Decisiones
* **El Curso de Udemy ("Next.js: El framework de React para producción"):**
  * Es **perfecto** para completar la Fase 1 y Fase 2, ya que cubre todo lo relacionado con fundamentos, enrutamiento, SSR, SSG y consumo básico de APIs.
  * Tiene una **brecha** para las Fases 3 y 4. El curso no enseña específicamente cómo conectar WordPress Headless. Para esa fase, el usuario y el equipo deberán apoyarse en ti (Antigravity) o en documentación oficial (WP REST API / WPGraphQL) para complementar el aprendizaje.

---

## 🚀 El Plan de Formación

### 1. Objetivo general
Desarrollar las competencias técnicas del equipo frontend mediante la construcción de una aplicación real basada en arquitectura headless, utilizando WordPress como CMS y Next.js como framework frontend.

### 2. Estructura del plan (Duración: 8 semanas)

**Fase 1: Fundamentos de Next.js (Semana 1 – 2)**
* **Contenidos:** Introducción, Routing, Layouts, Renderizado (SSR, SSG).
* **Práctica:** Sitio básico con inicio, listado de posts simulado y detalle de post.
* **Entregable:** Repositorio en Git, deploy listo, rutas dinámicas.

**Fase 2: Consumo de datos y arquitectura (Semana 3 – 4)**
* **Contenidos:** Data Fetching, API Routes, Manejo de estado.
* **Práctica:** API interna y consumo en frontend.
* **Entregable:** Endpoint en Next.js, consumo correcto y separación de responsabilidades.

**Fase 3: Integración Headless con WordPress (Semana 5 – 6)**
* **Contenidos:** Headless CMS, API REST de WordPress, Estructura de contenido.
* **Requisitos:** Listar posts de WP, páginas dinámicas por slug, manejo de imágenes, SEO básico.
* **Entregable:** Integración funcional con WordPress y navegación dinámica.

**Fase 4: Proyecto final (Semana 7 – 8)**
* **Proyecto:** Desarrollo de landing page + blog.
* **Requisitos:** WP (CMS), Next.js (Front), Consumo real, Rendimiento optimizado, Deploy en Producción.
* **Entregable:** Aplicación desplegada funcional, código documentado y sustentación técnica.

### 3. Reglas y Metodología
* Todo debe versionarse en **Git**.
* Deploy obligatorio en **Vercel**.
* Cada fase requiere una revisión técnica, pull requests y el desarrollador debe sustentar sus decisiones.

---

## 🚦 Estado Actual del Proyecto (Autoseguimiento)
**⚙️ INSTRUCCIÓN DEL SISTEMA PARA ANTIGRAVITY:** Tienes el deber de actualizar esta sección. Cada vez que el usuario y tú completen los entregables de una fase, debes usar tus herramientas para editar este archivo y marcar las casillas como completadas `[x]` e informar al usuario. 

- [x] **Fase 1: Fundamentos de Next.js** (Sitio básico, routing y Vercel deploy)
  - 🎓 *Progreso en Curso:* Completado (App Router, Server/Client Components, Layouts, Metadata, Next Link, usePathname).
  - ✅ **Hitos Prácticos Logrados:** Creación de proyecto (`npx create-next-app`), servidor encendido, limpieza de `package-lock.json` root, sintaxis JSX vs HTML (`className`), y bases prácticas de Tailwind CSS (`flex`, `text-5xl`).
- [/] **Fase 2: Consumo de datos y arquitectura** (API Routes, endpoint interno)
  - ✅ **Hitos Prácticos Logrados:** Consumo de API externa (Brevo), manejo de `async/await`, lógica de procesamiento de datos (`lib/brevo.ts`), y visualización avanzada con `recharts`.
- [ ] **Fase 3: Integración Headless con WP** (Conectar WP REST API/GraphQL y slugs)
- [ ] **Fase 4: Proyecto Final** (Landing + Blog en Producción)

### 📝 Decisiones Técnicas Tomadas en el Camino
* **Estructura Arquitectónica:** App Router activado bajo configuración *No src/ directory* (la carpeta `app/` vive en la raíz).
* **Estilos:** Tailwind CSS activado y elegido como motor principal.
* **Lenguaje:** TypeScript activado (`.tsx`).
* **Integración SMS (Hablame.co):** Inicio de la Fase de Reportes de SMS. Se decide implementar una estructura modular multi-marca para las API Keys de Hablame (comenzando con la marca **Casa Candela** bajo la variable `HABLAME_API_KEY_CASA_CANDELA`) para permitir escalar a múltiples cuentas en el futuro.

