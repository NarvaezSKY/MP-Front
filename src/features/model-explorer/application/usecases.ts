import type { ModelRepository } from '../domain/ports';
import type { HealthStatus, Metricas, PredictionRequest, ProgramasResponse, Top30Response, UltimaOfertaResponse } from '../domain/entities';

export const getHealth = (repo: ModelRepository): Promise<HealthStatus> => repo.getHealth();

export const getTop30 = (repo: ModelRepository): Promise<Top30Response> => repo.getTop30();

export const getPrograms = (
  repo: ModelRepository,
  modalidad?: string,
): Promise<ProgramasResponse> => repo.getPrograms(modalidad);

export const getMetricas = (repo: ModelRepository): Promise<Metricas> => repo.getMetricas();

export const getUltimaOferta = (repo: ModelRepository): Promise<UltimaOfertaResponse> =>
  repo.getUltimaOferta();

export const getMapa = (repo: ModelRepository): Promise<import('../domain/entities').MapaResponse> =>
  repo.getMapa();

export const getProgramaDetalle = (
  repo: ModelRepository,
  codigo: number,
  municipio?: string,
): Promise<import('../domain/entities').ProgramaDetalle> => repo.getProgramaDetalle(codigo, municipio);

export const getMunicipioProgramas = (
  repo: ModelRepository,
  municipio: string,
): Promise<import('../domain/entities').MunicipioProgramasResponse> =>
  repo.getMunicipioProgramas(municipio);

export const predictProgramas = (
  repo: ModelRepository,
  request: PredictionRequest,
): Promise<import('../domain/entities').Programa[]> => repo.predict(request);
