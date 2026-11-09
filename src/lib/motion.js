/**
 * Sistema de movimiento de la página.
 *
 * Duraciones y curvas en un solo sitio para poder ajustar el ritmo global sin
 * tocar los componentes. Las curvas son las de GSAP (`power3.out`, etc.), que
 * se pasan tal cual a los tweens.
 */

/**
 * Barrido de pantalla: el telón.
 *
 * Tres fases independientes porque el gesto se lee por tramos:
 *
 *   entrada  el telón baja y cubre la pantalla
 *   cubre    la pantalla se queda azul; aquí ocurre el cambio de sección
 *   cierre   el telón sube y descubre la sección nueva
 *
 * `cubre` es el que da la sensación de telón: con menos de ~0,6 s parece un
 * parpadeo. Es también la ventana en la que se hace el salto de sección
 * (ver `lib/navegacion.js`).
 */
export const BARRIDO = {
  entrada: 0.24,
  cubre: 2,
  cierre: 0.5,
};

export const DUR = {
  micro: 0.18, // hover y foco
  corto: 0.34, // etiquetas y detalles
  base: 0.5, // aparición de bloques
  largo: 0.9, // titulares y paneles
  barrido: BARRIDO.entrada + BARRIDO.cubre + BARRIDO.cierre, // 1,24 s
  barridoPanel: 0.5, // barrido sobre el panel del caso de estudio
};

export const EASE = {
  salida: "power3.out",
  seca: "power4.out",
  suave: "power2.out",
  bidireccional: "power3.inOut",
  rebote: "back.out(1.7)",
};

/* Orígenes de entrada admitidos por <Reveal desde="…"> */
const ORIGENES = {
  abajo: { x: 0, y: 18, skewX: 0 },
  izquierda: { x: -26, y: 8, skewX: 3.5 },
  derecha: { x: 26, y: 8, skewX: -3.5 },
  escala: { x: 0, y: 12, skewX: 0 },
};

export const origen = (nombre = "abajo") => ORIGENES[nombre] ?? ORIGENES.abajo;

/** Punto de disparo común de los revelados al hacer scroll. */
export const DISPARO = "top 90%";
