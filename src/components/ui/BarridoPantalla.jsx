import { useEffect, useRef, useState } from "react";
import { escucharBarrido } from "../../lib/barrido.js";
import { gsap } from "../../lib/gsap.js";
import { BARRIDO, DUR, EASE } from "../../lib/motion.js";

/**
 * Barrido diagonal de pantalla.
 *
 * Tres tiempos, no un solo desplazamiento:
 *
 *   1. entra y cubre la pantalla (acelera y frena)
 *   2. la pantalla queda azul un instante
 *   3. se cierra hacia la derecha y sale
 *
 * La banda mide más que la ventana (`--margen` a cada lado) para que la
 * inclinación de 16° no deje triángulos sin cubrir, y ese margen crece con la
 * altura: en un móvil alto la inclinación desplaza más píxeles.
 *
 * Cada borde lleva su filo luminoso: el derecho se ve al entrar, el izquierdo
 * al cerrar. No son un adorno: marcan por dónde va el corte.
 *
 * Con movimiento reducido no llega a dibujarse.
 */
export function BarridoPantalla() {
  const [disparo, setDisparo] = useState(0);
  const bandaRef = useRef(null);
  const activoRef = useRef(false);

  useEffect(
    () =>
      escucharBarrido(() => {
        /* Un barrido a la vez: si llega otro mientras se cierra, se ignora. */
        if (activoRef.current) return;
        activoRef.current = true;
        setDisparo((n) => n + 1);
      }),
    [],
  );

  useEffect(() => {
    if (!disparo) return;

    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const banda = bandaRef.current;
    if (reducido || !banda) {
      activoRef.current = false;
      setDisparo(0);
      return;
    }

    const terminar = () => {
      activoRef.current = false;
      setDisparo(0);
    };

    const pulso = banda.querySelector("[data-pulso]");

    const tl = gsap.timeline({ onComplete: terminar });

    /* Movimiento en **píxeles**, no en porcentajes: el ancho de la banda cambia
       con la ventana y con los porcentajes GSAP acababa reaplicando el estado
       inicial, dejando el telón fuera de pantalla durante toda la espera. */
    const ancho = banda.offsetWidth;

    tl.fromTo(
      banda,
      { x: -ancho, skewX: -16 },
      {
        x: 0,
        skewX: -16,
        duration: BARRIDO.entrada,
        ease: "power3.out",
        immediateRender: true,
      },
    )
      /* 2. El telón se queda abajo. Un latido muy leve recorre el azul para
         que la espera no parezca una pantalla congelada. */
      .to({}, { duration: BARRIDO.cubre })
      /* 3. Se abre hacia la derecha y descubre la sección nueva. */
      .fromTo(
        banda,
        { x: 0 },
        {
          x: ancho,
          duration: BARRIDO.cierre,
          ease: EASE.bidireccional,
          immediateRender: false,
        },
        BARRIDO.entrada + BARRIDO.cubre,
      );

    /* El latido va del todo sincronizado con la espera: empieza cuando el
       telón termina de bajar y acaba justo cuando empieza a subir. */
    if (pulso) {
      tl.to(
        pulso,
        {
          opacity: 1,
          duration: BARRIDO.cubre / 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        BARRIDO.entrada,
      );
    }

    /* Si el reloj de animación no avanza, el barrido se retira igualmente. */
    const respaldo = window.setTimeout(terminar, (DUR.barrido + 0.6) * 1000);

    /* Solo en desarrollo: permite inspeccionar la timeline desde la consola.
       En producción `import.meta.env.DEV` es `false` y esto no se compila. */
    if (import.meta.env.DEV) {
      window.__barrido = { tl, banda, pulso };
    }

    return () => {
      tl.kill();
      window.clearTimeout(respaldo);
    };
  }, [disparo]);

  if (!disparo) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
    >
      <div
        ref={bandaRef}
        data-banda
        className="absolute inset-y-0"
        style={{
          "--margen-banda": "max(18vw, 20vh)",
          left: "calc(-1 * var(--margen-banda))",
          width: "calc(100% + 2 * var(--margen-banda))",
          background:
            "linear-gradient(100deg, #2563eb 0%, #1d4ed8 55%, #0284c7 100%)",
          transform: "translateX(-100%) skewX(-16deg)",
          willChange: "transform",
        }}
      >
        {/* Filo de ataque: se ve al entrar */}
        <span
          className="absolute inset-y-0 -right-[3px] w-[3px]"
          style={{
            background: "var(--acento)",
            boxShadow:
              "0 0 22px 3px color-mix(in oklab, var(--acento) 70%, transparent)",
          }}
        />
        {/* Filo de cierre: se ve al salir */}
        <span
          className="absolute inset-y-0 -left-[3px] w-[3px]"
          style={{
            background: "var(--acento)",
            boxShadow:
              "0 0 22px 3px color-mix(in oklab, var(--acento) 70%, transparent)",
          }}
        />
        <span
          className="absolute inset-y-0 -right-[9px] w-px"
          style={{ background: "rgb(255 255 255 / 0.45)" }}
        />

        {/* Latido durante la espera: un brillo tenue que sube y baja */}
        <span
          data-pulso
          className="absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(58% 62% at 50% 42%, rgb(255 255 255 / 0.16), transparent 72%)",
          }}
        />
      </div>
    </div>
  );
}
