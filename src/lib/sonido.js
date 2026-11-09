import { useSyncExternalStore } from "react";

/**
 * Sonido de interfaz, sintetizado con Web Audio (sin archivos ni licencias).
 *
 * - Apagado por defecto y silenciado hasta que el visitante lo active.
 * - Se crea el AudioContext al primer uso real (gesto del usuario).
 * - Sonidos cortos y suaves: un clic de navegación y dos tonos de apertura/cierre.
 */

const CLAVE = "dr-sonido";

let contexto = null;
let activo = leerPreferencia();
const suscriptores = new Set();

function leerPreferencia() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CLAVE) === "si";
  } catch {
    return false;
  }
}

function guardarPreferencia(valor) {
  try {
    window.localStorage.setItem(CLAVE, valor ? "si" : "no");
  } catch {
    /* almacenamiento no disponible */
  }
}

function audio() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!contexto) contexto = new Ctor();
  if (contexto.state === "suspended") contexto.resume();
  return contexto;
}

function tono(ctx, { frec, hasta, tipo = "triangle", vol, dur, retardo = 0 }) {
  const t0 = ctx.currentTime + retardo;
  const osc = ctx.createOscillator();
  const gan = ctx.createGain();

  osc.type = tipo;
  osc.frequency.setValueAtTime(frec, t0);
  if (hasta) osc.frequency.exponentialRampToValueAtTime(hasta, t0 + dur * 0.9);

  gan.gain.setValueAtTime(0.0001, t0);
  gan.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
  gan.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(gan);
  gan.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Reproduce un sonido si el visitante lo ha activado. */
export function sonar(tipo = "clic") {
  if (!activo) return;
  const ctx = audio();
  if (!ctx) return;

  switch (tipo) {
    case "abrir":
      tono(ctx, { frec: 520, hasta: 780, vol: 0.05, dur: 0.13 });
      tono(ctx, { frec: 780, hasta: 1040, vol: 0.035, dur: 0.1, retardo: 0.06 });
      break;
    case "cerrar":
      tono(ctx, { frec: 620, hasta: 420, vol: 0.045, dur: 0.12 });
      break;
    default:
      tono(ctx, { frec: 1180, hasta: 760, vol: 0.05, dur: 0.07 });
  }
}

export function estadoSonido() {
  return activo;
}

export function suscribirSonido(handler) {
  suscriptores.add(handler);
  return () => suscriptores.delete(handler);
}

export function alternarSonido() {
  activo = !activo;
  guardarPreferencia(activo);
  suscriptores.forEach((handler) => handler(activo));
  if (activo) sonar("abrir");
}

/** Estado reactivo del sonido (compartido por todos los componentes). */
export function useSonido() {
  return useSyncExternalStore(suscribirSonido, estadoSonido, estadoSonido);
}
