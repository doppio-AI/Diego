import { useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { CONTACT, FORMAS_CONTACTO, PROJECT_TYPES } from "../data/site.js";
import { gsap } from "../lib/gsap.js";
import { DUR, EASE } from "../lib/motion.js";
import { Icon } from "./ui/Icons.jsx";
import { Reveal } from "./ui/Reveal.jsx";
import { SectionHeading } from "./ui/SectionHeading.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MENSAJE = 900;

const EMPTY = { nombre: "", email: "", tipo: "", mensaje: "" };

/**
 * Borrador fuera de React. Al conmutar el tema se remonta el árbol (ver
 * `lib/tema.js`), y sin esto el visitante perdería lo que llevaba escrito.
 */
const borrador = { values: EMPTY, errors: {}, lastLinks: null };

function validate(values) {
  const errors = {};

  if (values.nombre.trim().length < 2) {
    errors.nombre = "Escribe tu nombre (mínimo 2 caracteres).";
  }
  if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = "Escribe un correo válido, por ejemplo nombre@dominio.com";
  }
  if (!values.tipo) {
    errors.tipo = "Elige el tipo de proyecto.";
  }
  if (values.mensaje.trim().length < 10) {
    errors.mensaje = "Cuéntame un poco más (mínimo 10 caracteres).";
  }

  return errors;
}

function buildMessage(values) {
  return [
    `Hola Diego, soy ${values.nombre.trim()}.`,
    "",
    `Tipo de proyecto: ${values.tipo}`,
    `Correo de contacto: ${values.email.trim()}`,
    "",
    values.mensaje.trim(),
  ].join("\n");
}

const fieldBase =
  "w-full rounded-[10px] border bg-ink-deep/60 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 transition-colors duration-150 focus:bg-ink-deep";

function Label({ htmlFor, children, optional = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-center gap-1.5 text-[0.8rem] font-medium text-fg/90"
    >
      {children}
      {optional ? (
        <span className="font-mono text-[0.65rem] font-normal text-muted/90">
          (opcional)
        </span>
      ) : null}
    </label>
  );
}

function ErrorText({ id, children }) {
  if (!children) return null;
  return (
    <MensajeError id={id}>{children}</MensajeError>
  );
}

/* El mensaje se monta cuando aparece el error: GSAP lo acompaña con un
   desplazamiento mínimo. No se anima la opacidad a propósito: el error tiene
   que ser legible desde el primer fotograma aunque el reloj no avance. */
function MensajeError({ id, children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          y: -4,
          duration: DUR.micro,
          ease: EASE.suave,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <p
      ref={ref}
      id={id}
      className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] text-danger-text"
    >
      <span aria-hidden="true" className="text-[0.8rem]">
        !
      </span>
      {children}
    </p>
  );
}

export function Contacto() {
  const uid = useId();
  const [values, setValues] = useState(borrador.values);
  const [errors, setErrors] = useState(borrador.errors);
  const [status, setStatus] = useState(borrador.lastLinks ? "sent" : "idle");
  const [lastLinks, setLastLinks] = useState(borrador.lastLinks);
  const [anuncio, setAnuncio] = useState("");
  const fieldRefs = useRef({});
  const confirmacionRef = useRef(null);

  const formId = `${uid}-form`;

  useEffect(() => {
    if (status !== "sent") return;
    window.setTimeout(() => {
      document.getElementById(`${uid}-status`)?.focus();
    }, 50);
  }, [status, uid]);

  /* Confirmación: entra con GSAP y escalona icono, texto y botones. */
  useGSAP(
    () => {
      if (!confirmacionRef.current) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: EASE.salida } });
        tl.from(confirmacionRef.current, {
          opacity: 0,
          y: 12,
          duration: DUR.corto,
        }).from(
          confirmacionRef.current.children,
          { opacity: 0, y: 8, duration: DUR.corto, stagger: 0.06 },
          0.06,
        );
        return () => tl.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [status], scope: confirmacionRef },
  );

  const update = (field) => (event) => {
    const value = event.target.value;
    setValues((prev) => {
      const siguiente = { ...prev, [field]: value };
      borrador.values = siguiente;
      return siguiente;
    });
    if (anuncio) setAnuncio("");
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        borrador.errors = next;
        return next;
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    borrador.errors = nextErrors;
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      setAnuncio(
        `${Object.keys(nextErrors).length} ${
          Object.keys(nextErrors).length === 1 ? "campo" : "campos"
        } por corregir. Revisa el formulario.`,
      );
      return;
    }

    const mensaje = buildMessage(values);
    const waLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    const mailLink = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      `Cotización: ${values.tipo}`,
    )}&body=${encodeURIComponent(mensaje)}`;

    const enlaces = { waLink, mailLink };
    borrador.lastLinks = enlaces;
    setLastLinks(enlaces);
    window.open(waLink, "_blank", "noopener,noreferrer");
    setStatus("sent");
  };

  const reset = () => {
    borrador.values = EMPTY;
    borrador.errors = {};
    borrador.lastLinks = null;
    setValues(EMPTY);
    setErrors({});
    setLastLinks(null);
    setStatus("idle");
    window.setTimeout(() => fieldRefs.current.nombre?.focus(), 50);
  };

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-titulo"
      className="relative scroll-mt-24 overflow-hidden border-t border-line/70 bg-ink-deep/40 py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(59,130,246,0.14),transparent)]"
      />

      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-7">
            <SectionHeading
              id="contacto-titulo"
              eyebrow="Contacto"
              title="Cuéntame qué necesitas"
              description="Escribe cuatro líneas sobre tu negocio y qué quieres resolver. Te respondo con un sí, un no o una pregunta: sin presión y sin compromiso."
            />

            <Reveal delay={0.06} className="mt-8">
              <div className="relative overflow-hidden rounded-[14px] border border-line bg-surface/50 p-5 sm:p-6">
                {status === "sent" && lastLinks ? (
                  <div
                    key="confirmacion"
                    ref={confirmacionRef}
                    className="flex flex-col items-start gap-4"
                  >
                    <div
                      id={`${uid}-status`}
                      tabIndex={-1}
                      role="status"
                      aria-live="polite"
                      className="flex flex-col items-start gap-4"
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-11 place-items-center rounded-full bg-acento/15 text-acento"
                      >
                        <Icon name="check" className="size-5" strokeWidth={2.4} />
                      </span>
                      <div>
                        <h3 className="text-[1.05rem] font-semibold text-fg">
                          Mensaje listo
                        </h3>
                        <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                          Abrimos WhatsApp con tu mensaje ya escrito; solo tienes
                          que pulsar enviar. Si la ventana no se abrió, usa los
                          enlaces de abajo.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <a
                        href={lastLinks.waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-[10px] bg-acento px-4 py-2.5 text-sm font-semibold text-acento-ink transition-opacity duration-150 hover:opacity-90"
                      >
                        <Icon name="whatsapp" className="size-4" />
                        Abrir WhatsApp
                      </a>
                      <a
                        href={lastLinks.mailLink}
                        className="inline-flex items-center gap-2 rounded-[10px] border border-line px-4 py-2.5 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2"
                      >
                        <Icon name="mail" className="size-4" />
                        Enviar por correo
                      </a>
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-2 rounded-[10px] px-3 py-2.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-fg"
                      >
                        Escribir otro mensaje
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    id={formId}
                    onSubmit={handleSubmit}
                    noValidate
                    aria-describedby={`${uid}-privacidad`}
                    className="flex flex-col gap-4"
                  >
                    {/* Anuncio para lectores de pantalla (§5.H) */}
                    <p aria-live="polite" className="sr-only">
                      {anuncio}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor={`${uid}-nombre`}>Nombre</Label>
                        <input
                          ref={(node) => {
                            fieldRefs.current.nombre = node;
                          }}
                          id={`${uid}-nombre`}
                          name="nombre"
                          type="text"
                          autoComplete="name"
                          value={values.nombre}
                          onChange={update("nombre")}
                          aria-invalid={Boolean(errors.nombre)}
                          aria-describedby={
                            errors.nombre ? `${uid}-nombre-error` : undefined
                          }
                          placeholder="Tu nombre"
                          className={`${fieldBase} ${
                            errors.nombre
                              ? "border-danger"
                              : "border-line focus:border-electric"
                          }`}
                        />
                        <ErrorText id={`${uid}-nombre-error`}>
                          {errors.nombre}
                        </ErrorText>
                      </div>

                      <div>
                        <Label htmlFor={`${uid}-email`}>Correo</Label>
                        <input
                          ref={(node) => {
                            fieldRefs.current.email = node;
                          }}
                          id={`${uid}-email`}
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={values.email}
                          onChange={update("email")}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={
                            errors.email ? `${uid}-email-error` : undefined
                          }
                          placeholder="nombre@dominio.com"
                          className={`${fieldBase} ${
                            errors.email
                              ? "border-danger"
                              : "border-line focus:border-electric"
                          }`}
                        />
                        <ErrorText id={`${uid}-email-error`}>
                          {errors.email}
                        </ErrorText>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`${uid}-tipo`}>Tipo de proyecto</Label>
                      <div className="relative">
                        <select
                          ref={(node) => {
                            fieldRefs.current.tipo = node;
                          }}
                          id={`${uid}-tipo`}
                          name="tipo"
                          value={values.tipo}
                          onChange={update("tipo")}
                          aria-invalid={Boolean(errors.tipo)}
                          aria-describedby={
                            errors.tipo ? `${uid}-tipo-error` : undefined
                          }
                          className={`${fieldBase} appearance-none pr-10 ${
                            errors.tipo
                              ? "border-danger"
                              : "border-line focus:border-electric"
                          } ${values.tipo ? "" : "text-muted/80"}`}
                        >
                          <option value="">Elige una opción</option>
                          {PROJECT_TYPES.map((tipo) => (
                            <option
                              key={tipo}
                              value={tipo}
                              className="bg-surface text-fg"
                            >
                              {tipo}
                            </option>
                          ))}
                        </select>
                        <Icon
                          name="arrowDown"
                          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
                        />
                      </div>
                      <ErrorText id={`${uid}-tipo-error`}>{errors.tipo}</ErrorText>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <Label htmlFor={`${uid}-mensaje`}>
                          ¿Qué necesitas resolver?
                        </Label>
                        <span
                          aria-hidden="true"
                          className={`font-mono text-[0.65rem] ${
                            values.mensaje.length > MAX_MENSAJE * 0.9
                              ? "text-danger-text"
                              : "text-muted/80"
                          }`}
                        >
                          {values.mensaje.length}/{MAX_MENSAJE}
                        </span>
                      </div>
                      <textarea
                        ref={(node) => {
                          fieldRefs.current.mensaje = node;
                        }}
                        id={`${uid}-mensaje`}
                        name="mensaje"
                        rows={4}
                        maxLength={MAX_MENSAJE}
                        value={values.mensaje}
                        onChange={update("mensaje")}
                        aria-invalid={Boolean(errors.mensaje)}
                        aria-describedby={
                          errors.mensaje ? `${uid}-mensaje-error` : undefined
                        }
                        placeholder="Ej. Tengo un restaurante y quiero un menú digital que se vea bien en el celular…"
                        className={`${fieldBase} resize-y leading-relaxed ${
                          errors.mensaje
                            ? "border-danger"
                            : "border-line focus:border-electric"
                        }`}
                      />
                      <ErrorText id={`${uid}-mensaje-error`}>
                        {errors.mensaje}
                      </ErrorText>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        className="group inline-flex items-center gap-2 rounded-[10px] bg-electric px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-14px_rgba(37,99,235,0.5)] transition-colors duration-150 hover:bg-electric-bright"
                      >
                        Enviar mensaje
                        <Icon
                          name="arrowRight"
                          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </button>
                      <p className="font-mono text-[0.68rem] text-muted/90">
                        respuesta en 1 día hábil
                      </p>
                    </div>

                    <p
                      id={`${uid}-privacidad`}
                      className="border-t border-line/70 pt-3.5 text-[0.75rem] leading-relaxed text-muted/85"
                    >
                      Este sitio es estático: el formulario no guarda nada en
                      ningún servidor. Solo prepara el mensaje y lo abre en
                      WhatsApp o en tu correo para que lo envíes tú.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <h3 className="font-mono text-[0.68rem] tracking-[0.16em] text-acento uppercase">
                Canales directos
              </h3>
            </Reveal>

            <ul className="mt-4 flex flex-col gap-2.5">
              {FORMAS_CONTACTO.map((item, index) => {
                const isExternal = item.href.startsWith("http");
                return (
                  <Reveal as="li" key={item.id} delay={0.14 + index * 0.06}>
                    <a
                      href={item.href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-center gap-3.5 rounded-[12px] border border-line bg-surface/50 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/45 hover:bg-surface"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-line bg-ink-deep/70 text-muted transition-colors duration-200 group-hover:text-acento">
                        <Icon name={item.icon} className="size-4.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.85rem] font-medium text-fg">
                          {item.label}
                        </span>
                        <span className="block truncate font-mono text-[0.7rem] text-muted">
                          {item.valor}
                        </span>
                      </span>
                      <Icon
                        name="arrowUpRight"
                        className="size-4 shrink-0 text-muted/80 transition-colors duration-200 group-hover:text-electric-bright"
                      />
                    </a>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={0.38}>
              <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-line/70 bg-ink-deep/50 px-4 py-3.5">
                <Icon name="clock" className="mt-0.5 size-4 shrink-0 text-acento" />
                <p className="text-[0.78rem] leading-relaxed text-muted">
                  Atiendo de lunes a viernes. Si escribes el fin de semana,
                  contesto el lunes sin falta.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}


