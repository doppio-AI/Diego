import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { NAV_LINKS, PROFILE } from "../data/site.js";
import { useTheme } from "../hooks/useTheme.js";
import { gsap } from "../lib/gsap.js";
import { DUR, EASE } from "../lib/motion.js";
import { alternarSonido, sonar, useSonido } from "../lib/sonido.js";
import { Icon } from "./ui/Icons.jsx";

/* Inclinación del cursor de menú, en grados. */
const INCLINACION = -14;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [indicador, setIndicador] = useState(null);
  const listaRef = useRef(null);
  const enlacesRef = useRef({});
  const { tema, alternar } = useTheme();
  const sonido = useSonido();
  const cursorRef = useRef(null);
  const estelaRef = useRef(null);

  const esOscuro = tema === "oscuro";

  /* El salto y el barrido los coordina `interceptarAnclas`; aquí solo el
     sonido del clic. */
  const alNavegar = () => sonar("clic");

  /* Posición del indicador bajo el enlace activo */
  useEffect(() => {
    const medir = () => {
      const enlace = enlacesRef.current[active];
      const lista = listaRef.current;
      if (!enlace || !lista) {
        setIndicador(null);
        return;
      }
      const cajaEnlace = enlace.getBoundingClientRect();
      const cajaLista = lista.getBoundingClientRect();
      setIndicador({
        x: cajaEnlace.left - cajaLista.left + 12,
        w: Math.max(cajaEnlace.width - 24, 12),
      });
    };

    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [active]);

  /* El cursor y su estela se mueven con GSAP: la estela usa una curva más
     lenta, de modo que siempre llega un poco después. */
  useGSAP(
    () => {
      const cursor = cursorRef.current;
      const estela = estelaRef.current;
      if (!cursor || !estela) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([cursor, estela], {
          x: indicador?.x ?? 0,
          width: indicador?.w ?? 0,
          skewX: INCLINACION,
          opacity: indicador ? 1 : 0,
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!indicador) {
          gsap.to([cursor, estela], { opacity: 0, duration: DUR.micro });
          return;
        }
        gsap.to(cursor, {
          x: indicador.x,
          width: indicador.w,
          skewX: INCLINACION,
          opacity: 1,
          duration: DUR.corto,
          ease: EASE.seca,
          overwrite: true,
        });
        gsap.to(estela, {
          x: indicador.x,
          width: indicador.w,
          skewX: INCLINACION,
          opacity: 1,
          duration: DUR.largo,
          ease: "elastic.out(1, 0.55)",
          overwrite: true,
        });
      });

      return () => mm.revert();
    },
    { dependencies: [indicador], scope: listaRef },
  );

  /* Sombra y fondo sólido al desplazar */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Enlace activo según la sección visible */
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter(Boolean);

    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Cerrar con Escape y al pasar a escritorio */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const media = window.matchMedia("(min-width: 1024px)");
    const onMediaChange = (event) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onMediaChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onMediaChange);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? "border-b border-line bg-ink/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-18">
        <a
          href="#inicio"
          className="group flex items-center gap-3 rounded-lg"
          aria-label={`${PROFILE.nombre} — ir al inicio`}
        >
          {/* Marca oficial: public/isotipo.svg */}
          <img
            src="./isotipo.svg"
            alt=""
            width={38}
            height={38}
            className="size-9 shrink-0 transition-transform duration-200 group-hover:scale-105 sm:size-10"
          />
          <span className="flex flex-col leading-none">
            <span className="font-mono text-[0.56rem] tracking-[0.2em] text-electric-bright uppercase">
              Developer
            </span>
            <span className="mt-1 font-display text-[0.95rem] font-semibold tracking-tight text-fg">
              {PROFILE.nombre}
            </span>
          </span>
        </a>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul ref={listaRef} className="relative flex items-center gap-0.5 xl:gap-1">
            {/* Cursor del menú: barra inclinada que salta hasta el enlace
                activo, con una estela más lenta (gesto de menú de P3R).
                GSAP coloca ambas capas midiendo el enlace. */}
            <span
              ref={estelaRef}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[3px] rounded-[2px] bg-acento/35 opacity-0"
            />
            <span
              ref={cursorRef}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[3px] rounded-[2px] bg-gradient-to-r from-electric to-acento opacity-0 shadow-[0_0_14px_-2px_var(--acento)]"
            />

            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    ref={(node) => {
                      enlacesRef.current[link.id] = node;
                    }}
                    href={`#${link.id}`}
                    onClick={alNavegar}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative block rounded-lg px-2.5 py-2 text-sm transition-[color,transform] duration-150 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 xl:px-3 ${
                      isActive
                        ? "scale-[1.04] text-fg"
                        : "text-muted hover:text-fg"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={alternarSonido}
            aria-pressed={sonido}
            aria-label={sonido ? "Silenciar sonido" : "Activar sonido"}
            title={sonido ? "Silenciar sonido" : "Activar sonido"}
            className="hidden size-11 place-items-center rounded-[10px] border border-line bg-surface/60 text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg sm:grid"
          >
            <Icon name={sonido ? "volume" : "volumeOff"} className="size-4.5" />
          </button>

          <button
            type="button"
            onClick={alternar}
            aria-pressed={esOscuro}
            aria-label={
              esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            }
            title={esOscuro ? "Modo claro" : "Modo oscuro"}
            className="grid size-11 place-items-center rounded-[10px] border border-line bg-surface/60 text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
          >
            <Icon name={esOscuro ? "sun" : "moon"} className="size-4.5" />
          </button>

          <a
            href="#contacto"
            onClick={alNavegar}
            className="hidden items-center gap-2 rounded-[10px] bg-electric px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(37,99,235,0.55)] transition-colors duration-150 hover:bg-electric-bright focus-visible:outline-acento sm:inline-flex"
          >
            Cotizar<span className="hidden xl:inline">&nbsp;proyecto</span>
            <Icon name="arrowUpRight" className="size-4" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-11 place-items-center rounded-[10px] border border-line text-fg transition-colors duration-150 hover:bg-surface lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {/* Panel móvil */}
      <div
        id="menu-movil"
        hidden={!open}
        className="border-t border-line bg-ink/95 shadow-[0_28px_50px_-24px_rgba(0,0,0,0.95)] backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Navegación móvil" className="container-page py-3">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => {
                    setOpen(false);
                    alNavegar(event);
                  }}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-[0.95rem] text-muted transition-colors duration-150 hover:bg-surface hover:text-fg"
                >
                  {link.label}
                  <Icon name="arrowRight" className="size-4 text-muted/80" />
                </a>
              </li>
            ))}
          </ul>

          {/* En móvil el sonido vive aquí, para no saturar la barra */}
          <button
            type="button"
            onClick={alternarSonido}
            aria-pressed={sonido}
            className="mt-2 flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-[0.9rem] text-muted transition-colors duration-150 hover:bg-surface hover:text-fg sm:hidden"
          >
            <span className="flex items-center gap-2.5">
              <Icon name={sonido ? "volume" : "volumeOff"} className="size-4" />
              Sonido de la interfaz
            </span>
            <span className="font-mono text-[0.65rem] tracking-[0.1em] text-acento uppercase">
              {sonido ? "activado" : "apagado"}
            </span>
          </button>

          <a
            href="#contacto"
            onClick={(event) => {
              setOpen(false);
              alNavegar(event);
            }}
            className="mt-3 flex items-center justify-center gap-2 rounded-[10px] bg-electric px-4 py-3 text-sm font-semibold text-white"
          >
            Cotizar proyecto
            <Icon name="arrowUpRight" className="size-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}

