import type {
  HealthStatus,
  Metricas,
  PredictionRequest,
  Programa,
  Top30Response,
} from './entities';

/**
 * Puerto de salida (driven port) del modelo predictivo.
 * La capa de aplicacion depende de esta interfaz, no de axios ni de la API.
 */
export interface ModelRepository {
  getHealth(): Promise<HealthStatus>;
  getTop30(): Promise<Top30Response>;
  getMetricas(): Promise<Metricas>;
  predict(request: PredictionRequest): Promise<Programa[]>;
}
