export type FuenteProbabilidad = 'prediccion_historica';

export interface Programa {
  codigoPrograma: number;
  prfDenominacion: string | null;
  nivel: string | null;
  redConocimiento: string | null;
  apuestasPrioritarias: string | null;
  centro: string | null;
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
