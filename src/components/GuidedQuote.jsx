import { useRef, useState, useEffect } from "react";
import { CONTACT, PRICES } from "../data/site.js";

const TYPES = ["Landing page", "Sitio web para negocio", "Menú o catálogo digital", "Tienda con pagos en línea", "Sistema personalizado", "Todavía no lo sé"];
const STEPS = ["¿Qué quieres construir?", "¿Qué quieres lograr con el proyecto?", "¿Qué funciones necesitas?", "¿Cuándo te gustaría tenerlo?", "¿Tienes un presupuesto aproximado?"];
const KEYS = ["type", "goal", "features", "date", "budget"];
const OPTIONS = [TYPES, [], ["Información y contacto", "Catálogo y consultas por WhatsApp", "Pagos, usuarios o integraciones", "Necesito orientación"], ["Sin fecha definida", "En el próximo mes", "En 2–3 meses"], ["Prefiero definirlo con Diego"]];

export function GuidedQuote({ onCancel, contactUrl, externalContact, onContact }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ type: "", goal: "", features: "", date: "", budget: "" });
  const [copyStatus, setCopyStatus] = useState("");
  const headingRef = useRef(null);
  const key = KEYS[step];
  const done = step === STEPS.length;
  useEffect(() => { headingRef.current?.focus(); }, [step]);
  const rate = PRICES.find((item) => item.producto === answers.type)?.rango;
  const reference = rate
    ? `Referencia publicada para ${answers.type.toLowerCase()}: ${rate}.`
    : "Precio por definir después de revisar el alcance con Diego.";
  const summary = `Solicitud de cotización\n\nProyecto: ${answers.type}\nObjetivo: ${answers.goal}\nFunciones: ${answers.features}\nFecha deseada: ${answers.date}\nPresupuesto del cliente: ${answers.budget || "Por definir"}\n\n${reference}\nEs una referencia inicial, no una cotización final ni una confirmación de disponibilidad. Las funciones adicionales pueden superar el rango publicado. Dominio, hosting, licencias e integraciones se cotizan aparte cuando correspondan.`;

  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopyStatus("Resumen copiado. Puedes pegarlo al contactar a Diego."); }
    catch { setCopyStatus("No se pudo copiar automáticamente. Selecciona y copia el resumen de arriba."); }
  }

  return (
    <div className="portfolio-quote">
      <div className="portfolio-quote-top"><span>COTIZACIÓN GUIADA</span><button type="button" onClick={onCancel}>Volver al chat</button></div>
      <h3 ref={headingRef} tabIndex={-1}>{done ? "Tu proyecto, listo para revisar" : STEPS[step]}</h3>
      {done ? <>
        <p className="portfolio-quote-summary">{summary}</p>
        <p>No se ha enviado ninguna solicitud. Abre WhatsApp con este resumen y revísalo antes de enviarlo.</p>
        <button type="button" className="portfolio-quote-primary" onClick={copy}>Copiar resumen</button>
        <p role="status">{copyStatus}</p>
        <a className="portfolio-quote-primary" href={externalContact ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hola Diego, preparé esta solicitud desde tu portafolio:\n\n${summary}`)}` : contactUrl} onClick={onContact} {...(externalContact ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{externalContact ? "Enviar resumen por WhatsApp ↗" : "Contactar a Diego ↗"}</a>
        <button type="button" onClick={() => { setCopyStatus(""); setStep(0); }}>Editar respuestas</button>
      </> : <form onSubmit={(event) => { event.preventDefault(); if (answers[key].trim() || step === 4) setStep(step + 1); }}>
        <p>Paso {step + 1} de {STEPS.length}. {step === 4 ? "Puedes dejarlo sin definir." : "No incluyas datos personales ni información sensible."}</p>
        {step === 0 ? <fieldset><legend className="sr-only">Tipo de proyecto</legend>{TYPES.map((type) => <label key={type} className="portfolio-quote-option"><input type="radio" name="project-type" checked={answers.type === type} onChange={() => setAnswers({ ...answers, type })} />{type}</label>)}</fieldset> : <>
          <label htmlFor="quote-answer">{["", "Objetivo del proyecto", "Funciones necesarias", "Fecha deseada (no garantizada)", "Presupuesto aproximado en MXN (opcional)"][step]}</label>
          <textarea id="quote-answer" value={answers[key]} maxLength={600} rows={3} placeholder={step === 1 ? "Ej. Mostrar mis servicios y recibir consultas de clientes." : "Escribe tu respuesta…"} onChange={(event) => setAnswers({ ...answers, [key]: event.target.value })} />
          <div className="portfolio-chat-suggestions">{OPTIONS[step].map((option) => <button key={option} type="button" onClick={() => setAnswers({ ...answers, [key]: option })}>{option}</button>)}</div>
        </>}
        <div className="portfolio-quote-actions">{step > 0 && <button type="button" onClick={() => setStep(step - 1)}>Atrás</button>}<button className="portfolio-quote-primary" type="submit" disabled={step !== 4 && !answers[key].trim()}>{step === 4 ? "Ver resumen" : "Continuar"}</button></div>
      </form>}
    </div>
  );
}
