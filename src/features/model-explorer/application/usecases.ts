import type { ModelRepository } from '../domain/ports';
import type { HealthStatus, Metricas, PredictionRequest, Top30Response } from '../domain/entities';

export const getHealth = (repo: ModelRepository): Promise<HealthStatus> => repo.getHealth();

export const getTop30 = (repo: ModelRepository): Promise<Top30Response> => repo.getTop30();

export const getMetricas = (repo: ModelRepository): Promise<Metricas> => repo.getMetricas();

export const predictProgramas = (
  repo: ModelRepository,
  request: PredictionRequest,
): Promise<import('../domain/entities').Programa[]> => repo.predict(request);
