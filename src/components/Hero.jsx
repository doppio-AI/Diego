import { Fragment, useRef } from "react";
import { PROFILE } from "../data/site.js";
import { useHeroAnimations } from "../hooks/useHeroAnimations.js";
import { sonar } from "../lib/sonido.js";
import { Icon } from "./ui/Icons.jsx";

const HIGHLIGHTS = [
  { icon: "check", texto: "Diseño móvil primero" },
  { icon: "check", texto: "Código propio y mantenible" },
  { icon: "check", texto: "Alcance y precio por escrito" },
];

const STACK = ["React", "Node.js", "PostgreSQL", "Tailwind CSS"];

export function Hero() {
  const raiz = useRef(null);
  const palabras = PROFILE.titulo.trim().split(" ");
  const accent = palabras.pop();
  const base = palabras;
  const ultima = base.length;

  useHeroAnimations(raiz);

  /* El salto y el barrido los coordina `interceptarAnclas`; aquí solo el
     sonido, que es propio del clic. */
  const alNavegar = () => sonar("clic");

  return (
    <section
      ref={raiz}
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-28"
    >
      {/* Fondo: retícula + resplandores */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 left-1/4 size-[34rem] rounded-full bg-electric/12 blur-[120px]" />
        <div className="absolute top-24 -right-32 size-[28rem] rounded-full bg-acento/10 blur-[120px]" />
      </div>

      {/* Geometría ambiental: decorativa, de bajo contraste y lenta */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          data-hero="decor"
          className="ambient-spin absolute top-[12%] -right-24 size-[26rem] rounded-full border border-dashed border-electric/25 sm:right-[2%]"
        />
        <div
          data-hero="decor"
          className="absolute top-[30%] right-[6%] size-[15rem] rounded-full border border-electric/15 sm:right-[13%]"
        />
        <div
          data-hero="linea"
          className="hairline-glow absolute top-[20%] left-0 h-px w-[36%] origin-left opacity-80"
        />
        <div
          data-hero="linea"
          className="hairline-glow absolute bottom-[14%] left-[10%] h-px w-[22%] origin-left opacity-50"
        />
        <div
          data-hero="decor"
          className="ambient-float absolute top-[16%] left-[46%] size-1.5 rotate-45 bg-glow/60"
        />
        <div
          data-hero="decor"
          className="ambient-float absolute top-[64%] left-[5%] size-1 rounded-full bg-electric/60 [animation-delay:-6s]"
        />
        <div
          data-hero="decor"
          className="ambient-float absolute top-[46%] right-[26%] size-1 rotate-45 bg-glow/50 [animation-delay:-11s]"
        />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:col-span-7">
            {PROFILE.disponible ? (
              <div
                data-hero="etiqueta"
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-acento/25 bg-acento/8 px-3.5 py-1.5"
              >
                <span className="relative flex size-2">
                  <span
                    aria-hidden="true"
                    className="absolute inline-flex size-full animate-ping rounded-full bg-acento opacity-70"
                  />
                  <span className="relative inline-flex size-2 rounded-full bg-acento" />
                </span>
                <span className="font-mono text-[0.7rem] tracking-[0.08em] text-acento uppercase">
                  Disponible para nuevos proyectos
                </span>
              </div>
            ) : null}

            {/* Línea de apertura: se expande desde la izquierda */}
            <span
              aria-hidden="true"
              data-hero="linea"
              className="hairline-glow mb-5 block h-px w-28 origin-left"
            />

            {/* Título: cada palabra sube dentro de su propia máscara.
                El texto sigue siendo texto real, legible por lectores de
                pantalla; solo se reparte en spans para el stagger. */}
            <h1
              id="hero-titulo"
              className="text-[clamp(2.25rem,1.5rem+3.6vw,3.75rem)] leading-[1.06] tracking-tight text-fg"
            >
              {[...base, accent].map((palabra, indice) => (
                <Fragment key={`${palabra}-${indice}`}>
                  <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                    <span
                      data-hero="palabra"
                      className={
                        indice === ultima
                          ? "text-gradient inline-block"
                          : "inline-block"
                      }
                    >
                      {palabra}
                    </span>
                  </span>
                  {indice < ultima ? " " : null}
                </Fragment>
              ))}
            </h1>

            <p
              data-hero="texto"
              className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              {PROFILE.descripcion}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#proyectos"
                onClick={alNavegar}
                data-hero="accion"
                className="group inline-flex items-center gap-2 rounded-[10px] bg-electric px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-14px_rgba(37,99,235,0.5)] transition-colors duration-150 hover:bg-electric-bright"
              >
                Ver proyectos
                <Icon
                  name="arrowRight"
                  data-hero="icono"
                  className="size-4"
                />
              </a>
              <a
                href="#contacto"
                onClick={alNavegar}
                data-hero="accion"
                className="group inline-flex items-center gap-2 rounded-[10px] border border-line bg-surface/40 px-5 py-3 text-sm font-semibold text-fg transition-colors duration-150 hover:border-electric/50 hover:bg-surface"
              >
                Contactarme
                <Icon name="arrowUpRight" data-hero="icono" className="size-4 text-muted" />
              </a>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item.texto}
                  data-hero="detalle"
                  className="flex items-center gap-2 text-[0.82rem] text-muted"
                >
                  <Icon name={item.icon} className="size-4 text-acento" />
                  {item.texto}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.65rem] tracking-[0.16em] text-muted/90 uppercase">
                stack
              </span>
              {STACK.map((tech) => (
                <span
                  key={tech}
                  data-hero="chip"
                  className="rounded-md border border-line bg-surface/60 px-2 py-1 font-mono text-[0.68rem] text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Visual del hero: fotografía real del estudio */}
          <div className="relative min-w-0 lg:col-span-5">
            <div
              aria-hidden="true"
              data-hero="foto-halo"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_70%_20%,rgba(59,130,246,0.28),transparent_70%)] blur-2xl"
            />

            <figure
              data-hero="foto"
              className="relative overflow-hidden rounded-[16px] border border-line/80 bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <div
                  data-hero="foto-capa"
                  className="h-full w-full scale-[1.06]"
                >
                  <img
                    src="./heroimg.jpg"
                    alt="Diego Reyes programando de noche en su portátil, con el editor de código abierto"
                    width={900}
                    height={1125}
                    data-hero="foto-img"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Filo luminoso superior, coherente con las tarjetas del sitio */}
              <span
                aria-hidden="true"
                className="hairline-glow pointer-events-none absolute inset-x-0 top-0 z-10 h-px"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}