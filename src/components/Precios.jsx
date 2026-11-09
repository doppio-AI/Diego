import { PRICES, PRICES_NOTE } from "../data/site.js";
import { Icon } from "./ui/Icons.jsx";
import { Reveal } from "./ui/Reveal.jsx";
import { Fragmentos } from "./ui/Fragmentos.jsx";
import { SectionHeading } from "./ui/SectionHeading.jsx";

const EXTERNOS = ["Dominio", "Hosting", "Correo", "Pasarelas de pago", "Licencias"];

export function Precios() {
  return (
    <section
      id="precios"
      aria-labelledby="precios-titulo"
      className="relative scroll-mt-24 overflow-hidden border-y border-line/70 bg-ink-deep/40 py-16 sm:py-20 lg:py-24"
    >
      <Fragmentos variante="c" />

      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-5">
            <SectionHeading
              id="precios-titulo"
              eyebrow="Precios"
              title="Rangos claros antes de empezar"
              description="Para que sepas de antemano en qué rango se mueve tu proyecto y no perder tiempo en la primera conversación."
            />

            <Reveal delay={0.08}>
              <p className="mt-5 text-[0.82rem] leading-relaxed text-muted/90">
                {PRICES_NOTE}
              </p>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[0.65rem] tracking-[0.16em] text-muted/90 uppercase">
                  se cotizan aparte
                </span>
                {EXTERNOS.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-line bg-surface/60 px-2 py-1 font-mono text-[0.68rem] text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <a
                href="#contacto"
                className="group mt-8 inline-flex items-center gap-2 rounded-[10px] bg-electric px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-14px_rgba(37,99,235,0.5)] transition-colors duration-150 hover:bg-electric-bright"
              >
                Pedir una cotización
                <Icon
                  name="arrowRight"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.06} className="lg:col-span-7">
            <div className="overflow-hidden rounded-[14px] border border-line bg-surface/50">
              <div className="hidden items-center justify-between gap-4 border-b border-line px-5 py-3.5 sm:flex">
                <span className="font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase">
                  producto / servicio
                </span>
                <span className="font-mono text-[0.7rem] tracking-[0.12em] text-muted uppercase">
                  rango orientativo
                </span>
              </div>

              <ul>
                {PRICES.map((item, index) => (
                  <li
                    key={item.producto}
                    className={`flex flex-col gap-1 px-5 py-3.5 transition-colors duration-150 hover:bg-surface-2/60 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 ${
                      index === PRICES.length - 1 ? "" : "border-b border-line/60"
                    }`}
                  >
                    <span className="text-[0.9rem] text-fg/90">
                      {item.producto}
                    </span>
                    <span className="font-mono text-[0.8rem] whitespace-nowrap text-acento sm:text-right">
                      {item.rango}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="border-t border-line bg-ink-deep/50 px-5 py-3.5 text-[0.75rem] leading-relaxed text-muted">
                Precios en pesos mexicanos (MXN). No incluyen impuestos ni
                servicios de terceros.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


