import { useRef, useState } from "react";

const SERVICES = [
  { id: "advice", name: "Asesoría inicial", minutes: 30, detail: "Una conversación para planear el siguiente paso." },
  { id: "hair", name: "Corte de cabello", minutes: 45, detail: "Un espacio reservado para renovar tu estilo." },
  { id: "visit", name: "Consulta de ejemplo", minutes: 60, detail: "Atención con tiempo dedicado a cada visitante." },
];
const TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
function nextDays() {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);
    return { id: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, label: date.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }), full: date.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
  });
}

export function AppointmentDemo({ onQuote }) {
  const [days] = useState(nextDays);
  const [serviceId, setServiceId] = useState("advice");
  const [dayId, setDayId] = useState(days[0].id);
  const [time, setTime] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const heading = useRef(null);
  const service = SERVICES.find(item => item.id === serviceId);
  const day = days.find(item => item.id === dayId);
  const dayIndex = days.indexOf(day);
  // Availability is deliberately deterministic and fictional, with no booking service.
  const unavailable = TIMES.filter((_, index) => (index + dayIndex + service.minutes / 15) % 4 === 0);
  function resetSelection(update) { update(); setTime(""); setReviewing(false); }
  function showSummary() { if (!time) return; setReviewing(true); requestAnimationFrame(() => heading.current?.focus()); }
  return <div className="demo-window appointment-demo">
    <header className="demo-window-bar"><span><i /><i /><i /></span><span>ESTUDIO / AGENDA</span><span className="demo-badge">DEMO INTERACTIVA</span></header>
    <div className="demo-shop-intro"><div><p className="demo-eyebrow">TIEMPO PARA TUS CLIENTES</p><h3>Menos mensajes.<br />Más organización.</h3><p>Prueba cómo elegir un servicio y encontrar un horario en una agenda para tu negocio.</p></div><div className="demo-intro-note"><strong>02 / Agenda de citas</strong><span>Para barberías, consultorios, talleres y profesionales.</span></div></div>
    <p className="demo-warning">Simulación: servicios y disponibilidad ficticios. No reserva citas, no envía mensajes y no solicita datos personales. Horarios en la hora local de tu dispositivo.</p>
    <div className="demo-layout appointment-layout"><div className="appointment-steps">
      <fieldset><legend>01 · Elige un servicio</legend><div className="appointment-services">{SERVICES.map(item => <label key={item.id} className={serviceId === item.id ? "selected" : ""}><input type="radio" name="demo-service" value={item.id} checked={serviceId === item.id} onChange={() => resetSelection(() => setServiceId(item.id))} /><span><strong>{item.name}</strong><small>{item.detail}</small></span><b>{item.minutes} min</b></label>)}</div></fieldset>
      <fieldset><legend>02 · Selecciona un día</legend><p>Próximos siete días · fechas de ejemplo</p><div className="appointment-days">{days.map(item => <button type="button" key={item.id} aria-label={item.full} aria-pressed={dayId === item.id} onClick={() => resetSelection(() => setDayId(item.id))}>{item.label}</button>)}</div></fieldset>
      <fieldset><legend>03 · Encuentra tu horario</legend><p>Los horarios marcados como ocupados ilustran una agenda con disponibilidad limitada.</p><div className="appointment-times">{TIMES.map(slot => <button type="button" key={slot} disabled={unavailable.includes(slot)} aria-pressed={time === slot} onClick={() => { setTime(slot); setReviewing(false); }}>{slot}<small>{unavailable.includes(slot) ? "Ocupado" : "Disponible"}</small></button>)}</div></fieldset>
    </div><aside className="demo-list appointment-summary" aria-label="Resumen de cita simulada">
      <p className="demo-eyebrow">TU SELECCIÓN</p><h4 ref={heading} tabIndex={-1}>{reviewing ? "Así se vería tu solicitud" : "Una cita, paso a paso"}</h4>
      <dl><dt>Servicio</dt><dd>{service.name}</dd><dt>Duración</dt><dd>{service.minutes} minutos</dd><dt>Fecha</dt><dd>{day.full}</dd><dt>Horario local</dt><dd>{time || "Selecciona un horario"}</dd></dl>
      {reviewing ? <div className="appointment-result" role="status"><strong>Simulación lista</strong><p>No hay una cita reservada. En una agenda real, aquí podrías revisar tu solicitud antes de enviarla al negocio.</p><button type="button" onClick={() => setReviewing(false)}>Editar selección</button></div> : <><button className="appointment-review" type="button" disabled={!time} onClick={showSummary}>Ver resumen de ejemplo</button><p>Elige un horario para completar la simulación.</p></>}
      <div className="demo-convert"><h4>¿Una agenda para tu negocio?</h4><p>La adaptamos a tus servicios, horarios y reglas de atención.</p><button type="button" onClick={onQuote}>Quiero una agenda así ↗</button><small>Solicita el desarrollo de tu agenda. La cita de ejemplo no se envía.</small></div>
    </aside></div>
    <footer className="demo-foot"><span>ELEGIR · ORGANIZAR · REVISAR</span><span>Sin registro. Sin reservas reales.</span></footer>
  </div>;
}
