import { SERVICES } from "../data/site.js";
import { Icon } from "./ui/Icons.jsx";
import { Reveal } from "./ui/Reveal.jsx";
import { Fragmentos } from "./ui/Fragmentos.jsx";
import { SectionHeading } from "./ui/SectionHeading.jsx";

export function Servicios() {
  return (
    <section
      id="servicios"
      aria-labelledby="servicios-titulo"
      className="relative scroll-mt-24 overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <Fragmentos variante="a" />

      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="servicios-titulo"
            eyebrow="Servicios"
            title="Lo que puedo construir para tu negocio"
            description="Cada servicio se explica por el resultado que obtienes, no por la tecnología que uso. Si no sé si tu caso encaja, te lo digo antes de cotizar."
          />
          <Reveal delay={0.06}>
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-sm font-medium text-fg transition-colors duration-150 hover:border-electric/50 hover:bg-surface"
            >
              Cuéntame tu caso
              <Icon
                name="arrowRight"
                className="size-4 text-muted transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service, index) => (
            <Reveal
              as="li"
              key={service.id}
              desde="izquierda"
              delay={index * 0.06}
              className="group relative flex flex-col overflow-hidden rounded-[14px] border border-line bg-surface/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-electric/45 hover:bg-surface"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 size-32 rounded-full bg-electric/10 opacity-0 blur-2xl transition-opacity duration-200 group-hover:opacity-100"
              />

              <span className="mb-4 grid size-11 place-items-center rounded-[10px] border border-line bg-ink-deep/70 text-electric-bright transition-colors duration-200 group-hover:border-electric/40 group-hover:text-acento">
                <Icon name={service.icon} className="size-5" />
              </span>

              <h3 className="text-[1.02rem] font-semibold text-fg">
                {service.titulo}
              </h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                {service.resumen}
              </p>

              <ul className="mt-4 flex flex-col gap-2 border-t border-line/70 pt-4">
                {service.incluye.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[0.8rem] leading-snug text-muted"
                  >
                    <Icon
                      name="check"
                      className="mt-0.5 size-3.5 shrink-0 text-acento"
                      strokeWidth={2.2}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-4 font-mono text-[0.72rem] tracking-tight text-electric-bright">
                {service.desde}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.08}>
          <p className="mt-6 flex items-start gap-2.5 text-[0.8rem] leading-relaxed text-muted/90">
            <Icon name="check" className="mt-0.5 size-4 shrink-0 text-acento" />
            Toda propuesta incluye por escrito qué está incluido, qué no, el
            tiempo estimado y las condiciones de pago.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
