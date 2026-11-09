import { TECH_GROUPS } from "../data/site.js";
import { Reveal } from "./ui/Reveal.jsx";
import { Fragmentos } from "./ui/Fragmentos.jsx";
import { SectionHeading } from "./ui/SectionHeading.jsx";

export function Tecnologias() {
  return (
    <section
      id="tecnologias"
      aria-labelledby="tecnologias-titulo"
      className="relative scroll-mt-24 overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <Fragmentos variante="c" />

      <div className="container-page">
        <SectionHeading
          id="tecnologias-titulo"
          eyebrow="Tecnologías"
          title="Herramientas que realmente uso"
          description="Agrupadas por área, sin barras de porcentaje inventadas. Si algo no está aquí, probablemente no debería prometerlo."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TECH_GROUPS.map((group, index) => (
            <Reveal
              key={group.titulo}
              desde="izquierda"
              delay={index * 0.06}
              className="rounded-[14px] border border-line bg-surface/50 p-5 transition-colors duration-200 hover:border-electric/40"
            >
              <h3 className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.16em] text-acento uppercase">
                <span
                  aria-hidden="true"
                  className="inline-block h-px w-6 bg-gradient-to-r from-electric to-transparent"
                />
                {group.titulo}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-line bg-ink-deep/60 px-2.5 py-1 text-[0.78rem] text-fg/85 transition-colors duration-150 hover:border-electric/40 hover:text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <Reveal
            delay={0.34}
            className="flex flex-col justify-center rounded-[14px] border border-dashed border-line bg-transparent p-5"
          >
            <p className="font-mono text-[0.68rem] tracking-[0.16em] text-muted/90 uppercase">
              siempre aprendiendo
            </p>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">
              Si tu proyecto necesita una herramienta que no está en la lista, lo
              investigo antes de aceptar el trabajo y te digo con claridad si
              puedo o no puedo resolverlo.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

