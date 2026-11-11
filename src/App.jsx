import { useEffect, useRef } from "react";
import { Nav } from "./components/Nav.jsx";
import { Hero } from "./components/Hero.jsx";
import { Servicios } from "./components/Servicios.jsx";
import { Precios } from "./components/Precios.jsx";
import { Proyectos } from "./components/Proyectos.jsx";
import { SobreMi } from "./components/SobreMi.jsx";
import { Tecnologias } from "./components/Tecnologias.jsx";
import { Contacto } from "./components/Contacto.jsx";
import { Footer } from "./components/Footer.jsx";
import { BarridoPantalla } from "./components/ui/BarridoPantalla.jsx";
import { ChatWidget } from "./components/ChatWidget.jsx";
import { DemoLab } from "./components/DemoLab.jsx";
import { useAnimacionesPagina } from "./hooks/useAnimacionesPagina.js";
import { refrescarScroll } from "./lib/gsap.js";
import { interceptarAnclas } from "./lib/navegacion.js";
import { useTema } from "./lib/tema.js";

/**
 * Toda la página anima con GSAP: el Hero tiene su propia coreografía y el resto
 * se resuelve con un único hook (`useAnimacionesPagina`) que lee atributos del
 * DOM, de modo que ningún componente necesita saber cómo se anima.
 *
 * La `key` atada al tema remonta el árbol al conmutar: es la única forma
 * fiable de que todas las superficies se pinten con la paleta nueva (Chrome
 * conserva el estilo calculado de los nodos que ya existían).
 */
export default function App() {
  const tema = useTema();
  const raiz = useRef(null);
  const chat = useRef(null);

  /* Depende del tema: al remontarse el árbol hay que volver a crear los
     disparos, porque los anteriores apuntan a nodos que ya no existen. */
  useAnimacionesPagina(raiz, tema);

  /* Un único punto intercepta los enlaces internos y coordina barrido + salto
     de sección (ver `lib/navegacion.js`). */
  useEffect(() => interceptarAnclas(), []);

  /* Al cambiar de tema el árbol se remonta: hay que recalcular los disparos. */
  useEffect(() => {
    const t = window.setTimeout(refrescarScroll, 120);
    return () => window.clearTimeout(t);
  }, [tema]);

  return (
    <div ref={raiz} key={tema} className="min-h-dvh bg-ink">
      <a
        href="#contenido"
        data-sin-barrido
        className="sr-only rounded-[10px] bg-electric px-4 py-2.5 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
      >
        Saltar al contenido
      </a>

      <Nav />

      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Servicios />
        <Precios />
        <Proyectos />
        <DemoLab onQuote={() => chat.current?.startQuote({ type: "Menú o catálogo digital", features: "Búsqueda, filtros y lista de productos para cotizar por WhatsApp." })} />
        <SobreMi />
        <Tecnologias />
        <Contacto />
      </main>

      <Footer />

      {/* Barrido diagonal de pantalla al navegar */}
      <BarridoPantalla />
      <ChatWidget ref={chat} />
    </div>
  );
}
