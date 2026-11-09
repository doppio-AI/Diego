/**
 * Sonda de comportamiento real.
 *
 * Arranca Edge con depuración remota y, por CDP, hace clic en un enlace del
 * menú y muestrea el estado con el reloj de verdad (sin tiempo virtual, que es
 * lo que falseaba las medidas anteriores). También guarda capturas para ver el
 * telón.
 *
 * Uso: node tools/sonda-barrido.mjs [url]
 */

import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const URL_APP = process.argv[2] || "http://localhost:5173/";
const PUERTO = 9333;
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PERFIL = "C:\\Diego\\_sonda-perfil";

const edge = spawn(
  EDGE,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    `--remote-debugging-port=${PUERTO}`,
    `--user-data-dir=${PERFIL}`,
    "--window-size=1440,900",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function objetivos() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PUERTO}/json`);
      const lista = await r.json();
      const pagina = lista.find((t) => t.type === "page");
      if (pagina) return pagina;
    } catch {
      /* aún arrancando */
    }
    await dormir(250);
  }
  throw new Error("no se pudo conectar con Edge");
}

function conectar(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const pendientes = new Map();

  ws.addEventListener("message", (evento) => {
    const msg = JSON.parse(evento.data);
    if (msg.id && pendientes.has(msg.id)) {
      const { resolvio, rechazo } = pendientes.get(msg.id);
      pendientes.delete(msg.id);
      if (msg.error) rechazo(new Error(msg.error.message));
      else resolvio(msg.result);
    }
  });

  const listo = new Promise((r) => ws.addEventListener("open", r));

  return {
    listo,
    enviar(metodo, params = {}) {
      const miId = ++id;
      return new Promise((resolvio, rechazo) => {
        pendientes.set(miId, { resolvio, rechazo });
        ws.send(JSON.stringify({ id: miId, method: metodo, params }));
      });
    },
    cerrar() {
      ws.close();
    },
  };
}

const log = (...args) => console.log(...args);

try {
  const pagina = await objetivos();
  const cdp = conectar(pagina.webSocketDebuggerUrl);
  await cdp.listo;

  await cdp.enviar("Page.enable");
  await cdp.enviar("Runtime.enable");
  /* El screencast obliga al compositor a producir frames: sin esto el rAF cae
     a ~2 fps y el "lag smoothing" de GSAP congela las animaciones. */
  await cdp.enviar("Page.startScreencast", {
    format: "jpeg",
    quality: 10,
    everyNthFrame: 1,
    maxWidth: 200,
    maxHeight: 130,
  });
  await cdp.enviar("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await cdp.enviar("Page.navigate", { url: URL_APP });
  await dormir(4000); // deja cargar fuentes e intro

  /* Muestreo con reloj real dentro de la página */
  const muestreo = await cdp.enviar("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `
      new Promise((listo) => {
        const d = document, w = window;
        const enlace = d.querySelector('nav a[href="#proyectos"]');
        const marcas = [];
        const t0 = performance.now();
        const snap = (etiqueta) => {
          const banda = d.querySelector('[data-banda]');
          const ref = w.__barrido;
          marcas.push({
            t: Math.round(performance.now() - t0),
            etiqueta,
            hash: w.location.hash || "(sin hash)",
            scroll: Math.round(w.scrollY),
            banda: banda ? "presente" : "fuera",
            transform: banda ? getComputedStyle(banda).transform.slice(19, 40) : "-",
            caja: banda ? Math.round(banda.getBoundingClientRect().left) + ".." + Math.round(banda.getBoundingClientRect().right) : "-",
            inline: banda ? banda.style.transform.slice(0, 34) : "-",
            entrada: ref && ref.tl ? (() => { const c = ref.tl.getChildren()[1]; return "p=" + c.progress().toFixed(2) + " t=" + c.time().toFixed(2) + " objetivo=" + (c.targets()[0] === banda ? "banda" : "otro"); })() : "-",
            centro: (() => { const el = d.elementFromPoint(w.innerWidth/2, w.innerHeight/2); return el ? (el.tagName + (el.hasAttribute("data-banda") ? "[BANDA]" : "")) : "nada"; })(),
            tl: ref && ref.tl
              ? "t=" + ref.tl.time().toFixed(2) +
                " p=" + ref.tl.progress().toFixed(2) +
                " dur=" + ref.tl.duration().toFixed(2) +
                " pausada=" + ref.tl.paused() +
                " ts=" + ref.tl.timeScale()
              : "sin ref",
            mismoNodo: ref ? (ref.banda === banda ? "si" : "NO") : "-",
            hijos: ref && ref.tl ? ref.tl.getChildren().length : 0
          });
        };
        enlace.click();
        snap("justo tras el clic");
        const tiempos = [120, 400, 1000, 1600, 2050, 2300, 2600, 2900];
        tiempos.forEach((ms) => setTimeout(() => snap(ms + "ms"), ms));
        setTimeout(() => listo(marcas), 3200);
      })
    `,
  });
  log("\n=== MUESTREO (reloj real) ===");
  for (const m of muestreo.result.value) {
    log(
      `${String(m.t).padStart(5)} ms · ${m.etiqueta.padEnd(18)} · ${m.hash.padEnd(12)} · scroll ${String(m.scroll).padStart(5)} · ${m.banda.padEnd(9)} · ${m.transform.padEnd(22)} · caja ${m.caja.padEnd(12)} · inline ${m.inline.padEnd(34)} · entrada ${m.entrada}`
    );
  }

  /* Capturas en momentos clave */
  await cdp.enviar("Page.navigate", { url: URL_APP });
  await dormir(4000);
  await cdp.enviar("Runtime.evaluate", {
    expression: `document.querySelector('nav a[href="#proyectos"]').click()`,
  });
  for (const [ms, nombre] of [
    [600, "1-cerrado"],
    [1900, "2-todavia-cerrado"],
    [2450, "3-abriendo"],
  ]) {
    await dormir(ms === 600 ? 600 : 0);
    if (ms !== 600) await dormir(ms === 1900 ? 1300 : 550);
    const shot = await cdp.enviar("Page.captureScreenshot", { format: "png" });
    writeFileSync(
      `C:\\Diego\\_sonda-${nombre}.png`,
      Buffer.from(shot.data, "base64"),
    );
    log(`captura ${nombre} guardada`);
  }

  cdp.cerrar();
} catch (error) {
  console.error("ERROR:", error.message);
} finally {
  edge.kill();
}
