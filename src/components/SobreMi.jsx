import { APPROACH, CONTACT, PROFILE } from "../data/site.js";
import { Icon } from "./ui/Icons.jsx";
import { Reveal } from "./ui/Reveal.jsx";
import { SectionHeading } from "./ui/SectionHeading.jsx";

const PROCESO = [
  {
    paso: "01",
    titulo: "Conversación breve",
    texto:
      "Escucho qué necesitas y qué estás usando hoy. Sin costo y sin compromiso.",
  },
  {
    paso: "02",
    titulo: "Propuesta con alcance",
    texto:
      "Recibes por escrito qué incluye, qué no, cuánto cuesta y en cuánto tiempo.",
  },
  {
    paso: "03",
    titulo: "Desarrollo por etapas",
    texto:
      "Ves avances reales desde la primera semana y ajustamos sobre lo que ya funciona.",
  },
  {
    paso: "04",
    titulo: "Pruebas y revisión",
    texto:
      "Reviso enlaces, formularios, móvil, teclado y tiempos de carga antes de publicar.",
  },
  {
    paso: "05",
    titulo: "Entrega y acompañamiento",
    texto:
      "Publicamos, verifico todo de nuevo y quedan claras las condiciones de mantenimiento.",
  },
];

export function SobreMi() {
  return (
    <section
      id="sobre-mi"
      aria-labelledby="sobre-mi-titulo"
      className="relative scroll-mt-24 border-y border-line/70 bg-ink-deep/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-7">
            <SectionHeading
              id="sobre-mi-titulo"
              eyebrow="Sobre mí"
              title="Interfaz, lógica de negocio y datos"
              description={PROFILE.presentacion}
            />

            <ul className="mt-8 flex flex-col gap-3">
              {APPROACH.map((item, index) => (
                <Reveal
                  as="li"
                  key={item.titulo}
                  delay={index * 0.06}
                  className="flex gap-4 rounded-[12px] border border-line/70 bg-surface/40 p-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.7rem] text-electric-bright"
                  >
                    {`0${index + 1}`}
                  </span>
                  <div>
                    <h3 className="text-[0.92rem] font-semibold text-fg">
                      {item.titulo}
                    </h3>
                    <p className="mt-1 text-[0.83rem] leading-relaxed text-muted">
                      {item.texto}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.12}>
              <p className="mt-6 flex items-center gap-2 font-mono text-[0.72rem] text-muted/80">
                <Icon name="pin" className="size-4 text-acento" />
                Trabajo desde {CONTACT.ciudad} · proyectos en remoto
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="ring-gradient h-full rounded-[16px] p-5 sm:p-6">
              <div className="flex items-center gap-3.5">
                <img
                  src="./isotipo.svg"
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0"
                />
                <div>
                  <p className="font-display text-[0.95rem] font-semibold text-fg">
                    {PROFILE.nombre}
                  </p>
                  <p className="font-mono text-[0.68rem] tracking-[0.08em] text-muted uppercase">
                    {PROFILE.rol}
                  </p>
                </div>
              </div>

              <h3 className="mt-6 font-mono text-[0.68rem] tracking-[0.16em] text-acento uppercase">
                Cómo trabajamos
              </h3>

              <div className="relative mt-4">
                {/* Línea que se dibuja al bajar (la anima useAnimacionesPagina) */}
                <span
                  aria-hidden="true"
                  data-linea-proceso
                  className="absolute top-2 bottom-3 left-3 w-px bg-gradient-to-b from-electric via-acento to-transparent opacity-70"
                />

                <ol className="relative flex flex-col">
                  {PROCESO.map((item, index) => (
                    <li
                      key={item.paso}
                      data-reveal="izquierda"
                      data-retraso={String(index * 0.05)}
                      className={`flex gap-3.5 py-3.5 ${
                        index === PROCESO.length - 1
                          ? ""
                          : "border-b border-line/60"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border border-electric/50 bg-surface font-mono text-[0.6rem] text-electric-bright"
                      >
                        {item.paso}
                      </span>
                      <div>
                        <p className="text-[0.85rem] font-medium text-fg">
                          {item.titulo}
                        </p>
                        <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">
                          {item.texto}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

