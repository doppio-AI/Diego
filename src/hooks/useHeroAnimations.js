import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Coreografía del Hero (§2–§4 del encargo).
 *
 * Todo se construye con `.from()`, así que el estado natural del DOM es el
 * estado final: si el JavaScript falla o la animación no llega a correr, el
 * contenido se ve igual. No hay estilos iniciales ocultos en CSS.
 *
 * Parámetros centralizados aquí para poder ajustar el ritmo sin tocar el JSX.
 */
export const HERO_MOVIMIENTO = {
    apertura: {
    decor: { duracion: 0.55, ease: "power2.out" },
    linea: { duracion: 0.5, stagger: 0.09, ease: "power3.inOut", solape: "<0.05" },
  },
  contenido: {
    etiqueta: { y: 12, duracion: 0.45, ease: "power3.out", solape: "-=0.32" },
    palabra: {
      desde: 108, // % de su propia altura: sube desde dentro de la máscara
      inclinacion: 6,
      duracion: 0.7,
      stagger: 0.045,
      ease: "power4.out",
      solape: "-=0.34",
    },
    texto: { y: 14, duracion: 0.5, ease: "power3.out", solape: "-=0.44" },
    accion: {
      y: 12,
      escala: 0.98,
      duracion: 0.42,
      stagger: 0.07,
      ease: "power3.out",
      solape: "-=0.31",
    },
    detalle: { y: 10, duracion: 0.35, stagger: 0.05, ease: "power3.out", solape: "-=0.26" },
    chip: { y: 8, duracion: 0.3, stagger: 0.03, ease: "power3.out", solape: "-=0.22" },
    foto: {
      y: 26,
      escala: 1.04,
      duracion: 0.9,
      ease: "power3.inOut",
      solape: "-=0.62",
    },
  },
  micro: {
    elevacion: -3,
    escala: 1.02,
    icono: 3,
    duracion: 0.18,
    ease: "power2.out",
    // fotografía del hero
    paralaje: 9,
    deriva: { escala: 1.03, duracion: 26 },
    marcoHover: 1.012,
  },
};

/* La intro se reproduce una sola vez por carga de página: evita el doble
   disparo de React StrictMode en desarrollo y que se repita al cambiar de
   tema (el árbol se remonta con key={tema}). */
let introReproducida = false;

export function reiniciarIntroHero() {
  introReproducida = false;
}

export function useHeroAnimations(raiz) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const M = HERO_MOVIMIENTO;

      /* Con movimiento reducido no se anima nada: los elementos ya están en su
         posición final porque toda la entrada se construye con `.from()`. */
      mm.add("(prefers-reduced-motion: reduce)", () => {});

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        {
          if (!introReproducida) {
            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              onComplete: () => {
                window.clearTimeout(redSeguridad);
                introReproducida = true;
              },
            });

            /* Red de seguridad: si el reloj de animación no avanza (pestaña en
               segundo plano, rAF limitado), la entrada se completa de golpe en
               lugar de dejar el contenido a medio revelar. */
            const redSeguridad = window.setTimeout(() => {
              if (tl.progress() < 1) tl.progress(1);
            }, 2600);

            tl.from('[data-hero="decor"]', {
              opacity: 0,
              duration: M.apertura.decor.duracion,
              ease: M.apertura.decor.ease,
            })
              .from(
                '[data-hero="linea"]',
                { scaleX: 0, duration: M.apertura.linea.duracion, ease: M.apertura.linea.ease },
                M.apertura.linea.solape,
              )
              .from(
                '[data-hero="etiqueta"]',
                { y: M.contenido.etiqueta.y, opacity: 0, duration: M.contenido.etiqueta.duracion },
                M.contenido.etiqueta.solape,
              )
              .from(
                '[data-hero="palabra"]',
                {
                  yPercent: M.contenido.palabra.desde,
                  skewX: M.contenido.palabra.inclinacion,
                  duration: M.contenido.palabra.duracion,
                  stagger: M.contenido.palabra.stagger,
                  ease: M.contenido.palabra.ease,
                },
                M.contenido.palabra.solape,
              )
              .from(
                '[data-hero="texto"]',
                { y: M.contenido.texto.y, opacity: 0, duration: M.contenido.texto.duracion },
                M.contenido.texto.solape,
              )
              .from(
                '[data-hero="accion"]',
                {
                  y: M.contenido.accion.y,
                  opacity: 0,
                  scale: M.contenido.accion.escala,
                  duration: M.contenido.accion.duracion,
                  stagger: M.contenido.accion.stagger,
                },
                M.contenido.accion.solape,
              )
              .from(
                '[data-hero="detalle"]',
                {
                  y: M.contenido.detalle.y,
                  opacity: 0,
                  duration: M.contenido.detalle.duracion,
                  stagger: M.contenido.detalle.stagger,
                },
                M.contenido.detalle.solape,
              )
              .from(
                '[data-hero="chip"]',
                {
                  y: M.contenido.chip.y,
                  opacity: 0,
                  duration: M.contenido.chip.duracion,
                  stagger: M.contenido.chip.stagger,
                },
                M.contenido.chip.solape,
              )
              .fromTo(
                '[data-hero="foto"]',
                {
                  clipPath: "inset(0% 0% 100% 0%)",
                  y: M.contenido.foto.y,
                  scale: M.contenido.foto.escala,
                  transformOrigin: "50% 100%",
                },
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  y: 0,
                  scale: 1,
                  duration: M.contenido.foto.duracion,
                  ease: M.contenido.foto.ease,
                },
                M.contenido.foto.solape,
              )
              .from(
                '[data-hero="foto-halo"]',
                { opacity: 0, duration: 0.5, ease: "power2.out" },
                "<",
              );
          }

          const limpiarMicro = microinteraccionesAcciones(raiz, M.micro);
          const limpiarFoto = interaccionesFoto(raiz, M.micro);
          return () => {
            limpiarMicro();
            limpiarFoto();
          };
        }
      });

      // Al desmontar o cambiar de tema se revierten tweens, listeners y matchMedia.
      return () => mm.revert();
    },
    { scope: raiz },
  );
}

/**
 * Respuesta de los botones al puntero y al foco por teclado.
 * Los valores se precomputan con quickTo: los eventos solo empujan un número,
 * no crean animaciones nuevas en cada movimiento.
 */
function microinteraccionesAcciones(raiz, micro) {
  const botones = raiz.current
    ? raiz.current.querySelectorAll('[data-hero="accion"]')
    : [];
  const desactivar = [];

  botones.forEach((boton) => {
    const icono = boton.querySelector('[data-hero="icono"]');
    const elevar = gsap.quickTo(boton, "y", { duration: micro.duracion, ease: micro.ease });
    const escalar =
      gsap.quickTo(boton, "scale", { duration: micro.duracion, ease: micro.ease });
    const moverIcono = icono
      ? gsap.quickTo(icono, "x", { duration: micro.duracion, ease: micro.ease })
      : null;

    const activar = () => {
      elevar(micro.elevacion);
      escalar(micro.escala);
      moverIcono?.(micro.icono);
    };
    const reposar = () => {
      elevar(0);
      escalar(1);
      moverIcono?.(0);
    };

    boton.addEventListener("pointerenter", activar);
    boton.addEventListener("pointerleave", reposar);
    boton.addEventListener("focus", activar);
    boton.addEventListener("blur", reposar);

    desactivar.push(() => {
      boton.removeEventListener("pointerenter", activar);
      boton.removeEventListener("pointerleave", reposar);
      boton.removeEventListener("focus", activar);
      boton.removeEventListener("blur", reposar);
      gsap.set(boton, { clearProps: "transform" });
      if (icono) gsap.set(icono, { clearProps: "transform" });
    });
  });

  return () => desactivar.forEach((fn) => fn());
}

/**
 * Fotografía del hero.
 *
 * - Deriva muy lenta (26 s) de escala: da vida sin competir con la lectura.
 * - Paralaje de puntero acotado a ±9 px, solo con puntero fino (ratón) y con
 *   los valores precomputados en `quickTo`.
 * - El marco se agranda un 1,2 % al pasar el cursor.
 *
 * Todo se revierte al desmontar: tweens, listeners y estilos en línea.
 */
function interaccionesFoto(raiz, micro) {
  const seccion = raiz.current;
  const marco = seccion?.querySelector('[data-hero="foto"]');
  const capa = seccion?.querySelector('[data-hero="foto-capa"]');
  const img = seccion?.querySelector('[data-hero="foto-img"]');
  if (!seccion || !marco || !capa || !img) return () => {};

  const deriva = gsap.to(img, {
    scale: micro.deriva.escala,
    duration: micro.deriva.duracion,
    ease: "none",
    yoyo: true,
    repeat: -1,
  });

  const agrandar = gsap.quickTo(marco, "scale", { duration: 0.35, ease: "power2.out" });
  const alEntrarMarco = () => agrandar(micro.marcoHover);
  const alSalirMarco = () => agrandar(1);

  marco.addEventListener("pointerenter", alEntrarMarco);
  marco.addEventListener("pointerleave", alSalirMarco);

  /* El paralaje solo tiene sentido con ratón o trackpad. */
  const punteroFino =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: fine)").matches;

  let moverX = null;
  let moverY = null;
  const alMover = (evento) => {
    const caja = seccion.getBoundingClientRect();
    const rx = (evento.clientX - caja.left) / caja.width - 0.5;
    const ry = (evento.clientY - caja.top) / caja.height - 0.5;
    moverX(rx * micro.paralaje * 2);
    moverY(ry * micro.paralaje * 2);
  };
  const alSalirSeccion = () => {
    moverX(0);
    moverY(0);
  };

  if (punteroFino) {
    moverX = gsap.quickTo(capa, "x", { duration: 0.7, ease: "power2.out" });
    moverY = gsap.quickTo(capa, "y", { duration: 0.7, ease: "power2.out" });
    seccion.addEventListener("pointermove", alMover);
    seccion.addEventListener("pointerleave", alSalirSeccion);
  }

  return () => {
    deriva.kill();
    marco.removeEventListener("pointerenter", alEntrarMarco);
    marco.removeEventListener("pointerleave", alSalirMarco);
    if (punteroFino) {
      seccion.removeEventListener("pointermove", alMover);
      seccion.removeEventListener("pointerleave", alSalirSeccion);
    }
    gsap.set([marco, capa, img], { clearProps: "transform,clipPath" });
  };
}
