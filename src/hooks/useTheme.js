import { useCallback } from "react";
import { alternarTema, useTema } from "../lib/tema.js";

/**
 * Tema claro por defecto, oscuro opcional.
 *
 * Toda la lógica vive en `lib/tema.js` porque `App` también necesita el valor
 * para remontar el árbol al cambiar de tema (ver el comentario de ese archivo).
 */
export function useTheme() {
  const tema = useTema();

  const alternar = useCallback(() => {
    alternarTema();
  }, []);

  return { tema, alternar };
}
