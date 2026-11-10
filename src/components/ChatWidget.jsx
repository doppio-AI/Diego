import { useEffect, useRef, useState } from "react";
import { CONTACT } from "../data/site.js";
import "./ChatWidget.css";

const INTRO = "¡Hola! Soy el asistente virtual de Diego. Puedo contarte sobre sus proyectos, tecnologías y servicios. ¿Qué te gustaría saber?";
const SUGGESTIONS = ["¿Qué proyectos has realizado?", "¿Qué tecnologías manejas?", "¿Cuánto cuesta una web?"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: INTRO }]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { if (open) bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" }); }, [messages, loading, open]);

  async function send(text) {
    const question = text.trim().slice(0, 1200);
    if (!question || loading) return;
    const next = [...messages, { role: "user", content: question }];
    setMessages(next);
    setDraft("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) })
      });
      if (!response.ok) throw new Error("No disponible");
      const data = await response.json();
      if (typeof data.reply !== "string") throw new Error("Respuesta inválida");
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch {
      setError("No pude conectarme en este momento. Puedes contactar directamente a Diego.");
    } finally {
      setLoading(false);
    }
  }

  const lastQuestion = [...messages].reverse().find((message) => message.role === "user")?.content;
  const whatsappConfigured = CONTACT.whatsapp && !CONTACT.whatsapp.includes("0000000");
  const whatsappText = `Hola Diego, visité tu portafolio y me gustaría hablar sobre un proyecto.${lastQuestion ? ` Mi consulta: ${lastQuestion}` : ""}`;
  const whatsappUrl = whatsappConfigured
    ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(whatsappText)}`
    : "#contacto";

  return (
    <div className="portfolio-chat" data-chat-widget>
      {open && (
        <section className="portfolio-chat-panel" role="dialog" aria-label="Asistente de Diego" aria-modal="false">
          <header className="portfolio-chat-header">
            <div><span className="portfolio-chat-eyebrow">DIEGO REYES / AI</span><strong>¿Hablamos de tu idea?</strong><small>Asistente virtual · Respuestas con IA</small></div>
            <button type="button" className="portfolio-chat-close" aria-label="Cerrar chat" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="portfolio-chat-messages" role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message, index) => <div key={index} className={`portfolio-chat-bubble ${message.role}`}>{message.content}</div>)}
            {messages.length === 1 && <div className="portfolio-chat-suggestions">{SUGGESTIONS.map((question) => <button key={question} type="button" onClick={() => send(question)} disabled={loading}>{question}</button>)}</div>}
            {loading && <p className="portfolio-chat-status">Preparando respuesta…</p>}
            {error && <p className="portfolio-chat-error" role="alert">{error}</p>}
            <div ref={bottomRef} />
          </div>
          <a className="portfolio-chat-contact" href={whatsappUrl} {...(whatsappConfigured ? { target: "_blank", rel: "noopener noreferrer" } : {})}>Solicitar una cotización ↗</a>
          <form className="portfolio-chat-compose" onSubmit={(event) => { event.preventDefault(); send(draft); }}>
            <input ref={inputRef} aria-label="Escribe tu pregunta" placeholder="Pregunta lo que necesites…" value={draft} maxLength={1200} onChange={(event) => setDraft(event.target.value)} />
            <button type="submit" disabled={loading || !draft.trim()} aria-label="Enviar mensaje">➤</button>
          </form>
          <p className="portfolio-chat-disclaimer">Asistente automatizado. Verifica detalles y cotizaciones con Diego.</p>
        </section>
      )}
      <button className="portfolio-chat-launcher" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar asistente" : "Abrir asistente virtual"} aria-expanded={open}>
        <span aria-hidden="true">{open ? "×" : "✦"}</span><span className="portfolio-chat-launcher-label">{open ? "Cerrar" : "Pregunta a mi IA"}</span>
      </button>
    </div>
  );
}
