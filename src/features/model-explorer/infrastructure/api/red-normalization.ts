const KEYS_CANONICOS: Record<string, string> = {
  'mecanica industrial': 'Mecánica Industrial',
  'actividad fisica recreacion y deporte': 'Actividad Física, Recreación y Deporte',
  'acuicola y de pesca': 'Acuícola y de Pesca',
  'agricola': 'Agrícola',
  'ambiental': 'Ambiental',
  'artes graficas': 'Artes Gráficas',
  'artesanias': 'Artesanías',
  'automotor': 'Automotor',
  'biotecnologia': 'Biotecnología',
  'comercio y ventas': 'Comercio y Ventas',
  'construccion': 'Construcción',
  'cuero calzado y marroquineria': 'Cuero, Calzado y Marroquinería',
  'cultura': 'Cultura',
  'electronica y automatizacion': 'Electrónica y Automatización',
  'energia electrica': 'Energía Eléctrica',
  'gestion administrativa y financiera': 'Gestión Administrativa y Financiera',
  'hoteleria y turismo': 'Hotelería y Turismo',
  'informatica diseno y desarrollo de software': 'Informática, Diseño y Desarrollo de Software',
  'infraestructura': 'Infraestructura',
  'logistica y gestion de la produccion': 'Logística y Gestión de la Producción',
  'materiales para la industria': 'Materiales para la Industria',
  'mineria': 'Minería',
  'pecuaria': 'Pecuaria',
  'quimica aplicada': 'Química Aplicada',
  'salud': 'Salud',
  'servicios personales': 'Servicios Personales',
  'sin red': 'Sin red',
  'telecomunicaciones': 'Telecomunicaciones',
  'textil confeccion diseno y moda': 'Textil, Confección, Diseño y Moda',
  'transporte': 'Transporte',
};

function redKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizarRed(value: string): string;
export function normalizarRed(value: null): null;
export function normalizarRed(value: string | null): string | null;
export function normalizarRed(value: string | null): string | null {
  if (!value) return value;
  const key = redKey(value);
  const canonico = KEYS_CANONICOS[key];
  return canonico ?? value.trim().replace(/\s+/g, ' ');
}