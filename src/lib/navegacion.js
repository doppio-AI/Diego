import { pedirBarrido } from "./barrido.js";
import { BARRIDO } from "./motion.js";

/**
 * Navegación entre secciones sincronizada con el barrido de pantalla.
 *
 * Antes el ancla saltaba al pulsar y el barrido llegaba después: el salto y
 * todas las animaciones de la sección ocurrían **detrás** del plano azul, así
 * que al abrirse no quedaba nada que ver. Ahora el salto ocurre mientras la
 * pantalla está cubierta, justo antes de que el plano empiece a abrirse: al
 * descubrirse, la sección entra con sus animaciones.
 *
 * Si el barrido no puede reproducirse (movimiento reducido, o ya hay uno en
 * curso), se navega al instante sin retraso: el clic nunca se queda sin efecto.
 */

/* Temporizador de la navegación pendiente (solo hay una a la vez). */
let temporizador = 0;

/** Lleva el foco al destino para que el tabulador continúe desde ahí. */
function enfocar(destino) {
  if (!destino.hasAttribute("tabindex")) {
    destino.setAttribute("tabindex", "-1");
  }
  destino.focus({ preventScroll: true });
}

/** Salta a la sección sin animación de scroll: lo tapa el plano azul. */
function aterrizar(hash, destino) {
  if (window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
  }

  const raiz = document.documentElement;
  const previo = raiz.style.scrollBehavior;
  raiz.style.scrollBehavior = "auto";
  destino.scrollIntoView({ block: "start", behavior: "instant" });
  raiz.style.scrollBehavior = previo;

  enfocar(destino);
}

export function irASeccion(hash, destino = null) {
  if (typeof window === "undefined") return;

  let objetivo = destino;
  if (!objetivo) {
    try {
      objetivo = document.querySelector(hash);
    } catch {
      objetivo = null;
    }
  }
  /* Si el destino no existe, que el navegador haga lo de siempre. */
  if (!objetivo) return;

  /* Solo hay una intención de navegación viva: si llega otra, la anterior
     queda cancelada (si no, un clic rápido se deshacía solo un segundo
     después). */
  if (temporizador) {
    window.clearTimeout(temporizador);
    temporizador = 0;
  }

  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducido) {
    aterrizar(hash, objetivo);
    return;
  }

  if (!pedirBarrido("ancla")) {
    aterrizar(hash, objetivo);
    return;
  }

  /* La pantalla queda cubierta al terminar la entrada; el salto se hace justo
     antes de que el plano empiece a abrirse. */
  /* El salto se hace con el telón abajo, un instante antes de que empiece a
     subir: el cambio de pantalla queda tapado y la sección nueva entra con sus
     animaciones justo cuando se descubre. */
  const espera = Math.max((BARRIDO.entrada + BARRIDO.cubre - 0.15) * 1000, 0);
  temporizador = window.setTimeout(() => {
    temporizador = 0;
    aterrizar(hash, objetivo);
  }, espera);
}

/**
 * Intercepta los enlaces internos (`href="#…"`) de toda la página.
 *
 * Se hace en un solo sitio a propósito: había llamadas al barrido repartidas
 * por los componentes y bastaba olvidar una para que un enlace saltara sin
 * gesture. Los enlaces con `data-sin-barrido` (por ejemplo "Saltar al
 * contenido") quedan fuera: la navegación por teclado tiene que ser inmediata.
 */
export function interceptarAnclas() {
  if (typeof document === "undefined") return () => {};

  const alClic = (evento) => {
    if (evento.defaultPrevented) return;
    if (evento.button !== 0) return;
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) {
      return;
    }

    const nodo = evento.target;
    const enlace =
      nodo instanceof Element ? nodo.closest('a[href^="#"]') : null;
    if (!enlace || enlace.hasAttribute("data-sin-barrido")) return;

    const hash = enlace.getAttribute("href");
    if (!hash || hash === "#") return;

    let destino = null;
    try {
      destino = document.querySelector(hash);
    } catch {
      destino = null;
    }
    if (!destino) return;

    evento.preventDefault();
    irASeccion(hash, destino);
  };

  document.addEventListener("click", alClic);
  return () => document.removeEventListener("click", alClic);
}
