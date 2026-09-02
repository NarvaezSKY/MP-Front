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

export interface HealthStatus {
  status: 'ok' | 'error';
  modelo: string;
  programasConHistoria: number;
  probabilidadBase: number;
}

export interface PredictionRequest {
  codigos: number[];
}
