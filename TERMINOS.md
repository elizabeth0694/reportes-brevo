# 📖 Glosario de Términos Frontend y Next.js

Este documento actúa como diccionario personal. Aquí iremos guardando cada término técnico que usemos en nuestro Plan de Formación, traducido a un lenguaje "humano" y entendible.

---

## 💻 Herramientas y Terminal

* **Terminal (Consola):** Ventana de texto negro donde damos órdenes (comandos) directas al sistema operativo sin tener que usar el clic del mouse.
* **`cd` (Change Directory):**
  * *Técnico:* Comando de la Interfaz de Línea de Comandos (CLI) para cambiar el directorio de trabajo actual.
  * *Fácil:* Es como caminar. Le dices a la consola que abra la puerta de una carpeta y "entre".
* **Error `enoent` (Error NO ENTry):**
  * *Técnico:* Código de error nativo del sistema que indica que un proceso (ej. `npm`) no puede encontrar el archivo requerido (ej. `package.json`) en la ruta actual donde está el prompt.
  * *Fácil:* Significa que estás intentando encender el motor de Next estando en la carpeta equivocada (como si gritaras "prendan la luz" estando afura en la calle en vez de adentro de la casa). Ocurre por olvidar usar `cd nombre-proyecto`.
* **Node.js:** Un programa instalado en tu PC que hace posible que la computadora pueda leer, entender y procesar código JavaScript por fuera del navegador de internet.
* **`npx` (Node Package Execute):** Es el comando para pedir prestadas herramientas de internet. Ejecuta acciones momentáneas sin instalar paquetería pesada para siempre en la PC. *(Ej: `npx create-next-app`)*.
* **`npm` (Node Package Manager):** El gestor de paquetes de Node. Se encarga de descargar y ensamblar todas las librerías del proyecto.
* **Localhost (`localhost:3000`):** Significa "esta propia computadora". Si tu web está en localhost, ninguna persona del mundo exterior la puede visitar, es sólo para que la visualices tú mientras construyes la casa.

---

## ⚛️ Next.js y React

* **App Router:** Es la nueva y moderna forma en la cual Next.js permite estructurar una App. Básicamente, consiste en poner todas las páginas y carpetas dentro de la carpeta principal llamada `app`.
* **JSX:** Un híbrido fascinante en el que se mezclan las famosas etiquetas del lenguaje HTML junto con la superinteligencia lógica del código JavaScript. 
* **Componente (Component):** Archivos pedacitos de código reutilizables. Tu página puede estar armada con pequeños ladrillos llamados *componentes* (Ej. un botón, el menú de navegación, un recuadro de texto).
* **`page.tsx`:** Es la portada final, la cara que ve el usuario. Es el archivo que devuelve todo lo que se va a pintar en el centro de la pantalla en una ruta específica.
* **`layout.tsx`:**
  * *Técnico:* Componente raíz estructural (Root Layout) obligatorio en el App Router. Mantiene retención de estado en la navegación sin perder cache y alberga el DOM principal (`<html>`, `<body>`).
  * *Fácil:* El "Marco de la foto". Es el contenedor estructural global donde ponemos las partes que JAMÁS van a cambiar en la página (como la barra de navegación de arriba). Envuelve a tus "fotos" (`page.tsx`).
* **`globals.css`:**
  * *Técnico:* Hoja de estilos en cascada principal de la aplicación. Su función crítica es inyectar las capas base del motor (`@tailwind base, components, utilities`) al árbol general.
  * *Fácil:* Archivo maestro de pintura de la casa. Cualquier regla de CSS puro que coloques acá afectará a absolutamente todas tus páginas a la vez.
* **`favicon.ico`:**
  * *Técnico:* Formato de imagen compilado requerido por los motores V8 o navegadores para renderizar la identidad visual de cabecera a lado del `document.title`.
  * *Fácil:* El dibujito ultra pequeñito (tu logo) que se muestra vivo en la pestaña de arriba de Google Chrome cuando abren tu enlace.
* **`className`:** El equivalente moderno en React de la vieja etiqueta `class` de HTML. Sirve para decirle al navegador qué estética (clases CSS) tendrá un contenedor.
* **Hot Reload (Fast Refresh):** Función increíble que hace que al guardar un archivo de código con `Ctrl+S`, la página de internet detecte el cambio y actualice su diseño automáticamente en medios segundos sin oprimir la recarga manual (F5).
* **React Fragment (`<> ... </>`):** Una etiqueta html "invisible". En React, una función siempre tiene la regla de devolver un (1) solo elemento padre grande. Si quieres devolver dos elementos hermanados sin crearles una caja madre visual (un `<div>`), los encierras en estas pinzas vacías para que el código no falle.

---

## 🎨 Tailwind CSS (Diseño visual por clases)
Usamos Tailwind para evitar escribir enormes archivos CSS, haciendo el diseño visual mucho más ágil:

* **`flex`:** Convierte una caja `<div>` en flexible, permitiendo ordenar mágicamente las cosas que haya en su interior sin que se rompan o desalineen por errores de borde.
* **`flex-col`:** Hace que los múltiples objetos dentro de la caja se ordenen de arriba hacia abajo (una columna).
* **`items-center`:** Toma todos los elementos y los empuja visualmente hacia el centro absoluto del horizonte magnético del contenedor madre.
* **`p-24`:** El amado *Padding*. Le da un colchón invisible, un "relleno" o respiración, de tamaño muy notable a tu caja por los cuatro lados del cuadrado, evitando que tus textos golpeen los bordes filosos de una pantalla.
* **`text-5xl`:** Comando mágico para el tamaño de fuente. Agranda gigantescamente tu texto hasta el nivel "5 eXtra Large".

---

## 📁 Estructura de Archivos de un Proyecto
El listado de carpetas que Next.js genera cuando escribes `npx create-next-app`:

* **`.next`:** Carpeta "oculta" y automática. Es el motor interno de Next.js. Se regenera cada vez que corres `npm run dev`. **(No se toca)**.
* **`app`:** El corazón de tu proyecto. Aquí dentro pasaremos el 95% del tiempo creando nuestras páginas y componentes con el *App Router*.
* **`node_modules`:** La bodega gigantesca. Aquí se guarda el código real de todas las librerías de internet que usa nuestro proyecto. Pesa muchísimo. **(No se toca)**.
* **`public`:** Carpeta para guardar archivos estáticos que están a la vista del público en internet, como tus imágenes, el logo o fuentes de texto.
* **`.gitignore`:** La "lista negra" de tu repositorio. Le dice a Git qué carpetas NUNCA debe subir a internet (como por ejemplo `node_modules` para no saturar la nube).
* **`package.json`:** El "Acta de Nacimiento" del proyecto. Es un texto que sirve como lista donde dicen qué nombre tiene la aplicación y qué herramientas necesita para vivir.
* **`package-lock.json`:** Este es el que te dio el dolor de cabeza hace rato, ¡pero aquí adentro SÍ pertenece! Sirve como candado de seguridad para congelar versiones de librerías y que no se actualicen solas a tus espaldas rompiendo la página.
* **Archivos `.ts` / `.mjs` / `.json` sueltos (`next.config`, `eslint.config`, `tsconfig`):** Son puros archivos aburridos de configuración técnica experta. Le dicen reglas específicas a TypeScript y a Next.js. Rara vez se modifican al principio de un proyecto.

---

## 🔒 Seguridad, Lógica y Servidor (Backend en Next.js)

* **`.env.local`:** La "caja fuerte" del proyecto. Es un archivo especial donde guardamos contraseñas, llaves (API Keys) o datos sensibles. Next.js nunca expone este archivo al visitante de la página web, manteniendo nuestras llaves seguras.
* **Carpeta `lib` (Library / Librería):** Carpeta donde guardamos archivos enfocados al "trabajo pesado", lógica matemática o conexiones de internet. Su propósito es no mezclar la lógica técnica del servidor con los archivos de diseño visual (`page.tsx`).
* **Extensión `.ts`:** Archivo que **solamente contiene lógica matemática o funcional** en TypeScript. No dibuja botones, ni tablas, ni interfaz visual.
* **Extensión `.tsx`:** Archivo que contiene la lógica mezclada con los diseños visuales de la página (El XML / HTML). 
* **`async` / `await`:** Comandos que controlan el tiempo. Como ir al internet a buscar datos puede tardar varios milisegundos, el `await` le ordena a nuestro programa: *"Pausa aquí, ve por la información a Brevo, y no continúes a la siguiente línea abajo hasta que la información regrese lista"*.
* **`fetch()`:** Es el "mensajero" moderno de JavaScript. Se utiliza para ir a buscar datos a un enlace externo (API) y traerlos de regreso a nuestro proyecto. En lenguaje de Google Sheets esto era tu `UrlFetchApp.fetch()`.
* **`.map()`:** Nuestra fotocopiadora mágica de React. Toma una lista de elementos (ej. 50 campañas de correo) y le ordena a la pantalla dibujar los elementos (ej. una fila `<tr>` en una tabla HTML) tantas veces como elementos haya en la lista obtenida, de forma automática.
* **`import`:** Es como "pedir prestado" un enchufe o herramienta que vive en otro archivo para poder usarlo en el archivo actual. Ej: `import { x } from './otraCarpeta'`.
* **`export` / `export default`:** Es ponerle una etiqueta de "disponible" a nuestra función para dejar que otros archivos de nuestro proyecto puedan llevársela o "importarla" si la necesitan.
* **`const` (Constante):** Se utiliza para declarar (crear) una variable que no va a cambiar su valor despues de ser creada. Es como una caja fuerte donde metes un dato y le pones un nombre por fuera de la caja para usarla después.
* **Operador Ternario (`?` y `:`):** Es un atajo para no escribir un "If/Else" (Si pasa esto... si no...). El signo de interrogación `?` es la pregunta, y los dos puntos `:` significan "De lo contrario".
* **`.forEach()`:** Comando de ciclo que significa "Por Cada Uno". Inspecciona una lista de elementos uno por uno y ejecuta una acción sin detenerse hasta dar la vuelta completa por la lista entera.
* **`.push()`:** Comando que inserta o empuja. Le indica a una lista o arreglo: "¡Toma este nuevo dato y mételo al final de la fila!".
* **`...` (Spread operator):** Los tres puntos suspensivos obligan a "desempaquetar o vaciar" lo que hay dentro de arreglos o listas más pequeñas, revolviendo y fusionando todo en una sola lista más grande.
* **`new Date()`:** Creador formal de fechas en JavaScript. Convierte textos crudos de fechas en un objeto inteligente que nos permite manipular, cambiar formato (ej. a 'es-ES') y extraer días u horas fácilmente.
* **`while` (Bucle "Mientras"):** Es un ciclo continuo. Funciona como una máquina que se repite dando vueltas infinitas *mientras* una condición sea verdadera. A diferencia de `.map` o `.forEach` que tienen un final exacto definido por una lista, el `while` solo se detiene cuando tú jalas la palanca de emergencia para frenarlo manualmente.
* **`offset` (Desplazamiento):** Variable matemática usada frecuentemente junto con `limit` (límite) para lograr la técnica de Paginación. Significa "a partir de qué número de la fila vamos a empezar a leer en este bloque de peticiones".
* **`'use client'`:** 
  * *Técnico:* Directiva de Next.js que marca la frontera entre componentes de servidor y componentes de cliente. Indica que el archivo contiene interactividad (hooks) o APIs exclusivas del navegador.
  * *Fácil:* Es como ponerle un letrero a un objeto que dice "Este juguete necesita pilas (JavaScript) para moverse". Si no tiene este letrero, es solo una estatua de piedra (HTML estático).
* **`useState` (Gancho de Estado):**
  * *Técnico:* Hook fundamental de React que permite añadir estado local a un componente funcional. Devuelve un valor y una función para actualizarlo, disparando un re-renderizado automático.
  * *Fácil:* Una "Memoria de Corto Plazo" del componente. Sirve para recordar cosas que cambian, como lo que el usuario escribe en un buscador o si un botón está encendido o apagado.
* **Props (Propiedades):**
  * *Técnico:* Objeto de solo lectura que se pasa de un componente padre a un componente hijo para transferir datos a través del árbol de la aplicación.
  * *Fácil:* Los "Mensajes" o "Paquetes" que le envías a una función. Imagina que el componente es una licuadora y las props son las frutas que le echas adentro para que sepa qué jugo hacer.
* **`Array.filter()` (Filtrado de Listas):**
  * *Técnico:* Método de arreglos que crea una nueva lista conteniendo únicamente los elementos que cumplen con una condición lógica específica definida en una función de prueba.
  * *Fácil:* Un "Colador" o "Cedazo". Tomas una lista grande (ej: 100 correos) y dejas pasar solo los que cumplen tu regla (ej: los que se enviaron en lunes), descartando el resto.
* **`setTimeout` (Temporizador):**
  * *Técnico:* Función global de JavaScript que programa la ejecución de una tarea después de que haya transcurrido un número determinado de milisegundos.
  * *Fácil:* Es una "Alarma de Cocina". Le dices al programa: "Quédate quieto y espera 5 segundos antes de sonar la campana o borrar este mensaje de error".
* **Cache (Memoria Temporal):**
  * *Técnico:* Capa de almacenamiento de datos de alta velocidad que guarda subconjuntos de datos, transitoriamente, para que las futuras solicitudes de dichos datos se atiendan con mayor rapidez.
  * *Fácil:* Un "Post-it" en el monitor. En lugar de ir hasta la bodega (la API de Brevo) a buscar un dato cada vez, lo anotas en un papelito cerca de ti para leerlo rápido, ahorrando tiempo y energía.
* **API Key (Llave de Acceso):**
  * *Técnico:* Identificador único y secreto utilizado para autenticar una aplicación o usuario ante un servicio externo, controlando el acceso y los permisos de consumo.
  * *Fácil:* La "Llave Maestra" de tu casa. Sin esa llave, Brevo no te deja entrar a ver tus datos de correos porque no sabe quién eres. ¡Nunca la compartas con extraños!
* **Recharts (Librería de Gráficos):**
  * *Técnico:* Biblioteca de visualización de datos construida sobre componentes de React y D3.js para renderizar gráficos declarativos y responsivos.
  * *Fácil:* Es un "Estuche de Dibujo Profesional". En lugar de dibujar las barras y ejes a mano con CSS, esta herramienta ya trae los moldes listos para que tú solo le pases los números.

---

## 🎛️ Servidor Avanzado, Descargas y Flujos Asíncronos (Fase 2)

* **API Route (Ruta de API):**
  * *Técnico:* Extensión del enrutador de Next.js que permite crear endpoints HTTP (servidor) dentro del proyecto. Se ejecutan en un entorno seguro de Node.js sin exponer código sensible al navegador.
  * *Fácil:* Una "Ventanilla de Trámites Privada" en la parte trasera del negocio. El cliente (navegador) no puede entrar a la oficina del jefe, pero puede pedirle un reporte a través de esta ventanilla y el jefe se lo prepara de forma segura.
* **Polling (Sondeo / Consulta periódica):**
  * *Técnico:* Técnica de comunicación donde el cliente realiza peticiones HTTP repetidas a intervalos definidos (ej. cada 5 segundos) para comprobar el estado de un proceso asíncrono en el servidor.
  * *Fácil:* Preguntar "¿Ya casi llegamos?" cada cinco minutos durante un viaje en auto hasta que por fin el chofer responda que sí.
* **Promise Sharing (Coalescencia de Solicitudes):**
  * *Técnico:* Patrón de diseño asíncrono que almacena en caché la promesa de una petición fetch activa. Si ocurren llamadas paralelas, se les devuelve la misma promesa en curso en lugar de iniciar nuevas conexiones.
  * *Fácil:* Si tres amigos quieren pedir la misma pizza al mismo local al mismo tiempo, en lugar de que cada uno llame por su cuenta y saturen el teléfono, uno solo llama y los tres comparten el mismo pedido cuando llegue a la mesa.
* **ExcelJS:**
  * *Técnico:* Librería de Node.js y navegador para manipular y formatear libros de trabajo, hojas y celdas de Excel en formato XLSX, permitiendo estilos y fuentes avanzados.
  * *Fácil:* Una "Fábrica Automatizada de Planillas Excel". Le das órdenes en código y te devuelve un archivo Excel bien pintadito con colores, bordes y negrita sin que tengas que abrir el programa de Microsoft.
* **ArrayBuffer / TextDecoder:**
  * *Técnico:* Objetos de JavaScript de bajo nivel para representar y leer buffers de datos binarios genéricos y decodificarlos en cadenas de texto legibles (como UTF-8).
  * *Fácil:* El "Traductor de Idioma Binario". Permite al servidor tomar un archivo descargado de internet que viene como ceros y unos, y convertirlo en texto con letras comunes y corrientes para poder entenderlo.
* **HTTP 429 Too Many Requests:**
  * *Técnico:* Código de estado de error HTTP que indica que el cliente ha excedido el límite de tasa de solicitudes permitido por el servidor en un periodo de tiempo.
  * *Fácil:* El cartel de "Cajero Ocupado: Espere por favor". Significa que le hiciste demasiadas preguntas seguidas a Brevo y te ha pedido amablemente que dejes pasar un minuto antes de volver a molestar.

