import { httpClient } from '@/shared/http/axios-client';
import type { ModelRepository } from '../../domain/ports';
import type {
  FichaOferta,
  HealthStatus,
  Metricas,
  PredictionRequest,
  Programa,
  ProgramasResponse,
  Top30Response,
  UltimaOfertaResponse,
} from '../../domain/entities';
import type {
  ApiFichaOferta,
  ApiHealth,
  ApiMetricas,
  ApiPredictRequest,
  ApiPredictResponse,
  ApiPrograma,
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
}
