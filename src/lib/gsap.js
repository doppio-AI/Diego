import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * Punto único de registro de GSAP.
 *
 * Plugins usados: ScrollTrigger (revelados y paralaje ligados al scroll) y
 * SplitText (revelado de titulares por líneas). Ninguno añade peso muerto:
 * Flip, ScrollSmoother y Observer no se usan.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* El móvil cambia la altura de la barra de direcciones al hacer scroll; sin
   esto, ScrollTrigger recalcula y los revelados se disparan solos. */
ScrollTrigger.config({ ignoreMobileResize: true });

/** Refresco diferido: cubre fuentes e imágenes que llegan tarde. */
export function refrescarScroll() {
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger, SplitText };
