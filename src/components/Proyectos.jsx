import { useState } from "react";
import { PROJECTS, PROJECTS_NOTE } from "../data/site.js";
import { ProjectDialog } from "./ProjectDialog.jsx";
import { ProjectThumbnail } from "./ProjectMockup.jsx";
import { Icon } from "./ui/Icons.jsx";
import { Reveal } from "./ui/Reveal.jsx";
import { Fragmentos } from "./ui/Fragmentos.jsx";
import { SectionHeading } from "./ui/SectionHeading.jsx";

export function Proyectos() {
  const [selected, setSelected] = useState(null);

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-titulo"
      className="relative scroll-mt-24 overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <Fragmentos variante="b" />

      <div className="container-page">
        <SectionHeading
          id="proyectos-titulo"
          eyebrow="Proyectos"
          title="Tres productos reales, en producción"
          description="Web, e-commerce y una plataforma con app móvil. Cada ficha explica el problema del negocio, las decisiones técnicas y el resultado, con captura del sitio publicado."
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <Reveal
              as="li"
              key={project.id}
              desde="izquierda"
              delay={index * 0.07}
              className="group relative flex flex-col overflow-hidden rounded-[14px] border border-line bg-surface/50 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-electric/45 hover:shadow-[0_18px_40px_-26px_rgba(37,99,235,0.65)]"
            >
              {/* Halo superior que se expande al pasar el cursor (§5.E) */}
              <span
                aria-hidden="true"
                className="hairline-glow absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-within:scale-x-100"
              />

              <div className="overflow-hidden p-3 pb-0">
                <div className="overflow-hidden rounded-[12px]">
                  <div className="transition-transform duration-300 group-hover:scale-[1.02] group-focus-within:scale-[1.02]">
                    <ProjectThumbnail project={project} />
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-electric/35 bg-electric/10 px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.06em] text-electric-bright uppercase">
                    {project.categoria}
                  </span>
                  <span className="rounded-md border border-acento/25 bg-acento/8 px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.06em] text-acento uppercase">
                    {project.tipo}
                  </span>
                </div>

                <h3 className="mt-3.5 text-[1.05rem] font-semibold text-fg">
                  {project.nombre}
                </h3>
                <p className="mt-2 flex-1 text-[0.85rem] leading-relaxed text-muted">
                  {project.resumen}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-line/80 bg-ink-deep/60 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(project)}
                  aria-haspopup="dialog"
                  className="mt-5 inline-flex items-center justify-between gap-2 rounded-[10px] border border-line px-3.5 py-2.5 text-[0.82rem] font-medium text-fg transition-colors duration-150 hover:border-electric/50 hover:bg-surface-2"
                >
                  Ver detalle del proyecto
                  <Icon
                    name="arrowUpRight"
                    className="size-4 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.08}>
          <p className="mt-6 flex items-start gap-2.5 rounded-[10px] border border-line/70 bg-surface/30 px-4 py-3.5 text-[0.8rem] leading-relaxed text-muted">
            <Icon name="sparkle" className="mt-0.5 size-4 shrink-0 text-acento" />
            {PROJECTS_NOTE}
          </p>
        </Reveal>
      </div>

      <ProjectDialog project={selected} onDismiss={() => setSelected(null)} />
    </section>
  );
}
