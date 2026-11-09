import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "../lib/gsap.js";
import { DISPARO, DUR, EASE, origen } from "../lib/motion.js";

/**
 * Animaciones de toda la página, en un solo sitio.
 *
 * Se apoya en atributos del DOM para que los componentes no sepan nada de
 * animación:
 *   [data-reveal="abajo|izquierda|derecha|escala"]  aparición al entrar
 *   [data-retraso="0.12"]                           retardo extra dentro del lote
 *   [data-titulo]                                   titular revelado por líneas
 *   [data-paralaje="40"]                            desplazamiento ligado al scroll
 *   [data-tarjeta]                                  inclinación con el puntero
 *   [data-linea-proceso]                            línea que se dibuja al avanzar
 *
 * Todo se construye con `from`/`set` + `to`, y con movimiento reducido no se
 * aplica ningún estado inicial: el contenido queda visible.
 */
export function useAnimacionesPagina(raiz, clave = null) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const limpiezas = [];
      let vivoGlobal = true;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const bloque = raiz.current;
        if (!bloque) return;

        /* 1. Aparición de bloques al entrar en pantalla ------------------- */
        const items = gsap.utils.toArray("[data-reveal]", bloque);
        if (items.length) {
          gsap.set(items, {
            opacity: 0,
            x: (i, el) => origen(el.dataset.reveal).x,
            y: (i, el) => origen(el.dataset.reveal).y,
            skewX: (i, el) => origen(el.dataset.reveal).skewX,
            scale: (i, el) => (el.dataset.reveal === "escala" ? 0.96 : 1),
          });

          const lotes = ScrollTrigger.batch(items, {
            start: DISPARO,
            once: true,
            onEnter: (lote) =>
              gsap.to(lote, {
                opacity: 1,
                x: 0,
                y: 0,
                skewX: 0,
                scale: 1,
                duration: DUR.base,
                ease: EASE.salida,
                overwrite: true,
                stagger: (i, el) =>
                  (parseFloat(el.dataset.retraso) || 0) + i * 0.05,
              }),
          });
          limpiezas.push(() => lotes.forEach((t) => t.kill()));

          /* Red de seguridad: si un disparo no llega (pestaña en segundo
             plano, recálculo tardío), lo que ya está en pantalla se revela
             igualmente; lo que queda por debajo conserva su turno. */
          const respaldo = window.setTimeout(() => {
            const alto = window.innerHeight;
            items.forEach((el) => {
              const caja = el.getBoundingClientRect();
              const enPantalla = caja.top < alto * 0.95 && caja.bottom > 0;
              if (enPantalla && gsap.getProperty(el, "opacity") < 0.99) {
                gsap.to(el, {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  skewX: 0,
                  scale: 1,
                  duration: DUR.corto,
                  overwrite: true,
                });
              }
            });
          }, 3000);
          limpiezas.push(() => window.clearTimeout(respaldo));
        }

        /* 2. Titulares revelados por líneas ------------------------------ */
        /* SplitText mide los saltos de línea reales: si se parte el texto
           antes de que carguen las fuentes, las líneas quedan mal cortadas.
           Por eso se espera a `document.fonts.ready`. */
        let vivo = () => vivoGlobal;

        const partirTitular = (titular) => {
          if (!vivo() || titular.dataset.partido === "si") return;
          titular.dataset.partido = "si";

          const split = SplitText.create(titular, {
            type: "lines",
            mask: "lines",
            linesClass: "linea-mascara",
          });

          const tween = gsap.from(split.lines, {
            yPercent: 100,
            skewX: -5,
            duration: DUR.largo,
            ease: EASE.seca,
            stagger: 0.08,
            scrollTrigger: { trigger: titular, start: "top 88%", once: true },
          });

          limpiezas.push(() => {
            tween.scrollTrigger?.kill();
            tween.kill();
            split.revert();
            delete titular.dataset.partido;
          });
        };

        const partirTitulos = () => {
          gsap.utils.toArray("[data-titulo]", bloque).forEach(partirTitular);
          ScrollTrigger.refresh();
        };

        const fuentes = document.fonts;
        if (fuentes?.status === "loaded") {
          partirTitulos();
        } else if (fuentes?.ready) {
          fuentes.ready.then(() => vivo() && partirTitulos()).catch(() => {});
          /* Red de seguridad: si `fonts.ready` no resuelve, se parte igual. */
          const respaldo = window.setTimeout(partirTitulos, 1600);
          limpiezas.push(() => window.clearTimeout(respaldo));
        } else {
          partirTitulos();
        }

        /* 3. Paralaje de la geometría ambiental ------------------------- */
        gsap.utils.toArray("[data-paralaje]", bloque).forEach((pieza) => {
          const fuerza = parseFloat(pieza.dataset.paralaje) || 40;
          const tween = gsap.to(pieza, {
            y: -fuerza,
            ease: "none",
            scrollTrigger: {
              trigger: pieza.parentElement?.closest("section") || pieza,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          limpiezas.push(() => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
        });

        /* 4. Línea del proceso que se dibuja al bajar -------------------- */
        const linea = bloque.querySelector("[data-linea-proceso]");
        if (linea) {
          const tween = gsap.fromTo(
            linea,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "50% 0%",
              scrollTrigger: {
                trigger: linea.parentElement,
                start: "top 75%",
                end: "bottom 60%",
                scrub: 0.5,
              },
            },
          );
          limpiezas.push(() => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
        }

        /* 5. Inclinación de tarjetas con el puntero ---------------------- */
        const punteroFino =
          typeof window.matchMedia === "function" &&
          window.matchMedia("(pointer: fine)").matches;

        if (punteroFino) {
          gsap.utils.toArray("[data-tarjeta]", bloque).forEach((tarjeta) => {
            const inclinaX = gsap.quickTo(tarjeta, "rotationX", {
              duration: 0.5,
              ease: "power2.out",
            });
            const inclinaY = gsap.quickTo(tarjeta, "rotationY", {
              duration: 0.5,
              ease: "power2.out",
            });

            const alMover = (evento) => {
              const caja = tarjeta.getBoundingClientRect();
              const rx = (evento.clientY - caja.top) / caja.height - 0.5;
              const ry = (evento.clientX - caja.left) / caja.width - 0.5;
              inclinaX(rx * -5);
              inclinaY(ry * 5);
            };
            const alSalir = () => {
              inclinaX(0);
              inclinaY(0);
            };

            tarjeta.addEventListener("pointermove", alMover);
            tarjeta.addEventListener("pointerleave", alSalir);
            limpiezas.push(() => {
              tarjeta.removeEventListener("pointermove", alMover);
              tarjeta.removeEventListener("pointerleave", alSalir);
              gsap.set(tarjeta, { clearProps: "transform" });
            });
          });
        }

        /* Las fuentes y la imagen del hero cambian la altura de la página:
           se recalcula una vez asentado el contenido. */
        const alCargar = () => ScrollTrigger.refresh();
        window.addEventListener("load", alCargar);
        const temporizador = window.setTimeout(alCargar, 1200);

        limpiezas.push(() => {
          window.removeEventListener("load", alCargar);
          window.clearTimeout(temporizador);
        });
      });

      return () => {
        vivoGlobal = false;
        limpiezas.forEach((fn) => fn());
        mm.revert();
      };
    },
    { scope: raiz, dependencies: [clave] },
  );
}
