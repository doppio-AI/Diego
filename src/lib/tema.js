import { useSyncExternalStore } from "react";

/**
 * Tema de la interfaz, en un almacén externo.
 *
 * Vive fuera de React porque `App` necesita el valor para remontar el árbol
 * al cambiar de tema: Chrome a veces conserva el estilo calculado (y la
 * pintura) de los nodos que ya existían, y solo los nodos nuevos reciben los
 * colores del tema vigente. Remontar es la única forma fiable de que todas
 * las superficies se pinten con la paleta correcta.
 */

const CLAVE = "dr-tema";
const META_TEMA = { claro: "#f4f7fc", oscuro: "#101827" };

const oyentes = new Set();

function leer() {
  if (typeof window === "undefined") return "claro";
  try {
    return window.localStorage.getItem(CLAVE) === "oscuro" ? "oscuro" : "claro";
  } catch {
    return "claro";
  }
}

let actual = leer();

export function estadoTema() {
  return actual;
}

export function suscribirTema(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}

export function aplicarTema(tema) {
  const root = document.documentElement;
  const oscuro = tema === "oscuro";

  root.dataset.theme = oscuro ? "dark" : "light";
  root.style.colorScheme = oscuro ? "dark" : "light";

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", META_TEMA[tema]);

  try {
    window.localStorage.setItem(CLAVE, tema);
  } catch {
    /* almacenamiento no disponible */
  }
}

export function alternarTema() {
  actual = actual === "oscuro" ? "claro" : "oscuro";
  aplicarTema(actual);
  oyentes.forEach((oyente) => oyente());
}

/** Estado reactivo del tema. */
export function useTema() {
  return useSyncExternalStore(suscribirTema, estadoTema, estadoTema);
}
