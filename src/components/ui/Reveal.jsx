/**
 * Envoltorio declarativo para las apariciones al hacer scroll.
 *
 * No contiene lógica de animación: solo marca el elemento con atributos que
 * `useAnimacionesPagina` recoge. Así hay un único lugar donde se ajusta el
 * ritmo y los componentes se quedan limpios.
 *
 * El contenido existe en el DOM desde el primer pintado; sin JavaScript, o con
 * movimiento reducido, se ve directamente porque el estado oculto lo aplica
 * GSAP, no una clase de CSS.
 */
export function Reveal({
  as: Tag = "div",
  desde = "abajo",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  return (
    <Tag
      data-reveal={desde}
      data-retraso={delay ? String(delay) : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
