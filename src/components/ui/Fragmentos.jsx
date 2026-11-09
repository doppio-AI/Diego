/**
 * Geometría ambiental repartida por las secciones.
 *
 * Solo decoración: fragmentos inclinados, líneas finas y aros que derivan muy
 * despacio. `aria-hidden`, sin eventos de puntero y dentro de un contenedor
 * con overflow oculto para que nunca genere scroll horizontal.
 */

const piezas = {
  a: [
    { clase: "top-[12%] right-[4%] size-10 rotate-45 border border-electric/25", anim: "ambient-float" },
    { clase: "top-[54%] right-[12%] size-2 rotate-45 bg-acento/50", anim: "ambient-float", retardo: "-7s" },
    { clase: "bottom-[10%] right-[26%] size-6 rotate-12 border border-electric/20", anim: "ambient-spin" },
    { clase: "top-[34%] left-0 h-px w-[16%] hairline-glow", anim: "" },
  ],
  b: [
    { clase: "top-[8%] left-[6%] size-7 -rotate-12 border border-electric/25", anim: "ambient-float", retardo: "-3s" },
    { clase: "bottom-[16%] right-[8%] size-12 rounded-full border border-electric/15", anim: "ambient-spin" },
    { clase: "top-[46%] right-[40%] size-1.5 rotate-45 bg-acento/40", anim: "ambient-float", retardo: "-9s" },
    { clase: "bottom-[8%] right-0 h-px w-[22%] hairline-glow", anim: "" },
  ],
  c: [
    { clase: "top-[16%] right-[10%] h-px w-[18%] hairline-glow", anim: "" },
    { clase: "bottom-[14%] left-[4%] size-8 rotate-45 border border-electric/20", anim: "ambient-spin" },
    { clase: "top-[40%] left-[18%] size-1 rotate-45 bg-acento/40", anim: "ambient-float", retardo: "-5s" },
  ],
};

export function Fragmentos({ variante = "a", className = "" }) {
  const lista = piezas[variante] ?? piezas.a;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {lista.map((pieza, indice) => (
        <div
          key={indice}
          className={`absolute ${pieza.clase} ${pieza.anim}`}
          style={pieza.retardo ? { animationDelay: pieza.retardo } : undefined}
        />
      ))}
    </div>
  );
}
