# Portafolio web — Diego Reyes

## Asistente virtual (MVP)

El widget flotante de `src/components/ChatWidget.jsx` consulta un Cloudflare Worker
(`worker/index.js`) que llama a Google Gemini. GitHub Pages solo sirve archivos
estáticos, por lo que el Worker mantiene la clave privada fuera del navegador.
Los datos públicos que puede usar están en `knowledge/portfolio.json`; actualiza
ese archivo cuando cambien proyectos, precios o servicios.

1. Revoca cualquier clave expuesta y crea una nueva en Google AI Studio.
2. En Cloudflare, instala Wrangler, inicia sesión y despliega el Worker:
   `npx wrangler deploy --config worker/wrangler.toml`.
3. En el panel de Cloudflare Workers, agrega `GEMINI_API_KEY` como **secreto**.
   No lo introduzcas en código, `wrangler.toml` ni variables `VITE_`.
4. Copia la URL pública del Worker (`https://...workers.dev`). En GitHub,
   Settings → Secrets and variables → Actions → Variables, crea
   `VITE_CHAT_API_URL` con esa URL; la URL es pública, no la clave.
5. Ejecuta de nuevo el workflow de GitHub Pages para incluir la URL en el build.

`worker/wrangler.toml` contiene `ALLOWED_ORIGIN`; cambia ese valor si tu sitio
se sirve desde un dominio propio distinto de `https://doppio-ai.github.io`.
El Worker usa Gemini 3.5 Flash-Lite y se puede cambiar en `GEMINI_MODEL`.

Para desarrollo local usa `npx wrangler dev --config worker/wrangler.toml`
con un secreto local `.dev.vars` dentro de `worker/` (ignorado por Git), y
configura el origen permitido acorde al entorno. `npm run build` verifica
el frontend, pero no prueba una conversación real con Gemini.

El botón de cotización utiliza `CONTACT.whatsapp` en `src/data/site.js`.
Mientras siga con el número de ejemplo, enlaza a la sección `#contacto`.

El Worker configura un límite gestionado de 10 solicitudes por minuto por IP (aproximado y por ubicación de Cloudflare; no es un límite global de gasto). Valida hasta 16 KB reales de entrada y usa un timeout de 25 segundos para Gemini.

**Antes de abrirlo al público:** verifica cuotas de Gemini y evalúa protección
contra bots en el Worker/Cloudflare, alerta/presupuesto de consumo de Gemini y verifica
la información comercial. La conversación no se guarda en una base de datos;
el usuario puede compartir voluntariamente su consulta por WhatsApp.


MVP del portafolio descrito en `Plan_portafolio_Diego_Reyes.docx`: una sola página
que presenta servicios, precios orientativos, tres proyectos reales con captura del
sitio publicado y un contacto claro.

**Identidad visual:** azul, nítida y geométrica, inspirada en el lenguaje visual
de *Persona 3 Reload* sin copiar recursos del juego. **Tema claro por defecto**;
el **oscuro reproduce la paleta de la especificación** al pie de la letra:

| Token de la especificación | Valor | Variable en este proyecto |
| --- | --- | --- |
| Fondo principal | `#101827` | `--ink` |
| Panel / superficie | `#18263A` | `--surface` |
| Azul principal | `#3B82F6` | `--electric` |
| Azul luminoso | `#67C7FF` | `--acento`, `--glow` |
| Blanco | `#F5F8FC` | `--fg` |
| Texto secundario | `#AAB8CB` | `--muted` |
| Borde sutil | `#314158` | `--line` |

Tipografías: Inter (lectura), Space Grotesk (títulos, peso 700 con `clamp()`) y
JetBrains Mono (etiquetas y detalles técnicos). El verde original se retiró: el
papel de acento lo ocupa ahora el cian de la especificación.

**Stack:** React 19 + Vite 8 + Tailwind CSS 4 + GSAP (`gsap`, `ScrollTrigger`, `SplitText`).

---

## Empezar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve dist/ para revisar el build
```

---

## Tema: claro por defecto, oscuro opcional

El sitio abre en **claro**. En la barra superior hay un botón (luna/sol) que
cambia a oscuro y guarda la preferencia en `localStorage` (`dr-tema`); el script
de `index.html` la aplica antes del primer pintado para que no haya destello.

Toda la paleta vive en variables CSS en `src/index.css`:

- `:root` → colores del tema claro (adaptación legible de la identidad).
- `[data-theme="dark"]` → la paleta de la especificación, valor por valor.
- `@theme inline` los expone como utilidades de Tailwind (`bg-surface`,
  `text-muted`, `border-line`…), así que **ningún componente menciona un color
  fijo**: cambiar `:root` retiñe todo el sitio.

Dos matices deliberados: en el tema claro `--glow` baja a `#0284C7` porque
`#67C7FF` sobre fondo casi blanco no se ve; y `--acento` en claro usa tonos
oscurecidos para mantener el contraste AA del texto.

Para invertir el orden (oscuro por defecto), en `src/index.css` mueve los valores
oscuros a `:root` y ajusta en `src/hooks/useTheme.js` el valor inicial a
`"oscuro"`. Para quitar el conmutador, elimina el botón de `src/components/Nav.jsx`.

---

## Logotipos

Los tres archivos de `public/` son la identidad oficial y se usan tal cual:

| Archivo | Formato | Dónde se usa |
| --- | --- | --- |
| `isotipo.svg` | 120 × 120, marca «D» con chevrón | Barra de navegación (38–40 px), tarjeta de «Sobre mí» (48 px) y **favicon** |
| `logo-claro.svg` | 560 × 160, placa clara | Pie de página en tema claro |
| `logo-principal-oscuro.svg` | 760 × 240, placa oscura + lema | Pie de página en tema oscuro y **imagen social** (`og-image.png`) |

Dos decisiones de implementación:

- **En la barra, el isotipo es el archivo SVG real** y el texto («DEVELOPER» +
  «Diego Reyes») es texto HTML, no imagen. A 38 px el logotipo completo dejaría
  el nombre a 3–4 px de altura, ilegible; así el lockup conserva la jerarquía
  del logo y sigue siendo texto seleccionable y accesible.
- **El pie usa los logotipos completos** y cambia de versión con el tema
  (`useTema` en `Footer.jsx`), de modo que cada fondo recibe su placa.

La imagen social se compone con el logotipo oscuro real sobre el fondo del
estudio, con su placa enmarcada: `og-image.png` (1200 × 630).

Los SVG incluyen un bloque de metadatos C2PA; no afecta al render y se mantiene
para no alterar los archivos originales.

## Hero cinematográfico (GSAP)

La entrada del Hero se anima con **GSAP + `useGSAP`** (`gsap@3.15`, `@gsap/react@2.1`),
en `src/hooks/useHeroAnimations.js`.

Secuencia (una sola timeline, ~1,6 s, sin bloquear la interacción):

| Momento | Qué ocurre |
| --- | --- |
| 0 ms | Los elementos ambientales del Hero aparecen (opacidad) |
| ~50 ms | Las dos líneas finas se despliegan desde la izquierda |
| ~150 ms | La etiqueta «Disponible» entra con desplazamiento vertical |
| ~330 ms | Las **7 palabras** del título suben desde su máscara con `power4.out` (stagger 45 ms) y una inclinación que se endereza |
| ~550 ms | La descripción entra; después los botones (stagger 70 ms, con escala 0,98 → 1) |
| ~800 ms | Los tres indicadores con check y las etiquetas del stack |
| ~900 ms | La fotografía del hero se descubre con un recorte de abajo hacia arriba |

Detalles de implementación que importan:

- **Todo se construye con `.from()`**: el estado natural del DOM es el estado
  final, así que si el JavaScript falla el contenido se ve igual. No hay clases
  que oculten nada en CSS.
- **`immediateRender`** de los `.from()` coloca el estado inicial antes del
  primer pintado: no se ve el contenido en su sitio y luego saltar.
- **Red de seguridad a los 2,6 s**: si el reloj de animación no avanza (pestaña
  en segundo plano, `requestAnimationFrame` limitado), la timeline se completa
  de golpe con `tl.progress(1)`; el contenido nunca queda a medio revelar.
- **Una sola reproducción**: un flag de módulo evita el doble disparo de React
  StrictMode en desarrollo y que la intro se repita al cambiar de tema (el árbol
  se remonta con `key={tema}`).
- **Microinteracciones** con `gsap.quickTo` en los dos botones del Hero: elevación
  de 3 px, escala 1,02 e icono que se desplaza 3 px al pasar el puntero o al
  recibir foco por teclado. Los valores van precomputados; los eventos solo
  empujan un número.
- **Fotografía del hero** (`public/heroimg.jpg`): el original de 3456 × 5184 y
  1,53 MB se recortó a 4:5 y se comprimió a **900 × 1125, 99 KB** para no
  disparar el LCP; el original queda como respaldo fuera del proyecto. Se sirve
  con `preload` y `fetchPriority="high"`, dimensiones explícitas y un contenedor
  4:5 con `object-cover`, así que no hay saltos de diseño mientras carga.
  Animaciones GSAP sobre ella:
  - **Descubrimiento**: `clip-path` de `inset(0 0 100% 0)` a `inset(0)`, con
    desplazamiento vertical (26 px) y escala 1,04 → 1, encadenado a la entrada
    del título (ocupa el lugar de la antigua tarjeta de código).
  - **Deriva lenta**: escala 1 → 1,03 en 26 s con `yoyo`, para que el retrato no
    esté completamente quieto.
  - **Paralaje de puntero**: ±9 px sobre una capa interna con `quickTo`, solo con
    `(pointer: fine)`; en táctil no se registra.
  - **Hover**: el marco se agranda un 1,2 %.
  - Las tres interacciones se cancelan con movimiento reducido y el `clip`
    tampoco se aplica: la foto aparece directamente.
- **Movimiento reducido** con dos consultas de `gsap.matchMedia()`: con
  `prefers-reduced-motion: reduce` no se crea ninguna animación ni se registran
  las microinteracciones; el Hero aparece en su estado final.
- Los selectores viven dentro de `useGSAP(..., { scope: raiz })` y se apoyan en
  atributos `data-hero`, así que no tocan ninguna otra sección. El `mm.revert()`
  del retorno limpia tweens, listeners y consultas al desmontar.

Cambio estructural asumido: el `<h1>` reparte su texto en un `<span>` por palabra
(con una máscara por palabra) para poder escalonar la entrada. El texto sigue
siendo texto real —los lectores de pantalla leen «Tu idea, en un sitio web
funcional.» y el `h1` conserva su `id`— y los saltos de línea no cambian.

## Sistema de movimiento: GSAP en toda la página

La página entera anima con **GSAP** (`gsap@3.15`). Motion ya no está instalado:
tener dos librerías de animación a la vez no tenía justificación, así que la
migración fue completa.

Punto único de registro: `src/lib/gsap.js` — `ScrollTrigger` y `SplitText`
(no se usan Flip, ScrollSmoother ni Observer). Duraciones y curvas, en
`src/lib/motion.js`:

| Constante | Valor | Uso |
| --- | --- | --- |
| `DUR.micro` | 0,18 s | hover, foco, mensajes de error |
| `DUR.corto` | 0,34 s | etiquetas, detalles, apertura del panel |
| `DUR.base` | 0,5 s | aparición de bloques |
| `DUR.largo` | 0,9 s | titulares y paneles |
| `DUR.barrido` | 2,74 s | barrido de pantalla completo (entra + cubre + cierra) |
| `DUR.barridoPanel` | 0,5 s | barrido sobre el panel del caso de estudio |
| `EASE.seca` | `power4.out` | frenada de titulares |
| `EASE.salida` | `power3.out` | casi todo lo demás |
| `EASE.bidireccional` | `power3.inOut` | barridos |

### Arquitectura: dos coreografías

1. **El Hero** tiene su propia timeline en `src/hooks/useHeroAnimations.js`
   (ver arriba): entrada escalonada, foto y microinteracciones de los botones.
2. **El resto de la página** se resuelve en un único hook,
   `src/hooks/useAnimacionesPagina.js`, que lee atributos del DOM. Ningún
   componente sabe cómo se anima:

| Atributo | Efecto |
| --- | --- |
| `data-reveal="abajo \| izquierda \| derecha \| escala"` | aparición al entrar en pantalla |
| `data-retraso="0.12"` | retardo extra dentro del lote |
| `data-titulo` | el titular se parte en líneas y se revela con máscara |
| `data-paralaje="40"` | desplazamiento ligado al scroll (`scrub`) |
| `data-linea-proceso` | línea que se dibuja al bajar por el proceso |
| `data-tarjeta` | inclinación máxima de 5° siguiendo el puntero |

`<Reveal>` es solo un envoltorio que emite esos atributos: 49 elementos del
sitio pasan por ahí y se ajustan en un solo sitio.

### Detalles que importan

- **SplitText espera a `document.fonts.ready`.** Partir un titular antes de que
  carguen las fuentes deja las líneas cortadas donde no toca. Hay un respaldo
  de 1,6 s por si `fonts.ready` no resuelve.
- **Revelados con `ScrollTrigger.batch`**, no uno por elemento: un disparo por
  grupo, `once: true` y un escalonado calculado con `data-retraso`.
- **Red de seguridad a los 3 s**: si un disparo no llega (pestaña en segundo
  plano, recálculo tardío), lo que ya está en pantalla se revela igualmente; lo
  que queda por debajo conserva su turno.
- **El cierre del caso de estudio tiene temporizador propio**: si el reloj de
  animación no avanza, el `<dialog>` se cierra igualmente. Nunca se queda
  atascado.
- **Los errores del formulario no animan la opacidad**, solo un desplazamiento
  de 4 px: un mensaje de error tiene que ser legible desde el primer fotograma.
- **`ScrollTrigger.config({ ignoreMobileResize: true })`** y un `refresh()` a los
  1,2 s y en `load`: las fuentes y la foto del hero cambian la altura de la
  página.
- **Selectores acotados**: todo se busca dentro del nodo raíz de React, y el
  hook devuelve una limpieza que mata tweens, disparadores y `SplitText`.

**Movimiento reducido**: dos consultas de `gsap.matchMedia()`. Con
`prefers-reduced-motion: reduce` no se crea ninguna animación, ni se parten los
titulares, ni se registran las microinteracciones: la página aparece completa.

### Dónde se ajusta el ritmo

Todo lo temporal está centralizado; no hay duraciones sueltas por los
componentes.

| Qué quieres cambiar | Archivo |
| --- | --- |
| Las tres fases del barrido (`entrada`, `cubre`, `cierre`) | `src/lib/motion.js` → `BARRIDO` |
| Duraciones globales (`micro`, `corto`, `base`, `largo`) | `src/lib/motion.js` → `DUR` |
| Curvas de aceleración | `src/lib/motion.js` → `EASE` |
| Punto de disparo de los revelados al bajar | `src/lib/motion.js` → `DISPARO` |
| Entrada de la portada (decor, líneas, título, botones, foto) | `src/hooks/useHeroAnimations.js` → `HERO_MOVIMIENTO` |
| Escalonados de bloques y titulares | `src/hooks/useAnimacionesPagina.js` |
| Aros y líneas ambientales | `src/index.css` |

En `HERO_MOVIMIENTO`, `solape` es cuánto se adelanta cada bloque respecto al
anterior: cuanto más negativo, más se pisan y más rápida se siente la entrada.
Bajar `duracion` la alarga; bajar `solape` la comprime.

Para probar sin recompilar, en la consola del navegador:

```js
gsap.globalTimeline.timeScale(0.2)  // todo a cámara lenta
gsap.globalTimeline.timeScale(1)    // ritmo normal
```

### Probar el barrido de verdad

`tools/sonda-barrido.mjs` levanta Edge con depuración remota y, por CDP, hace
clic en un enlace y muestrea el estado con el reloj real: cuándo cambia el hash,
cuándo se mueve el scroll, si la banda cubre y en qué punto va la timeline.
Guarda tres capturas (cerrado, todavía cerrado, abriendo).

```bash
npm run dev            # en otra terminal
node tools/sonda-barrido.mjs
```

Sirve porque el navegador headless normal adelanta el tiempo virtual y el reloj
de GSAP no avanza como en una pestaña real: así se ven los tiempos de verdad.
Con la app en desarrollo, `window.__barrido.tl` expone la timeline en la consola
(`window.__barrido.tl.timeScale(0.3)` la pone a cámara lenta). Ese atajo no
existe en el build de producción.
### Navegación por anclas

Los enlaces internos (`href="#…"`) no saltan al pulsarlos: el salto ocurre
**mientras la pantalla está cubierta**, justo antes de que el plano empiece a
abrirse, para que al descubrirse la sección entre con sus animaciones. Antes el
salto era inmediato y el barrido llegaba después, así que todo ocurría detrás
del azul y al abrirse no quedaba nada que ver.

- Un único interceptor (`src/lib/navegacion.js`) escucha los clics de toda la
  página: no hay llamadas al barrido repartidas por los componentes. Los enlaces
  con `data-sin-barrido` (el de "Saltar al contenido") quedan fuera.
- El instante del salto se calcula con `BARRIDO`: `entrada + cubre − 0,05`. Si
  cambias las fases, el salto se recoloca solo.
- Si el barrido no puede reproducirse (movimiento reducido, o ya hay uno en
  curso), se navega **al instante**, sin retraso: el clic nunca se queda sin
  efecto. Ese caso lo decide `pedirBarrido()`, que devuelve si el plano va a
  salir o no.
- Solo hay una navegación pendiente: un segundo clic cancela la anterior. Sin
  eso, un clic rápido se deshacía solo un segundo después.
- El foco se mueve al destino (`tabindex="-1"`) para que el tabulador continúe
  desde ahí, y las secciones no dibujan anillo de foco porque no son controles.
### El barrido de pantalla

El plano azul no es un desplazamiento único, son **tres tiempos** en una
timeline (`src/components/ui/BarridoPantalla.jsx`):

| Fase | Duración | Qué hace |
| --- | --- | --- |
| Entra | 0,24 s | de `xPercent -100` a `0` con `power3.out`: el telón baja y cubre |
| Cubre | 2,00 s | el telón se queda abajo; aquí ocurre el cambio de sección |
| Cierra | 0,50 s | de `0` a `100` con `power3.inOut`: se abre y descubre la sección nueva |

Las tres fases viven en `BARRIDO` (`src/lib/motion.js`), no repartidas por el
componente: `{ entrada: 0.24, cubre: 2, cierre: 0.5 }`. `cubre` es el que da la
sensación de telón: por debajo de ~0,6 s no se lee como tal.

Cuatro detalles que hacen que se lea bien:

- La banda mide **más que la ventana** (`--margen-banda: max(18vw, 20vh)` a cada
  lado). Sin ese margen, la inclinación de 16° deja triángulos sin cubrir en las
  esquinas — se nota sobre todo en móviles altos, donde la inclinación desplaza
  más píxeles que en escritorio. Con él, el estado "cubre" pinta los cuatro
  rincones (comprobado a 1440 × 900 y 390 × 844).
- **Cada borde lleva su filo cian**: el derecho se ve al entrar, el izquierdo al
  abrir. No es adorno: marca por dónde va el corte.
- **El movimiento va en píxeles, no en porcentajes.** Con `xPercent` el telón no
  llegaba a cubrir: GSAP reaplicaba el estado inicial y la banda se quedaba
  fuera de pantalla toda la espera, así que el salto ocurría con la pantalla
  visible y luego pasaba un barrido rápido — justo el efecto contrario al
  buscado. Con `x: ±ancho` (`banda.offsetWidth`) es determinista.
  Comprobado con `tools/sonda-barrido.mjs`.
- **Latido durante la espera**: con el telón abajo dos segundos, un brillo blanco
  muy tenue sube y baja una vez (un `radial-gradient` al 16 %). Sin él la
  pantalla parece congelada. Va sincronizado: empieza cuando el telón termina de
  bajar y acaba cuando empieza a subir.
- **El salto de sección ocurre con el telón abajo**, 0,15 s antes de que empiece
  a abrirse (`entrada + cubre − 0,15` = 2,09 s): el cambio de pantalla queda
  tapado y la sección entra con sus animaciones al descubrirse.
- Un barrido a la vez (`activoRef`): si llega otro mientras se cierra, se
  ignora. Y si el reloj de animación no avanza, un temporizador lo retira
  igualmente (`DUR.barrido + 0,6 s`).

**Sin destellos**: no se reproduce el fogonazo de un fotograma del juego
(riesgo de fotosensibilidad, WCAG 2.3.1) ni se añade sonido automático.
## Sonido de interfaz

Sintetizado con Web Audio (`src/lib/sonido.js`), sin archivos ni licencias:
un clic al navegar y dos tonos al abrir/cerrar el caso de estudio.

- **Apagado por defecto** y sin sonido hasta que el visitante lo active con el
  botón de altavoz de la barra (en móvil, dentro del menú).
- La preferencia se guarda en `localStorage` (`dr-sonido`) y el estado se
  comparte con `useSyncExternalStore`.
- El `AudioContext` se crea en el primer gesto real, como exigen los navegadores.

## Por qué el tema remonta el árbol

Chrome conserva a veces el estilo calculado (y la pintura) de los nodos que ya
existían: al cambiar de tema, tarjetas y paneles se quedaban con el color
anterior aunque las variables CSS ya fueran las nuevas. Se comprobó que un nodo
**nuevo** con las mismas clases sí tomaba el color correcto, y que ni recargar
la hoja de estilos lo arreglaba.

Por eso `App` usa `key={tema}`: al conmutar se remonta el árbol y todas las
superficies se pintan con la paleta vigente. El borrador del formulario vive en
`src/components/Contacto.jsx` (fuera de React) para no perder lo escrito, y el
fondo de la página lo pinta la raíz de React —`html`/`body` quedan
transparentes— para que tampoco se quede atrás.

**Movimiento reducido**: `gsap.matchMedia()` decide en un solo sitio. Con
`prefers-reduced-motion: reduce` no se crea ninguna animación, ni se parten los
titulares, ni se registran las microinteracciones: la página aparece entera. El
CSS global además anula animaciones y transiciones. Verificado forzando
`prefers-reduced-motion` en el navegador.

**Rendimiento**: se animan `transform` y `opacity` (más `clip-path` en tres
sitios puntuales); no hay `will-change` global y los `scrollTrigger` usan
`once` para no quedar vivos. Coste de GSAP en el bundle: ~20 KB gzip
(total ~140 KB gzip de JS, 9 KB menos que la versión con Motion y GSAP juntos).

---

## Qué hay en el sitio

| Sección | Ancla | Contenido |
| --- | --- | --- |
| Portada | `#inicio` | Título, descripción, dos llamadas a la acción y fotografía del estudio |
| Servicios | `#servicios` | Cuatro tarjetas con alcance y precio de partida |
| Precios | `#precios` | Rangos orientativos en MXN + costos que se cotizan aparte |
| Proyectos | `#proyectos` | Tres proyectos reales con captura del sitio y detalle en ventana modal |
| Sobre mí | `#sobre-mi` | Presentación, enfoque de trabajo y proceso en 4 pasos |
| Tecnologías | `#tecnologias` | Grupos por área, sin barras de porcentaje |
| Contacto | `#contacto` | Formulario validado + canales directos |
| Pie | — | Navegación, contacto, aviso de privacidad |

---

## Editar el contenido

Casi todo el texto vive en **un solo archivo**: `src/data/site.js`.

- `PROFILE` — nombre, rol, título y descripción de portada.
- `CONTACT` — correo, WhatsApp, LinkedIn y GitHub.
- `SERVICES` / `PRICES` — servicios y rangos de precio.
- `PROJECTS` — proyectos; cada uno alimenta su tarjeta y su ventana de detalle.
- `TECH_GROUPS` — tecnologías por área.

### ⚠️ Antes de publicar

1. **Datos de contacto:** `CONTACT` trae valores de ejemplo
   (`hola@diegoreyes.dev`, `5215500000000`). Cámbialos o los enlaces de WhatsApp
   y correo no llegarán a nadie.
2. **Tecnologías:** deja solo lo que realmente domines (el plan lo pide explícitamente).
3. **Proyectos:** los tres proyectos son trabajos reales publicados; las miniaturas
   son capturas de los sitios en producción (`public/proyectos/`). Al agregar uno
   nuevo, incluye `imagen`, `imagenAlt` y, si existen, `demoUrl` y `repoUrl`.
4. **Dominio:** actualiza `canonical`, `og:url` y `og:image` en `index.html`
   cuando tengas dominio propio.
5. **Capturas:** al actualizar un proyecto, vuelve a capturar su portada a
   1600×1000 px (JPEG/WebP) y sobrescribe el archivo en `public/proyectos/`.
   El mockup SVG de `src/components/ProjectMockup.jsx` queda solo como respaldo
   para proyectos que aún no tengan captura.

---

## Formulario de contacto

El sitio es estático, así que el formulario **no envía ni guarda nada en un
servidor**: valida los campos, arma el mensaje y lo abre en WhatsApp (o en el
cliente de correo) para que tú lo envíes. Es una decisión deliberada: funciona
sin backend, sin costos y sin recopilar datos personales.

Si más adelante quieres recibir los mensajes por correo sin abrir WhatsApp,
conecta un servicio como Formspree, Netlify Forms o una función serverless y
reemplaza el cuerpo de `handleSubmit` en `src/components/Contacto.jsx`.

---

## Accesibilidad y calidad

- Enlace "Saltar al contenido", foco visible en todos los controles.
- Formulario con `label`, `aria-invalid` y mensajes de error asociados; un
  `aria-live` anuncia el número de campos por corregir.
- Modal con `<dialog>` nativo: cierra con `Esc` y devuelve el foco.
- Animaciones de 160–800 ms según el tipo y respeto total a
  `prefers-reduced-motion`.
- Contraste revisado en ambos temas (texto secundario ≥ 5.5:1); navegación
  completa por teclado y objetivos táctiles de 44 px en los controles de icono.
- Retícula de 12 columnas en escritorio, 1–2 columnas en móvil; contenedor de 1,200 px.

## Desplegar

El build es estático (`dist/`), con `base: "./"` para que funcione igual en la
raíz del dominio o en una subruta.

```bash
npm run build
```

- **Netlify / Vercel:** comando `npm run build`, carpeta de salida `dist`.
- **GitHub Pages:** publica `dist/` en la rama `gh-pages`.

---

## Detalle técnico

```text
src/
  data/site.js              ← todo el contenido editable
  lib/gsap.js               ← registro de plugins y ajustes de ScrollTrigger
  lib/motion.js             ← duraciones, curvas y orígenes de entrada
  hooks/useAnimacionesPagina.js ← revelados, titulares, paralaje e inclinación
  hooks/useHeroAnimations.js    ← coreografía de la portada
  hooks/useTheme.js         ← tema claro/oscuro + persistencia
  components/
    Nav.jsx                 ← navegación fija, menú móvil, indicador activo
    Hero.jsx                ← portada, intro y geometría ambiental
    Servicios.jsx           ← cuatro tarjetas de servicio
    Precios.jsx             ← tabla de rangos orientativos
    Proyectos.jsx           ← tarjetas + apertura del modal
    ProjectDialog.jsx       ← detalle accesible en <dialog>
    ProjectMockup.jsx       ← miniaturas: captura real + mockup SVG de respaldo
    SobreMi.jsx             ← presentación y proceso de trabajo
    Tecnologias.jsx         ← grupos de herramientas
    Contacto.jsx            ← formulario validado y canales
    Footer.jsx              ← pie, aviso de privacidad
    ui/                     ← Iconos, Reveal, SectionHeading, BarridoPantalla, Fragmentos
  index.css                 ← paleta, tokens de movimiento y utilidades
```

Documento de trabajo: este portafolio es el MVP del §13 del plan. Las páginas
individuales de proyecto, artículos y testimonios verificables quedan para una
segunda etapa, cuando exista una necesidad real.
