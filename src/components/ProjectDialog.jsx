import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../lib/gsap.js";
import { DUR, EASE } from "../lib/motion.js";
import { sonar } from "../lib/sonido.js";
import { Icon } from "./ui/Icons.jsx";

function DetailList({ titulo, items, icon = "check" }) {
  return (
    <section data-dialogo-bloque>
      <h3 className="font-mono text-[0.68rem] tracking-[0.16em] text-acento uppercase">
        {titulo}
      </h3>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-muted"
          >
            <Icon
              name={icon}
              className="mt-1 size-3.5 shrink-0 text-electric-bright"
              strokeWidth={2.2}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TextBlock({ titulo, children }) {
  return (
    <section className="rounded-[10px] border border-line/70 bg-ink-deep/50 p-4">
      <h3 className="font-mono text-[0.68rem] tracking-[0.16em] text-acento uppercase">
        {titulo}
      </h3>
      <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">{children}</p>
    </section>
  );
}

export function ProjectDialog({ project, onDismiss }) {
  const dialogRef = useRef(null);
  const panelRef = useRef(null);
  const bandaRef = useRef(null);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project && !dialog.open) {
      setSaliendo(false);
      dialog.showModal();
      document.body.style.overflow = "hidden";
      sonar("abrir");
    }

    if (!project && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  /* Entrada del panel: opacidad + escala y un barrido diagonal, con los
     bloques de contenido escalonados. */
  useGSAP(
    () => {
      if (!project) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.salida } });

        tl.from(panelRef.current, {
          opacity: 0,
          y: 18,
          scale: 0.985,
          duration: DUR.corto,
        })
          .from(
            bandaRef.current,
            { xPercent: -118, skewX: -16, duration: DUR.barridoPanel, ease: EASE.bidireccional },
            0,
          )
          .from(
            "[data-dialogo-bloque]",
            { opacity: 0, y: 10, duration: DUR.corto, stagger: 0.045, ease: EASE.suave },
            0.1,
          );

        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [project], scope: dialogRef },
  );

  /* Cierre con salida animada: el panel se va antes de cerrar el diálogo */
  const cerrar = () => {
    if (saliendo) return;

    const reducido =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducido || !panelRef.current) {
      onDismiss();
      return;
    }

    setSaliendo(true);
    sonar("cerrar");

    /* Si el reloj de animación no avanza (pestaña en segundo plano), el
       temporizador cierra igualmente: el diálogo nunca se queda atascado. */
    let cerrado = false;
    const terminar = () => {
      if (cerrado) return;
      cerrado = true;
      onDismiss();
    };
    const respaldo = window.setTimeout(terminar, 320);

    gsap.to(panelRef.current, {
      opacity: 0,
      y: 12,
      scale: 0.99,
      duration: 0.16,
      ease: EASE.salida,
      onComplete: () => {
        window.clearTimeout(respaldo);
        terminar();
      },
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onDismiss}
      onCancel={(event) => {
        event.preventDefault();
        cerrar();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) cerrar();
      }}
      aria-labelledby="project-dialog-title"
      className="relative m-auto w-[min(46rem,92vw)] max-w-none overflow-hidden rounded-[16px] border border-line bg-surface p-0 text-fg backdrop:bg-scrim backdrop:backdrop-blur-sm"
    >
      {project ? (
        <div
          ref={panelRef}
          key={project.id}
          className="relative max-h-[85vh] overflow-y-auto"
        >
          {/* Barrido diagonal de entrada sobre el panel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
          >
            <div
              ref={bandaRef}
              className="absolute inset-y-0 -left-[22%] w-[144%]"
              style={{
                background:
                  "linear-gradient(100deg, #2563eb 0%, #1d4ed8 55%, #0284c7 100%)",
                transform: "translateX(-118%) skewX(-16deg)",
              }}
            />
          </div>

          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur sm:px-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-electric/40 bg-electric/10 px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.06em] text-electric-bright uppercase">
                  {project.categoria}
                </span>
                <span className="rounded-md border border-acento/30 bg-acento/10 px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.06em] text-acento uppercase">
                  {project.tipo}
                </span>
              </div>
              <h2
                id="project-dialog-title"
                className="mt-2.5 text-xl font-semibold text-fg sm:text-2xl"
              >
                {project.nombre}
              </h2>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar detalle del proyecto"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
            >
              <Icon name="close" className="size-4" />
            </button>
          </div>

          <div className="flex flex-col gap-6 px-5 py-6 sm:px-6">
            <p data-dialogo-bloque className="text-[0.95rem] leading-relaxed text-fg/85">
              {project.resumen}
            </p>

            <figure
              data-dialogo-bloque
              className="overflow-hidden rounded-[12px] border border-line/80 bg-ink-deep"
            >
              <img
                src={project.imagen}
                alt={project.imagenAlt ?? project.nombre}
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
                className="block aspect-[16/10] w-full object-cover object-top"
              />
            </figure>

            <div data-dialogo-bloque className="grid gap-3 sm:grid-cols-2">
              <TextBlock titulo="Problema">{project.problema}</TextBlock>
              <TextBlock titulo="Objetivo">{project.objetivo}</TextBlock>
            </div>

            <DetailList titulo="Funciones principales" items={project.funciones} />
            <DetailList
              titulo="Decisiones técnicas"
              items={project.decisiones}
              icon="code"
            />

            <section data-dialogo-bloque>
              <h3 className="font-mono text-[0.68rem] tracking-[0.16em] text-acento uppercase">
                Tecnologías utilizadas
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-line bg-ink-deep/60 px-2.5 py-1 font-mono text-[0.7rem] text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            <div data-dialogo-bloque className="grid gap-3 sm:grid-cols-2">
              <TextBlock titulo="Reto principal">{project.retos}</TextBlock>
              <TextBlock titulo="Aprendizaje">{project.aprendizajes}</TextBlock>
            </div>

            <p data-dialogo-bloque className="rounded-[10px] border border-line/70 bg-ink-deep/40 px-4 py-3 text-[0.78rem] leading-relaxed text-muted">
              <strong className="font-semibold text-fg/90">Nota:</strong>{" "}
              proyecto real publicado y verificado en producción. El código y las
              credenciales de acceso se comparten con autorización del cliente;
              aquí se muestran solo capturas públicas del sitio.
            </p>

            <div data-dialogo-bloque className="flex flex-wrap gap-3 border-t border-line pt-5">
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-electric px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-electric-bright"
                >
                  Ver sitio en vivo
                  <Icon name="arrowUpRight" className="size-4" />
                </a>
              ) : null}
              <a
                href="#contacto"
                onClick={cerrar}
                className={
                  project.demoUrl
                    ? "inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2"
                    : "inline-flex items-center gap-2 rounded-[10px] bg-electric px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-electric-bright"
                }
              >
                Quiero algo parecido
                <Icon name="arrowRight" className="size-4" />
              </a>
              <button
                type="button"
                onClick={cerrar}
                className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
