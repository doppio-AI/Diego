/**
 * Mockups SVG de los proyectos (decorativos pero con texto alternativo).
 * Sustitúyelos por capturas reales en WebP/AVIF cuando existan (§10).
 */

const C = {
  panel: "#0c1424",
  card: "#16203a",
  cardAlt: "#1b2644",
  bar: "#33415e",
  barDim: "#26334d",
  ink: "#0a0f18",
  acento: "#67c7ff",
  blue: "#3b82f6",
  violet: "#8b5cf6",
  line: "#24304a",
};

function WindowFrame({ children, label }) {
  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label={label}
      className="block h-auto w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="480" height="300" fill={C.panel} />

      {/* Barra de ventana */}
      <rect width="480" height="26" fill={C.ink} />
      <circle cx="16" cy="13" r="3.2" fill="#ff5f57" opacity="0.75" />
      <circle cx="28" cy="13" r="3.2" fill="#febc2e" opacity="0.75" />
      <circle cx="40" cy="13" r="3.2" fill="#28c840" opacity="0.75" />
      <rect x="58" y="7.5" width="128" height="11" rx="5.5" fill={C.card} />
      <line x1="0" y1="26" x2="480" y2="26" stroke={C.line} strokeWidth="1" />

      {children}
    </svg>
  );
}

function Restaurant() {
  return (
    <WindowFrame label="Vista previa del sitio de restaurante: menú digital con precios y botón de reservación">
      {/* Imagen principal */}
      <rect x="20" y="44" width="212" height="126" rx="10" fill={C.card} />
      <circle cx="126" cy="98" r="30" fill={C.cardAlt} />
      <path
        d="M126 82c11 0 20 8 20 18s-9 18-20 18-20-8-20-18 9-18 20-18Z"
        fill="none"
        stroke={C.acento}
        strokeWidth="2.5"
        opacity="0.5"
      />
      <rect x="36" y="140" width="86" height="8" rx="4" fill={C.bar} />
      <rect x="36" y="154" width="56" height="6" rx="3" fill={C.barDim} />

      {/* Columna de menú */}
      <rect x="20" y="182" width="96" height="10" rx="5" fill={C.bar} opacity="0.9" />

      <rect x="248" y="48" width="118" height="11" rx="5.5" fill={C.bar} />
      <rect x="248" y="66" width="76" height="6" rx="3" fill={C.barDim} />

      {[92, 140, 188].map((y, index) => (
        <g key={y}>
          <rect x="248" y={y} width="196" height="34" rx="8" fill={C.card} />
          <rect x="258" y={y + 9} width="72" height="7" rx="3.5" fill={C.bar} />
          <rect x="258" y={y + 21} width="104" height="5" rx="2.5" fill={C.barDim} />
          <rect
            x="406"
            y={y + 10}
            width="30"
            height="14"
            rx="7"
            fill={index === 0 ? C.acento : C.barDim}
            opacity={index === 0 ? 0.9 : 1}
          />
        </g>
      ))}

      {/* CTA */}
      <rect x="248" y="240" width="120" height="26" rx="8" fill={C.blue} opacity="0.9" />
      <rect x="262" y="250" width="66" height="7" rx="3.5" fill="#ffffff" opacity="0.85" />
      <rect x="378" y="240" width="66" height="26" rx="8" fill={C.card} />
      <rect x="390" y="250" width="42" height="7" rx="3.5" fill={C.bar} />
    </WindowFrame>
  );
}

function Inventory() {
  const rows = [108, 142, 176, 210];
  return (
    <WindowFrame label="Vista previa del sistema de inventario: panel lateral, indicadores y tabla de productos">
      {/* Sidebar */}
      <rect x="0" y="26" width="96" height="274" fill={C.ink} />
      <rect x="14" y="42" width="58" height="9" rx="4.5" fill={C.bar} />
      <rect x="14" y="70" width="68" height="20" rx="6" fill={C.cardAlt} />
      <rect x="22" y="78" width="44" height="6" rx="3" fill={C.acento} opacity="0.8" />
      {[100, 128, 156, 184].map((y) => (
        <g key={y}>
          <circle cx="20" cy={y + 8} r="3" fill={C.barDim} />
          <rect x="30" y={y + 5} width="46" height="6" rx="3" fill={C.barDim} />
        </g>
      ))}
      <circle cx="26" cy="270" r="9" fill={C.card} />
      <rect x="40" y="266" width="40" height="6" rx="3" fill={C.barDim} />

      {/* Encabezado */}
      <rect x="112" y="42" width="132" height="12" rx="6" fill={C.bar} />
      <rect x="112" y="62" width="86" height="6" rx="3" fill={C.barDim} />
      <rect x="392" y="42" width="68" height="22" rx="7" fill={C.blue} opacity="0.9" />
      <rect x="404" y="50" width="44" height="6" rx="3" fill="#fff" opacity="0.85" />

      {/* Indicadores */}
      {[
        { x: 112, accent: C.acento },
        { x: 240, accent: C.blue },
        { x: 368, accent: C.violet },
      ].map((card) => (
        <g key={card.x}>
          <rect x={card.x} y="86" width="116" height="46" rx="9" fill={C.card} />
          <rect x={card.x + 12} y="96" width="34" height="5" rx="2.5" fill={C.barDim} />
          <rect x={card.x + 12} y="108" width="52" height="12" rx="4" fill={card.accent} opacity="0.85" />
        </g>
      ))}

      {/* Tabla */}
      <rect x="112" y="148" width="352" height="122" rx="9" fill={C.card} opacity="0.55" />
      <rect x="124" y="160" width="60" height="6" rx="3" fill={C.bar} />
      <rect x="248" y="160" width="46" height="6" rx="3" fill={C.bar} />
      <rect x="330" y="160" width="52" height="6" rx="3" fill={C.bar} />
      <rect x="412" y="160" width="38" height="6" rx="3" fill={C.bar} />

      {rows.map((y, index) => (
        <g key={y}>
          <line x1="124" y1={y - 6} x2="452" y2={y - 6} stroke={C.line} strokeWidth="1" opacity="0.8" />
          <rect x="124" y={y} width="84" height="7" rx="3.5" fill={C.barDim} />
          <rect x="248" y={y} width="34" height="7" rx="3.5" fill={C.barDim} />
          <rect
            x="330"
            y={y - 3}
            width="44"
            height="13"
            rx="6.5"
            fill={index === 2 ? C.acento : C.barDim}
            opacity={index === 2 ? 0.35 : 1}
          />
          <rect x="412" y={y} width="28" height="7" rx="3.5" fill={C.barDim} />
        </g>
      ))}
    </WindowFrame>
  );
}

function Catalog() {
  const tiles = [
    { x: 20, y: 96 },
    { x: 176, y: 96 },
    { x: 332, y: 96 },
    { x: 20, y: 202 },
    { x: 176, y: 202 },
    { x: 332, y: 202 },
  ];

  return (
    <WindowFrame label="Vista previa del catálogo digital: buscador, filtros por categoría y tarjetas de producto">
      {/* Buscador */}
      <rect x="20" y="42" width="272" height="30" rx="8" fill={C.card} />
      <circle cx="40" cy="57" r="6" fill="none" stroke={C.bar} strokeWidth="2" />
      <rect x="52" y="54" width="86" height="6" rx="3" fill={C.barDim} />

      {/* Filtros */}
      {[
        { x: 304, label: 40, active: true },
        { x: 356, label: 44, active: false },
        { x: 412, label: 40, active: false },
      ].map((chip) => (
        <g key={chip.x}>
          <rect
            x={chip.x}
            y="42"
            width={chip.label + 16}
            height="30"
            rx="8"
            fill={chip.active ? C.cardAlt : C.card}
            stroke={chip.active ? C.acento : "none"}
            strokeOpacity="0.4"
          />
          <rect
            x={chip.x + 8}
            y="54"
            width={chip.label}
            height="6"
            rx="3"
            fill={chip.active ? C.acento : C.barDim}
            opacity={chip.active ? 0.85 : 1}
          />
        </g>
      ))}

      {/* Tarjetas de producto */}
      {tiles.map((tile, index) => (
        <g key={`${tile.x}-${tile.y}`}>
          <rect x={tile.x} y={tile.y} width="128" height="92" rx="9" fill={C.card} />
          <rect x={tile.x + 10} y={tile.y + 10} width="108" height="44" rx="6" fill={C.cardAlt} />
          <path
            d={`M${tile.x + 30} ${tile.y + 46}l16-16 14 14 10-9 18 15`}
            fill="none"
            stroke={C.bar}
            strokeWidth="2"
            opacity="0.8"
          />
          <rect x={tile.x + 10} y={tile.y + 62} width="62" height="6" rx="3" fill={C.bar} />
          <rect x={tile.x + 10} y={tile.y + 74} width="40" height="6" rx="3" fill={C.barDim} />
          <rect
            x={tile.x + 92}
            y={tile.y + 70}
            width="26"
            height="12"
            rx="6"
            fill={index % 3 === 0 ? C.acento : C.barDim}
            opacity={index % 3 === 0 ? 0.85 : 1}
          />
        </g>
      ))}
    </WindowFrame>
  );
}

function Medical() {
  const especialidades = [
    { x: 20, y: 260 },
    { x: 170, y: 260 },
    { x: 320, y: 260 },
    { x: 20, y: 330 },
    { x: 170, y: 330 },
    { x: 320, y: 330 },
  ];

  return (
    <WindowFrame label="Vista previa del sitio web médico: hero con foto de la doctora, especialidades y agenda de citas">
      {/* Hero section con foto */}
      <rect x="20" y="44" width="200" height="200" rx="14" fill={C.card} />
      <rect x="50" y="74" width="140" height="140" rx="70" fill={C.cardAlt} />
      <path
        d="M120 110c25 0 45 18 45 40s-20 40-45 40-45-18-45-40 20-40 45-40Z"
        fill="none"
        stroke="#D77BA4"
        strokeWidth="2.5"
        opacity="0.5"
      />
      <rect x="60" y="180" width="120" height="8" rx="4" fill={C.bar} />
      <rect x="60" y="194" width="80" height="6" rx="3" fill={C.barDim} />

      {/* Info principal */}
      <rect x="240" y="48" width="200" height="14" rx="7" fill={C.bar} />
      <rect x="240" y="70" width="140" height="8" rx="4" fill={C.barDim} />
      <rect x="240" y="86" width="180" height="8" rx="4" fill={C.barDim} opacity="0.6" />

      {/* Botón CTA WhatsApp */}
      <rect x="240" y="112" width="130" height="30" rx="8" fill="#D77BA4" opacity="0.9" />
      <rect x="254" y="122" width="70" height="7" rx="3.5" fill="#ffffff" opacity="0.85" />

      {/* Tarjetas de especialidades (grid 2x3) */}
      {especialidades.map((pos, index) => (
        <g key={index}>
          <rect x={pos.x} y={pos.y} width="136" height="56" rx="10" fill={C.card} />
          <circle cx={pos.x + 24} cy={pos.y + 28} r="12" fill="#D77BA4" opacity="0.15" />
          <rect x={pos.x + 48} y={pos.y + 14} width="70" height="8" rx="4" fill={C.bar} />
          <rect x={pos.x + 48} y={pos.y + 28} width="50" height="6" rx="3" fill={C.barDim} />
          <rect x={pos.x + 48} y={pos.y + 40} width="60" height="5" rx="2.5" fill={C.barDim} opacity="0.6" />
        </g>
      ))}

      {/* Footer con ubicación y contacto */}
      <rect x="20" y="410" width="440" height="60" rx="10" fill={C.card} opacity="0.5" />
      <rect x="40" y="420" width="80" height="8" rx="4" fill={C.bar} />
      <rect x="40" y="434" width="60" height="5" rx="2.5" fill={C.barDim} />
      <rect x="200" y="420" width="100" height="8" rx="4" fill={C.bar} />
      <rect x="200" y="434" width="80" height="5" rx="2.5" fill={C.barDim} />
      <rect x="360" y="420" width="60" height="8" rx="4" fill={C.bar} />
      <rect x="360" y="434" width="40" height="5" rx="2.5" fill={C.barDim} />
    </WindowFrame>
  );
}

function Ecommerce() {
  const productos = [
    { x: 20, y: 100 },
    { x: 176, y: 100 },
    { x: 332, y: 100 },
    { x: 20, y: 210 },
    { x: 176, y: 210 },
    { x: 332, y: 210 },
  ];

  return (
    <WindowFrame label="Vista previa de la tienda e-commerce: header, grid de productos, carrito y checkout responsive">
      {/* Header con logo, búsqueda y carrito */}
      <rect x="20" y="42" width="80" height="20" rx="4" fill={C.acento} opacity="0.9" />
      <rect x="180" y="46" width="180" height="26" rx="8" fill={C.card} />
      <circle cx="200" cy="59" r="6" fill="none" stroke={C.bar} strokeWidth="2" />
      <rect x="420" y="46" width="60" height="26" rx="8" fill={C.card} />
      <circle cx="436" cy="59" r="8" fill={C.barDim} />
      <circle cx="436" cy="59" r="3" fill={C.acento} opacity="0.8" />
      <rect x="452" y="54" width="6" height="6" rx="3" fill="#ff5f57" />

      {/* Hero / Banner promocional */}
      <rect x="20" y="80" width="440" height="80" rx="12" fill={C.card} />
      <rect x="40" y="100" width="120" height="10" rx="5" fill={C.bar} />
      <rect x="40" y="118" width="80" height="6" rx="3" fill={C.barDim} />
      <rect x="300" y="110" width="140" height="30" rx="8" fill={C.acento} opacity="0.9" />
      <rect x="314" y="120" width="80" height="7" rx="3.5" fill="#fff" opacity="0.85" />

      {/* Grid de productos (3x2) */}
      {productos.map((pos, index) => (
        <g key={index}>
          <rect x={pos.x} y={pos.y} width="128" height="96" rx="10" fill={C.card} />
          <rect x={pos.x + 10} y={pos.y + 10} width="108" height="60" rx="6" fill={C.cardAlt} />
          <path
            d={`M${pos.x + 30} ${pos.y + 40}l16-16 14 14 10-9 18 15`}
            fill="none"
            stroke={C.bar}
            strokeWidth="2"
            opacity="0.8"
          />
          <rect x={pos.x + 10} y={pos.y + 76} width="62" height="6" rx="3" fill={C.bar} />
          <rect x={pos.x + 10} y={pos.y + 88} width="40" height="5" rx="2.5" fill={C.barDim} />
          <rect
            x={pos.x + 92}
            y={pos.y + 84}
            width="26"
            height="12"
            rx="6"
            fill={index % 3 === 0 ? C.acento : C.barDim}
            opacity={index % 3 === 0 ? 0.85 : 1}
          />
        </g>
      ))}

      {/* Footer con paginación y info */}
      <rect x="20" y="330" width="440" height="50" rx="10" fill={C.card} opacity="0.5" />
      <rect x="200" y="340" width="60" height="10" rx="5" fill={C.bar} />
      <rect x="212" y="356" width="36" height="5" rx="2.5" fill={C.barDim} />
      <rect x="340" y="340" width="80" height="8" rx="4" fill={C.bar} />
      <rect x="340" y="356" width="50" height="5" rx="2.5" fill={C.barDim} />
    </WindowFrame>
  );
}

/**
 * Miniaturas de los proyectos.
 * Si el proyecto trae `imagen`, se muestra la captura real del sitio;
 * si no, se dibuja el mockup SVG de respaldo.
 */

export function ProjectThumbnail({ project, className = "" }) {
  if (project.imagen) {
    return (
      <div
        className={`overflow-hidden rounded-[12px] border border-line/80 bg-ink-deep ${className}`}
      >
        <img
          src={project.imagen}
          alt={project.imagenAlt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] w-full object-cover object-top"
        />
      </div>
    );
  }

  return <ProjectMockup variant={project.mockup} className={className} />;
}

export function ProjectMockup({ variant, className = "" }) {
  const content =
    variant === "inventory" ? (
      <Inventory />
    ) : variant === "catalog" ? (
      <Catalog />
    ) : variant === "medical" ? (
      <Medical />
    ) : variant === "ecommerce" ? (
      <Ecommerce />
    ) : (
      <Restaurant />
    );

  return (
    <div
      className={`overflow-hidden rounded-[12px] border border-line/80 bg-ink-deep ${className}`}
    >
      {content}
    </div>
  );
}
