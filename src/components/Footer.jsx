import { CONTACT, FORMAS_CONTACTO, NAV_LINKS, PROFILE } from "../data/site.js";
import { useTema } from "../lib/tema.js";
import { Icon } from "./ui/Icons.jsx";

const ANIO = new Date().getFullYear();

export function Footer() {
  const tema = useTema();
  const logo =
    tema === "oscuro" ? "./logo-principal-oscuro.svg" : "./logo-claro.svg";

  return (
    <footer className="border-t border-line/70 bg-ink-deep">
      <div className="container-page py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a
              href="#inicio"
              className="inline-flex rounded-lg"
              aria-label={`${PROFILE.nombre} — volver al inicio`}
            >
              {/* Logotipo completo, en su versión de tema claro u oscuro */}
              <img
                src={logo}
                alt={`${PROFILE.nombre} · Developer`}
                width={320}
                height={92}
                className="h-auto w-[clamp(13rem,48%,20rem)]"
              />
            </a>

            <p className="mt-4 max-w-sm text-[0.82rem] leading-relaxed text-muted">
              {PROFILE.rol}. Páginas web y sistemas a medida para negocios y
              profesionales que quieren trabajar mejor.
            </p>

            <p className="mt-4 flex items-center gap-2 font-mono text-[0.72rem] text-muted/80">
              <Icon name="pin" className="size-4 text-acento" />
              {CONTACT.ciudad} · proyectos en remoto
            </p>
          </div>

          <nav aria-labelledby="footer-nav" className="lg:col-span-3">
            <h2
              id="footer-nav"
              className="font-mono text-[0.65rem] tracking-[0.16em] text-muted/90 uppercase"
            >
              Navegación
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-[0.82rem] text-muted transition-colors duration-150 hover:text-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="font-mono text-[0.65rem] tracking-[0.16em] text-muted/90 uppercase">
              Contacto
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {FORMAS_CONTACTO.map((item) => {
                const isExternal = item.href.startsWith("http");
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group inline-flex items-center gap-2 text-[0.82rem] text-muted transition-colors duration-150 hover:text-fg"
                    >
                      <Icon
                        name={item.icon}
                        className="size-3.5 text-muted/70 transition-colors duration-150 group-hover:text-acento"
                      />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <details className="group mt-5 rounded-[10px] border border-line/70 bg-surface/30 px-3.5 py-2.5">
              <summary className="cursor-pointer list-none text-[0.75rem] text-muted transition-colors duration-150 hover:text-fg">
                Aviso de privacidad
              </summary>
              <p className="mt-2.5 text-[0.72rem] leading-relaxed text-muted/85">
                Este sitio no usa cookies de seguimiento ni guarda datos en un
                servidor. Si me escribes por WhatsApp o correo, tus datos se usan
                únicamente para responder tu mensaje y no se comparten con
                terceros.
              </p>
            </details>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.7rem] text-muted/90">
            © {ANIO} {PROFILE.nombre}. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1.5 font-mono text-[0.7rem] text-muted/90">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-acento" />
            Hecho con React, Vite y Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}

