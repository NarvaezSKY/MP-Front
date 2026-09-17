export interface ApiPrograma {
  CODIGO_PROGRAMA: number;
  PRF_DENOMINACION: string | null;
  NIVEL: string | null;
  'Red de Conocimiento': string | null;
  'APUESTAS PRIORITARIAS': string | null;
  MODALIDAD: string | null;
  CENTRO: string | null;
  TIPO_RESPUESTA: string;
  MUNICIPIO: string | null;
  JORNADA: string | null;
  probabilidad_exito: number;
  fuente: 'prediccion_historica';
}

export interface ApiTop30 {
  total: number;
  centros: number;
  programas: ApiPrograma[];
}

export interface ApiProgramasResponse {
  total: number;
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

export interface ApiFichaOferta {
  cod_ficha: number;
  codigo_programa: number;
  denominacion: string;
  centro: string;
  municipio: string;
  nivel: string;
  jornada: string;
  estado: string;
  cupo: number;
  inscritos: number;
  ocupacion: number;
  probabilidad_exito: number | null;
}

export interface ApiUltimaOferta {
  archivo: string;
  total_fichas: number;
  publicadas: number;
  canceladas: number;
  con_probabilidad: number;
  ocupacion_promedio: number;
  fichas: ApiFichaOferta[];
}

export interface ApiMunicipioMapa {
  municipio: string;
  lat: number;
  lon: number;
  code: number;
  n_fichas: number;
  n_programas: number;
  prob_promedio: number;
  tasa_exito: number;
}

export interface ApiMapaResponse {
  total_municipios: number;
  municipios: ApiMunicipioMapa[];
}

export interface ApiProgramaMunicipio {
  CODIGO_PROGRAMA: number;
  PRF_DENOMINACION: string | null;
  CENTRO: string | null;
  TIPO_RESPUESTA: string;
  JORNADA: string | null;
  MUNICIPIO: string;
  n_fichas: number;
  tasa_exito: number;
  prob_modelo: number;
}

export interface ApiMunicipioProgramasResponse {
  total: number;
  municipio: string;
  programas: ApiProgramaMunicipio[];
}

export interface ApiDetalleMunicipio {
  municipio: string;
  lat: number;
  lon: number;
  code: number;
  n_fichas: number;
  tasa_exito: number;
  prob_promedio: number | null;
  prob_modelo: number | null;
}

export interface ApiDetalleJornada {
  jornada: string;
  n_fichas: number;
  tasa_exito: number;
}

export interface ApiDetalleModalidad {
  modalidad: string;
  n_fichas: number;
  tasa_exito: number;
  prob_modelo: number | null;
}

export interface ApiDetalleAnio {
  anio: number;
  n_fichas: number;
  ejecutadas: number;
  canceladas: number;
  tasa_exito: number;
  prom_inscritos: number;
  prom_matriculados: number;
  prom_certificados: number;
  prom_desertados: number;
}

export interface ApiDetalleFilaPrograma {
  centro: string;
  tipo_respuesta: string;
  probabilidad_exito: number | null;
  municipio: string;
  jornada: string;
  n_fichas?: number | null;
  tasa_exito?: number | null;
}

export interface ApiDetalleCentro {
  centro: string;
  n_fichas: number;
  tasa_exito: number;
  probabilidad_exito: number | null;
  n_tipos: number;
}

export interface ApiProgramaDetalle {
  codigo: number;
  denominacion: string;
  nivel: string;
  red_conocimiento: string;
  apuestas: string;
  probabilidad_general: number | null;
  n_fichas_total: number;
  mejor_jornada: ApiDetalleJornada | null;
  filas: ApiDetalleFilaPrograma[];
  por_municipio: ApiDetalleMunicipio[];
  por_jornada: ApiDetalleJornada[];
  por_modalidad: ApiDetalleModalidad[];
  mejor_modalidad: ApiDetalleModalidad | null;
  por_anio: ApiDetalleAnio[];
  por_centro?: ApiDetalleCentro[];
  municipio: string | null;
  centro?: string | null;
}
