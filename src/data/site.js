/**
 * Todo el contenido editable del sitio vive aquí.
 * Fuente: Plan_portafolio_Diego_Reyes.docx
 *
 * ⚠️ ANTES DE PUBLICAR (ver §12 del plan):
 *   1. Reemplaza los datos de CONTACTO por los reales.
 *   2. Quita las tecnologías que no domines de verdad.
 *   3. Los tres proyectos del portafolio son trabajos reales publicados; las
 *      capturas se toman de los sitios en producción.
 */

export const PROFILE = {
  nombre: "Diego Reyes",
  rol: "Desarrollo Web y Software",
  // §8 — Textos iniciales sugeridos
  titulo: "Tu idea, en un sitio web funcional.",
  descripcion:
    "Desarrollo páginas web y sistemas a medida para negocios y profesionales que quieren mejorar su presencia digital y trabajar de manera más eficiente.",
  presentacion:
    "Soy Diego Reyes, desarrollador de software enfocado en crear experiencias web y soluciones digitales funcionales. Me interesa transformar necesidades reales en productos claros, útiles y mantenibles, combinando interfaz, lógica de negocio y datos.",
  disponible: true,
};

/**
 * ⚠️ CONTACTO — datos de ejemplo. Sustitúyelos por los tuyos.
 */
export const CONTACT = {
  email: "diego.reyes.reb@gmail.com",
  // Solo dígitos, con lada de país. Ej. México: 5215512345678
  whatsapp: "524422312968",
  whatsappTexto: "+52 442 231 2968",
  linkedin: "https://www.linkedin.com/in/diego-reyes-52645437b/",
  github: "https://github.com/doppio-AI",
  ciudad: "Querétaro, México",
};

export const NAV_LINKS = [
  { id: "servicios", label: "Servicios" },
  { id: "precios", label: "Precios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "tecnologias", label: "Tecnologías" },
  { id: "contacto", label: "Contacto" },
];

/** §2 — Servicios y propuesta de valor (tabla del plan) */
export const SERVICES = [
  {
    id: "web",
    icon: "globe",
    titulo: "Páginas web",
    resumen:
      "Sitios para negocios y profesionales: información de servicios, ubicación, horarios y llamadas a la acción.",
    incluye: [
      "Diseño adaptado a móvil, tableta y escritorio",
      "Formulario de contacto y botón de WhatsApp",
      "SEO básico y vista previa para redes",
    ],
    desde: "Desde $2,500 MXN",
  },
  {
    id: "catalogo",
    icon: "cart",
    titulo: "Catálogos y comercio electrónico",
    resumen:
      "Catálogos de productos, consultas por WhatsApp y, cuando el alcance lo requiera, carrito y pagos.",
    incluye: [
      "Búsqueda y filtros por categoría",
      "Ficha de producto con fotos y precios",
      "Consultas directas por WhatsApp",
    ],
    desde: "Desde $1,200 MXN",
  },
  {
    id: "sistemas",
    icon: "gear",
    titulo: "Sistemas a medida",
    resumen:
      "Herramientas para inventario, registros, reportes, administración y automatización de procesos.",
    incluye: [
      "Base de datos y control de usuarios",
      "Reportes y exportación de información",
      "Automatización de tareas repetitivas",
    ],
    desde: "Desde $8,000 MXN",
  },
  {
    id: "mantenimiento",
    icon: "wrench",
    titulo: "Mantenimiento y mejoras",
    resumen:
      "Corrección de errores, actualización de contenido, ajustes visuales y nuevas funciones.",
    incluye: [
      "Corrección de errores y enlaces rotos",
      "Actualización de contenido y copias de seguridad",
      "Mejoras y nuevas funciones por etapas",
    ],
    desde: "$500–$1,200 MXN/mes",
  },
];

/** §3 — Precios iniciales orientativos */
export const PRICES = [
  { producto: "Landing page", rango: "$2,500–$3,500 MXN" },
  { producto: "Sitio web para negocio", rango: "$4,500–$7,000 MXN" },
  { producto: "Menú o catálogo digital", rango: "$1,200–$2,500 MXN" },
  { producto: "Sistema personalizado", rango: "Desde $8,000 MXN" },
  { producto: "Módulo o mejora adicional", rango: "Desde $1,500 MXN" },
  { producto: "Mantenimiento mensual", rango: "$500–$1,200 MXN/mes" },
];

export const PRICES_NOTE =
  "Los rangos son referencias para comenzar a cotizar, no tarifas oficiales. El costo final depende de funcionalidades, diseño, contenido, integraciones, tiempos y mantenimiento. Dominio, hosting, correo, pasarelas de pago y licencias se cotizan aparte cuando correspondan.";

/**
 * Ruta de los recursos dentro de `public/`, relativa a la base del build.
 * Con `base: "./"` funciona igual en la raíz de un dominio que en una
 * subruta de GitHub Pages (`/Diego/`).
 */
const media = (archivo) => `${import.meta.env.BASE_URL}proyectos/${archivo}`;

/** §9 — Proyectos reales entregados */
export const PROJECTS = [
  {
    id: "clinica-claudia",
    nombre: "Sitio Web Dra. Claudia Magally Ramírez García",
    tipo: "Proyecto profesional",
    mockup: "medical",
    imagen: media("dra-claudia-ramirez.jpg"),
    imagenAlt:
      "Captura de la portada del sitio de la Dra. Claudia Magally Ramírez García: titular «Tu salud es una prioridad» y credenciales médicas",
    categoria: "Página web médica",
    resumen:
      "Sitio web médico profesional y de alta conversión para especialista en Ginecología y Obstetricia. Diseñado para transmitir absoluta confianza, empatía y autoridad médica, con agendamiento integrado y credenciales verificadas.",
    problema:
      "La especialista carecía de presencia digital formal. Las pacientes no encontraban de forma clara sus credenciales oficiales, cédulas, ubicación exacta en Hospital Star Médica Querétaro ni un canal rápido para agendar consultas.",
    objetivo:
      "Construir una plataforma digital médica elegante, moderna y completamente responsive que potencie su marca personal, facilite el conocimiento de sus servicios y agilice el contacto directo de las pacientes.",
    funciones: [
      "Hero visual con fotografía profesional y eslogan institucional \"Tu salud es una prioridad\"",
      "Sección de perfil con cédulas profesionales y registro COFEPRIS totalmente transparentes",
      "Catálogo interactivo de 7 especialidades (control prenatal, colposcopía, menopausia, etc.)",
      "Sistema de solicitud de citas guiado en 4 pasos con derivación optimizada a WhatsApp",
      "Módulo de ubicación con referencia exacta en Hospital Star Médica y acceso directo a mapa",
      "Aviso de privacidad legal y cumplimiento normativo en manejo de datos de salud",
    ],
    decisiones: [
      "Paleta cromática exclusiva basada en rosa empolvado, lavanda y azul marino para reflejar feminidad profesional sin caer en estereotipos",
      "Tipografía clara combinando Poppins para titulares con autoridad y Lato para máxima legibilidad en párrafos",
      "Arquitectura mobile-first optimizada para pacientes que consultan desde smartphones",
      "Flujo de agenda sin falsas automatizaciones: prellenado inteligente que entrega una solicitud clara a la doctora",
    ],
    stack: ["React", "Vite", "TypeScript", "Tailwind CSS", "Motion", "React Router", "Lucide React"],
    retos:
      "Lograr un equilibrio perfecto entre la calidez humana que exige la ginecología y el rigor técnico-médico requerido por las regulaciones de salud en México.",
    aprendizajes:
      "Una web médica exitosa no depende de efectos visuales pesados, sino de claridad absoluta en las credenciales, honestidad en los canales de contacto y una experiencia móvil impecable.",
  },
  {
    id: "hera-lighting",
    nombre: "Hera Lighting — E-commerce & Storefront Optimizado",
    tipo: "Proyecto de ingeniería web",
    mockup: "ecommerce",
    imagen: media("hera-lighting.jpg"),
    imagenAlt:
      "Captura de la portada de Hera Lighting: titular «Tu evento suena, se ilumina y se monta con HERA» y accesos a catálogo y cotización",
    categoria: "E-commerce / Monorepo",
    demoUrl: "https://heralighting.vercel.app",
    resumen:
      "Tienda en línea de iluminación, audio, estructuras y pantallas LED para eventos: más de 1,800 productos con precio en MXN, paquetes de montaje llave en mano y cotización en menos de 2 horas hábiles.",
    problema:
      "La marca vendía por WhatsApp y catálogos en PDF: el cliente no encontraba precios ni fichas técnicas, el equipo perdía horas respondiendo lo mismo y, en el celular, el sitio se desbordaba y el menú quedaba inutilizable, justo donde llega la mayoría del tráfico.",
    objetivo:
      "Convertir el catálogo en un canal de venta 24/7 que sostenga la operación comercial: navegación impecable en cualquier dispositivo, precios y existencias claros, compra en línea y el montaje técnico como servicio adicional visible.",
    funciones: [
      "Catálogo de cuatro líneas (iluminación, sonido, estructuras y pantallas) con filtros, fichas técnicas descargables y precios en MXN con IVA incluido",
      "Etiquetas comerciales de oferta, más vendido y hecho a pedido para guiar la decisión de compra",
      "Carrito, checkout y seguimiento de pedido funcionales desde el móvil, sin perder el avance al cambiar de dispositivo",
      "Paquetes de renta y montaje completo con instalación en CDMX, Estado de México, Puebla y Querétaro",
      "Cotización en línea con respuesta comprometida en menos de 2 horas hábiles y envío gratis a partir de $5,000 MXN",
    ],
    decisiones: [
      "Navegación móvil rediseñada como panel táctil con búsqueda instantánea y acceso directo al carrito: el catálogo completo queda a un toque",
      "Sistema de diseño fluido con variables CSS y tipografía adaptable para que el precio y el botón de compra nunca se corten ni se encimen",
      "Tablas de carrito y checkout con vista de tarjeta en móvil, para que el total y el botón de pago se lean sin desplazamiento horizontal",
      "Componentes críticos de compra aislados y probados de extremo a extremo, de modo que ningún ajuste visual alterara la lógica del carrito",
    ],
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS 4", "Medusa JS", "PostgreSQL", "Supabase"],
    retos:
      "Sostener flujos transaccionales completos (catálogo, carrito, envío, pago y orden) mientras se corregía el layout en 18 anchos de pantalla distintos: cualquier ajuste visual podía romper la compra si no se aislaba bien.",
    aprendizajes:
      "En e-commerce, adaptarse a cada pantalla no es ocultar elementos: es reordenar la información para que el precio, la disponibilidad y el botón de compra sigan la misma jerarquía en un teléfono plegable que en un monitor ultrawide.",
  },
  {
    id: "jorima",
    nombre: "Jorima — Plataforma de bienestar laboral con IA",
    tipo: "Proyecto full-stack",
    mockup: "ecommerce",
    imagen: media("jorima.jpg"),
    imagenAlt:
      "Captura de Jorima: landing web con el asistente de bienestar y, a la derecha, la app móvil con la sección de Recursos",
    categoria: "SaaS + App móvil",
    demoUrl: "https://jorima-eight.vercel.app",
    resumen:
      "Plataforma de bienestar emocional para instituciones y personas: chat con IA disponible 24/7, check-in diario de estrés, evaluación PSS-10 y un panel que solo muestra los resultados que cada persona autoriza compartir. Web en Next.js y app móvil en React Native.",
    problema:
      "Detectar el desgaste emocional antes de que se vuelva rotación o crisis suele depender de encuestas que nadie contesta o de reportes que llegan tarde. Al mismo tiempo, cualquier solución de este tipo fracasa si el personal siente que la están vigilando.",
    objetivo:
      "Construir un producto doble —web para instituciones y app para el colaborador— que acompañe de verdad, mida sin castigar y deje el control de los datos en manos de cada persona mediante consentimientos separados.",
    funciones: [
      "Chat de bienestar con IA (Google Gemini) disponible a cualquier hora, con contención y sin juicios",
      "Check-in diario de estrés e interferencia de 0 a 10, con historial personal y tendencias",
      "Evaluación de estrés percibido PSS-10, separada del check-in y con su propia escala",
      "Panel institucional multi-institución: cada administrador ve solo a su propia organización",
      "Privacidad granular: evaluación, historial, personalización y compartir con administradores se autorizan por separado",
      "Pausas activas y juegos de relajación (respiración guiada, estiramientos, burbujas) dentro de la app",
      "App móvil en Expo para Android e iOS que consume la misma API del backend web",
      "Roles diferenciados de colaborador, administrador y superadministrador, con registro institucional y personal",
    ],
    decisiones: [
      "Un solo backend en Next.js Route Handlers sirviendo a la web y a la app móvil: menos superficie y un contrato único de datos",
      "Login con cifrado híbrido RSA + AES-256-CBC y contraseñas con bcrypt, sin códigos de verificación ni pasos extra que abandonen el registro",
      "Prisma + PostgreSQL sobre Supabase con modelos explícitos para conversaciones, check-ins, predicciones y agregados por institución",
      "Predicción de riesgo con TensorFlow.js a partir de los check-ins, siempre sobre datos agregados y nunca exponiendo conversaciones",
      "Diseño por consentimiento: la ausencia de permiso oculta el dato en el panel, en lugar de mostrarlo con una nota",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Google Gemini",
      "TensorFlow.js",
      "Expo / React Native",
    ],
    retos:
      "Sostener dos clientes (web y móvil) sobre un mismo backend mientras se separa con precisión la señal agregada del dato individual: el panel institucional tenía que ser útil para RR. HH. sin convertirse en una herramienta de vigilancia.",
    aprendizajes:
      "En productos de salud mental, la privacidad no es una casilla legal: es una decisión de arquitectura. Cuando el consentimiento se modela de forma granular desde la base de datos, la interfaz se vuelve honesta casi sin esfuerzo.",
  },
];

export const PROJECTS_NOTE =
  "Cada proyecto refleja soluciones reales a problemas comerciales y técnicos específicos, diseñados con enfoque en conversión, rendimiento y usabilidad.";

/** §10 — Tecnologías agrupadas (sin barras de porcentaje arbitrarias) */
export const TECH_GROUPS = [
  {
    titulo: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS", "Vite", "Next.js"],
  },
  {
    titulo: "Backend",
    items: ["Node.js", "Express", "APIs REST", "Autenticación básica", "Medusa JS"],
  },
  {
    titulo: "Bases de datos",
    items: ["PostgreSQL", "MySQL", "SQLite", "Supabase", "Modelado de datos"],
  },
  {
    titulo: "Herramientas",
    items: ["Git", "GitHub", "VS Code", "Postman", "Figma"],
  },
  {
    titulo: "Despliegue",
    items: ["Vercel", "Netlify", "GitHub Pages", "Hosting compartido"],
  },
];

/** §2 — Enfoque de trabajo */
export const APPROACH = [
  {
    titulo: "Claridad primero",
    texto:
      "Antes de escribir código, entiendo qué problema resuelve el sitio y qué debe lograr el visitante al entrar.",
  },
  {
    titulo: "Funciona en el celular",
    texto:
      "La mayoría de las visitas llegan desde el teléfono, así que la versión móvil se diseña primero y se prueba en pantallas reales.",
  },
  {
    titulo: "Fácil de mantener",
    texto:
      "Código ordenado, contenido separado del diseño y documentación breve para que otro pueda seguir trabajando después.",
  },
];

/** Canales de contacto directo (§7 — bloque de contacto) */
export const FORMAS_CONTACTO = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
    href: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
      "Hola Diego, vi tu portafolio y quiero cotizar un proyecto.",
    )}`,
    valor: "Respuesta el mismo día hábil",
  },
  {
    id: "email",
    label: "Correo",
    icon: "mail",
    href: `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      "Cotización de proyecto",
    )}`,
    valor: CONTACT.email,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "linkedin",
    href: CONTACT.linkedin,
    valor: "Perfil profesional",
  },
  {
    id: "github",
    label: "GitHub",
    icon: "github",
    href: CONTACT.github,
    valor: "Código y demos",
  },
];

export const PROJECT_TYPES = [
  "Página web",
  "Catálogo o tienda",
  "Sistema a medida",
  "Mantenimiento o mejora",
  "Todavía no lo sé",
];
