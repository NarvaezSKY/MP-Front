import { httpClient } from '@/shared/http/axios-client';
import type { ModelRepository } from '../../domain/ports';
import type {
  FichaOferta,
  HealthStatus,
  MapaResponse,
  Metricas,
  PredictionRequest,
  Programa,
  ProgramaDetalle,
  ProgramasResponse,
  Top30Response,
  UltimaOfertaResponse,
} from '../../domain/entities';
import type {
  ApiDetalleAnio,
  ApiDetalleJornada,
  ApiDetalleMunicipio,
  ApiFichaOferta,
  ApiHealth,
  ApiMapaResponse,
  ApiMetricas,
  ApiMunicipioMapa,
  ApiPredictRequest,
  ApiPredictResponse,
  ApiPrograma,
  ApiProgramaDetalle,
  ApiProgramasResponse,
  ApiTop30,
  ApiUltimaOferta,
} from './dto';

function mapPrograma(d: ApiPrograma): Programa {
  return {
    codigoPrograma: Number(d.CODIGO_PROGRAMA),
    prfDenominacion: d.PRF_DENOMINACION ?? null,
    nivel: d.NIVEL ?? null,
    redConocimiento: d['Red de Conocimiento'] ?? null,
    apuestasPrioritarias: d['APUESTAS PRIORITARIAS'] ?? null,
    centro: d.CENTRO ?? null,
    tipoRespuesta: d.TIPO_RESPUESTA,
    municipio: d.MUNICIPIO ?? null,
    jornada: d.JORNADA ?? null,
    probabilidadExito: Number(d.probabilidad_exito),
    fuente: d.fuente,
  };
}

function mapFicha(d: ApiFichaOferta): FichaOferta {
  return {
    codFicha: Number(d.cod_ficha),
    codigoPrograma: Number(d.codigo_programa),
    denominacion: d.denominacion,
    centro: d.centro,
    municipio: d.municipio,
    nivel: d.nivel,
    jornada: d.jornada,
    estado: d.estado,
    cupo: Number(d.cupo),
    inscritos: Number(d.inscritos),
    ocupacion: Number(d.ocupacion),
    probabilidadExito: d.probabilidad_exito === null ? null : Number(d.probabilidad_exito),
  };
}

function mapMunicipioMapa(d: ApiMunicipioMapa) {
  return {
    municipio: d.municipio,
    lat: Number(d.lat),
    lon: Number(d.lon),
    code: Number(d.code),
    nFichas: Number(d.n_fichas),
    nProgramas: Number(d.n_programas),
    probPromedio: Number(d.prob_promedio),
    tasaExito: Number(d.tasa_exito),
  };
}

function mapDetalleMunicipio(d: ApiDetalleMunicipio) {
  return {
    municipio: d.municipio,
    lat: Number(d.lat),
    lon: Number(d.lon),
    code: Number(d.code),
    nFichas: Number(d.n_fichas),
    tasaExito: Number(d.tasa_exito),
    probPromedio: d.prob_promedio === null ? null : Number(d.prob_promedio),
  };
}

function mapDetalleJornada(d: ApiDetalleJornada) {
  return {
    jornada: d.jornada,
    nFichas: Number(d.n_fichas),
    tasaExito: Number(d.tasa_exito),
  };
}

function mapDetalleAnio(d: ApiDetalleAnio) {
  return {
    anio: Number(d.anio),
    nFichas: Number(d.n_fichas),
    ejecutadas: Number(d.ejecutadas),
    canceladas: Number(d.canceladas),
    tasaExito: Number(d.tasa_exito),
  };
}

function mapProgramaDetalle(d: ApiProgramaDetalle): ProgramaDetalle {
  return {
    codigo: Number(d.codigo),
    denominacion: d.denominacion,
    nivel: d.nivel,
    redConocimiento: d.red_conocimiento,
    apuestas: d.apuestas,
    nFichasTotal: Number(d.n_fichas_total),
    mejorJornada: d.mejor_jornada === null ? null : mapDetalleJornada(d.mejor_jornada),
    filas: d.filas.map((f) => ({
      centro: f.centro,
      tipoRespuesta: f.tipo_respuesta,
      probabilidadExito: Number(f.probabilidad_exito),
      municipio: f.municipio,
      jornada: f.jornada,
    })),
    porMunicipio: d.por_municipio.map(mapDetalleMunicipio),
    porJornada: d.por_jornada.map(mapDetalleJornada),
    porAnio: d.por_anio.map(mapDetalleAnio),
  };
}

/**
 * Adaptador (driven adapter) que implementa el puerto ModelRepository
 * consumiendo la API REST mediante axios.
 */
export class ModelApiAdapter implements ModelRepository {
  async getHealth(): Promise<HealthStatus> {
    const { data } = await httpClient.get<ApiHealth>('/health');
    return {
      status: data.status,
      modelo: data.modelo,
      programasConHistoria: data.programas_con_historia,
      probabilidadBase: data.probabilidad_base,
    };
  }

  async getTop30(): Promise<Top30Response> {
    const { data } = await httpClient.get<ApiTop30>('/top30');
    return {
      total: data.total,
      centros: data.centros,
      programas: data.programas.map(mapPrograma),
    };
  }

  async getPrograms(): Promise<ProgramasResponse> {
    const { data } = await httpClient.get<ApiProgramasResponse>('/programs');
    return {
      total: data.total,
      programas: data.programas.map(mapPrograma),
    };
  }

  async getMetricas(): Promise<Metricas> {
    const { data } = await httpClient.get<ApiMetricas>('/metricas');
    return {
      programasConHistoria: data.programas_con_historia,
      probabilidadPromedio: data.probabilidad_promedio,
      probabilidadBase: data.probabilidad_base,
    };
  }

  async getUltimaOferta(): Promise<UltimaOfertaResponse> {
    const { data } = await httpClient.get<ApiUltimaOferta>('/ultima-oferta');
    return {
      archivo: data.archivo,
      totalFichas: data.total_fichas,
      publicadas: data.publicadas,
      canceladas: data.canceladas,
      conProbabilidad: data.con_probabilidad,
      ocupacionPromedio: data.ocupacion_promedio,
      fichas: data.fichas.map(mapFicha),
    };
  }

  async predict(request: PredictionRequest): Promise<Programa[]> {
    const body: ApiPredictRequest = { codigos: request.codigos };
    const { data } = await httpClient.post<ApiPredictResponse>('/predict', body);
    return data.resultados.map(mapPrograma);
  }

  async getMapa(): Promise<MapaResponse> {
    const { data } = await httpClient.get<ApiMapaResponse>('/mapa');
    return {
      totalMunicipios: data.total_municipios,
      municipios: data.municipios.map(mapMunicipioMapa),
    };
  }

  async getProgramaDetalle(codigo: number): Promise<ProgramaDetalle> {
    const { data } = await httpClient.get<ApiProgramaDetalle>(`/programa/${codigo}`);
    if ('error' in data) throw new Error((data as { error: string }).error);
    return mapProgramaDetalle(data);
  }
}
