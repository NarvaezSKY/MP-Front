export type FuenteProbabilidad = 'prediccion_historica';

export interface Programa {
  codigoPrograma: number;
  prfDenominacion: string | null;
  nivel: string | null;
  redConocimiento: string | null;
  apuestasPrioritarias: string | null;
  modalidad: string | null;
  centro: string | null;
  tipoRespuesta: string;
  municipio: string | null;
  jornada: string | null;
  probabilidadExito: number;
  fuente: FuenteProbabilidad;
}

export interface Top30Response {
  total: number;
  centros: number;
  programas: Programa[];
}

export interface ProgramasResponse {
  total: number;
  programas: Programa[];
}

export interface Metricas {
  programasConHistoria: number;
  probabilidadPromedio: number;
  probabilidadBase: number;
}

export interface FichaOferta {
  codFicha: number;
  codigoPrograma: number;
  denominacion: string;
  centro: string;
  municipio: string;
  nivel: string;
  jornada: string;
  estado: string;
  cupo: number;
  inscritos: number;
  ocupacion: number;
  probabilidadExito: number | null;
}

export interface UltimaOfertaResponse {
  archivo: string;
  totalFichas: number;
  publicadas: number;
  canceladas: number;
  conProbabilidad: number;
  ocupacionPromedio: number;
  fichas: FichaOferta[];
}

export interface HealthStatus {
  status: 'ok' | 'error';
  modelo: string;
  programasConHistoria: number;
  probabilidadBase: number;
}

export interface PredictionRequest {
  codigos: number[];
}

export interface MunicipioMapa {
  municipio: string;
  lat: number;
  lon: number;
  code: number;
  nFichas: number;
  nProgramas: number;
  probPromedio: number;
  tasaExito: number;
}

export interface MapaResponse {
  totalMunicipios: number;
  municipios: MunicipioMapa[];
}

export interface ProgramaMunicipio {
  codigoPrograma: number;
  prfDenominacion: string | null;
  centro: string | null;
  tipoRespuesta: string;
  jornada: string | null;
  municipio: string;
  nFichas: number;
  tasaExito: number;
  probModelo: number;
}

export interface MunicipioProgramasResponse {
  total: number;
  municipio: string;
  programas: ProgramaMunicipio[];
}

export interface DetalleMunicipio {
  municipio: string;
  lat: number;
  lon: number;
  code: number;
  nFichas: number;
  tasaExito: number;
  probPromedio: number | null;
  probModelo: number | null;
}

export interface DetalleJornada {
  jornada: string;
  nFichas: number;
  tasaExito: number;
}

export interface DetalleModalidad {
  modalidad: string;
  nFichas: number;
  tasaExito: number;
  probModelo: number | null;
}

export interface DetalleAnio {
  anio: number;
  nFichas: number;
  ejecutadas: number;
  canceladas: number;
  tasaExito: number;
}

export interface DetalleFilaPrograma {
  centro: string;
  tipoRespuesta: string;
  probabilidadExito: number | null;
  municipio: string;
  jornada: string;
  nFichas: number | null;
  tasaExito: number | null;
}

export interface DetalleCentro {
  centro: string;
  nFichas: number;
  tasaExito: number;
  probabilidadExito: number | null;
  nTipos: number;
}

export interface ProgramaDetalle {
  codigo: number;
  denominacion: string;
  nivel: string;
  redConocimiento: string;
  apuestas: string;
  probabilidadGeneral: number | null;
  nFichasTotal: number;
  mejorJornada: DetalleJornada | null;
  filas: DetalleFilaPrograma[];
  porMunicipio: DetalleMunicipio[];
  porJornada: DetalleJornada[];
  porModalidad: DetalleModalidad[];
  mejorModalidad: DetalleModalidad | null;
  porAnio: DetalleAnio[];
  porCentro: DetalleCentro[];
  municipio: string | null;
  centro: string | null;
}
