# Guía 1: Instalación y Configuración Inicial de Next.js

Esta guía paso a paso describe cómo iniciar un proyecto de Next.js desde cero, basándose en la configuración moderna del App Router, tal cual lo vimos en nuestra práctica.

## Paso 1: Instalación de Entorno (Prerequisitos)
Antes de ejecutar cualquier código, debes tener estas tres herramientas fundamentales instaladas en tu computadora (ideal si te cambias de PC):

### A. Node.js (El Motor)
Es el programa que permite instalar y ejecutar librerías como Next.js.
1. Ve a [nodejs.org](https://nodejs.org/).
2. Descarga el botón que dice **LTS** (Long Term Support), que es la versión más estable recomendada para la mayoría.
3. Ejecuta el instalador y dale "Siguiente" a todo dejando las opciones predeterminadas. (La clave es que instale el gestor mágico llamado *npm*).

### B. Visual Studio Code (El Editor de Código)
El lugar donde escribiremos y editaremos nuestros archivos.
1. Ve a [code.visualstudio.com](https://code.visualstudio.com/).
2. Descarga la versión según tu Windows/Mac e instálalo con las opciones típicas.

### C. Git (El Control de Versiones)
Una herramienta invisible que guarda de forma segura el historial de nuestro código.
1. Ve a [git-scm.com/downloads](https://git-scm.com/downloads).
2. Descárgalo para Windows. El instalador tiene como 15 pantallas diferentes; no te asustes, simplemente dale a **"Siguiente/Next"** a todas dejando las configuraciones de origen.

### 🖥️ Preparando tu Área de Trabajo (Cómo Abrir la Consola)
Antes de instalar Next.js, necesitas tener acceso a la "Terminal" o "Consola". La consola es simplemente una ventana donde le damos órdenes escritas a la computadora en vez de usar el ratón.

**A. Crear tu carpeta raíz:**
1. Crea una carpeta completamente vacía en tu computadora (ej. `Formacion`).
2. Arrastra y suelta esa carpeta directamente adentro de la pantalla de Visual Studio Code para abrirla.

**B. Cómo abrir la Terminal (Paso críctico):**
Para poder escribir los comandos de instalación, necesitas que aparezca la ventanita de la consola en VS Code. Lo haces de dos formas posibles:
* **Usando el Mouse (Recomendado):** Ve la menú superior de arriba, haz clic en la palabra **`Terminal`** y luego selecciona **`Nueva Terminal`**.
* **Usando el Teclado:** Presiona las teclas `Ctrl` + `ñ` de tu teclado (o la tecla que parece una tilde invertida abajo del Escape, según tu idioma).

Verás que emerge un recuadro oscuro en la parte de abajo de tu editor indicándote en qué carpeta estás (ej. `C:\Users\eliza\Formacion>`). ¡Allí es donde escribirás!

---

## Paso 2: Instalación de Next.js por Consola
Ahora que ya tienes la consola abierta y un cursor parpadeando, debes decirle a Node.js que conecte con internet y descargue la base de Next.js. Copia o escribe el siguiente comando mágico y dale **Enter**:
```bash
npx create-next-app@latest nombre-del-proyecto
```

Cuando la terminal te empiece a hacer preguntas, te sugerimos utilizar esta configuración estándar de la industria (puedes seleccionar *Customize settings* si es la versión Next 15+):
- **TypeScript:** Yes `(Es el estándar laboral)`
- **ESLint:** Yes `(Ayuda a corregir errores al escribir)`
- **Tailwind CSS:** Yes `(Framework para diseñar rápidamente)`
- **`src/` directory:** No `(Para guardar nuestras páginas directo en la raíz)`
- **App Router:** Yes `(El sistema de rutas más moderno de Next.js)`
- **Customize import alias:** No

## Paso 3: Limpieza Global (Preventivo en Windows)
Si la instalación terminó, pero notaste una Alerta Amarilla ("Warning") hablando de un `package-lock.json` huérfano:
1. Abre tu Explorador de archivos en Windows.
2. Ve a `C:\Usuarios\tu_usuario`.
3. Borra el archivo `package-lock.json` si está ahí suelto (este archivo vuelve loco a Next.js porque cree que toda la computadora es un proyecto web).

## Paso 4: Entrar a la Carpeta y Encender el Motor
Una vez termine la instalación, debemos decirle a nuestra consola que "entre" a la nueva carpeta y luego arrancar la página web para verla.

```bash
# 1. Comando para entrar a la carpeta del proyecto
cd nombre-del-proyecto

# 2. Comando para encender el servidor y visualizar la página web
npm run dev
```

## Paso 5: Ver la Página en Internet
- En la consola te avisarán con verde cuando cargue todo (Dirá **Ready**).
- Verás un enlace que dice `http://localhost:3000`.
- Mantén presionada tu tecla **Ctrl** y dale **clic** a ese enlace.
- ¡A escribir código! Cada vez que guardes tu código en VS Code con `Ctrl + S`, la página se actualizará automáticamente (magia pura llamada "Hot Reload").
