import { httpClient } from '@/shared/http/axios-client';
import type { ModelRepository } from '../../domain/ports';
import type {
  HealthStatus,
  Metricas,
  PredictionRequest,
  Programa,
  Top30Response,
} from '../../domain/entities';
import type {
  ApiHealth,
  ApiMetricas,
  ApiPredictRequest,
  ApiPredictResponse,
  ApiPrograma,
  ApiTop30,
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

  async getMetricas(): Promise<Metricas> {
    const { data } = await httpClient.get<ApiMetricas>('/metricas');
    return {
      programasConHistoria: data.programas_con_historia,
      probabilidadPromedio: data.probabilidad_promedio,
      probabilidadBase: data.probabilidad_base,
    };
  }

  async predict(request: PredictionRequest): Promise<Programa[]> {
    const body: ApiPredictRequest = { codigos: request.codigos };
    const { data } = await httpClient.post<ApiPredictResponse>('/predict', body);
    return data.resultados.map(mapPrograma);
  }
}
