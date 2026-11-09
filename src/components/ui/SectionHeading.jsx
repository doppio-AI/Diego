import { Reveal } from "./Reveal.jsx";

/**
 * Encabezado de sección: etiqueta mono + título + descripción.
 *
 * El título se marca con `data-titulo`: `useAnimacionesPagina` lo parte en
 * líneas con SplitText y las revela con máscara. La etiqueta y la descripción
 * entran como bloques normales.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start";

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <Reveal as="span" desde="abajo" delay={0.02}>
          <span className="font-mono text-xs font-medium tracking-[0.18em] text-acento uppercase">
            {eyebrow}
          </span>
        </Reveal>
      ) : null}

      <h2
        id={id}
        data-titulo
        className="text-[clamp(1.75rem,1.15rem+2.2vw,2.5rem)] leading-[1.12] text-fg"
      >
        {title}
      </h2>

      {description ? (
        <Reveal
          as="p"
          delay={0.12}
          className="max-w-xl text-[0.975rem] leading-relaxed text-muted"
        >
          {description}
        </Reveal>
      ) : null}
    </div>
  );
}
