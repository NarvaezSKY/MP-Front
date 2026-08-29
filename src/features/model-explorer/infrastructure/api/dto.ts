export interface ApiPrograma {
  CODIGO_PROGRAMA: number;
  PRF_DENOMINACION: string | null;
  NIVEL: string | null;
  'Red de Conocimiento': string | null;
  'APUESTAS PRIORITARIAS': string | null;
  CENTRO: string | null;
  probabilidad_exito: number;
  fuente: 'prediccion_historica';
}

export interface ApiTop30 {
  total: number;
  centros: number;
  programas: ApiPrograma[];
}

export interface ApiMetricas {
  programas_con_historia: number;
  probabilidad_promedio: number;
  probabilidad_base: number;
}

export interface ApiHealth {
  status: 'ok' | 'error';
  modelo: string;
  programas_con_historia: number;
  probabilidad_base: number;
}

export interface ApiPredictResponse {
  resultados: ApiPrograma[];
}

export interface ApiPredictRequest {
  codigos: number[];
}
