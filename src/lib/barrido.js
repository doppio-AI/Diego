/**
 * Barrido de pantalla compartido.
 *
 * Cualquier componente puede pedirlo sin conocer al que lo dibuja: se emite un
 * evento y <BarridoPantalla /> lo escucha.
 */

import { DUR } from "./motion.js";

const EVENTO = "dr:barrido";

/* Mientras hay un barrido en curso no se encola otro: quien pregunte recibe
   `false` y navega al instante, sin quedarse esperando un plano que no va a
   salir. Por eso la espera cubre la animación completa. */
const ESPERA_MINIMA = DUR.barrido * 1000 + 60;

let ultimo = 0;

/**
 * Pide un barrido.
 * @returns {boolean} `true` si el barrido se ha pedido (y va a reproducirse).
 */
export function pedirBarrido(origen = "nav") {
  if (typeof window === "undefined") return false;

  const ahora = Date.now();
  if (ahora - ultimo < ESPERA_MINIMA) return false;
  ultimo = ahora;

  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { origen } }));
  return true;
}

export function escucharBarrido(handler) {
  if (typeof window === "undefined") return () => {};

  const listener = (event) => handler(event.detail);
  window.addEventListener(EVENTO, listener);
  return () => window.removeEventListener(EVENTO, listener);
}
